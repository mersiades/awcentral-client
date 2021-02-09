import { gql } from '@apollo/client';
import { HoldingInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetHoldingData {
  setHolding: Character;
}

export interface SetHoldingVars {
  gameRoleId: string;
  characterId: string;
  holding: HoldingInput;
  vehicleCount: number;
}

const SET_HOLDING = gql`
  mutation SetHolding($gameRoleId: String!, $characterId: String!, $holding: HoldingInput!, $vehicleCount: Int!) {
    setHolding(gameRoleId: $gameRoleId, characterId: $characterId, holding: $holding, vehicleCount: $vehicleCount) {
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
          }
          selectedWeaknesses {
            id
            description
          }
        }
      }
    }
  }
`;

export default SET_HOLDING;
