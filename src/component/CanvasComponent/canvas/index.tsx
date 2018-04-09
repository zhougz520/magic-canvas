import * as React from 'react';
import CanvasComponent from '../CanvasComponent';
import { ICanvasComponent, ICanvasProps, ICanvasState, ICanvasCommand } from '../inedx';
import { Set } from 'immutable';
import { IComponent } from '../../BaseComponent';
import { CanvasStyle, ContainerStyle } from '../model/CanvasStyle';
import { CanvasCommand } from '../model/CanvasCommand';
import { DragType, IOffset } from '../model/types';
import util from '../../util';
import { config } from '../../config';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Canvas extends CanvasComponent<ICanvasProps, ICanvasState> implements ICanvasComponent {
    container: HTMLDivElement | null = null;
    canvas: HTMLDivElement | null = null;
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

    /**
     * 组件选中，画布不要记录组件的位置与大小信息，否则同步信息很乱
     * @param cid 组件ID
     */
    selectionChanging = (cid: string, e: any): void => {
        const com = this.getComponent(cid);
        if (com) {
            this.selectedComponent(cid, com);
        }
    }

    /**
     * 阻止合成事件与除最外层document上的原生事件上的冒泡，通过判断e.target来避免
     * 判断事件源是否是画布
     */
    onMouseEvent = (e: any): boolean => {
        console.log(e.target.className);
        // 若未在canva元素上出发则返回
        if (e.target && (e.target.className.startsWith('canvas') || e.target.className.startsWith('container'))) {
            return true;
        }

        return false;
    }

    handleMouseDown = (e: any) => {
        // 鼠标按下时，计算鼠标位置
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
        if (this.onMouseEvent(e)) {
            this.command.canvasMouseUp(e);
        } else {
            this.command.componentMouseUp(e);
        }

        // 清除拉选框
        this.clearChoiceBox(e);
        // 清楚移动框
        this.clearDragBox(e);
    }

    handleMouseMove = (e: any) => {
        console.log('mouseMove:' + e.target.className + ',type:' + this.command.getDragType());
        if (this.command.isMouseDown()) {  // 鼠标按下才开始计算
            const pointStart = this.command.getPointerStart();
            const offset = {
                x: e === undefined ? 0 : e.pageX - pointStart.x,
                y: e === undefined ? 0 : e.pageY - pointStart.y
            };
            switch (this.command.getDragType()) {
                case DragType.None: return;
                case DragType.Choice: return this.drawChoiceBox(pointStart.x, pointStart.y, offset);
                case DragType.Stretch: return this.command.anchorMove(offset);
                case DragType.Shift: {
                    // 档偏移量超过10后才开始处理拖拽事件，并隐藏选中框
                    if (!this.command.isDargging() && Math.abs(offset.x) < 10 && Math.abs(offset.y) < 10) return;

                    return this.moveDragBox(offset);
                }
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
        this.command.canvasMouseUp(e);
    }

    handleDrop = (e: any) => {
        if (util.isEmptyString(localStorage.__dnd_type) || util.isEmptyString(localStorage.__dnd_value)) return;
        if (localStorage.__dnd_type !== 'dragging_cs') return;
        const data = JSON.parse(localStorage.__dnd_value);
        const position = this.getPositionRelativeCanvas(e.pageX, e.pageY);
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

    componentDidMount() {
        CanvasCommand.initCanvas();
        document.addEventListener('mousemove', this.handleMouseMove);
        if (this.container && this.canvas) {
            this.container.addEventListener('mousedown', this.handleMouseDown);
            this.container.addEventListener('mouseup', this.handleMouseUp);
            // 在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发
            this.canvas.addEventListener('dragover', (evt: any) => evt.preventDefault());
            this.canvas.addEventListener('drop', this.handleDrop);
            // 异常鼠标不在画布内释放了
            this.container.addEventListener('mouseleave', this.handleMouseLeave);
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
                style={{ ...ContainerStyle(canvasSize), cursor }}
            >
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
                    repairSelected: this.repairSelected
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
    getPositionRelativeCanvas = (pageX: number, pageY: number) => {
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
    getPositionRelativeStage = (pageX: number, pageY: number) => {
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
    getPositionRelativeDocument = (pointX: number, pointY: number) => {
        const pos = this.props.componentPosition;
        const scroll = this.props.getStageScroll();

        return {
            pageX: pointX + pos.stageOffset.left + pos.canvasOffset.left - scroll.scrollLeft,
            pageY: pointY + pos.stageOffset.top + pos.canvasOffset.top - scroll.scrollTop
        };
    }

    /**
     * 组件选择
     */
    selectedComponent = (cid: string, com: IComponent, multiselect?: boolean) => {
        // 组件选择
        this.command.addSelectedComponent(cid, com, multiselect);
        this.repairSelected();
        this.command.drawDragBox(this.getPositionRelativeDocument(0, 0));
    }

    /**
     * 绘制组件选中框
     */
    drawSelected = (cids: Set<string>) => {
        const draw = this.props.getDraw();
        if (draw !== null) {
            draw.setSelectedCids(cids);
        }
    }

    /**
     * 重新绘制组件选中框
     */
    repairSelected = () => {
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
    drawChoiceBox = (pointX: number, pointY: number, offset: IOffset) => {
        // 通知绘画层出现选择框
        const position = this.getPositionRelativeStage(pointX, pointY);
        const draw = this.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox({ pointX: position.pointX, pointY: position.pointY, offset });
        }
    }

    /**
     * 清理鼠标选择框
     */
    clearChoiceBox = (e: any) => {
        const pointStart = this.command.getPointerStart();
        const start = this.getPositionRelativeCanvas(pointStart.x, pointStart.y);
        const end = this.getPositionRelativeCanvas(e.pageX, e.pageY);
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

    /**
     * 拖动组件移动框
     */
    moveDragBox = (offset: IOffset) => {
        const stageBoundary = this.props.getStageBoundary();
        this.command.darggingStart();
        this.command.moveDragBox(offset, stageBoundary, this.props.setStageScroll);
        this.hideSelected();
    }

    /**
     * 清理组件移动框
     */
    clearDragBox = (e: any) => {
        // 清楚移动框
        this.command.clearDragBox(this.getPositionRelativeDocument(0, 0));
    }
}
