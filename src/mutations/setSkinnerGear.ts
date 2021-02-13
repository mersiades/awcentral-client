import { gql } from '@apollo/client';
import { SkinnerGearInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetSkinnerGearData {
  setSkinnerGear: Character;
  __typename: 'Mutation';
}

export interface SetSkinnerGearVars {
  gameRoleId: string;
  characterId: string;
  skinnerGear: SkinnerGearInput;
}

const SET_SKINNER_GEAR = gql`
  mutation SetSkinnerGear($gameRoleId: String!, $characterId: String!, $skinnerGear: SkinnerGearInput!) {
    setSkinnerGear(gameRoleId: $gameRoleId, characterId: $characterId, skinnerGear: $skinnerGear) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        skinnerGear {
          id
          graciousWeapon {
            id
            item
            note
          }
          luxeGear {
            id
            item
            note
          }
        }
      }
    }
  }
`;

export default SET_SKINNER_GEAR;
