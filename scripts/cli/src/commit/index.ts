import type { CAC } from 'cac';

import type { Lang } from './locales';

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { colors, execaCommand } from '@xpress/node-utils';

import {
  intro,
  isCancel,
  note,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';

import { locales } from './locales';

/**
 * Git commit with Conventional Commits standard
 * @param lang 语言选项
 */
export async function gitCommit(lang: Lang = 'en-us') {
  const { gitCommitMessages, gitCommitScopes, gitCommitTypes } = locales[lang];

  // 开始提示
  intro(`${colors.blue('📝')} ${gitCommitMessages.intro}`);

  // 1. 选择提交类型
  const type = await select({
    message: gitCommitMessages.types,
    options: gitCommitTypes.map(([value, msg]) => ({
      label: `${value.padEnd(12)}: ${msg}`,
      value,
    })),
  });

  if (isCancel(type)) {
    note(gitCommitMessages.canceled, 'red');
    return;
  }

  // 2. 选择提交范围
  const scope = await select({
    message: gitCommitMessages.scopes,
    options: [
      { label: gitCommitMessages.noScope, value: '' },
      ...gitCommitScopes.map(([value, msg]) => ({
        label: `${value.padEnd(30)}: ${msg}`,
        value,
      })),
    ],
  });

  if (isCancel(scope)) {
    note(gitCommitMessages.canceled, 'red');
    return;
  }

  // 3. 输入提交描述
  const description = await text({
    message: gitCommitMessages.description,
    placeholder: 'Enter a brief commit description...',
    validate: (value) => {
      if (!value) return gitCommitMessages.emptyDescription;
      if (value.length > 100) return gitCommitMessages.descriptionTooLong;
      return undefined;
    },
  });

  if (isCancel(description)) {
    note(gitCommitMessages.canceled, 'red');
    return;
  }

  const breaking = description.startsWith('!') ? '!' : '';
  const finalDescription = description.replace(/^!/, '').trim();
  const scopePart = scope ? `(${scope})` : '';
  const commitMsg = `${type}${scopePart}${breaking}: ${finalDescription}`;

  const s = spinner();
  s.start(gitCommitMessages.committing);

  try {
    await execaCommand(`git commit -m "${commitMsg}"`, {
      shell: true,
      stdio: 'inherit',
    });
    // s.stop();
    outro(gitCommitMessages.commitSuccess);
  } catch (error) {
    // s.stop();
    note(gitCommitMessages.commitFailed, 'red');
    console.error(error);
  }
}

/** Git commit message verify */
export async function gitCommitVerify(
  lang: Lang = 'en-us',
  ignores: RegExp[] = [],
) {
  const { stdout: gitPath } = await execaCommand(
    'git rev-parse --show-toplevel',
  );

  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  if (ignores.some((regExp) => regExp.test(commitMsg))) return;

  const REG_EXP = /[a-z]+(?:\(.+\))?!?: .+/i;

  if (!REG_EXP.test(commitMsg)) {
    const errorMsg = locales[lang].gitCommitVerify;
    throw new Error(errorMsg);
  }
}

export function defineCommitCommand(cac: CAC): void {
  cac
    .command('commit')
    .usage('Git commit message')
    .option('-l, --lang <lang>', '选择语言 (en-us/zh-cn)', { default: 'zh-cn' })
    .action(async (options) => {
      await gitCommit(options.lang);
    });
}

export function defineCommitVerifyCommand(cac: CAC): void {
  cac
    .command('commit:verify')
    .usage('Git commit message verify')
    .option('-l, --lang <lang>', '选择语言 (en-us/zh-cn)', { default: 'zh-cn' })
    .option('-i, --ignores <patterns...>', '忽略的提交信息正则表达式')
    .action(async (options) => {
      const ignores = options.ignores
        ? options.ignores.map((pattern: string) => new RegExp(pattern))
        : [];
      await gitCommitVerify(options.lang, ignores);
    });
}
