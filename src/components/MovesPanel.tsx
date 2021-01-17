import React, { FC } from 'react';
import { Box } from 'grommet';
import { Move } from '../@types/staticDataInterfaces';
import { MoveKinds } from '../@types/enums';
import MovesBox from './PlaybookPanel/MovesBox';

interface MovesPanelProps {
  allMoves: Move[];
}

const MovesPanel: FC<MovesPanelProps> = ({ allMoves }) => {
  const basicMoves = allMoves.filter((move) => move.kind === MoveKinds.basic);
  const peripheralMoves = allMoves.filter((move) => move.kind === MoveKinds.peripheral);
  const battleMoves = allMoves.filter((move) => move.kind === MoveKinds.battle);
  const roadWarMoves = allMoves.filter((move) => move.kind === MoveKinds.roadWar);

  return (
    <Box data-testid="moves-panel" direction="row" wrap pad="12px" overflow="auto">
      <MovesBox moves={basicMoves} moveCategory={MoveKinds.basic} />
      <MovesBox moves={peripheralMoves} moveCategory={MoveKinds.peripheral} />
      <MovesBox moves={battleMoves} moveCategory={MoveKinds.battle} />
      <MovesBox moves={roadWarMoves} moveCategory={MoveKinds.roadWar} />
    </Box>
  );
};

export default MovesPanel;
