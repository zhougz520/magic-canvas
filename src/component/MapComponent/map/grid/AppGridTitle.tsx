import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { GlobalUtil } from '../../../util';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    setIsCanMove: (isCanMove: boolean) => void;
    map_gt_txt?: string;
    w: number;
    index: number;
}

export class AppGridTitle extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_gt_txt: '标题',
        w: 50
    };

    public resizing = false;
    public mousePosition = {
        x: 0
    };
    public startW = 0;
    public dragWidth: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            currX: 0,
            resizing: false
        };
    }
    public getItemStyle = (draggableStyle: any, isDragging: any) => ({
        // change background colour if dragging
        background: isDragging ? 'blue' : '',

        // styles we need to apply on draggables
        ...draggableStyle
    })
    // 如果需要特殊遮罩，则在componentDidUpdate中处理
    componentDidUpdate() {
        document.addEventListener('mousemove', this.onResizingTitle);
        document.addEventListener('mouseup', this.onMouseUp);
        if (this.com !== null) {
            const currMaskLayer = document.getElementById(this.props.id);
            // console.log('id', this.props.id);
            if (currMaskLayer !== null) {
                currMaskLayer.style.width = `${this.com.offsetWidth - 8}px`;
            }
        }
    }
    public render() {
        const { map_sm, map_gt_txt, selectedId, w, id, index } = this.props;
        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                onMouseDown={this.selectedCom}
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
            >
                <div
                    className={`title ${map_sm || ''} ${selectedId === id ? 'selectecd' : ''}`}
                    ref={(ref) => this.com = ref}
                    style={{ width: w }}
                >
                    <div className={`title-content `}>
                        {map_gt_txt}
                    </div>
                </div>
                {provided.placeholder}
            </div>
        );

        return (
            <div
                className={`app-grid-title-item`}
                style={{ width: w }}
                onMouseDown={this.selectedCom}
            >
                <MaskLayer id={id} />
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
                <div
                    className="title-split"
                    onMouseDown={this.onMouseDown}
                    // // onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                />
            </div>
        );
    }
    public onMouseDown = (evt: any) => {
        this.setState({
            resizing: true,
            currX: evt.clientX
            // width: newWidth <= 400 ? 400 : newWidth
        });
        this.props.setIsCanMove(false);
    }
    public onMouseUp = (evt: any) => {
        if (this.state.resizing) {
            this.setState({
                resizing: false,
                currX: 0
                // width: newWidth <= 400 ? 400 : newWidth
            });
            evt.stopPropagation();
        }
        this.props.setIsCanMove(true);
    }
    public onResizingTitle = (evt: any) => {
        const { id, w } = this.props;
        const { currX, resizing } = this.state;
        if (resizing) {
            this.setState({
                currX: evt.clientX
            });
            const newWidth = w + (evt.clientX - currX);
            this.props.updateProps(id, { w: newWidth < 50 ? 50 : newWidth });
        }
    }

    // 鼠标松开时，计算title宽度
    public handleMouseup = (e: any) => {
        e.preventDefault();
        e.target;
        GlobalUtil.debugLog(e.target, 'e.target');
        GlobalUtil.debugLog('11111', '11111');
    }
}
