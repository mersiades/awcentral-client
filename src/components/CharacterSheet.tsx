import { useQuery } from '@apollo/client';
import { Box, Heading } from 'grommet';
import { FormDown, FormUp, More } from 'grommet-icons';
import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Character } from '../@types/dataInterfaces';
import { PlayBooks } from '../@types/enums';
import { accentColors } from '../config/grommetConfig';
import { decapitalize } from '../helpers/decapitalize';
import PLAYBOOK, { PlaybookData, PlaybookVars } from '../queries/playbook';

interface CharacterSheetProps {
  character: Character;
}

interface CharacterSheetNameProps {
  playbook: string;
  name: string;
  description?: string;
}

const CharacterSheetName: FC<CharacterSheetNameProps> = ({ name, playbook, description }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Box fill border={{ color: accentColors[0] }} align="center" justify="start">
      <Box fill="horizontal" direction="row" justify="between" align="center" pad="12px">
        <Heading level="4">{`${name + ' '}The ${playbook}`}</Heading>
        {showDescription ? (
          <FormUp onClick={() => setShowDescription(false)} />
        ) : (
          <FormDown onClick={() => setShowDescription(true)} />
        )}
      </Box>
      {showDescription && !!description && (
        <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <ReactMarkdown>{description}</ReactMarkdown>
        </Box>
      )}
    </Box>
  );
};

const CharacterSheet: FC<CharacterSheetProps> = ({ character }) => {
  const { data } = useQuery<PlaybookData, PlaybookVars>(PLAYBOOK, { variables: { playbookType: character.playbook } });
  return (
    <Box direction="row" wrap gap="12px" pad="12px">
      <CharacterSheetName
        name={character.name ? character.name : ''}
        playbook={decapitalize(character.playbook)}
        description={data?.playbook.intro}
      />
    </Box>
  );
};

export default CharacterSheet;
