import { Client } from '@stomp/stompjs';
import { createContext, useContext } from 'react';
import { GameResponse } from '../@types';
// import { NewGame } from '../@types';

interface WebsocketContext {
  stompClient?: Client
  handleGame?: (response: GameResponse) => void
}

export const WebsocketContext = createContext<WebsocketContext>({} as WebsocketContext)

export const useWebsocketContext = () => useContext(WebsocketContext);