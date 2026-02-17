import { normalize } from "./normalize";
import { estilosAdjetivos } from "./styleData";

/**
 * Finds matching styles based on input adjectives
 */
export function findMatchingStyles(
  inputString: string,
  estilosAdjetivosMap: typeof estilosAdjetivos = estilosAdjetivos
): string[] {
  // Normalize input adjectives
  const inputAdjectives = inputString
    .split(",")
    .map((a) => normalize(a.trim()));

  // Count matches per style
  const matches = Object.entries(estilosAdjetivosMap).map(
    ([style, adjectives]) => {
      const count = adjectives.filter((adj) =>
        inputAdjectives.includes(normalize(adj))
      ).length;
      return { style, count };
    }
  );

  // Filter out styles with 0 matches, sort by count desc, return only keys
  return matches
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((m) => m.style);
}
