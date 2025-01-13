import type { LogType } from 'consola';

import { consola } from 'consola';
import { lightGreen } from 'kolorist';

export function log(msg: string, type: LogType, show = true) {
  if (!show) return;

  consola[type](`${lightGreen('[xpress-router]')} ${msg}`);
}
