import { XpressPage } from '@xpress/common-ui';
import { Card, CardContent } from '@xpress-core/shadcn-ui';

import React from 'react';

const Nest1: React.FC = () => {
  return (
    <XpressPage autoContentHeight={true}>
      <div className="flex size-full flex-col items-start p-8">
        <Card className="w-full border-none bg-[#0EA5E9]/10">
          <CardContent className="p-8">
            <div className="text-lg font-medium">/nest</div>
            <div className="mt-4">
              <Card className="border-none bg-[#DE8B9E] text-white">
                <CardContent className="p-8">
                  <h1 className="text-2xl font-medium">菜单1</h1>
                  <div className="mt-2 text-sm opacity-70">/nest/nest1</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </XpressPage>
  );
};

export default Nest1;
