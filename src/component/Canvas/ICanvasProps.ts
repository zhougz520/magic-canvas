import { IDrawComponent } from '../Draw';

import { ICompos, ComponentsType, PageMode, IContextMenuItems } from '../Stage';
import { IBoundary, IOffset } from './model/types';
import { Map } from 'immutable';

export interface ICanvasProps {
    // 页面模式
    pageMode: PageMode;
    // 组件数据
    components: ComponentsType;
    // 高性能模式
    highPerformance: boolean;
    // 画布偏移量
    componentPosition: ICompos;
    // canvas默认的宽高
    canvasSize: { width: number, height: number };

    // 右键菜单
    onContextMenu?: (e: any, contextMenuItems: IContextMenuItems[]) => void;

    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
    setStageScroll: (offset: IOffset) => void;
    getStageBoundary: () => undefined | IBoundary;
    getStageSize: () => undefined | { width: number, height: number };
    onCommandProperties: (selectedComs: Map<string, any>) => void;
    onPropertyProperties: (compProperty: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>| undefined
        ) => void;
    updateCanvasSize: (width: number, height: number) => void;
    clearSelectedProperty: () => void;
}
