import React, { FC } from 'react';
import { Box } from 'grommet';

import MovesBox from './playbookPanel/MovesBox';
import { MoveType } from '../@types/enums';
import { CharacterMove, Move } from '../@types/staticDataInterfaces';

interface MovesPanelProps {
  allMoves: Move[];
  openDialog?: (move: Move | CharacterMove) => void;
}

const MovesPanel: FC<MovesPanelProps> = ({ allMoves, openDialog }) => {
  const basicMoves = allMoves.filter((move) => move.kind === MoveType.basic);
  const peripheralMoves = allMoves.filter((move) => move.kind === MoveType.peripheral);
  const battleMoves = allMoves.filter((move) => move.kind === MoveType.battle);
  const roadWarMoves = allMoves.filter((move) => move.kind === MoveType.roadWar);

  return (
    <Box data-testid="moves-panel" direction="row" wrap pad="12px" overflow="auto">
      <MovesBox moves={basicMoves} moveCategory={MoveType.basic} openDialog={openDialog} />
      <MovesBox moves={peripheralMoves} moveCategory={MoveType.peripheral} openDialog={openDialog} />
      <MovesBox moves={battleMoves} moveCategory={MoveType.battle} openDialog={openDialog} />
      <MovesBox moves={roadWarMoves} moveCategory={MoveType.roadWar} openDialog={openDialog} />
    </Box>
  );
};

export default MovesPanel;
