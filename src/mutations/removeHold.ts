import { gql } from '@apollo/client';
import { HoldInput } from '../@types';
import { Game } from '../@types/dataInterfaces';
import { characterFragments } from '../queries/game';

export interface RemoveHoldData {
  removeHold: Game;
}

export interface RemoveHoldVars {
  gameroleId: string;
  characterId: string;
  hold: HoldInput;
}

const REMOVE_HOLD = gql`
  mutation RemoveHold($gameroleId: String!, $characterId: String!, $hold: HoldInput!) {
    removeHold(gameroleId: $gameroleId, characterId: $characterId, hold: $hold) {
      id
      ...Holds
    }
  }
  ${characterFragments.holds}
`;

export default REMOVE_HOLD;
