import { Set } from 'immutable';
import { IChoiceBoxData } from './box/ChoiceBoxComponent';

export interface IDrawState {
    cids: Set<string>;
    choiceBox: IChoiceBoxData | null;
}
