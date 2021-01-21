import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformStatRollMoveData {
  performRollMove: Game;
}

export interface PerformStatRollMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
}

const PERFORM_STAT_ROLL_MOVE = gql`
  mutation PerformStatRollMove($gameId: String!, $gameroleId: String!, $characterId: String!, $moveId: String!) {
    performStatRollMove(gameId: $gameId, gameroleId: $gameroleId, characterId: $characterId, moveId: $moveId) {
      id
      gameMessages {
        id
        gameId
        gameroleId
        messageType
        title
        content
        sentOn
        roll1
        roll2
        rollModifier
        rollResult
        modifierStatName
      }
    }
  }
`;

export default PERFORM_STAT_ROLL_MOVE;
