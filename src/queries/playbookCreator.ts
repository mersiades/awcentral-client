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
      playbook {
        id
      }
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
    }
  }
`;
export default PLAYBOOK_CREATOR;
