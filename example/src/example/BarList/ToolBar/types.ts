import { Map } from 'immutable';

export interface IToolbarProps {
    // 是否折叠的样式
    titleBarCollapsed: boolean;
    onTitleBarCollapse: (collapsed: boolean) => void;
    highPerformance: (value: boolean) => void;
    // 发送命令
    onCommandEmitted: (cmd: any) => void;
}

export interface IToolbarState {
    // 选中的组件集合
    selectedComs: Map<string, any>;
}

export interface IToolbarComponent {
    /**
     * 设置CommandBar的state
     */
    setCommandState: (selectedComs: Map<string, any>) => void;
}
