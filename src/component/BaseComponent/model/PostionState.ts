import { Record } from 'immutable';
import { IPostion } from './types';

const defaultRecord: IPostion = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};

export const PostionStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建组件位置State
 */
export class PostionState extends PostionStateRecord {
    /**
     * 初始化一个空的PostionState
     */
    static createEmpty(): PostionState {
        return PostionState.create({left: 0, right: 0, top: 0, bottom: 0});
    }

    /**
     * 通过传入位置参数初始化PostionState
     * @param postion IPostion类型的对象（eg：{left: 10, right: 10, top: 10, bottom: 10}）
     */
    static create(postion: IPostion): PostionState {
        return new PostionState(postion);
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
