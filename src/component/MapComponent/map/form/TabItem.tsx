import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_form_st_name?: string;      // tab名称
    selectOn?: string;              // 选中tab
    map_form_st?: boolean;          // 是否显示tab
    index?: number;
    onChangeItem: (id: string) => void;
}

export class TabItem extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_form_st_name: '标签页',
        map_mi_sa: false,
        map_mi_line: false,
        map_form_sti: undefined
    };

    constructor(props: any, context?: any) {
        super(props, context);
    }

    public getItemStyle = (draggableStyle: any, isDragging: any) => ({

        // change background colour if dragging
        background: isDragging ? 'blue' : '',

        // styles we need to apply on draggables
        ...draggableStyle
    })

    public render() {
        const { map_form_st_name, id, selectedId, index, selectOn } = this.props;

        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
            >
                <span
                    className={`tab${id === selectOn ? ' tabOn' : ''}${id === selectedId ? ' map-selected' : ''}`}
                >
                    {map_form_st_name}
                </span>
                {provided.placeholder}
            </div >
        );

        return (
            <div onClick={this.onChangeItem} className="container">
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
            </div>
        );
    }
    private onChangeItem = (e: any) => {
        this.props.onChangeItem(this.props.id);
        this.selectedCom(e);
    }

}
