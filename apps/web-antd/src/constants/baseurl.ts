const env = import.meta.env.PROD ? 'prod' : 'dev';

// TODO:临时这样处理，后续需要封装http请求
export const baseUrl =
  env === 'prod'
    ? 'https://xpress-backend.ras-cal.cc'
    : 'http://localhost:5320';
