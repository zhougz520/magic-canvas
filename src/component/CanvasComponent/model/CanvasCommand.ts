import { IKeyFun, ICanvasCommand, IDragDiv, DragType, IOffset, IBoundary } from './types';
import { IComponent, IPosition, ISize } from '../../BaseComponent';
import { Map, Set } from 'immutable';
import * as Anchor from '../../util/AnchorPoint';
import { config } from '../../config';
import { IBaseData } from '../../DrawComponent/model/types';

const body: HTMLBodyElement = document.getElementsByTagName('body')[0];

// 画布操作中的临时数据
const globalVar = {
    // 是否按下ctrl键
    ctrlPress: false,
    // 鼠标是否按下
    mouseDown: false,
    // 是否开始拖拽
    dargging: false,
    // 鼠标按下时的位置
    pointStart: {
        pos: {
            canvas: { x: 0, y: 0 },
            stage: { x: 0, y: 0 },
            dom: { x: 0, y: 0 }
        } as { [key: string]: { x: number, y: number } },
        setValue(x: number, y: number, type: string) {
            this.pos[type] = { x, y };
        },
        getValue(type: string) {
            return this.pos[type];
        }
    },
    // 当前选中的组件集合
    selectedComponents: Map<string, any>(),
    // 当前选中的组件组件的大小和位置(为了实时修改组件的大小)
    currentComponentSize: {
        list: Map<string, { position: IPosition, size: ISize }>(),
        setValue() {
            this.list = this.list.clear();
            globalVar.selectedComponents.map((com, cid) => {
                if (com && cid) {
                    this.list = this.list.set(cid, {
                        position: com.getPosition(),
                        size: com.getSize()
                    });
                }
            });
        },
        getValue(cid: string) {
            return this.list.get(cid);
        }
    },
    // 当前画布canvas相对document的偏移量
    componentOffset: {
        x: 0, y: 0,
        setValue(args: { offsetX: number, offsetY: number }) {
            this.x = args.offsetX;
            this.y = args.offsetY;
        }
    },
    // 当前触发的锚点
    currentAnchor: null as Anchor.IAnchor | null,
    // 当前鼠标移动的类型
    dragType: 'none' as string,
    // 当前生成的组件位移框
    dragDivList: Map<string, IDragDiv>(),
    // 是否富文本编辑状态
    isRichEditMode: false,
    TECellEditorActivateKeyRange: [
        { min: 229, max: 229 }, // 中文输入法
        { min: 13, max: 13 },   // 回车
        { min: 32, max: 32 }, // 空格
        { min: 65, max: 90 },
        { min: 48, max: 57 },
        { min: 96, max: 107 },
        { min: 109, max: 111 },
        { min: 186, max: 192 },
        { min: 219, max: 222 }
    ],
    // 当前所有拖拽框的大小，用于document坐标系边界检测
    dragDivVolume: {
        startPoint: { x: 10000, y: 10000 } as IOffset,
        endPoint: { x: 0, y: 0 } as IOffset,
        addValue(top: number, left: number, width: number, height: number) {
            this.startPoint = {
                x: Math.min(this.startPoint.x, left),
                y: Math.min(this.startPoint.y, top)
            };
            this.endPoint = {
                x: Math.max(this.endPoint.x, left + width),
                y: Math.max(this.endPoint.y, top + height)
            };
        },
        rest() {
            this.startPoint = { x: 10000, y: 10000 };
            this.endPoint = { x: 0, y: 0 };
        }
    },
    // stage的滚动定时器
    scrollTimer: null as null | NodeJS.Timer,
    // 新拖入组件的cid
    addComponentCid: null as string | null,
    // 选中时是否可操作
    isCanCtrl: true
};

// 键盘事件集合
export const keyFun: IKeyFun = {
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
    // 是否时多选状态
    isMultiselect() {
        return globalVar.ctrlPress;
    },

    // 鼠标是否按下
    isMouseDown() {
        return globalVar.mouseDown;
    },

    // 是否开始拖拽
    isDargging() {
        return globalVar.dargging;
    },

    // 开始拖拽, 用于判断刚刚开始拖拽
    darggingStart() {
        globalVar.dargging = true;
    },

    // 返回鼠标拖拽类型
    getDragType() {
        return globalVar.dragType;
    },

    // stage外的鼠标点击事件
    outsideMouseDown(e: any) {
        globalVar.mouseDown = true;
    },

    // stage外的鼠标点击事件
    outsizeMouseUp(e: any) {
        globalVar.mouseDown = false;
        globalVar.dargging = false;
    },

    // canvas上的鼠标点击事件
    canvasMouseDown(e: any) {
        globalVar.mouseDown = true;
        globalVar.dragType = DragType.Choice;
    },

    // canvas上的鼠标点击事件
    canvasMouseUp(e: any) {
        // 当组件经历过形状位置改变后，手动设置一次组件堆栈
        if (globalVar.dargging) this.setUndoStack();
        globalVar.mouseDown = false;
        globalVar.dargging = false;
        globalVar.dragType = DragType.None;
    },

    // 组件传递而来的鼠标点击事件
    componentMouseDown(e: any) {
        globalVar.mouseDown = true;
        globalVar.dragType = DragType.Shift;
    },
    // 组件传递而来的鼠标点击事件
    componentMouseUp(e: any) {
        // 当组件经历过形状位置改变后，手动设置一次组件堆栈
        if (globalVar.dargging) this.setUndoStack();
        globalVar.mouseDown = false;
        globalVar.dargging = false;
        globalVar.dragType = DragType.None;
    },

    // 记录Stage上鼠标按下时的位置
    setPointStart(x: number, y: number, type: string) {
        globalVar.pointStart.setValue(x, y, type);
    },

    // 返回鼠标按下时的初始位置
    getPointerStart(type: string) {
        return globalVar.pointStart.getValue(type);
    },

    // 手动设置组件堆栈(当组件位置和大小改变完成后，在设置，其他情况请慎用)
    setUndoStack() {
        globalVar.selectedComponents.map((com, cid) => {
            if (com) com.setUndoStack();
        });
    },

    // 获取当前鼠标所在锚点
    getCurrentAnchor() {
        return globalVar.currentAnchor;
    },

    // 鼠标移动时计算组件锚点位置
    anchorCalc(currentX: number, currentY: number) {
        let anchor: Anchor.IAnchor | null = null;
        let find = false;
        globalVar.selectedComponents.map((com, cid) => {
            if (com && !find) {
                anchor = com.getPointerAnchor(currentX, currentY);
                if (anchor !== null) {
                    find = true;
                }
            }
        });
        globalVar.currentAnchor = anchor;

        return anchor;
    },

    // 组件上锚点触发的鼠标点击事件
    anchorMouseDown(e: any, anchor: Anchor.IAnchor) {
        globalVar.mouseDown = true;
        globalVar.dragType = DragType.Stretch;
        globalVar.currentComponentSize.setValue();
        globalVar.currentAnchor = anchor;
    },

    // 组件上锚点触发的鼠标点击事件
    anchorMouseUp(e: any) {
        globalVar.mouseDown = false;
        globalVar.dargging = false;
        globalVar.dragType = DragType.None;
    },

    //  组件上锚点拖动事件
    anchorMove(offset: IOffset, end: boolean, callBack: any) {
        globalVar.dargging = true;
        if (globalVar.currentAnchor) {
            const anchorKey = globalVar.currentAnchor.key;
            switch (anchorKey) {
                // 左上锚点，修改position
                case 'ul': return this.stretchComponent(
                    offset.x, offset.y, -offset.x, -offset.y, anchorKey, end, callBack);
                // 左中锚点，修改position(left)
                case 'ml': return this.stretchComponent(offset.x, 0, -offset.x, 0, anchorKey, end, callBack);
                // 左下锚点
                case 'bl': return this.stretchComponent(offset.x, 0, -offset.x, offset.y, anchorKey, end, callBack);
                // 上中锚点
                case 'um': return this.stretchComponent(0, offset.y, 0, -offset.y, anchorKey, end, callBack);
                // 右上锚点
                case 'ur': return this.stretchComponent(
                    0, offset.y, offset.x, -offset.y, anchorKey, end, callBack);
                // 右中锚点
                case 'mr': return this.stretchComponent(0, 0, offset.x, 0, anchorKey, end, callBack);
                // 右下锚点
                case 'br': return this.stretchComponent(0, 0, offset.x, offset.y, anchorKey, end, callBack);
                // 下中锚点
                case 'bm': return this.stretchComponent(0, 0, 0, offset.y, anchorKey, end, callBack);
            }
        }
    },

    // 组件伸展
    stretchComponent(x: number, y: number, w: number, h: number, anchorKey: string, end: boolean, callBack: any) {
        const comData: any[] = [];
        globalVar.selectedComponents.map((com, cid) => {
            if (com && cid) {
                const value = globalVar.currentComponentSize.getValue(cid);
                const left = x > value.size.width - 10 ?
                    value.position.left + value.size.width - 10 : value.position.left + x;
                const top = y > value.size.height - 10 ?
                    value.position.top + value.size.height - 10 : value.position.top + y;
                const width = value.size.width + w < 10 ? 10 : value.size.width + w;
                const height = value.size.height + h < 10 ? 10 : value.size.height + h;
                const position = { left, right: value.position.right, top, bottom: value.position.bottom };
                const size = { width, height };
                if (end || config.highPerformance) {
                    // 高性能模式，组件立即变化
                    com.setPosition(position);
                    com.setSize(size);
                } else {
                    // 低性能模式，组件在鼠标放下时变化
                    comData.push({ cid, position, size, anchorKey, type: com.getType() } as IBaseData);
                }
            }
        });
        if (comData.length > 0) callBack(comData);
    },

    // 新增选中组件
    addSelectedComponent(cid: string, com: IComponent, multiselect: boolean) {
        let components = globalVar.selectedComponents;
        if (!this.isMultiselect() && !components.has(cid) && !multiselect) {
            components = components.clear();
        }
        globalVar.selectedComponents = components.set(cid, com);
        globalVar.currentComponentSize.setValue();
    },

    // 获取所有选中组件
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

    // 在body中创建组件的移动框
    drawDragBox(offset: any) {
        // 每次创建的时候都跟新一次偏移量
        const offsetX: number = offset.pageX;
        const offsetY: number = offset.pageY;
        globalVar.componentOffset.setValue({ offsetX, offsetY });

        const selectedComponents = globalVar.selectedComponents;
        selectedComponents.map((component, cid) => {
            if (!cid || !component) return;
            if (!globalVar.dragDivList.has(cid)) {
                // 将canvas坐标系转换为document坐标系
                const top = component.getPosition().top + offsetY;
                const left = component.getPosition().left + offsetX;
                const width = component.getSize().width;
                const height = component.getSize().height;

                // 根据document坐标系在documnet.body上创建div
                const documentDiv = document.createElement('div');
                documentDiv.style.position = 'absolute';
                documentDiv.style.top = `${top}px`;
                documentDiv.style.left = `${left}px`;
                documentDiv.style.width = `${width}px`;
                documentDiv.style.height = `${height}px`;
                documentDiv.style.border = '1px solid #108ee9';
                documentDiv.style.zIndex = '3';
                documentDiv.style.display = 'none';
                documentDiv.style.pointerEvents = 'none';
                documentDiv.style.borderStyle = 'dashed';
                body.appendChild(documentDiv);

                globalVar.dragDivList = globalVar.dragDivList.set(cid, { component, documentDiv, hasChange: false });
                globalVar.dragDivVolume.addValue(top, left, width, height);
            }
        });
    },

    // 在body中移动组件的移动框
    moveDragBox(offset: IOffset, stageBoundary: IBoundary | undefined, setStageScroll: any) {
        if (!stageBoundary) return;
        globalVar.dargging = true;
        if (config.highPerformance) {
            // 高性能模式，直接拖动组件
            globalVar.selectedComponents.map((component, cid) => {
                if (component && cid) {
                    const value = globalVar.currentComponentSize.getValue(cid);
                    const left = value.position.left + offset.x;
                    const top = value.position.top + offset.y;
                    const right = value.position.right;
                    const bottom = value.position.bottom;
                    component.setPosition({ left, right, top, bottom });
                }
            });
        } else {
            // 低性能模式，移动拖动框
            if (stageBoundary) {
                // 碰撞检测, 检查组件是否碰到边界
                const leftCrash = globalVar.dragDivVolume.startPoint.x <= stageBoundary.startPoint.x;
                const topCrash = globalVar.dragDivVolume.startPoint.y <= stageBoundary.startPoint.y;
                const rightCrash = globalVar.dragDivVolume.endPoint.x >= stageBoundary.endPoint.x;
                const bottomCrash = globalVar.dragDivVolume.endPoint.y >= stageBoundary.endPoint.y;

                // 碰撞到边界后滚动stage的滚动条
                if (leftCrash || topCrash || rightCrash || bottomCrash) {
                    this.startScroll({
                        x: leftCrash ? -15 : rightCrash ? 15 : 0,
                        y: topCrash ? -15 : bottomCrash ? 15 : 0
                    } as IOffset, setStageScroll);
                } else {
                    this.stopScroll();
                }
            }

            globalVar.dragDivList.map((item: IDragDiv | undefined) => {
                if (item !== undefined) {
                    const pos = item.component.getPosition();
                    const div = item.documentDiv;
                    div.style.display = 'block';
                    item.hasChange = true;
                    if (div.style.left) {
                        const left = pos.left + offset.x + globalVar.componentOffset.x;
                        div.style.left = `${left}px`;
                    }
                    if (div.style.top) {
                        const right = pos.top + offset.y + globalVar.componentOffset.y;
                        div.style.top = `${right}px`;
                    }
                }
            });
        }

    },

    // 在body中删除组件的移动框
    clearDragBox(offset: any) {
        globalVar.dragDivList.map((value, key) => {
            if (value !== undefined) {
                const div = value.documentDiv;
                if (div.style.left && div.style.top && value.hasChange) {
                    const pos = value.component.getPosition();
                    value.component.setPosition({
                        left: parseInt(div.style.left, 10) - offset.pageX,
                        right: pos.right,
                        top: parseInt(div.style.top, 10) - offset.pageY,
                        bottom: pos.bottom
                    });
                }
                body.removeChild(div);
            }
        });
        globalVar.dragDivList = globalVar.dragDivList.clear();
        globalVar.dragDivVolume.rest();
        this.stopScroll();
    },

    // 开始滚动stage
    startScroll(scrollOffset: IOffset, setStageScroll: any) {
        if (globalVar.scrollTimer === null) {
            globalVar.scrollTimer = setInterval(() => { setStageScroll(scrollOffset); }, 50);
        }
    },

    // 停止滚动stage
    stopScroll() {
        if (globalVar.scrollTimer !== null) {
            clearInterval(globalVar.scrollTimer);
            globalVar.scrollTimer = null;
        }
    },

    getIsRichEditMode(): boolean {
        return globalVar.isRichEditMode;
    },
    setIsRichEditMode(mode: boolean): void {
        globalVar.isRichEditMode = mode;
    },

    getTECellEditorActivateKeyRange(): any {
        return globalVar.TECellEditorActivateKeyRange;
    },
    isSelectedComponent(): boolean {
        const selectedComponents = this.getSelectedComponents();
        if (selectedComponents.size > 0) {
            return true;
        } else {
            return false;
        }
    },
    getAddComponentCid(): string | null {
        return globalVar.addComponentCid;
    },
    setAddComponentCid(cid: string | null): void {
        globalVar.addComponentCid = cid;
    },
    getIsCanCtrl(): boolean {
        return globalVar.isCanCtrl;
    },
    setIsCanCtrl(isCanCtrl: boolean): void {
        globalVar.isCanCtrl = isCanCtrl;
    }

};
