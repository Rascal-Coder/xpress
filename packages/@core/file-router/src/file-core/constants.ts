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
 *   匹配以下格式：
 *   - "@routes" - 以 @ 开头的目录
 *   - "helloWorld" - 驼峰命名
 *   - "hello-world" - 中划线命名
 *   - "(auth)" - 分组目录
 *   - "[id]" - 动态路由目录
 */
export const PAGE_DIR_NAME_PATTERN =
  /^(?:[@\w-]+[0-9a-z]|\([a-z][a-z0-9-]*\)|\[[a-z][a-z0-9-]*\])$/i;

/**
 * 验证页面文件名的正则表达式
 *
 * @example
 *   匹配以下格式：
 *   - "index.tsx" - 基础页面
 *   - "layout.tsx" - 布局文件
 *   - "about.tsx" - 普通页面
 *   - "$sort.tsx" - 查询参数页面
 */
export const PAGE_FILE_NAME_PATTERN =
  /^(?:[a-z][\w-]*|\$[a-z][\w-]*)\.[a-z]+$/i;

/**
 * 验证包含方括号的页面文件名的正则表达式
 *
 * @example
 *   匹配以下格式：
 *   - "[id].tsx" - 动态路由
 *   - "[[id]].tsx" - 可选动态路由
 *   - "[...slug].tsx" - 通配符路由
 */
export const PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN =
  /^\[+(?:\.\.\.)?\w+\]+\.[a-z]+$/;

/**
 * 匹配大写字母的正则表达式
 *
 * @example
 *   匹配 "A"、"B"、"C" 等大写字母
 */
export const UPPERCASE_LETTER_PATTERN = /[A-Z]/g;

// 基础页面模式
export const PAGE_PATTERNS = [
  '**/index.tsx', // 基础页面
  '**/[[]*.tsx', // 动态路由
  '**/$*.tsx', // 查询参数页面
  '**/[[]]*.$*.tsx', // 动态路由带查询参数
  '**/layout.tsx', // 布局文件
  '**/(*)/**.tsx', // 分组目录下的所有 tsx 文件
];

// 排除模式
export const PAGE_EXCLUDE_PATTERNS = [
  '**/node_modules/**', // 排除 node_modules
  '**/.*/**', // 排除隐藏文件
  '**/dist/**', // 排除构建目录
  '**/test/**', // 排除测试文件
  '**/__tests__/**', // 排除测试目录
  '**/components/**', // 排除组件目录
  '**/utils/**', // 排除工具目录
  '**/types/**', // 排除类型目录
  '**/hooks/**', // 排除 hooks 目录
  '**/constants/**', // 排除常量目录
  '**/styles/**', // 排除样式目录
  '**/assets/**', // 排除资源目录
];

export const PAGE_DIR = 'src/@routes';
