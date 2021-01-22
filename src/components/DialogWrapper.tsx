import React, { FC } from 'react';
import { Box, Layer } from 'grommet';
import { BackgroundType } from 'grommet/utils';

interface DialogWrapperProps {
  children: JSX.Element;
  background: BackgroundType;
  handleClose: () => void;
}

const DialogWrapper: FC<DialogWrapperProps> = ({ children, background, handleClose }) => {
  return (
    <Layer onEsc={handleClose} onClickOutside={handleClose}>
      <Box
        data-testid={`hx-roll-dialog`}
        direction="column"
        fill
        align="center"
        justify="center"
        pad="24px"
        gap="24px"
        border={{ color: 'brand' }}
        background={background}
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        style={{ boxShadow: '0 0 15px 1px #000, 0 0 20px 3px #000' }}
      >
        {children}
      </Box>
    </Layer>
  );
};

export default DialogWrapper;
