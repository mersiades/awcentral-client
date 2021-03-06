import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformWealthMoveData {
  performWealthMove: Game;
}

export interface PerformWealthMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
}

const PERFORM_WEALTH_MOVE = gql`
  mutation PerformWealthMove($gameId: String!, $gameRoleId: String!, $characterId: String!) {
    performWealthMove(gameId: $gameId, gameRoleId: $gameRoleId, characterId: $characterId) {
      id
      gameMessages {
        id
        gameId
        gameRoleId
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
