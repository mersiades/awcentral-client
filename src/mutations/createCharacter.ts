import { gql } from '@apollo/client';
import { Character } from '../@types';

export interface CreateCharacterData {
  createCharacter: Character
}

export interface CreateCharacterVars {
  gameRoleId: string
}

const CREATE_CHARACTER = gql`
  mutation CreateCharacter($gameRoleId: String!) {
    createCharacter(gameRoleId: $gameRoleId) {
      id
    }
  }
`

export default CREATE_CHARACTER