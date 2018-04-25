import * as React from 'react';
import { Button, Input, Switch} from 'antd';
import { PropertiesEnum, ComponentProperty } from '../config';
import { List } from 'immutable';

import './sass/bar.scss';

const {TextArea} = Input;

export interface IPropertyProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    onPropsBarCollapse: (collapsed: boolean) => void;
    // setComponentProperties: (pName: string, pValue: any, pType: string) => void;
    onPropertyProperties: (currentCid: string) =>  ComponentProperty| undefined;
    // onPropertyProperties: ComponentProperty| undefined;

    onFireProperties: (cId: string, pProperties: {pName: string, pValue: any, pType: string}) => void;
}

export interface IPropertyState {
    showProps: boolean;
    propsContent: List<{pName: string, pValue: any, pType: string}>;
    onSelectedCid: string;

}

export interface IPropertyComponent {
    setPropertyState: (cId: string, stateInput: Array<{pName: string, pValue: any, pType: string}>) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Property extends React.PureComponent<IPropertyProps, IPropertyState>
                            implements IPropertyComponent {
    constructor(props: IPropertyProps) {
        super(props);
        this.state = {
            showProps: true,
            propsContent: List<{pName: string, pValue: any, pType: string}>(),
            onSelectedCid: ''
        };
    }

    setPropertyState = (cId: string, stateInput: Array<{pName: string, pValue: any, pType: string}>) => {
        const propertyList =  List<{pName: string, pValue: any, pType: string}>();
        propertyList.merge(stateInput);
        this.setState(
            {
                propsContent: propertyList,
                onSelectedCid: cId
            });
    }

    onSwitchChange = (checked: boolean) => {
        const pPropertyName: string = EventTarget.arguments;
        console.log(EventTarget);
        console.log(this.props.onPropertyProperties);

        this.props.onFireProperties(this.state.onSelectedCid,
            {pName: pPropertyName, pValue: checked, pType: PropertiesEnum.SWITCH});
    }

        showProps = () => {
        this.collapse(false);
        this.setState({
            showProps: true
        });
    }

    onClick = () => {
        this.collapse(!this.props.collapsed);
    }

    collapse = (collapsed: boolean) => {
        this.props.onPropsBarCollapse(collapsed);
    }

    onBlur = (e: any) => {
        this.props.onFireProperties(this.state.onSelectedCid,
            {pName: e.target.name, pValue: e.target.value, pType: e.target.type});
    }

    addInputElem = (e: any) => {
        console.log(e);
        // (
        //     {pName: 'newInput', pValue: '', pType: PropertiesEnum.INPUT_LIST}
        // )
    }

    render() {

        const { collapsed, titleBarCollapsed } = this.props;
        const { showProps } = this.state;
        const inputList = (inputProperty: Array<{pName: string, pValue: any, pType: string}>): any => {
            const res = [];
            if (inputProperty.length === 0) {
                res.push(
                    <Input
                        type="text"
                        value={''}
                    />
                );
            } else {
                for (let i = 0; i < inputProperty.length; i++) {
                    res.push(
                        <Input
                            type="text"
                            key={i}
                            value={inputProperty[i].pValue}
                            name={inputProperty[i].pName}
                        />
                    );
                }
            }

            return res;
        };
        const propertyElem = (propertiesItem: {pName: string, pValue: any, pType: string}) => {
            switch (propertiesItem.pType) {
                case PropertiesEnum.SWITCH: return (

                    <Switch
                        defaultChecked={propertiesItem.pValue}
                        key={propertiesItem.pName}
                        onChange={this.onSwitchChange}
                    />
                );
                case PropertiesEnum.INPUT_TEXT: return (
                    <TextArea
                        rows={4}
                        defaultValue={propertiesItem.pValue}
                        autosize={false}
                        value={''}
                        // onPressEnter={}
                    />
                );
                case PropertiesEnum.INPUT_LIST: return (
                    <div>
                        <Button
                            onClick={this.addInputElem}
                        >添加
                        </Button>
                        <div >
                            {inputList(propertiesItem.pValue)}
                        </div>
                    </div>
                );
                case PropertiesEnum.INPUT_NUMBER: return (
                    <Input
                        type="number"
                        onBlur={this.onBlur}
                        onPressEnter={this.onBlur}
                        defaultValue={propertiesItem.pValue}
                        name={propertiesItem.pName}
                    />
                );
                default: return (
                <Input
                    onBlur={this.onBlur}
                    onPressEnter={this.onBlur}
                    defaultValue={propertiesItem.pValue}
                    name={propertiesItem.pName}
                    // value={propertiesItem.pValue}
                />);
            }
        };

        const propertyList = () => {
            const propertiesContent = this.state.propsContent;
            const res: any = [];
            propertiesContent.map((content) => {
                if (content) {
                    res.push(
                        <div key={content.pName}>
                            <span>{content.pName}</span>
                            {propertyElem(content)}
                        </div>
                    );
                }
            });

            return res;

        };

        const bar = () => {
            if (this.state.propsContent !== null && this.state.propsContent.size > 0 ) {
                return (
                    <div className="bar">
                        <div className="panel">
                            <div className={`props${showProps ? ' active' : ''}`}>
                                {showProps ? 'props-bar' : ''}
                                <br />
                                <Button type="primary" size="small">DemoClick</Button>
                                <Input placeholder="Basic usage" />
                            </div>
                        </div>
                        <div>
                            {propertyList()}
                        </div>
                    </div>
                );
            } else {
                    return (
                        <div className="bar">
                            <span>没有属性？没有选中控件？</span>
                        </div>
                    );
                }
        };

        return (
            <React.Fragment>
                <div
                    // tslint:disable-next-line:max-line-length
                    className={`props-bar${collapsed ? ' collapsed' : ''}${titleBarCollapsed ? ' title-bar-collapsed' : ''}${showProps ? ' props-bar-show' : ' props-bar-hide'}`}
                >
                    <div className="holder">
                        <div onClick={this.onClick}>折叠</div>
                    </div>
                    {collapsed ? '' : bar()}
                </div>
            </React.Fragment>
        );
    }

    // setComponentProperties = (pName: string, pValue: any, pType: string) => {}

}
