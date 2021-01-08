import { gql } from '@apollo/client';
import { PlaybookCreator } from '../@types';
import { PlayBooks } from '../@types/enums';

export interface PlaybookCreatorData {
  playbookCreator: PlaybookCreator;
}

export interface PlaybookCreatorVars {
  playbookType: PlayBooks;
}

const PLAYBOOK_CREATOR = gql`
  query PlaybookCreator($playbookType: PlayBooks!) {
    playbookCreator(playbookType: $playbookType) {
      id
      playbookType
      gearInstructions {
        id
        youGet
        youGetItems
        inAddition
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
      playbookMoves {
        id
        isSelected
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
          movesToModify {
            id
          }
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
