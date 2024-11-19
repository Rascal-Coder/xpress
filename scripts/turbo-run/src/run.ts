import { colors, execaCommand, getPackages } from '@xpress/node-utils';

import { intro, isCancel, outro, select } from '@clack/prompts';

interface RunOptions {
  command?: string;
}

export async function run(options: RunOptions) {
  const { command } = options;
  if (!command) {
    console.error(colors.red('Please enter the command to run'));
    process.exit(1);
  }

  intro(colors.cyan(`🚀 Turbo Run - ${command}`));

  const { packages } = await getPackages();

  const selectPkgs = packages.filter((pkg) => {
    return (pkg?.packageJson as Record<string, any>)?.scripts?.[command];
  });

  if (selectPkgs.length === 0) {
    outro(colors.yellow(`😢 No packages found with script: ${command}`));
    process.exit(0);
  }

  let selectPkg: string | symbol;
  if (selectPkgs.length > 1) {
    selectPkg = await select<string>({
      message: colors.cyan(`Select package to run [${command}]:`),
      options: selectPkgs.map((item) => ({
        hint: item?.packageJson.version,
        label: item?.packageJson.name,
        value: item?.packageJson.name,
      })),
    });

    if (isCancel(selectPkg) || !selectPkg) {
      outro(colors.yellow('👋 Operation cancelled'));
      process.exit(0);
    }
  } else {
    selectPkg = selectPkgs[0]?.packageJson?.name ?? '';
  }

  if (!selectPkg) {
    outro(colors.red('❌ No package found'));
    process.exit(1);
  }

  console.log(colors.green(`\n📦 Running ${command} in ${selectPkg}...\n`));

  execaCommand(`pnpm --filter=${selectPkg} run ${command}`, {
    stdio: 'inherit',
  });
}

/**
 * 过滤app包
 * @param root
 * @param packages
 */
// async function findApps(root: string, packages: Package[]) {
//   // apps内的
//   const appPackages = packages.filter((pkg) => {
//     const viteConfigExists = fs.existsSync(join(pkg.dir, 'vite.config.mts'));
//     return pkg.dir.startsWith(join(root, 'apps')) && viteConfigExists;
//   });

//   return appPackages;
// }
