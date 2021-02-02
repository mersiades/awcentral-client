import { gql } from '@apollo/client';
import { GangInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetGangData {
  setGang: Character;
}

export interface SetGangVars {
  gameRoleId: string;
  characterId: string;
  gang: GangInput;
}

const SET_GANG = gql`
  mutation SetGang($gameRoleId: String!, $characterId: String!, $gang: GangInput!) {
    setGang(gameRoleId: $gameRoleId, characterId: $characterId, gang: $gang) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        gang {
          id
          size
          harm
          armor
          strengths {
            id
            description
            modifier
            tag
          }
          weaknesses {
            id
            description
            modifier
            tag
          }
          tags
        }
      }
    }
  }
`;

export default SET_GANG;
