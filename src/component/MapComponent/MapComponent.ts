import * as React from 'react';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';
import { GlobalUtil } from '../util';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class MapComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {

    com: HTMLElement | null = null;
    rowList: any[] = [];
    public hasHandle: string[] = ['select'];
    componentDidMount() {
        if (this.com !== null) {
            // if(this.hasHandle){
            this.com.addEventListener('drop', this.handleDropAddComponent);
            this.com.addEventListener('keydown', this.deleteComponentsById);
            // }
            // this.com.addEventListener('mousedown', this.selectedCom);
            const currMaskLayer = document.getElementById(this.props.id);
            // console.log('id', this.props.id);
            if (currMaskLayer !== null) {
                currMaskLayer.style.width = `${this.com.offsetWidth}px`;
                currMaskLayer.style.height = `${this.com.offsetHeight}px`;
                currMaskLayer.style.top = `${this.com.offsetTop}px`;
                currMaskLayer.style.left = `${this.com.offsetLeft}px`;
            }
        }
    }
    componentWillUpdate() {
        if (this.com !== null) {
            const currMaskLayer = document.getElementById(this.props.id);
            // console.log('id', this.props.id);
            if (currMaskLayer !== null) {
                currMaskLayer.style.width = `${this.com.offsetWidth}px`;
                currMaskLayer.style.height = `${this.com.offsetHeight}px`;
                currMaskLayer.style.top = `${this.com.offsetTop}px`;
                currMaskLayer.style.left = `${this.com.offsetLeft}px`;
            }
        }
    }
    /**
     *  获取当前控件的refs
     */
    public findComponentRef = () => {
        return (GlobalUtil.isUndefined(this.com)) ? undefined : this.com;
    }
    // /**
    //  *  drop 添加控件
    //  */
    // public handleDropAddComponent = (e: any) => {
    //     const data: any = this.getAddComponent();
    //     this.setState({
    //         hover: {}
    //     });
    //     // 校验是否能被添加
    //     if (!this.componentCanBeAdded(data.t)) {
    //         e.stopPropagation();

    //         return;
    //     }
    //     GlobalUtil.debugLog(this.findComponentRef(), ' this.findComponentRef()');
    //     // 添加控件
    //     this.addChildComponent(this.props.id, { p: this.props.stateData }, data);
    //     e.stopPropagation();
    // }
    /**
     * 获取当前控件的ref对象
     */
    public getCurrRef = (currId: string) => {
        const refs: any = this.props.refs;
        const currRsf = this.loopRefs(currId, refs);

        return currRsf;
    }
    /**
     * 递归获取当前的ref对象
     */
    public loopRefs = (id: string, refs: any) => {
        let currRef = refs[`${id}`];
        if (currRef === undefined) {
            const refArr: any[] = [];
            // tslint:disable-next-line:forin
            for (const refId in refs) {
                refArr.push(refs[`${refId}`]);
            }
            refArr.forEach((ref: any) => {
                currRef = this.loopRefs(id, ref.refs);
            });
        }

        return currRef;
    }
    /**
     *  drop 添加控件
     */
    public handleDropAddComponent = (e: any) => {
        const data: any = this.getAddComponent();
        if (data === undefined) return;
        this.setState({
            hover: {}
        });

        // 获取refs（context中的）
        const id: string = this.props.id;
        const ids: string[] = id.split('.');
        let currId: string = `c.${id}`;
        let currRef: any;
        for (let i = ids.length - 1; i > 0; i--) {
            currRef = this.getCurrRef(currId);
            if (currRef !== undefined && currRef.componentCanBeAdded(data.t)) {
                currRef.addChildComponent(currRef.props.id, { p: this.props.stateData }, data);
                // e.stopPropagation();
                // 跳出循环
                break;
            }
            currId = currId.substring(0, currId.length - `.${ids[i]}`.length);
        }
        e.stopPropagation();
    }
    public initChildComponent = (id: string, data: any, addData: any): any => {
        let props: any = this.findComponentProps(data, id);
        props = this.prepareChildrenComponents(props);
        // 获取新id
        let childId: string = `${id}.cs1`;
        childId = this.newComponentsId(props.p.p.components, `${id}.cs`);
        props.p.p.components.push({
            t: addData.t,
            p: Object.assign({}, addData.p, { id: childId })
        });

        return {
            props,
            childId
        };
    }
    /**
     * 添加子控件
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        data = this.initChildComponent(id, data, addData).props;
        this.props.updateProps(id, { p: data.p.p });
    }
    /**
     * 当新增子控件，并且需要增加子控件的子控件时，需要用到
     */
    public getChildComponent = (currId: string, data: any, addData: any): any => {
        data = this.initChildComponent(currId, data, addData);
        const newItem = data.props.p.p.components.find((component: any) => component.p.id === data.childId);

        return newItem;
    }
    /**
     * 添加子控件
     */
    public updateChildComponent = (data: any, addData: any): any => {
        // 获取新id
        let childId: string = `${data.id}.cs1`;
        let currP: any = {
            components: []
        };
        if (data.p === undefined || data.p.components === undefined) {
            currP.components.push({
                t: addData.t,
                p: Object.assign({}, addData.props, { id: childId })
            });
        } else {
            childId = this.newComponentsId(data.p.components, `${data.id}.cs`);
            data.p.components.push({
                t: addData.t,
                p: Object.assign({}, addData.props, { id: childId })
            });
            currP = data.p;
        }

        return data;
    }
    /**
     * 初始化控件结构
     */
    public prepareChildrenComponents = (props: any): any => {
        if (GlobalUtil.isUndefined(props.p)) {
            props.p = {};
        }
        if (GlobalUtil.isUndefined(props.p.p)) {
            props.p.p = {};
        }
        if (GlobalUtil.isUndefined(props.p.p.components)) {
            props.p.p.components = [];
        }

        return props;
    }
    /**
     * 获取当前控件的props
     */
    public findComponentProps = (data: any, currId: string) => {
        const ids = currId.split('.');
        // 因为现在第一层是baseComponent
        // 所以所有控件id从第二层开始
        // 第二层开始
        let tmpId = `${ids[0]}.${ids[1]}`;
        let props: any = ``;
        props = data.p.components.find((p: any) => p.p.id === tmpId);
        if (ids.length < 3) return props;
        // tmpId = `${tmpId}.${ids[2]}`;
        if (GlobalUtil.isUndefined(props)) return;
        for (let idx = 2; idx < ids.length; idx++) {
            tmpId = `${tmpId}.${ids[idx]}`;
            if (props.p === undefined || props.p.p === undefined || props.p.p.components === undefined) return;
            props = props.p.p.components.find((p: any) => p.p.id === tmpId);
            if (GlobalUtil.isUndefined(props)) return;
        }

        return props;
    }
    /**
     * 删除控件
     */
    public deleteComponentsById = (): any => {
        const cid = this.props.selectedId;
        const state = this.props.stateData;
        if (GlobalUtil.isEmptyString(cid) || GlobalUtil.isUndefined(cid)) return;
        if (GlobalUtil.isEmptyString(state) || GlobalUtil.isUndefined(state)) return;

        const parent = this.findComponentParent(state, cid);
        if (!GlobalUtil.isUndefined(parent)) {
            const idx = parent.findIndex((com: any) => com.p.id === cid);
            if (idx >= 0) {
                parent.splice(idx, 1);
            }
        }
        const parentId = cid.substring(0, cid.lastIndexOf('.'));
        this.props.updateProps(parentId, { p: { components: parent } });

        return cid;
    }

    /**
     * 生成新控件Id
     */
    public newComponentsId(collection: any[] = [], prefix = 'cs', pid = '') {
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
    public getAddComponent() {
        if (GlobalUtil.isEmptyString(localStorage.__dnd_type) || GlobalUtil.isEmptyString(localStorage.__dnd_value)) return;
        if (localStorage.__dnd_type !== 'dragging_map') return;

        return JSON.parse(localStorage.__dnd_value);
    }

    /**
     * 选择子控件
     */
    public selectedCom = (e: any) => {
        // GlobalUtil.debugLog(this.props, 'props');
        const { id, selectComChange } = this.props;
        selectComChange(e, id);
    }

    /**
     *  控件在容器上方，容器背景颜色变化
     */
    public handleOver = (e: any) => {
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
    public handleLeave = (e: any) => {
        this.setState({
            hover: {}
        });
        e.preventDefault();
    }

    /**
     *  控件离开容器范围，容器颜色消失
     */
    public scrollHandle = (e: any) => {
        this.props.updateProps(this.props.id, { scroll: e.target.scrollLeft });
        e.preventDefault();
    }

    /**
     *  校验控件是否可以被添加
     */
    public componentCanBeAdded(t: string) {
        return false;
    }

    /**
     * 拖动处理
     */
    public onDragEnd = (result: any) => {
        if (result.type === 'field-row') {
            this.onDragEndBoard(result);
        }
        const { p, id } = this.props;
        // dropped outside the list
        if (!result.destination || result.destination.index < 0) {
            return;
        }
        const currComs: any = this.findComponentParent(p, id) === undefined ? p.components : this.findComponentParent(p, id);
        const components = this.reorder(
            currComs,
            result.source.index,
            result.destination.index
        );

        p.components = components;
        this.props.updateProps(id, { p });
    }

    /**
     * 字段拖拽处理
     */
    public onDragEndBoard = (result: any) => {
        if (this.rowList !== null) {
            const { source, destination } = result;
            const { p, id } = this.props;

            // dropped outside the list
            if (!destination) {
                return;
            }

            if (source.droppableId === destination.droppableId) {
                const components = this.reorder(
                    this.rowList[source.droppableId],
                    source.index,
                    result.destination.index
                );
                this.rowList[source.droppableId] = components;
            } else {
                const result_move: any = this.move(
                    this.rowList[source.droppableId],
                    this.rowList[destination.droppableId],
                    source,
                    destination
                );
                this.rowList[source.droppableId] = result_move[source.droppableId];
                this.rowList[destination.droppableId] = result_move[destination.droppableId];
            }
            p.components = this.getAllCom(this.rowList);
            this.props.updateProps(id, { p });

        }
    }
    public getAllCom = (dataList: any[]) => {
        let coms: any[] = [];
        dataList.forEach((data: any) => {
            coms = coms.concat(data);
        });

        return coms;
    }
    // TODO:这里是查找当前id对应的父级别数组(还没找完，明天继续)
    public findComponentParent = (p: any, id: string) => {
        const ids = id.split('.');
        if (ids.length === 1) {
            return p.components;
        }
        let tmpId = `${ids[0]}.${ids[1]}`;
        let parent = p.components;
        if (GlobalUtil.isUndefined(parent)) return;
        for (let idx = 2; idx < ids.length; idx++) {
            parent = parent.find((currP: any) => currP.p.id === tmpId);
            if (parent === undefined || parent.p === undefined || parent.p.p === undefined || parent.p.p.components === undefined) return;
            parent = parent.p.p.components;
            tmpId = `${tmpId}.${ids[idx]}`;
        }

        return parent;
    }
    public reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }
    public move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result: any = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    }
    /**
     * 拖动处理
     */
}
