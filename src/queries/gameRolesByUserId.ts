import { gql } from '@apollo/client';
import { GameRole } from '../@types/dataInterfaces';

export interface GameRolesByUserIdData {
  gameRolesByUserId: GameRole[]
}

export interface GameRolesByUserIdVars {
  id: string
}

const GAMEROLES_BY_USER_ID = gql`
  query GameRolesByUserId($id: String!) {
    gameRolesByUserId(id: $id) {
      id
      role
      game {
        id
        name
      }
    }
  }
`

export default GAMEROLES_BY_USER_ID