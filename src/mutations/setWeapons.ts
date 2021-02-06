import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface SetWeaponsData {
  setWeapons: Character;
}

export interface SetWeaponsVars {
  gameRoleId: string;
  characterId: string;
  weapons: string[];
}

const SET_WEAPONS = gql`
  mutation SetWeapons($gameRoleId: String!, $characterId: String!, $weapons: [String]!) {
    setWeapons(gameRoleId: $gameRoleId, characterId: $characterId, weapons: $weapons) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        weapons {
          id
          weapons
        }
      }
    }
  }
`;

export default SET_WEAPONS;
