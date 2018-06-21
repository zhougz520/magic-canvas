import * as React from 'react';
import { Draw, IDrawComponent } from '../Draw';
import { Canvas, ICanvasComponent, IBoundary, IOffset } from '../Canvas';

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
            highPerformance: props.config.highPerformance,
            componentPosition: props.config.componentPosition,
            canvasSize: props.config.canvasSize
        };
    }

    getStage = (): HTMLDivElement => {
        return (this.stage as HTMLDivElement);
    }

    getDraw = (): IDrawComponent => {
        return (this.draw as IDrawComponent);
    }

    getCanvas = (): ICanvasComponent => {
        return (this.canvas as ICanvasComponent);
    }

    StageStyle = () => {
        const stageOffset = this.state.componentPosition.stageOffset;

        return {
            top: `${stageOffset.top}px`,
            left: `${stageOffset.left}px`,
            right: `${stageOffset.right}px`,
            bottom: `${stageOffset.bottom}px`
        } as React.CSSProperties;
    }

    // 获取stage上滚动条的偏移量
    getStageScroll = () => {
        let scrollLeft: number = 0;
        let scrollTop: number = 0;
        scrollLeft = this.getStage().scrollLeft;
        scrollTop = this.getStage().scrollTop;

        return { scrollLeft, scrollTop };
    }

    // 修改滚动条
    setStageScroll = (offset: IOffset) => {
        this.getStage().scrollLeft += offset.x;
        this.getStage().scrollTop += offset.y;
    }

    // 获取stage的边界范围
    getStageBoundary = () => {
        const stageOffset = this.state.componentPosition.stageOffset;
        const width = this.getStage().offsetWidth;
        const height = this.getStage().offsetHeight;

        return {
            startPoint: { x: stageOffset.left, y: stageOffset.top },
            endPoint: {
                x: stageOffset.left + width,
                y: stageOffset.top + height
            }
        } as IBoundary;
    }

    getStageSize = () => {
        const width = this.getStage().offsetWidth;
        const height = this.getStage().offsetHeight;

        return { width, height };
    }

    // 获取命令，并传给canvas
    onCommandEmitted = (cmd: any) => {
        if (this.canvas) {
            this.canvas.executeCommand(cmd);
        }
    }

    /**
     * 修改画布大小
     */
    updateCanvasSize = (width: number, height: number) => {
        this.setState({ canvasSize: { width, height } });
    }

    // 修改画布的偏移量
    changeStageOffset = (leftCollapsed: boolean, rightCollapsed: boolean) => {
        const newStageOffset = Object.assign({}, this.state.componentPosition.stageOffset, {
            left: leftCollapsed ? 0 : this.props.config.componentPosition.stageOffset.left,
            right: rightCollapsed ? 0 : this.props.config.componentPosition.stageOffset.right
        });
        this.setState({
            componentPosition: Object.assign({}, this.state.componentPosition, { stageOffset: newStageOffset })
        });
    }

    changeHighPerformance = (value: boolean) => {
        this.setState({
            highPerformance: value
        });
    }

    getCanvasSaveData = () => {
        const { width, height } = this.state.canvasSize;
        const detail = this.getCanvas().getSaveData();

        return {
            detail,
            width,
            height
        };
    }

    setCanvasIsDirty = (isDirty: boolean): void => {
        this.getCanvas().setIsDirty(isDirty);
    }

    initCanvasData = (components: any): void => {
        this.getCanvas().initCanvas(components);
    }

    render() {
        const { componentPosition, canvasSize, highPerformance } = this.state;
        const stateStyle = this.StageStyle();

        return (
            <div id="stage" ref={(render) => this.stage = render} className="stage" style={stateStyle}>
                <Draw
                    ref={(render) => this.draw = render}
                    getCanvas={this.getCanvas}
                    pageMode={this.props.pageMode}
                    canvasSize={canvasSize}
                    componentPosition={componentPosition}
                    getStageScroll={this.getStageScroll}
                />
                <Canvas
                    ref={(render) => this.canvas = render}
                    onContextMenu={this.props.onContextMenu}
                    getDraw={this.getDraw}
                    pageMode={this.props.pageMode}
                    highPerformance={highPerformance}
                    canvasSize={canvasSize}
                    componentPosition={componentPosition}
                    getStageScroll={this.getStageScroll}
                    setStageScroll={this.setStageScroll}
                    getStageBoundary={this.getStageBoundary}
                    getStageSize={this.getStageSize}
                    updateCanvasSize={this.updateCanvasSize}
                    components={this.props.components}
                    onCommandProperties={this.props.onCommandProperties}
                    onPropertyProperties={this.props.onPropertyProperties}
                    clearSelectedProperty={this.props.clearSelectedProperty}
                />
            </div>
        );
    }
}
