import { Canvas } from '../../canvas';
import { GlobalUtil } from '../../../util/GlobalUtil';

export function canDrop(canvas: Canvas, e: any): void {
    if (GlobalUtil.isEmptyString(localStorage.__dnd_type) || GlobalUtil.isEmptyString(localStorage.__dnd_value)) {
        return;
    }
    if (localStorage.__dnd_type !== 'dragging_cs') return;
    const data = JSON.parse(localStorage.__dnd_value);
    const position = canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);

    const componentList = canvas._componentsUtil.addCancasComponent(data, position);
    canvas.setState({
        componentList
    });

    // 拖拽添加记栈
    // const comDataList: OrderedSet<any> = OrderedSet().add(comData);
    // const oldUndoStack: Stack<IStack> = this.state.undoStack;
    // const newUndoStack: Stack<IStack> = StackUtil.getCanvasStack(this, oldUndoStack, 'create', comDataList);
    // this.setState({
    //     undoStack: newUndoStack
    // });
}
