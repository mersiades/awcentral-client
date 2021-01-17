import React, { FC, useState } from 'react';
import { Box } from 'grommet';
import { FormUp, FormDown, Edit } from 'grommet-icons';

import { HeadingWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';

interface CollapsiblePanelBoxProps {
  title: string;
  children: JSX.Element;
  open?: boolean;
  navigateToCharacterCreation?: (step: string) => void;
  onEdit?: () => void;
  targetCreationStep?: string;
}

const CollapsiblePanelBox: FC<CollapsiblePanelBoxProps> = ({
  title,
  children,
  open,
  navigateToCharacterCreation,
  onEdit,
  targetCreationStep,
}) => {
  const [show, setShow] = useState(open);
  const { crustReady } = useFonts();

  const toggleShow = () => setShow(!show);
  return (
    <Box
      fill="horizontal"
      align="center"
      justify="start"
      pad={{ vertical: '12px' }}
      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}
    >
      <Box fill="horizontal" direction="row" align="center" justify="between" pad={{ vertical: '12px' }}>
        <HeadingWS
          crustReady={crustReady}
          level="3"
          margin="0px"
          alignSelf="start"
          onClick={toggleShow}
          style={{ cursor: 'pointer' }}
        >
          {title}
        </HeadingWS>
        <Box direction="row" align="center" gap="12px">
          {show ? (
            <FormUp data-testid={`${title.toLowerCase()}-up-chevron`} onClick={toggleShow} style={{ cursor: 'pointer' }} />
          ) : (
            <FormDown
              data-testid={`${title.toLowerCase()}-down-chevron`}
              onClick={toggleShow}
              style={{ cursor: 'pointer' }}
            />
          )}
          {!!navigateToCharacterCreation && targetCreationStep && (
            <Edit
              data-testid={`${title.toLowerCase()}-edit-link`}
              color="accent-1"
              onClick={() => navigateToCharacterCreation(targetCreationStep)}
              style={{ cursor: 'pointer' }}
            />
          )}
          {!!onEdit && (
            <Edit
              data-testid={`${title.toLowerCase()}-edit-link`}
              color="accent-1"
              onClick={onEdit}
              style={{ cursor: 'pointer' }}
            />
          )}
        </Box>
      </Box>
      {show && children}
    </Box>
  );
};

export default CollapsiblePanelBox;
