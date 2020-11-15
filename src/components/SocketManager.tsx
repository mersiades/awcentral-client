import { useMutation } from '@apollo/client';
import { Client, IFrame, Stomp } from '@stomp/stompjs';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { GameResponse } from '../@types';
import { Roles, WebsocketResponses } from '../@types/enums';
import { WebsocketContext } from '../contexts/websocketContext';
import APPEND_CHANNELS, { AppendChannelsData, AppendChannelsVars } from '../mutations/appendChannels';
// import USER_BY_DISCORD_ID from '../queries/userByDiscordId';

const SocketManager: FC = ({ children }) => {
  const [stompClient, setStompClient] = useState<Client | undefined>();

  const [appendChannels] = useMutation<AppendChannelsData, AppendChannelsVars>(APPEND_CHANNELS);
  const history = useHistory();

  const handleGame = useCallback(
    async ({ type, id, discordId, name, textChannelId, voiceChannelId }: GameResponse) => {
      console.log('Incoming game websocket message:', type);
      switch (type) {
        case WebsocketResponses.addChannels:
          if (!!id && !!textChannelId && !!voiceChannelId) {
            await appendChannels({
              variables: { id, textChannelId, voiceChannelId },
              // refetchQueries: [{ query: USER_BY_DISCORD_ID, variables: { discordId } }],
            });
          } else {
            console.warn('Unable to append channels: missing mutation variable');
          }
          history.push(`/game/${textChannelId}`, { role: Roles.mc });
          break;
        default:
          break;
      }
    },
    [appendChannels, history]
  );

  const connectStompClient = useCallback(() => {
    const socket = new SockJS('http://localhost:8081/chat');
    const client = Stomp.over(socket);

    client.connect({}, (frame: IFrame) => {
      console.log('Connected: ' + frame);
    });

    return client;
  }, []);

  useEffect(() => {
    if (!stompClient) {
      const client = connectStompClient();
      setStompClient(client);
    }
  }, [stompClient, connectStompClient]);

  return <WebsocketContext.Provider value={{ stompClient, handleGame }}>{children}</WebsocketContext.Provider>;
};

export default SocketManager;
