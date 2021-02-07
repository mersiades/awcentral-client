import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';

interface WeaponsBoxProps {
  weapons: string[];
  navigateToCharacterCreation: (step: string) => void;
}

const WeaponsBox: FC<WeaponsBoxProps> = ({ weapons, navigateToCharacterCreation }) => {
  return (
    <CollapsiblePanelBox
      open
      title="Weapons"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        <ul style={{ margin: 0, paddingInlineStart: '28px' }}>
          {weapons.map((weapon) => (
            <li key={weapon}>{weapon}</li>
          ))}
        </ul>
      </Box>
    </CollapsiblePanelBox>
  );
};

export default WeaponsBox;
