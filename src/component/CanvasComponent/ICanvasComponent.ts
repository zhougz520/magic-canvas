import { ICanvasCommand } from './model/types';
import { IComponent } from '../..';
import { ComponentProperty } from '../config';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    command: ICanvasCommand;
    container: HTMLDivElement | null;
    canvas: HTMLDivElement | null;
    getComponent: (cid: string) => IComponent | null;
    findComponent: (cid: string) => IComponent | null;
    executeCommand: (cmd: any) => void;
    executorProperties: (cid: string, cProperty: {pKey: string, pValue: any}) => void;
    // getSelectedProperties: (currentCid: string) => {}|undefined;
    getSelectedProperties: (currentCid: string) => ComponentProperty|undefined;
}
