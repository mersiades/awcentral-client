import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformMakeWantKnownMoveData {
  performMakeWantKnownMove: Game;
}

export interface PerformMakeWantKnownMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
  barter: number;
}

const PERFORM_MAKE_WANT_KNOWN_MOVE = gql`
  mutation PerformMakeWantKnownMove(
    $gameId: String!
    $gameroleId: String!
    $characterId: String!
    $moveId: String!
    $barter: Int!
  ) {
    performMakeWantKnownMove(
      gameId: $gameId
      gameroleId: $gameroleId
      characterId: $characterId
      moveId: $moveId
      barter: $barter
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
        rollModifier
        rollResult
        modifierStatName
        barterSpent
        currentBarter
      }
    }
  }
`;

export default PERFORM_MAKE_WANT_KNOWN_MOVE;
