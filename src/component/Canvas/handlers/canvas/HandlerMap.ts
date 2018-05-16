import { docMouseMove } from './docMouseMove';
import { docMouseLeave } from './docMouseLeave';
import { docMouseDown } from './docMouseDown';
import { docMouseUp } from './docMouseUp';
import { docKeyDown } from './docKeyDown';
import { docKeyUp } from './docKeyUp';
import { canDrop } from './canDrop';
import { canDragOver } from './canDragOver';

export const HandlerMap = {
    onDocMouseMove: docMouseMove,
    onDocMouseLeave: docMouseLeave,
    onDocMouseDown: docMouseDown,
    onDocMouseUp: docMouseUp,
    onDocKeyDown: docKeyDown,
    onDocKeyUp: docKeyUp,
    onCanDrop: canDrop,
    onCanDragOver: canDragOver
};
