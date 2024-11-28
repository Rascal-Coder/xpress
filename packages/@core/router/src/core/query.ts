/**
 * 表示查询参数的值类型
 * @public
 */
export type LocationQueryValue = null | string;

/**
 * 标准化的查询对象，用于 {@link RouteLocationNormalized}
 * @public
 *
 * @example
 * ```ts
 * const query: LocationQuery = {
 *   id: '123',
 *   tags: ['news', 'tech'],
 *   search: null
 * };
 * ```
 */
export type LocationQuery = Record<
  string,
  LocationQueryValue | LocationQueryValue[]
>;

/**
 * 原始查询参数值类型
 * @public
 */
export type LocationQueryValueRaw = LocationQueryValue | number | undefined;

/**
 * 原始查询对象类型
 * @public
 *
 * @example
 * ```ts
 * const rawQuery: LocationQueryRaw = {
 *   page: 1,
 *   limit: undefined,
 *   sort: ['name', 'age']
 * };
 * ```
 */
export type LocationQueryRaw = Record<
  number | string,
  LocationQueryValueRaw | LocationQueryValueRaw[]
>;

// 预编译正则表达式以提高性能
const REGEX = {
  AMPERSAND: /&/g,
  ENC_BACKTICK: /%60/g,
  ENC_BRACKET_CLOSE: /%5D/g,
  ENC_BRACKET_OPEN: /%5B/g,
  ENC_CARET: /%5E/g,
  ENC_CURLY_CLOSE: /%7D/g,
  ENC_CURLY_OPEN: /%7B/g,
  ENC_PIPE: /%7C/g,
  ENC_SPACE: /%20/g,
  EQUAL: /[=]/g,
  HASH: /#/g,
  PLUS: /\+/g,
} as const;

/**
 * 将查询字符串转换为 LocationQuery 对象
 * @param search - 要解析的查询字符串，可以包含前导 `?` 或不包含
 * @returns 解析后的查询对象
 * @throws 如果解码过程中出现错误，会记录警告并返回原始值
 *
 * @example
 * ```ts
 * // 基本用法
 * parseQuery('?name=john&age=25')
 * // 返回: { name: 'john', age: '25' }
 *
 * // 数组参数
 * parseQuery('tags=news&tags=tech')
 * // 返回: { tags: ['news', 'tech'] }
 *
 * // 空值参数
 * parseQuery('search&empty=')
 * // 返回: { search: null, empty: '' }
 * ```
 * @internal
 */
export function parseQuery(search: string): LocationQuery {
  if (!search || search === '?' || search === '#') {
    return {};
  }

  const query: LocationQuery = {};
  const hasLeadingIM = search.startsWith('?');
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');

  for (const param of searchParams) {
    if (!param) continue;

    const searchParam = param.replaceAll(REGEX.PLUS, ' ');
    const eqPos = searchParam.indexOf('=');

    try {
      const key = decode(
        eqPos === -1 ? searchParam : searchParam.slice(0, eqPos),
      );
      const value: LocationQueryValue =
        eqPos === -1 ? null : decode(searchParam.slice(eqPos + 1));

      if (key in query) {
        const currentValue = query[key];
        if (Array.isArray(currentValue)) {
          // 确保类型安全的数组操作
          (currentValue as LocationQueryValue[]).push(value);
        } else {
          // 创建新数组时确保类型安全
          query[key] = [currentValue as LocationQueryValue, value];
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

/**
 * 将查询对象序列化为查询字符串
 * @param query - 要序列化的查询对象
 * @returns 序列化后的查询字符串
 *
 * @example
 * ```ts
 * // 基本对象
 * stringifyQuery({ name: 'john', age: 25 })
 * // 返回: 'name=john&age=25'
 *
 * // 数组值
 * stringifyQuery({ tags: ['news', 'tech'] })
 * // 返回: 'tags=news&tags=tech'
 *
 * // 特殊值处理
 * stringifyQuery({
 *   empty: null,      // 将被序列化为 'empty'
 *   skip: undefined,  // 将被跳过
 *   zero: 0          // 将被序列化为 'zero=0'
 * })
 * ```
 */
export function stringifyQuery(query: LocationQueryRaw): string {
  if (!query) return '';

  const parts: string[] = [];

  function processValue(
    rawValue: LocationQueryValueRaw | LocationQueryValueRaw[],
  ): LocationQueryValue[] {
    // 处理 null 和 undefined
    if (rawValue === null) return [null];
    if (rawValue === undefined) return [];

    // 处理数组
    if (Array.isArray(rawValue)) {
      const result: LocationQueryValue[] = [];
      for (const val of rawValue) {
        // 跳过 undefined 值
        if (val === undefined) continue;
        // 处理 null 值
        if (val === null) {
          result.push(null);
          continue;
        }
        // 处理其他值（数字或字符串）
        result.push(String(val));
      }
      return result;
    }

    // 处理单个值
    return [String(rawValue)];
  }

  // 处理每个键值对
  for (const [key, rawValue] of Object.entries(query)) {
    const encodedKey = encodeQueryKey(key);
    const values = processValue(rawValue);

    for (const value of values) {
      // 此时 value 一定是 LocationQueryValue 类型（string | null）
      if (value === null) {
        parts.push(encodedKey);
      } else {
        parts.push(`${encodedKey}=${encodeQueryValue(value)}`);
      }
    }
  }

  return parts.join('&');
}

/**
 * 解码 URL 编码的文本
 * @param text - 要解码的文本
 * @returns 解码后的字符串
 * @internal
 */
export function decode(text: number | string): string {
  try {
    return decodeURIComponent(String(text));
  } catch (error) {
    console.warn(`Failed to decode "${text}":`, error);
    return String(text);
  }
}

/**
 * 编码查询参数的键
 * @param text - 要编码的键
 * @returns 编码后的字符串
 * @internal
 */
export function encodeQueryKey(text: number | string): string {
  return encodeQueryValue(text).replaceAll(REGEX.EQUAL, '%3D');
}

/**
 * 编码查询参数的值
 * @param text - 要编码的值
 * @returns 编码后的字符串
 * @internal
 */
export function encodeQueryValue(text: number | string): string {
  return commonEncode(text)
    .replaceAll(REGEX.PLUS, '%2B')
    .replaceAll(REGEX.ENC_SPACE, '+')
    .replaceAll(REGEX.HASH, '%23')
    .replaceAll(REGEX.AMPERSAND, '%26')
    .replaceAll(REGEX.ENC_BACKTICK, '`')
    .replaceAll(REGEX.ENC_CURLY_OPEN, '{')
    .replaceAll(REGEX.ENC_CURLY_CLOSE, '}')
    .replaceAll(REGEX.ENC_CARET, '^');
}

/**
 * 通用编码函数
 * @param text - 要编码的文本
 * @returns 编码后的字符串
 * @internal
 */
function commonEncode(text: number | string): string {
  return encodeURI(String(text))
    .replaceAll(REGEX.ENC_PIPE, '|')
    .replaceAll(REGEX.ENC_BRACKET_OPEN, '[')
    .replaceAll(REGEX.ENC_BRACKET_CLOSE, ']');
}
