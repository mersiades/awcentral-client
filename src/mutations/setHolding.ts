import { gql } from '@apollo/client';
import { HoldingInput } from '../@types';
import { Character, PlaybookUnique } from '../@types/dataInterfaces';
import { UniqueTypes } from '../@types/enums';

export interface SetHoldingData {
  setHolding: Character;
}

export interface SetHoldingVars {
  gameRoleId: string;
  characterId: string;
  holding: HoldingInput;
  vehicleCount: number;
  battleVehicleCount: number;
}

export const getSetHoldingOR = (character: Character, holdingInput: HoldingInput) => {
  let optimisticPlaybookUnique: PlaybookUnique;
  if (!!character.playbookUnique?.holding) {
    optimisticPlaybookUnique = {
      id: character.playbookUnique.id,
      type: UniqueTypes.holding,
      holding: {
        ...holdingInput,
        id: character.playbookUnique.holding.id,
        selectedStrengths: holdingInput.selectedStrengths.map((str) => ({ ...str, __typename: 'HoldingOption' })),
        selectedWeaknesses: holdingInput.selectedWeaknesses.map((wk) => ({ ...wk, __typename: 'HoldingOption' })),
      },
      __typename: 'PlaybookUnique',
    };
  } else {
    optimisticPlaybookUnique = {
      id: 'temp-id-1',
      type: UniqueTypes.holding,
      holding: {
        ...holdingInput,
        id: 'temp-id-2',
        selectedStrengths: holdingInput.selectedStrengths.map((str) => ({ ...str, __typename: 'HoldingOption' })),
        selectedWeaknesses: holdingInput.selectedWeaknesses.map((wk) => ({ ...wk, __typename: 'HoldingOption' })),
      },
      __typename: 'PlaybookUnique',
    };
  }

  return {
    setHolding: {
      ...character,
      playbookUnique: optimisticPlaybookUnique,
      __typename: 'Character',
    },
    __typename: 'Mutation',
  };
};

const SET_HOLDING = gql`
  mutation SetHolding(
    $gameRoleId: String!
    $characterId: String!
    $holding: HoldingInput!
    $vehicleCount: Int!
    $battleVehicleCount: Int!
  ) {
    setHolding(
      gameRoleId: $gameRoleId
      characterId: $characterId
      holding: $holding
      vehicleCount: $vehicleCount
      battleVehicleCount: $battleVehicleCount
    ) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        holding {
          id
          holdingSize
          gangSize
          souls
          surplus
          barter
          gangHarm
          gangArmor
          gangDefenseArmorBonus
          wants
          gigs
          gangTags
          selectedStrengths {
            id
            description
            surplusChange
            wantChange
            newHoldingSize
            gigChange
            newGangSize
            gangTagChange
            gangHarmChange
            newVehicleCount
            newBattleVehicleCount
            newArmorBonus
          }
          selectedWeaknesses {
            id
            description
            surplusChange
            wantChange
            newHoldingSize
            gigChange
            newGangSize
            gangTagChange
            gangHarmChange
            newVehicleCount
            newBattleVehicleCount
            newArmorBonus
          }
        }
      }
    }
  }
`;

export default SET_HOLDING;
