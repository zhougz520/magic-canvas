import { Canvas } from '../../Canvas';
import { List } from 'immutable';

export function canDrop(canvas: Canvas, e: any): void {
    const scale: number = canvas.props.scale ? canvas.props.scale : 1;
    const type = localStorage.getItem('__dnd_type');
    const value = localStorage.getItem('__dnd_value');
    if (type === null || value === null) {
        return;
    }
    if (type !== 'dragging_cs') return;
    const data = JSON.parse(value);
    const position = canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);

    canvas._componentsUtil.addCanvasComponent(
        List().push(data),
        {
            x: Math.ceil(position.x / scale),
            y: Math.ceil(position.y / scale)
        },
        true
    );
    canvas._canvasGlobalParam.outsizeMouseUp(undefined);
}
