export function capitalizeFirstLetter(string: String) {
  const words = string.split(" ");

  for (let i = 0; i < words?.length; i++) {
    words[i] = words[i][0]?.toUpperCase() + words[i].substr(1);
  }

  const words2 = words.join(" ");
  return words2;
}
