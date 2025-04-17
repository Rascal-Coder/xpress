import { Animation, Block, General } from '../../blocks';

export const PreferencesGeneral = () => {
  return (
    <>
      <Block title="通用">
        <General />
      </Block>
      <Block title="动画">
        <Animation />
      </Block>
    </>
  );
};
