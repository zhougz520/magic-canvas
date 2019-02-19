import { Record } from 'immutable';
import { IFontState } from '../model/types';

export interface IBusinessContextState extends IFontState {
    txt_val: string;
    txt_lh: string;
}

const defaultRecord: IBusinessContextState = {
    txt_val: 'top',
    txt_lh: '1.5',
    fontColor: 'rgba(0, 0, 0, 0.65)',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: 'normal',
    textValue: '某某作为...，希望通过什么达到一个什么样的目的',
    textDecoration: 'none',
    textAlign: 'left'
};

export const BusinessContextRecord: Record.Class = Record(defaultRecord);

export class BusinessContextState extends BusinessContextRecord {
    static create(businessContextState: IBusinessContextState): BusinessContextState {
        return new BusinessContextState(businessContextState);
    }

    static set(businessContextState: BusinessContextState, put: any): BusinessContextState {
        const map: any = businessContextState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new BusinessContextState(map);
    }

    getTxtVal(): string {
        return this.get('txt_val');
    }

    getTxtLineHeight(): string {
        return this.get('txt_lh');
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
