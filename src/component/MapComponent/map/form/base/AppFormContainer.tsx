import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../../../../BaseComponent';
import { AppFormMenu, AppForm } from '../..//form/index';
import { MapProvider } from '../../MapProvider';
import { formDetail } from '../../structureDemo';
import { AppFormContainerState } from './AppFormContainerState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../../../../UniversalComponents';
import { IComponent } from '../../../IComponent';
import { Map, List, OrderedSet } from 'immutable';
import { HandleChildCom } from '../../../types';
import '../../sass/AppForm.scss';
import '../../sass/Field.scss';

// tslint:disable-next-line:no-var-requires
const clone = require('clone');

// tslint:disable-next-line:no-empty-interface
export interface IAppFormContainerProps extends IBaseProps {
}

export interface IAppFormContainerState extends IBaseState {
    selectedId?: string | null;  // 先...只能单选，后面看情况在调整
    title?: string;
    refs?: any;
}

export default class AppFormContainer extends BaseComponent<IAppFormContainerProps, IAppFormContainerState> {
    public com: HTMLElement | null = null;
    private menu: any = '';
    private form: any = '';
    private _isCanMove: boolean = false;
    private _childPropertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

    constructor(props: IAppFormContainerProps, context?: any) {
        super(props, context);

        const { childData } = this.props;
        let structureData: any = null;
        if (childData === undefined) {
            structureData = JSON.parse(
                JSON.stringify(clone(formDetail.p)).replace(/\[cid\]/g, this.props.baseState.getCurrentContent().getCid())
            );
        }
        this.state = {
            baseState: this.initBaseStateWithCustomState(new AppFormContainerState({ childData: structureData })),
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
            const appGridContainerState: AppFormContainerState = this.getCustomState();
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
            const newAppGridContainerState: AppFormContainerState = AppFormContainerState.set(this.getCustomState(), properties);

            this.setCustomState(newAppGridContainerState, true, callback);
        }
    }

    public render() {
        const {
            pageMode
        } = this.props;
        const appFormContainerState: AppFormContainerState = this.getCustomState();

        const childData = appFormContainerState.getChildData() && appFormContainerState.getChildData().toJS ? appFormContainerState.getChildData().toJS() : appFormContainerState.getChildData();
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
                map_sm={appFormContainerState.getTheme()}
                updateProps={this.updateProps}
                selectComChange={this.selectComChange}
                pageMode={pageMode}
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
                        {appFormContainerState.getTitle()}
                    </div>
                    <div
                        className="form-form"
                    >
                        <div className="form-menu" style={{ display: !appFormContainerState.getShowMenu() ? 'none' : '' }} >
                            {this.menu}
                        </div>
                        {this.form}
                    </div>
                </div>
            </MapProvider>
        );
    }

    // 初始化加载控件
    public initCom = (components: any[], childData: any) => {
        const { selectedId } = this.state;
        const appFormContainerState: AppFormContainerState = this.getCustomState();
        components.forEach((com: any) => {
            switch (com.t) {
                case 'MapComponent/map/form/AppFormMenu':
                    this.menu = (
                        <AppFormMenu
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectedId={selectedId}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                            getRefs={this.getRefs}
                            stateData={childData}
                        />
                    );
                    break;
                case 'MapComponent/map/form/AppForm':
                    this.form = (
                        <AppForm
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectedId={selectedId}
                            updateProps={this.updateProps}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            showNavBar={appFormContainerState.getShowNavBar()}
                            showTabItems={appFormContainerState.getShowTabItems()}
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
            case HandleChildCom.COPY_COM:       // 复制控件
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
        const appFormContainerState: AppFormContainerState = this.getCustomState();
        // 获取当前数据
        const childData = appFormContainerState.getChildData() && appFormContainerState.getChildData().toJS ? appFormContainerState.getChildData().toJS() : appFormContainerState.getChildData();
        // 通过id查找到数据节点
        let newData: any;
        if (id === '') {
            // 当没有id的时候，直接更新整体data(新增组件的时候，直接更新整个CustomState)
            newData = props.p;
        } else {
            // 通过id查找到数据节点
            newData = this.updateComProps(clone(childData), id, props);
        }
        // 更新数据到CustomState
        this.setCustomState(AppFormContainerState.set(appFormContainerState, { childData: newData }));
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
            // const appFormContainerState: AppFormContainerState = this.getCustomState();
            // // 获取当前数据
            // const childData = appFormContainerState.getChildData() && appFormContainerState.getChildData().toJS ? appFormContainerState.getChildData().toJS() : appFormContainerState.getChildData();
            // this.updateProps('', childData);
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
