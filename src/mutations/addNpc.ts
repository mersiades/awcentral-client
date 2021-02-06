import { gql } from '@apollo/client';
import { NpcInput } from '../@types';
import { Game } from '../@types/dataInterfaces';

export interface AddNpcData {
  addNpc: Game;
}

export interface AddNpcVars {
  gameRoleId: string;
  npc: NpcInput;
}

const ADD_NPC = gql`
  mutation AddNpc($gameRoleId: String!, $npc: NpcInput!) {
    addNpc(gameRoleId: $gameRoleId, npc: $npc) {
      id
      npcs {
        id
        name
        description
      }
    }
  }
`;

export default ADD_NPC;
