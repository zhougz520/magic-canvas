import { Map } from 'immutable';
import { IReactData } from './box/FrameComponent';
import { IChoiceBoxData } from './box/ChoiceBoxComponent';

export interface IDrawState {
    // [key: string]: any;
    frameMap: Map<string, IReactData>;
    choiceBox: IChoiceBoxData | null;
}
