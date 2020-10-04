import { gql } from '@apollo/client';

const USER_BY_DISCORD_ID = gql`
  query UserByDiscordId($discordId: String!) {
    userByDiscordId(discordId: $discordId) {
      id
      discordId
      gameRoles {
        id
        role
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
