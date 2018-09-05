import { Canvas } from '../Canvas';
import { IComponent, IPosition, ISize, ICommentsList } from '../../BaseComponent';
import { ComponentsMap } from '../../Stage';
import { IDragDiv, DragType, IOffset, IBoundary, IComponentList } from '../model/types';
import { IBaseData } from '../../Draw/model/types';
import { IAnchor } from '../../util';

import { Map, Set, List, OrderedSet } from 'immutable';

export class CanvasGlobalParam {
    public body: HTMLBodyElement;

    public timer: any;
    public mouseDown: boolean;                                  // 鼠标是否按下
    public dargging: boolean;                                   // 是否开始拖拽
    public pointStart: {
        pos: {
            [key: string]: {
                x: number;
                y: number;
            };
        };
        setValue(x: number, y: number, type: string): void;
        getValue(type: string): {
            x: number;
            y: number;
        };
    };                                                          // 鼠标按下时的位置
    public selectedComponents: Map<string, IComponent>;         // 当前选中的组件集合
    public currentComponentSize: {
        list: Map<string, {
            position: IPosition;
            size: ISize;
        }>;
        setValue(selectedComponents: Map<string, IComponent>): void;
        getValue(cid: string): {
            position: IPosition;
            size: ISize;
        };
    };                                                          // 当前选中的组件组件的大小和位置(为了实时修改组件的大小)
    public componentOffset: {
        x: number;
        y: number;
        setValue(args: {
            offsetX: number;
            offsetY: number;
        }): void;
    };                                                          // 当前画布canvas相对document的偏移量
    public currentAnchor: IAnchor | null;                       // 当前触发的锚点
    public currentMousePosition: { x: number; y: number; } | null;   // 当前鼠标位置
    public dragType: string;                                    // 当前鼠标移动的类型
    public dragDivList: Map<string, IDragDiv>;                  // 当前生成的组件位移框
    public TECellEditorActivateKeyRange: Array<{
        min: number;
        max: number;
    }>;                                                         // 文字输入KeyCode
    public dragDivVolume: {
        startPoint: IOffset;
        endPoint: IOffset;
        addValue(top: number, left: number, width: number, height: number): void;
        rest(): void;
    };                                                          // 当前所有拖拽框的大小，用于document坐标系边界检测
    public scrollTimer: NodeJS.Timer | null;                    // stage的滚动定时器
    public isCanCtrl: boolean;                                  // 选中时是否可操作

    private _canvas: Canvas;
    /**
     * 构造函数，初始化全局变量
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;

        this.body = document.getElementsByTagName('body')[0];
        this.timer = null;
        this.mouseDown = false;
        this.dargging = false;
        this.pointStart = {
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
        };
        this.selectedComponents = Map<string, IComponent>();
        this.currentComponentSize = {
            list: Map<string, { position: IPosition, size: ISize }>(),
            setValue(selectedComponents: Map<string, IComponent>) {
                this.list = this.list.clear();
                selectedComponents.map((com, cid) => {
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
        };
        this.componentOffset = {
            x: 0, y: 0,
            setValue(args: { offsetX: number, offsetY: number }) {
                this.x = args.offsetX;
                this.y = args.offsetY;
            }
        };
        this.currentAnchor = null;
        this.currentMousePosition = null;
        this.dragType = 'none';
        this.dragDivList = Map<string, IDragDiv>();
        this.TECellEditorActivateKeyRange = [
            { min: 229, max: 229 }, // 中文输入法
            { min: 13, max: 13 },   // 回车
            { min: 32, max: 32 }, // 空格
            { min: 65, max: 90 },
            { min: 48, max: 57 },
            { min: 96, max: 107 },
            { min: 109, max: 111 },
            { min: 186, max: 192 },
            { min: 219, max: 222 }
        ];
        this.dragDivVolume = {
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
        };
        this.scrollTimer = null;
        this.isCanCtrl = true;
    }

    clearTimer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    // 鼠标是否按下
    isMouseDown() {
        return this.mouseDown;
    }

    // 是否开始拖拽
    isDargging() {
        return this.dargging;
    }

    // 开始拖拽, 用于判断刚刚开始拖拽
    darggingStart() {
        this.dargging = true;
    }

    // 返回鼠标拖拽类型
    getDragType() {
        return this.dragType;
    }

    // stage外的鼠标点击事件
    outsideMouseDown(e: any) {
        this.mouseDown = true;
    }

    // stage外的鼠标点击事件
    outsizeMouseUp(e: any) {
        this.mouseDown = false;
        this.dargging = false;
        this.dragType = DragType.None;
    }

    // canvas上的鼠标点击事件
    canvasMouseDown(e: any) {
        this.mouseDown = true;
        this.dragType = DragType.Choice;
    }

    // 添加批注模式，canvas上的鼠标点击事件
    canvasMouseDownAddCommentsMode(e: any) {
        this.mouseDown = true;
        this.dragType = DragType.Comments;
        this._canvas._commentsUtil.setMouseDownParam(e);
    }

    // 添加放大镜模式，canvas上的鼠标点击事件
    canvasMouseDownAddImageMagnifierMode(e: any) {
        this.mouseDown = true;
        this.dragType = DragType.Magnifier;
        this._canvas._imageMagnifierUtil.setMouseDownParam(e);
    }

    // canvas上的鼠标点击事件
    canvasMouseUp(e: any) {
        // 当组件经历过形状位置改变后，手动设置一次组件堆栈
        if (this.dargging) this.setUndoStack();
        this.mouseDown = false;
        this.dargging = false;
        this.dragType = DragType.None;
    }

    // 添加批注模式，canvas上的鼠标点击事件
    canvasMouseUpAddCommentsMode(e: any) {
        this.mouseDown = false;
        this.dargging = false;
        this.dragType = DragType.None;
        this._canvas._commentsUtil.setMouseUpParam(e);
        this._canvas._commentsUtil.stopAddComments();
    }

    // 添加放大镜模式，canvas上的鼠标点击事件
    canvasMouseUpAddImageMagnifierMode(e: any) {
        this.mouseDown = false;
        this.dargging = false;
        this.dragType = DragType.None;
        this._canvas._imageMagnifierUtil.setMouseUpParam(e);
        this._canvas._imageMagnifierUtil.stopAddMagnifier();
    }

    // 组件传递而来的鼠标点击事件
    componentMouseDown(e: any) {
        this.mouseDown = true;
        this.dragType = DragType.Shift;
    }

    // 组件传递而来的鼠标点击事件
    componentMouseUp(e: any) {
        // 当组件经历过形状位置改变后，手动设置一次组件堆栈
        if (this.dargging) this.setUndoStack();
        this.mouseDown = false;
        this.dargging = false;
        this.dragType = DragType.None;
    }

    // 记录Stage上鼠标按下时的位置
    setPointStart(x: number, y: number, type: string) {
        this.pointStart.setValue(x, y, type);
    }

    // 返回鼠标按下时的初始位置
    getPointerStart(type: string) {
        return this.pointStart.getValue(type);
    }

    // 手动设置组件堆栈(当组件位置和大小改变完成后，在设置，其他情况请慎用)
    setUndoStack() {
        this.selectedComponents.map(
            (com: IComponent, cid: string) => {
                // 1.组件手动设栈
                com.setUndoStack();

                // 2.组件对应的选中框手动设栈
                const commentsRectList: List<ICommentsList> = com.getCommentsList();
                commentsRectList.map(
                    (commentsRect: ICommentsList) => {
                        const commentsRectCom: IComponent | null = this._canvas.getComponent(commentsRect.cid);
                        if (commentsRectCom) {
                            commentsRectCom.setUndoStack();
                        }
                    }
                );

                // 3.如果是图片组件，对放大镜设栈
                const customState: any = com.getCustomState();
                if (customState && customState.getImageMagnifierList) {
                    const imageMagnifierList: OrderedSet<IComponentList> = customState.getImageMagnifierList();
                    imageMagnifierList.map(
                        (imageMagnifier: IComponentList) => {
                            const componentMagnifier: IComponent | null = this._canvas.getComponent(imageMagnifier.cid);
                            if (componentMagnifier) {
                                componentMagnifier.setUndoStack();
                            }
                        }
                    );
                }
            }
        );
    }

    // 获取当前鼠标所在锚点
    getCurrentAnchor() {
        return this.currentAnchor;
    }

    // 鼠标移动时计算组件锚点位置
    anchorCalc(currentX: number, currentY: number): IAnchor | null {
        let anchor: IAnchor | null = null;
        let find = false;
        this.selectedComponents.map((com, cid) => {
            if (com && !find) {
                anchor = com.getPointerAnchor(currentX, currentY);
                if (anchor !== null) {
                    find = true;
                }
            }
        });
        this.currentAnchor = anchor;

        return anchor;
    }

    // 组件上锚点触发的鼠标点击事件
    anchorMouseDown(e: any, anchor: IAnchor) {
        this.mouseDown = true;
        this.dragType = DragType.Stretch;
        this.currentComponentSize.setValue(this.selectedComponents);
        this.currentAnchor = anchor;
    }

    //  组件上锚点拖动事件
    anchorMove(offset: IOffset, end: boolean, callBack: any) {
        this.dargging = true;
        if (this.currentAnchor) {
            const anchorKey = this.currentAnchor.key;
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
    }

    // 组件伸展
    stretchComponent(x: number, y: number, w: number, h: number, anchorKey: string, end: boolean, callBack: any) {
        const comData: any[] = [];
        this.selectedComponents.map((com, cid) => {
            if (com && cid) {
                const value = this.currentComponentSize.getValue(cid);
                let nextX: number = x;
                let nextY: number = y;
                let nextW: number = w;
                let nextH: number = h;
                // 图片使用等比缩放
                if (com.getBaseProps().comPath === ComponentsMap.Universal_Image.t) {
                    const afterOffset = this.scaleScaling(value, x, y, w, h, anchorKey);
                    nextX = afterOffset.x;
                    nextY = afterOffset.y;
                    nextW = afterOffset.w;
                    nextH = afterOffset.h;
                }

                const left: number = nextX > value.size.width - 10 ?
                    value.position.left + value.size.width - 10 : value.position.left + nextX;
                const top: number = nextY > value.size.height - 10 ?
                    value.position.top + value.size.height - 10 : value.position.top + nextY;
                const width: number = value.size.width + nextW < 10 ? 10 : value.size.width + nextW;
                const height: number = value.size.height + nextH < 10 ? 10 : value.size.height + nextH;
                const position: IPosition = { top, left };
                const size: ISize = { width, height };
                if (end || this._canvas.props.highPerformance) {
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
    }

    // 等比缩放算法
    scaleScaling(
        currentComPositionAndSize: { position: IPosition; size: ISize; },
        x: number,
        y: number,
        w: number,
        h: number,
        anchorKey: string
    ): { x: number, y: number, w: number, h: number } {
        let nextX: number = x;
        let nextY: number = y;
        let nextW: number = w;
        let nextH: number = h;
        switch (anchorKey) {
            case 'ul':
                // 左上锚点，修改position
                // offset.x, offset.y, -offset.x, -offset.y
                nextY = Math.ceil((-w / currentComPositionAndSize.size.width) * currentComPositionAndSize.size.height);
                nextH = Math.ceil((w / currentComPositionAndSize.size.width) * currentComPositionAndSize.size.height);
                break;
            case 'bl':
                // 左下锚点
                // offset.x, 0, -offset.x, offset.y
                nextY = 0;
                nextH = Math.ceil((w / currentComPositionAndSize.size.width) * currentComPositionAndSize.size.height);
                break;
            case 'ur':
                // 右上锚点
                // 0, offset.y, offset.x, -offset.y
                nextX = 0;
                nextW = Math.ceil((h / currentComPositionAndSize.size.height) * currentComPositionAndSize.size.width);
                break;
            case 'br':
                // 右下锚点
                // 0, 0, offset.x, offset.y
                nextX = 0;
                nextW = Math.ceil((h / currentComPositionAndSize.size.height) * currentComPositionAndSize.size.width);
                break;
        }

        return {
            x: nextX,
            y: nextY,
            w: nextW,
            h: nextH
        };
    }

    // 新增选中组件
    addSelectedComponent(cid: string, com: IComponent, multiselect: boolean) {
        let components = this.selectedComponents;
        if (!components.has(cid) && !multiselect) {
            components = components.clear();
        }
        this.selectedComponents = components.set(cid, com);
        this.currentComponentSize.setValue(this.selectedComponents);
    }

    // 获取所有选中组件
    getSelectedComponents(): Map<string, IComponent> {
        return this.selectedComponents;
    }

    getSelectedCids() {
        return Set.fromKeys(this.selectedComponents);
    }

    // 清空选中组件
    clearSelectedComponent() {
        // 清空子控件选中状态
        this.selectedComponents.map((com: any, cid) => {
            if (com && cid && this._canvas.getComponent(cid)) {
                if (com.selectComChange) {
                    com.selectComChange(null, null);
                }
            }
        });
        this.selectedComponents = this.selectedComponents.clear();
    }

    // 键盘移动组件
    moveComponent(axis: string, distance: number) {
        this.selectedComponents.map((component, cid) => {
            if (component) {
                const position = component.getPosition();
                component.setPosition({
                    top: axis === 'x' ? position.top : position.top + distance,
                    left: axis === 'y' ? position.left : position.left + distance
                });
            }
        });
    }

    // 在body中创建组件的移动框
    drawDragBox(offset: any) {
        // 每次创建的时候都跟新一次偏移量
        const offsetX: number = offset.pageX;
        const offsetY: number = offset.pageY;
        this.componentOffset.setValue({ offsetX, offsetY });

        const selectedComponents = this.selectedComponents;
        selectedComponents.map((component, cid) => {
            if (!cid || !component) return;
            if (!this.dragDivList.has(cid)) {
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
                this.body.appendChild(documentDiv);

                this.dragDivList = this.dragDivList.set(cid, { component, documentDiv, hasChange: false });
                this.dragDivVolume.addValue(top, left, width, height);
            }
        });
    }

    // 在body中移动组件的移动框
    moveDragBox(offset: IOffset, stageBoundary: IBoundary | undefined, setStageScroll: any) {
        if (!stageBoundary) return;
        this.dargging = true;
        if (this._canvas.props.highPerformance) {
            // 高性能模式，直接拖动组件
            this.selectedComponents.map((component, cid) => {
                if (component && cid) {
                    if (component.isCanMove() === false) return;
                    const value = this.currentComponentSize.getValue(cid);
                    const top = value.position.top + offset.y;
                    const left = value.position.left + offset.x;
                    component.setPosition({ top, left });
                }
            });
        } else {
            // 低性能模式，移动拖动框
            // if (stageBoundary) {
            //     // 碰撞检测, 检查组件是否碰到边界
            //     const leftCrash = this.dragDivVolume.startPoint.x <= stageBoundary.startPoint.x;
            //     const topCrash = this.dragDivVolume.startPoint.y <= stageBoundary.startPoint.y;
            //     const rightCrash = this.dragDivVolume.endPoint.x >= stageBoundary.endPoint.x;
            //     const bottomCrash = this.dragDivVolume.endPoint.y >= stageBoundary.endPoint.y;

            //     // 碰撞到边界后滚动stage的滚动条
            //     if (leftCrash || topCrash || rightCrash || bottomCrash) {
            //         this.startScroll({
            //             x: leftCrash ? -15 : rightCrash ? 15 : 0,
            //             y: topCrash ? -15 : bottomCrash ? 15 : 0
            //         } as IOffset, setStageScroll);
            //     } else {
            //         this.stopScroll();
            //     }
            // }

            this.dragDivList.map((item: IDragDiv | undefined) => {
                if (item !== undefined) {
                    if (item.component.isCanMove() === false) return;
                    const pos = item.component.getPosition();
                    const div = item.documentDiv;
                    div.style.display = 'block';
                    item.hasChange = true;
                    if (div.style.left) {
                        const left = pos.left + offset.x + this.componentOffset.x;
                        div.style.left = `${left}px`;
                    }
                    if (div.style.top) {
                        const right = pos.top + offset.y + this.componentOffset.y;
                        div.style.top = `${right}px`;
                    }
                }
            });
        }

    }

    // 在body中删除组件的移动框
    clearDragBox(offset: any) {
        this.dragDivList.map((value, key) => {
            if (value !== undefined) {
                const div = value.documentDiv;
                if (div.style.left && div.style.top && value.hasChange) {
                    value.component.setPosition({
                        top: parseInt(div.style.top, 10) - offset.pageY,
                        left: parseInt(div.style.left, 10) - offset.pageX
                    });
                    // TODO com mouseup
                    (value.component as any).onTitleMouseUp && (value.component as any).onTitleMouseUp(null);
                }
                this.body.removeChild(div);
            }
        });
        this.dragDivList = this.dragDivList.clear();
        this.dragDivVolume.rest();
        this.stopScroll();
    }

    // 开始滚动stage
    startScroll(scrollOffset: IOffset, setStageScroll: any) {
        if (this.scrollTimer === null) {
            this.scrollTimer = setInterval(() => { setStageScroll(scrollOffset); }, 50);
        }
    }

    // 停止滚动stage
    stopScroll() {
        if (this.scrollTimer !== null) {
            clearInterval(this.scrollTimer);
            this.scrollTimer = null;
        }
    }

    getTECellEditorActivateKeyRange(): any {
        return this.TECellEditorActivateKeyRange;
    }

    isSelectedComponent(): boolean {
        const selectedComponents = this.getSelectedComponents();
        if (selectedComponents.size > 0) {
            return true;
        } else {
            return false;
        }
    }

    getIsCanCtrl(): boolean {
        return this.isCanCtrl;
    }

    setIsCanCtrl(isCanCtrl: boolean): void {
        this.isCanCtrl = isCanCtrl;
    }

    setIsWingmanFocus = (value: boolean): void => {
        this._canvas._isWingmanFocus = value;
    }
}
