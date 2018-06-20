import { IComponent } from '../BaseComponent';
import { IProperty } from '../UniversalComponents';
import { Map } from 'immutable';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    /**
     * 获取组件对象
     */
    getComponent: (cid: string) => IComponent | null;

    getSaveData: () => any;

    getIsDirty: () => boolean;

    /**
     * 执行命令
     */
    executeCommand: (cmd: any) => void;

    getSelectedProperties: (currentSelectedComponents: Map<string, IComponent>) =>
        IProperty[] | undefined;
}
