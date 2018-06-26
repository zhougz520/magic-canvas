import { IDrawComponent } from '../Draw';
import { ICompos, ComponentsType, PageMode, IContextMenuItems } from '../Stage';
import { IPropertyGroup } from '../UniversalComponents';

import { IBoundary, IOffset } from './model/types';
import { Map, OrderedSet } from 'immutable';

export interface ICanvasProps {
    // 页面模式
    pageMode: PageMode;
    // 组件数据
    components: ComponentsType;
    // 画布大小
    canvasSize: { width: number, height: number };
    // 高性能模式
    highPerformance: boolean;
    // 画布偏移量
    componentPosition: ICompos;

    // 设置页签变脏
    setPageDirty?: () => void;
    // 右键菜单
    onContextMenu?: (e: any, contextMenuItems: IContextMenuItems[]) => void;

    // 获取选中的组件集合并传给ToolBar
    onCommandProperties?: (selectedComs: Map<string, any>) => void;
    // 获取选中的组件属性，传给PropertyTool
    onPropertyProperties?: (propertyGroup: OrderedSet<IPropertyGroup>) => void;

    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
    setStageScroll: (offset: IOffset) => void;
    getStageBoundary: () => undefined | IBoundary;
    getStageSize: () => undefined | { width: number, height: number };
}
