import { IDrawComponent } from '../Draw';
import { ICompos, ComponentsType, PageMode, IContextMenuItems } from '../Stage';
import { IPropertyGroup, IToolButtonGroup } from '../UniversalComponents';

import { IBoundary, IOffset } from './model/types';
import { OrderedSet } from 'immutable';

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

    /**
     * 写入剪切板
     * @param data
     */
    copyToClipboard?: (data: { text?: string, html?: string, image?: any }) => void;
    /**
     * 获取剪切板数据
     * @param types 需要获取的剪切板类型
     */
    readFromClipboard?: (types?: string[]) => { text?: string, html?: string, image?: any };
    /**
     * 检查剪切板中是否有数据，并返回数据类型集合
     */
    checkClipboard?: () => string[];

    // 获取选中的组件集合并传给ToolBar
    onCommandProperties?: (buttonGroup: IToolButtonGroup) => void;
    // 获取选中的组件属性，传给PropertyTool
    onPropertyProperties?: (propertyGroup: OrderedSet<IPropertyGroup>) => void;

    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
    setStageScroll: (offset: IOffset) => void;
    getStageBoundary: () => undefined | IBoundary;
    getStageSize: () => undefined | { width: number, height: number };
}
