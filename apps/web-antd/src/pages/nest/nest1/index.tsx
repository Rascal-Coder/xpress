import { XpressPage } from '@xpress/common-ui';
import { SvgComingSoonIcon } from '@xpress/icons';

import React from 'react';

const Nest1: React.FC = () => {
  return (
    <XpressPage autoContentHeight={true}>
      <div className="flex size-full flex-col items-center justify-center duration-300">
        <SvgComingSoonIcon className="h-1/4 w-1/4" />
        <div className="flex-col-center mt-4 text-2xl">菜单1</div>
      </div>
    </XpressPage>
  );
};

export default Nest1;
