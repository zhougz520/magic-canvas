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

/* tslint:disable: jsx-no-multiline-js */
export default class ComponentChildItem extends React.PureComponent<IComItemProps, IComItemState> {
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
                className="rChildLi"
                draggable={this.state.draggable}
                ref={(container) => { this.dragElement = container; }}
                onDragStart={this.dragStart}
                onDragEnd={this.dragEnd}
            >
                <Icon type="menu-unfold" style={{ marginLeft: '10px' }} />
                <span style={{ marginLeft: '10px' }}>{componentProps.name}</span>
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
                x: Math.ceil(comWidth * (evt.pageX - itemPos.leftWithScroll) / 61),
                y: Math.ceil(comHeight * (evt.pageY - itemPos.topWithScroll) / 60)
            };
        }
        localStorage.setItem('__dnd_type', 'dragging_cs');
        if (this.props.componentType.indexOf('MapComponent') !== -1 && componentProps.type === undefined) {
            localStorage.setItem('__dnd_type', 'dragging_map');
        }
        localStorage.setItem(
            '__dnd_value',
            JSON.stringify({
                offset,
                t: this.props.componentType,
                p: this.props.componentProps
            })
        );
    }

    dragEnd = (evt: any) => {
        localStorage.removeItem('__dnd_type');
        localStorage.removeItem('__dnd_value');
    }
}
