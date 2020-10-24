import { Client } from '@stomp/stompjs';
import { createContext, useContext } from 'react';
// import { NewGame } from '../@types';

interface WebsocketContext {
  stompClient?: Client
  // newGame?: NewGame
}

export const WebsocketContext = createContext<WebsocketContext>({} as WebsocketContext)

export const useWebsocketContext = () => useContext(WebsocketContext);