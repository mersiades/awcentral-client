export const formatPlaybookType = (playbookType: string) => {
  const lowercased = playbookType.toLowerCase()
  const uppercased = lowercased.charAt(0).toUpperCase() + lowercased.slice(1)
  return uppercased === "Maestro_d" ? "Maestro'D" : uppercased
}