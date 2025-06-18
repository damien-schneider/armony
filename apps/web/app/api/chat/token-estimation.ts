const avgtokenPerClass = {
  C4: 0.08086208692099685,
  C0: 0.2020182639633662,
  C6: 0.2372744211422125,
  C2: 0.3042805747355606,
  C5: 0.4157646363858563,
  C1: 0.4790556468110302,
  C3: 0.6581971122770317,
  CX: 0.980083857442348,
};
const C0 = "NORabcdefghilnopqrstuvy"; // plus space that is not following a space
const C1 = "\"#%)*+56789<>?@Z[\\]^|§«äç'";
const C2 = "-.ABDEFGIKWY_\r\tz{ü";
const C3 = ",01234:~Üß"; // incl. unicode characters > 255
const C4 = ""; // space that is following a space
const C5 = "!$&(/;=JX`j\n}ö";
const C6 = "CHLMPQSTUVfkmspwx ";

const allClusters = [C0, C1, C2, C3, C4, C5, C6];

type ClusterKey = keyof typeof avgtokenPerClass;

function getClusterKeyForCharacter(token: string, pos: number): ClusterKey {
  const char = token[pos];
  if (char === undefined) {
    return "CX";
  }
  if (char === " ") {
    if (pos > 0 && token[pos - 1] === " ") {
      return "C4";
    }
    return "C0";
  }
  if (char.charCodeAt(0) > 255) {
    return "C3";
  }
  for (let i = 0; i < allClusters.length; i++) {
    const cluster = allClusters[i];
    if (cluster && char && cluster.indexOf(char) !== -1) {
      return `C${i}` as ClusterKey;
    }
  }
  return "CX";
}

export function estimateTextTokens(text: string): number {
  let tokencount = 0;
  for (let i = 0; i < text.length; i++) {
    const clusterKey = getClusterKeyForCharacter(text, i);
    tokencount += avgtokenPerClass[clusterKey];
  }
  return Math.round(tokencount);
}
