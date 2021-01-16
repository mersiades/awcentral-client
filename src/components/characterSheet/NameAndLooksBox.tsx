import React, { FC, useState } from 'react';
import { Box } from 'grommet';
import { FormUp, FormDown, Edit } from 'grommet-icons';

import { StyledMarkdown } from '../styledComponents';
import { HeadingWS, TextWS } from '../../config/grommetConfig';
import { Look } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';

interface NameAndLooksBoxProps {
  playbook: string;
  name: string;
  description?: string;
  looks: Look[];
  navigateToCharacterCreation: (step: string) => void;
}

const NameAndLooksBox: FC<NameAndLooksBoxProps> = ({ name, playbook, description, looks, navigateToCharacterCreation }) => {
  const [showDescription, setShowDescription] = useState(false);
  const { crustReady } = useFonts();

  const looksLooks = looks.map((look) => look.look);

  let looksString = looksLooks.join(', ');

  return (
    <Box fill="horizontal" align="center" justify="start" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}>
      <Box fill="horizontal" direction="row" justify="between" align="center" pad={{ vertical: '12px' }}>
        <Box justify="center" pad={{ vertical: '12px' }}>
          <HeadingWS crustReady={crustReady} level="2" margin="0px">{`${name + ' '}the ${playbook}`}</HeadingWS>
          <TextWS>{looksString}</TextWS>
        </Box>
        <Box direction="row" align="center" gap="12px">
          {showDescription ? (
            <FormUp onClick={() => setShowDescription(false)} />
          ) : (
            <FormDown onClick={() => setShowDescription(true)} />
          )}
          <Edit color="accent-1" onClick={() => navigateToCharacterCreation('1')} style={{ cursor: 'pointer' }} />
        </Box>
      </Box>
      {showDescription && !!description && (
        <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <StyledMarkdown>{description}</StyledMarkdown>
        </Box>
      )}
    </Box>
  );
};
export default NameAndLooksBox;
