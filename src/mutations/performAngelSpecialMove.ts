import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformAngelSpecialMoveData {
  performAngelSpecialMove: Game;
}

export interface PerformAngelSpecialMoveVars {
  gameId: string;
  gameroleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
}

const PERFORM_ANGEL_SPECIAL_MOVE = gql`
  mutation PerformAngelSpecialMove(
    $gameId: String!
    $gameroleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
  ) {
    performAngelSpecialMove(
      gameId: $gameId
      gameroleId: $gameroleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
    ) {
      id
      gameMessages {
        id
        gameId
        gameroleId
        messageType
        title
        content
        sentOn
      }
    }
  }
`;

export default PERFORM_ANGEL_SPECIAL_MOVE;
