import { IKeyFun, ICanvasCommand, IDragDiv, DragType } from './types';
import { IComponent, IPosition, ISize } from '../../BaseComponent';
import { Map, Set } from 'immutable';
import * as Anchor from '../../util/AnchorPoint';
import { IKeyArgs, IPointerArgs, keyArgs, pointerArgs } from '../../util/KeyAndPointUtil';

const body: HTMLBodyElement = document.getElementsByTagName('body')[0];

// 画布操作中的临时数据
const globalVar = {
    // 是否按下ctrl键
    ctrlPress: false,
    // 鼠标是否按下
    mouseDown: false,
    // 是否开始拖拽
    dargging: false,
    // 当前鼠标按下时的位置
    pointStart: {
        x: 0, y: 0,
        setValue(args: IPointerArgs) {
            this.x = args.pageX;
            this.y = args.pageY;
        },
        getValue() {
            return { x: this.x, y: this.y };
        }
    },
    // 当前选中的组件集合
    selectedComponents: Map<string, IComponent>(),
    // 当前画布的偏移量
    componentOffset: {
        x: 0, y: 0,
        setValue(args: { offsetX: number, offsetY: number }) {
            this.x = args.offsetX;
            this.y = args.offsetY;
        }
    },
    // 当前触发组件的数据
    currentComponentData: {
        component: null as IComponent | null,
        position: null as IPosition | null,  // 此处的position和size对象为不可修改对象，可以用作缓存
        size: null as ISize | null,
        setValue(component: IComponent) {
            this.component = component;
            this.position = component.getPosition();
            this.size = component.getSize();
        }
    },
    // 当前触发的锚点
    currentAnchor: null as Anchor.IAnchor | null,
    // 当前鼠标移动的类型
    dragType: 'none' as string,
    // 当前生成的组件位移框
    dragDivList: Map<string, IDragDiv>()
};

// 键盘事件集合
const keyFun: IKeyFun = {
    addKeyEvent() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    },
    handleKeyDown(e: any) {
        const args = keyArgs(e);
        const { key, ctrl, targetName, target } = args as IKeyArgs;

        // 如果是编辑框，则跳出键盘事件，执行默认事件
        if (target !== undefined && (target as any).id === 'editComponent') {
            return;
        }

        if (targetName !== 'textarea') {
            if (key === 'up' || key === 'down' || key === 'right' || key === 'left'
                || key === 'delete' || key === 'esc' || key === 'backspace') {
                e.stopPropagation();
                e.preventDefault();
                keyFun[key].press();
            } else if (ctrl) {
                keyFun.ctrl.press();
            }
        }
    },
    handleKeyUp(e: any) {
        const args = keyArgs(e);
        const { key, ctrl, targetName, target } = args as IKeyArgs;

        // 如果是编辑框，则跳出键盘事件，执行默认事件
        if (target !== undefined && (target as any).id === 'editComponent') {
            return;
        }

        if (targetName !== 'textarea') {
            if (key === 'up' || key === 'down' || key === 'right' || key === 'left'
                || key === 'delete' || key === 'esc' || key === 'backspace') {
                e.stopPropagation();
                e.preventDefault();
                keyFun[key].release();
            } else if (!ctrl && globalVar.ctrlPress) {
                keyFun.ctrl.release();
            }
        }
    },
    ctrl: {
        press() {
            globalVar.ctrlPress = true;
        },
        release() {
            globalVar.ctrlPress = false;
        }
    },
    clearTimer() {
        clearInterval(keyFun.timer);
        keyFun.timer = null;
    },
    left: {
        press() {
            keyFun.clearTimer();
            CanvasCommand.moveComponent('x', -1);
            keyFun.timer = setInterval(() => { CanvasCommand.moveComponent('x', -1); }, 100);
        },
        release() {
            keyFun.clearTimer();
        }
    },
    up: {
        press() {
            keyFun.clearTimer();
            CanvasCommand.moveComponent('y', -1);
            keyFun.timer = setInterval(() => { CanvasCommand.moveComponent('y', -1); }, 100);
        },
        release() {
            keyFun.clearTimer();
        }
    },
    right: {
        press() {
            keyFun.clearTimer();
            CanvasCommand.moveComponent('x', 1);
            keyFun.timer = setInterval(() => { CanvasCommand.moveComponent('x', 1); }, 100);
        },
        release() {
            keyFun.clearTimer();
        }
    },
    down: {
        press() {
            keyFun.clearTimer();
            CanvasCommand.moveComponent('y', 1);
            keyFun.timer = setInterval(() => { CanvasCommand.moveComponent('y', 1); }, 100);
        },
        release() {
            keyFun.clearTimer();
        }
    }

};

/**
 * 创建Canvas的命令集合
 */
export const CanvasCommand: ICanvasCommand = {
    // 初始化CanvasCommand
    initCanvas() {
        keyFun.addKeyEvent();
    },

    // 是否时多选状态
    isMultiselect() {
        return globalVar.ctrlPress;
    },

    // 鼠标是否按下
    isMouseDown() {
        return globalVar.mouseDown;
    },

    // 返回鼠标按下时的初始位置
    getPointerStart() {
        return globalVar.pointStart.getValue();
    },

    // 是否开始拖拽
    isDargging() {
        return globalVar.dargging;
    },

    // 返回鼠标拖拽类型
    getDragType() {
        return globalVar.dragType;
    },

    // canvas上的鼠标点击事件
    canvasMouseDown(e: any) {
        globalVar.mouseDown = true;
        globalVar.dragType = DragType.Choice;
        const args = pointerArgs(e);
        if (args !== undefined) {
            globalVar.pointStart.setValue(args);
        }
    },

    // canvas上的鼠标点击事件
    canvasMouseUp(e: any) {
        globalVar.mouseDown = false;
        globalVar.dargging = false;
        globalVar.dragType = DragType.None;
    },

    // 组件传递而来的鼠标点击事件
    componentMouseDown(e: any) {
        globalVar.mouseDown = true;
        globalVar.dragType = DragType.Shift;
        const args = pointerArgs(e);
        if (args !== undefined) {
            globalVar.pointStart.setValue(args);
        }
    },
    // 组件传递而来的鼠标点击事件
    componentMouseUp(e: any) {
        globalVar.mouseDown = false;
        globalVar.dargging = false;
        globalVar.dragType = DragType.None;
    },

    // 鼠标移动时计算组件锚点位置
    anchorCalc(currentX: number, currentY: number) {
        let anchor: Anchor.IAnchor | null = null;
        globalVar.selectedComponents.map((com, cid) => {
            if (com) {
                anchor = com.getPointerAnchor(currentX, currentY);
            }
        });

        return anchor;
    },

    // 组件上锚点触发的鼠标点击事件
    anchorMouseDown(e: any, anchor: Anchor.IAnchor) {
        // 鼠标按下事件
        const args = pointerArgs(e);
        if (args !== undefined) {
            globalVar.pointStart.setValue(args);
            globalVar.mouseDown = true;
            globalVar.dragType = DragType.Stretch;
        }
        const com = globalVar.selectedComponents.get(anchor.cid);
        if (com) {
            globalVar.currentComponentData.setValue(com);
            globalVar.currentAnchor = anchor;
        }
    },

    // 组件上锚点触发的鼠标点击事件
    anchorMouseUp(e: any) {
        globalVar.mouseDown = false;
        globalVar.dargging = false;
        globalVar.dragType = DragType.None;
    },

    //  组件上锚点拖动事件
    anchorMove(offset: { x: number, y: number }) {
        // tslint:disable-next-line:no-console
        console.log(offset);
        globalVar.dargging = true;
        if (globalVar.currentAnchor) {
            switch (globalVar.currentAnchor.key) {
                // 左上锚点，修改position
                case 'ul': return this.stretchComponent(offset.x, offset.y, -offset.x, -offset.y);
                // 左中锚点，修改position(left)
                case 'ml': return this.stretchComponent(offset.x, 0, -offset.x, 0);
                // 左下锚点
                case 'bl': return this.stretchComponent(offset.x, 0, -offset.x, offset.y);
                // 上中锚点
                case 'um': return this.stretchComponent(0, offset.y, 0, -offset.y);
                // 右上锚点
                case 'ur': return this.stretchComponent(0, offset.y, offset.x, -offset.y);
                // 右中锚点
                case 'mr': return this.stretchComponent(0, 0, offset.x, 0);
                // 右下锚点
                case 'br': return this.stretchComponent(0, 0, offset.x, offset.y);
                // 下中锚点
                case 'bm': return this.stretchComponent(0, 0, 0, offset.y);
            }
        }
    },

    // 新增选中组件
    addSelectedComponent(cid: string, com: IComponent) {
        let components = globalVar.selectedComponents;
        if (!this.isMultiselect() && !components.has(cid)) {
            components = components.clear();
        }
        globalVar.selectedComponents = components.set(cid, com);
    },

    // 获取所以选中组件
    getSelectedComponents() {
        return globalVar.selectedComponents;
    },

    getSelectedCids() {
        return Set.fromKeys(globalVar.selectedComponents);
    },

    // 清空选中组件
    clearSelectedComponent() {
        globalVar.selectedComponents = globalVar.selectedComponents.clear();
    },

    // 键盘移动组件
    moveComponent(axis: string, distance: number) {
        globalVar.selectedComponents.map((component, cid) => {
            if (component) {
                const position = component.getPosition();
                component.setPosition({
                    left: axis === 'y' ? position.left : position.left + distance,
                    right: position.right,
                    top: axis === 'x' ? position.top : position.top + distance,
                    bottom: position.bottom
                });
            }
        });
    },

    // 组件伸展
    stretchComponent(left: number, top: number, width: number, height: number) {
        const component = globalVar.currentComponentData.component;
        const position = globalVar.currentComponentData.position;
        const size = globalVar.currentComponentData.size;
        if (component !== null && position !== null && size !== null) {
            component.setPosition({
                left: position.left + left,
                right: position.right,
                top: position.top + top,
                bottom: position.bottom
            });
            component.setSize({
                width: size.width + width,
                height: size.height + height
            });
        }
    },

    // 在body中创建组件的移动框
    drawDragBox(componentPosition: any) {
        // 每次创建的时候都跟新一次偏移量
        const offsetX = componentPosition.stageOffset.left + componentPosition.canvasOffset.left;
        const offsetY = componentPosition.stageOffset.top + componentPosition.canvasOffset.top;
        globalVar.componentOffset.setValue({ offsetX, offsetY });

        const selectedComponents = globalVar.selectedComponents;
        selectedComponents.map((component, cid) => {
            if (!cid || !component) return;
            if (!globalVar.dragDivList.has(cid)) {
                const documentDiv = document.createElement('div');
                documentDiv.style.position = 'absolute';
                documentDiv.style.top = `${component.getPosition().top + offsetY}px`;
                documentDiv.style.left = `${component.getPosition().left + offsetX}px`;
                documentDiv.style.width = `${component.getSize().width}px`;
                documentDiv.style.height = `${component.getSize().height}px`;
                documentDiv.style.border = '1px solid #108ee9';
                documentDiv.style.zIndex = '3';
                documentDiv.style.display = 'none';
                documentDiv.style.pointerEvents = 'none';
                body.appendChild(documentDiv);

                globalVar.dragDivList = globalVar.dragDivList.set(cid, { component, documentDiv, hasChange: false });
            }
        });
    },

    // 在body中移动组件的移动框
    moveDragBox(offset: { x: number, y: number }) {
        globalVar.dargging = true;
        globalVar.dragDivList.map((item: IDragDiv | undefined) => {
            if (item !== undefined) {
                const pos = item.component.getPosition();
                const div = item.documentDiv;
                div.style.display = 'block';
                item.hasChange = true;
                if (div.style.left) div.style.left = `${pos.left + offset.x + globalVar.componentOffset.x}px`;
                if (div.style.top) div.style.top = `${pos.top + offset.y + globalVar.componentOffset.y}px`;
            }
        });
    },

    // 在body中删除组件的移动框
    clearDragBox() {
        globalVar.dragDivList.map((value, key) => {
            if (value !== undefined) {
                const div = value.documentDiv;
                if (div.style.left && div.style.top && value.hasChange) {
                    const pos = value.component.getPosition();
                    value.component.setPosition({
                        left: parseInt(div.style.left, 10) - globalVar.componentOffset.x,
                        right: pos.right,
                        top: parseInt(div.style.top, 10) - globalVar.componentOffset.y,
                        bottom: pos.bottom
                    });
                }
                body.removeChild(div);
            }
        });
        globalVar.dragDivList = globalVar.dragDivList.clear();
    }
};
