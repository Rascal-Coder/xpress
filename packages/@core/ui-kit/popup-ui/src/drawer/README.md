# Drawer 组件

一个功能强大的抽屉组件，支持自定义内容、位置、动画效果等。

## 特性

- 🎯 支持多个抽屉同时存在
- 🔄 支持可销毁模式
- 🎨 支持自定义样式和主题
- 📱 响应式设计
- 🔌 提供完整的API和生命周期钩子
- 🛠 支持组件连接模式

## 安装

```bash
# 使用 npm
npm install @xpress/layouts

# 使用 yarn
yarn add @xpress/layouts

# 使用 pnpm
pnpm add @xpress/layouts
```

## 基础用法

```tsx
import { useDrawer } from '@xpress/layouts';

function Demo() {
  const [DrawerComponent, drawerApi] = useDrawer({
    title: '标题',
    onDrawerConfirm: () => {
      // 处理确认
      drawerApi.close();
    },
  });

  return (
    <>
      <button onClick={() => drawerApi.open()}>打开抽屉</button>
      <DrawerComponent>
        <div>抽屉内容</div>
      </DrawerComponent>
    </>
  );
}
```

## API

### useDrawer

```tsx
const [DrawerComponent, drawerApi] = useDrawer(options);
```

### 选项 (DrawerOptions)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placement | 抽屉方向 | 'left' \| 'right' \| 'top' \| 'bottom' | 'right' |
| title | 标题 | ReactNode | - |
| destroyOnClose | 关闭时销毁内容 | boolean | false |
| modal | 是否显示遮罩 | boolean | true |
| zIndex | 层级 | number | 2000 |
| overlayBlur | 遮罩模糊度 | number | 1 |
| closeOnPressEscape | 按ESC关闭 | boolean | true |
| closeOnClickModal | 点击遮罩关闭 | boolean | true |
| showHeader | 显示头部 | boolean | true |
| showFooter | 显示底部 | boolean | true |
| showCancelButton | 显示取消按钮 | boolean | true |
| showConfirmButton | 显示确认按钮 | boolean | true |
| connectedComponent | 连接的组件 | React.ComponentType | - |

### DrawerApi

| 方法     | 说明         | 参数                                    |
| -------- | ------------ | --------------------------------------- |
| open     | 打开抽屉     | (options?: Partial<Props>) => void      |
| close    | 关闭抽屉     | () => void                              |
| update   | 更新抽屉属性 | (options: Partial<Props>) => void       |
| useStore | 使用抽屉状态 | <T>(selector: (state: Props) => T) => T |

### 事件

| 事件名          | 说明               | 参数                    |
| --------------- | ------------------ | ----------------------- |
| onOpenChange    | 打开状态改变时触发 | (open: boolean) => void |
| onDrawerClosed  | 抽屉关闭后触发     | () => void              |
| onDrawerConfirm | 点击确认按钮时触发 | () => void              |
| onDrawerCancel  | 点击取消按钮时触发 | () => void              |

## 高级用法

### 连接组件模式

连接模式主要用于以下场景：

1. **嵌套抽屉场景**
   - 在一个抽屉内部需要打开另一个抽屉
   - 父子抽屉需要共享状态或通信
2. **复杂的表单流程**
   - 多步骤表单
   - 分步骤收集用户输入
3. **状态共享场景**
   - 多个组件需要共享抽屉的状态
   - 需要在外部控制内部抽屉的状态

示例1：多步骤表单

```tsx
// 父组件：用户信息收集流程
const [ParentDrawer, parentApi] = useDrawer({
  title: '用户信息收集',
  connectedComponent: UserInfoFlow,
});

// 子组件：步骤流程
function UserInfoFlow() {
  const [ChildDrawer, childApi] = useDrawer();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      childApi.close();
    }
  };

  return (
    <ChildDrawer>
      {step === 1 && <BasicInfo onNext={handleNext} />}
      {step === 2 && <ContactInfo onNext={handleNext} />}
      {step === 3 && <PreferencesInfo onFinish={handleNext} />}
    </ChildDrawer>
  );
}
```

示例2：嵌套抽屉

```tsx
// 父组件：商品列表
const [ProductDrawer, productApi] = useDrawer({
  title: '商品管理',
  connectedComponent: ProductList,
});

// 子组件：商品详情
function ProductList() {
  const [DetailDrawer, detailApi] = useDrawer();

  const handleProductClick = (product) => {
    detailApi.open({
      title: product.name,
      // 子抽屉的配置
      placement: 'right',
      width: '30%',
    });
  };

  return (
    <>
      <div onClick={() => handleProductClick(product)}>商品列表内容...</div>

      <DetailDrawer>商品详情内容...</DetailDrawer>
    </>
  );
}
```

示例3：状态共享

```tsx
// 父组件：设置面板
const [SettingsDrawer, settingsApi] = useDrawer({
  title: '系统设置',
  connectedComponent: SettingsPanel,
});

// 子组件：设置面板内容
function SettingsPanel() {
  const [ContentDrawer, contentApi] = useDrawer();

  // 使用共享状态
  const theme = contentApi.useStore((state) => state.theme);

  const updateTheme = (newTheme) => {
    contentApi.update({ theme: newTheme });
    // 主题更改后的其他操作...
  };

  return (
    <ContentDrawer>
      <ThemeSelector currentTheme={theme} onChange={updateTheme} />
      {/* 其他设置项... */}
    </ContentDrawer>
  );
}
```

连接模式的优势：

1. 更好的状态管理：父子抽屉可以共享状态
2. 更清晰的组件层级：通过 `connectedComponent` 明确组件之间的关系
3. 更灵活的控制：可以在任何层级控制抽屉的行为
4. 更好的性能：状态更新只会影响相关的组件

### 全局默认值

```tsx
import { setDefaultDrawerProps } from '@xpress/layouts';

setDefaultDrawerProps({
  placement: 'left',
  modal: false,
  // ...其他默认值
});
```

### 使用状态管理

```tsx
const [DrawerComponent, api] = useDrawer();

// 使用选择器获取状态
const title = api.useStore((state) => state.title);

// 更新状态
api.update({ title: '新标题' });
```

## 注意事项

1. 当使用 `connectedComponent` 时，避免直接传递props给Drawer组件，应使用 `useDrawer` 或 `api` 来修改属性。

2. `destroyOnClose` 设置为 `true` 时，每次关闭都会销毁内容，再次打开会重新渲染。

3. 多个抽屉同时使用时，建议设置不同的 `zIndex` 来控制层级。
