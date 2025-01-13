import fg from 'fast-glob';

/**
 * get globs
 *
 * @param patterns the glob patterns
 * @param exclude the glob exclude patterns
 * @param matchDir the glob match directory
 */
export function getGlobs(
  patterns: string[],
  exclude: string[],
  matchDir: string,
) {
  const { sync } = fg;

  const globs = sync(patterns, {
    cwd: matchDir,
    ignore: exclude,
    onlyFiles: true,
  });

  return globs.sort();
}
