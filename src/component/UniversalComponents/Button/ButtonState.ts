import { Record } from 'immutable';

/**
 * ButtonState的属性
 */
export interface IButtonState {
    type: string;
}

const defaultRecord: IButtonState = {
    type: 'primary'
};

export const ButtonStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建基类的ButtonState
 * 提供初始化、get\set对应属性的方法
 */
export class ButtonState extends ButtonStateRecord {
    /**
     * 通过传入对象初始化ButtonState
     * @param buttonState IButtonState中属性的集合对象（eg：{type: 'primary'}）
     */
    static create(buttonState: IButtonState): ButtonState {
        return new ButtonState(buttonState);
    }

    /**
     * 给ButtonState设置内容
     * @param buttonState this.getCustomState()
     * @param put IButtonState属性的集合
     */
    static set(buttonState: ButtonState, put: any): ButtonState {
        const map: any = buttonState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new ButtonState(map);
    }

    getType(): string {
        return this.get('type');
    }
}
