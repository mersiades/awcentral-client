import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from 'grommet';

import PLAYBOOK, { PlaybookData, PlaybookVars } from '../../queries/playbook';
import { HarmInput } from '../../@types';
import { Character } from '../../@types/dataInterfaces';
import { decapitalize } from '../../helpers/decapitalize';
import { MoveKinds, Stats } from '../../@types/enums';
import StatsBox from './StatsBox';
import MovesBox from './MovesBox';
import NameAndLooksBox from './NameAndLooksBox';
import BarterBox from './BarterBox';
import GearBox from './GearBox';
import HxBox from './HxBox';
import HarmBox from './HarmBox';

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
  navigateToCharacterCreation: (step: string) => void;
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
    <Box data-testid="character-sheet" direction="row" wrap pad="12px" overflow="auto">
      <NameAndLooksBox
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
        <MovesBox
          moves={character.characterMoves}
          open
          moveCategory={MoveKinds.character}
          navigateToCharacterCreation={navigateToCharacterCreation}
        />
      )}

      <HarmBox harm={character.harm} settingHarm={settingHarm} handleSetHarm={handleSetHarm} />

      {character.hxBlock.length > 0 && (
        <HxBox
          hxStats={character.hxBlock}
          adjustingHx={adjustingHx}
          handleAdjustHx={handleAdjustHx}
          navigateToCharacterCreation={navigateToCharacterCreation}
        />
      )}

      <GearBox gear={character.gear} navigateToCharacterCreation={navigateToCharacterCreation} />

      {!!character.barter && data?.playbook.barterInstructions && (
        <BarterBox
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
