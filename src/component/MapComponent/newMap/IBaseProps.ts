import { PageMode } from '../../Stage';
import { IPropertyGroup } from '../../UniversalComponents';

import { Theme } from './model/types';

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
    p: any;
    // childData集合
    stateData?: any;

    selectComChange: (e: any, id: string) => void;
    setChildPropertyGroup: (childPropertyGroup: OrderedSet<IPropertyGroup>) => void;
    doChildDbClickToEdit: (e: any) => void;
    updateProps: (id: string, data: any) => void;
    dragChangeField?: (fieldList: any) => void;
    getRefs?: () => any;

    index?: number;
}
