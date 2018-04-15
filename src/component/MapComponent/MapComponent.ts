import * as React from 'react';

import { IMapComponent } from './IMapComponent';
import { IMapProps } from './IMapProps';
import { IMapState } from './IMapState';

import { MapState } from './model/MapState';
import { ContentState } from './model/ContentState';
const moveOver = (event: any, id: string) => {
    // let intersects: any= [];
};
/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class MapComponent<P extends IMapProps, S extends IMapState>
    extends React.PureComponent<P, S> implements IMapComponent {

    constructor(props: P, context?: any) {
        super(props, context);

        const contentState: ContentState = ContentState.create({
            cid: props.data.id,
            // TODO 带格式的富文本
            richChildNode: props.data.txt_v
        });

        this.state = {
            mapState: MapState.createWithContent(contentState)
        } as Readonly<S>;
        document.addEventListener('mouseover', (event: any) => moveOver(event, props.data.id));
    }

    /**
     * 获取组件标识cid
     */
    public getCid = (): string => {
        const mapState: MapState = this.getMapState();

        return mapState.getCurrentContent().getCid();
    }

    /**
     * 获取组件富文本内容
     * 返回：带格式的富文本内容（html）
     */
    public getRichChildNode = (): any => {
        const mapState: MapState = this.getMapState();

        return mapState.getCurrentContent().getRichChildNode();
    }

    /**
     * 设置组件富文本内容
     * @param richChildNode 带格式的富文本内容（html）
     */
    public setRichChildNode = (richChildNode: any): void => {
        const oldMapState: MapState = this.getMapState();
        const newContent: ContentState = oldMapState.getCurrentContent().merge({
            richChildNode
        }) as ContentState;
        const newMapState = MapState.loadStack(oldMapState, newContent);

        this.setMapState(newMapState);
    }

    /**
     * 获取组件的baseState
     */
    protected getMapState = (): MapState => {
        const mapState: MapState = this.state.mapState;

        return mapState;
    }

    /**
     * 设置组件的baseState
     * @param newMapState 构建好的新的baseState
     */
    protected setMapState = (newMapState: MapState): void => {
        this.setState({
            mapState: newMapState
        });
    }

    /**
     * 组件自己不要处理选中状态，交有画布处理，因为选中状态由键盘和鼠标事件组成，
     * 每个组件自己记录，还要判断键盘事件，比较复杂，且选中状态对组件身意义不大，故交由画布决定
     * @param cid 组件ref标识
     */
    protected fireSelectChange = (e: any): void => {
        if (this.props.selectionChanging) {
            this.props.selectionChanging(this.getCid(), e);
        }
    }

    /**
     * 组件获得焦点：通知EditComponent获得焦点，准备输入
     * @param cid 组件ref标识
     */
    protected onComFocus = (cid: string, e: any): void => {
        if (this.props.onComFocus) {
            this.props.onComFocus(cid);
        }
    }

}
