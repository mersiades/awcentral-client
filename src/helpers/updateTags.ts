// Takes in an existing array of tags,
// and then adds/removes a new tag based on whether it starts with + or -
// Removes on -, adds on +
export const updateTags = (existingTags: string[], newTags: string[]) => {
  let updatedTags = existingTags;
  newTags.forEach((newTag) => {
    let tagPrefix = newTag[0];
    let tag = newTag.substring(1);
    if (tagPrefix === '-') {
      updatedTags = updatedTags.filter((t) => t !== tag);
    } else if (tagPrefix === '+') {
      updatedTags = [...updatedTags, tag];
    } else {
      console.warn('incorrect tag prefix', newTag);
    }
  });
  return updatedTags;
};

// Takes in an existing array of tags,
// and then adds/removes a new tag based on whether it starts with + or -
// Removes on +, adds on -
export const unUpdateTags = (existingTags: string[], newTags: string[]) => {
  let updatedTags = existingTags;
  newTags.forEach((newTag) => {
    let tagPrefix = newTag[0];
    let tag = newTag.substring(1);
    if (tagPrefix === '+') {
      updatedTags = updatedTags.filter((t) => t !== tag);
    } else if (tagPrefix === '-') {
      updatedTags = [...updatedTags, tag];
    } else {
      console.warn('incorrect tag prefix', newTag);
    }
  });
  return updatedTags;
};
