import { promises as fs } from 'node:fs';
import { join } from 'node:path';

// ANSI 颜色代码
const COLORS = {
  blue: '\u001B[34m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  reset: '\u001B[0m',
};

// Unicode 符号
const UNICODE = {
  FAILURE: '\u2716', // ✖
  SUCCESS: '\u2714', // ✔
};

// 简单实现控制台日志
const logger = {
  error: (...args) =>
    console.log(COLORS.red + UNICODE.FAILURE, args.join(' ') + COLORS.reset),
  info: (...args) => console.log(COLORS.blue + args.join(' ') + COLORS.reset),
  log: console.log,
  success: (...args) =>
    console.log(COLORS.green + UNICODE.SUCCESS, args.join(' ') + COLORS.reset),
};

/**
 * 递归查找并删除目标目录
 * @param {string} currentDir - 当前目录
 * @param {string[]} targets - 目标文件/目录
 * @param {object} stats - 统计信息
 * @param {boolean} verbose - 是否显示详细日志
 */
async function cleanTargetsRecursively(currentDir, targets, stats, verbose) {
  try {
    const items = await fs.readdir(currentDir);

    await Promise.all(
      items.map(async (item) => {
        try {
          const itemPath = join(currentDir, item);
          const stat = await fs.lstat(itemPath);

          if (targets.includes(item)) {
            await fs.rm(itemPath, { force: true, recursive: true });
            stats.deletedCount++;
            verbose && logger.success(`已删除: ${itemPath}`);
            return;
          }

          if (stat.isDirectory()) {
            await cleanTargetsRecursively(itemPath, targets, stats, verbose);
          }
        } catch (error) {
          stats.errorCount++;
          logger.error(`处理 ${item} 时出错: ${error.message}`);
        }
      }),
    );
  } catch (error) {
    stats.errorCount++;
    logger.error(`访问目录 ${currentDir} 时出错: ${error.message}`);
  }
}

/**
 * 执行清理
 * @param {object} options - 选项
 * @param {boolean} options.delLock - 是否删除 lock 文件
 * @param {boolean} options.verbose - 是否显示详细日志
 */
async function runClean({ delLock, verbose }) {
  const rootDir = process.cwd();
  const targets = ['node_modules', 'dist', '.turbo', 'dist.zip'];

  if (delLock) {
    targets.push('pnpm-lock.yaml');
  }

  logger.info('🧹 开始清理...');
  logger.info(`📋 清理目标: ${targets.join(', ')}`);
  logger.info(`📂 根目录: ${rootDir}`);

  const stats = { deletedCount: 0, errorCount: 0 };

  try {
    await cleanTargetsRecursively(rootDir, targets, stats, verbose);

    logger.log('');
    logger.success(`已删除 ${stats.deletedCount} 个项目`);
    if (stats.errorCount > 0) {
      logger.error(`遇到 ${stats.errorCount} 个错误`);
    }
  } catch (error) {
    logger.error(`清理过程中发生错误: ${error.message}`);
    process.exit(1);
  }
}

// 解析命令行参数
const options = {
  delLock: process.argv.includes('--del-lock'),
  verbose: process.argv.includes('--verbose'),
};

// 执行清理
runClean(options);
