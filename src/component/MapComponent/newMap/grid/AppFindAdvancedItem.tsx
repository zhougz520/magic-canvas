import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

// tslint:disable-next-line:no-empty-interface
export interface IAppFindAdvancedItemProps extends IBaseProps {
}

// tslint:disable-next-line:no-empty-interface
export interface IAppFindAdvancedItemState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-wrap-multiline */
export class AppFindAdvancedItem extends MapComponent<IAppFindAdvancedItemProps, IAppFindAdvancedItemState> {
    static defaultProps = {
    };

    constructor(props: IAppFindAdvancedItemProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    render() {
        return (
            <tr className="mc-filter-item">
                <th className="mc-filter-item__label" style={{ width: '85px' }}>
                    相关附件：
                </th>
                <td className="mc-filter-item__target">
                    <div className="mc-filter-item__inner">
                        <div className="mc-filter-item__part">
                            <span className="mc-filter-item__allcheck">
                                全部
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }
}
