import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { Vehicle } from '../../@types/dataInterfaces';
import { HeadingWS, RedBox, TextWS } from '../../config/grommetConfig';
import { useFonts } from '../../contexts/fontContext';

interface VehiclesBoxProps {
  vehicles: Vehicle[];
  navigateToCharacterCreation: (step: string) => void;
}

const VehiclesBox: FC<VehiclesBoxProps> = ({ vehicles, navigateToCharacterCreation }) => {
  const { crustReady } = useFonts();
  const renderVehicle = (vehicle: Vehicle) => {
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
        <Box style={{ minWidth: '225px', maxWidth: '250px' }} pad="12px">
          <TextWS>Frame: {vehicle.vehicleFrame.frameType.toLowerCase()}</TextWS>
          <TextWS>{vehicle.vehicleFrame.examples}</TextWS>
          <TextWS>Tags: {vehicle.tags.join(', ')}</TextWS>
        </Box>
        <Box direction="row" align="center" justify="around" gap="12px" pad="12px" width="380px">
          <Box align="center" justify="between" width="80px" height="90px">
            <RedBox align="center" width="50px">
              <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
                {vehicle.speed}
              </HeadingWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Speed</TextWS>
          </Box>
          <Box align="center" justify="between" width="80px" height="90px">
            <RedBox align="center" width="50px">
              <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
                {vehicle.handling}
              </HeadingWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Handling</TextWS>
          </Box>
          <Box align="center" justify="between" width="80px" height="90px">
            <RedBox align="center" width="50px">
              <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
                {vehicle.massive}
              </HeadingWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Massive</TextWS>
          </Box>
          <Box align="center" justify="between" width="80px" height="90px">
            <RedBox align="center" width="50px">
              <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
                {vehicle.armor}
              </HeadingWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Armor</TextWS>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <CollapsiblePanelBox
      open
      title="Vehicles"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        {vehicles.map((vehicle) => renderVehicle(vehicle))}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default VehiclesBox;
