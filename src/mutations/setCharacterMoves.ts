import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';

export interface SetCharacterMovesData {
  setCharacterMoves: Character;
}

export interface SetCharacterMovesVars {
  gameRoleId: string;
  characterId: string;
  moveIds: string[];
}

const SET_CHARACTER_MOVES = gql`
  mutation SetCharacterMoves($gameRoleId: String!, $characterId: String!, $moveIds: [String]!) {
    setCharacterMoves(gameRoleId: $gameRoleId, characterId: $characterId, moveIds: $moveIds) {
      id
      name
      playbook
      statsBlock {
        id
        stats {
          id
          stat
          value
          isHighlighted
        }
      }
      characterMoves {
        id
        isSelected
        name
        kind
        description
        playbook
        stat
        rollModifier {
          id
          moveToModify {
            id
          }
          statToRollWith
        }
      }
    }
  }
`;

export default SET_CHARACTER_MOVES;
