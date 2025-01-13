import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * 确保文件存在，如果不存在，创建它
 *
 * @param filepath
 */
export async function ensureFile(filepath: string) {
  const exist = existsSync(filepath);

  if (!exist) {
    await mkdir(path.dirname(filepath), { recursive: true });
  }
}
