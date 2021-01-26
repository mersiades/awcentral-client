import { gql } from '@apollo/client';
import { PlaybookCreator } from '../@types/staticDataInterfaces';
import { PlaybookType } from '../@types/enums';

export interface PlaybookCreatorData {
  playbookCreator: PlaybookCreator;
}

export interface PlaybookCreatorVars {
  playbookType: PlaybookType;
}

const PLAYBOOK_CREATOR = gql`
  query PlaybookCreator($playbookType: PlaybookType!) {
    playbookCreator(playbookType: $playbookType) {
      id
      playbookType
      gearInstructions {
        id
        gearIntro
        youGetItems
        introduceChoice
        numberCanChoose
        chooseableGear
        withMC
        startingBarter
      }
      improvementInstructions
      movesInstructions
      hxInstructions
      looks {
        id
        look
        category
      }
      names {
        id
        name
      }
      statsOptions {
        id
        COOL
        HARD
        HOT
        SHARP
        WEIRD
      }
      defaultMoveCount
      moveChoiceCount
      optionalMoves {
        id
        name
        kind
        description
        playbook
        stat
        statModifier {
          id
          statToModify
          modification
        }
        moveAction {
          id
          actionType
          rollType
          statToRollWith
        }
      }
      defaultMoves {
        id
        name
        kind
        description
        playbook
        stat
        statModifier {
          id
          statToModify
          modification
        }
        rollModifier {
          id
          moveToModify {
            id
          }
          statToRollWith
        }
        moveAction {
          id
          actionType
          rollType
          statToRollWith
        }
      }
      playbookUniqueCreator {
        id
        type
        angelKitCreator {
          id
          angelKitInstructions
          startingStock
        }
        customWeaponsCreator {
          id
          firearmsTitle
          firearmsBaseInstructions
          firearmsBaseOptions {
            id
            description
            tags
          }
          firearmsOptionsInstructions
          firearmsOptionsOptions {
            id
            description
            tag
          }
          handTitle
          handBaseInstructions
          handBaseOptions {
            id
            description
            tags
          }
          handOptionsInstructions
          handOptionsOptions {
            id
            description
            tag
          }
        }
        brainerGearCreator {
          id
          gear
        }
      }
    }
  }
`;

export default PLAYBOOK_CREATOR;
