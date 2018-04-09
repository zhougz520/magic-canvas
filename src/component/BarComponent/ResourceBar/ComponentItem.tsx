import * as React from 'react';
import { Card, Icon } from 'antd';
import util from '../../util';

export interface IComItemProps {
    componentType: string;
    componentAdderType: any;
    componentProps: any;
}

export interface IComItemState {
    [key: string]: any;
}

export default class ComponentItem extends React.PureComponent<IComItemProps, IComItemState> {
    private dragElement: HTMLDivElement | null = null;

    constructor(props: IComItemProps) {
        super(props);
        this.state = {
            draggable: true
        };
    }

    componentDidMount() {
        // tslint:disable-next-line:no-empty
        if (this.dragElement !== null) {
        }
    }

    render() {
        const { componentProps } = this.props;
        let component = null;
        if (!util.isUndefined(componentProps) && !util.isUndefined(componentProps.name)) {
            component = (
                <div className="cs-pc-map">
                    <div className="cs-ico"><Icon type="menu-unfold" /></div>
                    <div className="cs-text">{componentProps.name}</div>
                </div>
            );
        }

        return (
            <div
                draggable={this.state.draggable}
                ref={(container) => { this.dragElement = container; }}
                onDragStart={this.dragStart}
                onDragEnd={this.dragEnd}
            >
                <Card className="component-list-item">
                    {component}
                </Card>
            </div>
        );
    }

    dragStart = (evt: any) => {
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text', evt.target.innerHTML);

        // 计算鼠标开始拖拽时的偏移量(鼠标落点与item左上角的偏移量)
        let offset = { x: 0, y: 0 } as { x: number, y: number };
        if (this.dragElement !== null) {
            const itemPos = util.getDomLocation(this.dragElement);
            offset = { x: evt.pageX - itemPos.leftWithScroll, y: evt.pageY - itemPos.topWithScroll };
        }
        localStorage.__dnd_type = 'dragging_cs';
        localStorage.__dnd_value = JSON.stringify({
            offset,
            type: this.props.componentType,
            props: this.props.componentProps
        });
    }

    dragEnd = (evt: any) => {
        delete localStorage.__dnd_type;
        delete localStorage.__dnd_value;
    }
}
