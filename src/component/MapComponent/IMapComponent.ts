/**
 * BaseComponent提供的方法接口
 */
export interface IMapComponent {

    /**
     * 获取、设置richChildNode
     */
    getRichChildNode: () => any;
    setRichChildNode: (richChildNode: any) => void;

    /**
     * 获取组件标识cid
     */
    getCid: () => string;
}
