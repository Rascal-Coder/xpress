export default {
  '*.{js,jsx,ts,tsx}': [
    'prettier --cache --ignore-unknown  --write',
    'eslint --cache --fix',
  ],
  '*.{scss,less,styl,html,css}': [
    'prettier --cache --ignore-unknown --write',
    (files) => {
      const filteredFiles = files
        .filter((file) => !file.includes('loadingTemplate'))
        .filter((file) => !file.endsWith('.html'));
      return filteredFiles.length > 0
        ? `stylelint --fix --allow-empty-input ${filteredFiles.join(' ')}`
        : 'echo "No style files to lint"';
    },
  ],
  '*.md': ['prettier --cache --ignore-unknown --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
    'prettier --cache --write--parser json',
  ],
  'package.json': ['prettier --cache --write'],
};
