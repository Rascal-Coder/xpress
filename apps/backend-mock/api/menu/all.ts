// import { verifyAccessToken } from '~/utils/jwt-utils';
// import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler(async (_event) => {
  // const userinfo = verifyAccessToken(event);
  // if (!userinfo) {
  //   return unAuthorizedResponse(event);
  // }

  // const menus =
  //   .find((item) => item.username === userinfo.username)?.menus ?? [];
  return useResponseSuccess(MOCK_MENUS);
});
