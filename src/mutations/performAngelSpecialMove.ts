import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformAngelSpecialMoveData {
  performAngelSpecialMove: Game;
}

export interface PerformAngelSpecialMoveVars {
  gameId: string;
  gameRoleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
}

const PERFORM_ANGEL_SPECIAL_MOVE = gql`
  mutation PerformAngelSpecialMove(
    $gameId: String!
    $gameRoleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
  ) {
    performAngelSpecialMove(
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

export default PERFORM_ANGEL_SPECIAL_MOVE;
