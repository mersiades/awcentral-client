import { gql } from '@apollo/client';
import { Character, CharacterStat } from '../@types/dataInterfaces';
import { StatType } from '../@types/enums';

export interface ToggleStatHighlightData {
  toggleStatHighlight: Character;
  __typename?: 'Mutation';
}

export interface ToggleStatHighlightVars {
  gameRoleId: string;
  characterId: string;
  stat: StatType;
}

export const getToggleStatHighlightOR = (character: Character, stat: StatType) => {
  let optimisticStats: CharacterStat[] = [];
  if (!!character.statsBlock) {
    const index = character.statsBlock.stats.findIndex((stat1) => stat1.stat === stat);
    let optimisticStats = [...character.statsBlock.stats];
    if (index > -1) {
      optimisticStats[index] = { ...optimisticStats[index], isHighlighted: !optimisticStats[index].isHighlighted };
    } else {
      // I think this edge case is actually impossible, but coding defensively just in case
      optimisticStats = [...optimisticStats, { id: 'temp-id', stat, value: 0, isHighlighted: true }];
    }
    optimisticStats.forEach((stat2) => ({ ...stat2, __typename: 'CharacterStat' }));
    return {
      __typename: 'Mutation',
      toggleStatHighlight: {
        ...character,
        statsBlock: {
          ...character.statsBlock,
          stats: optimisticStats,
        },
        __typename: 'Character',
      },
    };
  } else {
    optimisticStats = [
      ...optimisticStats,
      { id: 'temp-id', stat, value: 0, isHighlighted: true, __typename: 'CharacterStat' },
    ];
    return {
      __typename: 'Mutation',
      toggleStatHighlight: {
        ...character,
        statsBlock: {
          id: 'temp-id',
          stats: optimisticStats,
        },
        __typename: 'Character',
      },
    };
  }
};

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
