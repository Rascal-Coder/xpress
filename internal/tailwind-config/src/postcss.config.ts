import config from '.';

export default {
  plugins: {
    autoprefixer: {
      flexbox: 'no-2009',
    },
    'postcss-import': {},
    'postcss-preset-env': {
      features: {
        'color-functional-notation': false,
        'custom-properties': false,
        'nesting-rules': false,
      },
      stage: 3,
    },
    tailwindcss: { config },
    'tailwindcss/nesting': {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                autoprefixer: false,
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }
      : {}),
  },
};
