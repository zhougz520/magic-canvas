import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Radio } from 'antd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    value?: string;
}

export default class BtnDemo extends MapComponent<IMapProps, any> {
    static defaultProps = {
        txt_v: 'test'
    };

    public com: HTMLElement | null = null;

    public grid = 8;
    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            ...props,
            hover: false
        };
    }

    public render() {
        const { id, index, txt_v } = this.state;
        const test = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div style={{ float: 'left' }}>
                <div
                    ref={provided.innerRef}
                    style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                    {...provided.dragHandleProps}
                >
                    <div
                        style={{ marginLeft: 30 }}
                        ref={(handler: HTMLElement | null) => this.com = handler}
                    // onMouseDown={this.onFireSelect}
                    // draggable
                    // onClick={this.onTextChange}
                    >
                        {/* <MaskLayer key={0} /> */}
                        <Radio style={{ color: 'red', fontSize: '40px', width: '50px', height: '50px' }} >
                            {txt_v}
                        </Radio>
                    </div>
                </div>
                {provided.placeholder}
            </div>
        );

        return (
            <Draggable key={id} draggableId={id} index={index} >
                {test}
            </Draggable>
        );
    }

    // private onTextChange: any = () => {
    //     this.setState({
    //         txt_v: 'AAA'
    //     });
    // }

    // private onFireSelect = (e: any) => {
    //     const { id } = this.state;
    //     const { fireSelect } = this.props;

    //     fireSelect(e, id);
    // }

    public getItemStyle = (draggableStyle: any, isDragging: any) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: 'none',
        padding: this.grid * 2,
        marginBottom: this.grid,

        // change background colour if dragging
        background: isDragging ? 'lightgreen' : 'grey',

        // styles we need to apply on draggables
        ...draggableStyle
    })

    public getListStyle = (isDraggingOver: any) => ({
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
        padding: this.grid,
        width: 250
    })
}
