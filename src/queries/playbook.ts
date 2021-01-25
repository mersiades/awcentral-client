import { gql } from '@apollo/client';
import { PlaybookType } from '../@types/enums';
import { Playbook } from '../@types/staticDataInterfaces';

export interface PlaybookData {
  playbook: Playbook;
}

export interface PlaybookVars {
  playbookType: PlaybookType;
}

const PLAYBOOK = gql`
  query Playbook($playbookType: PlaybookType!) {
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
