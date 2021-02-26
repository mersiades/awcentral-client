import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformChopperSpecialMoveData {
  performChopperSpecialMove: Game;
}

export interface PerformChopperSpecialMoveVars {
  gameId: string;
  gameRoleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
  hxChange: number;
}

const PERFORM_CHOPPER_SPECIAL_MOVE = gql`
  mutation PerformChopperSpecialMove(
    $gameId: String!
    $gameRoleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
    $hxChange: Int!
  ) {
    performChopperSpecialMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
      hxChange: $hxChange
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

export default PERFORM_CHOPPER_SPECIAL_MOVE;
