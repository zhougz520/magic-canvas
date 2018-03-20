import * as keycode from 'keycode';
import { IPointerArgs, IKeyArgs, IKeyFun, ICanvasCommand } from './types';
import { IComponent, IPosition, ISize } from '../../BaseComponent';
import { Map } from 'immutable';
import * as Anchor from '../../util/AnchorPoint';

const body: HTMLBodyElement = document.getElementsByTagName('body')[0];

const keyArgs = (evt: any): undefined | IKeyArgs => {
    return evt === undefined ? undefined : {
        key: keycode(evt),
        keyCode: evt.keyCode,
        ctrl: /mac os x/i.test(navigator.userAgent) ? evt.metaKey : evt.ctrlKey,
        shift: evt.shiftKey,
        alt: evt.altKey,
        target: evt.target,
        // tslint:disable-next-line:max-line-length
        targetName: (evt.target === undefined || evt.target.tagName === undefined) ? undefined : evt.target.tagName.toLowerCase()
    };
};

const pointerArgs = (e: any): undefined | IPointerArgs => {
    return e === undefined ? undefined : {
        pageX: e.pageX as number,
        pageY: e.pageY as number,
        keyArgs: keyArgs(e)
    };
};

interface IDragDiv {
    component: IComponent;
    documentDiv: HTMLDivElement;
    hasChange: boolean;
}

// tslint:disable-next-line:prefer-const
let globalVar = {
    ctrlPress: false,  // 是否按下ctrl键
    mouseDown: false,  // 鼠标是否按下
    dargingStart: false, // 是否开始拖拽
    pointStart: {    // 鼠标按下时的位置
        x: 0, y: 0,
        setValue(args: IPointerArgs) {
            this.x = args.pageX;
            this.y = args.pageY;
        }
    },
    componentOffset: {  // 画布的偏移量
        x: 0, y: 0,
        setValue(args: { offsetX: number, offsetY: number }) {
            this.x = args.offsetX;
            this.y = args.offsetY;
        }
    },
    currentComponentData: {      // 当前触发组件的数据
        component: null as IComponent | null,
        position: null as IPosition | null,  // 此处的position和size对象为不可修改对象，可以用作缓存
        size: null as ISize | null,
        setValue(component: IComponent) {
            this.component = component;
            this.position = component.getPosition();
            this.size = component.getSize();
        }
    },
    currentAnchor: null as Anchor.IAnchor | null,   // 当前触发的锚点
    dragType: 'none' as string,
    dragDivList: Map<string, IDragDiv>()
};

const keyFun: IKeyFun = {
    addKeyEvent() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    },
    handleKeyDown(e: any) {
        const args = keyArgs(e);
        const { key, ctrl, targetName } = args as IKeyArgs;
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
        const { key, ctrl, targetName } = args as IKeyArgs;
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
    canvas: null,
    // 初始化CanvasCommand
    initCanvas() {
        keyFun.addKeyEvent();
    },

    // 将CanvasCommand中的函数绑定到CanvasCanvas组件中
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind' && key !== 'canvas') {
                ins[key] = this[key].bind(ins);
            }
        }
        this.canvas = ins;
    },

    // 是否时多选状态
    isMultiselect() {
        return globalVar.ctrlPress;
    },

    isMouseDown() {
        return globalVar.mouseDown;
    },

    // 返回鼠标按下时的初始位置
    getPointerStart() {
        return globalVar.pointStart;
    },

    // 是否开始拖拽
    isDargingStart() {
        return globalVar.dargingStart;
    },

    // 开始拖拽
    setDragingStart() {
        if (globalVar.mouseDown) globalVar.dargingStart = true;
    },

    // 结束拖拽
    setDragingEnd() {
        if (!globalVar.mouseDown) globalVar.dargingStart = false;
    },

    // 返回鼠标拖拽类型
    getDragType() {
        return globalVar.dragType;
    },

    // canvas上的鼠标点击事件
    canvasMouseDown(e: any) {
        globalVar.mouseDown = true;
        globalVar.dragType = 'choice';
        const args = pointerArgs(e);
        if (args !== undefined) {
            globalVar.pointStart.setValue(args);
        }
    },

    // canvas上的鼠标点击事件
    canvasMouseUp(e: any) {
        globalVar.mouseDown = false;
        globalVar.dargingStart = false;
        globalVar.dragType = 'none';
    },

    // 组件传递而来的鼠标点击事件
    componentMouseDown(e: any) {
        globalVar.mouseDown = true;
        globalVar.dragType = 'drag';
        const args = pointerArgs(e);
        if (args !== undefined) {
            globalVar.pointStart.setValue(args);
        }
    },
    // 组件传递而来的鼠标点击事件
    componentMouseUp(e: any) {
        globalVar.mouseDown = false;
        globalVar.dargingStart = false;
        globalVar.dragType = 'none';
    },

    // 组件上锚点触发的鼠标点击事件
    componentAnchorDown(component: IComponent, anchorPoint: Anchor.IAnchor) {
        globalVar.mouseDown = true;
        globalVar.dragType = 'stretch';
        globalVar.currentComponentData.setValue(component);
        globalVar.currentAnchor = anchorPoint;
    },

    // // 键盘移动组件
    // moveComponent(axis: string, distance: number) {

    // },

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

    //  组件上锚点拖动事件
    componentAnchorMove(offset: { x: number, y: number }) {
        if (!globalVar.dargingStart) return;
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

    // 在body中创建组件的移动框
    createDocumentDiv(cid: string, component: IComponent, componentPosition: any) {
        // 每次创建的时候都跟新一次偏移量
        const offsetX = componentPosition.stageOffset.left + componentPosition.canvasOffset.left;
        const offsetY = componentPosition.stageOffset.top + componentPosition.canvasOffset.top;
        globalVar.componentOffset.setValue({ offsetX, offsetY });

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
    },

    // 在body中移动组件的移动框
    moveDocumentDiv(offset: { x: number, y: number }) {
        if (!globalVar.dargingStart) return;
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
    clearDocumentDiv() {
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
