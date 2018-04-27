import { ICanvasCommand } from './model/types';
import { IComponent } from '../..';
import { Map } from 'immutable';

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
    executeProperties: (pKey: string, pValue: any) => void;
    // getSelectedProperties: (currentCid: string) => {}|undefined;
    getSelectedProperties: (currentSelectedComponents: Map<string, any>) =>
        Array<{pTitle: string, pKey: string, pValue: any, pType: string}>|undefined;
}
