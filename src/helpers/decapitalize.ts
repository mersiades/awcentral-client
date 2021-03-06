export const decapitalize = (playbookType: string) => {
  const lowercased = playbookType.toLowerCase();
  const uppercased = lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
  const noUnderscore = uppercased.replace(/_/g, ' ');
  return noUnderscore === 'Maestro d' ? "Maestro D'" : noUnderscore;
};
