import { IToolButtonGroup } from '../../../../../src';

export interface IToolbarProps {
    // 是否折叠的样式
    titleBarCollapsed: boolean;
    onTitleBarCollapse: (collapsed: boolean) => void;
    // 发送命令
    onCommandEmitted: (cmd: any) => void;
    getSaveData: () => void;
    setScale: (scale: number) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface IToolbarState extends IToolButtonGroup { }

export interface IToolbarComponent {
    /**
     * 设置CommandBar的state
     */
    setCommandState: (buttonGroup: IToolButtonGroup) => void;
}
