import { Box } from 'grommet';
import React, { useState } from 'react';
import { Npc } from '../../@types/dataInterfaces';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import NpcBox from './NpcBox';
import NpcDialog from './NpcDialog';

const NpcsPanel = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [showNpcDialog, setShowNpcDialog] = useState<{ show: boolean; npc?: Npc }>({ show: false });
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { mcGameRole } = useGame();
  const { crustReady } = useFonts();

  const npcs = mcGameRole?.npcs;

  return (
    <Box fill="horizontal" direction="row" wrap pad="12px" overflow="auto">
      {showNpcDialog.show && (
        <NpcDialog handleClose={() => setShowNpcDialog({ show: false, npc: undefined })} existingNpc={showNpcDialog.npc} />
      )}
      <Box
        fill="horizontal"
        direction="row"
        align="center"
        justify="between"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}
      >
        <HeadingWS crustReady={crustReady} level={3}>
          NPCs
        </HeadingWS>
        <ButtonWS primary label="ADD" onClick={() => setShowNpcDialog({ show: true })} />
      </Box>
      {!!npcs &&
        npcs.length > 0 &&
        npcs.map((npc) => (
          <Box key={npc.id} fill="horizontal" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
            <NpcBox npc={npc} onEdit={() => setShowNpcDialog({ show: true, npc })} />
          </Box>
        ))}
    </Box>
  );
};

export default NpcsPanel;
