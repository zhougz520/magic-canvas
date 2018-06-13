import { Record } from 'immutable';
import { IFontState } from '../model/types';

export interface ICheckBoxState extends IFontState {
    isCheck: boolean;
    disabled: boolean;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const defaultRecord: ICheckBoxState = {
    isCheck: false,
    disabled: false,
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: 0,
    fontColor: 'rgba(0, 0, 0, 0.65)',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'left',
    textDecoration: 'none',
    textValue: 'Checkbox'
};

export const CheckBoxRecord: Record.Class = Record(defaultRecord);

// tslint:disable-next-line:max-classes-per-file
export class CheckBoxState extends CheckBoxRecord {
    static create(checkGroupState: ICheckBoxState): CheckBoxState {
        return new CheckBoxState(checkGroupState);
    }

    static set(checkGroupState: CheckBoxState, put: any): CheckBoxState {
        const map: any = checkGroupState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new CheckBoxState(map);
    }

    getIsCheck(): boolean {
        return this.get('isCheck');
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
