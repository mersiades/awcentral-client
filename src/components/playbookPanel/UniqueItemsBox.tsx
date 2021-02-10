import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';

interface UniqueItemsBoxProps {
  items: string[];
  title: string;
  navigateToCharacterCreation: (step: string) => void;
}

const UniqueItemsBox: FC<UniqueItemsBoxProps> = ({ items, title, navigateToCharacterCreation }) => {
  return (
    <CollapsiblePanelBox open title={title} navigateToCharacterCreation={navigateToCharacterCreation} targetCreationStep="6">
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        <ul style={{ margin: 0, paddingInlineStart: '28px' }}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Box>
    </CollapsiblePanelBox>
  );
};

export default UniqueItemsBox;
