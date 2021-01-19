import { gql } from '@apollo/client';
import { Character } from '../@types/dataInterfaces';
import { StatType } from '../@types/enums';

export interface ToggleStatHighlightData {
  toggleStatHighlight: Character;
}

export interface ToggleStatHighlightVars {
  gameRoleId: string;
  characterId: string;
  stat: StatType;
}

const TOGGLE_STAT_HIGHLIGHT = gql`
  mutation ToggleStatHighlight($gameRoleId: String!, $characterId: String!, $stat: StatType!) {
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
