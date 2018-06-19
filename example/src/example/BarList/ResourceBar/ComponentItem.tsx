import * as React from 'react';
import { Icon } from 'antd';
import { GlobalUtil } from '../../../../../src';

export interface IComItemProps {
    componentType: string;
    componentAdderType: any;
    componentProps: any;
}

export interface IComItemState {
    [key: string]: any;
}

export default class ComponentItem extends React.PureComponent<IComItemProps, IComItemState> {
    private dragElement: HTMLLIElement | null = null;

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

        return (
            <li
                className="rLi"
                draggable={this.state.draggable}
                ref={(container) => { this.dragElement = container; }}
                onDragStart={this.dragStart}
                onDragEnd={this.dragEnd}
            >
                <Icon type="menu-unfold" />
                <span>{componentProps.name}</span>
            </li>
        );
    }

    dragStart = (evt: any) => {
        const { componentProps } = this.props;
        const comWidth = componentProps.w;
        const comHeight = componentProps.h;
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text', evt.target.innerHTML);

        // 计算鼠标开始拖拽时的偏移量(鼠标落点与item左上角的偏移量，按比例计算)
        let offset = { x: 0, y: 0 } as { x: number, y: number };
        if (this.dragElement !== null) {
            const itemPos = GlobalUtil.getDomLocation(this.dragElement);
            offset = {
                x: comWidth * (evt.pageX - itemPos.leftWithScroll) / 61,
                y: comHeight * (evt.pageY - itemPos.topWithScroll) / 60
            };
        }
        localStorage.__dnd_type = 'dragging_cs';
        if (this.props.componentType.indexOf('MapComponent') !== -1) {
            localStorage.__dnd_type = 'dragging_map';
        }
        localStorage.__dnd_value = JSON.stringify({
            offset,
            t: this.props.componentType,
            p: this.props.componentProps
        });
    }

    dragEnd = (evt: any) => {
        delete localStorage.__dnd_type;
        delete localStorage.__dnd_value;
    }
}
