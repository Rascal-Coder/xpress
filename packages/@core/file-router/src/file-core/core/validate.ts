import { consola } from 'consola';

import {
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
 * @param glob 页面 glob 字符串
 * @param globPath 页面 glob 的完整路径
 * @returns 是否有效的布尔值
 */
export function handleValidatePageGlob(glob: string, globPath: string) {
  // 将 glob 按路径分隔符拆分，并反转数组以便于处理文件名和目录名
  const dirAndFile = glob.split(PATH_SPLITTER).reverse();
  const [file = '', ...dirs] = dirAndFile;

  // 定义验证条件的数组，每个条件由一个布尔值和一个错误信息组成
  const validateConditions: ValidateCondition[] = [
    // 1. 检查 glob 是否包含父目录
    [
      dirAndFile.length < 2,
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
