import { Record } from 'immutable';

export interface IInputState {
    placeholder: string;
}

const defaultRecord: IInputState = {
    placeholder: 'init value'
};

export const InputRecord: Record.Class = Record(defaultRecord);

export class InputState extends InputRecord {
    static create(inputState: IInputState): InputState {
        return new InputState(InputState);
    }

    static set(inputState: InputState, put: any): InputState {
        const map: any = inputState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new InputState(map);
    }

    getPlaceholder(): string {
        return this.get('placeholder');
    }
}
