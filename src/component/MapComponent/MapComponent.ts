import * as React from 'react';

import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';
import { IComponent } from './IComponent';

import { IPropertyGroup } from '../UniversalComponents';
import { IPosition, IRichEditOption, IFont } from '../BaseComponent';
import { addPluginConfig, PluginMap, getPluginConfig } from '../../plugin';

import { OrderedSet } from 'immutable';
import { GlobalUtil } from '../util';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class MapComponent<P extends IBaseProps, S extends IBaseState>
    extends React.Component<P, S> implements IComponent {

    public com: HTMLElement | null = null;
    public editCom: HTMLElement | null = null;
    public rowList: any[] = [];
    public defaultFont: IFont = {
        textAlign: 'left',
        fontColor: '#222',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        textDecoration: 'none'
    };

    componentDidMount() {
        if (this.com) {
            this.com.addEventListener('drop', this.handleDropAddComponent);

            const currMaskLayer = document.getElementById(this.props.id);
            if (currMaskLayer) {
                currMaskLayer.style.width = `${this.com.offsetWidth}px`;
                currMaskLayer.style.height = `${this.com.offsetHeight}px`;
            }
        }
    }

    componentWillUpdate(nextProps: any, nextState: any) {
        if (this.com) {
            const currMaskLayer = document.getElementById(this.props.id);
            if (currMaskLayer) {
                currMaskLayer.style.width = `${this.com.offsetWidth}px`;
                currMaskLayer.style.height = `${this.com.offsetHeight}px`;
            }
        }
    }

    componentWillUnmount() {
        if (this.com) {
            this.com.removeEventListener('drop', this.handleDropAddComponent);
        }
    }

    // shouldComponentUpdate(nextProps: any, nextState: any) {
    //     if (
    //         JSON.stringify(this.props) === JSON.stringify(nextProps) &&
    //         JSON.stringify(this.state) === JSON.stringify(nextState)
    //     ) {
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
        let offsetTop: number = childCom.offsetTop;
        let offsetLeft: number = childCom.offsetLeft;
        let offsetParent: Element | null = childCom.offsetParent;
        let scrollLeft: number = 0;
        while (offsetParent && offsetParent.className !== 'page-appgrid' && offsetParent.className !== 'page-newmap-appform') {
            // AppGrid滚动条
            if (offsetParent.className === 'map-grid-columns-view') {
                scrollLeft = offsetParent.scrollLeft;
            }
            offsetTop += (offsetParent as any).offsetTop;
            offsetLeft += (offsetParent as any).offsetLeft;
            offsetParent = (offsetParent as any).offsetParent;
        }

        const position: IPosition = {
            top: comPosition.top + offsetTop,
            left: comPosition.left + offsetLeft - scrollLeft
        };
        const size: any = {
            width: childCom.offsetWidth + 20,
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
            hover: { backgroundColor: 'rgba(24, 144, 255, 0.2)' }
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
        // if ((localStorage as any).__dnd_type !== 'dragging_map') return;

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
        if (!id) return false;

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
    // 和上面的方法相比，多了参数initId。当p为中间某一层时，从头开始去找，会找不到，提前返回null，所以添加initId，保证从p这一级开始查找
    public findComponentParentByInitId = (p: any, initId: string, id: string) => {
        const ids = id.split('.');
        const initIds = initId.split('.');
        if (ids.length === 1) {
            return p.components;
        }
        let tmpId = `${initId}.${ids[initIds.length]}`;
        let parent = p.components;
        if (GlobalUtil.isUndefined(parent)) return;
        for (let idx = initIds.length + 1; idx < ids.length; idx++) {
            parent = parent.find((currP: any) => currP.p.id === tmpId);
            if (parent === undefined || parent.p === undefined || parent.p.p === undefined || parent.p.p.components === undefined) return;
            parent = parent.p.p.components;
            tmpId = `${tmpId}.${ids[idx]}`;
        }

        return parent;
    }
    public getCurrRef = (currId: string) => {
        const refs: any = this.props.getRefs ? this.props.getRefs() : undefined;
        const currRsf = this.loopRefs(currId, refs);

        return currRsf;
    }
    /**
     * 递归获取当前的ref对象
     */
    public loopRefs = (id: string, refs: any) => {
        let currRef = refs[`${id}`];
        if (currRef === undefined) {
            // tslint:disable-next-line:forin
            for (const refId in refs) {
                currRef = this.loopRefs(id, refs[`${refId}`].refs);
                if (currRef !== undefined) {
                    break;
                }
            }
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
     * 选中父组件
     */
    public selectedComParent = (): boolean => {
        const cid: string = this.props.selectedId as string;
        const state = this.props.stateData;
        if (GlobalUtil.isEmptyString(cid) || GlobalUtil.isUndefined(cid)) {
            return false;
        }
        if (GlobalUtil.isEmptyString(state) || GlobalUtil.isUndefined(state)) return false;
        const parentId = cid.substring(0, cid.lastIndexOf('.'));
        const { selectComChange } = this.props;
        selectComChange(undefined, parentId);

        return true;
    }
    /**
     * 复制控件
     */
    public copySelectedCom = (fromFun: any): boolean => {
        const cid: string = this.props.selectedId as string;
        const state = this.props.stateData;
        if (GlobalUtil.isEmptyString(cid) || GlobalUtil.isUndefined(cid)) {
            return false;
        }
        if (GlobalUtil.isEmptyString(state) || GlobalUtil.isUndefined(state)) return false;
        const parentId = cid.substring(0, cid.lastIndexOf('.'));
        const parent = this.findComponentParent(state, cid as string);
        const newId = this.newComponentsId(parent, `${parentId}.cs`);
        if (!GlobalUtil.isUndefined(parent)) {
            const selectedCom = parent.find((com: any) => com.p.id === cid);
            if (selectedCom) {
                // console.log('selectedCom', selectedCom);
                // 复制选中控件的结构,并重置结构中所有id
                // tslint:disable-next-line:no-eval
                const newCom = JSON.parse(JSON.stringify(selectedCom).replace(eval(`/\"${selectedCom.p.id}/g`), `"${newId}`));
                if ( fromFun === 'isClick' ) {
                    parent.push(newCom);
                    this.props.updateProps(parentId, { p: { components: parent } });
                    const { selectComChange } = this.props;
                    selectComChange(undefined, newId);
                }
                if (fromFun === 'isKeyCode') {
                    const detail = {
                        type: 'ChildComponent',
                        content: [parent, parentId, selectedCom, newId]
                    };
                    addPluginConfig(PluginMap.COPY_TO_CLIPBOARD, {
                        text: JSON.stringify(detail)
                    });
                }
            }
        }

        return true;
    }

    public parseSelectedCom = (): boolean => {
        const pasteComponent = getPluginConfig(PluginMap.COPY_TO_CLIPBOARD);
        if (pasteComponent && pasteComponent.text) {
            const detail = JSON.parse(pasteComponent.text);
            const content = detail.content;
            const newId = this.newComponentsId(content[0], `${content[1]}.cs`);
            // tslint:disable-next-line:no-eval
            const newCom = JSON.parse(JSON.stringify(content[0][content[0].length - 1]).replace(eval(`/\"${content[0][content[0].length - 1].p.id}/g`), `"${newId}`));
            content[0].push(newCom);
            this.props.updateProps(content[1], { p: { components: content[0] } });
            const { selectComChange } = this.props;
            selectComChange(undefined, newId);

            const newDetail = {
                type: 'ChildComponent',
                content: [content[0], content[1], content[0][content[0].length - 1], newId]
            };
            addPluginConfig(PluginMap.COPY_TO_CLIPBOARD, {
                text: JSON.stringify(newDetail)
            });

            return true;

        }

        return false;
    }

    /**
     * 删除控件
     */
    public deleteComponentsById = (): boolean => {
        const cid: string = this.props.selectedId as string;
        const state = this.props.stateData;
        if (GlobalUtil.isEmptyString(cid) || GlobalUtil.isUndefined(cid)) {
            return false;
        }
        if (GlobalUtil.isEmptyString(state) || GlobalUtil.isUndefined(state)) return false;

        const parent = this.findComponentParent(state, cid as string);
        if (!GlobalUtil.isUndefined(parent)) {
            const idx = parent.findIndex((com: any) => com.p.id === cid);
            if (idx >= 0) {
                parent.splice(idx, 1);
            }
        }
        const parentId = cid.substring(0, cid.lastIndexOf('.'));
        this.props.updateProps(parentId, { p: { components: parent } });

        return true;
    }

    /**
     *  drop 添加控件
     */
    public handleDropAddComponent = (e: any) => {
        const data: any = this.getAddComponent();
        const { selectedId, stateData, dragChangeField, id } = this.props;
        if (data === undefined) {
            // 判断是否是字段换位置
            const items = this.findComponentParent(stateData, selectedId as string);
            let targetIndex = -1;
            let appendTo = false;

            let currDomRef;
            let bds;
            const mousePosX = e.pageX;
            const mousePosY = e.pageY;
            for (let idx = 0; idx < items.length; idx++) {
                currDomRef = this.getCurrRef(`c.${items[idx].p.id}`);
                // 重置当前控件的hover
                currDomRef.setState({
                    hover: {}
                });
                bds = this.getDomBounds(currDomRef.com);
                if (bds !== undefined) {
                    // 判断是否移动到最前面
                    if (idx === 0 && mousePosX < bds.leftWithScroll && mousePosY < bds.topWithScroll) {
                        targetIndex = 0;
                        appendTo = false;
                        break;
                    }
                    // 判断是否移动到最后面
                    if (idx === items.length - 1 && mousePosX > (bds.leftWithScroll + (bds.width / 2)) && mousePosY > (bds.topWithScroll + (bds.height / 2))) {
                        targetIndex = items.length - 1;
                        appendTo = true;
                        break;
                    }
                    if ((mousePosX >= bds.leftWithScroll && mousePosX <= bds.leftWithScroll + bds.width / 2) && (mousePosY > bds.topWithScroll && mousePosY < bds.topWithScroll + bds.height)) {
                        targetIndex = idx;
                        appendTo = false;
                        break;
                    } else if ((mousePosX < bds.leftWithScroll + bds.width && mousePosX > bds.leftWithScroll + bds.width / 2) && (mousePosY > bds.topWithScroll && mousePosY < bds.topWithScroll + bds.height)) {
                        targetIndex = idx;
                        appendTo = true;
                        break;
                    }
                }
            }
            // 如果字段不在同一分组中，则直接跳过
            if (selectedId && selectedId.substring(0, selectedId.lastIndexOf('.')) !== id.substring(0, id.lastIndexOf('.'))) {
                return;
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
        const ids: string[] = id.split('.');
        let currId: string = `c.${id}`;
        let currRef: any;
        for (let i = ids.length - 1; i > 0; i--) {
            currRef = this.getCurrRef(currId);
            if (currRef !== undefined && currRef.componentCanBeAdded(data.t)) {
                currRef.addChildComponent(currRef.props.id, { p: this.props.stateData }, data);
                currRef.setState({
                    hover: {}
                });
                // e.stopPropagation();
                // 跳出循环
                break;
            }
            currId = currId.substring(0, currId.length - `.${ids[i]}`.length);
        }
        // 清空 localStorage
        localStorage.setItem('__dnd_type', '');
        e.stopPropagation();
    }
    /************************************* end 操作基础控件 ****************************************/
    /*********************************************拖拽 bgn*********************************************/

    /**
     * 拖动处理
     */
    public onDragEnd = (result: any) => {
        if (result.type === 'field-row') {
            this.onDragEndBoard(result);
        }
        // 如果两边droppableId不一样，则跳过
        if (result.source && result.destination
            && (result.destination.droppableId !== result.source.droppableId    // 如果目标和操作项不在同一 drag组内
                || (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index))) { // 如果在同一组内，但是没有位置改变
            return;
        }
        const { p, id } = this.props;
        // dropped outside the list
        if ((!result.destination || result.destination.index < 0)) {
            return;
        }
        const currComs: any = this.findComponentParentByInitId(p, id, result.draggableId) === undefined ? p.components : this.findComponentParentByInitId(p, id, result.draggableId);
        const components = this.reorder(
            currComs,
            result.source.index,
            result.destination.index
        );

        const parentId = result.draggableId.substring(0, result.draggableId.lastIndexOf('.'));
        p.components = components;
        this.props.updateProps(parentId, { p });
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
     * 控件在容器上方，容器背景颜色变化
     */
    public handleFieldOver = (e: any) => {
        const data: any = this.getAddComponent();
        if (data !== undefined) return;
        this.setState({
            hover: { backgroundColor: 'rgba(24, 144, 255, 0.2)' }
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
     * 拖动处理
     */
    /*********************************************拖拽 end*************************************************/
    /**
     * 选中子控件
     */
    protected selectedCom = (e: any) => {
        const { id, selectComChange } = this.props;
        selectComChange(e, id);
        e.stopPropagation();
    }
}
