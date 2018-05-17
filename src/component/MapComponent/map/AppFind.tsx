import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../index';
import { Checkbox, Select, Input, Button } from 'antd';
// import { MaskLayer } from '../../BaseComponent/mask/MaskLayer';
const Option = Select.Option;

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
    // componentWillMount() {
    //     console.log(this.com);
    // }
    // componentDidMount() {
    //     if (this.com) {
    //         console.log(this.com);
    //     }
    // }

    public render() {
        const { map_sm, map_af_o, p } = this.props;
        const { map_af_se } = this.state;

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
            <div className="csr-pc-map-app-find" ref={(ref) => this.com = ref}>
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
            <table className="csr-pc-map-app-find" ref={(ref) => this.com = ref}>
                <tbody>
                    <tr>
                        <td>
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
                            <div className="app-find-content">
                                {fieldList}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ width: '100%', height: '30px', verticalAlign: 'top' }}>
                            <Button>
                                重置
                            </Button>
                            <Button>
                                查找
                            </Button>
                            <Button>
                                保存
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>);

        return (
            <div>
                {!map_af_se ? normalFind : extendFind}
                {/* <MaskLayer /> */}
            </div>);
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

    private initHightMode = (data: any) => {
        const { map_form_ss_unit } = this.props;
        const currUnit: number = map_form_ss_unit === undefined ? 2 : map_form_ss_unit;
        const components = data === undefined ? undefined : data.components;
        const rowList: any[] = [];

        let fieldList: any = null;
        if (components !== undefined) {
            let rowNum = 2;
            let fieldRow: any[] = [];
            components.forEach((com: any, index: number) => {
                const { t, p } = com;
                if (p.map_form_f_cols === undefined) {
                    p.map_form_f_cols = 1;
                }
                let field: any = '';

                switch (t) {
                    case 'pc/map/form/field/InputField':
                        // field = <InputField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        field = 'AAAA';
                        break;
                    case 'pc/map/form/field/InputNumberField':
                        // field =
                        //     <InputNumberField titleWidth={110} key={p.id} {...p} unit={2}
                        //         ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/CheckBoxField':
                        // field = <CheckBoxField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/LinkField':
                        // field = <LinkField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/RadioField':
                        // field = <RadioField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/SelectField':
                        // field = <SelectField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/TextAreaField':
                        // field = <TextAreaField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/DataTimeField':
                        // field = <DataTimeField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/LookUpField':
                        // field = <LookUpField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                    case 'pc/map/form/field/NullField':
                        // field = <NullField titleWidth={110} key={p.id} {...p} unit={2}
                        //     ref={`c.${p.id}`} />;
                        break;
                }
                // 每加载一个控件，就判断是否换行
                rowNum = rowNum - p.map_form_f_cols;
                if (rowNum === 0) {
                    fieldRow.push(<td key={index} className="fieldList-td" colSpan={p.map_form_f_cols}>{field}</td>);
                    rowList.push(<tr key={index} className="fieldList-tr">{fieldRow}</tr>);
                    // 重置行
                    fieldRow = [];
                    rowNum = currUnit;
                } else if (rowNum < 0) {
                    fieldRow.push(
                        <td key={index} className="fieldList-td" colSpan={rowNum + p.map_form_f_cols}>{``}</td>
                    );
                    // 添加现有行
                    rowList.push(<tr key={index} className="fieldList-tr">{fieldRow}</tr>);
                    // 重置行
                    fieldRow = [];
                    // 将当前field添加到新行
                    fieldRow.push(
                        <td
                            key={index}
                            className="fieldList-td"
                            style={{ width: `${p.map_form_f_cols * 100 / currUnit}%` }}
                            colSpan={p.map_form_f_cols}
                        >
                            {field}
                        </td>);
                    rowNum = - p.map_form_f_cols;
                } else {
                    fieldRow.push(
                        <td
                            key={index}
                            className="fieldList-td"
                            style={{ width: `${p.map_form_f_cols * 100 / currUnit}%` }}
                            colSpan={p.map_form_f_cols}
                        >
                            {field}
                        </td>);
                }
                // 如果是最后一次循环，但是还没有填满行，则直接新增行
                if (index === components.length - 1) {
                    if (rowNum > 0) {
                        fieldRow.push(
                            <td
                                key={index + 1}
                                className="fieldList-td"
                                colSpan={rowNum}
                            >
                                {``}
                            </td>);
                    }
                    // 添加现有行
                    rowList.push(<tr key={index + 1} className="fieldList-tr">{fieldRow}</tr>);
                }
            });

            if (rowList.length > 0) {
                fieldList = (
                    <table
                        className="fieldList-tb"
                    >
                        <tbody>
                            {rowList}
                        </tbody>
                    </table>);
            }
        }

        return fieldList;
    }

}
