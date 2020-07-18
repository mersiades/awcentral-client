/**
 * For an OAuth2 `state` parameter
 * From https://discordjs.guide/oauth2/#more-details
 */
const generateRandomString = () => {
  const rand = Math.floor(Math.random() * 10);
  let randStr = '';

  for (let i = 0; i < 20 + rand; i++) {
    randStr += String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }

  return randStr;
};

export default generateRandomString;
