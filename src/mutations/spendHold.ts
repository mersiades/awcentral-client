import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface SpendHoldData {
  spendHold: Game;
}

export interface SpendHoldVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
}

const SPEND_HOLD = gql`
  mutation SpendHold($gameId: String!, $gameroleId: String!, $characterId: String!) {
    spendHold(gameId: $gameId, gameroleId: $gameroleId, characterId: $characterId) {
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
      gameRoles {
        id
        role
        userId
        characters {
          id
          holds
        }
      }
    }
  }
`;

export default SPEND_HOLD;
