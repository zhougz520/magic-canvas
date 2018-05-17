import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import BtnChildDemo from './BtnChildDemo';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { GlobalUtil } from '../../util';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    value?: string;
}

export default class BtnDemo extends MapComponent<IMapProps, any> {
    static defaultProps = {
        value: 'test'
    };

    public com: HTMLElement | null = null;
    public grid = 8;
    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            data: props.data,
            hover: false
        };
    }

    shouldComponentUpdate(np: any, ns: any) {
        if (JSON.stringify(ns.data) !== this.state.data) {
            ns.data = this.state.data;
        }

        return true;
    }

    public render() {
        const {
            updateProps,
            selectedId,
            selectComChange,
            fireSelectChildChange
        } = this.props;
        const { hover, data } = this.state;
        const children: any = [];
        if (data.p.components.length > 0) {
            const currCom: any = null;
            data.p.components.forEach((com: any, index: number) => {
                switch (com.t) {
                    case 'MapComponent/demo/BtnChildDemo':
                        children.push(
                            <BtnChildDemo
                                key={`c.${com.p.id}`}
                                selectedId={selectedId}
                                // tslint:disable-next-line:jsx-no-string-ref
                                ref={`c.${com.p.id}`}
                                selectComChange={selectComChange}
                                fireSelectChildChange={fireSelectChildChange}
                                {...com.p}
                                updateProps={updateProps}
                                index={index}
                            />
                        );
                        break;
                    // case 'UniversalComponents/Button/Button':
                    //     children.push(
                    //         <Button
                    //             id={`c.${com.p.id}`}
                    //             data={com.p}
                    //             // tslint:disable-next-line:jsx-no-string-ref
                    //             ref={`c.${com.p.id}`}
                    //             fireSelect={fireSelect}
                    //         />);
                    //     break;
                }
                children.push(currCom);
            });
        }

        return (
            <div
                style={{ padding: 30, backgroundColor: hover ? '#007ACC' : 'white' }}
                ref={(handler: HTMLElement | null) => this.com = handler}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            >
                <DragDropContext onDragEnd={this.handleOver}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided, snapshot) => (<div ref={provided.innerRef}>{children}</div>)}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }

    public handleDrop = (e: any) => {
        if (GlobalUtil.isEmptyString(localStorage.__dnd_type) || GlobalUtil.isEmptyString(localStorage.__dnd_value)) return;
        if (localStorage.__dnd_type !== 'dragging_cs') return;
        const data = JSON.parse(localStorage.__dnd_value);
        this.addChildComponent(this.state.data, data);
        e.stopPropagation();
    }

    public handleOver = (result: any) => {
        const { data } = this.state;
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const components = this.reorder(
            this.state.data.p.components,
            result.source.index,
            result.destination.index
        );
        data.p.components = components;
        this.setState({
            data
        });
    }

    public reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }
}
