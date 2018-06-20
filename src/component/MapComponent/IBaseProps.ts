/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    selectedId: string;
    selectComChange: (e: any, cid: string) => void;
    map_sm?: string;
    id: string;
    p?: any;
    w?: number;
    h?: number;
    updateProps: (id: string, data: any) => void;
    stateData?: any;
    refs?: any;
}
