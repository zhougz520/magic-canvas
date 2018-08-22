import { Record } from 'immutable';
import { ISize, IPosition } from '../../BaseComponent';

export interface IImageMagnifierState {
    cid: string;                    // 图片父组件cid
    rectSize: ISize;                // 放大区域大小
    rectPosition: IPosition;        // 放大区域位置（相对父组件位置）
    backgroundPositionX: number;    // 放大偏移x
    backgroundPositionY: number;    // 放大偏移y
}

const defaultRecord: IImageMagnifierState = {
    cid: '',
    rectSize: { width: 0, height: 0 },
    rectPosition: { top: 0, left: 0 },
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

    getRectSize(): ISize {
        return this.get('rectSize');
    }

    getRectPosition(): IPosition {
        return this.get('rectPosition');
    }

    getBackgroundPositionX(): number {
        return this.get('backgroundPositionX');
    }

    getBackgroundPositionY(): number {
        return this.get('backgroundPositionY');
    }
}
