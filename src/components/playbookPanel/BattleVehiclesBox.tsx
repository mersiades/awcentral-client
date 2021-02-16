import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { BattleVehicle } from '../../@types/dataInterfaces';
import { HeadingWS, TextWS } from '../../config/grommetConfig';
import SingleRedBox from '../SingleRedBox';

interface BattleVehiclesBoxProps {
  vehicles: BattleVehicle[];
  navigateToCharacterCreation: (step: string) => void;
}

const BattleVehiclesBox: FC<BattleVehiclesBoxProps> = ({ vehicles, navigateToCharacterCreation }) => {
  const renderVehicle = (vehicle: BattleVehicle) => {
    return (
      <Box
        key={vehicle.id}
        fill="horizontal"
        direction="row"
        align="center"
        justify="between"
        margin={{ bottom: '12px' }}
        wrap
      >
        <Box style={{ minWidth: '250px', maxWidth: 'calc(100% - 350px)' }} pad="12px">
          <HeadingWS level={5} margin={{ vertical: '3px' }}>
            {vehicle.name} ({vehicle.vehicleFrame.frameType.toLowerCase()})
          </HeadingWS>
          <TextWS>Tags: {vehicle.strengths.concat(vehicle.weaknesses).concat(vehicle.looks).join(', ')}</TextWS>
          <TextWS>Weapons: {vehicle.weapons.join(', ')}</TextWS>
        </Box>
        <Box direction="row" align="center" justify="around" gap="6px" pad="12px" width="350px">
          <SingleRedBox value={vehicle.speed.toString()} label="Speed" width="80px" />
          <SingleRedBox value={vehicle.handling.toString()} label="Handling" width="80px" />
          <SingleRedBox value={vehicle.armor.toString()} label="Armor" width="80px" />
          <SingleRedBox value={vehicle.massive.toString()} label="Massive" width="80px" />
        </Box>
      </Box>
    );
  };

  return (
    <CollapsiblePanelBox
      open
      title="Battle vehicles"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="9"
    >
      <>
        {vehicles.length > 0 && (
          <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
            {vehicles.map((vehicle) => renderVehicle(vehicle))}
          </Box>
        )}
      </>
    </CollapsiblePanelBox>
  );
};

export default BattleVehiclesBox;
