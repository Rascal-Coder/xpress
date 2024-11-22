declare module 'eslint-plugin-react' {
  type ReactConfigKey = 'all' | 'jsx-runtime' | 'recommended';

  const plugin: {
    configs: Record<ReactConfigKey, import('eslint').ESLint.ConfigData>;
  } & import('eslint').ESLint.Plugin;

  export default plugin;
}
declare module 'eslint-plugin-react-hooks' {
  const plugin: import('eslint').ESLint.Plugin;

  export default plugin;
}
declare module 'eslint-plugin-react-refresh' {
  const plugin: import('eslint').ESLint.Plugin;

  export default plugin;
}
