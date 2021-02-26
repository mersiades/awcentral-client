import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformGunluggerSpecialMoveData {
  performGunluggerSpecialMove: Game;
}

export interface PerformGunluggerSpecialMoveVars {
  gameId: string;
  gameRoleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
  addPlus1Forward: boolean;
}

const PERFORM_GUNLUGGER_SPECIAL_MOVE = gql`
  mutation PerformGunluggerSpecialMove(
    $gameId: String!
    $gameRoleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
    $addPlus1Forward: Boolean!
  ) {
    performGunluggerSpecialMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
      addPlus1Forward: $addPlus1Forward
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

export default PERFORM_GUNLUGGER_SPECIAL_MOVE;
