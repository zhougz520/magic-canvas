import { Record } from 'immutable';
import { ContentState } from './ContentState';

import { Stack } from 'immutable';

/**
 * BaseState的属性
 */
interface IBaseState {
    // 当前内容：ContentState类型的对象
    currentContent: ContentState | null;
    // 重做：ContentState类型的堆栈
    redoStack: Stack<ContentState>;
    // 撤销：ContentState类型的堆栈
    undoStack: Stack<ContentState>;
}

const defaultRecord: IBaseState = {
    currentContent: null,
    redoStack: Stack(),
    undoStack: Stack()
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
        return BaseState.createWithContent(
            ContentState.createEmpty()
        );
    }

    /**
     * 通过内容初始化BaseState
     * @param contentState 内容对象:ContentState.create(contentState: IContentState)
     */
    static createWithContent(contentState: ContentState): BaseState {
        const recordConfig = {
            currentContent: contentState,
            undoStack: Stack(),
            redoStack: Stack()
        };

        return BaseState.create(recordConfig);
    }

    /**
     * 通过传入对象初始化BaseState
     * @param config IBaseState中属性的集合对象（eg：{currentContent: null, undoStack: null, redoStack: null}）
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

    getCurrentContent(): ContentState {
        return this.get('currentContent');
    }

    getUndoStack(): Stack<ContentState> {
        return this.get('undoStack');
    }

    getRedoStack(): Stack<ContentState> {
        return this.get('redoStack');
    }
}
