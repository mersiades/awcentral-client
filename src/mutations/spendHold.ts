import { gql } from '@apollo/client';
import { HoldInput } from '../@types';
import { Game } from '../@types/dataInterfaces';
import { characterFragments } from '../queries/game';

export interface SpendHoldData {
  spendHold: Game;
}

export interface SpendHoldVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  hold: HoldInput;
}

const SPEND_HOLD = gql`
  mutation SpendHold($gameId: String!, $gameRoleId: String!, $characterId: String!, $hold: HoldInput!) {
    spendHold(gameId: $gameId, gameRoleId: $gameRoleId, characterId: $characterId, hold: $hold) {
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
      gameRoles {
        id
        role
        userId
        characters {
          id
          ...Holds
        }
      }
    }
  }
  ${characterFragments.holds}
`;

export default SPEND_HOLD;
