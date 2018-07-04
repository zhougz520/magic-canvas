import { Record, List } from 'immutable';
import { IFontState } from '../model/types';

export interface ISelectorState extends IFontState {
    disabled: boolean;
    options: any[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const initOptions = [
    'option1',
    'option2',
    'option3'
];

const defaultRecord: ISelectorState = {
    disabled: false,
    options: initOptions,
    backgroundColor: '#FFF',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    fontColor: 'rgba(0, 0, 0, 0.65)',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: 'normal',
    textValue: 'option1',
    textDecoration: 'none',
    textAlign: 'left'
};

export const SelectorRecord: Record.Class = Record(defaultRecord);

export class SelectorState extends SelectorRecord {
    static create(selectorState: ISelectorState): SelectorState {
        return new SelectorState(selectorState);
    }

    static set(selectorState: SelectorState, put: any): SelectorState {
        const map: any = selectorState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new SelectorState(map);
    }

    getOptions(): List<Map<any, any>> {
        return this.get('options');
    }

    getDisabled(): string {
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
