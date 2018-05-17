import { Record } from 'immutable';

/**
 * 组件位置
 * left(左)|right(右)|top(上)|bottom(下)
 * 绝对定位： left, top 对应 Position: absoult | relative
 * 相对定位：对应 margin
 */
export interface IPosition {
    top: number;
    left: number;
}

const defaultRecord: IPosition = {
    top: 0,
    left: 0
};

export const PositionStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建组件位置State
 */
export class PositionState extends PositionStateRecord {
    /**
     * 初始化一个空的PositionState
     */
    static createEmpty(): PositionState {
        return PositionState.create({ top: 0, left: 0 });
    }

    /**
     * 通过传入位置参数初始化PositionState
     * @param position IPosition类型的对象（eg：{left: 10, right: 10, top: 10, bottom: 10}）
     */
    static create(position: IPosition): PositionState {
        return new PositionState(position);
    }

    getTop(): number {
        return this.get('top');
    }

    getLeft(): number {
        return this.get('left');
    }
}
