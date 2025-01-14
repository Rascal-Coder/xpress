import { sync } from 'fast-glob';

/**
 * 获取匹配的文件路径列表
 *
 * 使用 fast-glob 库根据给定的匹配模式在指定目录下查找文件。
 * 该函数会同步执行文件查找，并返回排序后的文件路径数组。
 *
 * @param patterns - glob 匹配模式数组，用于指定要查找的文件模式，例如: ['**\/*.tsx', '**\/*.jsx']
 * @param exclude - 要排除的 glob 模式数组，这些模式匹配的文件将被忽略，例如: ['**\/node_modules/**', '**\/dist/**']
 * @param matchDir - 要搜索的根目录路径
 * @returns 返回按字母顺序排序的匹配文件路径数组
 *
 * @example
 * const files = getGlobs(['**\/*.tsx'], ['**\/components/**'], 'src/pages');
 * // 返回: ['index.tsx', 'about/index.tsx', ...]
 */
export function getGlobs(
  patterns: string[],
  exclude: string[],
  matchDir: string,
) {
  const globs = sync(patterns, {
    cwd: matchDir,
    ignore: exclude,
    onlyFiles: true,
  });
  return globs.sort();
}
