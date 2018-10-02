import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

import { Input, DatePicker } from 'antd';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

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
        const { map_fa_txt, doChildDbClickToEdit } = this.props;
        const { hidden } = this.state;

        return (
            <tr className="mc-filter-item" onMouseDown={this.selectedCom}>
                <th className="mc-filter-item__label" style={{ width: '85px' }}>
                    <label
                        ref={(ref) => this.editCom = ref}
                        style={{
                            visibility: hidden ? 'hidden' : 'visible',
                            position: 'relative'
                        }}
                        onDoubleClick={doChildDbClickToEdit}
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
        );
    }

    private buildContent = () => {
        const { map_fa_type } = this.props;
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
                    <div className="mc-filter-item__control" />
                );
                break;
            case AppFindAdvancedItemType.NUMBER_RANGE:
                content = (
                    <div className="mc-filter-item__control">
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
