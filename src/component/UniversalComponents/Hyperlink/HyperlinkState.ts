import { Record } from 'immutable';

export interface IHyperlinkState {
    herf: string;
    content: string;
}

const defaultRecord: IHyperlinkState = {
    herf: 'https://ps.mingyuanyun.com',
    content: '这是超链接'
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

}
