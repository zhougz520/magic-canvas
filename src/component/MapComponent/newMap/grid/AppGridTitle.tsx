import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

import { OrderedSet, List } from 'immutable';

export interface IAppGridTitleProps extends IBaseProps {
    map_gt_txt?: string;        // 标题
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridTitleState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridTitle extends MapComponent<IAppGridTitleProps, IAppGridTitleState> {
    static defaultProps = {
        map_gt_txt: '标题'
    };

    constructor(props: IAppGridTitleProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_gt_txt } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '标题', pKey: 'map_gt_txt', pValue: map_gt_txt, pType: PropertiesEnum.INPUT_TEXT }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.props.map_gt_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_gt_txt'] = value;

        return obj;
    }

    render() {
        const { map_gt_txt, selectedId, id, doChildDbClickToEdit } = this.props;
        const { hidden } = this.state;

        return (
            <div
                className={`mc-listheader__views title ${selectedId === id ? 'map-select-open' : ''}`}
                onMouseDown={this.selectedCom}
            >
                <h2
                    className="mc-listheader__title"
                >
                    <label
                        ref={(ref) => this.editCom = ref}
                        style={{
                            visibility: hidden ? 'hidden' : 'visible'
                        }}
                        onDoubleClick={doChildDbClickToEdit}
                    >
                        {map_gt_txt}
                    </label>
                </h2>
            </div>
        );
    }
}
