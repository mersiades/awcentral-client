import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, Tab, Tabs, Tip } from 'grommet';
import { AddCircle } from 'grommet-icons';

import VehicleForm from './VehicleForm';
import Spinner from '../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../config/grommetConfig';
import SET_VEHICLE_COUNT, { SetVehicleCountData, SetVehicleCountVars } from '../../mutations/setVehicleCount';
import { CharacterCreationSteps } from '../../@types/enums';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';
import { useFonts } from '../../contexts/fontContext';

const VehiclesFormContainer: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //

  const [activeTab, setActiveTab] = useState(0);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

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
    return (
      <Box
        data-testid="no-default-vehicle-message"
        fill
        pad="12px"
        align="center"
        justify="start"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        <Box width="85vw" align="center" style={{ maxWidth: '742px' }}>
          <Box direction="row" fill="horizontal" justify="between" align="center">
            <HeadingWS
              level={2}
              crustReady={crustReady}
              textAlign="center"
              style={{ maxWidth: 'unset', height: '34px', lineHeight: '44px' }}
            >
              VEHICLES
            </HeadingWS>
            <ButtonWS
              primary
              label="PASS"
              onClick={() =>
                !!game && history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setBattleVehicle}`)
              }
            />
          </Box>
          <ParagraphWS>By default, the {decapitalize(character.playbook)} has no vehicles.</ParagraphWS>
          <ParagraphWS>If you’d like to start play with a vehicle, get with the MC.</ParagraphWS>
          <ButtonWS label="ADD VEHICLE" secondary onClick={() => handleAddVehicle()} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        data-testid="vehicle-form-container"
        fill
        pad="12px"
        align="center"
        justify="start"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        <Box width="85vw" align="center" style={{ maxWidth: '741px' }}>
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
      </Box>
    );
  }
};

export default VehiclesFormContainer;
