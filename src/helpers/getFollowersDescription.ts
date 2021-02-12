import { capitalize } from 'lodash';

export const getFollowersDescription = (characterization?: string, followers?: number, travelOption?: string) => {
  if (!characterization && !followers && !travelOption) {
    return '';
  } else if (characterization && !followers && !travelOption) {
    return capitalize(characterization);
  } else if (characterization && followers && !travelOption) {
    return `${capitalize(characterization)} ${
      characterization === 'your students' ? 'are' : 'is'
    } about ${followers} followers.`;
  } else if (!characterization && followers && !travelOption) {
    return `You have about ${followers} followers.`;
  } else if (!characterization && followers && travelOption) {
    return `You have about ${followers} followers. When you travel, they ${travelOption}.`;
  } else if (!characterization && !followers && travelOption) {
    return `When you travel, your followers ${travelOption}.`;
  } else if (characterization && followers && travelOption) {
    return `${capitalize(characterization)} ${
      characterization === 'your students' ? 'are' : 'is'
    } about ${followers} followers. When you travel, they ${travelOption}.`;
  }
};
