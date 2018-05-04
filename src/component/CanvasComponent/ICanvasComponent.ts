import { ICanvasCommand } from './model/types';
import { IComponent } from '../..';
import { Map } from 'immutable';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    /**
     * 画布上全局变量
     */
    container: HTMLDivElement | null;
    canvas: HTMLDivElement | null;
    command: ICanvasCommand;

    /**
     * 获取组件对象
     */
    getComponent: (cid: string) => IComponent | null;
    findComponent: (cid: string) => IComponent | null;

    /**
     * 执行命令
     */
    executeCommand: (cmd: any) => void;
    executeProperties: (pKey: string, pValue: any) => void;
    getSelectedProperties: (currentSelectedComponents: Map<string, any>) =>
        Array<{pTitle: string, pKey: string, pValue: any, pType: string}>|undefined;
}
