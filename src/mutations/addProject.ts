import { gql } from '@apollo/client';
import { ProjectInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface AddProjectData {
  addProject: Character;
  __typename?: 'Mutation';
}

export interface AddProjectVars {
  gameRoleId: string;
  characterId: string;
  project: ProjectInput;
}

const ADD_PROJECT = gql`
  mutation AppProject($gameRoleId: String!, $characterId: String!, $project: ProjectInput!) {
    addProject(gameRoleId: $gameRoleId, characterId: $characterId, project: $project) {
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

export default ADD_PROJECT;
