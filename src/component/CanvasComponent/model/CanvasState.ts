import { Record } from 'immutable';

import { Set } from 'immutable';
import { ICanvasState } from '../ICanvasState';

// /**
//  * CanvasState的属性
//  */
// interface ICanvasState {

//     // 已选中的组件名称集合
//     selectedComponents: Set<string>;
//     // 组件数据集合
//     compomentsData: Map<string, IBaseData>;
// }

/**
 * CanvasState的默认值
 */
const defaultRecord: ICanvasState = {
    selectedCids: Set<string>()  // 选中的组件
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
