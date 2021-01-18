import { Layer, Box } from 'grommet';
import React, { FC } from 'react';
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
    <Layer onEsc={handleClose} onClickOutside={handleClose}>
      <Box
        data-testid={`${title.toLowerCase()}-warning-dialog`}
        direction="column"
        fill
        align="center"
        justify="center"
        pad="24px"
        gap="24px"
        border={{ color: 'brand' }}
        background={WarningDialogBackground}
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        style={{ boxShadow: '0 0 15px 1px #000, 0 0 20px 3px #000' }}
      >
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
    </Layer>
  );
};

export default WarningDialog;
