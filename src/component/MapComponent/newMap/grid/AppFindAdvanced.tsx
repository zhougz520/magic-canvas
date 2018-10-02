import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppFindAdvancedItem } from './AppFindAdvancedItem';

import { GlobalUtil } from '../../../util';

import { Button } from 'antd';

// tslint:disable-next-line:no-empty-interface
export interface IAppFindAdvancedProps extends IBaseProps {
}

// tslint:disable-next-line:no-empty-interface
export interface IAppFindAdvancedState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppFindAdvanced extends MapComponent<IAppFindAdvancedProps, IAppFindAdvancedState> {
    constructor(props: IAppFindAdvancedProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    render() {
        const {
            theme,
            pageMode,
            selectedId,
            selectComChange,
            setChildPropertyGroup,
            doChildDbClickToEdit,
            updateProps,
            p
        } = this.props;

        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;
        const appFindAdvancedItem: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppFindAdvancedItem') {
                        appFindAdvancedItem.push(
                            <AppFindAdvancedItem
                                ref={`c.${p.id}`}
                                key={p.id}
                                {...p}
                                theme={theme}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                            />
                        );
                    }
                }
            );
        }

        return (
            <div className="mc-filter">
                <table className="mc-filter-controls">
                    <tbody>
                        {
                            appFindAdvancedItem.length > 0 ? appFindAdvancedItem :
                                (
                                    <tr className="mc-filter-item">
                                        <th style={{ width: '200px', color: 'rgb(191, 191, 191)' }}>请添加高级搜索组件...</th>
                                        <td />
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
                <div className="mc-filter-toolbar">
                    <Button
                        type="primary"
                        style={{
                            height: '32px',
                            borderRadius: '3px',
                            backgroundColor: '#34A6F8',
                            borderColor: '#34A6F8'
                        }}
                    >
                        搜索
                    </Button>
                    <a
                        style={{
                            marginLeft: '10px',
                            color: '#666'
                        }}
                    >
                        清空
                    </a>
                </div>
            </div>
        );
    }
}
