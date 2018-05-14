import { Record } from 'immutable';

export interface ICheckBoxState {
    isCheck: boolean;
    option: string;
    disabled: boolean;
    textAlign: string;
    fontColor: string;
    fontStyle: string;
    textDecoration: string;
    fontSize: number;
    fontWeight: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const initOptions = 'checkbox';

const defaultRecord: ICheckBoxState = {
    option: initOptions,
    isCheck:  false,
    disabled: false,
    fontColor: '#000',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: 0

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

    getOption(): string {
        return this.get('option');
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

    getTextDecoration(): string {
        return this.get('textDecoration');
    }

    getTextAlign(): string {
        return this.get('textAlign');
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

}
