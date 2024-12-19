/* eslint-disable perfectionist/sort-objects */
/* eslint-disable regexp/no-unused-capturing-group */
import type { CAC } from 'cac';

import type { Lang } from './locales';

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { colors, execaCommand } from '@xpress/node-utils';

import * as p from '@clack/prompts';

import { locales } from './locales';

/**
 * Git commit with Conventional Commits standard
 * @param lang 语言选项
 */
export async function gitCommit(lang: Lang = 'en-us') {
  const { gitCommitMessages, gitCommitScopes, gitCommitTypes } = locales[lang];

  p.intro(`${colors.blue('📝')} ${colors.green('Git Commit')}`);

  const typesChoices = gitCommitTypes.map(([value, msg]) => ({
    label: `${value.padEnd(12)}${msg}`,
    value,
  }));

  const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
    label: `${value.padEnd(30)} (${msg})`,
    value,
  }));

  const result = await p.group({
    types: () =>
      p.select({
        message: gitCommitMessages.types,
        options: typesChoices,
      }),
    scope: () =>
      p.select({
        message: gitCommitMessages.scopes,
        options: [{ label: '(不选择scope)', value: '' }, ...scopesChoices],
      }),
    description: () =>
      p.text({
        message: gitCommitMessages.description,
        validate: (value) => {
          if (!value) return '请输入提交描述';
        },
      }),
  });

  if (p.isCancel(result)) {
    p.cancel('操作已取消');
    process.exit(0);
  }

  const breaking = result.description.startsWith('!') ? '!' : '';
  const description = result.description.replace(/^!/, '').trim();
  const scopePart = result.scope ? `(${result.scope})` : '';
  const commitMsg = `${result.types}${scopePart}${breaking}: ${description}`;

  await execaCommand(`git commit -m "${commitMsg}"`, {
    stdio: 'inherit',
    shell: true,
  });
  p.outro(`${colors.green('✔')} 提交成功!`);
}

/** Git commit message verify */
export async function gitCommitVerify(
  lang: Lang = 'en-us',
  ignores: RegExp[] = [],
) {
  const { stdout: gitPath } = await execaCommand(
    'git rev-parse --show-toplevel',
  );
  console.log(gitPath);
  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');
  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  if (ignores.some((regExp) => regExp.test(commitMsg))) return;

  const REG_EXP =
    /(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

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
