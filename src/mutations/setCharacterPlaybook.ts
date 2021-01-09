import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';
import { PlayBooks } from '../@types/enums';

export interface SetCharacterPlaybookData {
  setPlaybookCharacter: Character
}

export interface SetCharacterPlaybookVars {
  gameRoleId: string
  characterId: string
  playbookType: PlayBooks
}

const SET_CHARACTER_PLAYBOOK = gql`
  mutation SetCharacterPlaybook($gameRoleId: String!, $characterId: String!, $playbookType: PlayBooks!) {
    setCharacterPlaybook(gameRoleId: $gameRoleId, characterId: $characterId, playbookType: $playbookType) {
      id
      name
      playbook
      gear
      looks {
        look
        category
      }
    }
  }
`

export default SET_CHARACTER_PLAYBOOK