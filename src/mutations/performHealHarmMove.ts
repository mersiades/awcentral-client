import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformHealHarmMoveData {
  performHealHarmMove: Game;
}

export interface PerformHealHarmMoveVars {
  gameId: string;
  gameroleId: string;
  otherGameroleId: string;
  characterId: string;
  otherCharacterId: string;
  harm: number;
}

const PERFORM_HEAL_HARM_MOVE = gql`
  mutation PerformHealHarmMove(
    $gameId: String!
    $gameroleId: String!
    $otherGameroleId: String!
    $characterId: String!
    $otherCharacterId: String!
    $harm: Int!
  ) {
    performHealHarmMove(
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

export default PERFORM_HEAL_HARM_MOVE;
