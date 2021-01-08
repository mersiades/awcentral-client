import { useMutation } from '@apollo/client';
import { Client, IFrame, Stomp } from '@stomp/stompjs';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { GameResponse } from '../@types';
import { Roles, WebsocketResponses } from '../@types/enums';
import { WebsocketContext } from '../contexts/websocketContext';
// import USER_BY_DISCORD_ID from '../queries/userByDiscordId';

const SocketManager: FC = ({ children }) => {
  const [stompClient, setStompClient] = useState<Client | undefined>();
  // const history = useHistory();

  const handleGame = () => console.log('mock handling game');

  // const handleGame = useCallback(
  //   async ({ type, id, userId, name, textChannelId, voiceChannelId }: GameResponse) => {
  //     console.log('Incoming game websocket message:', type);
  //     switch (type) {
  //       case WebsocketResponses.addChannels:
  //
  //         history.push(`/game/${textChannelId}`, { role: Roles.mc });
  //         break;
  //       default:
  //         break;
  //     }
  //   },
  //   [ history]
  // );

  // const connectStompClient = useCallback(() => {
  //   const socket = new SockJS('http://localhost:8081/chat');
  //   const client = Stomp.over(socket);

  //   client.connect({}, (frame: IFrame) => {
  //     console.log('Connected: ' + frame);
  //   });

  //   return client;
  // }, []);

  // useEffect(() => {
  //   if (!stompClient) {
  //     const client = connectStompClient();
  //     setStompClient(client);
  //   }
  // }, [stompClient, connectStompClient]);

  return <WebsocketContext.Provider value={{ stompClient, handleGame }}>{children}</WebsocketContext.Provider>;
};

export default SocketManager;
