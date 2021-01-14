import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';
import { Stats } from '../@types/enums';

export interface ToggleStatHighlightData {
  toggleStatHighlight: Character;
}

export interface ToggleStatHighlightVars {
  gameRoleId: string;
  characterId: string;
  stat: Stats;
}

const TOGGLE_STAT_HIGHLIGHT = gql`
  mutation ToggleStatHighlight($gameRoleId: String!, $characterId: String!, $stat: Stats!) {
    toggleStatHighlight(gameRoleId: $gameRoleId, characterId: $characterId, stat: $stat) {
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
    }
  }
`;

export default TOGGLE_STAT_HIGHLIGHT;
