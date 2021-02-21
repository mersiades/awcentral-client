import { gql } from '@apollo/client';
import { WorkspaceInput } from '../@types';
import { Character } from '../@types/dataInterfaces';
import { playbookUniqueFragments } from '../queries/game';

export interface SetWorkspaceData {
  setWorkspace: Character;
  __typename?: 'Mutation';
}

export interface SetWorkspaceVars {
  gameRoleId: string;
  characterId: string;
  workspace: WorkspaceInput;
}

const SET_WORKSPACE = gql`
  mutation SetWorkspace($gameRoleId: String!, $characterId: String!, $workspace: WorkspaceInput!) {
    setWorkspace(gameRoleId: $gameRoleId, characterId: $characterId, workspace: $workspace) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        ...Workspace
      }
    }
  }
  ${playbookUniqueFragments.workspace}
`;

export default SET_WORKSPACE;
