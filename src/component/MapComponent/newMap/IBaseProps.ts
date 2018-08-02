import { PageMode } from '../../Stage';
import { IPropertyGroup } from '../../UniversalComponents';

import { Theme } from './model/types';

import { OrderedSet } from 'immutable';

export interface IBaseProps {
    // 主题
    theme: Theme;
    // 页面模式
    pageMode: PageMode;
    // 组件id
    id: string;
    // 当前选中组件id
    selectedId: string | null;

    selectComChange: (e: any, id: string) => void;
    setChildPropertyGroup: (childPropertyGroup: OrderedSet<IPropertyGroup>) => void;
    doChildDbClickToEdit: (e: any) => void;
}
