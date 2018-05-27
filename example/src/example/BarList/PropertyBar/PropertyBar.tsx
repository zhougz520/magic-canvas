import * as React from 'react';
import 'rc-color-picker/assets/index.css';
import { Button, Input, Switch, Slider} from 'antd';
import { PropertiesEnum } from '../../../../../src';
import { List, fromJS, Map } from 'immutable';
import ColorPicker from 'rc-color-picker';

const {TextArea} = Input;

export interface IPropertyProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    onPropsBarCollapse: (collapsed: boolean) => void;
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
    clearPropertyState: () => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export class PropertyBar extends React.PureComponent<IPropertyProps, IPropertyState>
                            implements IPropertyComponent {
    activeKey: string = '';
    activeValue: any = undefined;

    constructor(props: IPropertyProps) {
        super(props);
        this.state = {
            showProps: true,
            propsContent: List()
        };
        this.HandleChangeTextValue = this.HandleChangeTextValue.bind(this);
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

    clearPropertyState = () => {
        this.setState({propsContent:  fromJS([])});
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
    onSwitchChange = (e: any) => {
        const pKey = e.target.parentNode.id;
        const checkValue = e.target.className.indexOf('checked') === -1 ? true : false;
        this.props.onFireProperties(pKey, checkValue);
    }

    render() {
        const { collapsed, titleBarCollapsed } = this.props;
        const { showProps } = this.state;

        const propertyElem = (propertiesItem: Map<any, any>) => {
            switch (propertiesItem.get('pType')) {
                case PropertiesEnum.SWITCH: return (
                    <div
                        id={propertiesItem.get('pKey')}
                        onClick={this.onSwitchChange}
                    >
                        <Switch
                            defaultChecked={propertiesItem.get('pValue')}
                            key={propertiesItem.get('pKey')}
                        />
                    </div>
                );
                case PropertiesEnum.INPUT_TEXT: return (
                    <TextArea
                        rows={4}
                        id={propertiesItem.get('pKey')}
                        onBlur={this.HandleChangeStringValue}
                        defaultValue={propertiesItem.get('pValue')}
                        autosize={false}
                        key={propertiesItem.get('pKey')}
                    />
                );

                case PropertiesEnum.INPUT_LIST:
                    const  valuelist = this.getInputList(propertiesItem);

                    return (
                        <div>
                            <TextArea
                                rows={4}
                                onBlur={this.onBlurTextValue}
                                value={valuelist}
                                id={propertiesItem.get('pKey')}
                                onChange={this.HandleChangeTextValue}
                            />
                        </div>
                    );
                case PropertiesEnum.INPUT_OBJECT_LIST:
                    const  labellist = this.getInputList(propertiesItem);

                    return (
                        <div>
                            <TextArea
                                rows={4}
                                onBlur={this.onBlurTextValue}
                                id={propertiesItem.get('pKey')}
                                onChange={this.HandleChangeTextValue}
                                value={labellist}
                            />
                        </div>
                    );

                case PropertiesEnum.INPUT_NUMBER:

                return (
                    <Input
                        type="number"
                        onBlur={this.onBlur}
                        onPressEnter={this.onBlur}
                        defaultValue={propertiesItem.get('pValue')}
                        name={propertiesItem.get('pKey')}
                        key={propertiesItem.get('pKey')}

                    />
                );
                case PropertiesEnum.INPUT_STRING:
                const stringValue = propertiesItem.get('pValue');

                return (
                    <Input
                        type="text"
                        onBlur={this.HandleChangeStringValue}
                        onChange={this.HandleChangeStringValue}
                        onPressEnter={this.HandleChangeStringValue}
                        value={stringValue}
                        id={propertiesItem.get('pKey')}
                        key={propertiesItem.get('pKey')}
                    />
                );

                case PropertiesEnum.COLOR_PICKER:

                return (
                    <div
                        id={propertiesItem.get('pKey')}
                        onClick={this.GetColorKey}
                        key={propertiesItem.get('pKey')}
                    >
                        <ColorPicker
                            color={propertiesItem.get('pValue')}
                            onClose={this.SetColorValue}
                            enableAlpha={false}
                        />
                    </div>
                );

                case PropertiesEnum.SLIDER:
                return (
                    <div
                        onClick={this.GetSliderKey}
                        id={propertiesItem.get('pKey')}
                        key={propertiesItem.get('pKey')}
                    >
                        <Slider
                            max={10}
                            defaultValue={propertiesItem.get('pValue')}
                            onAfterChange={this.SetSliderValue}
                        />
                    </div>
                );

                default: return (
                <Input
                    onBlur={this.onBlur}
                    onPressEnter={this.onBlur}
                    defaultValue={propertiesItem.get('pValue')}
                    id={propertiesItem.get('pKey')}
                    key={propertiesItem.get('pKey')}
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
                    className={`props-bar${collapsed ? ' collapsed' : ''}${titleBarCollapsed ? ' title-bar-collapsed' : ''}${showProps ? ' props-bar-show' : ' props-bar-hide'}`}
                    style={{zIndex: 10}}
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

    private HandleChangeTextValue = (e: any) => {
        // 处理文本域输入的换行符
        let optionsString = e.target.value.replace(/\n/g, '_@').replace(/\r/g, '_#');
        optionsString = optionsString.replace(/_#_@/g, '<br/>'); // IE7-8
        optionsString = optionsString.replace(/_@/g, '<br/>'); // IE9、FF、chrome
        // optionsString = optionsString.replace(/\s/g, '&nbsp;'); // 空格处理
        optionsString = optionsString.replace(/(<br\/>){2,}/g, '<br/>'); // 如有多个换行符连续相连，则替换成一个换行符
        // optionsString = optionsString.replace(/<br\/\>$/, ''); // 如末尾有换行符，则替换掉
        const optionList: string[] = optionsString.split('<br/>');
        const optionListTemp = optionList;
        // 去除重复的选项
        for (let i = optionList.length - 1 ; i > 0; i--) {
            for (let j = i - 1; 0 < j; j--) {
                if (optionList[i] === optionList[j]) {
                    optionListTemp.splice(i, 1);
                }
            }
        }

        let properties = this.state.propsContent;
        const pKeyContent = e.target.id;
        const optionProperty: Map<any, any> = properties.toArray()
                .filter((item) => item.get('pKey') === pKeyContent)[0];
        const index = properties.indexOf(optionProperty);
        const optionPropertyValue = optionProperty.get('pValue');
        if ( typeof(optionPropertyValue.toArray()[0]) === 'string') {
            this.props.onFireProperties(e.target.id.split('*')[0], fromJS(optionList));

            properties = properties.setIn([index, 'pValue'], fromJS(optionList));
            this.setState({propsContent: properties});
        } else {
            let newOptionPropertyValue = List<Map<any, any>>();
            for (let i = 0; i < optionListTemp.length; i++) {
                let optionItem =  Map();
                optionItem = optionItem.set('label', optionListTemp[i]);
                optionItem = optionItem.set('value', optionListTemp[i]);

                newOptionPropertyValue = newOptionPropertyValue.push(optionItem);
            }
            properties = properties.setIn([index, 'pValue'], newOptionPropertyValue);
            this.setState({propsContent: properties});

            this.props.onFireProperties(pKeyContent, newOptionPropertyValue);
        }

    }

    private onBlurTextValue = (e: any) => {

        let optionsString = e.target.value.replace(/\n/g, '_@').replace(/\r/g, '_#');

        optionsString = optionsString.replace(/_#_@/g, '<br/>'); // IE7-8
        optionsString = optionsString.replace(/_@/g, '<br/>'); // IE9、FF、chrome
        // optionsString = optionsString.replace(/\s/g, '&nbsp;'); // 空格处理
        optionsString = optionsString.replace(/(<br\/>){2,}/g, '<br/>'); // 如有多个换行符连续相连，则替换成一个换行符
        optionsString = optionsString.replace(/<br\/\>$/, ''); // 如末尾有换行符，则替换掉
        const optionList: string[] = optionsString.split('<br/>');
        const optionListTemp = optionList;
        // 去除重复的选项
        for (let i = optionList.length - 1 ; i > 0; i--) {
            for (let j = i - 1; 0 < j; j--) {
                if ( optionList[i] === '' || optionList[i] === optionList[j]) {
                    optionListTemp.splice(i, 1);
                }
            }
        }

        let properties = this.state.propsContent;
        const pKeyContent = e.target.id;
        const optionProperty: Map<any, any> = properties.toArray()
                .filter((item) => item.get('pKey') === pKeyContent)[0];
        const index = properties.indexOf(optionProperty);
        const optionPropertyValue = optionProperty.get('pValue');
        // TODO optionPropertyValue.toArray is not a function
        if ( typeof(optionPropertyValue.toArray()[0]) === 'string') {
            this.props.onFireProperties(e.target.id.split('*')[0], fromJS(optionList));

            properties = properties.setIn([index, 'pValue'], fromJS(optionList));
            this.setState({propsContent: properties});
        } else {
            let newOptionPropertyValue = List<Map<any, any>>();
            for (let i = 0; i < optionListTemp.length; i++) {
                let optionItem =  Map();
                optionItem = optionItem.set('label', optionListTemp[i]);
                optionItem = optionItem.set('value', optionListTemp[i]);

                newOptionPropertyValue = newOptionPropertyValue.push(optionItem);
            }
            properties = properties.setIn([index, 'pValue'], newOptionPropertyValue);
            this.setState({propsContent: properties});

            this.props.onFireProperties(pKeyContent, newOptionPropertyValue);
        }

    }

    private HandleChangeStringValue = (e: any) => {
        const pKeyContent = e.target.id;
        let properties = this.state.propsContent;
        const optionProperty: Map<any, any> = properties.toArray()
            .filter((item) => item.get('pKey') === pKeyContent)[0];
        const index = properties.indexOf(optionProperty);
        properties = properties.setIn([index, 'pValue'], e.target.value);
        this.setState({propsContent: properties});
        this.props.onFireProperties(pKeyContent, e.target.value);

    }

    // 获取取色器的id 也就是组件属性对应的pKey
    private GetColorKey = (e: any) => {
        this.activeKey = e.target.parentNode.parentNode.id;

    }

    // 获取取色器改变后的颜色 并修改组件属性pKey对应的pValue
    private SetColorValue = (colorPicker: any) => {
        if (this.activeKey !== '') {
            let properties = this.state.propsContent;
            const optionProperty: Map<any, any> = properties.toArray()
                .filter((item) => item.get('pKey') === this.activeKey)[0];
            const index = properties.indexOf(optionProperty);
            properties = properties.setIn([index, 'pValue'], colorPicker.color);
            this.setState({propsContent: properties});
            this.props.onFireProperties(this.activeKey, colorPicker.color);
            this.activeKey = '';
        }
    }

    // 获取边框宽细的id 也就是组件属性对应的pKey
    private GetSliderKey = (e: any) => {
        if (this.activeValue !== undefined && this.activeValue !== null) {
            const pKey = e.target.parentNode.id === undefined || e.target.parentNode.id === '' ? e.target.parentNode.parentNode.id : e.target.parentNode.id;
            let properties = this.state.propsContent;
            const optionProperty: Map<any, any> = properties.toArray()
                .filter((item) => item.get('pKey') === pKey)[0];
            const index = properties.indexOf(optionProperty);
            properties = properties.setIn([index, 'pValue'], this.activeValue);
            this.setState({propsContent: properties});
            this.props.onFireProperties(pKey, this.activeValue);
            this.activeValue = undefined;
        }
    }

    private SetSliderValue = (inputNum: number) => {
        this.activeValue = inputNum;
    }

}
