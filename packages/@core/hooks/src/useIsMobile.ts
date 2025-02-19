import { breakpointsTailwind, useBreakpoints } from './useBreakpoints';

export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('md');
  return { isMobile };
}
