import { XpressPage } from '@xpress/common-ui';
import { Card, CardContent } from '@xpress-core/shadcn-ui';

import React from 'react';

const Nest2_2_2: React.FC = () => {
  return (
    <XpressPage autoContentHeight={true}>
      <div className="flex size-full flex-col items-start p-8">
        <Card className="w-full border-none bg-[#0EA5E9]/10">
          <CardContent className="p-8">
            <div className="text-lg font-medium">/nest</div>
            <div className="mt-4">
              <Card className="w-full border-none bg-[#8B5CF6]/20">
                <CardContent className="p-8">
                  <div className="text-lg font-medium">菜单2</div>
                  <div className="mt-4">
                    <Card className="w-full border-none bg-[#F472B6]/20">
                      <CardContent className="p-8">
                        <div className="text-lg font-medium">菜单2-2</div>
                        <div className="mt-4">
                          <Card className="border-none bg-[#EC4899] text-white">
                            <CardContent className="p-8">
                              <h1 className="text-2xl font-medium">
                                菜单2-2-2
                              </h1>
                              <div className="mt-2 text-sm opacity-70">
                                /nest/nest2/nest2-2/nest2-2-2
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </XpressPage>
  );
};

export default Nest2_2_2;
