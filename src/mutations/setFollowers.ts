import { gql } from '@apollo/client';
import { FollowersInput } from '../@types';
import { Character, PlaybookUnique } from '../@types/dataInterfaces';
import { UniqueTypes } from '../@types/enums';

export interface SetFollowersData {
  setFollowers: Character;
  __typename?: 'Mutation';
}

export interface SetFollowersVars {
  gameRoleId: string;
  characterId: string;
  followers: FollowersInput;
}

export const getSetFollowerOR = (character: Character, followersInput: FollowersInput) => {
  const optimisticPlaybookUnique: PlaybookUnique = {
    id: character.playbookUnique?.id ? character.playbookUnique.id : 'temp-id-1',
    type: UniqueTypes.followers,
    followers: {
      ...followersInput,
      id: followersInput.id ? followersInput.id : 'temp-id-2',
      selectedStrengths: followersInput.selectedStrengths.map((opt) => ({ ...opt, __typename: 'FollowersOption' })),
      selectedWeaknesses: followersInput.selectedWeaknesses.map((opt) => ({ ...opt, __typename: 'FollowersOption' })),
      __typename: 'Followers',
    },
    __typename: 'PlaybookUnique',
  };

  return {
    setFollowers: {
      ...character,
      playbookUnique: optimisticPlaybookUnique,
      __typename: 'Character',
    },
    __typename: 'Mutation',
  };
};

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
