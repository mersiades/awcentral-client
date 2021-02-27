import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface FinishCharacterCreationData {
  finishCharacterCreation: Character;
  __typename?: 'Mutation';
}

export interface FinishCharacterCreationVars {
  gameRoleId: string;
  characterId: string;
}

export const getFinishCharacterCreationOR = (character: Character) => ({
  __typename: 'Mutation',
  finishCharacterCreation: {
    ...character,
    hasCompletedCharacterCreation: true,
    __typename: 'Character',
  },
});

const FINISH_CHARACTER_CREATION = gql`
  mutation FinishCharacterCreation($gameRoleId: String!, $characterId: String!) {
    finishCharacterCreation(gameRoleId: $gameRoleId, characterId: $characterId) {
      id
      name
      playbook
      hasCompletedCharacterCreation
    }
  }
`;

export default FINISH_CHARACTER_CREATION;
