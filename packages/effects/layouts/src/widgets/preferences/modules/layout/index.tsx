import { Block, Content, Layout, Sidebar } from '../../blocks';

export const PreferencesLayout = () => {
  return (
    <>
      <Block title="布局">
        <Layout />
      </Block>
      <Block title="内容">
        <Content />
      </Block>
      <Block title="侧边栏">
        <Sidebar />
      </Block>
    </>
  );
};
