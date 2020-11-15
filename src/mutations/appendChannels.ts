import { gql } from '@apollo/client';
import { GameResponse } from '../@types';

export interface AppendChannelsData {
  appendChannels: GameResponse
}

export interface AppendChannelsVars {
  id: string
  textChannelId: string
  voiceChannelId: string
}

const APPEND_CHANNELS = gql`
mutation AppendChannels($id: String! $textChannelId: String!, $voiceChannelId: String!) {
  appendChannels(id: $id, textChannelId: $textChannelId, voiceChannelId: $voiceChannelId) {
    id
    name
    textChannelId
    voiceChannelId
    gameRoles {
        id
        role
    }
  }
}
`

export default APPEND_CHANNELS