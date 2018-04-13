import { Record } from 'immutable';

export interface IHyperlinkState {
    type: string;
}

const defaultRecord: IHyperlinkState = {
    type: 'primary'
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

    getType(): string {
        return this.get('type');
    }
}
