import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Tab, Tabs, Tip } from 'grommet';

import VehicleForm from '../VehicleForm';
import Spinner from '../../Spinner';
import { brandColor, ButtonWS, HeadingWS, TextWS } from '../../../config/grommetConfig';
import { CharacterCreationSteps } from '../../../@types/enums';
import { useGame } from '../../../contexts/gameContext';
import { useFonts } from '../../../contexts/fontContext';
import { decapitalize } from '../../../helpers/decapitalize';
import { Add, AddCircle } from 'grommet-icons';
import SET_VEHICLE_COUNT, { SetVehicleCountData, SetVehicleCountVars } from '../../../mutations/setVehicleCount';
import { useMutation } from '@apollo/client';

const VehiclesFormContainer: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //

  const [activeTab, setActiveTab] = useState(0);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // --------------------------------------------------- Graphql hooks ----------------------------------------------------- //
  const [setVehicleCount, { loading: settingMoves }] = useMutation<SetVehicleCountData, SetVehicleCountVars>(
    SET_VEHICLE_COUNT
  );

  // ------------------------------------------------- Component functions -------------------------------------------------- //

  const handleAddVehicle = async () => {
    if (!!userGameRole && !!character && !!game) {
      const vehicleCount = character.vehicleCount + 1;
      try {
        await setVehicleCount({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, vehicleCount },
          optimisticResponse: {
            __typename: 'Mutation',
            setVehicleCount: {
              __typename: 'Character',
              ...character,
              vehicleCount,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const navigateOnSet = (numVehicles: number) => {
    if (!character?.hasCompletedCharacterCreation && !!game) {
      if (character?.vehicleCount === numVehicles) {
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setHx}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        !!character && setActiveTab((prevTab) => (prevTab < character.vehicleCount ? prevTab + 1 : prevTab));
      }
    }
  };

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  if (!character) {
    return <Spinner />;
  }

  if (character.vehicleCount === 0) {
    // If a non-vehicle character makes it here accidentally, they can use the stepper to navigate away.
    // In future, may give the ability to add vehicles outside the rules
    return (
      <Box
        fill
        direction="column"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        pad="12px"
        align="center"
        justify="start"
      >
        <HeadingWS crustReady={crustReady} level={3}>
          No vehicles for {decapitalize(character.playbook)}
        </HeadingWS>
        <Box style={{ minHeight: 52 }}>
          <ButtonWS
            label="NEXT"
            primary
            onClick={() => !!game && history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setHx}`)}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        fill
        direction="column"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        pad="12px"
        align="center"
        justify="start"
      >
        <Tabs activeIndex={activeTab} onActive={(tab) => setActiveTab(tab)}>
          {/*
          // @ts-ignore */}
          {[...Array(character.vehicleCount).keys()].map((number) => (
            <Tab key={number} title={`Vehicle ${number + 1}`}>
              <VehicleForm navigateOnSet={navigateOnSet} existingVehicle={character.vehicles[number]} />
            </Tab>
          ))}
          {character.vehicleCount === character.vehicles.length && (
            <Tip content="Add another vehicle">
              <Box margin={{ horizontal: '24px' }} justify="center" align="center">
                <AddCircle color="brand" style={{ cursor: 'pointer' }} onClick={() => handleAddVehicle()} />
              </Box>
            </Tip>
          )}
        </Tabs>
      </Box>
    );
  }
};

export default VehiclesFormContainer;
