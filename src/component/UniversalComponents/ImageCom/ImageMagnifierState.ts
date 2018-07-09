import { Record } from 'immutable';

export interface IImageMagnifierState {
    cid: string;
    src: string;
    backgroundPositionX: number;
    backgroundPositionY: number;
}

const defaultRecord: IImageMagnifierState = {
    cid: '',
    src: '',
    backgroundPositionX: 0,
    backgroundPositionY: 0
};

export const ImageMagnifierRecord: Record.Class = Record(defaultRecord);

export class ImageMagnifierState extends ImageMagnifierRecord {
    static create(imageMagnifierState: IImageMagnifierState): ImageMagnifierState {
        return new ImageMagnifierState(imageMagnifierState);
    }

    static set(imageMagnifierState: ImageMagnifierState, put: any): ImageMagnifierState {
        const map: any = imageMagnifierState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new ImageMagnifierState(map);
    }

    getCid(): string {
        return this.get('cid');
    }

    getSrc(): string {
        return this.get('src');
    }

    getBackgroundPositionX(): number {
        return this.get('backgroundPositionX');
    }

    getBackgroundPositionY(): number {
        return this.get('backgroundPositionY');
    }
}
