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
    dragChangeField?: (fieldList: any) => void;

    selectComChange: (e: any, id: string) => void;
    setChildPropertyGroup: (childPropertyGroup: OrderedSet<IPropertyGroup>) => void;
    doChildDbClickToEdit: (e: any) => void;
    // 页面模式
    p: any;
    updateProps: (id: string, data: any) => void;
    stateData?: any;
    getRefs?: () => any;
    index?: number;
}
