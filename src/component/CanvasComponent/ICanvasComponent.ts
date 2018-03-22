import { ICanvasCommand } from './model/types';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    [key: string]: any;
    command: ICanvasCommand;
    container: HTMLDivElement | null;
    canvas: HTMLDivElement | null;
    clearChoiceBox: () => void;
}
