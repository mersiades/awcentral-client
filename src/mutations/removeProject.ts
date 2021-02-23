import { gql } from '@apollo/client';
import { ProjectInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface RemoveProjectData {
  removeProject: Character;
  __typename?: 'Mutation';
}

export interface RemoveProjectVars {
  gameRoleId: string;
  characterId: string;
  project: ProjectInput;
}

const REMOVE_PROJECT = gql`
  mutation RemoveProject($gameRoleId: String!, $characterId: String!, $project: ProjectInput!) {
    removeProject(gameRoleId: $gameRoleId, characterId: $characterId, project: $project) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        workspace {
          id
          projects {
            id
            name
            notes
          }
        }
      }
    }
  }
`;

export default REMOVE_PROJECT;
