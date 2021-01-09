import { gql } from '@apollo/client';
import { Move } from '../@types/staticDataInterfaces';

export interface AllMovesData {
  allMoves: Move[]
}

const ALL_MOVES = gql`
  query AllMoves {
    allMoves {
      id
      name
      description
      stat
      kind
      playbook
    }
  }
`

export default ALL_MOVES