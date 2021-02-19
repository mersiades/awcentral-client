import { gql } from '@apollo/client';
import { EstablishmentInput, GangInput } from '../@types';
import { Character } from '../@types/dataInterfaces';

export interface SetEstablishmentData {
  setEstablishment: Character;
}

export interface SetEstablishmentVars {
  gameRoleId: string;
  characterId: string;
  establishment: EstablishmentInput;
}

const SET_ESTABLISHMENT = gql`
  mutation SetEstablishment($gameRoleId: String!, $characterId: String!, $establishment: EstablishmentInput!) {
    setEstablishment(gameRoleId: $gameRoleId, characterId: $characterId, establishment: $establishment) {
      id
      name
      playbook
      playbookUnique {
        id
        type
        establishment {
          id
          mainAttraction
          bestRegular
          worstRegular
          wantsInOnIt
          oweForIt
          wantsItGone
          sideAttractions
          atmospheres
          regulars
          interestedParties
          securityOptions {
            id
            description
            value
          }
          castAndCrew {
            id
            name
            description
          }
        }
      }
    }
  }
`;

export default SET_ESTABLISHMENT;
