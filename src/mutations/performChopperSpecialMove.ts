import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformChopperSpecialMoveData {
  performChopperSpecialMove: Game;
}

export interface PerformChopperSpecialMoveVars {
  gameId: string;
  gameroleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
  hxChange: number;
}

const PERFORM_CHOPPER_SPECIAL_MOVE = gql`
  mutation PerformChopperSpecialMove(
    $gameId: String!
    $gameroleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
    $hxChange: Int!
  ) {
    performChopperSpecialMove(
      gameId: $gameId
      gameroleId: $gameroleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
      hxChange: $hxChange
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

export default PERFORM_CHOPPER_SPECIAL_MOVE;
