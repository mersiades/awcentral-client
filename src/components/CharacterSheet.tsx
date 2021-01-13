import { useQuery } from '@apollo/client';
import { Box, Heading, Text } from 'grommet';
import { CaretDownFill, CaretUpFill, FormDown, FormUp } from 'grommet-icons';
import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Character, CharacterStat, HxStat } from '../@types/dataInterfaces';
import { CharacterMove, Look } from '../@types/staticDataInterfaces';
import { accentColors, RedBox } from '../config/grommetConfig';
import { decapitalize } from '../helpers/decapitalize';
import PLAYBOOK, { PlaybookData, PlaybookVars } from '../queries/playbook';

interface CharacterSheetHeaderBoxProps {
  playbook: string;
  name: string;
  description?: string;
  looks: Look[];
}

const CharacterSheetHeaderBox: FC<CharacterSheetHeaderBoxProps> = ({ name, playbook, description, looks }) => {
  const [showDescription, setShowDescription] = useState(false);

  const looksLooks = looks.map((look) => look.look);

  let looksString = looksLooks.join(', ');

  return (
    <Box fill="horizontal" align="center" justify="start">
      <Box fill="horizontal" direction="row" justify="between" align="center" pad="12px">
        <Box>
          <Heading level="2" margin={{ bottom: '3px' }}>{`${name + ' '}the ${playbook}`}</Heading>
          <Text>{looksString}</Text>
        </Box>
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
    <Box fill="horizontal" pad="12px">
      <Heading level="3" margin={{ bottom: '3px' }}>
        Stats
      </Heading>
      <Box fill="horizontal" direction="row" align="center" justify="around" pad="12px" gap="12px" wrap>
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
    </Box>
  );
};

interface CharacterSheetMovesBoxProps {
  moves: CharacterMove[];
}

const CharacterSheetMovesBox: FC<CharacterSheetMovesBoxProps> = ({ moves }) => {
  const [showMove, setShowMove] = useState<string>('');
  return (
    <Box fill="horizontal" align="center" justify="start" pad="12px">
      <Heading level="3" margin={{ bottom: '3px' }} alignSelf="start">
        Moves
      </Heading>
      {moves.map((move) => {
        return (
          <Box key={move.id} fill="horizontal">
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
          </Box>
        );
      })}
    </Box>
  );
};

interface CharacterSheetBarterBoxProps {
  barter: number;
  instructions: string;
  settingBarter: boolean;
  handleSetBarter: (amount: number) => void;
}

const CharacterSheetBarterBox: FC<CharacterSheetBarterBoxProps> = ({
  barter,
  instructions,
  handleSetBarter,
  settingBarter,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const increaseBarter = () => {
    handleSetBarter(barter + 1);
  };

  const decreaseBarter = () => {
    handleSetBarter(barter - 1);
  };

  return (
    <Box fill="horizontal" align="center" justify="start">
      <Box fill="horizontal" direction="row" justify="between" align="center" pad="12px">
        <Heading level="3">Barter</Heading>
        <Box direction="row" align="center" gap="12px">
          {showInstructions ? (
            <FormUp onClick={() => setShowInstructions(false)} />
          ) : (
            <FormDown onClick={() => setShowInstructions(true)} />
          )}
          <RedBox width="50px" align="center" margin={{ left: '12px' }}>
            <Heading level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
              {barter}
            </Heading>
          </RedBox>
          <Box align="center" justify="around">
            {settingBarter ? (
              <Box width="48px" height="80px" />
            ) : (
              <Box align="center" justify="around" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
                <CaretUpFill size="large" color="brand" onClick={increaseBarter} style={{ height: '40px' }} />
                <CaretDownFill size="large" color="brand" onClick={decreaseBarter} style={{ height: '40px' }} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {showInstructions && (
        <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <ReactMarkdown>{instructions}</ReactMarkdown>
        </Box>
      )}
    </Box>
  );
};

interface CharacterSheetGearProps {
  gear: string[];
}

const CharacterSheetGear: FC<CharacterSheetGearProps> = ({ gear }) => {
  return (
    <Box width="23vw" align="start" justify="start">
      <Heading level="3" margin={{ bottom: '3px' }}>
        Gear
      </Heading>
      <ul style={{ margin: 0, paddingInlineStart: '20px' }}>
        {gear.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Box>
  );
};

interface CharacterSheetHxProps {
  hxStats: HxStat[];
  adjustingHx: boolean;
  handleAdjustHx: (hxId: string, value: number) => void;
}

const CharacterSheetHx: FC<CharacterSheetHxProps> = ({ hxStats, adjustingHx, handleAdjustHx }) => {
  const increaseHx = (hxId: string, hxValue: number) => {
    handleAdjustHx(hxId, hxValue + 1);
  };

  const decreaseHx = (hxId: string, hxValue: number) => {
    handleAdjustHx(hxId, hxValue - 1);
  };

  return (
    <Box width="23vw" align="start" justify="start">
      <Heading level="3" margin={{ bottom: '3px' }}>
        Hx
      </Heading>

      {hxStats.map((stat) => (
        <Box fill="horizontal" key={stat.characterId}>
          <Box fill="horizontal" direction="row" justify="between" align="center">
            <Heading level="4" margin={{ vertical: '6px', left: '12px' }}>
              {stat.characterName}
            </Heading>
            <Box direction="row" align="center" gap="12px">
              <RedBox width="50px" align="center" margin={{ left: '12px' }}>
                <Heading level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
                  {stat.hxValue}
                </Heading>
              </RedBox>
              <Box align="center" justify="around">
                {adjustingHx ? (
                  <Box width="48px" height="80px" />
                ) : (
                  <Box
                    align="center"
                    justify="around"
                    animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
                  >
                    <CaretUpFill
                      size="large"
                      color="brand"
                      onClick={() => increaseHx(stat.characterId, stat.hxValue)}
                      style={{ height: '40px' }}
                    />
                    <CaretDownFill
                      size="large"
                      color="brand"
                      onClick={() => decreaseHx(stat.characterId, stat.hxValue)}
                      style={{ height: '40px' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

interface CharacterSheetProps {
  character: Character;
  settingBarter: boolean;
  adjustingHx: boolean;
  handleSetBarter: (amount: number) => void;
  handleAdjustHx: (hxId: string, value: number) => void;
}

const CharacterSheet: FC<CharacterSheetProps> = ({
  character,
  adjustingHx,
  settingBarter,
  handleSetBarter,
  handleAdjustHx,
}) => {
  const { data } = useQuery<PlaybookData, PlaybookVars>(PLAYBOOK, { variables: { playbookType: character.playbook } });
  return (
    <Box direction="row" wrap gap="12px" pad="12px" overflow="auto">
      <CharacterSheetHeaderBox
        name={character.name ? character.name : ''}
        playbook={decapitalize(character.playbook)}
        description={data?.playbook.intro}
        looks={character.looks}
      />
      {character.statsBlock.length > 0 && <CharacterSheetStatsBox stats={character.statsBlock} />}
      {character.characterMoves.length > 0 && <CharacterSheetMovesBox moves={character.characterMoves} />}
      {!!character.barter && data?.playbook.barterInstructions && (
        <CharacterSheetBarterBox
          barter={character.barter}
          instructions={data?.playbook.barterInstructions}
          settingBarter={settingBarter}
          handleSetBarter={handleSetBarter}
        />
      )}
      <CharacterSheetGear gear={character.gear} />
      {character.hxBlock.length > 0 && (
        <CharacterSheetHx hxStats={character.hxBlock} adjustingHx={adjustingHx} handleAdjustHx={handleAdjustHx} />
      )}
    </Box>
  );
};

export default CharacterSheet;
