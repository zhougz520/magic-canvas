import * as React from 'react';
import { Switch } from 'antd';
import { config, CommandsEnum, ComponentProperty } from '../config';
import './bar.css';

export interface ICommandProps {
    titleBarCollapsed: boolean;
    onTitleBarCollapse: (collapsed: boolean) => void;
    onFireCommand: (cId: string, cProperty: {pKey: string, pValue: any}) => void;
    onCommandProperties: (currentCid: string) => ComponentProperty |undefined;
}

export interface ICommandState {
    onSelectedCid: string;
    propsContent: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>;
}

export const CommandItem = (props: any) => {
    return (
        <div key={CommandsEnum.PLACEHOLDER} >
            {/* <span onClick={{console.log('sldkjf');}}>A+</span> */}
        </div>
    );
};

export interface ICommandComponent {
    setCommandState: (properties: ComponentProperty) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Command<P extends ICommandProps, S extends ICommandState> extends React.PureComponent<P, S>
                        implements ICommandComponent {
    constructor(props: P) {
        super(props);
        this.state = {
            onSelectedCid: '',
            propsContent: new Array()
        } as Readonly<S>;
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
            {pKey: CommandsEnum.PLACEHOLDER, pValue: 'command change'});
    }

    setCommandState = (properties: ComponentProperty) => {
        this.setState({propsContent: properties.componentProperties, onSelectedCid: properties.componentCid});
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
