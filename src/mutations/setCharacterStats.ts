import { gql } from '@apollo/client';
import { Character } from '../@types';

export interface SetCharacterStatsData {
  setCharacterStats: Character
}

export interface SetCharacterStatsVars {
  gameRoleId: string
  characterId: string
  statsOptionId: string
}

const SET_CHARACTER_LOOK = gql`
  mutation SetCharacterStats($gameRoleId: String!,$characterId: String!, $statsOptionId: String!) {
    setCharacterStats(gameRoleId: $gameRoleId, characterId: $characterId, statsOptionId: $statsOptionId) {
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
    }
  }
`

export default SET_CHARACTER_LOOK