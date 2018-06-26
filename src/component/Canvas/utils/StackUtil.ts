import { Canvas } from '../Canvas';
import { IStack, OperationType, IComponentList } from '../model/types';
import { List, Stack } from 'immutable';

export class StackUtil {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 设置画布的撤销栈
     * @param timeStamp 当前时间戳
     * @param operationType 操作类型
     * @param componentList 操作组件List
     */
    setCanvasUndoStack = (
        timeStamp: number,
        operationType: OperationType,
        componentList: List<IComponentList>
    ): void => {
        let currentUndoStack: Stack<IStack> = this._canvas._undoStack;

        // 如果推过来的栈与第一个栈时间戳一致，则进行合并。否则作为新栈
        if (currentUndoStack.first() && currentUndoStack.first().timeStamp === timeStamp) {
            componentList.map(
                (component: IComponentList) => {
                    currentUndoStack.first().componentList = currentUndoStack.first().componentList.update(
                        // tslint:disable-next-line:arrow-return-shorthand
                        (value: List<IComponentList>) => { return value.push(component); }
                    );
                }
            );
        } else {
            currentUndoStack = currentUndoStack.push({
                timeStamp,
                operationType,
                componentList
            });
        }

        this._canvas._undoStack = currentUndoStack;

        // 如果画布是干净的，设置画布已经变脏
        if (this._canvas._isDirty === false) {
            this._canvas.setIsDirty(true);
            this._canvas.props.setPageDirty && this._canvas.props.setPageDirty();
        }
    }
}
