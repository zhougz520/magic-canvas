import { OrderedSet } from 'immutable';
import { IPropertyGroup } from '../UniversalComponents';
import { Theme } from './newMap/model/types';
import { PageMode } from '../Stage';

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
    dragChangeField?: (fieldList: any) => void;
    setChildPropertyGroup: (childPropertyGroup: OrderedSet<IPropertyGroup>) => void;
    doChildDbClickToEdit: (e: any) => void;
    theme?: Theme;
    // 页面模式
    pageMode: PageMode;
}
