import { gql } from '@apollo/client';
import { BattleVehicleInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetBattleVehicleData {
  setBattleVehicle: Character;
}

export interface SetBattleVehicleVars {
  gameRoleId: string;
  characterId: string;
  battleVehicle: BattleVehicleInput;
}

const SET_BATTLE_VEHICLE = gql`
  mutation SetBattleVehicle($gameRoleId: String!, $characterId: String!, $battleVehicle: BattleVehicleInput!) {
    setBattleVehicle(gameRoleId: $gameRoleId, characterId: $characterId, battleVehicle: $battleVehicle) {
      id
      name
      playbook
      battleVehicles {
        id
        vehicleType
        name
        vehicleFrame {
          id
          frameType
          massive
          examples
          battleOptionCount
        }
        speed
        handling
        armor
        massive
        strengths
        weaknesses
        looks
        weapons
        battleOptions {
          id
          battleOptionType
          name
        }
        battleVehicleOptions {
          id
          battleOptionType
          name
        }
      }
    }
  }
`;

export default SET_BATTLE_VEHICLE;
