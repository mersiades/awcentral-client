import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Button, CheckBox, Heading, Text } from 'grommet';
import { CaretDownFill, CaretUpFill, Edit, FormDown, FormUp } from 'grommet-icons';

import { StyledMarkdown } from '../styledComponents';
import PLAYBOOK, { PlaybookData, PlaybookVars } from '../../queries/playbook';
import { HarmInput } from '../../@types';
import { Character, CharacterHarm, HxStat } from '../../@types/dataInterfaces';
import { CharacterMove, Look } from '../../@types/staticDataInterfaces';
import { accentColors, brandColor, RedBox, TextWS } from '../../config/grommetConfig';
import { decapitalize } from '../../helpers/decapitalize';
import { Stats } from '../../@types/enums';
import StatsBox from './StatsBox';

interface CharacterSheetHeaderBoxProps {
  playbook: string;
  name: string;
  description?: string;
  looks: Look[];
  navigateToCharacterCreation: (step: number) => void;
}

const CharacterSheetHeaderBox: FC<CharacterSheetHeaderBoxProps> = ({
  name,
  playbook,
  description,
  looks,
  navigateToCharacterCreation,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const looksLooks = looks.map((look) => look.look);

  let looksString = looksLooks.join(', ');

  return (
    <Box fill="horizontal" align="center" justify="start">
      <Box fill="horizontal" direction="row" justify="between" align="center" pad={{ vertical: '12px' }}>
        <Box direction="row" align="center" gap="12px" pad={{ vertical: '12px' }}>
          {showDescription ? (
            <FormUp onClick={() => setShowDescription(false)} />
          ) : (
            <FormDown onClick={() => setShowDescription(true)} />
          )}
          <Box>
            <Heading level="2" margin="0px">{`${name + ' '}the ${playbook}`}</Heading>
            <Text>{looksString}</Text>
          </Box>
        </Box>
        <Edit color="accent-1" onClick={() => navigateToCharacterCreation(1)} style={{ cursor: 'pointer' }} />
      </Box>
      {showDescription && !!description && (
        <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <StyledMarkdown>{description}</StyledMarkdown>
        </Box>
      )}
    </Box>
  );
};

interface CharacterSheetMovesBoxProps {
  moves: CharacterMove[];
  navigateToCharacterCreation: (step: number) => void;
}

const CharacterSheetMovesBox: FC<CharacterSheetMovesBoxProps> = ({ moves, navigateToCharacterCreation }) => {
  const [showMove, setShowMove] = useState<string>('');
  return (
    <Box fill="horizontal" align="center" justify="start" pad={{ vertical: '12px' }}>
      <Box fill="horizontal" direction="row" align="center" justify="between" pad={{ vertical: '12px' }}>
        <Heading level="3" margin="0px" alignSelf="start">
          Moves
        </Heading>
        <Edit color="accent-1" onClick={() => navigateToCharacterCreation(7)} style={{ cursor: 'pointer' }} />
      </Box>
      {moves.map((move) => {
        return (
          <Box key={move.id} fill="horizontal">
            <Box fill="horizontal" direction="row" justify="between" align="center">
              <Box direction="row" justify="start" align="center" pad="12px" gap="12px">
                {showMove === move.id ? (
                  <FormUp onClick={() => setShowMove('')} />
                ) : (
                  <FormDown onClick={() => setShowMove(move.id)} />
                )}
                <Heading level="3" margin={{ top: '3px', bottom: '3px' }}>
                  {move.name}
                </Heading>
              </Box>
              {!!move.stat && <Button secondary label="ROLL" />}
            </Box>

            {showMove === move.id && (
              <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
                <StyledMarkdown>{move.description}</StyledMarkdown>
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
      <Box fill="horizontal" direction="row" justify="between" align="center" pad={{ vertical: '12px' }}>
        <Box direction="row" align="center" gap="12px" pad={{ vertical: '12px' }}>
          {showInstructions ? (
            <FormUp onClick={() => setShowInstructions(false)} />
          ) : (
            <FormDown onClick={() => setShowInstructions(true)} />
          )}
          <Heading level="3" margin="0px">
            Barter
          </Heading>
        </Box>
        <Box direction="row" align="center" gap="12px">
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
          <StyledMarkdown>{instructions}</StyledMarkdown>
        </Box>
      )}
    </Box>
  );
};

interface CharacterSheetGearProps {
  gear: string[];
  navigateToCharacterCreation: (step: number) => void;
}

const CharacterSheetGear: FC<CharacterSheetGearProps> = ({ gear, navigateToCharacterCreation }) => {
  return (
    <Box width="23vw" align="start" justify="start">
      <Box fill="horizontal" direction="row" align="center" justify="between" pad={{ vertical: '12px', left: '12px' }}>
        <Heading level="3" margin="0px">
          Gear
        </Heading>
        <Edit color="accent-1" onClick={() => navigateToCharacterCreation(5)} style={{ cursor: 'pointer' }} />
      </Box>
      <ul style={{ margin: 0, paddingInlineStart: '28px' }}>
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
    <Box width="23vw" align="start" justify="start" pad={{ vertical: '12px', right: '12px' }}>
      <Heading level="3" margin="0px">
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

interface CharacterSheetHarmProps {
  harm: CharacterHarm;
  settingHarm: boolean;
  handleSetHarm: (harm: HarmInput) => void;
}

const CharacterSheetHarm: FC<CharacterSheetHarmProps> = ({ harm, settingHarm, handleSetHarm }) => {
  const highlightColor = harm.isStabilized ? accentColors[0] : brandColor;
  const circle = {
    position: 'relative' as 'relative',
    height: '200px',
    width: '200px',
    overflow: 'hidden',
    borderRadius: '50%',
  };

  const sectorBase = {
    position: 'absolute' as 'absolute',
    left: '50%',
    bottom: '50%',
    height: '100%',
    width: '100%',
    transformOrigin: 'bottom left',
    borderColor: '#000',
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer',
  };

  const sector0 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 0 ? highlightColor : '#FFF',
      transform: 'rotate(0deg) skewY(0deg)',
    };
  };

  const sector1 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 1 ? highlightColor : '#FFF',
      transform: 'rotate(90deg) skewY(0deg)',
    };
  };

  const sector2 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 2 ? highlightColor : '#FFF',
      transform: 'rotate(180deg) skewY(0deg)',
    };
  };

  const sector3 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 3 ? highlightColor : '#FFF',
      transform: 'rotate(270deg) skewY(-60deg)',
    };
  };

  const sector4 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 4 ? highlightColor : '#FFF',
      transform: 'rotate(300deg) skewY(-60deg)',
    };
  };

  const sector5 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 5 ? highlightColor : '#FFF',
      transform: 'rotate(330deg) skewY(-60deg)',
    };
  };

  const oclockBase = {
    position: 'absolute' as 'absolute',
    padding: '3px',
    width: '30px',
    height: '30px',
  };

  const oclock12 = {
    ...oclockBase,
    top: 0,
    left: 'calc(50% - 15px)',
  };

  const oclock3 = {
    ...oclockBase,
    top: 'calc(50% - 15px)',
    right: 0,
  };

  const oclock6 = {
    ...oclockBase,
    bottom: -3,
    left: 'calc(50% - 15px)',
  };

  const oclock9 = {
    ...oclockBase,
    top: 'calc(50% -15px)',
    left: 0,
  };

  const setHarmValue = (sector: number) => {
    let newValue = harm.value;
    if (harm.value > sector) {
      newValue = sector;
    } else {
      newValue = sector + 1;
    }

    handleSetHarm({ ...harm, value: newValue });
  };

  return (
    <Box fill="horizontal" align="start" justify="start" pad={{ vertical: '12px', top: '12px' }}>
      <Heading level="3" margin="0px">
        Harm
      </Heading>
      <Box fill="horizontal" direction="row" justify="around">
        <Box align="center" justify="center" style={{ position: 'relative', width: '250px', height: '250px' }}>
          <Box style={oclock12} align="center" justify="center">
            <TextWS style={{ textAlign: 'center' }}>12</TextWS>
          </Box>
          <Box style={oclock3} align="center" justify="center">
            <TextWS>3</TextWS>
          </Box>
          <Box style={oclock6} align="center" justify="center">
            <TextWS>6</TextWS>
          </Box>
          <Box style={oclock9} align="center" justify="center">
            <TextWS>9</TextWS>
          </Box>

          <div style={circle}>
            <div style={sector0(harm.value)} onClick={() => !settingHarm && setHarmValue(0)} />
            <div style={sector1(harm.value)} onClick={() => !settingHarm && setHarmValue(1)} />
            <div style={sector2(harm.value)} onClick={() => !settingHarm && setHarmValue(2)} />
            <div style={sector3(harm.value)} onClick={() => !settingHarm && setHarmValue(3)} />
            <div style={sector4(harm.value)} onClick={() => !settingHarm && setHarmValue(4)} />
            <div style={sector5(harm.value)} onClick={() => !settingHarm && setHarmValue(5)} />
          </div>
        </Box>
        <Box flex="grow" pad="12px" gap="12px" justify="center">
          {(harm.isStabilized || harm.value > 1) && (
            <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
              <CheckBox
                label="Stabilized"
                checked={harm.isStabilized}
                onClick={() => handleSetHarm({ ...harm, isStabilized: !harm.isStabilized })}
                disabled={settingHarm}
              />
            </Box>
          )}

          {(harm.hasComeBackHard || harm.hasComeBackWeird || harm.hasChangedPlaybook || harm.hasDied || harm.value > 5) && (
            <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }} gap="12px">
              <TextWS>When life becomes untenable:</TextWS>
              <CheckBox
                label="Come back with -1hard"
                checked={harm.hasComeBackHard}
                onClick={() => handleSetHarm({ ...harm, hasComeBackHard: !harm.hasComeBackHard })}
                disabled={settingHarm}
              />
              <CheckBox
                label="Come back with +1weird (max+3)"
                checked={harm.hasComeBackWeird}
                onClick={() => handleSetHarm({ ...harm, hasComeBackWeird: !harm.hasComeBackWeird })}
                disabled={settingHarm}
              />
              <CheckBox
                label="Change to a new playbook"
                checked={harm.hasChangedPlaybook}
                onClick={() => handleSetHarm({ ...harm, hasChangedPlaybook: !harm.hasChangedPlaybook })}
                disabled={settingHarm}
              />
              <CheckBox
                label="die"
                checked={harm.hasDied}
                onClick={() => handleSetHarm({ ...harm, hasDied: !harm.hasDied })}
                disabled={settingHarm}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

interface CharacterSheetProps {
  character: Character;
  settingBarter: boolean;
  adjustingHx: boolean;
  settingHarm: boolean;
  togglingHighlight: boolean;
  handleSetBarter: (amount: number) => void;
  handleAdjustHx: (hxId: string, value: number) => void;
  handleSetHarm: (harm: HarmInput) => void;
  handleToggleHighlight: (stat: Stats) => void;
  navigateToCharacterCreation: (step: number) => void;
}

const CharacterSheet: FC<CharacterSheetProps> = ({
  character,
  adjustingHx,
  settingBarter,
  settingHarm,
  togglingHighlight,
  handleSetBarter,
  handleAdjustHx,
  handleSetHarm,
  handleToggleHighlight,
  navigateToCharacterCreation,
}) => {
  const { data } = useQuery<PlaybookData, PlaybookVars>(PLAYBOOK, { variables: { playbookType: character.playbook } });
  return (
    <Box direction="row" wrap pad="12px" overflow="auto">
      <CharacterSheetHeaderBox
        name={character.name ? character.name : ''}
        playbook={decapitalize(character.playbook)}
        description={data?.playbook.intro}
        looks={character.looks}
        navigateToCharacterCreation={navigateToCharacterCreation}
      />

      {character.statsBlock.stats.length > 0 && (
        <StatsBox
          stats={character.statsBlock.stats}
          togglingHighlight={togglingHighlight}
          navigateToCharacterCreation={navigateToCharacterCreation}
          handleToggleHighlight={handleToggleHighlight}
        />
      )}

      {character.characterMoves.length > 0 && (
        <CharacterSheetMovesBox moves={character.characterMoves} navigateToCharacterCreation={navigateToCharacterCreation} />
      )}

      <CharacterSheetHarm harm={character.harm} settingHarm={settingHarm} handleSetHarm={handleSetHarm} />

      {character.hxBlock.length > 0 && (
        <CharacterSheetHx hxStats={character.hxBlock} adjustingHx={adjustingHx} handleAdjustHx={handleAdjustHx} />
      )}

      <CharacterSheetGear gear={character.gear} navigateToCharacterCreation={navigateToCharacterCreation} />

      {!!character.barter && data?.playbook.barterInstructions && (
        <CharacterSheetBarterBox
          barter={character.barter}
          instructions={data?.playbook.barterInstructions}
          settingBarter={settingBarter}
          handleSetBarter={handleSetBarter}
        />
      )}
    </Box>
  );
};

export default CharacterSheet;
