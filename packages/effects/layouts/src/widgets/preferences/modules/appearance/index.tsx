import { Block, BuiltinTheme, Other, Radius, Theme } from '../../blocks';

export const PreferencesAppearance = () => {
  return (
    <>
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
    </>
  );
};
