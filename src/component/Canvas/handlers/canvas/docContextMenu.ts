import { Canvas } from '../../Canvas';
import { IContextMenuItems } from '../../../Stage';
import { IComponent } from '../../../BaseComponent';
import { CommandMap } from '../../command/CommandEmitted';

import { Map } from 'immutable';

export function docContextMenu(canvas: Canvas, e: any): void {
    e.preventDefault();
    canvas._canvasGlobalParam.canvasMouseUp(e);

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
                contextMenuItems = [
                    {
                        type: 'menu',
                        label: '撤销',
                        enabled: canvas._undoStack.peek() ? true : false,
                        click: () => {
                            canvas.executeCommand({
                                t: CommandMap.CANVAS_UNDO
                            });
                        }
                    },
                    {
                        type: 'menu',
                        label: '重做',
                        enabled: canvas._redoStack.peek() ? true : false,
                        click: () => {
                            canvas.executeCommand({
                                t: CommandMap.CANVAS_REDO
                            });
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        type: 'menu',
                        label: '粘贴',
                        click: () => {
                            canvas.executeCommand({
                                t: CommandMap.COM_PASTE
                            });
                        }
                    }
                ];
                break;
        }
        canvas.props.onContextMenu(e, contextMenuItems);
    }
}
