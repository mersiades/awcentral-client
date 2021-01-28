import { gql } from '@apollo/client';
import { VehicleInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetVehicleData {
  setVehicle: Character;
}

export interface SetVehicleVars {
  gameRoleId: string;
  characterId: string;
  vehicleInput: VehicleInput;
}

const SET_VEHICLE = gql`
  mutation SetVehicle($gameRoleId: String!, $characterId: String!, $vehicleInput: VehicleInput!) {
    setVehicle(gameRoleId: $gameRoleId, characterId: $characterId, vehicleInput: $vehicleInput) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        vehicles {
          id
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
          battleOptions {
            id
            battleOptionType
            name
          }
        }
      }
    }
  }
`;

export default SET_VEHICLE;
