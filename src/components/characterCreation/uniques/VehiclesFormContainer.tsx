import React, { FC, useEffect, useState } from 'react';

import Spinner from '../../Spinner';
import { PlaybookUniqueCreator } from '../../../@types/staticDataInterfaces';
import { useGame } from '../../../contexts/gameContext';
import VehicleForm from './VehicleForm';
import { Tab, Tabs } from 'grommet';
import { PlaybookType } from '../../../@types/enums';
import { COLLECTOR } from '../../../config/constants';

const VehiclesFormContainer: FC = () => {
  const [numberVehiclesNeeded, setNumberVehiclesNeeded] = useState(0);
  const { character } = useGame();

  useEffect(() => {
    if (!!character && !!character.playbook) {
      const vehicles = character.playbookUnique?.vehicles;
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

  if (!character) {
    return <Spinner />;
  }

  if (numberVehiclesNeeded === 0) {
    // If a non-vehicle character makes it here accidentally, they can use the stepper to navigate away.
    // In future, may give the ability to add vehicles outside the rules
    return <div />;
  } else if (numberVehiclesNeeded === 1) {
    // Render a single VehicleForm
    return (
      <Tabs>
        <Tab key={character.playbookUnique?.vehicles[0].id} title="Vehicle 1">
          <VehicleForm vehicle={character.playbookUnique?.vehicles[0]} />
        </Tab>
      </Tabs>
    );
  } else {
    // tab form
    return (
      <Tabs>
        {/*
          // @ts-ignore */}
        {[...Array(numberVehiclesNeeded).keys()].map((number) => (
          <Tab key={number} title={`Vehicle ${number + 1}`}>
            <VehicleForm vehicle={character.playbookUnique?.vehicles[number]} />
          </Tab>
        ))}
      </Tabs>
    );
  }
};

export default VehiclesFormContainer;
