import React, { FC, useEffect, useState } from 'react';
import { Box, Tab, Tabs } from 'grommet';

import VehicleForm from './VehicleForm';
import Spinner from '../../Spinner';
import { CharacterCreationSteps, PlaybookType } from '../../../@types/enums';
import { useGame } from '../../../contexts/gameContext';
import { COLLECTOR } from '../../../config/constants';
import { useHistory } from 'react-router-dom';
import { ButtonWS, HeadingWS } from '../../../config/grommetConfig';
import { decapitalize } from '../../../helpers/decapitalize';
import { useFonts } from '../../../contexts/fontContext';

const VehiclesFormContainer: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [numberVehiclesNeeded, setNumberVehiclesNeeded] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const navigateOnSet = (numVehicles: number) => {
    if (!character?.hasCompletedCharacterCreation && !!game) {
      if (numberVehiclesNeeded === numVehicles) {
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setHx}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        setActiveTab((prevTab) => (prevTab < 2 ? prevTab + 1 : prevTab));
      }
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  useEffect(() => {
    if (!!character && !!character.playbook) {
      const vehicles = character.vehicles;
      if (character.playbook === PlaybookType.chopper) {
        !!vehicles && vehicles.length > 1 ? setNumberVehiclesNeeded(vehicles.length) : setNumberVehiclesNeeded(1);
      } else if (character.playbook === PlaybookType.driver) {
        const collectorMove = character.characterMoves.find((cm) => cm.name === COLLECTOR);
        if (!!collectorMove) {
          !!vehicles && vehicles.length > 3 ? setNumberVehiclesNeeded(vehicles.length) : setNumberVehiclesNeeded(3);
        } else {
          !!vehicles && vehicles.length > 1 ? setNumberVehiclesNeeded(vehicles.length) : setNumberVehiclesNeeded(1);
        }
      } else {
        !!vehicles && vehicles.length > 0 ? setNumberVehiclesNeeded(vehicles.length) : setNumberVehiclesNeeded(0);
      }
    }
  }, [character]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  if (!character) {
    return <Spinner />;
  }

  if (numberVehiclesNeeded === 0) {
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
  } else if (numberVehiclesNeeded === 1) {
    // Render a single VehicleForm
    return (
      <Box
        fill
        direction="column"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        pad="12px"
        align="center"
        justify="start"
      >
        <Tabs>
          <Tab title="Vehicle 1">
            <VehicleForm navigateOnSet={navigateOnSet} existingVehicle={character.vehicles[0]} />
          </Tab>
        </Tabs>
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
          {[...Array(numberVehiclesNeeded).keys()].map((number) => (
            <Tab key={number} title={`Vehicle ${number + 1}`}>
              <VehicleForm navigateOnSet={navigateOnSet} existingVehicle={character.vehicles[number]} />
            </Tab>
          ))}
        </Tabs>
      </Box>
    );
  }
};

export default VehiclesFormContainer;
