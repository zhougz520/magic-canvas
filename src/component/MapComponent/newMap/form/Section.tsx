import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
// import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import {
    CheckBoxField,
    DataTimeField,
    InputField,
    InputIconField,
    InputNumberField,
    LinkField,
    LookUpField,
    NullField,
    RadioField,
    SelectField,
    TextAreaField,
    TextField
} from '../form/field';
import { GlobalUtil } from '../../../util';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-wrap-multiline
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_form_ss?: boolean;              // 是否显示section的标题
    map_form_ss_name?: string;          // section标题
    map_form_ss_unit?: number;          // 一行展示的列数
    map_form_ss_tt_w?: number;          // 标题的宽度
    index?: number;
}

// tslint:disable:no-shadowed-variable
// tslint:disable:jsx-alignment
export class SectionClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_form_ss: true,
        map_form_ss_name: '分组',
        map_form_ss_unit: 2,
        map_form_ss_tt_w: 110
    };
    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            hover: {},
            fieldList: this.props.p !== undefined ? this.props.p.components : []
        };
    }
    componentWillReceiveProps(nextProps: any) {
        // 当接收到新的props的时候，将字段列表更新
        this.setState({
            fieldList: nextProps.p !== undefined ? nextProps.p.components : []
        });
    }
    public getItemStyle = (draggableStyle: any, isDragging: any) => ({

        // change background colour if dragging
        background: isDragging ? 'blue' : '',

        // styles we need to apply on draggables
        ...draggableStyle
    })

    public render() {
        const { hover } = this.state;
        const { map_form_ss_name, p, map_form_ss, map_form_ss_unit, map_form_ss_tt_w, id, updateProps,
            pageMode, selectedId, selectComChange, setChildPropertyGroup, doChildDbClickToEdit, refs, stateData } = this.props;
        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;
        const rowList: any[] = [];
        const unit = map_form_ss_unit ? map_form_ss_unit : 2;
        let fieldList: any = '';
        if (!GlobalUtil.isUndefined(components)) {
            let rowNum = unit;
            let fieldRow: any[] = [];
            components.forEach((com: any, index: number) => {
                const { t, p } = com;
                if (p.map_form_f_cols === undefined) {
                    // 默认占位1
                    p.map_form_f_cols = 1;
                } else if (p.map_form_f_cols >= rowNum) {
                    // 如果设置所占列数大于等于容器最大列数，则默认为容器最大列数
                    p.map_form_f_cols = rowNum;
                }
                let field: any = '';

                switch (t) {
                    case 'MapComponent/newMap/form/field/InputField':
                        // console.log('InputField', t);
                        field = <InputField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id} {...p}
                            unit={unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/InputNumberField':
                        field =
                            <InputNumberField
                                titleWidth={map_form_ss_tt_w}
                                key={p.id}
                                {...p}
                                unit={map_form_ss_unit}
                                map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/CheckBoxField':
                        field = <CheckBoxField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/LinkField':
                        field = <LinkField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/RadioField':
                        field = <RadioField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/SelectField':
                        field = <SelectField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/TextAreaField':
                        field = <TextAreaField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/DataTimeField':
                        field = <DataTimeField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/LookUpField':
                        field = <LookUpField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/NullField':
                        field = <NullField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/InputIconField':
                        field = <InputIconField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                    case 'MapComponent/newMap/form/field/TextField':
                        field = <TextField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            unit={map_form_ss_unit}
                            map_form_f_type={t}
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
                        break;
                }
                // 每加载一个控件，就判断是否换行
                rowNum = rowNum - p.map_form_f_cols;
                if (rowNum === 0) {
                    fieldRow.push(<td key={index} className="fieldList-td"
                        colSpan={p.map_form_f_cols}>{field}</td>);
                    rowList.push(<tr key={index} className="fieldList-tr">{fieldRow}</tr>);
                    // 重置行
                    fieldRow = [];
                    rowNum = unit;
                } else if (rowNum < 0) {
                    if ((rowNum + p.map_form_f_cols) > 0) {
                        fieldRow.push(<td key={index} className="fieldList-td"
                            colSpan={rowNum + p.map_form_f_cols}>{``}</td>);
                    }
                    // 添加现有行
                    rowList.push(<tr key={index} className="fieldList-tr">{fieldRow}</tr>);
                    // 重置行
                    fieldRow = [];
                    // 将当前field添加到新行
                    fieldRow.push(
                        <td key={index} className="fieldList-td"
                            // width={`${p.map_form_f_cols * 100 / unit}%`}
                            colSpan={p.map_form_f_cols}
                        >
                            {field}
                        </td>);
                    rowNum = - p.map_form_f_cols;
                } else {
                    fieldRow.push(<td key={index} className="fieldList-td"
                        // width={`${p.map_form_f_cols * 100 / unit}%`}
                        colSpan={p.map_form_f_cols}>{field}</td>);
                }
                // 如果是最后一次循环，但是还没有填满行，则直接新增行
                if (index === components.length - 1) {
                    if (rowNum < unit && rowNum > 0) {
                        fieldRow.push(<td key={index + 1} className="fieldList-td"
                            colSpan={rowNum}>{``}</td>);
                    }
                    if (fieldRow.length > 0) {
                        // 添加现有行
                        rowList.push(<tr key={index + 1} className="fieldList-tr">{fieldRow}</tr>);
                    }
                }
            });

            if (rowList.length > 0) {
                fieldList =
                    <table
                        className="fieldList-tb"
                        style={Object.assign({}, { width: '100%' }, hover)}
                        onDragOver={this.handleOver}
                        onDragLeave={this.handleLeave}
                    >
                        <tbody>
                            {rowList}
                        </tbody>
                    </table>;
            }
        }

        return (
            <table
                ref={(ref) => this.com = ref}
                className={`section-tb ${selectedId === id ? 'map-select-open' : ''}`}
                onMouseDown={this.selectedCom}
                style={map_form_ss ? {} : { border: 0 }}
            >
                <tbody>
                    <tr className={`section-title${map_form_ss ? '' : ' bar-hide'}`}>
                        <td className="section-hr">
                            {map_form_ss_name}
                        </td>
                    </tr>
                    <tr className={`section-tr`} style={map_form_ss ? {} : { border: 0 }}>
                        <td className="section-td" style={map_form_ss ? {} : { padding: '10px 0 0 0' }}>
                            {fieldList}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_form_ss_unit, map_form_ss_name, map_form_ss, map_form_ss_tt_w } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '显示标题', pKey: 'map_form_ss', pValue: map_form_ss, pType: PropertiesEnum.SWITCH }
        );
        if (map_form_ss) {
            propertyList = propertyList.push(
                { pTitle: '标题', pKey: 'map_form_ss_name', pValue: map_form_ss_name, pType: PropertiesEnum.INPUT_TEXT }
            );
        }
        propertyList = propertyList.push(
            { pTitle: '标题宽度', pKey: 'map_form_ss_tt_w', pValue: map_form_ss_tt_w, pType: PropertiesEnum.INPUT_NUMBER }
        );
        propertyList = propertyList.push(
            { pTitle: '列数', pKey: 'map_form_ss_unit', pValue: map_form_ss_unit, pType: PropertiesEnum.INPUT_NUMBER }
        );
        // 组件属性整理
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }
    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/form/field/CheckBoxField') ||
            (t === 'MapComponent/newMap/form/field/DataTimeField') ||
            (t === 'MapComponent/newMap/form/field/InputField') ||
            (t === 'MapComponent/newMap/form/field/InputIconField') ||
            (t === 'MapComponent/newMap/form/field/InputNumberField') ||
            (t === 'MapComponent/newMap/form/field/LinkField') ||
            (t === 'MapComponent/newMap/form/field/LookUpField') ||
            (t === 'MapComponent/newMap/form/field/NullField') ||
            (t === 'MapComponent/newMap/form/field/RadioField') ||
            (t === 'MapComponent/newMap/form/field/SelectField') ||
            (t === 'MapComponent/newMap/form/field/TextAreaField') ||
            (t === 'MapComponent/newMap/form/field/TextField') ||
            (t === 'MapComponent/newMap/grid/AppGrid');
    }
}
export const Section = SectionClass;
