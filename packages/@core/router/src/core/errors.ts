import type { RouteLocationNormalized } from './types';

export enum RouterErrorTypes {
  GUARD_INVALID = 'guard-invalid',
  NAVIGATION_ABORTED = 'navigation-aborted',
  NAVIGATION_CANCELLED = 'navigation-cancelled',
  NAVIGATION_DUPLICATED = 'navigation-duplicated',
  PARAMS_MISSING = 'params-missing',
  ROUTE_NOT_FOUND = 'route-not-found',
}

export interface NavigationFailure {
  error?: Error | unknown;
  from: RouteLocationNormalized;
  to: RouteLocationNormalized;
  type: RouterErrorTypes;
}

export class RouterError extends Error {
  constructor(
    public type: RouterErrorTypes,
    public override message: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'RouterError';

    // 保持正确的原型链
    Object.setPrototypeOf(this, RouterError.prototype);

    // 捕获堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RouterError);
    }
  }
}

export function createRouterError<T extends NavigationFailure>(
  type: RouterErrorTypes,
  params: Partial<T> = {},
): RouterError & T {
  const messages: Record<RouterErrorTypes, string> = {
    [RouterErrorTypes.GUARD_INVALID]: 'Invalid navigation guard return value',
    [RouterErrorTypes.NAVIGATION_ABORTED]: 'Navigation aborted',
    [RouterErrorTypes.NAVIGATION_CANCELLED]: 'Navigation cancelled',
    [RouterErrorTypes.NAVIGATION_DUPLICATED]: 'Navigating to current location',
    [RouterErrorTypes.PARAMS_MISSING]: 'Missing required params',
    [RouterErrorTypes.ROUTE_NOT_FOUND]: 'Route not found',
  };

  const error = new RouterError(type, messages[type], params) as RouterError &
    T;

  return Object.assign(error, params);
}
