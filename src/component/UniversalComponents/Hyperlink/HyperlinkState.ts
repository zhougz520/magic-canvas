import { Record } from 'immutable';
import { IFontState } from '../model/types';

export interface IHyperlinkState extends IFontState {
    herf: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const defaultRecord: IHyperlinkState = {
    herf: '',
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: 0,
    fontColor: 'blue',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
    textDecoration: 'underline',
    textValue: '超链接'
};

export const HyperlinkRecord: Record.Class = Record(defaultRecord);

export class HyperlinkState extends HyperlinkRecord {
    static create(hyperlinkState: IHyperlinkState): HyperlinkState {
        return new HyperlinkState(hyperlinkState);
    }

    static set(hyperlinkState: HyperlinkState, put: any): HyperlinkState {
        const map: any = hyperlinkState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new HyperlinkState(map);
    }

    getHerf(): string {
        return this.get('herf');
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
