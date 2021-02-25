import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface SetCharacterBarterData {
  setCharacterBarter: Character;
  __typename?: 'Mutation';
}

export interface SetCharacterBarterVars {
  gameRoleId: string;
  characterId: string;
  amount: number;
}

const SET_CHARACTER_BARTER = gql`
  mutation SetCharacterBarter($gameRoleId: String!, $characterId: String!, $amount: Int!) {
    setCharacterBarter(gameRoleId: $gameRoleId, characterId: $characterId, amount: $amount) {
      id
      name
      playbook
      barter
    }
  }
`;

export default SET_CHARACTER_BARTER;
