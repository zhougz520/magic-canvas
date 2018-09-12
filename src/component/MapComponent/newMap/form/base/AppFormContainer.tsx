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
import {
    //  PropertiesEnum,
    IPropertyGroup,
    IProperty
} from '../../../../UniversalComponents';

import { IComponent } from '../../IComponent';
import { AppFormContainerState, IAppFormContainerState as ICustomState } from './AppFormContainerState';
import { IComData } from '../../model/types';

import { Map, List, OrderedSet } from 'immutable';
// tslint:disable-next-line:no-var-requires
const clone = require('clone');

import '../../sass/AppForm.scss';
import { AppForm } from '../AppForm';
import { HandleChildCom } from '../../../types';

/* tslint:disable:no-empty-interface jsx-no-string-ref jsx-no-multiline-js jsx-no-lambda */
export interface IAppFormContainerProps extends IBaseProps {
}

export interface IAppFormContainerState extends IBaseState {
    selectedId: string | null;  // 当前选中的子控件id
    hidden: boolean;
}

export default class AppFormContainer extends BaseComponent<IAppFormContainerProps, IAppFormContainerState> {

    private appForm: JSX.Element | null = null;
    private bottom: JSX.Element | null = null;

    private _padding: number = 8;
    private _isCanMove: boolean = false;
    private _childPropertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

    constructor(props: IAppFormContainerProps, context?: any) {
        super(props, context);

        const { childData } = this.props;
        this.state = {
            baseState: this.initBaseStateWithCustomState(new AppFormContainerState({ childData })),
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
            const newAppFormContainerState: AppFormContainerState = AppFormContainerState.set(this.getCustomState(), Map(config));

            this.setCustomState(newAppFormContainerState);
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
                result = childCom.copySelectedCom();
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

    // /**
    //  * 删除控件
    //  */
    // public deleteComponentsById = (): any => {
    //     const { selectedId } = this.state;
    //     if (selectedId === null || GlobalUtil.isEmptyString(selectedId) || GlobalUtil.isUndefined(selectedId)) {
    //         // 没有选中子控件，则直接返回
    //         return false;
    //     } else {
    //         // 选中子控件，则删除，并返回true
    //         const parentId = selectedId.substring(0, selectedId.lastIndexOf('.'));
    //         const parent: any = this.getChildComponent(parentId);
    //         if (parent && selectedId) {
    //             const components = parent.props.p.components;
    //             if (components) {
    //                 const idx = components.findIndex((com: any) => com.p.id === selectedId);
    //                 if (idx >= 0) {
    //                     components.splice(idx, 1);
    //                 }
    //                 this.updateProps(parentId, { p: { components } });
    //             }
    //         }
    //     }

    //     return true;
    // }
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
            // const appFormContainerState: AppFormContainerState = this.getCustomState();
            let propertyList: List<IProperty> = List();
            let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

            // 列表属性
            propertyList = propertyList.push(
                // { pTitle: '标题', pKey: 'title', pValue: appFormContainerState.getTitle(), pType: PropertiesEnum.INPUT_TEXT },
                // { pTitle: '主题', pKey: 'theme', pValue: appFormContainerState.getTheme(), pType: PropertiesEnum.INPUT_TEXT }
                // { pTitle: '显示项目控件', pKey: 'showAppProjectTree', pValue: appFormContainerState.getShowHeader(), pType: PropertiesEnum.SWITCH },
                // { pTitle: '显示普通查询', pKey: 'showAppFindOrdinary', pValue: appFormContainerState.getShowBottom(), pType: PropertiesEnum.SWITCH }
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
            const newAppFormContainerState: AppFormContainerState = AppFormContainerState.set(this.getCustomState(), properties);

            this.setCustomState(newAppFormContainerState, true, callback);
        }
    }
    /************************************* end 属性设置 ****************************************/

    render() {
        const { hidden } = this.state;
        const appFormContainerState: AppFormContainerState = this.getCustomState();

        const childData = appFormContainerState.getChildData().toJS ? appFormContainerState.getChildData().toJS() : appFormContainerState.getChildData();
        if (childData && childData.components && childData.components.length > 0) {
            this.initCom(childData.components, childData);
        }

        return (
            <div
                className="page-newmap-appform"
                style={{
                    ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), true, this.isCanSelected()),
                    border: '1px solid #d3d5d9'
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
                    {hidden ? '' : appFormContainerState.getTitle()}
                </div>
                <div
                    className="map-form-content"
                >
                    {/* 项目 */}
                    {this.appForm}

                    {/* 普通查询 */}
                    <ul>
                        {
                            appFormContainerState.getShowBottom() ? this.bottom : ''
                        }
                    </ul>
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
        const appFormContainerState: AppFormContainerState = this.getCustomState();

        components.map(
            (component: IComData) => {
                const id: string = component.p.id;

                switch (component.t) {
                    case 'MapComponent/newMap/form/AppForm':
                        this.appForm = (
                            <AppForm
                                ref={`c.${id}`}
                                theme={appFormContainerState.getTheme()}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={this.selectComChange}
                                setChildPropertyGroup={this.setChildPropertyGroup}
                                doChildDbClickToEdit={this.doChildDbClickToEdit}
                                updateProps={this.updateProps}
                                {...component.p}
                                stateData={childData}
                                getRefs={this.getRefs}
                            />
                        );
                        break;
                }
            }
        );
    }

    // 获取refs
    private getRefs = () => {
        return this.refs;
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
     * 更新子组件
     * @param id 子组件id
     * @param props 需要更新的属性集合
     */
    private updateProps = (id: string, props: any) => {
        const appFormContainerState: AppFormContainerState = this.getCustomState();
        // 获取当前数据
        const childData = appFormContainerState.getChildData().toJS ? appFormContainerState.getChildData().toJS() : appFormContainerState.getChildData();
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
                // 当 map_form_f_type 存在时
                if (props.map_form_f_type !== undefined && props.map_form_f_type !== '') {
                    com.t = props.map_form_f_type;
                }
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
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ICustomState
 */
export function convertFromDataToCustomState(
    customData: ICustomState
): any {
    return new AppFormContainerState(customData);
}
