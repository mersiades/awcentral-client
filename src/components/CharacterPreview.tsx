import React, { FC } from 'react';
import { Box, Text } from 'grommet';

import HarmClock from './HarmClock';
import { Character } from '../@types/dataInterfaces';
import { decapitalize } from '../helpers/decapitalize';

interface CharacterPreviewProps {
  character: Character;
  isMc: boolean;
}

const CharacterPreview: FC<CharacterPreviewProps> = ({ character, isMc }) => {
  const highlightedStats = character.statsBlock?.stats
    .filter((stat) => stat.isHighlighted === true)
    .map((stat) => stat.stat)
    .join(', ');

  return (
    <Box direction="row" pad="12px" gap="12px">
      <Box align="start" justify="start">
        <Box direction="row" align="center" justify="start" gap="12px" fill="horizontal">
          <Box>
            <HarmClock
              harmValue={character.harm.value}
              isStabilized={character.harm.isStabilized}
              diameter={30}
              showNumbers={false}
              margin={10}
            />
          </Box>
          <Box>
            <Text style={{ width: '100%' }}>{`${character.name} the ${decapitalize(character.playbook)}`}</Text>
          </Box>
        </Box>
        <Box>
          <Text>
            <em>{character.looks.map((look) => look.look).join(', ')}</em>
          </Text>
        </Box>
      </Box>
      {isMc && (
        <Box justify="center" gap="12px">
          <Text>Highlighted stats: {highlightedStats}</Text>
          <Text>Barter: {character.barter}</Text>
        </Box>
      )}
    </Box>
  );
};

export default CharacterPreview;
