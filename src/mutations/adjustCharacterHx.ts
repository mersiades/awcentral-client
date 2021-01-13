import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface AdjustCharacterHxData {
  adjustCharacterHx: Character;
}

export interface AdjustCharacterHxVars {
  gameRoleId: string;
  characterId: string;
  hxId: string;
  value: number;
}

const ADJUST_CHARACTER_HX = gql`
  mutation AdjustCharacterHx($gameRoleId: String!, $characterId: String!, $hxId: String!, $value: Int!) {
    adjustCharacterHx(gameRoleId: $gameRoleId, characterId: $characterId, hxId: $hxId, value: $value) {
      id
      name
      playbook
      hxBlock {
        characterId
        characterName
        hxValue
      }
    }
  }
`;

export default ADJUST_CHARACTER_HX;
