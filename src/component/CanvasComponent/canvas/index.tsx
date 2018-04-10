import * as React from 'react';
import CanvasComponent from '../CanvasComponent';
import { ICanvasComponent, ICanvasProps, ICanvasState, ICanvasCommand } from '../inedx';
import { Set } from 'immutable';
import { IComponent, ISize, IPosition } from '../../BaseComponent';
import { CanvasStyle, ContainerStyle } from '../model/CanvasStyle';
import { CanvasCommand } from '../model/CanvasCommand';
import { DragType } from '../model/types';
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
            canvasSize: config.canvasSize
        } as Readonly<ICanvasState>;
        this.command = CanvasCommand;
    }

    getComponent = (cid: string): IComponent | null => {
        const ref = this.refs[`c.${cid}`] as any;

        return (ref as IComponent) || null;
    }

    getEditor = (): EditComponent => {
        return (this.editor as EditComponent);
    }

    setUndo = () => {
        const demoComponent = this.getComponent('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.undo();
        } else {
            console.log('nima');
        }
    }

    setRedo = () => {
        const demoComponent = this.getComponent('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.redo();
        } else {
            console.log('nima');
        }
    }

    /**
     * 组件选中，画布不要记录组件的位置与大小信息，否则同步信息很乱
     * @param cid 组件ID
     */
    selectionChanging = (cid: string, e: any): void => {
        const com = this.getComponent(cid);
        if (com) {
            // 组件选择
            this.command.addSelectedComponent(cid, com);
            this.repairSelected();
            this.command.drawDragBox(this.getPositionRelativeDocument(0, 0));
        }

        // 记录当前选中组件
        const newCom: IComponent | null = com;
        const oldCom: IComponent | null = this.command.getSelectedComponent();
        if (newCom !== oldCom) {
            this.command.setIsEditMode(false);
            this.command.setSelectedComponent(newCom);
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

    handlerMouseDown = (e: any) => {
        this.endEdit();
        this.command.setIsEditMode(false);
        this.command.setSelectedComponent(null);

        // 鼠标按下时，计算鼠标位置
        const relative = this.getPositionRelativeCanvas(e.pageX, e.pageY);
        const anchor = this.command.anchorCalc(relative.x, relative.y);
        if (anchor) {                           // 锚点上点击
            this.command.anchorMouseDown(e, anchor);
        } else if (this.onMouseEvent(e)) {      // 画布上的点击
            this.command.canvasMouseDown(e);
            // 非多选模式下，清楚所有组件选中状态
            if (!this.command.isMultiselect()) {
                this.clearSelected();
            }
            console.log('mousedown');
        } else {                                // 组件中的点击
            this.command.componentMouseDown(e);
            console.log('com mouse down');
        }
    }

    handlerMouseUp = (e: any) => {
        if (this.onMouseEvent(e)) {
            this.command.canvasMouseUp(e);
            console.log('mouseup');
        } else {
            console.log('com mouse up');
            this.command.componentMouseUp(e);
        }

        // 清除拉选框
        this.clearChoiceBox();
        // 清楚移动框
        this.clearDragBox();
    }

    handleMouseMove = (e: any) => {
        // console.log('mouseMove:' + e.target.className + ',type:' + this.command.getDragType());
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
                    if (!this.command.isDargging() && Math.abs(offset.x) < 10 && Math.abs(offset.y) < 10) {
                        return;
                    }
                    this.command.darggingStart();
                    this.command.moveDragBox(offset);
                    this.hideSelected();

                    return;
                }
            }
        } else {    // 鼠标未按下时，计算鼠标位置
            const relative = this.getPositionRelativeCanvas(e.pageX, e.pageY);
            const anchor = this.command.anchorCalc(relative.x, relative.y);
            this.setState({ anchor });
        }
    }

    handleMouseLeave = (e: any) => {
        // 清除拉选框
        this.clearChoiceBox();
        // 清楚移动框
        this.command.clearDragBox();
        this.command.canvasMouseUp(e);
    }

    handleKeyDownCommand = (e: any): boolean => {
        const args = keyArgs(e);
        const { key, ctrl, alt, keyCode } = args as IKeyArgs;

        // 如果是编辑模式直接跳过画布上的事件
        if (this.command.getIsEditMode() === true) {
            return false;
        }

        if (key === 'up' || key === 'down' || key === 'right' || key === 'left'
            || key === 'delete' || key === 'esc' || key === 'backspace') {
            keyFun[key].press();
        } else if (ctrl) {
            keyFun.ctrl.press();
        }

        // 如果是输入操作，进入输入状态
        if (!ctrl && !alt) {
            const TECellEditorActivateKeyRange: any = this.command.getTECellEditorActivateKeyRange();
            for (let i = 0; i < TECellEditorActivateKeyRange.length; i++) {
                const {min, max} = TECellEditorActivateKeyRange[i];
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
            || key === 'delete' || key === 'esc' || key === 'backspace') {
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
        const currentSelectedComponent: IComponent | null = this.command.getSelectedComponent();

        if (currentSelectedComponent !== null) {
            const size: ISize = currentSelectedComponent.getSize();
            const position: IPosition = currentSelectedComponent.getPosition();
            const canvasOffset: any = this.props.componentPosition.canvasOffset;

            this.command.setIsEditMode(true);
            this.getEditor().setValue('');
            this.getEditor().setPosition(
                size.width,
                position.top + size.height / 2 + canvasOffset.top,
                position.left + size.width / 2 + canvasOffset.left
            );

            return true;
        }

        return false;
    }

    // 编辑框结束编辑
    endEdit = () => {
        const currentSelectedComponent: IComponent | null = this.command.getSelectedComponent();
        const currentIsEditMode: boolean = this.command.getIsEditMode();

        if (currentIsEditMode === true && currentSelectedComponent !== null) {
            const value: string = this.getEditor().getValue();
            this.getEditor().hiddenEditCom();
            currentSelectedComponent.setRichChildNode(value);

            this.command.setIsEditMode(false);
            // this.command.setSelectedComponent(null);
        }
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove);
        if (this.container && this.canvas) {
            this.container.addEventListener('mousedown', this.handlerMouseDown);
            this.container.addEventListener('mouseup', this.handlerMouseUp);
            // 异常鼠标不在画布内释放了
            this.container.addEventListener('mouseleave', this.handleMouseLeave);
            this.container.addEventListener('focus', () => { this.getEditor().setFocus(); });
        }
    }

    render() {
        console.log('重绘了canvas');
        const { componentPosition, components } = this.props;
        const canvasOffset = componentPosition.canvasOffset;
        const children = this.getChildrenComponent(components);
        const cursor = this.state.anchor ? this.state.anchor.cursor : 'default';

        return (
            <div
                ref={(handler) => this.container = handler}
                className="container"
                style={{ ...ContainerStyle(this.state.canvasSize), cursor }}
                tabIndex={1}
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

    getChildrenComponent = (components: { [key: string]: any }): React.ReactFragment => {
        const array: { [key: string]: any } = {};
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

    // 将document的坐标转换为相对Canvas的坐标
    getPositionRelativeCanvas = (pageX: number, pageY: number) => {
        const pos = this.props.componentPosition;
        const scroll = this.props.getStageScroll();

        return {
            x: pageX - pos.stageOffset.left - pos.canvasOffset.left + scroll.scrollLeft,
            y: pageY - pos.stageOffset.top - pos.canvasOffset.top + scroll.scrollTop
        };
    }

    // 将document的坐标转换为相对Stage的坐标
    getPositionRelativeStage = (pageX: number, pageY: number) => {
        const pos = this.props.componentPosition;
        const scroll = this.props.getStageScroll();

        return {
            pointX: pageX - pos.stageOffset.left + scroll.scrollLeft,
            pointY: pageY - pos.stageOffset.top + scroll.scrollTop
        };
    }

    // 将canvas的坐标转换为相对document的坐标
    getPositionRelativeDocument = (pointX: number, pointY: number) => {
        const pos = this.props.componentPosition;
        const scroll = this.props.getStageScroll();

        return {
            pageX: pointX + pos.stageOffset.left + pos.canvasOffset.left - scroll.scrollLeft,
            pageY: pointY + pos.stageOffset.top + pos.canvasOffset.top - scroll.scrollTop
        };
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
    drawChoiceBox = (pointX: number, pointY: number, offset: { x: number, y: number }) => {
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
    clearChoiceBox = () => {
        // 通知绘画层清理选择框
        const draw = this.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox(null);
        }
    }

    /**
     * 清理组件移动框
     */
    clearDragBox = () => {
        // 组件判断是否在canva画布外，在则增加画布大小

        // 清楚移动框
        this.command.clearDragBox();
    }
}
