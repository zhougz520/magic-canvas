import { Record} from 'immutable';
import { IFontState } from '../model/types';

export interface IRadioState extends IFontState {
    isCheck: boolean;
    disabled: boolean;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const defaultRecord: IRadioState = {
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
    textValue: 'Radio'
};

export const RadioRecord: Record.Class = Record(defaultRecord);

// tslint:disable-next-line:max-classes-per-file
export class RadioState extends RadioRecord {
    static create(radioState: IRadioState): RadioState {
        return new RadioState(radioState);
    }

    static set(radioState: RadioState, put: any): RadioState {
        const map: any = radioState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new RadioState(map);
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
