import { docMouseMove } from './docMouseMove';
import { docMouseUp } from './docMouseUp';
import { docMouseLeave } from './docMouseLeave';
import { conMouseDown } from './conMouseDown';
import { conMouseMove } from './conMouseMove';
import { conKeyDown } from './conKeyDown';
import { conKeyUp } from './conKeyUp';
import { canDrop } from './canDrop';
import { canDragOver } from './canDragOver';

export const HandlerMap = {
    onDocMouseMove: docMouseMove,
    onDocMouseUp: docMouseUp,
    onDocMouseLeave: docMouseLeave,
    onConMouseDown: conMouseDown,
    onConMouseMove: conMouseMove,
    onConKeyDown: conKeyDown,
    onConKeyUp: conKeyUp,
    onCanDrop: canDrop,
    onCanDragOver: canDragOver
};
