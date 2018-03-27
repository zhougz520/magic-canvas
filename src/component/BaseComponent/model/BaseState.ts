import { Record, Stack } from 'immutable';
import { ContentState } from './ContentState';

/**
 * BaseState的属性
 */
export interface IBase {
    // 当前内容：ContentState类型的对象
    currentContent: ContentState | null;
    /**
     * Add by zhougz
     * 记录临时的ContentState：做撤销栈时使用,size、position是线性调整,堆栈只记录线性调整开始时的状态。
     * 常规调整：改变BaseState的时候记录最新的ContentState
     * 线性调整：过程中不修改tempContentState，线性调整结束后tempContentState为上次常规调整后的值，调用setUndoStack把它设置到最新的撤销栈中
     */
    tempContentState: ContentState | null;
    // 重做：ContentState类型的堆栈
    redoStack: Stack<ContentState>;
    // 撤销：ContentState类型的堆栈
    undoStack: Stack<ContentState>;
}

const defaultRecord: IBase = {
    currentContent: null,
    tempContentState: null,
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
        const baseState: IBase = {
            currentContent: contentState,
            tempContentState: contentState,
            redoStack: Stack(),
            undoStack: Stack()
        };

        return BaseState.create(baseState);
    }

    /**
     * 通过传入对象初始化BaseState
     * @param baseState IBaseState中属性的集合对象（eg：{currentContent: null, undoStack: null, redoStack: null}）
     */
    static create(baseState: IBase): BaseState {
        return new BaseState(baseState);
    }

    /**
     * 给BaseState设置内容
     * @param baseState this.state.baseState
     * @param put IBase属性的集合
     */
    static set(baseState: BaseState, put: any): BaseState {
        const map: any = baseState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new BaseState(map);
    }

    /**
     * 设置重做、撤销栈
     * @param baseState this.state.baseState
     * @param contentState 当前设置的新内容State,newContentState
     * @param isSetUndo 是否设置撤销栈，线性调整在调整过程中不记录堆栈，调整结束时手动记录调整开始位置的状态为撤销栈
     */
    static push(baseState: BaseState, contentState: ContentState, isSetUndo: boolean = true): BaseState {
        if (baseState.getCurrentContent() === contentState) {
            return baseState;
        }

        const currentContent: ContentState = baseState.getCurrentContent();
        let tempContentState: ContentState = baseState.getTempContentState();
        let undoStack: Stack<ContentState> = baseState.getUndoStack();
        const newContent: ContentState = contentState;

        if (newContent !== currentContent && isSetUndo === true) {
            tempContentState = newContent;
            undoStack = undoStack.push(currentContent);
        }

        const editorStateChanges: any = {
            currentContent: newContent,
            tempContentState,
            undoStack,
            redoStack: Stack()
        };

        return BaseState.set(baseState, editorStateChanges);
    }

    /**
     * 撤销
     * @param baseState 当前baseState
     */
    static undo(baseState: BaseState): BaseState {
        const undoStack: Stack<ContentState> = baseState.getUndoStack();
        const newCurrentContent: ContentState = undoStack.peek();
        if (!newCurrentContent) {
          return baseState;
        }

        const currentContent: ContentState = baseState.getCurrentContent();

        return BaseState.set(baseState, {
            currentContent: newCurrentContent,
            tempContentState: newCurrentContent,
            undoStack: undoStack.shift(),
            redoStack: baseState.getRedoStack().push(currentContent)
        });
    }

    /**
     * 重做
     * @param baseState 当前baseState
     */
    static redo(baseState: BaseState): BaseState {
        const redoStack: Stack<ContentState> = baseState.getRedoStack();
        const newCurrentContent: ContentState = redoStack.peek();
        if (!newCurrentContent) {
          return baseState;
        }

        const currentContent: ContentState = baseState.getCurrentContent();

        return BaseState.set(baseState, {
            currentContent: newCurrentContent,
            tempContentState: newCurrentContent,
            undoStack: baseState.getUndoStack().push(currentContent),
            redoStack: redoStack.shift()
        });
    }

    getCurrentContent(): ContentState {
        return this.get('currentContent');
    }

    getTempContentState(): ContentState {
        return this.get('tempContentState');
    }

    getUndoStack(): Stack<ContentState> {
        return this.get('undoStack');
    }

    getRedoStack(): Stack<ContentState> {
        return this.get('redoStack');
    }
}
