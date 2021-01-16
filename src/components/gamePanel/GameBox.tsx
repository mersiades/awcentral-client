import React, { FC } from 'react';
import { Box } from 'grommet';
import { Copy } from 'grommet-icons';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { ButtonWS, TextWS } from '../../config/grommetConfig';
import { useGame } from '../../contexts/gameContext';
import { copyToClipboard } from '../../helpers/copyToClipboard';

interface GameBoxProps {
  setShowCommsForm: (show: boolean) => void;
  setShowDeleteGameDialog: (show: boolean) => void;
}

const GameBox: FC<GameBoxProps> = ({ setShowCommsForm, setShowDeleteGameDialog }) => {
  const { game } = useGame();

  const renderComms = () => {
    if (!!game?.commsUrl) {
      if (!!game.commsApp) {
        return (
          <Box>
            <TextWS>{`Also play on ${game.commsApp}`}</TextWS>
            <TextWS truncate>{`at ${game.commsUrl}`}</TextWS>
          </Box>
        );
      } else {
        return (
          <Box>
            <TextWS>{`Also play at:`}</TextWS>
            <TextWS truncate>{game.commsUrl}</TextWS>
          </Box>
        );
      }
    } else if (!!game?.commsApp) {
      return (
        <Box>
          <TextWS>{`Also play on ${game.commsApp}`}</TextWS>
        </Box>
      );
    }
  };
  return (
    <CollapsiblePanelBox title={!!game ? game.name : 'Game'} onEdit={() => setShowCommsForm(true)}>
      <Box
        fill="horizontal"
        justify="start"
        align="start"
        gap="12px"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        <Box direction="row" align="center" gap="12px">
          {renderComms()}
          {game?.commsUrl && <Copy color="accent-1" onClick={() => copyToClipboard(game.commsUrl)} cursor="pointer" />}
        </Box>
        <ButtonWS
          label="DELETE GAME"
          secondary
          size="large"
          alignSelf="center"
          fill="horizontal"
          onClick={() => setShowDeleteGameDialog(true)}
        />
      </Box>
    </CollapsiblePanelBox>
  );
};

export default GameBox;
