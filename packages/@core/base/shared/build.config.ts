import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: [
    'src/utils/index',
    'src/color/index',
    'src/cache/index',
    'src/global-state',
  ],
});
