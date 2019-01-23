import * as React from 'react';
import { Draw, IDrawComponent } from '../Draw';
import { Canvas, ICanvasComponent, IBoundary, IOffset } from '../Canvas';
import { PluginMap, addPluginConfig } from '../../plugin';

import { IStageProps } from './IStageProps';
import { IStageState } from './IStageState';

import './sass/Stage.scss';

export class Stage extends React.PureComponent<IStageProps, IStageState> {
    private canvas: ICanvasComponent | null = null;
    private draw: IDrawComponent | null = null;
    private stage: HTMLDivElement | null = null;

    constructor(props: IStageProps) {
        super(props);

        this.state = {
            componentPosition: props.config.componentPosition
        };

        this.props.openTemplateModal && addPluginConfig(PluginMap.OPEN_TEMPLATE_FUNC, this.props.openTemplateModal);
    }

    /**
     * 获取命令，并传给canvas
     * @param cmd 命令参数
     */
    public onCommandEmitted = (cmd: any) => {
        if (this.canvas) {
            this.canvas.executeCommand(cmd);
        }
    }

    /**
     * 修改画布左右偏移量
     */
    public changeStageOffset = (leftCollapsed: boolean, rightCollapsed: boolean) => {
        const newStageOffset = Object.assign({}, this.state.componentPosition.stageOffset, {
            left: leftCollapsed ? 0 : this.props.config.componentPosition.stageOffset.left,
            right: rightCollapsed ? 0 : this.props.config.componentPosition.stageOffset.right
        });
        this.setState({
            componentPosition: Object.assign({}, this.state.componentPosition, { stageOffset: newStageOffset })
        });
    }

    /**
     * 获取画布保存数据
     */
    public getCanvasSaveData = (isShrink: boolean = false) => {
        const { width, height, detail } = this.getCanvas().getSaveData(isShrink);

        return {
            detail,
            width,
            height
        };
    }

    /**
     * 设置画布是否变脏
     */
    public setCanvasIsDirty = (isDirty: boolean): void => {
        this.getCanvas().setIsDirty(isDirty);
    }

    /**
     * 加载画布数据
     */
    public initCanvasData = (components: any, canvasSize: { width: number; height: number; }): void => {
        this.getCanvas().initCanvas(components, canvasSize);
    }

    render() {
        const { componentPosition } = this.state;
        const {
            pageMode,
            canvasSize,
            components,
            onContextMenu,
            setPageDirty,
            getPageDirty,
            saveData,
            onCommandProperties,
            onPropertyProperties,
            copyToClipboard,
            readFromClipboard,
            checkClipboard,
            userInfo,
            scale
        } = this.props;

        return (
            <div id="stage" ref={(render) => this.stage = render} className="stage" style={this.StageStyle()}>
                <Draw
                    ref={(render) => this.draw = render}
                    getCanvas={this.getCanvas}
                    pageMode={pageMode}
                    canvasSize={canvasSize}
                    componentPosition={componentPosition}
                    scale={scale}
                    getStageScroll={this.getStageScroll}
                />
                <Canvas
                    ref={(render) => this.canvas = render}
                    pageMode={pageMode}
                    canvasSize={canvasSize}
                    components={components}
                    componentPosition={componentPosition}
                    scale={scale}
                    getDraw={this.getDraw}
                    getStageScroll={this.getStageScroll}
                    setStageScroll={this.setStageScroll}
                    getStageBoundary={this.getStageBoundary}
                    getStageSize={this.getStageSize}
                    onCommandProperties={onCommandProperties}
                    onPropertyProperties={onPropertyProperties}
                    setPageDirty={setPageDirty}
                    getPageDirty={getPageDirty}
                    onContextMenu={onContextMenu}
                    saveData={saveData}
                    copyToClipboard={copyToClipboard}
                    readFromClipboard={readFromClipboard}
                    checkClipboard={checkClipboard}
                    userInfo={userInfo}
                />
            </div>
        );
    }

    /**
     * 获取draw对象
     */
    private getDraw = (): IDrawComponent => {
        return (this.draw as IDrawComponent);
    }

    /**
     * 获取canvas对象
     */
    private getCanvas = (): ICanvasComponent => {
        return (this.canvas as ICanvasComponent);
    }

    /**
     * Stage样式
     */
    private StageStyle = (): React.CSSProperties => {
        const stageOffset = this.state.componentPosition.stageOffset;

        return {
            top: stageOffset.top,
            left: stageOffset.left,
            right: stageOffset.right,
            bottom: stageOffset.bottom
        };
    }

    /**
     * 获取stage上滚动条的偏移量
     */
    private getStageScroll = () => {
        let scrollLeft: number = 0;
        let scrollTop: number = 0;
        if (this.stage) {
            scrollLeft = this.stage.scrollLeft;
            scrollTop = this.stage.scrollTop;
        }

        return { scrollLeft, scrollTop };
    }

    /**
     * 获取stage的边界范围
     */
    private getStageBoundary = () => {
        const stageOffset = this.state.componentPosition.stageOffset;
        const { width, height } = this.getStageSize();

        return {
            startPoint: { x: stageOffset.left, y: stageOffset.top },
            endPoint: {
                x: stageOffset.left + width,
                y: stageOffset.top + height
            }
        } as IBoundary;
    }

    /**
     * 获取stage的大小
     */
    private getStageSize = () => {
        let width: number = 0;
        let height: number = 0;
        if (this.stage) {
            width = this.stage.offsetWidth;
            height = this.stage.offsetHeight;
        }

        return { width, height };
    }

    /**
     * 修改滚动条
     * @param offset 偏移量{ x: 0, y: 0 }
     */
    private setStageScroll = (offset: IOffset) => {
        if (this.stage) {
            this.stage.scrollLeft += offset.x;
            this.stage.scrollTop += offset.y;
        }
    }
}
