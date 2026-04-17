const stopWords = new Set([
  "a",
  "an",
  "and",
  "for",
  "the",
  "to",
  "with",
  "in",
  "on",
  "of",
  "my",
  "your",
]);

export function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

export function tokenize(value: string) {
  return normalizeSearchText(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token && !stopWords.has(token));
}

export function buildSearchKeywords(parts: string[]) {
  const tokens = new Set<string>();

  for (const part of parts) {
    for (const token of tokenize(part)) {
      tokens.add(token);

      for (let index = 2; index <= token.length; index += 1) {
        tokens.add(token.slice(0, index));
      }
    }
  }

  return Array.from(tokens);
}

export function matchesSearch({
  haystack,
  query,
}: {
  haystack: string[];
  query?: string;
}) {
  if (!query) {
    return true;
  }

  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return true;
  }

  return tokens.every((token) => haystack.some((item) => item.includes(token)));
}
