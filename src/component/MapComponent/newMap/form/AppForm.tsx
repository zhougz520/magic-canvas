import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { AppGridMenuItemButton } from '../grid/AppGridMenuItemButton';
import { AppGridMenuItemDropdown } from '../grid/AppGridMenuItemDropdown';
import { TabForm } from './index';
import { GlobalUtil } from '../../../util';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

export interface IMapProps extends IBaseProps {
    map_form_header_show?: boolean;     // 显示标题
    map_form_foot_show?: boolean;       // 显示底部
    map_form_title: string;             // 标题
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref */
export class AppFormClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_form_header_show: true,
        map_form_foot_show: true,
        map_form_title: '标题'
    };

    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            hidden: false,
            hover: {}
        };
    }

    public render() {
        const { hover, hidden } = this.state;
        const { p, map_form_title, theme, map_form_header_show, map_form_foot_show,
            pageMode, selectedId, selectComChange, setChildPropertyGroup, doChildDbClickToEdit,
            stateData, getRefs, updateProps, id } = this.props;
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
                            index={index}
                            // p={theme}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                        />
                    );
                } else if (t === 'MapComponent/newMap/grid/AppGridMenuItemButton') {
                    tabFormFootList.push(
                        <AppGridMenuItemButton
                            ref={`c.${com.p.id}`}
                            key={com.p.id}
                            index={index}
                            {...com.p}
                            theme={theme}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            stateData={stateData}
                        />
                    );
                } else if (t === 'MapComponent/newMap/grid/AppGridMenuItemDropdown') {
                    tabFormFootList.push(
                        <AppGridMenuItemDropdown
                            ref={`c.${com.p.id}`}
                            key={com.p.id}
                            index={index}
                            {...com.p}
                            theme={theme}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            stateData={stateData}
                        />
                    );
                }
            });
        }
        const tabForms = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
            (
                <div
                    className={`form-content`}
                    style={Object.assign({}, hover)}
                    onDragOver={this.handleOver}
                    onDragLeave={this.handleLeave}
                    ref={provided.innerRef}
                >
                    {tabFormList}
                </div>
            );

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
                    <label
                        ref={(ref) => this.editCom = ref}
                        style={{
                            visibility: hidden ? 'hidden' : 'visible'
                        }}
                        onDoubleClick={doChildDbClickToEdit}
                    >
                        {map_form_title}
                    </label>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd} >
                    <Droppable droppableId="droppable-tabForm" >
                        {tabForms}
                    </Droppable>
                </DragDropContext>
                <div className={`form-foot`} style={{ display: map_form_foot_show ? '' : 'none' }}>
                    <DragDropContext onDragEnd={this.onDragEnd} >
                        <Droppable droppableId="droppable-tabFormFoot" direction="horizontal" >
                            {
                                (provided: DroppableProvided) =>
                                    (
                                        <div
                                            ref={provided.innerRef}
                                            style={{ margin: '10px 0', height: '40px', width: '100%', lineHeight: '40px', textAlign: 'center', display: 'inline-block' }}
                                        >
                                            {tabFormFootList.length > 0 ? tabFormFootList : ''}
                                        </div>
                                    )
                            }
                        </Droppable>
                    </DragDropContext>
                </div>
            </div >
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
            { pTitle: '显示标题', pKey: 'map_form_header_show', pValue: map_form_header_show, pType: PropertiesEnum.SWITCH },
            { pTitle: '标题', pKey: 'map_form_title', pValue: map_form_title, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '显示底部', pKey: 'map_form_foot_show', pValue: map_form_foot_show, pType: PropertiesEnum.SWITCH }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.props.map_form_title;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_form_title'] = value;

        return obj;
    }

    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/form/TabForm') ||
            (t === 'MapComponent/newMap/grid/AppGridMenuItemButton') ||
            (t === 'MapComponent/newMap/grid/AppGridMenuItemDropdown');
    }
}
export const AppForm = AppFormClass;
