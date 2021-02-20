import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, Tab, Tabs, Tip } from 'grommet';
import { AddCircle } from 'grommet-icons';

import VehicleForm from './VehicleForm';
import Spinner from '../Spinner';
import { ButtonWS, ParagraphWS } from '../../config/grommetConfig';
import SET_VEHICLE_COUNT, { SetVehicleCountData, SetVehicleCountVars } from '../../mutations/setVehicleCount';
import { CharacterCreationSteps } from '../../@types/enums';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';

const VehiclesFormContainer: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //

  const [activeTab, setActiveTab] = useState(0);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // --------------------------------------------------- Graphql hooks ----------------------------------------------------- //
  const [setVehicleCount, { loading: settingVehicleCount }] = useMutation<SetVehicleCountData, SetVehicleCountVars>(
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
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setBattleVehicle}`);
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
        <ParagraphWS>By default, the {decapitalize(character.playbook)} has no vehicles.</ParagraphWS>
        <ParagraphWS>If you’d like to start play with a vehicle, get with the MC.</ParagraphWS>
        <Box direction="row" gap="12px">
          <Box style={{ minHeight: 52 }}>
            <ButtonWS label="ADD VEHICLE" secondary onClick={() => handleAddVehicle()} />
          </Box>
          <Box style={{ minHeight: 52 }}>
            <ButtonWS
              label="PASS"
              primary
              onClick={() =>
                !!game && history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setBattleVehicle}`)
              }
            />
          </Box>
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
                <AddCircle
                  color="brand"
                  style={{ cursor: 'pointer' }}
                  onClick={() => !settingVehicleCount && handleAddVehicle()}
                />
              </Box>
            </Tip>
          )}
        </Tabs>
      </Box>
    );
  }
};

export default VehiclesFormContainer;
