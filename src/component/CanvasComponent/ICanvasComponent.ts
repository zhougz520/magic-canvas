/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    [key: string]: any;
    container: HTMLDivElement | null;
    canvas: HTMLDivElement | null;
    clearChoiceBox: () => void;
}
