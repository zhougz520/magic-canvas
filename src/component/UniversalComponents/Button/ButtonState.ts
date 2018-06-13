import { Record } from 'immutable';
import { IFontState } from '../model/types';

/**
 * ButtonState的属性
 */
export interface IButtonState extends IFontState {
    type: string;
    isCircle: boolean;
    disabled: boolean;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const defaultRecord: IButtonState = {
    type: 'primary',
    isCircle: false,
    disabled: false,
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    borderWidth: 0,
    fontColor: '#FFF',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
    textDecoration: 'none',
    textValue: '按钮'
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

    getIsCircle(): boolean {
        return this.get('isCircle');
    }

    getDisabled(): boolean {
        return this.get('disabled');
    }

    getBackgroundColor(): string {
        return this.get('backgroundColor');
    }

    getBorderColor(): string {
        return this.get('borderColor');
    }

    getBorderWidth(): number {
        return this.get('borderWidth');
    }

    getFontColor(): string {
        return this.get('fontColor');
    }

    getFontStyle(): string {
        return this.get('fontStyle');
    }

    getFontSize(): string {
        return this.get('fontSize');
    }

    getFontWeight(): string {
        return this.get('fontWeight');
    }

    getTextAlign(): string {
        return this.get('textAlign');
    }

    getTextDecoration(): string {
        return this.get('textDecoration');
    }

    getTextValue(): string {
        return this.get('textValue');
    }
}
