import { gql } from '@apollo/client';
import { Playbook } from '../@types/staticDataInterfaces';

export interface PlaybooksData {
  playbooks: Playbook[]
}

const PLAYBOOKS = gql`
  query Playbooks {
    playbooks {
      id
      playbookType
      barterInstructions
      intro
      introComment
      playbookImageUrl
    }
  }
`

export default PLAYBOOKS