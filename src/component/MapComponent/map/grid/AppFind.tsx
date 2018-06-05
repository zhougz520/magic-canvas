import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../../index';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Checkbox, Select, Input, Button } from 'antd';
import {
    InputField,
    // InputNumberField,
    // SelectField,
    // DataTimeField,
    // LookUpField,
    // NullField
} from '../form/field';
import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';
const Option = Select.Option;
// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-wrap-multiline
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
        selectedId: undefined,
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
            // console.log('id', this.props.id);
            if (currMaskLayer !== null) {
                currMaskLayer.style.width = this.com.offsetWidth + 'px';
                currMaskLayer.style.height = (this.com.offsetHeight - 24) + 'px';
                currMaskLayer.style.top = (this.com.offsetTop + 24) + 'px';
                currMaskLayer.style.left = this.com.offsetLeft + 'px';
            }
        }
    }
    public render() {
        const { map_sm, map_af_o, p, id } = this.props;
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
            <div className="normal">
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
                        <Droppable droppableId="droppable" direction="horizontal">
                            {fieldList}
                        </Droppable>
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
            <div className="csr-pc-map-app-find" ref={(ref) => this.com = ref}>
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
    private initHightMode = (data: any) => {
        const { map_form_ss_unit, selectComChange, updateProps, selectedId } = this.props;
        const currUnit: number = map_form_ss_unit === undefined ? 2 : map_form_ss_unit;
        const components = data === undefined ? undefined : data.components;
        const rowList: any[] = [];
        let fieldList: any = null;
        if (components !== undefined) {
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
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                            updateProps={updateProps}
                            selectedId={selectedId}
                        />;
                        break;
                    case 'MapComponent/map/form/field/InputNumberField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/CheckBoxField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/LinkField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/RadioField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/SelectField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/TextAreaField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/DataTimeField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/LookUpField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                    case 'MapComponent/map/form/field/NullField':
                        field = <InputField
                            titleWidth={110}
                            key={p.id}
                            {...p}
                            unit={1}
                            currUnit={currUnit}
                            ref={`c.${p.id}`}
                            selectComChange={selectComChange}
                        />;
                        break;
                }

                if (field !== null) {
                    rowList.push(field);
                }
            });
        }

        fieldList = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
            (
                <div
                    className="field-list"
                    ref={provided.innerRef}
                >
                    {rowList}
                </div>
            );

        return fieldList;
    }
}
