import * as React from 'react';

import { Button, Input, Switch, Icon} from 'antd';
import { PropertiesEnum, ComponentProperty } from '../config';
import { List, fromJS } from 'immutable';

import './sass/bar.scss';

const {TextArea} = Input;

export interface IPropertyProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    onPropsBarCollapse: (collapsed: boolean) => void;
    // setComponentProperties: (pName: string, pValue: any, pType: string) => void;
    onPropertyProperties: (currentCid: string) =>  ComponentProperty| undefined;
    // onPropertyProperties: ComponentProperty| undefined;

    onFireProperties: (cid: string, pProperties: {pKey: string, pValue: any}) => void;
}

export interface IPropertyState {
    showProps: boolean;
    propsContent: List<Map<any, any>>;
    onSelectedCid: string;

}

export interface IPropertyComponent {
    setPropertyState: (properties: ComponentProperty) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Property extends React.PureComponent<IPropertyProps, IPropertyState>
                            implements IPropertyComponent {
    constructor(props: IPropertyProps) {
        super(props);
        this.state = {
            showProps: true,
            propsContent: List(),
            onSelectedCid: ''
        };
    }

    setPropertyState = (properties: ComponentProperty) => {
        // const propertyList =  List<{pName: string, pValue: any, pType: string}>();
        const propertyList = fromJS(properties.componentProperties);
        // propertyList.merge(stateInput);
        this.setState(
            {
                propsContent: propertyList,
                onSelectedCid: properties.componentCid
            });
    }

    onSwitchChange = (checked: boolean) => {
        // const pPropertyName: string = EventTarget.arguments;
        // console.log(EventTarget);
        console.log(this.props.onPropertyProperties);
        this.props.onFireProperties(this.state.onSelectedCid, {pKey: '', pValue: checked});
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
        this.props.onFireProperties(
            this.state.onSelectedCid,
            {pKey: e.target.name, pValue: e.target.value}
        );
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
        const inputList = (inputProperty: List<{pTitle: string, pKey: string, pValue: any, pType: string}>): any => {
            const res: any = [];
            if (inputProperty.size === 0) {
                res.push(
                    <Input
                        type="text"
                        value={''}
                    />
                );
            } else {
                inputProperty.map((property) => {
                    if (property) {
                        res.push(
                            <Input
                                type="text"
                                key={property.pKey}
                                value={property.pValue}
                                name={property.pKey}
                            />
                        );
                    }
                });
            }

            return res;
        };

        const propertyElem = (propertiesItem: Map<any, any>) => {
            switch (propertiesItem.get('pValue')) {
                case PropertiesEnum.SWITCH: return (

                    <Switch
                        defaultChecked={propertiesItem.get('pValue')}
                        key={propertiesItem.get('pKey')}
                        onChange={this.onSwitchChange}
                    />
                );
                case PropertiesEnum.INPUT_TEXT: return (
                    <TextArea
                        rows={4}
                        defaultValue={propertiesItem.get('pValue')}
                        autosize={false}
                        value={''}
                        // onPressEnter={}
                        key={propertiesItem.get('pKey')}
                    />
                );
                case PropertiesEnum.INPUT_LIST: return (
                    <div>
                        <label>{propertiesItem.get('pTitle')}</label>
                        <Icon
                            type="plus"
                        />
                        <div >
                            {inputList(propertiesItem.get('pValue'))}
                        </div>
                    </div>
                );
                case PropertiesEnum.INPUT_NUMBER: return (
                    <Input
                        type="number"
                        onBlur={this.onBlur}
                        onPressEnter={this.onBlur}
                        defaultValue={propertiesItem.get('pValue')}
                        name={propertiesItem.get('pKey')}
                        key={propertiesItem.get('pKey')}

                    />
                );
                default: return (
                <Input
                    onBlur={this.onBlur}
                    onPressEnter={this.onBlur}
                    defaultValue={propertiesItem.get('pValue')}
                    name={propertiesItem.get('pKey')}
                    key={propertiesItem.get('pKey')}
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
                        <div key={content.get('pKey')}>
                            <span>{content.get('pTitle')}</span>
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
