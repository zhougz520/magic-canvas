import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../../IBaseProps';
import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';

import { OrderedSet, List } from 'immutable';
import { Input, DatePicker } from 'antd';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

export enum AppFindAdvancedItemType {
    TEXT = 'text',
    SELECT = 'select',
    NUMBER_RANGE = 'number_range',
    NUMBER = 'number',
    DATE = 'date'
}

// tslint:disable-next-line:no-empty-interface
export interface IAppFindAdvancedItemProps extends IBaseProps {
    map_fa_txt?: string;
    map_fa_type?: AppFindAdvancedItemType;
    map_fa_btn?: string[];
}

// tslint:disable-next-line:no-empty-interface
export interface IAppFindAdvancedItemState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-wrap-multiline */
export class AppFindAdvancedItem extends MapComponent<IAppFindAdvancedItemProps, IAppFindAdvancedItemState> {
    static defaultProps = {
        map_fa_txt: '字段',
        map_fa_type: AppFindAdvancedItemType.TEXT,
        map_fa_btn: []
    };

    constructor(props: IAppFindAdvancedItemProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    public getItemStyle = (draggableStyle: any, isDragging: any) => ({
        // change background colour if dragging
        background: isDragging ? 'rgba(24, 144, 255, 0.2)' : '',
        // styles we need to apply on draggables
        ...draggableStyle
    })

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_fa_txt, map_fa_type, map_fa_btn } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();
        const typeList: any[] = [
            { key: AppFindAdvancedItemType.TEXT, value: '文本输入' },
            { key: AppFindAdvancedItemType.SELECT, value: '选项列表' },
            { key: AppFindAdvancedItemType.NUMBER_RANGE, value: '数值区间' },
            { key: AppFindAdvancedItemType.NUMBER, value: '数值输入' },
            { key: AppFindAdvancedItemType.DATE, value: '日期区间' }
        ];

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '显示名称', pKey: 'map_fa_txt', pValue: map_fa_txt, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '显示方式', pKey: 'map_fa_type', pValue: map_fa_type, pType: PropertiesEnum.SELECT, pList: typeList },
            { pTitle: '备选项', pKey: 'map_fa_btn', pValue: map_fa_btn, pType: PropertiesEnum.INPUT_LIST }
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
        return this.props.map_fa_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_fa_txt'] = value;

        return obj;
    }

    render() {
        const { map_fa_txt, selectedId, id, doChildDbClickToEdit, index } = this.props;
        const { hidden } = this.state;

        return (
            <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                {
                    (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <tr
                            className={`mc-filter-item ${selectedId === id ? 'map-select-open' : ''}`}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                            onMouseDown={(e) => {
                                if (provided.dragHandleProps) {
                                    provided.dragHandleProps.onMouseDown(e);
                                }
                                this.selectedCom(e);
                            }}
                        >
                            <th
                                className="mc-filter-item__label"
                                style={{ width: '85px' }}
                                onDoubleClick={doChildDbClickToEdit}
                            >
                                <label
                                    ref={(ref) => this.editCom = ref}
                                    style={{
                                        visibility: hidden ? 'hidden' : 'visible',
                                        position: 'relative'
                                    }}
                                >
                                    {map_fa_txt}：
                                </label>
                            </th>
                            <td className="mc-filter-item__target">
                                <div className="mc-filter-item__inner">
                                    <div className="mc-filter-item__part">
                                        <span className="mc-filter-item__allcheck">
                                            全部
                                        </span>
                                    </div>
                                    {
                                        this.buildContent()
                                    }
                                </div>
                            </td>
                        </tr>
                    )
                }
            </Draggable>
        );
    }

    private buildContent = () => {
        const { map_fa_type, map_fa_btn } = this.props;
        let content: JSX.Element | null = null;

        switch (map_fa_type) {
            case AppFindAdvancedItemType.TEXT:
                content = (
                    <div className="mc-filter-item__control">
                        <Input style={{ width: '160px' }} />
                    </div>
                );
                break;
            case AppFindAdvancedItemType.SELECT:
                content = (
                    <div className="mc-filter-item__control">
                        <div className="mc-options">
                            <div className="mc-options__list">
                                {
                                    map_fa_btn && map_fa_btn.map(
                                        (btn, i) => {
                                            return (
                                                <span key={i} className="mc-options__item">
                                                    {btn}
                                                </span>
                                            );
                                        }
                                    )
                                }
                            </div>
                        </div>
                    </div>
                );
                break;
            case AppFindAdvancedItemType.NUMBER_RANGE:
                content = (
                    <div className="mc-filter-item__control">
                        <div className="mc-range__list">
                            {
                                map_fa_btn && map_fa_btn.map(
                                    (btn, i) => {
                                        return (
                                            <span key={i} className="mc-range__item">
                                                {btn}
                                            </span>
                                        );
                                    }
                                )
                            }
                        </div>
                        <Input style={{ width: '145px' }} placeholder="起始值" />
                        &nbsp;-&nbsp;
                        <Input style={{ width: '145px' }} placeholder="截止值" />
                    </div>
                );
                break;
            case AppFindAdvancedItemType.NUMBER:
                content = (
                    <div className="mc-filter-item__control">
                        <Input style={{ width: '160px' }} />
                    </div>
                );
                break;
            case AppFindAdvancedItemType.DATE:
                content = (
                    <div className="mc-filter-item__control">
                        <div className="mc-range__list">
                            {
                                map_fa_btn && map_fa_btn.map(
                                    (btn, i) => {
                                        return (
                                            <span key={i} className="mc-range__item">
                                                {btn}
                                            </span>
                                        );
                                    }
                                )
                            }
                        </div>
                        <DatePicker style={{ width: '130px' }} placeholder="开始时间" locale={zhCN} />
                        &nbsp;-&nbsp;
                        <DatePicker style={{ width: '130px' }} placeholder="结束时间" locale={zhCN} />
                    </div>
                );
                break;
        }

        return content;
    }
}
