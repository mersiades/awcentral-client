import { Box } from 'grommet';
import React, { FC } from 'react';
import { Npc } from '../../@types/dataInterfaces';
import { ParagraphWS } from '../../config/grommetConfig';
import CollapsiblePanelBox from '../CollapsiblePanelBox';

interface NpcBoxProps {
  npc: Npc;
  onEdit: () => void;
}

const NpcBox: FC<NpcBoxProps> = ({ npc, onEdit }) => {
  return (
    <CollapsiblePanelBox title={npc.name} onEdit={onEdit}>
      <Box
        fill="horizontal"
        align="start"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        flex="grow"
      >
        <ParagraphWS>{!!npc.description && npc.description}</ParagraphWS>
      </Box>
    </CollapsiblePanelBox>
  );
};

export default NpcBox;
