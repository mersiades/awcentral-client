import { gql } from '@apollo/client';
import { User } from '../@types';

export interface UserByDiscordIdData {
  userByDiscordId: User;
}

export interface UserByDiscordIdVars {
  discordId?: string; // TODO: change so that discordId can't be undefined
}

const USER_BY_DISCORD_ID = gql`
  query UserByDiscordId($discordId: String!) {
    userByDiscordId(discordId: $discordId) {
      id
      discordId
      gameRoles {
        id
        role
        characters {
          id
        }
        game {
          id
          name
          textChannelId
        }
      }
    }
  }
`;
export default USER_BY_DISCORD_ID;
