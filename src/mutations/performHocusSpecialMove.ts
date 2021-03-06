import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformHocusSpecialMoveData {
  performHocusSpecialMove: Game;
}

export interface PerformHocusSpecialMoveVars {
  gameId: string;
  gameRoleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
}

const PERFORM_HOCUS_SPECIAL_MOVE = gql`
  mutation PerformHocusSpecialMove(
    $gameId: String!
    $gameRoleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
  ) {
    performHocusSpecialMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
    ) {
      id
      gameMessages {
        id
        gameId
        gameRoleId
        messageType
        title
        content
        sentOn
      }
    }
  }
`;

export default PERFORM_HOCUS_SPECIAL_MOVE;
