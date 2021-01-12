import { gql } from '@apollo/client';
import { PlayBooks } from '../@types/enums';
import { Playbook } from '../@types/staticDataInterfaces';

export interface PlaybookData {
  playbook: Playbook;
}

export interface PlaybookVars {
  playbookType: PlayBooks;
}

const PLAYBOOK = gql`
  query Playbook($playbookType: PlayBooks!) {
    playbook(playbookType: $playbookType) {
      id
      playbookType
      barterInstructions
      intro
      introComment
      playbookImageUrl
    }
  }
`;

export default PLAYBOOK;
