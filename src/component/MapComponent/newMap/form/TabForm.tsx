import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { TabItem, SectionForm } from './index';
import { GlobalUtil } from '../../../util';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
// import { GlobalUtil } from '../../../util';
// import {
//     // DragDropContext,
//     // Droppable,
//     DroppableProvided,
//     DroppableStateSnapshot
// } from 'react-beautiful-dnd';

// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IBaseProps {
    showNavBar: boolean;
    showTabItems: boolean;
    map_form_sti?: string;
    map_form_st?: string;
}

// tslint:disable-next-line:no-empty-interface
// tslint:disable:jsx-no-string-ref
export class TabFormClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        selectedId: undefined,
        showNavBar: true,
        showTabItems: true
    };
    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            hover: {}
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_form_st } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        // propertyList = propertyList.push(
        //     { pTitle: '标题', pKey: 'map_form_st_name', pValue: map_form_st_name, pType: PropertiesEnum.INPUT_TEXT }
        // );
        propertyList = propertyList.push(
            {
                pTitle: '分区样式', pKey: 'map_form_st', pValue: map_form_st, pType: PropertiesEnum.SELECT,
                pList: [{ key: '0', value: '无边框' }, { key: '1', value: '有边框' }, { key: '2', value: '标签页显示' }]
            }
        );
        // 组件属性整理
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }
    // tslint:disable:no-shadowed-variable
    public render() {
        const { p, map_form_sti, map_form_st, pageMode, selectedId, selectComChange, setChildPropertyGroup, doChildDbClickToEdit, refs, stateData, updateProps, id } = this.props;
        const { selectId } = this.state;
        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;

        const sectionFormList: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.forEach((com: any, index: number) => {
                const { t, p } = com;
                if (t === 'MapComponent/newMap/form/TabItem') {
                    const { map_form_st_state } = p;

                    const sectionForm = GlobalUtil.isUndefined(p.p) ? undefined : p.p.components;
                    if (sectionForm && (selectId === undefined ? (map_form_sti === undefined ? index === 0 : map_form_sti.substring(4) === p.id.substring(4)) : selectId === p.id)) {
                        sectionForm.forEach((secCom: any, secIndex: number) => {
                            const { t, p } = secCom;
                            if (t === 'MapComponent/newMap/form/SectionForm') {
                                sectionFormList.push(
                                    <SectionForm
                                        tabItemState={map_form_st_state}
                                        key={p.id}
                                        {...p}
                                        ref={`c.${p.id}`}
                                        pageMode={pageMode}
                                        selectedId={selectedId}
                                        selectComChange={selectComChange}
                                        setChildPropertyGroup={setChildPropertyGroup}
                                        doChildDbClickToEdit={doChildDbClickToEdit}
                                        stateData={stateData}
                                        updateProps={updateProps}
                                        refs={refs}
                                    />
                                );
                            }
                        });
                    }
                }
            });
        }
        // 是否显示title
        const hideTitle = map_form_st === '0' ? true : false;
        // console.log('map_form_st', map_form_st);

        return (
            <div
                className={`${map_form_st === '1' ? 'margin20-lr-t' : ''} ${selectedId === id ? 'map-select-open' : ''}`}
                ref={(ref) => this.com = ref}
                onMouseDown={this.selectedCom}
            >
                <table className={`form`}>
                    <tbody>
                        <tr className={` ${map_form_st !== '2' ? 'tab-bar' : ''} ${hideTitle ? ' bar-hide' : ''}`}>
                            <td className={`${map_form_st === '2' ? 'tab-bar-content' : ''}`}>
                                <div className={`margin20-lr ${map_form_st === '2' ? 'tab-bar-title-line' : ''}`}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {
                                                        GlobalUtil.isUndefined(components) ? '' :
                                                            (
                                                                components.map((com: any, index: number) => {
                                                                    const { t, p } = com;
                                                                    if (t === 'MapComponent/newMap/form/TabItem') {
                                                                        return <TabItem
                                                                            formState={map_form_st}
                                                                            onChangeItem={this.onChangeItem}
                                                                            id={p.id}
                                                                            tabSelected={selectId === undefined ? (map_form_sti === undefined ? index === 0 : map_form_sti.substring(4) === p.id.substring(4)) : selectId === p.id}
                                                                            key={p.id}
                                                                            {...p}
                                                                            ref={`c.${p.id}`}
                                                                            pageMode={pageMode}
                                                                            selectedId={selectedId}
                                                                            selectComChange={selectComChange}
                                                                            setChildPropertyGroup={setChildPropertyGroup}
                                                                            doChildDbClickToEdit={doChildDbClickToEdit}
                                                                            stateData={stateData}
                                                                            updateProps={updateProps}
                                                                            refs={refs}
                                                                        />;
                                                                    } else {
                                                                        return [];
                                                                    }
                                                                })
                                                            )
                                                    }

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        <tr className={`tab-form-content`}>
                            <td className="tab-bg" style={map_form_st === '0' || map_form_st === '2' ? { padding: '10px 0 0 0', border: 0 } : {}}>
                                <div className={`${map_form_st !== '1' ? 'margin10-lr' : ''}`}>
                                    {sectionFormList}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/form/TabItem');
    }

    public onChangeItem = (tabId: string) => {
        this.props.updateProps(this.props.id, {
            map_form_sti: tabId
        });
    }
    /**
     * override
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        if (addData.t === 'MapComponent/newMap/form/TabItem') {
            const tabItem = this.getChildComponent(id, data, addData);
            let childId = tabItem.p.id;
            const sectionForm = this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/SectionForm' });
            childId = sectionForm.p.id;
            const section = this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/Section' });
            childId = section.p.id;
            this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/field/InputField' });
        }

        this.props.updateProps('', data);
    }
}
export const TabForm = TabFormClass;
