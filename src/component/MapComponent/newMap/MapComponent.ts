import * as React from 'react';

import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';
import { IComponent } from './IComponent';

import { IPropertyGroup } from '../../UniversalComponents';
import { IPosition, IRichEditOption, IFont } from '../../BaseComponent';

import { OrderedSet } from 'immutable';
import { GlobalUtil } from '../../util';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class MapComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {

    com: HTMLElement | null = null;
    public editCom: HTMLElement | null = null;
    public defaultFont: IFont = {
        textAlign: 'left',
        fontColor: '#222',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        textDecoration: 'none'
    };
    componentDidMount() {
        if (this.com !== null) {
            // if(this.hasHandle){
            this.com.addEventListener('drop', this.handleDropAddComponent);
            this.com.addEventListener('keydown', this.deleteComponentsById);
            // this.com.addEventListener('mouseover', () => { alert(this.com); });
            // }
            // this.com.addEventListener('mousedown', this.selectedCom);
            const currMaskLayer = document.getElementById(this.props.id);
            // console.log('id', this.props.id);
            if (currMaskLayer !== null) {
                currMaskLayer.style.width = `${this.com.offsetWidth}px`;
                currMaskLayer.style.height = `${this.com.offsetHeight}px`;
            }
        }
    }
    componentWillUpdate(nextProps: any, nextState: any) {
        if (this.com !== null) {
            const currMaskLayer = document.getElementById(this.props.id);
            // console.log('id', this.props.id);
            if (currMaskLayer !== null) {
                currMaskLayer.style.width = `${this.com.offsetWidth}px`;
                currMaskLayer.style.height = `${this.com.offsetHeight}px`;
            }
        }
    }
    // shouldComponentUpdate(nextProps: any, nextState: any) {
    //     console.log('nextProps', nextProps);
    //     nextProps.refs = null;
    //     console.log('nextProps', JSON.stringify(nextProps));
    //     if (JSON.stringify(this.props) === JSON.stringify(nextProps) &&
    //         JSON.stringify(this.state) === JSON.stringify(nextState)) {
    //         return false;
    //     }

    //     return true;
    // }

    /************************************* begin 富文本 ****************************************/
    /**
     * 隐藏可编辑文本Dom
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        this.setState({
            hidden: isHidden
        });
    }

    /**
     * 获取文本编辑框位置
     */
    public getRichEditOption = (comPosition: IPosition): IRichEditOption => {
        const childCom: HTMLElement = (this.editCom as HTMLElement);

        const position: IPosition = {
            top: comPosition.top + childCom.offsetTop,
            left: comPosition.left + childCom.offsetLeft
        };
        const size: any = {
            width: undefined,
            height: childCom.offsetHeight
        };
        const font: IFont = this.defaultFont;

        return { position, size, font };
    }

    /**
     * 获取组件文本
     * 各组件自己重写
     */
    public getRichChildNode = (): any => {
        return '';
    }

    /**
     * 构建要设置的文本属性对象
     * 各组件自己重写
     */
    public buildRichChildNode = (value: any): any => {
        return {};
    }
    /************************************* end 富文本 ****************************************/

    /************************************* begin 属性设置 ****************************************/
    /**
     * 获取组件的属性，传给属性栏
     * 默认：空，组件自己重写
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        return OrderedSet();
    }

    /**
     * 获取属性工具条的单条属性，传给组件并设置组件
     * 默认：空，组件自己重写
     * @param pKey 属性
     * @param pValue 属性值
     * @param callback 回调函数
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any, callback?: () => void) => {
        return;
    }
    /************************************* end 属性设置 ****************************************/

    /************************************* bgn 操作子控件 ****************************************/
    /**
     * 当新增子控件，并且需要增加子控件的子控件时，需要用到
     */
    public getChildComponent = (currId: string, data: any, addData: any): any => {
        data = this.initChildComponent(currId, data, addData);
        const newItem = data.props.p.p.components.find((component: any) => component.p.id === data.childId);

        return newItem;
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
     * 添加子控件
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        data = this.initChildComponent(id, data, addData).props;
        this.props.updateProps(id, { p: data.p.p });
        this.setState({
            hover: {}
        });
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
     *  校验控件是否可以被添加
     */
    public componentCanBeAdded(t: string) {
        return false;
    }
    /**
     * 获取添加控件的信息
     */
    public getAddComponent() {
        if (GlobalUtil.isEmptyString((localStorage as any).__dnd_type) || GlobalUtil.isEmptyString((localStorage as any).__dnd_value)) return;
        if ((localStorage as any).__dnd_type !== 'dragging_map') return;

        return JSON.parse((localStorage as any).__dnd_value);
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
     * 获取Dom元素的尺寸和位置（相对于文档）
     */
    public getDomBounds = (dom: any) => {
        if (GlobalUtil.isUndefined(dom)) return undefined;
        const size = this.getDomSize(dom);
        const location = this.getDomLocation(dom);

        return Object.assign(size, location);
    }
    /**
     * 获取Dom元素的尺寸
     */
    public getDomSize = (dom: any) => {
        if (GlobalUtil.isUndefined(dom)) return undefined;

        return {
            width: dom.offsetWidth,
            height: dom.offsetHeight
        };
    }

    /**
     * 获取Dom元素的位置
     */
    public getDomLocation = (dom: any) => {
        if (GlobalUtil.isUndefined(dom)) return undefined;
        let offsetTop = dom.offsetTop;
        let offsetLeft = dom.offsetLeft;
        let offsetTopWithScroll = offsetTop;
        let offsetLeftWithScroll = offsetLeft;
        let offsetParent = dom.offsetParent;
        while (offsetParent !== null && offsetParent !== undefined) {
            offsetTop += offsetParent.offsetTop;
            offsetLeft += offsetParent.offsetLeft;
            offsetTopWithScroll += offsetParent.offsetTop - offsetParent.scrollTop;
            offsetLeftWithScroll += offsetParent.offsetLeft - offsetParent.scrollLeft;
            offsetParent = offsetParent.offsetParent;
        }

        return {
            top: offsetTop,
            left: offsetLeft,
            topWithScroll: offsetTopWithScroll,
            leftWithScroll: offsetLeftWithScroll,
            width: dom.offsetWidth,
            height: dom.offsetHeight,
            scrollWidth: dom.scrollWidth, // 有滚动条时的实际宽度
            scrollHeight: dom.scrollHeight  // 有滚动条时的实际高度
        };
    }
    /************************************* end 操作子控件 ****************************************/
    /************************************* bgn 操作基础控件 ****************************************/
    /**
     * 删除控件
     */
    public deleteComponentsById = (): any => {
        const cid: string = this.props.selectedId as string;
        const state = this.props.stateData;
        if (GlobalUtil.isEmptyString(cid) || GlobalUtil.isUndefined(cid)) return;
        if (GlobalUtil.isEmptyString(state) || GlobalUtil.isUndefined(state)) return;

        const parent = this.findComponentParent(state, cid as string);
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
     *  drop 添加控件
     */
    public handleDropAddComponent = (e: any) => {
        const data: any = this.getAddComponent();
        this.setState({
            hover: {}
        });
        if (data === undefined) {
            const { selectedId, stateData, dragChangeField } = this.props;
            // 判断是否是字段换位置
            const items = this.findComponentParent(stateData, selectedId as string);
            let targetIndex = -1;
            let appendTo = false;

            let currDomRef;
            let bds;
            const mousePosX = e.pageX;
            for (let idx = 0; idx < items.length; idx++) {
                currDomRef = this.getCurrRef(`c.${items[idx].p.id}`);
                bds = this.getDomBounds(currDomRef.com);
                if (bds !== undefined) {
                    // 判断是否移动到最前面
                    if (idx === 0 && mousePosX < bds.left) {
                        targetIndex = 0;
                        appendTo = false;
                        break;
                    }
                    // 判断是否移动到最后面
                    if (idx === items.length - 1 && mousePosX > (bds.left + (bds.width / 2))) {
                        targetIndex = items.length - 1;
                        appendTo = true;
                        break;
                    }
                    if (mousePosX >= bds.left && mousePosX <= bds.left + bds.width / 2) {
                        targetIndex = idx;
                        appendTo = false;
                        break;
                    } else if (mousePosX < bds.left + bds.width && mousePosX > bds.left + bds.width / 2) {
                        targetIndex = idx;
                        appendTo = true;
                        break;
                    }
                }
            }

            const currentIndex = items.findIndex((item: any) => item.p.id === selectedId);
            // let lastTargetIndex = items.findIndex((item: any) => item.p.id === e.target.id);
            if (targetIndex !== -1 && currentIndex !== targetIndex) {
                if (appendTo) targetIndex++;
                // if (lastTargetIndex === targetIndex) return;
                // lastTargetIndex = targetIndex;
                const item = items[currentIndex];
                items.splice(targetIndex, 0, item);
                items.splice(targetIndex < currentIndex ? (currentIndex + 1) : currentIndex, 1);
            }
            if (dragChangeField !== undefined) {
                dragChangeField(items);
            }
            e.stopPropagation();

            return;
        }

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
    /************************************* end 操作基础控件 ****************************************/
    /**
     * 选中子控件
     */
    protected selectedCom = (e: any) => {
        const { id, selectComChange } = this.props;
        selectComChange(e, id);
        e.stopPropagation();
    }
}
