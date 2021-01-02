import { Box, Button } from 'grommet';
import React, { FC } from 'react';

interface ActionButtonsProps {
  value: string;
  primaryLabel: string | JSX.Element;
}

const ActionButtons: FC<ActionButtonsProps> = ({ value, primaryLabel }) => (
  <Box direction="row" justify="end" gap="24px">
    <Button type="reset" label="CLEAR" />
    <Button type="submit" primary label={primaryLabel} disabled={!value} />
  </Box>
);

export default ActionButtons;
