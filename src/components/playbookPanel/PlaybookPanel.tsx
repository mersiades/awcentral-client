import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from 'grommet';

import StatsBox from './StatsBox';
import MovesBox from './MovesBox';
import NameAndLooksBox from './NameAndLooksBox';
import BarterBox from './BarterBox';
import GearBox from './GearBox';
import HxBox from './HxBox';
import HarmBox from './HarmBox';
import AngelKitBox from './AngelKitBox';
import VehiclesBox from './VehiclesBox';
import GangBox from './GangBox';
import UniqueItemsBox from './UniqueItemsBox';
import HoldingBox from './HoldingBox';
import PLAYBOOK, { PlaybookData, PlaybookVars } from '../../queries/playbook';
import { MoveType, StatType } from '../../@types/enums';
import { HarmInput } from '../../@types';
import { Character } from '../../@types/dataInterfaces';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { decapitalize } from '../../helpers/decapitalize';
import FollowersBox from './FollowersBox';
import SkinnerGearBox from './SkinnerGearBox';
import BattleVehiclesBox from './BattleVehiclesBox';

interface PlaybookPanelProps {
  character: Character;
  settingBarter: boolean;
  adjustingHx: boolean;
  settingHarm: boolean;
  togglingHighlight: boolean;
  handleSetBarter: (amount: number) => void;
  handleAdjustHx: (hxId: string, value: number) => void;
  handleSetHarm: (harm: HarmInput) => void;
  handleToggleHighlight: (stat: StatType) => void;
  navigateToCharacterCreation: (step: string) => void;
  openDialog: (move: Move | CharacterMove) => void;
}

const PlaybookPanel: FC<PlaybookPanelProps> = ({
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
  openDialog,
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

      {!!character.statsBlock && character.statsBlock.stats.length > 0 && (
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
          moveCategory={MoveType.character}
          navigateToCharacterCreation={navigateToCharacterCreation}
          openDialog={openDialog}
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

      {data?.playbook.barterInstructions && (
        <BarterBox
          barter={character.barter || 0}
          instructions={data?.playbook.barterInstructions}
          settingBarter={settingBarter}
          handleSetBarter={handleSetBarter}
        />
      )}
      {!!character.playbookUnique?.angelKit && (
        <AngelKitBox
          angelKit={character.playbookUnique.angelKit}
          navigateToCharacterCreation={navigateToCharacterCreation}
          openDialog={openDialog}
        />
      )}
      {!!character.playbookUnique?.gang && (
        <GangBox navigateToCharacterCreation={navigateToCharacterCreation} openDialog={openDialog} />
      )}
      {!!character.playbookUnique?.holding && <HoldingBox navigateToCharacterCreation={navigateToCharacterCreation} />}
      {!!character.playbookUnique?.followers && <FollowersBox navigateToCharacterCreation={navigateToCharacterCreation} />}
      {!!character.playbookUnique?.skinnerGear && (
        <SkinnerGearBox navigateToCharacterCreation={navigateToCharacterCreation} />
      )}
      {!!character.playbookUnique?.weapons && (
        <UniqueItemsBox
          title="Weapons"
          items={character.playbookUnique.weapons.weapons}
          navigateToCharacterCreation={navigateToCharacterCreation}
        />
      )}
      {!!character.playbookUnique?.customWeapons && (
        <UniqueItemsBox
          title="Custom weapons"
          items={character.playbookUnique.customWeapons.weapons}
          navigateToCharacterCreation={navigateToCharacterCreation}
        />
      )}

      {!!character.playbookUnique?.brainerGear && (
        <UniqueItemsBox
          title="Brainer gear"
          items={character.playbookUnique.brainerGear.brainerGear.map((item) => item.substring(0, item.indexOf(')_') + 1))}
          navigateToCharacterCreation={navigateToCharacterCreation}
        />
      )}
      <VehiclesBox vehicles={character.vehicles} navigateToCharacterCreation={navigateToCharacterCreation} />
      <BattleVehiclesBox vehicles={character.battleVehicles} navigateToCharacterCreation={navigateToCharacterCreation} />
    </Box>
  );
};

export default PlaybookPanel;
