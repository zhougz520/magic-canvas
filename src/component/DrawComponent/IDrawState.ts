import { IChoiceBoxData } from './box/ChoiceBoxComponent';

export interface IDrawState {
    rectList: JSX.Element[];
    choiceBox: IChoiceBoxData | null;
}
