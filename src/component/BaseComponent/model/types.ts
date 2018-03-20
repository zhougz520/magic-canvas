import { ISize } from './SizeState';
import { IPostion } from './PostionState';

export interface IBaseData {
    cid: string;
    size: ISize;
    position: IPostion;
}
