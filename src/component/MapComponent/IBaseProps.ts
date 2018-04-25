/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    selectedId: string;
    selectCom: (cid: string) => void;
    map_sm?: string;
    id: string;
    p?: any;
    fireSelectChildChange: (cid: string, e: any) => void;
    // key: string;
    // id: string;
}
