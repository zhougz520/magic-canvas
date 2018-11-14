import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
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
    TextField,
    UploadField
} from '../form/field';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import * as DragStyle from '../DragStyle';

export interface IMapProps extends IBaseProps {
    map_form_ss?: boolean;              // 是否显示section的标题
    map_form_ss_name?: string;          // section标题
    map_form_ss_unit?: number;          // 一行展示的列数
    map_form_ss_tt_w?: number;          // 标题的宽度
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref jsx-wrap-multiline */
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
            hidden: false,
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
        background: isDragging ? DragStyle.BaseDragStyle.background : '',
        // styles we need to apply on draggables
        ...draggableStyle
    })

    public render() {
        const { fieldList, hover, hidden } = this.state;
        const { map_form_ss_name, map_form_ss, id, index, selectedId, doChildDbClickToEdit } = this.props;
        const currFieldList = this.initFieldList(fieldList);
        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                className={`${selectedId === id ? 'map-select-open' : ''}`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
            >
                <div
                    className={`section-title ${map_form_ss ? 'bar-show' : 'bar-hide'}`}
                    {...provided.dragHandleProps}
                    key={'title'}
                >
                    <div className={`section-hr`}>
                        <label
                            ref={(ref) => this.editCom = ref}
                            style={{
                                visibility: hidden ? 'hidden' : 'visible'
                            }}
                            onDoubleClick={doChildDbClickToEdit}
                        >
                            {map_form_ss_name}
                        </label>
                    </div>
                </div>
                {/* <Droppable droppableId="droppable-fieldList" direction="horizontal" > */}
                {currFieldList}
                {/* </Droppable> */}
                {provided.placeholder}
            </div >
        );

        return (
            <div
                ref={(ref) => this.com = ref}
                className={`section-tb `}
                style={Object.assign({}, hover)}
                onDragOver={this.handleOver}
                onMouseDown={this.selectedCom}
                onDragLeave={this.handleLeave}
            >
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
            </div>
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
            { pTitle: '显示标题', pKey: 'map_form_ss', pValue: map_form_ss, pType: PropertiesEnum.SWITCH },
            { pTitle: '标题', pKey: 'map_form_ss_name', pValue: map_form_ss_name, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '标题宽度', pKey: 'map_form_ss_tt_w', pValue: map_form_ss_tt_w, pType: PropertiesEnum.INPUT_NUMBER },
            { pTitle: '列数', pKey: 'map_form_ss_unit', pValue: map_form_ss_unit, pType: PropertiesEnum.INPUT_NUMBER }
        );
        // 组件属性整理
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.props.map_form_ss_name;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_form_ss_name'] = value;

        return obj;
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
            (t === 'MapComponent/newMap/form/field/UploadField') ||
            (t === 'MapComponent/newMap/grid/AppGrid');
    }

    private initFieldList = (currFieldList: any) => {
        const { map_form_ss_unit, map_form_ss_tt_w, updateProps,
            pageMode, selectedId, selectComChange, setChildPropertyGroup, doChildDbClickToEdit, getRefs, stateData } = this.props;
        const currUnit: number = map_form_ss_unit === undefined ? 2 : map_form_ss_unit;
        const components = currFieldList === undefined ? undefined : currFieldList;
        const fieldList: any[] = [];
        if (components !== undefined) {
            // 初始化行组
            for (let row = 0;
                row < (components.length <= currUnit ? 1 : Math.ceil(components.length / currUnit));
                row++) {
                fieldList.push([]);
            }
            components.forEach((com: any, index: number) => {
                const { t, p } = com;
                if (p.map_form_f_cols === undefined) {
                    p.map_form_f_cols = 1;
                }
                let field: any = null;

                switch (t) {
                    case 'MapComponent/newMap/form/field/InputField':
                        // console.log('InputField', t);
                        field = <InputField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            map_form_f_cols={p.map_form_f_cols}
                            index={index}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/InputNumberField':
                        field =
                            <InputNumberField
                                titleWidth={map_form_ss_tt_w}
                                key={p.id}
                                {...p}
                                id={p.id}
                                currUnit={currUnit}
                                index={index}
                                map_form_f_cols={p.map_form_f_cols}
                                ref={`c.${p.id}`}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                stateData={stateData}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                dragChangeField={this.dragChangeField}
                            />;
                        break;
                    case 'MapComponent/newMap/form/field/CheckBoxField':
                        field = <CheckBoxField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/LinkField':
                        field = <LinkField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/RadioField':
                        field = <RadioField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/SelectField':
                        field = <SelectField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/TextAreaField':
                        field = <TextAreaField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/DataTimeField':
                        field = <DataTimeField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/LookUpField':
                        field = <LookUpField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/NullField':
                        field = <NullField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/InputIconField':
                        field = <InputIconField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/TextField':
                        field = <TextField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/newMap/form/field/UploadField':
                        field = <UploadField
                            titleWidth={map_form_ss_tt_w}
                            key={p.id}
                            {...p}
                            id={p.id}
                            currUnit={currUnit}
                            index={index}
                            map_form_f_cols={p.map_form_f_cols}
                            ref={`c.${p.id}`}
                            pageMode={pageMode}
                            selectedId={selectedId}
                            selectComChange={selectComChange}
                            setChildPropertyGroup={setChildPropertyGroup}
                            doChildDbClickToEdit={doChildDbClickToEdit}
                            stateData={stateData}
                            updateProps={updateProps}
                            getRefs={getRefs}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                }

                if (field !== null) {
                    fieldList.push(field);
                    // currComList[Math.floor(index / currUnit)].push(com);
                }
            });
        }

        return (
            <div
                className={`section-td`}
            >
                {fieldList}
            </div>
        );
    }

    private dragChangeField = (newFieldList: any) => {
        this.props.updateProps(this.props.id, { p: { components: newFieldList } });
    }
}
export const Section = SectionClass;
