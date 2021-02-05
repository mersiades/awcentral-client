import { gql } from '@apollo/client';
import { ThreatInput } from '../@types';
import { Game } from '../@types/dataInterfaces';

export interface AddThreatData {
  addThreat: Game;
}

export interface AddThreatVars {
  gameRoleId: string;
  threat: ThreatInput;
}

const ADD_THREAT = gql`
  mutation AddThreat($gameRoleId: String!, $threat: ThreatInput!) {
    addThreat(gameRoleId: $gameRoleId, threat: $threat) {
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
`;

export default ADD_THREAT;
