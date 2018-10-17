import * as React from 'react';

import {
    BaseComponent,
    IBaseProps,
    IBaseState,
    BaseStyle,
    EditType,
    IRichEditOption,
    IPosition,
    ISize,
    IFont
} from '../../../../BaseComponent';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../../../../UniversalComponents';

import { IComponent } from '../../IComponent';
import { AppGridContainerState, IAppGridContainerState as ICustomState } from './AppGridContainerState';
import { IComData } from '../../model/types';
import { gridDetail } from '../../structure';

import { AppProjectTree } from '../AppProjectTree';
import { AppFindOrdinary } from '../AppFindOrdinary';
import { AppFindAdvanced } from '../AppFindAdvanced';
import { AppGridView } from '../AppGridView';
import { AppGridTitle } from '../AppGridTitle';
import { AppGridMenu } from '../AppGridMenu';
import { AppGrid } from '../AppGrid';

import { Map, List, OrderedSet } from 'immutable';
// tslint:disable-next-line:no-var-requires
const clone = require('clone');

import '../../sass/AppGrid.scss';
import { HandleChildCom } from '../../../types';

/* tslint:disable:no-empty-interface jsx-no-string-ref jsx-no-multiline-js jsx-no-lambda */
export interface IAppGridContainerProps extends IBaseProps {
}

export interface IAppGridContainerState extends IBaseState {
    unfoldAdv: boolean;         // 展开筛选
    selectedId: string | null;  // 当前选中的子控件id
    hidden: boolean;
}

export default class AppGridContainer extends BaseComponent<IAppGridContainerProps, IAppGridContainerState> {

    private appProjectTree: JSX.Element | null = null;
    private appFindOrdinary: JSX.Element | null = null;
    private appFindAdvanced: JSX.Element | null = null;
    private appGridView: JSX.Element | null = null;
    private appGridTitle: JSX.Element | null = null;
    private appGridMenu: JSX.Element | null = null;
    private appGrid: JSX.Element | null = null;
    // private appGridPage: JSX.Element | null = null;
    // private modalMenu: JSX.Element | null = null;

    private _padding: number = 8;
    private _isCanMove: boolean = false;
    private _childPropertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

    constructor(props: IAppGridContainerProps, context?: any) {
        super(props, context);

        const { childData } = this.props;
        let structureData: any = null;
        if (childData === undefined) {
            structureData = JSON.parse(
                JSON.stringify(clone(gridDetail.p)).replace(/\[cid\]/g, this.props.baseState.getCurrentContent().getCid())
            );
        }
        this.state = {
            baseState: this.initBaseStateWithCustomState(new AppGridContainerState({ childData: structureData })),
            unfoldAdv: true,
            selectedId: null,
            hidden: false
        };
    }

    /**
     * BaseComponent方法：组件是否可以移动
     * 组件自己重写
     */
    public isCanMove = () => {
        return this._isCanMove;
    }

    /************************************* begin 富文本 ****************************************/
    /**
     * 调用富文本编辑器
     */
    public getRichEditType = (): EditType => {
        return 'Text';
    }

    /**
     * 隐藏文本展示Div
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        const { selectedId } = this.state;
        if (selectedId) {
            // 选中子组件
            const childCom: IComponent | null = this.getChildComponent(selectedId);
            if (childCom) {
                childCom.hiddenEditorDom(isHidden);
            }
        } else {
            this.setState({
                hidden: isHidden
            });
        }
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const { selectedId } = this.state;
        if (selectedId) {
            // 选中子组件
            const childCom: IComponent | null = this.getChildComponent(selectedId);
            if (childCom) {
                return childCom.getRichEditOption(this.getPosition());
            } else {
                return {
                    position: { top: -10000, left: -10000 },
                    size: { width: 0, height: 0 },
                    font: {
                        textAlign: 'center',
                        fontColor: 'rgba(0, 0, 0, 0.65)',
                        fontStyle: 'normal',
                        fontSize: 14,
                        fontWeight: 'normal',
                        textDecoration: 'none'
                    }
                };
            }
        } else {
            const comPosition: IPosition = this.getPosition();
            const comSize: ISize = this.getSize();

            const position: IPosition = {
                top: comPosition.top + 7,
                left: comPosition.left + this._padding
            };
            const size: ISize = {
                width: comSize.width - this._padding,
                height: 16
            };
            const font: IFont = {
                textAlign: 'left',
                fontColor: 'rgba(0, 0, 0, 0.65)',
                fontStyle: 'normal',
                fontSize: 14,
                fontWeight: 'normal',
                textDecoration: 'none'
            };

            return { position, size, font };
        }
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        const { selectedId } = this.state;
        if (selectedId) {
            // 选中子组件
            const childCom: IComponent | null = this.getChildComponent(selectedId);
            if (childCom) {
                return childCom.getRichChildNode();
            } else {
                return '';
            }
        } else {
            return this.getCustomState().getTitle();
        }
    }

    /**
     * 设置组件文本内容
     */
    public setRichChildNode = (param: any): void => {
        const { selectedId } = this.state;
        if (selectedId) {
            // 选中子组件
            const childCom: IComponent | null = this.getChildComponent(selectedId);
            if (childCom) {
                const obj: any = childCom.buildRichChildNode(param.value);
                this.updateProps(selectedId, obj);
            }
        } else {
            const config = {
                title: param.value
            };
            const newAppGridContainerState: AppGridContainerState = AppGridContainerState.set(this.getCustomState(), Map(config));

            this.setCustomState(newAppGridContainerState);
        }
    }

    /**
     * 操作子控件
     */
    public handleChildCom = (handle: string): boolean => {
        const { selectedId } = this.state;
        if (!selectedId) return false;
        const childCom: any = this.getChildComponent(selectedId);
        if (!childCom) return false;

        let result: boolean = false;
        switch (handle) {
            case HandleChildCom.DELETE:         // 删除
                result = childCom.deleteComponentsById();
                break;
            case HandleChildCom.SELECT_PARENT:  // 选中父组件
                result = childCom.selectedComParent();
                break;
            case HandleChildCom.COPY_COM:       // 复制控件
                result = childCom.copySelectedCom();
                break;
        }

        return result;
    }
    /************************************* end 富文本 ****************************************/

    /************************************* begin 属性设置 ****************************************/
    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        if (this._childPropertyGroup.size > 0) {
            // 选中子组件，显示子组件的属性栏
            return this._childPropertyGroup;
        } else {
            const appGridContainerState: AppGridContainerState = this.getCustomState();
            let propertyList: List<IProperty> = List();
            let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

            // 列表属性
            propertyList = propertyList.push(
                { pTitle: '标题', pKey: 'title', pValue: appGridContainerState.getTitle(), pType: PropertiesEnum.INPUT_TEXT },
                // { pTitle: '主题', pKey: 'theme', pValue: appGridContainerState.getTheme(), pType: PropertiesEnum.INPUT_TEXT },
                { pTitle: '显示项目控件', pKey: 'showAppProjectTree', pValue: appGridContainerState.getShowAppProjectTree(), pType: PropertiesEnum.SWITCH },
                { pTitle: '显示普通查询', pKey: 'showAppFindOrdinary', pValue: appGridContainerState.getShowAppFindOrdinary(), pType: PropertiesEnum.SWITCH },
                { pTitle: '显示高级搜索', pKey: 'showAppFindAdvanced', pValue: appGridContainerState.getShowAppFindAdvanced(), pType: PropertiesEnum.SWITCH },
                { pTitle: '显示视图', pKey: 'showAppGridView', pValue: appGridContainerState.getShowAppGridView(), pType: PropertiesEnum.SWITCH },
                { pTitle: '显示标题', pKey: 'showAppGridTitle', pValue: appGridContainerState.getShowAppGridTitle(), pType: PropertiesEnum.SWITCH },
                { pTitle: '显示表头', pKey: 'showAppGridMenu', pValue: appGridContainerState.getShowAppGridMenu(), pType: PropertiesEnum.SWITCH },
                { pTitle: '显示分页', pKey: 'showAppGridPage', pValue: appGridContainerState.getShowAppGridPage(), pType: PropertiesEnum.SWITCH },
                { pTitle: '显示对话框按钮', pKey: 'showModalMenu', pValue: appGridContainerState.getShowModalMenu(), pType: PropertiesEnum.SWITCH }
            );
            propertyGroup = propertyGroup.add(
                { groupTitle: '列表属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
            );
            propertyList = List();

            return propertyGroup;
        }
    }

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any, callback?: () => void) => {
        const { selectedId } = this.state;
        if (selectedId) {
            // 选中子组件
            const childCom: IComponent | null = this.getChildComponent(selectedId);
            if (childCom) {
                const obj: any = {};
                obj[pKey] = pValue;
                this.updateProps(selectedId, obj);
            }
        } else {
            let properties = Map();
            properties = properties.set(pKey, pValue);
            const newAppGridContainerState: AppGridContainerState = AppGridContainerState.set(this.getCustomState(), properties);

            this.setCustomState(newAppGridContainerState, true, callback);
        }
    }
    /************************************* end 属性设置 ****************************************/

    render() {
        const { hidden, unfoldAdv } = this.state;
        const appGridContainerState: AppGridContainerState = this.getCustomState();

        const childData = appGridContainerState.getChildData() && appGridContainerState.getChildData().toJS ? appGridContainerState.getChildData().toJS() : appGridContainerState.getChildData();
        if (childData && childData.components && childData.components.length > 0) {
            this.initCom(childData.components, clone(childData));
        }

        return (
            <div
                className="page-appgrid"
                style={{
                    ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), true, this.isCanSelected()),
                    border: '1px solid #d3d5d9',
                    backgroundColor: '#FFF'
                }}
                onMouseDown={this.fireSelectChange}
            >
                {/* 列表组件标题 */}
                <div
                    className="map-title"
                    onMouseDown={this.onTitleMouseDown}
                    onMouseUp={this.onTitleMouseUp}
                    onDoubleClick={this.doDbClickToEdit}
                >
                    {hidden ? '' : appGridContainerState.getTitle()}
                </div>
                <div className="map-grid">
                    <div className="listheader-search">
                        {/* 项目 */}
                        {
                            appGridContainerState.getShowAppProjectTree() ? this.appProjectTree : ''
                        }

                        {/* 普通查询 */}
                        {
                            appGridContainerState.getShowAppFindOrdinary() ? this.appFindOrdinary : ''
                        }

                        {/* 高级搜索展开按钮 */}
                        {
                            appGridContainerState.getShowAppFindAdvanced() ?
                                <a className="btn-adv-search" style={{ display: 'inline' }} onClick={this.changeUnfoldAdv}>{unfoldAdv ? '收起筛选' : '展开筛选'}</a> : ''
                        }
                    </div>

                    {/* 高级搜索 */}
                    {
                        appGridContainerState.getShowAppFindAdvanced() && unfoldAdv ?
                            <div className="map-appfilter" style={{ borderWidth: '0px' }}>
                                {this.appFindAdvanced}
                            </div> : ''
                    }

                    {/* 视图 + Title + Menu */}
                    {
                        appGridContainerState.getShowAppGridView() || appGridContainerState.getShowAppGridTitle() || appGridContainerState.getShowAppGridMenu() ?
                            <div className="listheader">
                                <div className="mc-listheader">
                                    {/* 视图 */}
                                    {
                                        appGridContainerState.getShowAppGridView() ? this.appGridView : ''
                                    }
                                    {/* Title */}
                                    {
                                        appGridContainerState.getShowAppGridTitle() ? this.appGridTitle : ''
                                    }
                                    {/* Menu */}
                                    {
                                        appGridContainerState.getShowAppGridMenu() ? this.appGridMenu : ''
                                    }
                                </div>
                            </div> : ''
                    }

                    {/* AppGrid */}
                    {
                        this.appGrid
                    }

                </div>
            </div>
        );
    }

    /**
     * 加载子组件
     */
    private initCom = (components: IComData[], childData: any) => {
        const { selectedId } = this.state;
        const { pageMode } = this.props;
        const appGridContainerState: AppGridContainerState = this.getCustomState();

        components.map(
            (component: IComData) => {
                const id: string = component.p.id;

                switch (component.t) {
                    case 'MapComponent/newMap/grid/AppProjectTree':
                        this.appProjectTree = (
                            <AppProjectTree
                                ref={`c.${id}`}
                                theme={appGridContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                getRefs={this.getRefs}
                                stateData={childData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppFindOrdinary':
                        const showSearch = appGridContainerState.getShowAppFindAdvanced() === false ? true : !this.state.unfoldAdv;
                        this.appFindOrdinary = (
                            <AppFindOrdinary
                                ref={`c.${id}`}
                                theme={appGridContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                getRefs={this.getRefs}
                                stateData={childData}
                                {...component.p}
                                map_fo_search={showSearch}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppFindAdvanced':
                        this.appFindAdvanced = (
                            <AppFindAdvanced
                                ref={`c.${id}`}
                                theme={appGridContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                getRefs={this.getRefs}
                                stateData={childData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppGridView':
                        this.appGridView = (
                            <AppGridView
                                ref={`c.${id}`}
                                theme={appGridContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                getRefs={this.getRefs}
                                stateData={childData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppGridTitle':
                        this.appGridTitle = (
                            <AppGridTitle
                                ref={`c.${id}`}
                                theme={appGridContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                getRefs={this.getRefs}
                                stateData={childData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppGridMenu':
                        this.appGridMenu = (
                            <AppGridMenu
                                ref={`c.${id}`}
                                theme={appGridContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                getRefs={this.getRefs}
                                stateData={childData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppGrid':
                        this.appGrid = (
                            <AppGrid
                                ref={`c.${id}`}
                                theme={appGridContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                getRefs={this.getRefs}
                                stateData={childData}
                                {...component.p}
                            />
                        );
                        break;
                }
            }
        );
    }

    /**
     * 根据子组件id获取子组件对象
     */
    private getChildComponent = (cid: string | null): IComponent | null => {
        if (!cid) {
            return null;
        }

        const idList: string[] = cid.split('.');
        let currRefs: any = this.refs;
        let currCid: string = 'c.' + idList[0];

        let ref: any = null;
        for (let i = 1; i < idList.length; i++) {
            currCid += '.' + idList[i];
            ref = currRefs[`${currCid}`] as any;
            if (ref === undefined) {
                return null;
            }
            currRefs = currRefs[`${currCid}`].refs as any;
        }

        return (ref as IComponent) || null;
    }

    /**
     * 更新子组件
     * @param id 子组件id
     * @param props 需要更新的属性集合
     */
    private updateProps = (id: string, props: any) => {
        const appGridContainerState: AppGridContainerState = this.getCustomState();
        // 获取当前数据
        const childData = appGridContainerState.getChildData().toJS ? appGridContainerState.getChildData().toJS() : appGridContainerState.getChildData();
        // 通过id查找到数据节点
        const newData = this.updateComProps(clone(childData), id, props);
        // 更新数据到CustomState
        this.setCustomState(AppGridContainerState.set(appGridContainerState, { childData: newData }));
    }

    /**
     * 更新子组件属性
     * @param data childData数据
     * @param id 子组件id
     * @param props 需要更新的属性集合
     */
    private updateComProps = (data: any, id: string, props: any) => {
        let newData: any = data;
        data.components.forEach((com: any) => {
            if (com.p.id === id) {
                com.p = Object.assign({}, com.p, props);
                newData = data;

                return newData;
            }
            // 如果存在子控件，则
            if (com.p.p !== undefined && com.p.p.components !== undefined) {
                this.updateComProps(com.p.p, id, props);
            }
        });

        return newData;
    }

    /**
     * 设置组件是否可以移动
     */
    private setIsCanMove = (isCanMove: boolean): void => {
        this._isCanMove = isCanMove;
    }

    /**
     * map控件选中
     * @param id 组件id
     */
    private selectComChange = (e: any, id: string | null) => {
        const childCom: IComponent | null = this.getChildComponent(id);
        if (childCom) {
            this.setChildPropertyGroup(childCom.getPropertiesToProperty());
        } else {
            this.setChildPropertyGroup(OrderedSet());
        }

        this.setState({
            selectedId: id
        });
        // 调用container的选中
        this.fireSelectChange(e);
    }

    /**
     * 设置子组件属性列表
     */
    private setChildPropertyGroup = (childPropertyGroup: OrderedSet<IPropertyGroup>) => {
        this._childPropertyGroup = childPropertyGroup;
    }

    /**
     * 子组件双击修改
     */
    private doChildDbClickToEdit = (e: any) => {
        this.doDbClickToEdit(e);
    }

    /**
     * 标题MouseDown
     */
    private onTitleMouseDown = (e: any) => {
        this.selectComChange(e, null);
        this.setIsCanMove(true);
    }

    /**
     * 标题MouseUp
     */
    private onTitleMouseUp = (e: any) => {
        this.setIsCanMove(false);
    }

    /**
     * 展开筛选\收起筛选
     */
    private changeUnfoldAdv = () => {
        this.setState({
            unfoldAdv: !this.state.unfoldAdv
        });
    }

    /**
     * 获取refs
     */
    private getRefs = () => {
        return this.refs;
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ICustomState
 */
export function convertFromDataToCustomState(
    customData: ICustomState
): any {
    return new AppGridContainerState(customData);
}
