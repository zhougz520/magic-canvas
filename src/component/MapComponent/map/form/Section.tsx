import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import {
    InputField,
    // InputNumberField,
    // SelectField,
    // DataTimeField,
    // LookUpField,
    // NullField
} from '../form/field';
import { MapConsumer } from '../MapConsumer';
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
        const { hover, fieldList } = this.state;
        const { map_form_ss_name, selectedId, id, index } = this.props;
        const currFieldList = this.initFieldList(fieldList);
        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                className={`${id === selectedId ? ' map-selected' : ''}`}
            >
                <div
                    className={`section-title`}
                    onClick={this.selectedCom}
                    {...provided.dragHandleProps}
                    key={'title'}
                >
                    {map_form_ss_name}
                </div>
                {currFieldList}
                {provided.placeholder}
            </div >
        );

        return (
            <div
                ref={(ref) => this.com = ref}
                className={`section`}
                style={Object.assign({}, { width: '100%' }, hover)}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            >
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
            </div>
        );
    }
    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/form/field/CheckBoxField') ||
            (t === 'MapComponent/map/form/field/DataTimeField') ||
            (t === 'MapComponent/map/form/field/InputField') ||
            (t === 'MapComponent/map/form/field/InputIconField') ||
            (t === 'MapComponent/map/form/field/InputNumberField') ||
            (t === 'MapComponent/map/form/field/LinkField') ||
            (t === 'MapComponent/map/form/field/LookUpField') ||
            (t === 'MapComponent/map/form/field/NullField') ||
            (t === 'MapComponent/map/form/field/RadioField') ||
            (t === 'MapComponent/map/form/field/SelectField') ||
            (t === 'MapComponent/map/form/field/TextAreaField') ||
            (t === 'MapComponent/map/form/field/UploadFiles');
    }
    private initFieldList = (currFieldList: any) => {
        const { map_form_ss_unit, selectComChange, updateProps, selectedId } = this.props;
        const currUnit: number = map_form_ss_unit === undefined ? 2 : map_form_ss_unit;
        const components = currFieldList === undefined ? undefined : currFieldList;
        const fieldList: any[] = [];
        const currComList: any[] = [];
        const currRowList: any[] = [];
        if (components !== undefined) {
            // 初始化行组
            for (let row = 0;
                row < (components.length <= currUnit ? 1 : Math.ceil(components.length / currUnit));
                row++) {
                fieldList.push([]);
                currComList.push([]);
            }
            components.forEach((com: any, index: number) => {
                const { t, p } = com;
                if (p.map_form_f_cols === undefined) {
                    p.map_form_f_cols = 1;
                }
                let field: any = null;

                switch (t) {
                    case 'MapComponent/map/form/field/InputField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                            dragChangeField={this.dragChangeField}
                        />;
                        break;
                    case 'MapComponent/map/form/field/InputNumberField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/CheckBoxField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/LinkField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/RadioField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/SelectField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/TextAreaField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/DataTimeField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/LookUpField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                    case 'MapComponent/map/form/field/NullField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={p.unit}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                            index={index % currUnit}
                        />;
                        break;
                }

                if (field !== null) {
                    fieldList[Math.floor(index / currUnit)].push(field);
                    currComList[Math.floor(index / currUnit)].push(com);
                }
            });
        }
        fieldList.forEach((row: any, index: number) => {
            currRowList.push(
                <div
                    className="field-list"
                    key={index}
                >
                    {row}
                </div>
            );
        });
        this.rowList = currComList;

        return (
            <div
                className={`section-content`}
            >
                {currRowList}
            </div>
        );
    }

    private dragChangeField = (newFieldList: any) => {
        this.props.updateProps(this.props.id, { p: { components: newFieldList } });
    }
}
export const Section = MapConsumer(SectionClass);
