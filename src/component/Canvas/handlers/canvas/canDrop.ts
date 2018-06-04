import { Canvas } from '../../Canvas';
import { GlobalUtil } from '../../../util';
import { List } from 'immutable';

export function canDrop(canvas: Canvas, e: any): void {
    if (GlobalUtil.isEmptyString(localStorage.__dnd_type) || GlobalUtil.isEmptyString(localStorage.__dnd_value)) {
        return;
    }
    if (localStorage.__dnd_type !== 'dragging_cs') return;
    const data = JSON.parse(localStorage.__dnd_value);
    const position = canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);

    canvas._componentsUtil.addCancasComponent(List().push(data), position, undefined, true);
    canvas._canvasGlobalParam.outsizeMouseUp(undefined);
}
