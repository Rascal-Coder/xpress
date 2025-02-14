type DrawerPlacement = 'bottom' | 'left' | 'right' | 'top';
type CloseIconPlacement = 'left' | 'right';
interface Props {
  /**
   * 弹窗打开后的回调
   */
  onDrawerOpened?: () => void;
  /**
   * 弹窗关闭后的回调
   */
  onDrawerClosed?: () => void;
  /**
   * 弹窗关闭前的回调
   */
  onDrawerBeforeClose?: () => void;
  /**
   * 取消按钮点击后的回调
   */
  onDrawerCancel?: () => void;
  /**
   * 确定按钮点击后的回调
   */
  onDrawerConfirm?: () => void;
  /**
   * 弹窗是否打开
   */
  isOpen: boolean;
  /**
   * 设置弹窗是否打开
   */
  setIsOpen: (open: boolean) => void;
  /**
   * 是否挂载到内容区域
   * @default false
   */
  appendToMain?: boolean;
  /**
   * 取消按钮文字
   */
  cancelText?: string;
  class?: string;
  /**
   * 是否显示关闭按钮
   * @default true
   */
  closable?: boolean;
  /**
   * 关闭按钮的位置
   */
  closeIconPlacement?: CloseIconPlacement;
  /**
   * 点击弹窗遮罩是否关闭弹窗
   * @default true
   */
  closeOnClickModal?: boolean;
  /**
   * 按下 ESC 键是否关闭弹窗
   * @default true
   */
  closeOnPressEscape?: boolean;
  /**
   * 确定按钮 loading
   * @default false
   */
  confirmLoading?: boolean;
  /**
   * 确定按钮文字
   */
  confirmText?: string;
  contentClass?: string;
  /**
   * 弹窗描述
   */
  description?: string;
  /**
   * 是否显示底部
   * @default true
   */
  showfooter?: boolean;
  /**
   * 弹窗底部样式
   */
  footerClass?: string;
  /**
   * 是否显示顶栏
   * @default true
   */
  showHeader?: boolean;
  /**
   * 弹窗头部样式
   */
  headerClass?: string;
  /**
   * 弹窗是否显示
   * @default false
   */
  loading?: boolean;

  /**
   * 是否显示遮罩
   * @default true
   */
  modal?: boolean;
  /**
   * 是否自动聚焦
   */
  openAutoFocus?: boolean;
  /**
   * 弹窗遮罩模糊效果
   */
  overlayBlur?: number;

  /**
   * 抽屉位置
   * @default right
   */
  placement?: DrawerPlacement;
  /**
   * 是否显示取消按钮
   * @default true
   */
  showCancelButton?: boolean;
  /**
   * 是否显示确认按钮
   * @default true
   */
  showConfirmButton?: boolean;
  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 弹窗标题提示
   */
  titleTooltip?: string;
  /**
   * 抽屉层级
   */
  zIndex?: number;
  /**
   * 抽屉样式
   */
  className?: string;
  /**
   * 关闭按钮
   */
  closeIcon?: React.ReactNode;
  /**
   * 额外内容
   */
  extra?: React.ReactNode;
  /**
   * 是否显示加载中
   */
  showLoading?: boolean;
  /**
   * 是否显示底部
   */
  showFooter?: boolean;
  /**
   * 内容
   */
  children?: React.ReactNode;
  /**
   * 底部前置内容
   */
  prependFooter?: React.ReactNode;
  /**
   * 底部后置内容
   */
  appendFooter?: React.ReactNode;
  /**
   * 底部内容
   */
  footer?: React.ReactNode;
}

export type { CloseIconPlacement, DrawerPlacement, Props };
