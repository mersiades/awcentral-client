import { gql } from '@apollo/client';
import { Move } from '../@types/staticDataInterfaces';

export interface AllMovesData {
  allMoves: Move[];
}

const ALL_MOVES = gql`
  query AllMoves {
    allMoves {
      id
      name
      description
      kind
      playbook
      moveAction {
        id
        actionType
        rollType
        statToRollWith
        holdConditions {
          id
          onTenPlus
          onSevenToNine
          onMiss
        }
        plusOneForwardConditions {
          id
          isManualGrant
          onTenPlus
          onSevenToNine
          onMiss
        }
      }
    }
  }
`;

export default ALL_MOVES;
