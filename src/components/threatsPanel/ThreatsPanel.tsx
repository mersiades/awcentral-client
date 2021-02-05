import { Box } from 'grommet';
import React, { useState } from 'react';
import { Threat } from '../../@types/dataInterfaces';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import ThreatBox from './ThreatBox';
import ThreatDialog from './ThreatDialog';

const ThreatsPanel = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [showThreatDialog, setShowThreatDialog] = useState<{ show: boolean; threat?: Threat }>({ show: false });
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { mcGameRole } = useGame();
  const { crustReady } = useFonts();

  const threats = mcGameRole?.threats;

  return (
    <Box fill="horizontal" direction="row" wrap pad="12px" overflow="auto">
      {showThreatDialog.show && (
        <ThreatDialog
          handleClose={() => setShowThreatDialog({ show: false, threat: undefined })}
          existingThreat={showThreatDialog.threat}
        />
      )}
      <Box
        fill="horizontal"
        direction="row"
        align="center"
        justify="between"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}
      >
        <HeadingWS crustReady={crustReady} level={3}>
          Threats
        </HeadingWS>
        <ButtonWS primary label="ADD" onClick={() => setShowThreatDialog({ show: true })} />
      </Box>
      {!!threats &&
        threats.length > 0 &&
        threats.map((threat) => (
          <Box key={threat.id} fill="horizontal" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
            <ThreatBox threat={threat} onEdit={() => setShowThreatDialog({ show: true, threat })} />
          </Box>
        ))}
    </Box>
  );
};

export default ThreatsPanel;
