import { Record, Stack, Set } from 'immutable';
import { IAnchor } from '../../util/AnchorPoint';

export interface ICanvasState {
    anchor: IAnchor | null;
    redoStack: Stack<string>;
    undoStack: Stack<string>;
}

/**
 * CanvasState的默认值,
 * canvas的缓存堆栈只缓存cid的顺序
 */
const defaultRecord: ICanvasState = {
    // 当前鼠标图标类型
    anchor: null,
    // 重做的缓存
    redoStack: Stack(),
    // 撤销的缓存
    undoStack: Stack()
};

export const CanvasStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建基类的CanvasState
 * 提供初始化、get\set对应属性的方法
 */
export class CanvasState extends CanvasStateRecord {

    /**
     * 初始化空的CanvasState
     */
    static createEmpty(): CanvasState {
        return new CanvasState(defaultRecord);
    }

    static create(config: any) {
        return new CanvasState(config);
    }

    /**
     * 给CanvasState设置内容
     * @param CanvasState this.state.CanvasState
     * @param put CanvasState属性的集合
     */
    static set(canvasState: CanvasState, put: any): CanvasState {
        const map: any = canvasState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new CanvasState(map);
    }

    pushSelectedComment(cid: string, append: boolean = false): CanvasState {
        const comments: Set<string> = this.getSelectedComponents();
        if (append === false) {
            comments.clear();
        }
        const newConmments: Set<string> = comments.add(cid);

        return this.setSelectedComponents(newConmments);
    }

    getSelectedComponents(): Set<string> {
        return this.get('selectedComponents');
    }

    setSelectedComponents(value: Set<string>): CanvasState {
        return this.replaceRecord('selectedComponents', value);
    }

    replaceRecord(key: string, value: any): CanvasState {
        const record = Object.create(Object.getPrototypeOf(this));
        record[key] = value;

        return record;
    }

}
