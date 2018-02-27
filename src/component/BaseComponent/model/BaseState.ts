import { Record } from 'immutable';
import { SizeState } from './SizeState';
import { PostionState } from './PostionState';

/**
 * BaseState的属性
 */
interface IBaseState {
    // 是否选中：是（true）|否（false）
    isSelected: boolean;
    // 组件大小：width|height
    sizeState: SizeState | null;
    // 组件位置：left|right|top|bottom
    postionState: PostionState | null;
    // 组件中带格式的富文本内容
    richChildNode: any;
}

const defaultRecord: IBaseState = {
    isSelected: false,
    sizeState: null,
    postionState: null,
    richChildNode: null
};

export const BaseStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建基类的BaseState
 * 提供初始化、get\set对应属性的方法
 */
export class BaseState extends BaseStateRecord {
    /**
     * 初始化空的BaseState
     */
    static createEmpty(): BaseState {
        return BaseState.createWithSizeAndPostion(
            SizeState.createEmpty(),
            PostionState.createEmpty()
        );
    }

    /**
     * 通过大小和位置初始化BaseState
     * @param newSizeState 大小状态:SizeState.create({ width: 10, height: 10 })
     * @param newPostionState 位置状态:PostionState.create({ left: 0, right: 0, top: 0, bottom: 0 })
     */
    static createWithSizeAndPostion(newSizeState: SizeState, newPostionState: PostionState): BaseState {
        const recordConfig = {
            sizeState: newSizeState,
            postionState: newPostionState
        };

        return BaseState.create(recordConfig);
    }

    /**
     * 通过传入对象初始化BaseState
     * @param config IBaseState中属性的集合对象（eg：{sizeState: null, richChildNode: null}）
     */
    static create(config: any): BaseState {
        return new BaseState(config);
    }

    static set(baseState: BaseState, put: any): BaseState {
        const map: any = baseState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new BaseState(map);
    }

    getIsSelected(): boolean {
        return this.get('isSelected');
    }

    getSizeState(): SizeState {
        return this.get('sizeState');
    }

    getPostionState(): PostionState {
        return this.get('postionState');
    }

    getRichChildNode(): any {
        return this.get('richChildNode');
    }
}
