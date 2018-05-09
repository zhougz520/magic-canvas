import { Record } from 'immutable';

export interface IHyperlinkState {
    herf: string;
    content: string;
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

const defaultRecord: IHyperlinkState = {
    herf: 'https://ps.mingyuanyun.com',
    content: '这是超链接',
    fontColor: '#000',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: 'normal',
    textDecoration: 'none',
    textAlign: 'center',
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: 0
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

    getContent(): string {
        return this.get('content');
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
