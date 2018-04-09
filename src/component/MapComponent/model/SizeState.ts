import { Record } from 'immutable';

/**
 * 组件大小
 * width(宽)|height(高)
 */
export interface ISize {
    width: number;
    height: number;
}

const defaultRecord: ISize = {
    width: 0,
    height: 0
};

export const SizeStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建组件大小State
 */
export class SizeState extends SizeStateRecord {
    /**
     * 初始化一个空的SizeState
     */
    static createEmpty(): SizeState {
        return SizeState.create({width: 0, height: 0});
    }

    /**
     * 通过传入大小参数初始化SizeState
     * @param size ISize类型的对象（eg：{width: 10, height: 10}）
     */
    static create(size: ISize): SizeState {
        return new SizeState(size);
    }

    getWidth(): number {
        return this.get('width');
    }

    getHeight(): number {
        return this.get('height');
    }
}
