import { colors, consola } from '@xpress/node-utils';

import { cac } from 'cac';

import { run } from './run';

console.log(`
   ${colors.cyan('╔════════════════════════════════╗')}
   ${colors.cyan('║')}  ${colors.magenta.bold('XPRESS CLI')}                    ${colors.cyan('║')}
   ${colors.cyan('║')}  ${colors.gray('Modern Monorepo Toolchain')}     ${colors.cyan('║')}
   ${colors.cyan('╚════════════════════════════════╝')}
`);

try {
  const turboRun = cac('turbo-run');

  turboRun
    .command('[script]')
    .usage(colors.cyan('Run turbo scripts interactively'))
    .example(colors.gray('turbo-run dev'))
    .example(colors.gray('turbo-run build'))
    .action(async (command: string) => {
      run({ command });
    });

  // Invalid command
  turboRun.on('command:*', () => {
    consola.error(colors.red('❌ Invalid command!'));
    process.exit(1);
  });

  turboRun.usage('turbo-run [script]');
  turboRun.help();
  turboRun.parse();
} catch (error) {
  consola.error(colors.red('❌ Error:'), error);
  process.exit(1);
}
