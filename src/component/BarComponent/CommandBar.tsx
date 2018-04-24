import * as React from 'react';
import { Switch } from 'antd';
import { config, CommandsEnum, ComponentProperty } from '../config';
import './bar.css';

export interface ICommandProps {
    titleBarCollapsed: boolean;
    onTitleBarCollapse: (collapsed: boolean) => void;
    onFireCommand: (cId: string, cProperty: {pName: string, pValue: any, pType: string}) => void;
    onCommandProperties: (currentCid: string) => ComponentProperty |undefined;
}

export interface ICommandState {
    onSelectedCid: string;
    propsContent: Array<{pName: string, pValue: any, pType: string}>;
}

export const CommandItem = (props: any) => {
    return (
        <div key={CommandsEnum.PLACEHOLDER} >
            {/* <span onClick={{console.log('sldkjf');}}>A+</span> */}
        </div>
    );
};

export interface ICommandComponent {
    setCommandState: (cId: string, stateInput: Array<{pName: string, pValue: any, pType: string}>) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Command extends React.PureComponent<ICommandProps, ICommandState> implements ICommandComponent {
    constructor(props: ICommandProps) {
        super(props);
        this.state = {
            onSelectedCid: '',
            propsContent: new Array()
        };
    }

    onClick = (e: any) => {
        this.props.onTitleBarCollapse(!this.props.titleBarCollapsed);
    }

    onChange = (e: boolean) => {
        config.highPerformance = e;
    }

    onTooListClick = (e: any) => {
        // alert('dsdf');
        console.log('你点击了command的element');
        console.log(this.props.onCommandProperties);
        this.props.onFireCommand(this.state.onSelectedCid,
            {pName: CommandsEnum.PLACEHOLDER, pValue: 'command change', pType: 'text'});
    }

    setCommandState = (cId: string, stateInput: Array<{pName: string, pValue: any, pType: string}>) => {
        this.setState({propsContent: stateInput, onSelectedCid: cId});
    }

    render() {
        const { titleBarCollapsed } = this.props;
        // console.log('编辑中组件的属性：' + this.props.onCommandProperties());

        return (
            <React.Fragment>
                <div className={`command-bar ${titleBarCollapsed ? 'title-bar-collapsed' : ''}`}>
                    <div onClick={this.onClick}>折叠</div>
                    <div>
                        <span>高性能</span>
                        <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={this.onChange} />
                    </div>
                    <div>
                        <div key={CommandsEnum.PLACEHOLDER + 'd'} >
                            <span
                                className={CommandsEnum.PLACEHOLDER}
                                onClick={this.onTooListClick}
                            >
                                A+
                            </span>
                    </div>
                        {/* <CommandItem props={this.props}/> */}
                    </div>
                </div>
            </React.Fragment>
        );
    }

}
