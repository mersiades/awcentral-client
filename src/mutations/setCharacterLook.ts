import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';
import { LookType } from '../@types/enums';

export interface SetCharacterLookData {
  setCharacterLook: Character;
}

export interface SetCharacterLookVars {
  gameRoleId: string;
  characterId: string;
  look: string;
  category: LookType;
}

const SET_CHARACTER_LOOK = gql`
  mutation SetCharacterLook($gameRoleId: String!, $characterId: String!, $look: String!, $category: LookType!) {
    setCharacterLook(gameRoleId: $gameRoleId, characterId: $characterId, look: $look, category: $category) {
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
