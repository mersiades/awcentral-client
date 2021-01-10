import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface FinishCharacterCreationData {
  finishCharacterCreation: Character;
}

export interface FinishCharacterCreationVars {
  gameRoleId: string;
  characterId: string;
}

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
