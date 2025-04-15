import { XpressPage } from '@xpress/common-ui';
import { DEFAULT_HOME_PATH } from '@xpress/constants';
import { ArrowLeft, Svg500Icon } from '@xpress/icons';
import { XpressButton } from '@xpress-core/shadcn-ui';

import React from 'react';

import { useNavigate } from '#/router';

const ServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <XpressPage autoContentHeight={true}>
      <div className="flex size-full flex-col items-center justify-center duration-300">
        <Svg500Icon className="h-1/2 w-1/2" />
        <div className="flex-col-center">
          <XpressButton onClick={() => navigate(DEFAULT_HOME_PATH)} size="lg">
            <ArrowLeft className="mr-2 size-4" />
            返回首页
          </XpressButton>
        </div>
      </div>
    </XpressPage>
  );
};

export default ServerError;
