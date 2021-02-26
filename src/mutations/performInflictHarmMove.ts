import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformInflictHarmMoveData {
  performInflictHarmMove: Game;
}

export interface PerformInflictHarmMoveVars {
  gameId: string;
  gameRoleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
  harm: number;
}

const PERFORM_INFLICT_HARM_MOVE = gql`
  mutation PerformInflictHarmMove(
    $gameId: String!
    $gameRoleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
    $harm: Int!
  ) {
    performInflictHarmMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
      harm: $harm
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

export default PERFORM_INFLICT_HARM_MOVE;
