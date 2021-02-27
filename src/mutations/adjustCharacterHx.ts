import { gql } from '@apollo/client';
import { HxInput } from '../@types';
import { Character, HxStat } from '../@types/dataInterfaces';

export interface AdjustCharacterHxData {
  adjustCharacterHx: Character;
  __typename?: 'Mutation';
}

export interface AdjustCharacterHxVars {
  gameRoleId: string;
  characterId: string;
  hxStat: HxInput;
}

export const getAdjustCharacterHxOR = (character: Character, hxInput: HxInput) => {
  const index = character.hxBlock.findIndex((hxStat) => hxStat.id === hxInput.id);
  let optimisticHxBlock = [...character.hxBlock];
  if (index > -1) {
    optimisticHxBlock[index] = hxInput as HxStat;
  } else {
    optimisticHxBlock = [...optimisticHxBlock, hxInput as HxStat];
  }
  optimisticHxBlock.forEach((hxStat1) => ({ ...hxStat1, __typename: 'HxStat' }));
  return {
    __typename: 'Mutation',
    adjustCharacterHx: {
      ...character,
      hxBlock: optimisticHxBlock,
      __typename: 'Character',
    },
  };
};

const ADJUST_CHARACTER_HX = gql`
  mutation AdjustCharacterHx($gameRoleId: String!, $characterId: String!, $hxStat: HxInput!) {
    adjustCharacterHx(gameRoleId: $gameRoleId, characterId: $characterId, hxStat: $hxStat) {
      id
      name
      playbook
      hxBlock {
        id
        characterId
        characterName
        hxValue
      }
    }
  }
`;

export default ADJUST_CHARACTER_HX;
