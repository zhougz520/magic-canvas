import { IPropertyGroup } from '../UniversalComponents';

import { ComponentsType, IConfig, PageMode, IContextMenuItems } from './types';
import { Map, OrderedSet } from 'immutable';

export interface IStageProps {
    // 组件数据集合
    components: ComponentsType;
    // 画布大小
    canvasSize: { width: number, height: number };
    // config配置
    config: IConfig;
    // 页面模式
    pageMode: PageMode;

    // 设置页签变脏
    setPageDirty?: () => void;
    // 右键菜单
    onContextMenu?: (e: any, contextMenuItems: IContextMenuItems[]) => void;

    // 获取选中的组件集合并传给ToolBar
    onCommandProperties?: (selectedComs: Map<string, any>) => void;
    // 获取选中的组件属性，传给PropertyTool
    onPropertyProperties?: (propertyGroup: OrderedSet<IPropertyGroup>) => void;
}
