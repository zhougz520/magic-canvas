import * as React from 'react';
import CanvasComponent from '../CanvasComponent';
import { ICanvasComponent, ICanvasProps, ICanvasState, ICanvasCommand } from '../inedx';
import { Set } from 'immutable';
import { IComponent, ISize, IPosition } from '../../BaseComponent';
import { CanvasStyle, ContainerStyle } from '../model/CanvasStyle';
import { CanvasCommand } from '../model/CanvasCommand';
import { DragType, IOffset, IPointpos, IPagePos } from '../model/types';
import util from '../../util';
import { config } from '../../config';
import { keyFun } from '../model/CanvasCommand';
import { EditComponent } from '../../EditComponent';
import { IKeyArgs, keyArgs } from '../../util/KeyAndPointUtil';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Canvas extends CanvasComponent<ICanvasProps, ICanvasState> implements ICanvasComponent {
    container: HTMLDivElement | null = null;
    canvas: HTMLDivElement | null = null;
    editor: EditComponent | null = null;
    command: ICanvasCommand = CanvasCommand;

    /**
     * 由于使用的时PureComponent,所有不变的数据直接放在state中,变化的数据放过在CanvasStae中
     * @param props any
     */
    constructor(props: any) {
        super(props);
        this.state = {
            anchor: null,
            canvasSize: config.canvasSize,
            componentIndex: this.props.components.length,
            componentList: Set.of(...this.props.components)
        } as Readonly<ICanvasState>;
        this.command = CanvasCommand;
    }

    /**
     * 根据组件cid获取组件对象
     */
    getComponent = (cid: string): IComponent | null => {
        const ref = this.refs[`c.${cid}`] as any;

        return (ref as IComponent) || null;
    }

    getEditor = (): EditComponent => {
        return (this.editor as EditComponent);
    }

    /**
     * 组件选中，画布不要记录组件的位置与大小信息，否则同步信息很乱
     * @param cid 组件ID
     */
    selectionChanging = (cid: string, e: any): void => {
        const oldCom: IComponent | null = this.command.getSelectedComponents().last();
        const com = this.getComponent(cid);
        if (com) {
            this.selectedComponent(cid, com);
        }

        // 记录当前选中组件
        const newCom: IComponent | null = com;
        if (newCom !== oldCom) {
            this.command.setIsEditMode(false);
        }
    }

    /**
     * 阻止合成事件与除最外层document上的原生事件上的冒泡，通过判断e.target来避免
     * 判断事件源是否是画布
     */
    onMouseEvent = (e: any): boolean => {
        // 若未在canva元素上出发则返回
        if (e.target && (e.target.className.startsWith('canvas') || e.target.className.startsWith('container'))) {
            return true;
        }

        return false;
    }

    handleMouseDown = (e: any) => {
        this.endEdit();
        this.command.setIsEditMode(false);

        // 鼠标按下时，计算鼠标位置
        this.recordPointStart(e);
        const relative = this.getPositionRelativeCanvas(e.pageX, e.pageY);
        const anchor = this.command.anchorCalc(relative.x, relative.y);
        if (anchor) {                           // 锚点上点击
            this.command.anchorMouseDown(e, anchor);
        } else if (this.onMouseEvent(e)) {      // 画布上的点击
            // 非多选模式下，清楚所有组件选中状态
            if (!this.command.isMultiselect()) {
                this.clearSelected();
            }
            this.command.canvasMouseDown(e);
        } else {                                // 组件中的点击
            this.command.componentMouseDown(e);
        }
    }

    handleMouseUp = (e: any) => {
        // 清除选择框
        this.clearChoiceBox(e);
        // 清楚移动框
        this.clearDragBox(e);
        // 清楚拉伸框
        this.drawStretchBox(e, true);

        if (this.onMouseEvent(e)) {
            this.command.canvasMouseUp(e);
        } else {
            this.command.componentMouseUp(e);
        }
    }

    handleMouseMove = (e: any) => {
        if (this.command.isMouseDown()) {  // 鼠标按下才开始计算
            switch (this.command.getDragType()) {
                case DragType.None: return;
                case DragType.Choice: return this.drawChoiceBox(e);
                case DragType.Stretch: return this.drawStretchBox(e);
                case DragType.Shift: return this.moveDragBox(e);
            }
        } else {    // 鼠标未按下时，计算鼠标位置
            const relative = this.getPositionRelativeCanvas(e.pageX, e.pageY);
            const anchor = this.command.anchorCalc(relative.x, relative.y);
            this.setState({ anchor });
        }
    }

    handleMouseLeave = (e: any) => {
        this.clearChoiceBox(e);
        this.clearDragBox(e);
        this.drawStretchBox(e, true);
        this.command.canvasMouseUp(e);
    }

    handleKeyDownCommand = (e: any): boolean => {
        const args = keyArgs(e);
        const { key, ctrl, alt, keyCode } = args as IKeyArgs;

        // 如果是编辑模式直接跳过画布上的事件
        if (this.command.getIsEditMode() === true) {
            return false;
        }

        if (key === 'delete') {
            this.deleteCanvasComponent(this.command.getSelectedCids());
            this.clearSelected();
            this.clearDragBox(e);
        }

        if (key === 'up' || key === 'down' || key === 'right' || key === 'left'
            || key === 'esc' || key === 'backspace') {
            keyFun[key].press();
        } else if (ctrl) {
            keyFun.ctrl.press();
        }

        // 如果是输入操作，进入输入状态
        if (!ctrl && !alt) {
            const TECellEditorActivateKeyRange: any = this.command.getTECellEditorActivateKeyRange();
            for (let i = 0; i < TECellEditorActivateKeyRange.length; i++) {
                const { min, max } = TECellEditorActivateKeyRange[i];
                if (keyCode >= min && keyCode <= max) {
                    return !this.beginEdit();
                }
            }
        }

        return true;
    }

    handleKeyUpCommand = (e: any): boolean => {
        const args = keyArgs(e);
        const { key, ctrl } = args as IKeyArgs;

        if (key === 'up' || key === 'down' || key === 'right' || key === 'left'
            || key === 'esc' || key === 'backspace') {
            e.stopPropagation();
            e.preventDefault();
            keyFun[key].release();
        } else if (!ctrl && this.command.isMultiselect()) {
            keyFun.ctrl.release();
        }

        return true;
    }

    // 编辑框开始编辑
    beginEdit = (): boolean => {
        const currentSelectedComponent: IComponent | null = this.command.getSelectedComponents().last();

        if (currentSelectedComponent !== null) {
            const size: ISize = currentSelectedComponent.getSize();
            const position: IPosition = currentSelectedComponent.getPosition();
            const bodyOffset: any = this.getPositionRelativeDocument(position.left, position.top);

            this.command.setIsEditMode(true);
            this.getEditor().setValue('');
            this.getEditor().setPosition(
                size.width,
                bodyOffset.pageY + size.height / 2,
                bodyOffset.pageX + size.width / 2
            );

            return true;
        }

        return false;
    }

    // 编辑框结束编辑
    endEdit = () => {
        const currentSelectedComponent: IComponent | null = this.command.getSelectedComponents().last();
        const currentIsEditMode: boolean = this.command.getIsEditMode();

        if (currentIsEditMode === true && currentSelectedComponent !== null) {
            const value: string = this.getEditor().getValue();
            this.getEditor().hiddenEditCom();
            currentSelectedComponent.setRichChildNode(value);

            this.command.setIsEditMode(false);
            // this.command.setSelectedComponent(null);
        }
    }

    // 由组件列表拖拽进画布的组件
    handleDrop = (e: any) => {
        if (util.isEmptyString(localStorage.__dnd_type) || util.isEmptyString(localStorage.__dnd_value)) return;
        if (localStorage.__dnd_type !== 'dragging_cs') return;
        const data = JSON.parse(localStorage.__dnd_value);
        const position = this.getPositionRelativeCanvas(e.pageX, e.pageY);
        this.addCancasComponent(data, position);
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove);
        if (this.container && this.canvas) {
            this.container.addEventListener('mousedown', this.handleMouseDown);
            this.container.addEventListener('mouseup', this.handleMouseUp);
            // 在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发
            this.canvas.addEventListener('dragover', (evt: any) => evt.preventDefault());
            this.canvas.addEventListener('drop', this.handleDrop);
            // 异常鼠标不在画布内释放了
            this.container.addEventListener('mouseleave', this.handleMouseLeave);
            this.container.addEventListener('focus', () => { this.getEditor().setFocus(); });
        }
    }

    render() {
        console.log('重绘了canvas');
        const { componentPosition, canvasSize } = this.props;
        const canvasOffset = componentPosition.canvasOffset;
        const children = this.getChildrenComponent(this.state.componentList);
        const cursor = this.state.anchor ? this.state.anchor.cursor : 'default';

        return (
            <div
                ref={(handler) => this.container = handler}
                className="container"
                tabIndex={1}
                style={{ ...ContainerStyle(canvasSize), cursor }}
            >
                <EditComponent
                    ref={(handler) => this.editor = handler}
                    componentPosition
                    handleKeyDownCommand={this.handleKeyDownCommand}
                    handleKeyUpCommand={this.handleKeyUpCommand}
                />
                <div
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(handler) => this.canvas = handler}
                    style={CanvasStyle(canvasOffset)}
                    className="canvas"
                >
                    {children}
                </div>
            </div>
        );
    }

    /**
     * 画布增加组件
     */
    addCancasComponent = (data: any, position: IOffset) => {
        const componentIndex = this.state.componentIndex + 1;
        const componentList = this.state.componentList.add({
            t: data.type,
            p: {
                ...data.props,
                id: 'c.cs' + componentIndex,
                l: position.x - data.offset.x,
                t: position.y - data.offset.y
            }
        });
        this.setState({ componentList, componentIndex });
    }

    /**
     * 画布删除组件
     */
    deleteCanvasComponent = (cids: Set<string>) => {
        let componentList = this.state.componentList;
        componentList.map((cs: any) => {
            if (cs && cs.p && cids.contains(cs.p.id)) {
                componentList = componentList.delete(cs);
            }
        });
        this.setState({ componentList });
    }

    /**
     * 根据component数据创建画布上的组件
     */
    getChildrenComponent = (components: { [key: string]: any }): React.ReactFragment => {
        const array: { [key: string]: React.ReactElement<any> } = {};
        let zIndex = 0;
        components.map((cs: { [key: string]: any }) => {
            const csType = util.componentsType(cs.t);
            array[cs.p.id] = React.createElement(csType,
                Object.assign({}, { data: cs.p }, {
                    zIndex,
                    ref: `c.${cs.p.id}`,
                    selectionChanging: this.selectionChanging,
                    repaintSelected: this.repaintSelected
                })
            );
            zIndex++;
        });
        const createFragment = require('react-addons-create-fragment');

        return createFragment(array);
    }

    /**
     * 将document的坐标转换为相对Canvas的坐标
     */
    getPositionRelativeCanvas = (pageX: number, pageY: number): IOffset => {
        const pos = this.props.componentPosition;
        const scroll = this.props.getStageScroll();

        return {
            x: pageX - pos.stageOffset.left - pos.canvasOffset.left + scroll.scrollLeft,
            y: pageY - pos.stageOffset.top - pos.canvasOffset.top + scroll.scrollTop
        };
    }

    /**
     * 将document的坐标转换为相对Stage的坐标
     */
    getPositionRelativeStage = (pageX: number, pageY: number): IPointpos => {
        const pos = this.props.componentPosition;
        const scroll = this.props.getStageScroll();

        return {
            pointX: pageX - pos.stageOffset.left + scroll.scrollLeft,
            pointY: pageY - pos.stageOffset.top + scroll.scrollTop
        };
    }

    /**
     * 将canvas的坐标转换为相对document的坐标
     */
    getPositionRelativeDocument = (pointX: number, pointY: number): IPagePos => {
        const pos = this.props.componentPosition;
        const scroll = this.props.getStageScroll();

        return {
            pageX: pointX + pos.stageOffset.left + pos.canvasOffset.left - scroll.scrollLeft,
            pageY: pointY + pos.stageOffset.top + pos.canvasOffset.top - scroll.scrollTop
        };
    }

    /**
     * 记录鼠标按下时的坐标
     */
    recordPointStart = (e: any) => {
        const stagePos = this.getPositionRelativeStage(e.pageX, e.pageY);
        this.command.setPointStart(stagePos.pointX, stagePos.pointY, 'stage');
        const canvasPos = this.getPositionRelativeCanvas(e.pageX, e.pageY);
        this.command.setPointStart(canvasPos.x, canvasPos.y, 'canvas');
        this.command.setPointStart(e.pageX, e.pageY, 'dom');
    }

    /**
     * 组件选择
     */
    selectedComponent = (cid: string, com: IComponent, multiselect?: boolean) => {
        // 组件选择
        this.command.addSelectedComponent(cid, com, multiselect);
        this.repaintSelected();
        this.command.drawDragBox(this.getPositionRelativeDocument(0, 0));
    }

    /**
     * 绘制组件选中框
     */
    drawSelected = (cids: Set<string>) => {
        const draw = this.props.getDraw();
        if (draw !== null) {
            draw.drawSelectedBox(cids);
        }
    }

    /**
     * 重新绘制组件选中框
     */
    repaintSelected = () => {
        console.log('重新绘制组件选中框' + this.command.getDragType());
        this.drawSelected(this.command.getSelectedCids());
    }

    /**
     * 隐藏组件选中框
     */
    hideSelected = () => {
        this.drawSelected(Set<string>());
    }

    /**
     * 清除组件选中框
     */
    clearSelected = () => {
        this.command.clearSelectedComponent();
        this.hideSelected();
    }

    /**
     * 绘制鼠标选择框
     */
    drawChoiceBox = (e: any) => {
        // 通知绘画层出现选择框
        const pointStart = this.command.getPointerStart('stage');
        const stagePos = this.getPositionRelativeStage(e.pageX, e.pageY);
        const offset = { x: stagePos.pointX - pointStart.x, y: stagePos.pointY - pointStart.y };
        const draw = this.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox({ pointX: pointStart.x, pointY: pointStart.y, offset });
        }
    }

    /**
     * 清理鼠标选择框
     */
    clearChoiceBox = (e: any) => {
        if (this.command.getDragType() === DragType.Choice) {
            const pointStart = this.command.getPointerStart('dom');
            const pointA = this.getPositionRelativeCanvas(pointStart.x, pointStart.y);
            const pointB = this.getPositionRelativeCanvas(e.pageX, e.pageY);
            const start = {
                x: Math.min(pointA.x, pointB.x),
                y: Math.min(pointA.y, pointB.y)
            };
            const end = {
                x: Math.max(pointA.x, pointB.x),
                y: Math.max(pointA.y, pointB.y)
            };

            const components = this.state.componentList;
            components.map((cs: { [key: string]: any } | undefined) => {
                if (cs === undefined) return;
                const com = this.getComponent(cs.p.id);
                if (com !== null) {
                    const pos = com.getPosition();
                    const size = com.getSize();
                    if (pos.left > start.x && pos.top > start.y &&
                        pos.left + size.width < end.x && pos.top + size.height < end.y) {
                        this.selectedComponent(cs.p.id, com, true);
                    }
                }
            });

            // 通知绘画层清理选择框
            const draw = this.props.getDraw();
            if (draw !== null) {
                draw.drawChoiceBox(null);
            }
        }
    }

    /**
     * 绘制组件大小延伸框
     */
    drawStretchBox = (e: any, endStretch: boolean = false) => {
        if (this.command.getDragType() === DragType.Stretch) {
            const pointStart = this.command.getPointerStart('canvas');
            const canvasPos = this.getPositionRelativeCanvas(e.pageX, e.pageY);
            const offset: IOffset = { x: canvasPos.x - pointStart.x, y: canvasPos.y - pointStart.y };
            const draw = this.props.getDraw();
            if (draw !== null) {
                this.command.anchorMove(offset, endStretch, (data: any) => {
                    draw.drawStretchBox(data);
                });
            }
        }
    }

    /**
     * 拖动组件移动框
     */
    moveDragBox = (e: any) => {
        let stageBoundary = this.props.getStageBoundary();
        // 低性能模式，创建拖动框并拖动
        let start = this.command.getPointerStart('dom');
        let offset = { x: e.pageX - start.x, y: e.pageY - start.y };
        if (stageBoundary) {
            stageBoundary = {
                startPoint: { x: stageBoundary.startPoint.x - offset.x, y: stageBoundary.startPoint.y - offset.y },
                endPoint: { x: stageBoundary.endPoint.x - offset.x, y: stageBoundary.endPoint.y - offset.y }
            };
        }
        if (config.highPerformance) {
            // 高性能模式，直接拖动组件
            start = this.command.getPointerStart('canvas');
            const end = this.getPositionRelativeCanvas(e.pageX, e.pageY);
            offset = { x: end.x - start.x, y: end.y - start.y };
        }

        // 档偏移量超过10后才开始处理拖拽事件，并隐藏选中框
        if (!this.command.isDargging() && Math.abs(offset.x) < 10 && Math.abs(offset.y) < 10) return;

        this.command.darggingStart();
        this.command.moveDragBox(offset, stageBoundary, this.props.setStageScroll);
    }

    /**
     * 清理组件移动框
     */
    clearDragBox = (e: any) => {
        // 清楚移动框
        this.command.clearDragBox(this.getPositionRelativeDocument(0, 0));
    }
}
