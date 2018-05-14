import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import util from '../../util/index';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_gt_txt?: string;
    w: number;
}

export class AppGridTitle extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_gt_txt: '标题',
        w: 50
    };

    public dragWidth: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);
    }

    componentWillMount() {
        if (this.com !== null) {
            // this.com.addEventListener('dragstart', this.dragStart);
            // this.com.addEventListener('dragend', this.dragEnd);
        }
    }

    public render() {
        const { map_sm, w, map_gt_txt, selectedId, id } = this.props;

        return (
            <div
                className={`title ${map_sm || ''} ${selectedId === id ? 'selectecd' : ''}`}
                ref={(ref) => this.com = ref}
                style={{ width: w }}
                onMouseDown={this.selectedCom}
                onMouseMove={this.mouseMove}
                onMouseUp={this.mouseUp}
            >
                <div className={`title-content `}>
                    {map_gt_txt}
                </div>
                <div
                    className="title-split"
                    draggable
                // onClick={this.handleMouseup}
                />
            </div>
        );
    }

    public mouseMove = (evt: any) => {
        // evt.dataTransfer.effectAllowed = 'move';
        // evt.dataTransfer.setData('text', evt.target.outerHTML);

        // 计算鼠标开始拖拽时的偏移量(鼠标落点与item左上角的偏移量)
        // let offset = { x: 0, y: 0 } as { x: number, y: number };

    }

    public mouseUp = (evt: any) => {
        // delete localStorage.__dnd_type;
        // delete localStorage.__dnd_value;
    }
    // 鼠标松开时，计算title宽度
    public handleMouseup = (e: any) => {
        e.preventDefault();
        e.target;
        util.debugLog(e.target, 'e.target');
        util.debugLog('11111', '11111');
    }
}
