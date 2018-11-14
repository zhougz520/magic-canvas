import * as React from 'react';

import { IToolbarProps, IToolbarState, IToolbarComponent } from './types';
import { CommandMap, getListStyleTypeMap, IToolButtonGroup, emptyButtonGroup } from '../../../../../src';

import { SketchPicker } from 'react-color';
import { Switch, Button, Dropdown, Menu, Icon, InputNumber, Radio, Popover } from 'antd';

import '../sass/bar.scss';

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda */
export class ToolBar extends React.PureComponent<IToolbarProps, IToolbarState> implements IToolbarComponent {
    constructor(props: IToolbarProps) {
        super(props);
        this.state = emptyButtonGroup;
    }

    // 折叠
    onClick = (e: any) => {
        this.props.onTitleBarCollapse(!this.props.titleBarCollapsed);
    }

    // 高性能开关
    onChange = (e: boolean) => {
        this.props.highPerformance(e);
    }

    /**
     * 发射命令
     */
    fireCommand = (cmd: any, param: any = null) => {
        this.props.onCommandEmitted(
            {
                t: cmd,
                d: param
            }
        );
    }

    handleZIndexMenuClick = (e: any) => {
        const { key } = e;
        switch (key) {
            case 'upperCom':
                this.fireCommand(CommandMap.COM_UPPER);
                break;
            case 'lowerCom':
                this.fireCommand(CommandMap.COM_LOWER);
                break;
            case 'frontCom':
                this.fireCommand(CommandMap.COM_FRONT);
                break;
            case 'backCom':
                this.fireCommand(CommandMap.COM_BACK);
                break;
        }
    }

    handleAlignMenuClick = (e: any) => {
        const { key } = e;
        switch (key) {
            case 'leftCom':
                this.fireCommand(CommandMap.COM_LEFT);
                break;
            case 'centerCom':
                this.fireCommand(CommandMap.COM_CENTER);
                break;
            case 'rightCom':
                this.fireCommand(CommandMap.COM_RIGHT);
                break;
            case 'topCom':
                this.fireCommand(CommandMap.COM_TOP);
                break;
            case 'middleCom':
                this.fireCommand(CommandMap.COM_MIDDLE);
                break;
            case 'bottomCom':
                this.fireCommand(CommandMap.COM_BOTTOM);
                break;
            case 'horizontalCom':
                this.fireCommand(CommandMap.COM_HORIZONTAL);
                break;
            case 'verticalCom':
                this.fireCommand(CommandMap.COM_VERTICAL);
                break;
        }
    }

    /**
     * 设置选中组件，由画布调用
     * @param selectedComs 选中的组件集合
     */
    setCommandState = (buttonGroup: IToolButtonGroup) => {
        this.setState(
            {
                ...buttonGroup
            }
        );
    }

    changeColor = (color: any) => {
        this.fireCommand(CommandMap.EDITOR_FONTCOLOR, color);
    }

    doSaveData = () => {
        this.props.getSaveData();
    }

    render() {
        const { titleBarCollapsed } = this.props;
        const { fontSize, fontColor } = this.state;

        const menuZIndex = (
            <Menu onClick={this.handleZIndexMenuClick}>
                <Menu.Item key="upperCom">上移一层</Menu.Item>
                <Menu.Item key="lowerCom">下移一层</Menu.Item>
                <Menu.Item key="frontCom">置于顶层</Menu.Item>
                <Menu.Item key="backCom">置于底层</Menu.Item>
            </Menu>
        );

        const menuAlign = (
            <Menu onClick={this.handleAlignMenuClick}>
                <Menu.Item key="leftCom">左对齐</Menu.Item>
                <Menu.Item key="centerCom">左右居中</Menu.Item>
                <Menu.Item key="rightCom">右对齐</Menu.Item>
                <Menu.Item key="topCom">顶端对齐</Menu.Item>
                <Menu.Item key="middleCom">上下居中</Menu.Item>
                <Menu.Item key="bottomCom">底端对齐</Menu.Item>
                <Menu.Item key="horizontalCom">横向分布</Menu.Item>
                <Menu.Item key="verticalCom">纵向分布</Menu.Item>
            </Menu>
        );

        const colorPicker = (
            <SketchPicker
                color={fontColor.value}
                onChangeComplete={(color) => this.changeColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)}
            />
        );

        return (
            <div className={`command-bar ${titleBarCollapsed ? 'title-bar-collapsed' : ''}`}>
                <div onClick={this.onClick}>折叠</div>
                <div>
                    <span>高性能</span>
                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={this.onChange} />
                </div>

                <Button
                    onClick={() => this.fireCommand(CommandMap.EDITOR_BOLD)}
                    size="small"
                >
                    加粗
                </Button>
                <Button
                    onClick={() => this.fireCommand(CommandMap.EDITOR_ITALIC)}
                    size="small"
                >
                    斜体
                </Button>
                <Button
                    onClick={() => this.fireCommand(CommandMap.EDITOR_UNDERLINE)}
                    size="small"
                >
                    下划线
                </Button>
                <Button
                    onClick={() => this.fireCommand(CommandMap.EDITOR_STRIKETHROUGH)}
                    size="small"
                >
                    删除线
                </Button>
                <Popover placement="rightTop" content={colorPicker} trigger="hover">
                    <div className="colorButton">
                        <div
                            className="colorButton-inner"
                            style={{
                                background: fontColor.value
                            }}
                        />
                    </div>
                </Popover>
                <InputNumber
                    min={1}
                    max={100}
                    style={{ width: 50 }}
                    size="small"
                    defaultValue={fontSize.value}
                    onChange={(value: any) => this.fireCommand(CommandMap.EDITOR_FONTSIZE, value)}
                />&nbsp;
                <ListTypeControls
                    // tslint:disable-next-line:jsx-no-lambda
                    onToggle={(e: any) => this.fireCommand(CommandMap.EDITOR_UL, e.key)}
                    type={'UL'}
                    list={UL_TYPE}
                />&nbsp;
                <ListTypeControls
                    // tslint:disable-next-line:jsx-no-lambda
                    onToggle={(e: any) => this.fireCommand(CommandMap.EDITOR_OL, e.key)}
                    type={'OL'}
                    list={OL_TYPE}
                />&nbsp;
                <TextAlignControls
                    // tslint:disable-next-line:jsx-no-lambda
                    onToggle={(e: any) => this.fireCommand(CommandMap.EDITOR_TEXTALIGN, e.target.value)}
                />&nbsp;
                <Dropdown overlay={menuAlign}>
                    <Button size="small">
                        对齐 <Icon type="down" />
                    </Button>
                </Dropdown>
                <Dropdown overlay={menuZIndex}>
                    <Button size="small">
                        图层 <Icon type="down" />
                    </Button>
                </Dropdown>&nbsp;
                <Button
                    size="small"
                    onClick={() => this.fireCommand(CommandMap.CANVAS_UNDO)}
                >
                    撤销
                </Button>
                <Button
                    size="small"
                    onClick={() => this.fireCommand(CommandMap.CANVAS_REDO)}
                >
                    重做
                </Button>
                <Button
                    size="small"
                    onClick={() => this.fireCommand(CommandMap.COMMENTS_ADD)}
                >
                    批注
                </Button>
                <Button
                    size="small"
                    onClick={() => this.fireCommand(CommandMap.INIT_TEMPLATE, { cid: 'cm1', template: 'ct1.ct1' })}
                >
                    加载批注模版
                </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                    size="small"
                    onClick={() => this.fireCommand(CommandMap.INIT_TEMPLATE, { cid: 'cs1', template: 'ct1.ct1' })}
                >
                    加载表格模版
                </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                    size="small"
                    onClick={() => this.fireCommand(CommandMap.MAGNIFIER_ADD, 'cs1')}
                >
                    放大镜
                </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                    type="primary"
                    size="small"
                    onClick={() => this.doSaveData()}
                >
                    保存
                </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <InputNumber
                    size="small"
                    style={{ width: 60 }}
                    min={0.5}
                    max={2}
                    step={0.1}
                    defaultValue={1}
                    onChange={(value: any) => this.props.setScale(value)}
                />
            </div>
        );
    }

}

const UL_TYPE = getListStyleTypeMap().get('unordered-list-item').toJS();
const OL_TYPE = getListStyleTypeMap().get('ordered-list-item').toJS();
const ListTypeControls: any = (props: any) => {
    const menu = (
        <Menu onClick={props.onToggle}>
            {
                props.list.map(
                    (type: any) => {
                        return <Menu.Item key={type}>{type}</Menu.Item>;
                    }
                )
            }
        </Menu>
    );

    return (
        <Dropdown.Button onClick={props.onToggle} overlay={menu} size="small">
            {props.type}
        </Dropdown.Button>
    );
};

const TEXT_ALIGN = ['left', 'center', 'right'];
const TextAlignControls: any = (props: any) => {
    return (
        <Radio.Group onChange={props.onToggle} size="small">
            {
                TEXT_ALIGN.map(
                    (align: any) => {
                        return <Radio.Button value={align} key={align}>{align}</Radio.Button>;
                    }
                )
            }
        </Radio.Group>
    );
};
