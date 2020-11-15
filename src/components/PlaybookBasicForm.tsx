import { Box } from 'grommet';
import React, { FC } from 'react';

const PlaybookBasicForm: FC = () => {
  return (
    <Box
      direction="column"
      height="100vh"
      width="100vw"
      background="black"
      style={{ position: 'absolute' }}
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      Put bits here
    </Box>
  );
};

export default PlaybookBasicForm;
