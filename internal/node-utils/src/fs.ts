import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';

/**
 * 将数据以 JSON 格式写入指定文件
 * @param filePath - 目标文件路径
 * @param data - 要写入的数据
 * @param spaces - JSON 字符串的缩进空格数，默认为 2
 * @throws 如果写入过程中发生错误
 * @example
 * ```ts
 * // 写入配置文件
 * await outputJSON('./config.json', {
 *   name: 'my-app',
 *   version: '1.0.0',
 *   settings: { theme: 'dark' }
 * });
 * ```
 */
export async function outputJSON(
  filePath: string,
  data: any,
  spaces: number = 2,
) {
  try {
    const dir = dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    const jsonData = JSON.stringify(data, null, spaces);
    await fs.writeFile(filePath, jsonData, 'utf8');
  } catch (error) {
    console.error('Error writing JSON file:', error);
    throw error;
  }
}

/**
 * 确保文件存在，如果文件不存在则创建它
 * 如果父目录不存在，会递归创建所需的目录结构
 * @param filePath - 要确保存在的文件路径
 * @throws 如果创建文件过程中发生错误
 * @example
 * ```ts
 * // 确保日志文件存在
 * await ensureFile('./logs/app.log');
 *
 * // 确保深层目录中的文件存在
 * await ensureFile('./data/users/profiles/user1.json');
 * ```
 */
export async function ensureFile(filePath: string) {
  try {
    const dir = dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, '', { flag: 'a' });
  } catch (error) {
    console.error('Error ensuring file:', error);
    throw error;
  }
}

/**
 * 读取并解析 JSON 文件
 * @param filePath - 要读取的 JSON 文件路径
 * @returns 解析后的 JSON 数据
 * @throws 如果读取或解析过程中发生错误
 * @example
 * ```ts
 * // 读取配置文件
 * const config = await readJSON('./config.json');
 * console.log(config.settings.theme); // 'dark'
 *
 * // 使用 try-catch 处理错误
 * try {
 *   const data = await readJSON('./data.json');
 *   // 处理数据...
 * } catch (error) {
 *   console.error('无法读取配置文件:', error);
 * }
 * ```
 */
export async function readJSON(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
}
