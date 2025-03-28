import {
  Block,
  Breadcrumb,
  Content,
  Copyright,
  Footer,
  Header,
  Layout,
  Navigation,
  Sidebar,
  Tabbar,
  Widget,
} from '../../blocks';

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
      <Block title="顶栏">
        <Header />
      </Block>
      <Block title="导航菜单">
        <Navigation />
      </Block>
      <Block title="面包屑导航">
        <Breadcrumb />
      </Block>
      <Block title="标签栏">
        <Tabbar />
      </Block>
      <Block title="小部件">
        <Widget />
      </Block>
      <Block title="页脚">
        <Footer />
      </Block>
      <Block title="版权信息">
        <Copyright />
      </Block>
    </>
  );
};
