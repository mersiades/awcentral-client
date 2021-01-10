import { gql } from '@apollo/client';
import { HxInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetCharacterHxData {
  setCharacterHx: Character;
}

export interface SetCharacterHxVars {
  gameRoleId: string;
  characterId: string;
  hxStats: HxInput[];
}

const SET_CHARACTER_HX = gql`
  mutation SetCharacterHx($gameRoleId: String!, $characterId: String!, $hxStats: [HxInput]!) {
    setCharacterHx(gameRoleId: $gameRoleId, characterId: $characterId, hxStats: $hxStats) {
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

export default SET_CHARACTER_HX;
