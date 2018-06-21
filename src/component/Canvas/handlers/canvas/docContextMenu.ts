import { Canvas } from '../../Canvas';
import { IContextMenuItems } from '../../../Stage';
import { IComponent } from '../../../BaseComponent';

import { Map } from 'immutable';

export function docContextMenu(canvas: Canvas, e: any): void {
    if (canvas.props.onContextMenu) {
        let contextMenuItems: IContextMenuItems[] = [];
        const mouseEventType: string = canvas._mouseAndKeyUtil.onMouseEventType(e);
        switch (mouseEventType) {
            case 'component':
                const currentSelectedComponent: Map<string, IComponent> = canvas._canvasGlobalParam.getSelectedComponents();
                if (currentSelectedComponent.size === 1) {
                    contextMenuItems = currentSelectedComponent.first().getContextMenuItems();
                }
                break;
            case 'canvas':
                break;
        }
        canvas.props.onContextMenu(e, contextMenuItems);
    }
}
