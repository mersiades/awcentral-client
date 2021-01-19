import React, { FC } from 'react';
import { Box } from 'grommet';
import { Move } from '../@types/staticDataInterfaces';
import { MoveType } from '../@types/enums';
import MovesBox from './playbookPanel/MovesBox';

interface MovesPanelProps {
  allMoves: Move[];
}

const MovesPanel: FC<MovesPanelProps> = ({ allMoves }) => {
  const basicMoves = allMoves.filter((move) => move.kind === MoveType.basic);
  const peripheralMoves = allMoves.filter((move) => move.kind === MoveType.peripheral);
  const battleMoves = allMoves.filter((move) => move.kind === MoveType.battle);
  const roadWarMoves = allMoves.filter((move) => move.kind === MoveType.roadWar);

  return (
    <Box data-testid="moves-panel" direction="row" wrap pad="12px" overflow="auto">
      <MovesBox moves={basicMoves} moveCategory={MoveType.basic} />
      <MovesBox moves={peripheralMoves} moveCategory={MoveType.peripheral} />
      <MovesBox moves={battleMoves} moveCategory={MoveType.battle} />
      <MovesBox moves={roadWarMoves} moveCategory={MoveType.roadWar} />
    </Box>
  );
};

export default MovesPanel;
