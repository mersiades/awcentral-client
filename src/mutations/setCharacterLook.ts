import { gql } from '@apollo/client';
import { LookInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetCharacterLookData {
  setCharacterLook: Character;
  __typename?: 'Mutation';
}

export interface SetCharacterLookVars {
  gameRoleId: string;
  characterId: string;
  look: LookInput;
}

const SET_CHARACTER_LOOK = gql`
  mutation SetCharacterLook($gameRoleId: String!, $characterId: String!, $look: LookInput!) {
    setCharacterLook(gameRoleId: $gameRoleId, characterId: $characterId, look: $look) {
      id
      name
      playbook
      looks {
        look
        category
      }
    }
  }
`;

export default SET_CHARACTER_LOOK;
