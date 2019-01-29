import * as React from 'react';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Checkbox, Select, Input, Button } from 'antd';
import {
    CheckBoxField,
    DataTimeField,
    InputField,
    InputIconField,
    InputNumberField,
    LinkField,
    LookUpField,
    RadioField,
    SelectField,
    TextAreaField,
    TextField,
    UploadField
} from '../field';
import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';
import { MapComponent, IBaseProps, IBaseState } from '../../index';

const Option = Select.Option;
// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-wrap-multiline
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_af_o?: string[];
    map_af_se?: boolean;
    map_sm?: string;
    p?: any;
    id: string;
    map_form_ss_unit?: number;
}
export interface IMapState extends IBaseState {
    dragonDrop?: any;
    l: number;
    f: number;
    w: number;
    h: number;
    // map_af_se: boolean;
}
export class AppFind extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_af_se: false,
        map_af_o: [],
        map_form_ss_unit: 2
    };

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            map_af_se: props.map_af_se,
            dragonDrop: null,
            hover: {}
        };
    }

    // 如果需要特殊遮罩，则在componentDidUpdate中处理
    componentDidUpdate() {
        if (this.com !== null) {
            const currMaskLayer = document.getElementById(this.props.id);
            if (currMaskLayer !== null) {
                currMaskLayer.style.width = this.com.offsetWidth + 'px';
                currMaskLayer.style.height = (this.com.offsetHeight - 24) + 'px';
                currMaskLayer.style.top = (this.com.offsetTop + 24) + 'px';
                currMaskLayer.style.left = this.com.offsetLeft + 'px';
            }
        }
    }

    public render() {
        const { map_sm, map_af_o, p, id, selectedId } = this.props;
        const { map_af_se, hover } = this.state;

        const options: any[] = [];
        if (map_af_o !== undefined) {
            map_af_o.map((mi: string) => {
                options.push(
                    <Option value={mi} key={mi}>{mi}</Option>
                );
            });
        }

        const fieldList: any = this.initHightMode(p);
        const normalFind: any = (
            <div className={`normal  ${selectedId === id ? 'map-selected' : ''}`}>
                <div className={`app-find-menu ${map_sm || ''}`}>
                    <div className="app-find-menu-title"><b style={{ color: '#66666' }}>快速查询（普通）</b></div>
                    <div style={{ float: 'right' }}>
                        <div className="app-find-menu-item">
                            <Checkbox style={{ float: 'left' }} defaultChecked={false} />
                            <p >视图内查询</p>
                        </div>
                        <div
                            onClick={this.onChangeLowMode}
                            className="app-find-menu-item"
                            style={{ marginLeft: '14px' }}
                        >
                            <img className="lookup" />
                            <p >普通</p>
                        </div>
                        <div
                            onClick={this.onChangeHightMode}
                            className="app-find-menu-item"
                            style={{ marginLeft: '22px', marginRight: '14px' }}
                        >
                            <img className="lookup" />
                            <p>高级</p>
                        </div>
                    </div>
                </div>
                <div className="first-page">
                    <table style={{ width: '100%', height: '39px' }}>
                        <tbody>
                            <tr>
                                <td className="app-find-text-td" style={{ width: '60px' }}>查找按</td>
                                <td style={{ width: '120px' }}>
                                    <Select style={{ float: 'left', width: '120px' }}>
                                        {options}
                                    </Select>
                                </td>
                                <td className="app-find-text-td" style={{ width: '56px' }}>关键字</td>
                                <td>
                                    <Input style={{ width: '100%', height: '19px' }} />
                                </td>
                                <td className="app-find-text-td" style={{ width: '92px' }}>
                                    <Button style={{ width: '70px', height: '22px', marginLeft: '12px' }} >查找</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>);

        const extendFind: any = (
            <div
                className="high"
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                style={Object.assign({}, hover)}
            >
                <div className={`app-find-menu ${map_sm || ''}`}>
                    <div className="app-find-menu-title">
                        <b style={{ color: '#66666' }}>快速查询（高级）</b>
                        <Select
                            defaultValue="历史查询..."
                            style={{ width: '130px', height: '18px', marginLeft: '30px', marginTop: '3px' }}
                        >
                            <Option value="" />
                        </Select>
                        <img className="height-grade" />
                    </div>
                    <div style={{ float: 'right' }}>
                        <div className="app-find-menu-item">
                            <Checkbox style={{ float: 'left' }} defaultChecked={false} />
                            <p>视图内查询</p>
                        </div>
                        <div
                            onClick={this.onChangeLowMode}
                            className="app-find-menu-item"
                            style={{ marginLeft: '14px' }}
                        >
                            <img className="lookup" />
                            <p >普通</p>
                        </div>
                        <div
                            onClick={this.onChangeHightMode}
                            className="app-find-menu-item"
                            style={{ marginLeft: '22px', marginRight: '14px' }}
                        >
                            <img className="lookup" />
                            <p>高级</p>
                        </div>
                    </div>

                </div>
                <div
                    className="app-find-content"
                >
                    <DragDropContext onDragEnd={this.onDragEnd} >
                        {fieldList}
                    </DragDropContext>
                </div>
                <div style={{ width: '100%', height: '30px', verticalAlign: 'top' }}>
                    <Button>
                        重置
                            </Button>
                    <Button>
                        查找
                            </Button>
                    <Button>
                        保存
                            </Button>
                </div>
            </div>);

        return (
            <div className={`csr-pc-map-app-find  ${selectedId === id ? 'map-selected' : ''}`} ref={(ref) => this.com = ref}>
                {!map_af_se ? <MaskLayer id={id} /> : ''}
                {!map_af_se ? normalFind : extendFind}
            </div>
        );
    }

    public onChangeHightMode = () => {
        this.setState({
            map_af_se: true
        });
    }

    public onChangeLowMode = () => {
        this.setState({
            map_af_se: false
        });
    }

    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/grid/field/CheckBoxField') ||
            (t === 'MapComponent/map/grid/field/DataTimeField') ||
            (t === 'MapComponent/map/grid/field/InputField') ||
            (t === 'MapComponent/map/grid/field/InputIconField') ||
            (t === 'MapComponent/map/grid/field/InputNumberField') ||
            (t === 'MapComponent/map/grid/field/LinkField') ||
            (t === 'MapComponent/map/grid/field/LookUpField') ||
            (t === 'MapComponent/map/grid/field/RadioField') ||
            (t === 'MapComponent/map/grid/field/SelectField') ||
            (t === 'MapComponent/map/grid/field/TextAreaField') ||
            (t === 'MapComponent/map/grid/field/TextField') ||
            (t === 'MapComponent/map/grid/field/UploadField');
    }

    private initHightMode = (data: any) => {
        const {
            map_form_ss_unit,
            selectComChange,
            updateProps,
            selectedId,
            stateData,
            setChildPropertyGroup,
            doChildDbClickToEdit,
            pageMode,
            getRefs
        } = this.props;
        const currUnit: number = map_form_ss_unit === undefined ? 2 : map_form_ss_unit;
        const components = data === undefined ? undefined : data.components;
        const fieldList: any[] = [];
        const currComList: any[] = [];
        const currRowList: any[] = [];
        const map_form_ss_tt_w: string = '80px';
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
                    case 'MapComponent/map/grid/field/InputField':
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
                    case 'MapComponent/map/grid/field/InputNumberField':
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
                    case 'MapComponent/map/grid/field/CheckBoxField':
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
                    case 'MapComponent/map/grid/field/LinkField':
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
                    case 'MapComponent/map/grid/field/RadioField':
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
                    case 'MapComponent/map/grid/field/SelectField':
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
                    case 'MapComponent/map/grid/field/TextAreaField':
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
                    case 'MapComponent/map/grid/field/DataTimeField':
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
                    case 'MapComponent/map/grid/field/LookUpField':
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
                    case 'MapComponent/map/grid/field/InputIconField':
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
                    case 'MapComponent/map/grid/field/TextField':
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
                    case 'MapComponent/map/grid/field/UploadField':
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
                    fieldList[Math.floor(index / currUnit)].push(field);
                    currComList[Math.floor(index / currUnit)].push(com);
                }
            });
        }
        fieldList.forEach((row: any, index: number) => {
            currRowList.push(
                <Droppable key={index} droppableId={`${index}`} direction="horizontal">
                    {
                        (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
                            (
                                <div
                                    className="field-list"
                                    ref={provided.innerRef}
                                    style={this.getListStyle(snapshot.isDraggingOver)}
                                >
                                    {row}
                                </div>
                            )
                    }
                </Droppable>
            );
        });
        this.rowList = currComList;

        return currRowList;
    }

    private getListStyle = (isDraggingOver: any) => ({
        background: isDraggingOver ? 'lightblue' : ''
    })

    private dragChangeField = (newFieldList: any) => {
        this.props.updateProps(this.props.id, { p: { components: newFieldList } });
    }
}
