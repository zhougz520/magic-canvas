import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { AppMenuItem } from '../base/index';
import { TabForm } from './index';
import { GlobalUtil } from '../../../util';
import { Theme } from '../model/types';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

export interface IMapProps extends IBaseProps {
    showTabItems: boolean;
    map_form_sni?: string;
    map_form_header_show?: boolean;
    map_form_foot_show?: boolean;
    map_form_title: string;
    theme?: Theme;
}

// tslint:disable:jsx-no-string-ref
export class AppFormClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        selectedId: undefined,
        showTabItems: true,
        map_form_sni: undefined,
        theme: '',
        map_form_header_show: true,
        map_form_foot_show: true,
        map_form_title: '标题'
    };

    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            hover: {}
        };
    }

    public render() {
        const { hover } = this.state;
        const { p, map_form_title, theme, map_form_header_show, map_form_foot_show,
            pageMode, selectedId, selectComChange, setChildPropertyGroup, doChildDbClickToEdit,
            stateData, refs, updateProps, id } = this.props;
        const components: any[] = GlobalUtil.isUndefined(p) ? undefined : p.components;
        const tabFormList: any[] = [];
        const tabFormFootList: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.forEach((com, index) => {
                const { t } = com;
                if (t === 'MapComponent/newMap/form/TabForm') {
                    tabFormList.push(
                        <TabForm
                            theme={theme}
                            key={com.p.id}
                            {...com.p}
                            ref={`c.${com.p.id}`}
                            // p={theme}
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
                } else if (t === 'MapComponent/newMap/form/AppGridMenuItem') {
                    tabFormFootList.push(
                        <AppMenuItem
                            key={com.p.id}
                            {...com.p}
                            ref={`c.${com.p.id}`}
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

        return (
            <div
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                className={`map-form ${selectedId === id ? 'map-select-open' : ''}`}
                onMouseDown={this.selectedCom}
                style={Object.assign({}, hover)}
            >
                <div className={`form-title`} style={{ display: map_form_header_show ? '' : 'none' }}>
                    {map_form_title}
                </div>
                <div className={`form-content`}>
                    {tabFormList.length > 0 ? tabFormList : ''}
                </div>
                <div className={`form-foot`} style={{ display: map_form_foot_show ? '' : 'none' }}>
                    <ul>
                        {tabFormFootList.length > 0 ? tabFormFootList : ''}
                    </ul>
                </div>
            </div>
        );
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_form_foot_show, map_form_header_show, map_form_title } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '显示标题', pKey: 'map_form_header_show', pValue: map_form_header_show, pType: PropertiesEnum.SWITCH }
        );
        if (map_form_header_show) {
            propertyList = propertyList.push(
                { pTitle: '标题', pKey: 'map_form_title', pValue: map_form_title, pType: PropertiesEnum.INPUT_TEXT }
            );
        }
        propertyList = propertyList.push(
            { pTitle: '显示底部', pKey: 'map_form_foot_show', pValue: map_form_foot_show, pType: PropertiesEnum.SWITCH }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }
    /*重载添加组件*/
    // public componentCanBeAdded(t: string) {
    //     return (t === 'MapComponent/newMap/form/NavBarItem');
    // }

    public onChangeItem = (navBarId: string) => {
        this.props.updateProps(this.props.id, {
            map_form_sni: navBarId
        });
    }
    /**
     * override
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        // if (addData.t === 'MapComponent/newMap/form/NavBarItem') {
        //     const newNavBarItem = this.getChildComponent(id, data, addData);
        //     let childId = newNavBarItem.p.id;
        //     const tabForm = this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/TabForm' });
        //     childId = tabForm.p.id;
        //     const tabItem = this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/TabItem' });
        //     childId = tabItem.p.id;
        //     const sectionForm = this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/SectionForm' });
        //     childId = sectionForm.p.id;
        //     const section = this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/Section' });
        //     childId = section.p.id;
        //     this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/field/InputField' });
        // }

        // this.props.updateProps('', data);
    }
}
export const AppForm = AppFormClass;
