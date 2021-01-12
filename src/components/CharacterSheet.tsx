import { useQuery } from '@apollo/client';
import { Box, Heading } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Character, CharacterStat } from '../@types/dataInterfaces';
import { CharacterMove } from '../@types/staticDataInterfaces';
import { accentColors, RedBox } from '../config/grommetConfig';
import { decapitalize } from '../helpers/decapitalize';
import PLAYBOOK, { PlaybookData, PlaybookVars } from '../queries/playbook';

interface CharacterSheetHeaderBoxProps {
  playbook: string;
  name: string;
  description?: string;
}

const CharacterSheetHeaderBox: FC<CharacterSheetHeaderBoxProps> = ({ name, playbook, description }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Box fill="horizontal" border={{ color: accentColors[0] }} align="center" justify="start" background="black">
      <Box fill="horizontal" direction="row" justify="between" align="center" pad="12px">
        <Heading level="2">{`${name + ' '}the ${playbook}`}</Heading>
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

interface CharacterSheetStatsBoxProps {
  stats: CharacterStat[];
}

const CharacterSheetStatsBox: FC<CharacterSheetStatsBoxProps> = ({ stats }) => {
  const statBoxStyle = (isHighlighted: boolean) => ({
    backgroundColor: isHighlighted ? accentColors[2] : '#000',
    cursor: 'pointer',
  });

  return (
    <Box
      fill="horizontal"
      direction="row"
      border={{ color: accentColors[0] }}
      align="center"
      justify="around"
      background="black"
      pad="12px"
      gap="12px"
    >
      {stats.map((stat) => {
        return (
          <RedBox key={stat.id} align="center" width="76px" style={statBoxStyle(stat.isHighlighted)}>
            <Heading level="2" margin={{ left: '6px', right: '6px', bottom: '3px', top: '9px' }}>
              {stat.value}
            </Heading>
            <Heading level="3" margin={{ left: '6px', right: '6px', bottom: '3px', top: '3px' }}>
              {stat.stat}
            </Heading>
          </RedBox>
        );
      })}
    </Box>
  );
};

interface CharacterSheetMovesBoxProps {
  moves: CharacterMove[];
}

const CharacterSheetMovesBox: FC<CharacterSheetMovesBoxProps> = ({ moves }) => {
  const [showMove, setShowMove] = useState<string>('');
  return (
    <Box fill="horizontal" border={{ color: accentColors[0] }} align="center" justify="start" background="black">
      {moves.map((move) => {
        return (
          <>
            <Box key={move.id} fill="horizontal" direction="row" justify="between" align="center" pad="12px">
              <Heading level="3" margin={{ top: '3px', bottom: '3px' }}>
                {move.name}
              </Heading>
              {showMove === move.id ? (
                <FormUp onClick={() => setShowMove('')} />
              ) : (
                <FormDown onClick={() => setShowMove(move.id)} />
              )}
            </Box>
            {showMove === move.id && (
              <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
                <ReactMarkdown>{move.description}</ReactMarkdown>
              </Box>
            )}
          </>
        );
      })}
    </Box>
  );
};

interface CharacterSheetProps {
  character: Character;
}

const CharacterSheet: FC<CharacterSheetProps> = ({ character }) => {
  const { data } = useQuery<PlaybookData, PlaybookVars>(PLAYBOOK, { variables: { playbookType: character.playbook } });
  return (
    <Box direction="row" wrap gap="12px" pad="12px" overflow="auto">
      <CharacterSheetHeaderBox
        name={character.name ? character.name : ''}
        playbook={decapitalize(character.playbook)}
        description={data?.playbook.intro}
      />
      {character.statsBlock.length > 0 && <CharacterSheetStatsBox stats={character.statsBlock} />}
      {character.characterMoves.length > 0 && <CharacterSheetMovesBox moves={character.characterMoves} />}
    </Box>
  );
};

export default CharacterSheet;
