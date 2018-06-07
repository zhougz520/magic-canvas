import { IComponent } from '../..';
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

    /**
     * 执行命令
     */
    executeCommand: (cmd: any) => void;
    executeProperties: (pKey: string, pValue: any) => void;
    getSelectedProperties: (currentSelectedComponents: Map<string, any>) =>
        Array<{pTitle: string, pKey: string, pValue: any, pType: string}> | undefined;
}
