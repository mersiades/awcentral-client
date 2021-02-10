import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformWealthMoveData {
  performWealthMove: Game;
}

export interface PerformWealthMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
}

const PERFORM_WEALTH_MOVE = gql`
  mutation PerformWealthMove($gameId: String!, $gameroleId: String!, $characterId: String!) {
    performWealthMove(gameId: $gameId, gameroleId: $gameroleId, characterId: $characterId) {
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

export default PERFORM_WEALTH_MOVE;
