export const getAuthHeader = () => {
  const accessToken = localStorage.getItem('access_token');
  return `Bearer ${accessToken}`;
};
