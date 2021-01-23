import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformSufferHarmMoveData {
  performSufferHarmMove: Game;
}

export interface PerformSufferHarmMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
  harm: number;
}

const PERFORM_SUFFER_HARM_MOVE = gql`
  mutation PerformSufferHarmMove(
    $gameId: String!
    $gameroleId: String!
    $characterId: String!
    $moveId: String!
    $harm: Int!
  ) {
    performSufferHarmMove(
      gameId: $gameId
      gameroleId: $gameroleId
      characterId: $characterId
      moveId: $moveId
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
        roll1
        roll2
        rollResult
        harmSuffered
        currentHarm
      }
    }
  }
`;

export default PERFORM_SUFFER_HARM_MOVE;
