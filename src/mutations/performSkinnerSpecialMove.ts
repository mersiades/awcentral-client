import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformSkinnerSpecialMoveData {
  performSkinnerSpecialMove: Game;
}

export interface PerformSkinnerSpecialMoveVars {
  gameId: string;
  gameroleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
  plus1ForUser: boolean;
  plus1ForOther: boolean;
}

const PERFORM_SKINNER_SPECIAL_MOVE = gql`
  mutation PerformSkinnerSpecialMove(
    $gameId: String!
    $gameroleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
    $plus1ForUser: Boolean!
    $plus1ForOther: Boolean!
  ) {
    performSkinnerSpecialMove(
      gameId: $gameId
      gameroleId: $gameroleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
      plus1ForUser: $plus1ForUser
      plus1ForOther: $plus1ForOther
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

export default PERFORM_SKINNER_SPECIAL_MOVE;
