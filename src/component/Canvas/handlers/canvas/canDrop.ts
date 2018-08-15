import { Canvas } from '../../Canvas';
import { GlobalUtil } from '../../../util';
import { List } from 'immutable';

export function canDrop(canvas: Canvas, e: any): void {
    if (GlobalUtil.isEmptyString((localStorage as any).__dnd_type) || GlobalUtil.isEmptyString((localStorage as any).__dnd_value)) {
        return;
    }
    if ((localStorage as any).__dnd_type !== 'dragging_cs') return;
    const data = JSON.parse((localStorage as any).__dnd_value);
    const position = canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);

    canvas._componentsUtil.addCanvasComponent(List().push(data), position, true);
    canvas._canvasGlobalParam.outsizeMouseUp(undefined);
}
