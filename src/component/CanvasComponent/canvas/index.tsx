import * as React from 'react';
import CanvasComponent from '../CanvasComponent';
import { ICanvasComponent, ICanvasProps, ICanvasState, CanvasCommand } from '../inedx';
import { Demo } from '../../../component/BaseComponent/demo/Demo';
import { Set } from 'immutable';
import { IComponent } from '../../BaseComponent';
import { CanvasStyle, ContainerStyle } from '../model/CanvasStyle';
import * as Anchor from '../../util/AnchorPoint';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Canvas extends CanvasComponent<ICanvasProps, ICanvasState> implements ICanvasComponent {
    container: HTMLDivElement | null = null;
    canvas: HTMLDivElement | null = null;

    /**
     * 由于使用的时PureComponent,所有不变的数据直接放在state中,变化的数据放过在CanvasStae中
     * @param props any
     */
    constructor(props: any) {
        super(props);
        this.state = {
            selectedCids: Set<string>()
        } as Readonly<ICanvasState>;
        CanvasCommand.bind(this);
    }

    getRef = (key: string): IComponent | null => {
        const ref = this.refs[key] as any;

        return (ref as IComponent) || null;
    }

    setUndo = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.undo();
        } else {
            console.log('nima');
        }
    }

    setRedo = () => {
        const demoComponent = this.getRef('DemoComponent');

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
        let cids: Set<string> = this.state.selectedCids;
        if (!CanvasCommand.isMultiselect() && !cids.has(cid)) {
            cids = cids.clear();
        }
        cids = cids.add(cid);
        this.setState({ selectedCids: cids });

        // 判断点击位置
        const com = this.getRef(cid);
        if (com) {
            const pos = this.props.componentPosition;
            const anchor = com.getPointerAnchor(
                e.pageX - pos.stageOffset.left - pos.canvasOffset.left,
                e.pageY - pos.stageOffset.top - pos.canvasOffset.top);
            if (anchor === null) {
                // 创建移动框
                this.drawDragBox(cids);
            } else {
                // 锚点拖动
                this.setAnchor(com, anchor);
            }
        }
        // 重绘选中框
        this.drawSelected(cids);
    }

    /**
     * 阻止合成事件与除最外层document上的原生事件上的冒泡，通过判断e.target来避免
     * 判断事件源是否是画布
     */
    onMouseEvent = (e: any): boolean => {
        console.log(e.target.className);
        // 若未在canva元素上出发则返回
        if (e.target && e.target.className.startsWith('canvas')) return true;

        return false;
    }

    handlerMouseDown = (e: any) => {
        if (this.onMouseEvent(e)) {  // 画布上的点击
            CanvasCommand.canvasMouseDown(e);
            // 非多选模式下，清楚所有组件选中状态
            if (!CanvasCommand.isMultiselect()) {
                this.clearSelected();
            }
            console.log('mousedown');
        } else {// 组件中的点击
            CanvasCommand.componentMouseDown(e);
            console.log('com mouse down');
        }
    }

    handlerMouseUp = (e: any) => {
        if (this.onMouseEvent(e)) {
            CanvasCommand.canvasMouseUp(e);

            console.log('mouseup');
        } else {
            console.log('com mouse up');
            CanvasCommand.componentMouseUp(e);
        }

        // 清除拉选框
        this.clearChoiceBox();
        // 清楚移动框
        this.clearDragBox();
    }

    handleMouseMove = (e: any) => {
        if (CanvasCommand.isDargingStart()) {
            const pointStart = CanvasCommand.getPointerStart();
            const offset = {
                x: e === undefined ? 0 : e.pageX - pointStart.x,
                y: e === undefined ? 0 : e.pageY - pointStart.y
            };
            switch (CanvasCommand.getDragType()) {
                case 'none': return;
                case 'choice': {    // 鼠标拉选框
                    this.drawChoiceBox(pointStart.x, pointStart.y, offset);

                    return;
                }
                case 'drag': {  //  组件位移框
                    CanvasCommand.moveDocumentDiv(offset);

                    return;
                }
                case 'stretch': {  // 组件缩放框
                    this.dragAnchor(offset);

                    return;
                }
            }
        }
        console.log('mouseMove');
    }

    componentDidMount() {
        CanvasCommand.initCanvas();
        if (this.container && this.canvas) {
            this.container.addEventListener('mousemove', this.handleMouseMove);
            this.canvas.addEventListener('mousedown', this.handlerMouseDown);
            this.canvas.addEventListener('mouseup', this.handlerMouseUp);
        }
    }

    render() {
        const pos = this.props.componentPosition;

        return (
            <div ref={(handler) => this.container = handler} className="container" style={ContainerStyle}>
                <div
                    ref={(handler) => this.canvas = handler}
                    className="canvas"
                    style={CanvasStyle(pos.canvasOffset)}
                >
                    <Demo
                        ref="DemoComponent"
                        demoProp="DemoComponent"
                        data={{ w: 100, h: 100, l: 10, r: 10, t: 10, b: 10, text: '我是测试组件1' }}
                        selectionChanging={this.selectionChanging}
                    />
                    <Demo
                        ref="DemoComponent2"
                        demoProp="DemoComponent2"
                        data={{ w: 100, h: 100, l: 200, r: 10, t: 200, b: 10, text: '我是测试组件2' }}
                        selectionChanging={this.selectionChanging}
                    />
                    <Demo
                        ref="DemoComponent3"
                        demoProp="DemoComponent3"
                        data={{ w: 100, h: 100, l: 300, r: 10, t: 10, b: 10, text: '我是测试组件3' }}
                        selectionChanging={this.selectionChanging}
                    />
                </div>
            </div>
        );
    }

    /**
     * 绘制组件选中框
     */
    drawSelected = (cids: Set<string>) => {
        this.setState({ selectedCids: cids });
        this.props.showSelected(cids);
    }

    /**
     * 绘制鼠标选择框
     */
    drawChoiceBox = (pointX: number, pointY: number, offset: { x: number, y: number }) => {
        // 通知绘画层出现选择框
        this.props.drawChoiceBox({ pointX, pointY, offset });
    }

    /**
     * 绘制组件移动框
     */
    drawDragBox = (cids: Set<string>) => {
        cids.map((cid) => {
            if (cid) {
                const com = this.getRef(cid);
                CanvasCommand.createDocumentDiv(cid, com, this.props.componentPosition);
            }
        });
    }

    // 设置选中锚点
    setAnchor = (com: IComponent, anchor: Anchor.IAnchor) => {
        CanvasCommand.componentAnchorDown(com, anchor);
    }

    // 锚点拖动
    dragAnchor = (offset: { x: number, y: number }) => {
        CanvasCommand.componentAnchorMove(offset);
    }

    /**
     * 清理组件选中框
     */
    clearSelected = () => {
        this.drawSelected(Set<string>());
    }

    /**
     * 清理鼠标选择框
     */
    clearChoiceBox = () => {
        // 通知绘画层清理选择框
        this.props.drawChoiceBox(null);
    }

    /**
     * 清理组件移动框
     */
    clearDragBox = () => {
        CanvasCommand.clearDocumentDiv();
    }

}
