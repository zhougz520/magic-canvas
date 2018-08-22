import { Canvas } from '../../Canvas';
import { List } from 'immutable';

export function canDrop(canvas: Canvas, e: any): void {
    const type = localStorage.getItem('__dnd_type');
    const value = localStorage.getItem('__dnd_value');
    if (type === null || value === null) {
        return;
    }
    if (type !== 'dragging_cs') return;
    const data = JSON.parse(value);
    const position = canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);

    canvas._componentsUtil.addCanvasComponent(List().push(data), position, true);
    canvas._canvasGlobalParam.outsizeMouseUp(undefined);
}
