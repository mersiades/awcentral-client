import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { useGame } from '../../contexts/gameContext';

interface SkinnerGearBoxProps {
  navigateToCharacterCreation: (step: string) => void;
}

const SkinnerGearBox: FC<SkinnerGearBoxProps> = ({ navigateToCharacterCreation }) => {
  const { character } = useGame();
  return (
    <CollapsiblePanelBox
      open
      title="Skinner gear"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        <ul style={{ margin: 0, paddingInlineStart: '28px' }}>
          {!!character?.playbookUnique?.skinnerGear && <li>{character.playbookUnique.skinnerGear.graciousWeapon.item}</li>}
          {!!character?.playbookUnique?.skinnerGear &&
            character.playbookUnique.skinnerGear.luxeGear.map((item) => (
              <li key={item.id}>
                {item.item}
                {!!item.note && (
                  <>
                    <br />
                    <ul style={{ listStyleType: 'none', paddingInlineStart: '15px', marginBottom: '3px' }}>
                      <li>
                        <em>{item.note}</em>
                      </li>
                    </ul>
                  </>
                )}
              </li>
            ))}
        </ul>
      </Box>
    </CollapsiblePanelBox>
  );
};

export default SkinnerGearBox;
