import { Canvas } from '../Canvas';
import { IComponentList, DragType, IOffset } from '../model/types';
import { IComponent } from '../../BaseComponent';
import { emptyButtonGroup } from '../../UniversalComponents';
import { CommandMap } from '../command/CommandEmitted';

import { OrderedSet, Set } from 'immutable';

export class DrawUtil {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 组件选择
     */
    selectedComponent = (cid: string, com: IComponent, multiselect: boolean = false) => {
        // 组件选择
        this._canvas._canvasGlobalParam.addSelectedComponent(cid, com, multiselect);
        this.repaintSelected();
        this._canvas._canvasGlobalParam.drawDragBox(this._canvas._positionUtil.getPositionRelativeDocument(0, 0));

        // 单选的时候一个个传递
        if (multiselect === false) {
            // 向CommandBar传递当前选中的组件集合
            this._canvas.props.onCommandProperties && this._canvas.props.onCommandProperties(this._canvas.getSelectedToolButtons(this._canvas._canvasGlobalParam.getSelectedComponents()));
            // 向PropertyBar传递当前选中的组件属性
            this._canvas.props.onPropertyProperties && this._canvas.props.onPropertyProperties(this._canvas.getSelectedProperties(this._canvas._canvasGlobalParam.getSelectedComponents()));
        }
    }

    /**
     * 绘制组件选中框
     */
    drawSelected = (cids: Set<string>) => {
        const draw = this._canvas.props.getDraw();
        if (draw !== null) {
            draw.drawSelectedBox(cids);
        }
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
        const selectedComponents = this._canvas._canvasGlobalParam.getSelectedComponents();
        // 当选中组件不为空时才进行清空操作
        if (selectedComponents.size > 0) {
            // 1.把焦点指向僚机（触发属性栏text控件丢失焦点事件）
            this._canvas.executeCommand({t: CommandMap.WINGMAN_FOCUS});
            // 2.向CommandBar传递当前选中的组件集合
            this._canvas.props.onCommandProperties && this._canvas.props.onCommandProperties(emptyButtonGroup);
            this._canvas.props.onPropertyProperties && this._canvas.props.onPropertyProperties(OrderedSet());
            // 3.清除选中组件（先处理其他逻辑，最后清除组件选中）
            this._canvas._canvasGlobalParam.clearSelectedComponent();
            this.hideSelected();
        }
    }

    /**
     * 绘制鼠标选择框
     */
    drawChoiceBox = (e: any) => {
        // 通知绘画层出现选择框
        const scale: number = this._canvas.props.scale ? this._canvas.props.scale : 1;
        const pointStart = this._canvas._canvasGlobalParam.getPointerStart('stage');
        const stagePos = this._canvas._positionUtil.getPositionRelativeStage(e.pageX, e.pageY);
        const offset = { x: stagePos.pointX - pointStart.x, y: stagePos.pointY - pointStart.y };
        const style = { fill: '#108ee9', fillOpacity: 0.05, stroke: '#108ee9', strokeWidth: 1 };
        const draw = this._canvas.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox({
                pointX: Math.ceil(pointStart.x / scale),
                pointY: Math.ceil(pointStart.y / scale),
                offset: {
                    x: Math.ceil(offset.x / scale),
                    y: Math.ceil(offset.y / scale)
                },
                style
            });
        }
    }

    /**
     * 绘制鼠标选择框-添加批注
     */
    drawChoiceBoxAddCommentsMode = (e: any) => {
        // 通知绘画层出现选择框
        const scale: number = this._canvas.props.scale ? this._canvas.props.scale : 1;
        const pointStart = this._canvas._canvasGlobalParam.getPointerStart('stage');
        const stagePos = this._canvas._positionUtil.getPositionRelativeStage(e.pageX, e.pageY);
        const offset = { x: stagePos.pointX - pointStart.x, y: stagePos.pointY - pointStart.y };
        const style = { fill: '#fff', fillOpacity: 0, stroke: '#D0021B', strokeWidth: 1, rx: 5, ry: 5 };
        const draw = this._canvas.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox({
                pointX: Math.ceil(pointStart.x / scale),
                pointY: Math.ceil(pointStart.y / scale),
                offset: {
                    x: Math.ceil(offset.x / scale),
                    y: Math.ceil(offset.y / scale)
                },
                style
            });
        }
    }

    /**
     * 绘制鼠标选择框-添加图片放大镜
     */
    drawChoiceBoxAddImageMagnifierMode = (e: any) => {
        // 通知绘画层出现选择框
        const scale: number = this._canvas.props.scale ? this._canvas.props.scale : 1;
        const pointStart = this._canvas._canvasGlobalParam.getPointerStart('stage');
        const stagePos = this._canvas._positionUtil.getPositionRelativeStage(e.pageX, e.pageY);
        const offset = { x: stagePos.pointX - pointStart.x, y: stagePos.pointY - pointStart.y };
        const style = { fill: '#bbbbbb', fillOpacity: 0.10, stroke: '#bbbbbb', strokeWidth: 1, rx: 3, ry: 3 };
        const draw = this._canvas.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox({
                pointX: Math.ceil(pointStart.x / scale),
                pointY: Math.ceil(pointStart.y / scale),
                offset: {
                    x: Math.ceil(offset.x / scale),
                    y: Math.ceil(offset.y / scale)
                },
                style
            });
        }
    }

    /**
     * 清理鼠标选择框
     */
    clearChoiceBox = (e: any) => {
        if (this._canvas._canvasGlobalParam.getDragType() === DragType.Choice) {
            const scale: number = this._canvas.props.scale ? this._canvas.props.scale : 1;
            const pointStart = this._canvas._canvasGlobalParam.getPointerStart('canvas');
            const pointA = { x: pointStart.x, y: pointStart.y };
            const pointB = this._canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);
            const start = {
                x: Math.ceil(Math.min(pointA.x, pointB.x) / scale),
                y: Math.ceil(Math.min(pointA.y, pointB.y) / scale)
            };
            const end = {
                x: Math.ceil(Math.max(pointA.x, pointB.x) / scale),
                y: Math.ceil(Math.max(pointA.y, pointB.y) / scale)
            };

            const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
            componentList.map(
                (component: IComponentList) => {
                    const com = this._canvas.getComponent(component.cid);
                    if (com !== null) {
                        const isCanSelected: boolean = com.isCanSelected();
                        if (isCanSelected) {
                            const pos = com.getPosition();
                            const size = com.getSize();
                            if (pos.left > start.x && pos.top > start.y &&
                                pos.left + size.width < end.x && pos.top + size.height < end.y) {
                                this.selectedComponent(component.cid, com, true);
                            }
                        }
                    }
                }
            );

            // 框选的时候：有选中组件才做提交
            const selectedComponents = this._canvas._canvasGlobalParam.getSelectedComponents();
            if (selectedComponents.size > 0) {
                this._canvas.props.onCommandProperties && this._canvas.props.onCommandProperties(this._canvas.getSelectedToolButtons(selectedComponents));
                this._canvas.props.onPropertyProperties && this._canvas.props.onPropertyProperties(this._canvas.getSelectedProperties(selectedComponents));
            }

            // 通知绘画层清理选择框
            const draw = this._canvas.props.getDraw();
            if (draw !== null) {
                draw.drawChoiceBox(null);
            }
        }
    }

    /**
     * 绘制组件大小延伸框
     */
    drawStretchBox = (e: any, endStretch: boolean = false) => {
        if (this._canvas._canvasGlobalParam.getDragType() === DragType.Stretch) {
            const scale: number = this._canvas.props.scale ? this._canvas.props.scale : 1;
            const pointStart = this._canvas._canvasGlobalParam.getPointerStart('canvas');
            const canvasPos = this._canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);
            const offset: IOffset = {
                x: Math.ceil((canvasPos.x - pointStart.x) / scale),
                y: Math.ceil((canvasPos.y - pointStart.y) / scale)
            };

            const draw = this._canvas.props.getDraw();
            if (draw !== null) {
                this._canvas._canvasGlobalParam.anchorMove(offset, endStretch, (data: any) => {
                    draw.drawStretchBox(data);
                });
            }
        }
    }

    /**
     * 拖动组件移动框
     */
    moveDragBox = (e: any) => {
        let stageBoundary = this._canvas.props.getStageBoundary();
        // 创建拖动框并拖动
        const start = this._canvas._canvasGlobalParam.getPointerStart('dom');
        const offset = { x: e.pageX - start.x, y: e.pageY - start.y };
        if (stageBoundary) {
            stageBoundary = {
                startPoint: { x: stageBoundary.startPoint.x - offset.x, y: stageBoundary.startPoint.y - offset.y },
                endPoint: { x: stageBoundary.endPoint.x - offset.x, y: stageBoundary.endPoint.y - offset.y }
            };
        }

        // 档偏移量超过10后才开始处理拖拽事件，并隐藏选中框
        if (!this._canvas._canvasGlobalParam.isDargging() && Math.abs(offset.x) < 10 && Math.abs(offset.y) < 10) return;

        this._canvas._canvasGlobalParam.darggingStart();
        this._canvas._canvasGlobalParam.moveDragBox(offset, stageBoundary, this._canvas.props.setStageScroll);
    }

    /**
     * 清理组件移动框
     */
    clearDragBox = () => {
        // 清楚移动框
        this._canvas._canvasGlobalParam.clearDragBox(this._canvas._positionUtil.getPositionRelativeDocument(0, 0));
    }

    /**
     * 重新绘制组件选中框
     */
    repaintSelected = () => {
        this.drawSelected(this._canvas._canvasGlobalParam.getSelectedCids());
    }

    /**
     * 设置Draw的画布大小
     */
    setDrawCanvasSize = (canvasSize: { width: number; height: number; }) => {
        const draw = this._canvas.props.getDraw();
        if (draw !== null) {
            draw.setCanvasSize(canvasSize);
        }
    }
}
