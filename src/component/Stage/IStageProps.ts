import { ComponentsType, IConfig, PageMode, IContextMenuItems } from './types';
import { Map } from 'immutable';

export interface IStageProps {
    // 组件数据集合
    components: ComponentsType;
    // config配置
    config: IConfig;
    // 页面模式
    pageMode: PageMode;
    // 右键菜单
    onContextMenu?: (e: any, contextMenuItems: IContextMenuItems[]) => void;
    // 获取选中的组件集合并传给ToolBar
    onCommandProperties: (selectedComs: Map<string, any>) => void;
    // 将输入参数：编辑中的组件属性，传给propertyTool
    onPropertyProperties: (compProperty: Array<{ pTitle: string, pKey: string, pValue: any, pType: string }> | undefined
    ) => void;
    // 清除属性工具栏状态
    clearSelectedProperty: () => void;
}
