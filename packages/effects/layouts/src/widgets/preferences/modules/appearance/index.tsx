import { Block } from '../../blocks';
import { BuiltinTheme } from '../../blocks/theme/BuiltinTheme';
import { Other } from '../../blocks/theme/Other';
import { Radius } from '../../blocks/theme/Radius';
import { Theme } from '../../blocks/theme/Theme';

export const Appearance = () => {
  return (
    <div>
      <Block title="主题">
        <Theme />
      </Block>
      <Block title="内置主题">
        <BuiltinTheme />
      </Block>
      <Block title="圆角">
        <Radius />
      </Block>
      <Block title="其他">
        <Other />
      </Block>
    </div>
  );
};
