import * as React from 'react';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';
import { GlobalUtil } from '../util/GlobalUtil';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class MapComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {

    public com: HTMLElement | null = null;
    componentDidMount() {
        if (this.com != null) {
            this.com.addEventListener('drop', this.handleDropAddComponent);
            this.com.addEventListener('mousedown', this.selectedCom);
        }
    }
    /**
     * 添加子控件
     */
    public addChildComponent = (data: any, addData: any): any => {
        // 获取新id
        const childId: string = this.newComponentsId(data.p.components, `${data.id}.cs`);
        data.p.components.push({
            t: addData.t,
            p: Object.assign({}, addData.props, { id: childId })
        });
        this.props.updateProps(data.id, { p: data.p });

        return data;
    }
    /**
     * 删除控件
     */
    public deleteComponentsById = (cid: string): any => {

        return cid;
    }

    /**
     * 生成新控件Id
     */
    public newComponentsId(collection: any[], prefix = 'cs', pid = '') {
        const ids: number[] = [];
        collection.forEach((cs: any) => {
            ids.push(parseInt(cs.p.id.replace(prefix, ''), undefined));
        });
        if (ids.length === 0) {
            return `${pid === '' ? '' : `${pid}.`}${prefix}1`;
        } else {
            ids.sort((a: any, b: any) => a - b);

            return `${pid === '' ? '' : `${pid}.`}${prefix}${ids[ids.length - 1] + 1}`;
        }
    }

    /**
     * 获取添加控件的信息
     */
    protected getAddComponent() {
        if (GlobalUtil.isEmptyString(localStorage.__dnd_type) || GlobalUtil.isEmptyString(localStorage.__dnd_value)) return;
        if (localStorage.__dnd_type !== 'dragging_cs') return;

        return JSON.parse(localStorage.__dnd_value);
    }

    /**
     * 选择子控件
     */
    protected selectedCom = (e: any) => {
        const { id, selectComChange, fireSelectChildChange } = this.props;
        selectComChange(id);
        fireSelectChildChange(e, id);
        // e.stopPropagation();
    }

    /**
     *  控件在容器上方，容器背景颜色变化
     */
    protected handleOver = (e: any) => {
        const data: any = this.getAddComponent();
        if (data === undefined) return;
        if (!this.componentCanBeAdded(data.t)) return;
        this.setState({
            hover: { backgroundColor: '#007ACC' }
        });
        e.preventDefault();
    }

    /**
     *  控件离开容器范围，容器颜色消失
     */
    protected handleLeave = (e: any) => {
        this.setState({
            hover: {}
        });
        e.preventDefault();
    }

    /**
     *  drop 添加控件
     */
    protected handleDropAddComponent = (e: any) => {
        const data: any = this.getAddComponent();
        this.setState({
            hover: {}
        });
        // 校验是否能被添加
        if (!this.componentCanBeAdded(data.t)) {
            e.stopPropagation();

            return;
        }
        this.addChildComponent(this.props, data);
        e.stopPropagation();
    }

    /**
     *  校验控件是否可以被添加
     */
    protected componentCanBeAdded(t: string) {
        return true;
    }
}
