import { Record } from 'immutable';

/**
 * 组件位置
 * left(左)|right(右)|top(上)|bottom(下)
 * 绝对定位： left, top 对应 Position: absoult | relative
 * 相对定位：对应 margin
 */
export interface IPosition {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

const defaultRecord: IPosition = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
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
        return PositionState.create({left: 0, right: 0, top: 0, bottom: 0});
    }

    /**
     * 通过传入位置参数初始化PositionState
     * @param position IPosition类型的对象（eg：{left: 10, right: 10, top: 10, bottom: 10}）
     */
    static create(position: IPosition): PositionState {
        return new PositionState(position);
    }

    getLeft(): number {
        return this.get('left');
    }

    getRight(): number {
        return this.get('right');
    }

    getTop(): number {
        return this.get('top');
    }

    getBottom(): number {
        return this.get('bottom');
    }
}
