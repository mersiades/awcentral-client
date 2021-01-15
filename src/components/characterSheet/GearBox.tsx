import React, { FC } from 'react';
import { Box } from 'grommet';

import CharacterSheetBox from './CharacterSheetBox';

interface GearBoxProps {
  gear: string[];
  navigateToCharacterCreation: (step: string) => void;
}

const GearBox: FC<GearBoxProps> = ({ gear, navigateToCharacterCreation }) => {
  return (
    <CharacterSheetBox open title="Gear" navigateToCharacterCreation={navigateToCharacterCreation} targetCreationStep="5">
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        <ul style={{ margin: 0, paddingInlineStart: '28px' }}>
          {gear.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Box>
    </CharacterSheetBox>
  );
};

export default GearBox;
