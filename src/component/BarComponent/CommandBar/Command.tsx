import * as React from 'react';

import { Switch } from 'antd';
import { config } from '../../config';
import { ICommandProps, ICommandState, ICommandComponent } from './types';
import { Map } from 'immutable';
import '../sass/bar.scss';

export class Command extends React.PureComponent<ICommandProps, ICommandState> implements ICommandComponent {
    constructor(props: ICommandProps) {
        super(props);
        this.state = {
            selectedComs: Map()
        };
    }

    onClick = (e: any) => {
        this.props.onTitleBarCollapse(!this.props.titleBarCollapsed);
    }

    onChange = (e: boolean) => {
        config.highPerformance = e;
    }

    onTooListClick = (e: any) => {
        // this.props.onFireCommand(this.state.onSelectedCid,
        //     {pName: CommandsEnum.PLACEHOLDER, pValue: 'command change', pType: 'text'});
    }

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
            </div>
        );
    }

}
