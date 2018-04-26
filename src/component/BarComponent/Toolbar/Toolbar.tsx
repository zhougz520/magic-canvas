import * as React from 'react';

import { IToolbarProps, IToolbarState, IToolbarComponent } from './types';
import { CommandMap } from '../../CanvasComponent/inedx';
import { config } from '../../config';

import { Switch, Button } from 'antd';
import { Map } from 'immutable';

import '../sass/bar.scss';

export class Toolbar extends React.PureComponent<IToolbarProps, IToolbarState> implements IToolbarComponent {
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
        config.highPerformance = e;
    }

    /**
     * 发射命令
     */
    fireCommand = (cmd: any) => {
        this.props.onCommandEmitted(cmd);
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
                    style={{marginLeft: 'auto', marginRight: '300px'}}
                >
                    <Button
                        type="primary"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.fireCommand(CommandMap.DEMO_COMMAND)}
                    >
                        批注
                    </Button>
                </div>
            </div>
        );
    }

}
