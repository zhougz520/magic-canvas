import { IComponent } from '../BaseComponent';
import { IProperty } from '../UniversalComponents';
import { ComponentsType } from '../Stage';
import { Map } from 'immutable';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    initCanvas: (components: ComponentsType) => void;
    /**
     * 获取组件对象
     */
    getComponent: (cid: string) => IComponent | null;

    getSaveData: () => any;

    /**
     * 设置画布是否变脏
     */
    setIsDirty: (isDirty: boolean) => void;

    /**
     * 执行命令
     */
    executeCommand: (cmd: any) => void;

    getSelectedProperties: (currentSelectedComponents: Map<string, IComponent>) =>
        IProperty[] | undefined;
}
