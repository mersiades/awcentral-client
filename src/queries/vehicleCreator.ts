import { gql } from '@apollo/client';
import { VehicleCreator } from '../@types/staticDataInterfaces';

export interface VehicleCreatorData {
  vehicleCreator: VehicleCreator;
}

export interface VehicleCreatorVars {}

const VEHICLE_CREATOR = gql`
  query VehicleCreator {
    vehicleCreator {
      id
      bikeCreator {
        id
        vehicleType
        introInstructions
        frame {
          id
          frameType
          massive
          examples
          battleOptionCount
        }
        strengths
        looks
        weaknesses
        battleOptions {
          id
          battleOptionType
          name
        }
      }
      carCreator {
        id
        vehicleType
        introInstructions
        frames {
          id
          frameType
          massive
          examples
          battleOptionCount
        }
        strengths
        looks
        weaknesses
        battleOptions {
          id
          battleOptionType
          name
        }
      }
      battleVehicleCreator {
        id
        vehicleType
        battleVehicleOptions {
          id
          battleOptionType
          name
        }
      }
    }
  }
`;

export default VEHICLE_CREATOR;
