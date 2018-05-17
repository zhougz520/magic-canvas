import * as React from 'react';

import { IToolbarProps, IToolbarState, IToolbarComponent } from './types';
import { CommandMap } from '../../Canvas';

import { Switch, Button, Dropdown, Menu, Icon } from 'antd';
import { Map } from 'immutable';

import '../sass/bar.scss';

export class ToolBar extends React.PureComponent<IToolbarProps, IToolbarState> implements IToolbarComponent {
    constructor(props: IToolbarProps) {
        super(props);
        this.state = {
            selectedComs: Map()
        };
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
    fireCommand = (cmd: any) => {
        this.props.onCommandEmitted(
            {
                t: cmd,
                d: {
                    value: '我是批注1'
                }
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
    setCommandState = (selectedComs: Map<string, any>) => {
        this.setState(
            {
                selectedComs
            }
        );
    }

    render() {
        const { titleBarCollapsed } = this.props;
        const { selectedComs } = this.state;
        const comList: any = [];
        selectedComs.map(
            (com, key) => {
                comList.push(key);
            }
        );

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
                <Menu.Item key="centerCom">水平居中</Menu.Item>
                <Menu.Item key="rightCom">右对齐</Menu.Item>
                <Menu.Item key="topCom">顶对齐</Menu.Item>
                <Menu.Item key="middleCom">垂直居中</Menu.Item>
                <Menu.Item key="bottomCom">底对齐</Menu.Item>
                <Menu.Item key="horizontalCom">水平等间距</Menu.Item>
                <Menu.Item key="verticalCom">垂直等间距</Menu.Item>
            </Menu>
        );

        return (
            <div className={`command-bar ${titleBarCollapsed ? 'title-bar-collapsed' : ''}`}>
                <div onClick={this.onClick}>折叠</div>
                <div>
                    <span>高性能</span>
                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={this.onChange} />
                </div>
                <div>
                    当前选中组件：{comList.join('|')}
                </div>
                <div
                    style={{marginLeft: 'auto', marginRight: '50px'}}
                >
                    <Button
                        type="primary"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.fireCommand(CommandMap.EDITOR_BOLD)}
                    >
                        加粗
                    </Button>&nbsp;&nbsp;
                    <Button
                        type="primary"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.fireCommand(CommandMap.EDITOR_ITALIC)}
                    >
                        斜体
                    </Button>
                </div>
                <div
                    style={{marginRight: '50px'}}
                >
                    <Dropdown overlay={menuAlign}>
                        <Button>
                            对齐 <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div>
                <div
                    style={{marginRight: '50px'}}
                >
                    <Dropdown overlay={menuZIndex}>
                        <Button>
                            图层 <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div>
                <div
                    style={{marginRight: '200px'}}
                >
                    <Button
                        type="primary"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.fireCommand(CommandMap.CANVAS_UNDO)}
                    >
                        撤销
                    </Button>&nbsp;&nbsp;
                    <Button
                        type="primary"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.fireCommand(CommandMap.CANVAS_REDO)}
                    >
                        重做
                    </Button>&nbsp;&nbsp;
                    <Button
                        type="primary"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.fireCommand(CommandMap.COMMENTS_ADD)}
                    >
                        批注
                    </Button>
                </div>
            </div>
        );
    }

}
