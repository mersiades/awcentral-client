import { gql } from '@apollo/client';
import { PlaybookCreator } from '../@types/staticDataInterfaces';
import { PlaybookType } from '../@types/enums';

export interface PlaybookCreatorData {
  playbookCreator: PlaybookCreator;
}

export interface PlaybookCreatorVars {
  playbookType: PlaybookType;
}

export const playbookUniqueCreatorFragments = {
  angelKitCreator: gql`
    fragment AngelKitCreator on PlaybookUniqueCreator {
      angelKitCreator {
        id
        angelKitInstructions
        startingStock
      }
    }
  `,
  brainerGearCreator: gql`
    fragment BrainerGearCreator on PlaybookUniqueCreator {
      brainerGearCreator {
        id
        gear
      }
    }
  `,
  customWeaponsCreator: gql`
    fragment CustomWeaponsCreator on PlaybookUniqueCreator {
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
    }
  `,
  establishmentCreator: gql`
    fragment EstablishmentCreator on PlaybookUniqueCreator {
      establishmentCreator {
        id
        mainAttractionCount
        sideAttractionCount
        attractions
        atmospheres
        atmosphereCount
        regularsNames
        regularsQuestions
        interestedPartyNames
        interestedPartyQuestions
        securityOptions {
          id
          description
          value
        }
      }
    }
  `,
  followersCreator: gql`
    fragment FollowersCreator on PlaybookUniqueCreator {
      followersCreator {
        id
        instructions
        defaultNumberOfFollowers
        defaultSurplusBarter
        defaultFortune
        strengthCount
        weaknessCount
        travelOptions
        characterizationOptions
        defaultWants
        strengthOptions {
          id
          description
          newNumberOfFollowers
          surplusBarterChange
          fortuneChange
          surplusChange
          wantChange
        }
        weaknessOptions {
          id
          description
          newNumberOfFollowers
          surplusBarterChange
          fortuneChange
          surplusChange
          wantChange
        }
      }
    }
  `,
  gangCreator: gql`
    fragment GangCreator on PlaybookUniqueCreator {
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
    }
  `,
  holdingCreator: gql`
    fragment HoldingCreator on PlaybookUniqueCreator {
      holdingCreator {
        id
        defaultHoldingSize
        instructions
        defaultSurplus
        defaultGigs
        defaultWant
        defaultArmorBonus
        defaultVehiclesCount
        defaultBattleVehicleCount
        defaultGangSize
        defaultGangHarm
        defaultGangArmor
        defaultGangTag
        strengthCount
        weaknessCount
        strengthOptions {
          id
          description
          surplusChange
          wantChange
          newHoldingSize
          gigChange
          newGangSize
          gangTagChange
          gangHarmChange
          newVehicleCount
          newBattleVehicleCount
          newArmorBonus
        }
        weaknessOptions {
          id
          description
          surplusChange
          wantChange
          newHoldingSize
          gigChange
          newGangSize
          gangTagChange
          gangHarmChange
          newVehicleCount
          newBattleVehicleCount
          newArmorBonus
        }
      }
    }
  `,
  skinnerGearCreator: gql`
    fragment SkinnerGearCreator on PlaybookUniqueCreator {
      skinnerGearCreator {
        id
        graciousWeaponCount
        luxeGearCount
        graciousWeaponChoices {
          id
          item
          note
        }
        luxeGearChoices {
          id
          item
          note
        }
      }
    }
  `,
  weaponsCreator: gql`
    fragment WeaponsCreator on PlaybookUniqueCreator {
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
  `,
  workspaceCreator: gql`
    fragment WorkspaceCreator on PlaybookUniqueCreator {
      workspaceCreator {
        id
        itemsCount
        workspaceInstructions
        projectInstructions
        workspaceItems
      }
    }
  `,
};

export const playbookCreatorFragments = {
  gearInstructions: gql`
    fragment GearInstructions on PlaybookCreator {
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
    }
  `,
  looks: gql`
    fragment CreatorLooks on PlaybookCreator {
      looks {
        id
        look
        category
      }
    }
  `,
  playbookUniqueCreator: gql`
    fragment PlaybookUniqueCreator on PlaybookCreator {
      playbookUniqueCreator {
        id
        type
        ...AngelKitCreator
        ...BrainerGearCreator
        ...CustomWeaponsCreator
        ...EstablishmentCreator
        ...FollowersCreator
        ...GangCreator
        ...HoldingCreator
        ...SkinnerGearCreator
        ...WeaponsCreator
        ...WorkspaceCreator
      }
    }
    ${playbookUniqueCreatorFragments.angelKitCreator}
    ${playbookUniqueCreatorFragments.brainerGearCreator}
    ${playbookUniqueCreatorFragments.customWeaponsCreator}
    ${playbookUniqueCreatorFragments.establishmentCreator}
    ${playbookUniqueCreatorFragments.followersCreator}
    ${playbookUniqueCreatorFragments.gangCreator}
    ${playbookUniqueCreatorFragments.holdingCreator}
    ${playbookUniqueCreatorFragments.skinnerGearCreator}
    ${playbookUniqueCreatorFragments.weaponsCreator}
    ${playbookUniqueCreatorFragments.workspaceCreator}
  `,
  names: gql`
    fragment Names on PlaybookCreator {
      names {
        id
        name
      }
    }
  `,
  statsOptions: gql`
    fragment StatsOptions on PlaybookCreator {
      statsOptions {
        id
        COOL
        HARD
        HOT
        SHARP
        WEIRD
      }
    }
  `,
  optionalMoves: gql`
    fragment OptionalMoves on PlaybookCreator {
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
    }
  `,
  defaultMoves: gql`
    fragment DefaultMoves on PlaybookCreator {
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
    }
  `,
};

const PLAYBOOK_CREATOR = gql`
  query PlaybookCreator($playbookType: PlaybookType!) {
    playbookCreator(playbookType: $playbookType) {
      id
      playbookType
      defaultMoveCount
      moveChoiceCount
      defaultVehicleCount
      improvementInstructions
      movesInstructions
      hxInstructions
      names {
        id
        name
      }
      looks {
        id
        look
        category
        playbookType
      }
      ...StatsOptions
      ...OptionalMoves
      ...DefaultMoves
      ...GearInstructions
      ...PlaybookUniqueCreator
    }
  }
  ${playbookCreatorFragments.statsOptions}
  ${playbookCreatorFragments.optionalMoves}
  ${playbookCreatorFragments.defaultMoves}
  ${playbookCreatorFragments.gearInstructions}
  ${playbookCreatorFragments.playbookUniqueCreator}
`;

export default PLAYBOOK_CREATOR;
