import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { GlobalUtil } from '../../util/GlobalUtil';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
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
    public startW = 0;
    public dragWidth: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            w: this.props.w
        };
    }
    public getItemStyle = (draggableStyle: any, isDragging: any) => ({
        // some basic styles to make the items look a bit nicer
        // userSelect: 'none',
        // paddingRight: 5,
        // paddingLeft: 5,

        // change background colour if dragging
        background: isDragging ? 'blue' : '',

        // styles we need to apply on draggables
        ...draggableStyle
    })
    componentWillMount() {
        if (this.com !== null) {
            // this.com.addEventListener('dragstart', this.dragStart);
            // this.com.addEventListener('dragend', this.dragEnd);
        }
    }

    public render() {
        const { map_sm, map_gt_txt, selectedId, id, index } = this.props;
        const { w } = this.state;
        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
            >
                <div
                    className={`title ${map_sm || ''} ${selectedId === id ? 'selectecd' : ''}`}
                    ref={(ref) => this.com = ref}
                    style={{ width: w }}
                    onMouseDown={this.selectedCom}
                >
                    <div className={`title-content `}>
                        {map_gt_txt}
                    </div>
                </div>
                {provided.placeholder}
            </div>
        );

        return (
            <div className={`app-grid-title-item`} style={{ width: w }}>
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
                <div
                    className="title-split"
                    onMouseDown={this.onDragStart}
                    onMouseMove={this.onDrag}
                    onMouseUp={this.onDragEnd}
                />
            </div>
        );
    }
    public onDragStart = (evt: any) => {
        this.resizing = true;
        this.startW = this.state.w;
    }
    public onDrag = (evt: any) => {
        if (this.resizing) {
            this.setState({
                w: this.startW + evt.target.offsetLeft
            });

        }
    }
    public onDragEnd = (evt: any) => {
        this.resizing = false;
        this.startW = 0;
    }

    // 鼠标松开时，计算title宽度
    public handleMouseup = (e: any) => {
        e.preventDefault();
        e.target;
        GlobalUtil.debugLog(e.target, 'e.target');
        GlobalUtil.debugLog('11111', '11111');
    }
}
