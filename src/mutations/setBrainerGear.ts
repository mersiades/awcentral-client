import { gql } from '@apollo/client';
import { Character } from '../@types';

export interface SetBrainerGearData {
  setBrainerGear: Character
}

export interface SetBrainerGearVars {
  gameRoleId: string
  characterId: string
  brainerGear: string[]
}

const SET_BRAINER_GEAR = gql`
  mutation SetBrainerGear($gameRoleId: String!,$characterId: String!, $brainerGear: [String]!) {
    setBrainerGear(gameRoleId: $gameRoleId, characterId: $characterId, brainerGear: $brainerGear) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        brainerGear {
          id
          brainerGear
        }
      }
    }
  }
`

export default SET_BRAINER_GEAR