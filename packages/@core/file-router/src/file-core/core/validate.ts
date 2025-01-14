import { consola } from 'consola';

import {
  PAGE_DIR,
  PAGE_DIR_NAME_PATTERN,
  PAGE_FILE_NAME_PATTERN,
  PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN,
  PATH_SPLITTER,
  UPPERCASE_LETTER_PATTERN,
} from '../constants';

type ValidateCondition = [boolean, string];

/**
 * 验证页面的 glob 路径
 *
 * 用于验证页面文件的 glob 路径是否符合规范，包括：
 * 1. 必须包含父目录（除了 PAGE_DIR目录下的文件）
 * 2. 目录名必须符合命名规范
 * 3. 文件名必须符合命名规范
 * 4. 建议使用小写字母
 *
 * @param glob - 页面 glob 字符串
 * @param globPath - 页面 glob 的完整路径
 * @returns 是否有效的布尔值
 *
 * @example
 * // 有效的 glob 路径
 * handleValidatePageGlob('users/index.tsx', 'src/pages/users/index.tsx'); // 返回 true
 * handleValidatePageGlob('users/[id].tsx', 'src/pages/users/[id].tsx'); // 返回 true
 * handleValidatePageGlob('@routes/index.tsx', 'src/@routes/index.tsx'); // 返回 true
 *
 * // 无效的 glob 路径
 * handleValidatePageGlob('index.tsx', 'src/pages/index.tsx'); // 返回 false，缺少父目录
 * handleValidatePageGlob('users/$invalid.tsx', 'src/pages/users/$invalid.tsx'); // 返回 false，文件名无效
 * handleValidatePageGlob('USERS/index.tsx', 'src/pages/USERS/index.tsx'); // 返回 true，但会有大写字母警告
 */
export function handleValidatePageGlob(glob: string, globPath: string) {
  // 将 glob 按路径分隔符拆分，并反转数组以便于处理文件名和目录名
  const dirAndFile = glob.split(PATH_SPLITTER).reverse();
  const [file = '', ...dirs] = dirAndFile;

  // 检查是否在 PAGE_DIR 目录下
  const isInRoutesDir = globPath.includes(PAGE_DIR);

  // 定义验证条件的数组，每个条件由一个布尔值和一个错误信息组成
  const validateConditions: ValidateCondition[] = [
    // 1. 检查 glob 是否包含父目录（除了 @routes 目录下的文件）
    [
      !isInRoutesDir && dirAndFile.length < 2,
      `The glob "${globPath}" is invalid, it must has the parent directory.`,
    ],
    // 2. 检查目录名是否有效
    ...dirs.map(
      (dir) =>
        [
          !PAGE_DIR_NAME_PATTERN.test(dir),
          `The directory name "${dir}" of the glob "${globPath}" is invalid.`,
        ] as ValidateCondition,
    ),
    // 3. 检查文件名是否有效
    [
      !PAGE_FILE_NAME_PATTERN.test(file) &&
        !PAGE_FILE_NAME_WITH_SQUARE_BRACKETS_PATTERN.test(file),
      `The file name "${file}" of the glob "${globPath}" is invalid.`,
    ],
  ];

  // 如果 glob 中包含大写字母，记录信息提示建议使用小写字母
  if (UPPERCASE_LETTER_PATTERN.test(glob)) {
    consola.info(
      `The glob "${glob}" contains uppercase letters, it recommended to use lowercase letters.`,
    );
  }

  // 遍历所有验证条件，输出警告信息并返回验证结果
  const isValid = validateConditions.every(([condition, error]) => {
    if (condition) {
      consola.warn(error);
    }
    return !condition;
  });

  return isValid;
}
