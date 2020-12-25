import { gql } from '@apollo/client';
import { Character } from '../@types';

export interface SetAngelKitData {
  setAngelKit: Character
}

export interface SetAngelKitVars {
  gameRoleId: string
  characterId: string
  stock: number
  hasSupplier: boolean
}

const SET_ANGEL_KIT = gql`
  mutation SetAngelKit($gameRoleId: String!,$characterId: String!, $stock: Int!, $hasSupplier: Boolean!) {
    setAngelKit(gameRoleId: $gameRoleId, characterId: $characterId, stock: $stock, hasSupplier: $hasSupplier) {
      id
      name
      playbook
      gear
      looks {
        look
        category
      }
      statsBlock {
        id
        stats {
          id
          stat
          value
          isHighlighted
        }
      }
      playbookUnique {
        id
        type
        angelKit {
          id
          description
          stock
          angelKitMoves {
            id
          }
          hasSupplier
          supplierText
        }
      }
    }
  }
`

export default SET_ANGEL_KIT