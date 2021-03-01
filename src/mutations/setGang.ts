import { gql } from '@apollo/client';
import { GangInput } from '../@types';
import { Character, PlaybookUnique } from '../@types/dataInterfaces';
import { UniqueTypes } from '../@types/enums';

export interface SetGangData {
  setGang: Character;
  __typename?: 'Character';
}

export interface SetGangVars {
  gameRoleId: string;
  characterId: string;
  gang: GangInput;
}

export const getSetGangOR = (character: Character, gangInput: GangInput) => {
  let optimisticPlaybookUnique: PlaybookUnique;
  if (!!character.playbookUnique?.gang) {
    optimisticPlaybookUnique = {
      id: character.playbookUnique.id,
      type: UniqueTypes.gang,
      gang: {
        ...gangInput,
        id: character.playbookUnique.gang.id,
        strengths: gangInput.strengths.map((str) => ({ ...str, __typename: 'GangOption' })),
        weaknesses: gangInput.weaknesses.map((wk) => ({ ...wk, __typename: 'GangOption' })),
        __typename: 'Gang',
      },
      __typename: 'PlaybookUnique',
    };
  } else {
    optimisticPlaybookUnique = {
      id: 'temp-id-1',
      type: UniqueTypes.gang,
      gang: {
        ...gangInput,
        id: 'temp-id-2',
        strengths: gangInput.strengths.map((str) => ({ ...str, __typename: 'GangOption' })),
        weaknesses: gangInput.weaknesses.map((wk) => ({ ...wk, __typename: 'GangOption' })),
        __typename: 'Gang',
      },
      __typename: 'PlaybookUnique',
    };
  }

  return {
    setGang: {
      ...character,
      playbookUnique: optimisticPlaybookUnique,
      __typename: 'Character',
    },
    __typename: 'Mutation',
  };
};

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
