/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    selectedId: string;
    selectComChange: (cid: string) => void;
    map_sm?: string;
    id: string;
    p?: any;
    w?: number;
    h?: number;
    fireSelectChildChange: (cid: string, e: any) => void;
    // key: string;
    // id: string;
}
