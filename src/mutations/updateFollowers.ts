import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface UpdateFollowersData {
  updateFollowers: Character;
  __typename?: 'Mutation';
}

export interface UpdateFollowersVars {
  gameRoleId: string;
  characterId: string;
  barter: number;
  followers: number;
  description: string;
}

const UPDATE_FOLLOWERS = gql`
  mutation UpdateFollowers(
    $gameRoleId: String!
    $characterId: String!
    $barter: Int!
    $followers: Int!
    $description: String!
  ) {
    updateFollowers(
      gameRoleId: $gameRoleId
      characterId: $characterId
      barter: $barter
      followers: $followers
      description: $description
    ) {
      id
      playbookUnique {
        id
        followers {
          id
          barter
          followers
          description
        }
      }
    }
  }
`;

export default UPDATE_FOLLOWERS;
