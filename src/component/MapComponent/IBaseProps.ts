import { PageMode } from '../Stage';
import { IPropertyGroup } from '../UniversalComponents';
import { Theme, GridStyle } from './model/types';
import { OrderedSet } from 'immutable';

export interface IBaseProps {
    // 主题
    theme?: Theme;
    // 页面模式
    pageMode: PageMode;
    // 组件id
    id: string;
    // 当前选中组件id
    selectedId: string | null;
    // 子组件
    p?: any;
    // childData集合
    stateData?: any;
    // 拖拽index
    index?: number;

    // 列表样式
    gridStyle?: GridStyle;

    // ERP页面皮肤
    map_sm?: string;

    selectComChange: (e: any, id: string) => void;
    setChildPropertyGroup: (childPropertyGroup: OrderedSet<IPropertyGroup>) => void;
    doChildDbClickToEdit: (e: any) => void;
    updateProps: (id: string, data: any) => void;
    dragChangeField?: (fieldList: any) => void;
    getRefs?: () => any;
}
