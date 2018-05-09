import { BaseState } from '../model/BaseState';

export interface IComData {
    id: string;
    txt_v: string;
    w: number;
    h: number;
    l: number;
    t: number;
}

export const convertFromDataToBaseState = (data: IComData): BaseState | null => {
    return null;
};
