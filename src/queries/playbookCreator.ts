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
      improvementInstructions
      movesInstructions
      hxInstructions
      defaultMoveCount
      moveChoiceCount
      defaultVehicleCount
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
          movesToModify {
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
        gangCreator {
          id
          intro
          defaultSize
          defaultHarm
          defaultArmor
          strengthChoiceCount
          weaknessChoiceCount
          defaultTags
          strengths {
            id
            description
            modifier
            tag
          }
          weaknesses {
            id
            description
            modifier
            tag
          }
        }
        weaponsCreator {
          id
          bfoGunOptionCount
          seriousGunOptionCount
          backupWeaponsOptionCount
          bigFuckOffGuns
          seriousGuns
          backupWeapons
        }
      }
    }
  }
`;

export default PLAYBOOK_CREATOR;
