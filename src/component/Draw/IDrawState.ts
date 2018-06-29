import { IChoiceBoxData } from './box/ChoiceBoxComponent';

export interface IDrawState {
    rectList: JSX.Element[];
    choiceBox: IChoiceBoxData | null;
    // 画布的大小
    canvasSize: { width: number, height: number };
}
