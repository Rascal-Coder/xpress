export type LocationQueryValue = null | string;

/**
 * Normalized query object that appears in {@link RouteLocationNormalized}
 *
 * @public
 */
export type LocationQuery = Record<
  string,
  LocationQueryValue | LocationQueryValue[]
>;
export type LocationQueryValueRaw = LocationQueryValue | number | undefined;

export type LocationQueryRaw = Record<
  number | string,
  LocationQueryValueRaw | LocationQueryValueRaw[]
>;

/**
 * Transforms a queryString into a {@link LocationQuery} object. Accept both, a version with the leading `?` and without
 * Should work as URLSearchParams
 *
 * @param search - search string to parse
 * @returns a query object
 * @internal
 */

export const PLUS_RE = /\+/g; // %2B

const EQUAL_RE = /[=]/g; // %3D

const ENC_BRACKET_OPEN_RE = /%5B/g; // [
const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
const ENC_CARET_RE = /%5E/g; // ^
const ENC_BACKTICK_RE = /%60/g; // `
const ENC_CURLY_OPEN_RE = /%7B/g; // {
const ENC_PIPE_RE = /%7C/g; // |
const ENC_CURLY_CLOSE_RE = /%7D/g; // }
const ENC_SPACE_RE = /%20/g; // }
const HASH_RE = /#/g; // %23
const AMPERSAND_RE = /&/g; // %26
export function parseQuery(search: string): LocationQuery {
  const query: LocationQuery = {};

  if (!search || search === '?' || search === '#') {
    return query;
  }

  const searchParams =
    search.charAt(0) === '?' ? search.slice(1).split('&') : search.split('&');

  for (const param of searchParams) {
    if (!param) continue;

    // 预处理 + 号为空格
    const searchParam = param.replaceAll(PLUS_RE, ' ');
    const eqPos = searchParam.indexOf('=');

    try {
      const key = decode(
        eqPos === -1 ? searchParam : searchParam.slice(0, eqPos),
      );
      const value = eqPos === -1 ? null : decode(searchParam.slice(eqPos + 1));

      // 处理数组参数
      if (key in query) {
        const currentValue = query[key];
        if (Array.isArray(currentValue)) {
          currentValue.push(value);
        } else {
          query[key] =
            currentValue === undefined ? [value] : [currentValue, value];
        }
      } else {
        query[key] = value;
      }
    } catch (error) {
      console.warn(`Failed to parse query parameter: ${param}`, error);
    }
  }

  return query;
}

export function stringifyQuery(query: LocationQueryRaw): string {
  if (!query || Object.keys(query).length === 0) {
    return '';
  }

  const parts: string[] = [];

  for (const [key, value] of Object.entries(query)) {
    const encodedKey = encodeQueryKey(key);

    if (value === null) {
      parts.push(encodedKey);
      continue;
    }

    if (value === undefined) {
      continue;
    }

    const values = Array.isArray(value) ? value : [value];

    for (const val of values) {
      if (val === undefined) continue;

      const part = encodedKey;
      if (val === null) {
        parts.push(part);
      } else {
        parts.push(`${part}=${encodeQueryValue(val)}`);
      }
    }
  }

  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

export function decode(text: number | string): string {
  try {
    return decodeURIComponent(String(text));
  } catch (error) {
    console.warn(`Failed to decode "${text}":`, error);
    return String(text);
  }
}

export function encodeQueryKey(text: number | string): string {
  return encodeQueryValue(text).replaceAll(EQUAL_RE, '%3D');
}

export function encodeQueryValue(text: number | string): string {
  return commonEncode(text)
    .replaceAll(PLUS_RE, '%2B')
    .replaceAll(ENC_SPACE_RE, '+')
    .replaceAll(HASH_RE, '%23')
    .replaceAll(AMPERSAND_RE, '%26')
    .replaceAll(ENC_BACKTICK_RE, '`')
    .replaceAll(ENC_CURLY_OPEN_RE, '{')
    .replaceAll(ENC_CURLY_CLOSE_RE, '}')
    .replaceAll(ENC_CARET_RE, '^');
}

function commonEncode(text: number | string): string {
  return encodeURI(String(text))
    .replaceAll(ENC_PIPE_RE, '|')
    .replaceAll(ENC_BRACKET_OPEN_RE, '[')
    .replaceAll(ENC_BRACKET_CLOSE_RE, ']');
}
