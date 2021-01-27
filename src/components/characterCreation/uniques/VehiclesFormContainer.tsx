import React, { FC } from 'react';

import Spinner from '../../Spinner';
import { PlaybookUniqueCreator } from '../../../@types/staticDataInterfaces';
import { useGame } from '../../../contexts/gameContext';
import VehicleForm from './VehicleForm';

interface VehiclesFormContainerProps {
  // settingVehicle: boolean;
  playbookUniqueCreator: PlaybookUniqueCreator;
  // handleSubmitCustomWeapons: (weapons: string[]) => void;
}

const VehiclesFormContainer: FC<VehiclesFormContainerProps> = ({
  // settingVehicle,
  playbookUniqueCreator,
  // handleSubmitCustomWeapons,
}) => {
  const { character } = useGame();

  console.log('character', character);

  if (!character) {
    return <Spinner />;
  }

  if (character.vehicleCount === 0) {
    // If a non-vehicle character makes it here accidentally, they can use the stepper to navigate away.
    return <div />;
  } else if (character.vehicleCount === 1) {
    // Render a single VehicleForm
    return <VehicleForm vehicle={character.playbookUnique?.vehicles[0]} />;
  } else {
    // tab form
    return <div>Mutliple vehicles dealt with later</div>;
  }
};

export default VehiclesFormContainer;
