import { gql } from '@apollo/client';
import { FollowersInput, HoldingInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetFollowersData {
  setFollowers: Character;
}

export interface SetFollowersVars {
  gameRoleId: string;
  characterId: string;
  followers: FollowersInput;
}

const SET_FOLLOWERS = gql`
  mutation SetFollowers($gameRoleId: String!, $characterId: String!, $followers: FollowersInput!) {
    setFollowers(gameRoleId: $gameRoleId, characterId: $characterId, followers: $followers) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        followers {
          id
          description
          travelOption
          characterization
          followers
          fortune
          barter
          surplusBarter
          surplus
          wants
          selectedStrengths {
            id
            description
            newNumberOfFollowers
            surplusBarterChange
            fortuneChange
            surplusChange
            wantChange
          }
          selectedWeaknesses {
            id
            description
            newNumberOfFollowers
            surplusBarterChange
            fortuneChange
            surplusChange
            wantChange
          }
        }
      }
    }
  }
`;

export default SET_FOLLOWERS;
