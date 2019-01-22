import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../../../../BaseComponent';
import { AppView, ProjectDDTree, AppFind, AppGridMenu, AppGrid } from '../index';
import { MapProvider } from '../../MapProvider';
import { gridDetail } from '../../structureDemo';
import { AppGridContainerState } from './AppGridContainerState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../../../../UniversalComponents';
import { IComponent } from '../../../IComponent';
import { Map, List, OrderedSet } from 'immutable';
import { HandleChildCom } from '../../../types';
// tslint:disable-next-line:no-var-requires
const clone = require('clone');

import '../../sass/Map.scss';
import '../../sass/Field.scss';

/* tslint:disable:no-empty-interface jsx-no-string-ref jsx-no-multiline-js jsx-no-lambda */
export interface IAppGridContainerProps extends IBaseProps {
}

export interface IAppGridContainerState extends IBaseState {
    selectedId?: string | null;  // 先...只能单选，后面看情况在调整
    title?: string;
    refs?: any;
}
export default class AppGridContainer extends BaseComponent<IAppGridContainerProps, IAppGridContainerState> {
    public com: HTMLElement | null = null;
    private proj: any = '';
    private view: any = '';
    private find: any = '';
    private menu: any = '';
    private grid: any = '';
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
            refs: this.refs
        };
    }

    componentDidUpdate() {
        this.setState({
            refs: this.refs
        });
    }
    public isCanMove = () => {
        return this._isCanMove;
    }

    public setIsCanMove = (isCanMove: boolean): void => {
        this._isCanMove = isCanMove;
    }

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
                { pTitle: '标题', pKey: 'title', pValue: appGridContainerState.getTitle(), pType: PropertiesEnum.INPUT_TEXT }
            );
            propertyGroup = propertyGroup.add(
                { groupTitle: '列表属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
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

    public render() {
        const { pageMode } = this.props;
        const appGridContainerState: AppGridContainerState = this.getCustomState();

        const childData = appGridContainerState.getChildData() && appGridContainerState.getChildData().toJS ? appGridContainerState.getChildData().toJS() : appGridContainerState.getChildData();
        if (childData && childData.components && childData.components.length > 0) {
            this.initCom(childData.components, clone(childData));
        }

        // 汇总style
        const currStyle = Object.assign(
            BaseStyle(
                this.getPositionState(),
                this.getSizeState(),
                this.getHierarchy()
            ),
            {
                overflow: 'auto'
            }
        );

        return (
            <MapProvider
                map_sm={appGridContainerState.getTheme()}
                updateProps={this.updateProps}
                selectComChange={this.selectComChange}
                pageMode={pageMode}
                stateData={childData}
                refs={this.refs}
            >
                <div
                    className="ps-map"
                    style={currStyle}
                    ref={(ref) => this.com = ref}
                    onMouseDown={this.fireSelectChange}
                >
                    <div
                        className="ps-map-title"
                        onMouseDown={this.ontitleMouseDown}
                        onMouseUp={this.ontitleMouseUp}
                    >
                        {appGridContainerState.getTitle()}
                    </div>
                    <div
                        className="grid-form"
                    >
                        <div className="grid-top" style={{ display: !appGridContainerState.showProj() && !appGridContainerState.showView() ? 'none' : '' }} >
                            <div className={`grid-top`}>
                                <div style={{ display: !appGridContainerState.showProj() ? 'none' : '' }}>
                                    {this.proj}
                                </div>
                                <div style={{ display: !appGridContainerState.showView() ? 'none' : '' }}>
                                    {this.view}
                                </div>
                            </div>
                        </div>
                        <div className="grid-find" style={{ display: !appGridContainerState.showAppFind() ? 'none' : '' }} >
                            {this.find}
                        </div>
                        <div className="grid-menu" style={{ display: !appGridContainerState.showAppGridMenu() ? 'none' : '' }} >
                            {this.menu}
                        </div>
                        <div className="grid-table" style={{ display: !appGridContainerState.showAppGrid() ? 'none' : '' }} >
                            {this.grid}
                        </div>
                    </div>
                </div>
            </MapProvider>
        );
    }

    // 初始化加载控件
    public initCom = (components: any[], childData: any []) => {
        const { selectedId } = this.state;
        components.forEach((com: any) => {
            switch (com.t) {
                case 'MapComponent/map/grid/ProjectDDTree':
                    this.proj = (
                        <ProjectDDTree
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                            getRefs={this.getRefs}
                            stateData={childData}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppView':
                    this.view = (
                        <AppView
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                            getRefs={this.getRefs}
                            stateData={childData}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppFind':
                    this.find = (
                        <AppFind
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            w={this.getSizeState().getWidth()}
                            updateProps={this.updateProps}
                            getRefs={this.getRefs}
                            stateData={childData}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppGridMenu':
                    this.menu = (
                        <AppGridMenu
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                            getRefs={this.getRefs}
                            stateData={childData}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppGrid':
                    this.grid = (
                        <AppGrid
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            w={this.getSizeState().getWidth()}
                            updateProps={this.updateProps}
                            getRefs={this.getRefs}
                            stateData={childData}
                        />
                    );
                    break;
            }
        });
    }

    /**
     * 操作子控件
     */
    public handleChildCom = (handle: string, fromFun?: string): boolean => {
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
            case HandleChildCom.COPY_COM:       // 复制粘贴控件
                result = childCom.copySelectedCom(fromFun);
                break;
            case HandleChildCom.PASTE_COM:       // 粘贴控件
                result = childCom.parseSelectedCom();
                break;
        }

        return result;
    }

    // 更新控件
    private updateProps = (id: string, props: any) => {
        const appGridContainerState: AppGridContainerState = this.getCustomState();
        // 获取当前数据
        const childData = appGridContainerState.getChildData().toJS ? appGridContainerState.getChildData().toJS() : appGridContainerState.getChildData();
        // 通过id查找到数据节点
        const newData = this.updateComProps(clone(childData), id, props);
        // 更新数据到CustomState
        this.setCustomState(AppGridContainerState.set(appGridContainerState, { childData: newData }));
    }

    // 更新控件属性
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
            if (currRefs[`${currCid}`] !== undefined && Object.keys(currRefs[`${currCid}`].refs).length > 0) {
                // 正常情况下一级只有一个，
                // 如果存在多个，则直接进入下一次循环
                currRefs = currRefs[`${currCid}`].refs as any;
            }
        }

        return (ref as IComponent) || null;
    }

    /**
     * 设置子组件属性列表
     */
    private setChildPropertyGroup = (childPropertyGroup: OrderedSet<IPropertyGroup>) => {
        this._childPropertyGroup = childPropertyGroup;
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
     * 获取refs
     */
    private getRefs = () => {
        return this.refs;
    }

    /**
     * title组件鼠标控制画布是否可移动
     */
    private ontitleMouseDown = (e: any): void => {
        this.selectComChange(e, null);
        this.setIsCanMove(true);
    }

    private ontitleMouseUp = (): void => {
        this.setIsCanMove(false);
    }
}
