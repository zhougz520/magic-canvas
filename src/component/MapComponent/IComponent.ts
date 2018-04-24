/**
 * BaseComponent提供的方法接口
 */
export interface IComponent {
    /**
     * 添加子控件
     */
    addChildComponent: (data: any, addData: any) => any;
    /**
     * 获取最新的控件id
     */
    deleteComponentsById: (pid: string) => any;
    /**
     * 获取最新的控件id
     */
    newComponentsId: (collection: any[], prefix: string, pid: string) => any;
}
