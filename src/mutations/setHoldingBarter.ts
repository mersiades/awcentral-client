import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface SetHoldingBarterData {
  setHoldingBarter: Character;
  __typename?: 'Mutation';
}

export interface SetHoldingBarterVars {
  gameRoleId: string;
  characterId: string;
  amount: number;
}

const SET_HOLDING_BARTER = gql`
  mutation SetHoldingBarter($gameRoleId: String!, $characterId: String!, $amount: Int!) {
    setHoldingBarter(gameRoleId: $gameRoleId, characterId: $characterId, amount: $amount) {
      id
      playbookUnique {
        id
        holding {
          id
          barter
        }
      }
    }
  }
`;

export default SET_HOLDING_BARTER;
