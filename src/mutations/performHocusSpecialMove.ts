import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformHocusSpecialMoveData {
  performHocusSpecialMove: Game;
}

export interface PerformHocusSpecialMoveVars {
  gameId: string;
  gameroleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
}

const PERFORM_HOCUS_SPECIAL_MOVE = gql`
  mutation PerformHocusSpecialMove(
    $gameId: String!
    $gameroleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
  ) {
    performHocusSpecialMove(
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

export default PERFORM_HOCUS_SPECIAL_MOVE;
