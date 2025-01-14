/**
 * 路由树节点
 */
export interface RouteTreeNode {
  /**
   * 子节点数组
   */
  children: RouteTreeNode[];

  /**
   * 节点名称
   */
  name: string;

  /**
   * 路由路径
   */
  path: string;
}
