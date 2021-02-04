import { gql } from '@apollo/client';
import { ThreatInput } from '../@types';
import { Game } from '../@types/dataInterfaces';

export interface AddThreatData {
  addThreat: Game;
}

export interface AddThreatVars {
  gameId: string;
  gameRoleId: string;
  threat: ThreatInput;
}

const ADD_THREAT = gql`
  mutation AddThreat($gameId: String!, $gameRoleId: String!, $threat: ThreatInput!) {
    addThreat(gameId: $gameId, gameRoleId: $gameRoleId, threat: $threat) {
      id
      gameRoles {
        id
        threats {
          id
          name
          threatKind
          impulse
          description
          stakes
        }
      }
    }
  }
`;

export default ADD_THREAT;
