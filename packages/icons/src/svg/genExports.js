#!/usr/bin/env node
/**
 * SVG图标导出生成器
 *
 * 这个脚本自动扫描 icons 目录下的所有 SVG 文件，并生成相应的导出语句。
 *
 * 使用方法:
 * 1. 确保已经安装了所需依赖
 * 2. 运行 `node genExports.js` 或 `npm run gen-icons`
 *
 * 脚本将自动更新 index.ts 文件中的导出部分。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置项
const iconsDir = path.join(__dirname, 'icons');
const indexFilePath = path.join(__dirname, 'index.ts');

// 读取所有SVG文件
function getSvgFiles() {
  return fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith('.svg'))
    .map((file) => file.slice(0, -4)); // 移除.svg后缀
}

// 转换文件名为组件名
function getComponentName(filename) {
  return `Svg${filename
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}Icon`;
}

// 生成图标定义和导出代码
function generateIconsCode(svgFiles) {
  const imports = `import { createIconifyIcon } from '@xpress-core/icons';\nimport './load';\n\n`;

  const declarations = svgFiles
    .map((filename) => {
      const componentName = getComponentName(filename);
      return `const ${componentName} = createIconifyIcon('svg:${filename}');`;
    })
    .join('\n');

  const exports = `\nexport {\n  ${svgFiles.map((filename) => getComponentName(filename)).join(',\n  ')},\n};\n`;

  return imports + declarations + exports;
}

// 更新index.ts文件
function updateIndexFile(code) {
  try {
    fs.writeFileSync(indexFilePath, code);
    console.error('成功更新index.ts文件');
  } catch (error) {
    console.error('更新文件失败:', error);
  }
}

// 主函数
function main() {
  try {
    const svgFiles = getSvgFiles();
    const code = generateIconsCode(svgFiles);
    updateIndexFile(code);
  } catch (error) {
    console.error('生成导出语句失败:', error);
  }
}

main();
