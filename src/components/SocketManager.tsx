import { useMutation } from '@apollo/client'
import { Client, IFrame, Stomp } from '@stomp/stompjs'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import SockJS from 'sockjs-client'
import { NewGame } from '../@types'
import { Roles } from '../@types/enums'
import { WebsocketContext } from '../contexts/websocketContext'
import CREATE_GAME from '../mutations/createGame'
import USER_BY_DISCORD_ID from '../queries/userByDiscordId'

const SocketManager: FC = ({children}) => {
  const [stompClient, setStompClient] = useState<Client | undefined>()
  // const [newGame, setNewGame] = useState<NewGame | undefined>()
  const [createGame ] = useMutation(CREATE_GAME)
  const history = useHistory();

  const handleNewGame = useCallback(
    async ({discordId, name, textChannelId, voiceChannelId}: NewGame) => {
      await createGame({
        variables: {discordId, name, textChannelId, voiceChannelId},
        refetchQueries: [{ query: USER_BY_DISCORD_ID, variables: { discordId }}]
      })
  
      history.push(`/game/${textChannelId}`, { role: Roles.mc});
    },
    [createGame, history],
  )

  const subscribeToNewGames = useCallback(
    (client: Client) => {
      client.subscribe('/topic/new-game',
     (payload) => handleNewGame(JSON.parse(payload.body) as NewGame)
    )
    },
    [handleNewGame],
  )

  const connectStompClient = useCallback(
    () => {
      const socket = new SockJS('http://localhost:8081/chat')
    const client = Stomp.over(socket)
  
    client.connect({}, (frame: IFrame) => {
      console.log('Connected: ' + frame);
      subscribeToNewGames(client)
    });

    return client
    },
    [subscribeToNewGames],
  )


  useEffect(() => {
    if (!stompClient) {
    const client = connectStompClient()
    setStompClient(client)
    }

    
  }, [stompClient, connectStompClient])


  return (
    <WebsocketContext.Provider value={{ stompClient }}>
      {children}
    </WebsocketContext.Provider>
      

  )
}

export default SocketManager
