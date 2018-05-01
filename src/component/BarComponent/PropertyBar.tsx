import * as React from 'react';
import { Button, Input, Switch} from 'antd';
import { PropertiesEnum } from '../config';
import { List, fromJS, Map } from 'immutable';

import './sass/bar.scss';

const {TextArea} = Input;

export interface IPropertyProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    onPropsBarCollapse: (collapsed: boolean) => void;
    // setComponentProperties: (pName: string, pValue: any, pType: string) => void;
    onPropertyProperties: (compProperty: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>) =>
        void;

    onFireProperties: (pKey: string, pValue: any) => void;
}

export interface IPropertyState {
    showProps: boolean;
    propsContent: List<Map<any, any>>;
}

export interface IPropertyComponent {
    setPropertyState: (properties: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Property extends React.PureComponent<IPropertyProps, IPropertyState>
                            implements IPropertyComponent {
    constructor(props: IPropertyProps) {
        super(props);
        this.state = {
            showProps: true,
            propsContent: List()
        };
    }

    setPropertyState = (properties: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>) => {
        // const propertyList =  List<{pName: string, pValue: any, pType: string}>();
        const propertyList = fromJS(properties);
        // propertyList.merge(stateInput);
        this.setState(
            {
                propsContent: propertyList
            });
    }

    onSwitchChange = (checked: boolean) => {
        // const pPropertyName: string = EventTarget.arguments;
        // console.log(EventTarget);
        console.log(this.props.onPropertyProperties);
        this.props.onFireProperties('', checked);
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
        this.props.onFireProperties( e.target.name, e.target.value);
    }

    render() {

        const { collapsed, titleBarCollapsed } = this.props;
        const { showProps } = this.state;

        const propertyElem = (propertiesItem: Map<any, any>) => {
            switch (propertiesItem.get('pType')) {
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

                case PropertiesEnum.INPUT_LIST:
                    const  valuelist = this.getInputList(propertiesItem);

                    return (
                        <div>
                            <TextArea
                                rows={4}
                                onBlur={this.setInputList}
                                defaultValue={valuelist}
                                id={propertiesItem.get('pKey')}
                            />
                        </div>
                    );
                case PropertiesEnum.INPUT_OBJECT_LIST:
                    const  labellist = this.getInputList(propertiesItem);

                    return (
                        <div>
                            <TextArea
                                rows={4}
                                onBlur={this.setInputList}
                                defaultValue={labellist}
                                id={propertiesItem.get('pKey')}
                            />
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

    // 将radio/checkbox/selector中的选择项 读取成文本域对应的格式
    private getInputList = (propertiesItem: Map<any, any>): string => {
        let labellist: string = '';
        for (let i = 0; i < propertiesItem.get('pValue').size; i++) {
            const item = propertiesItem.get('pValue').toArray()[i];
            let cr = '';
            if (i !== propertiesItem.get('pValue').size - 1) {
                if (navigator.userAgent.indexOf('Win') !== -1) {
                    cr = '\r\n';
                }
                if (navigator.userAgent.indexOf('Mac') !== -1) {
                    cr = '\r';
                }
                if (navigator.userAgent.indexOf('X11') !== -1
                    || navigator.userAgent.indexOf('Linux') !== -1) {
                    cr =  '\n';
                }
            }
            if ( typeof(item) === 'string') {
                labellist += item + cr;

            } else {
                labellist += item.get('label') + cr;
            }
        }

        return labellist;
    }

    private setInputList = (e: any) => {

        let newString = e.target.value.replace(/\n/g, '_@').replace(/\r/g, '_#');

        newString = newString.replace(/_#_@/g, '<br/>'); // IE7-8
        newString = newString.replace(/_@/g, '<br/>'); // IE9、FF、chrome
        newString = newString.replace(/\s/g, '&nbsp;'); // 空格处理
        newString = newString.replace(/\(<br\/\>\)*b/g, '<br/>'); // 如有多个换行符连续相连，则替换成一个换行符
        newString = newString.replace(/<br\/\>$/, ''); // 如末尾有换行符，则替换掉
        const optionList = newString.split('<br/>');
        const properties = this.state.propsContent;
        const pKeyContent = e.target.id;
        const optionProperty: Map<any, any> = properties.toArray()
                .filter((item) => item.get('pKey') === pKeyContent)[0];
        const optionPropertyValue = optionProperty.get('pValue');
        // TODO optionPropertyValue.toArray is not a function
        if ( typeof(optionPropertyValue.toArray()[0]) === 'string') {
            this.props.onFireProperties(e.target.name.split('*')[0], optionList);
        } else {
            let newOptionPropertyValue = List<Map<any, any>>();
            for (let i = 0; i < optionList.length; i++) {
                let optionItem =  Map();
                optionItem = optionItem.set('label', optionList[i]);
                optionItem = optionItem.set('value', i);

                newOptionPropertyValue = newOptionPropertyValue.push(optionItem);
            }
            this.props.onFireProperties(pKeyContent, newOptionPropertyValue);
        }

    }

}
