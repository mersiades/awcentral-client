import { gql } from '@apollo/client';
import { SkinnerGearInput } from '../@types';
import { Character, PlaybookUnique } from '../@types/dataInterfaces';
import { UniqueTypes } from '../@types/enums';

export interface SetSkinnerGearData {
  setSkinnerGear: Character;
  __typename: 'Mutation';
}

export interface SetSkinnerGearVars {
  gameRoleId: string;
  characterId: string;
  skinnerGear: SkinnerGearInput;
}

export const getSetSkinnerGearOR = (character: Character, skinnerGearInput: SkinnerGearInput) => {
  const optimisticPlaybookUnique: PlaybookUnique = {
    id: character.playbookUnique ? character.playbookUnique.id : 'temp-id-1',
    type: UniqueTypes.skinnerGear,
    skinnerGear: {
      ...skinnerGearInput,
      id: character.playbookUnique?.skinnerGear ? character.playbookUnique.skinnerGear.id : 'temp-id-2',
      graciousWeapon: { ...skinnerGearInput.graciousWeapon, __typename: 'SkinnerGearItem' },
      luxeGear: skinnerGearInput.luxeGear.map((lg) => ({ ...lg, __typename: 'SkinnerGearItem' })),
      __typename: 'SkinnerGear',
    },
    __typename: 'PlaybookUnique',
  };

  return {
    setSkinnerGear: {
      ...character,
      playbookUnique: optimisticPlaybookUnique,
      __typename: 'Character',
    },
    __typename: 'Mutation',
  };
};

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
