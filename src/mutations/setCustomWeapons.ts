import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface SetCustomWeaponsData {
  setCustomWeapons: Character
}

export interface SetCustomWeaponsVars {
  gameRoleId: string
  characterId: string
  weapons: string[]
}

const SET_CUSTOM_WEAPONS = gql`
  mutation SetCustomWeapons($gameRoleId: String!,$characterId: String!, $weapons: [String]!) {
    setCustomWeapons(gameRoleId: $gameRoleId, characterId: $characterId, weapons: $weapons) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        customWeapons {
          id
          weapons
        }
      }
    }
  }
`

export default SET_CUSTOM_WEAPONS