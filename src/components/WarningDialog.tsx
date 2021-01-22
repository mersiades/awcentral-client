import React, { FC } from 'react';
import { Box } from 'grommet';

import DialogWrapper from './DialogWrapper';
import { WarningDialogBackground, HeadingWS, ButtonWS, ParagraphWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';

interface WarningDialogProps {
  title: string;
  buttonTitle: string;
  text: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

const WarningDialog: FC<WarningDialogProps> = ({ title, buttonTitle, text, handleClose, handleConfirm }) => {
  const { crustReady } = useFonts();
  return (
    <DialogWrapper background={WarningDialogBackground} handleClose={handleClose}>
      <Box data-testid={`${title.toLowerCase()}-warning-dialog`} gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {title}
        </HeadingWS>
        <ParagraphWS>{text}</ParagraphWS>
        <Box fill="horizontal" direction="row" justify="end" gap="small">
          <ButtonWS
            label="CANCEL"
            style={{
              background: 'transparent',
              textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000',
            }}
            onClick={handleClose}
          />
          <ButtonWS label={buttonTitle.toUpperCase()} primary onClick={handleConfirm} />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default WarningDialog;
