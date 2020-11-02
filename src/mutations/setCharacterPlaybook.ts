import { gql } from '@apollo/client';
import { Character } from '../@types';
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
      playbook
    }
  }
`

export default SET_CHARACTER_PLAYBOOK