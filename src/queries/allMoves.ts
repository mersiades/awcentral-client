import { gql } from '@apollo/client';

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