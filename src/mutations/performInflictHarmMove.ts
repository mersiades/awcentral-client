import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformInflictHarmMoveData {
  performInflictHarmMove: Game;
}

export interface PerformInflictHarmMoveVars {
  gameId: string;
  gameroleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
  harm: number;
}

const PERFORM_INFLICT_HARM_MOVE = gql`
  mutation PerformInflictHarmMove(
    $gameId: String!
    $gameroleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
    $harm: Int!
  ) {
    performInflictHarmMove(
      gameId: $gameId
      gameroleId: $gameroleId
      otherGameroleId: $otherGameroleId
      characterId: $characterId
      otherCharacterId: $otherCharacterId
      harm: $harm
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

export default PERFORM_INFLICT_HARM_MOVE;
