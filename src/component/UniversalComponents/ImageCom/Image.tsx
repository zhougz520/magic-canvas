import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState, MaskLayer } from '../../BaseComponent';

import { ImageState } from './ImageState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';

import { Map, OrderedSet, List } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export default class Image extends BaseComponent<IBaseProps, IBaseState> {
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ImageState())
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 外观
        propertyList = propertyList.push(
            {
                pTitle: '边框颜色',
                pKey: 'borderColor',
                pValue: this.getCustomState().getBorderColor(),
                pType: PropertiesEnum.COLOR_PICKER
            },
            {
                pTitle: '边框宽度',
                pKey: 'borderWidth',
                pValue: this.getCustomState().getBorderWidth(),
                pType: PropertiesEnum.SLIDER
            }
        );
        propertyGroup = propertyGroup.add(
            {
                groupTitle: '外观',
                groupKey: 'exterior',
                colNum: 1,
                propertyList
            }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newImageState: ImageState = ImageState.set(this.getCustomState(), properties);

        this.setCustomState(newImageState);
    }

    render() {
        return (
            <div
                style={{
                    ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false),
                    backgroundColor: this.getCustomState().getBackgroundColor(),
                    borderColor: this.getCustomState().getBorderColor(),
                    borderWidth: this.getCustomState().getBorderWidth(),
                    borderStyle: 'solid'
                }}
                onMouseDown={this.fireSelectChange}
            >
                <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} />
                <img
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'inline-block'
                    }}
                    src={this.getCustomState().getSrc()}
                />
            </div>
        );
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ImageState
 */
export function convertFromDataToCustomState(
    customData: ImageState
): any {
    return new ImageState(customData);
}
