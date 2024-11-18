import type { CAC } from 'cac';

import { extname } from 'node:path';

import { getStagedFiles } from '@xpress/node-utils';

import { circularDepsDetect, printCircles } from 'circular-dependency-scanner';

// 定义需要忽略的目录列表
const IGNORE_DIR = [
  'dist',
  '.turbo',
  'output',
  '.cache',
  'scripts',
  'internal',
].join(',');

// 构建忽略模式
const IGNORE = [`**/{${IGNORE_DIR}}/**`];

// 命令选项接口定义
interface CommandOptions {
  staged: boolean; // 是否为暂存模式
  verbose: boolean; // 是否显示详细输出
}

// 检查循环依赖的主要函数
async function checkCircular({ staged, verbose }: CommandOptions) {
  // 检测项目中的循环依赖
  const results = await circularDepsDetect({
    absolute: staged,
    cwd: process.cwd(),
    ignore: IGNORE,
  });

  if (staged) {
    // 获取git暂存区的文件
    let files = await getStagedFiles();

    // 定义允许检查的文件扩展名
    const allowedExtensions = new Set([
      '.cjs',
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
    ]);

    // 过滤出允许的文件类型
    files = files.filter((file) => allowedExtensions.has(extname(file)));

    // 存储包含暂存文件的循环依赖
    const circularFiles: string[][] = [];

    // 检查暂存文件是否存在于循环依赖中
    for (const file of files) {
      for (const result of results) {
        const resultFiles = result.flat();
        if (resultFiles.includes(file)) {
          circularFiles.push(result);
        }
      }
    }
    // 如果开启详细模式，打印循环依赖信息
    verbose && printCircles(circularFiles);
  } else {
    // 非暂存模式下，直接打印所有循环依赖
    verbose && printCircles(results);
  }
}

// 定义命令行接口
function defineCheckCircularCommand(cac: CAC) {
  cac
    .command('check-circular')
    .option(
      '--staged',
      'Whether it is the staged commit mode, in which mode, if there is a circular dependency, an alarm will be given.',
    )
    .usage(`Analysis of project circular dependencies.`)
    .action(async ({ staged }) => {
      await checkCircular({ staged, verbose: true });
    });
}

export { defineCheckCircularCommand };
