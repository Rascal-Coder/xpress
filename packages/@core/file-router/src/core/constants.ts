/**
 * the path splitter
 *
 * @example
 *   /a/b / c;
 */
export const PATH_SPLITTER = '/';

/**
 * the page degree splitter
 *
 * @example
 *   a_b_c;
 */
export const PAGE_DEGREE_SPLITTER = '_';

/**
 * 验证页面目录名的正则表达式
 *
 * @example
 *   匹配 "helloWorld"、"hello-world" 等字符串
 */
export const PAGE_DIR_NAME_PATTERN = /^[\w-]+[0-9a-z]$/i;

/**
 * 验证页面文件名的正则表达式
 *
 * @example
 *   匹配 "helloWorld.vue"、"hello-world.js"、"helloWorld.tsx" 等字符串
 */
export const PAGE_FILE_NAME_PATTERN =
  /^[0-9a-zA-Z][0-9a-zA-Z-]+[0-9a-zA-Z]\.[a-z]+$/;

/**
 * 验证包含方括号的页面文件名的正则表达式
 *
 * @example
 *   匹配 "[id].vue"、"[name].js"、"[id].tsx" 等字符串
 */
export const PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN = /^\[\w+\]\.[a-z]+$/;

/**
 * 匹配大写字母的正则表达式
 *
 * @example
 *   匹配 "A"、"B"、"C" 等大写字母
 */
export const UPPERCASE_LETTER_PATTERN = /[A-Z]/g;
