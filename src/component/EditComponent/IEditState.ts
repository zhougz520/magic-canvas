import { IComponent } from '../BaseComponent';

export interface IEditState {
    maxWidth: number;
    top: number;
    left: number;

    currentCom: IComponent | null;
}
