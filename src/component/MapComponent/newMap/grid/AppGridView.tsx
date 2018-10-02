import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppGridViewItem } from './AppGridViewItem';

import { GlobalUtil } from '../../../util';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridViewProps extends IBaseProps {
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridViewState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppGridView extends MapComponent<IAppGridViewProps, IAppGridViewState> {
    constructor(props: IAppGridViewProps, context?: any) {
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
        const appGridViewItem: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridViewItem') {
                        appGridViewItem.push(
                            <AppGridViewItem
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
            <div className="mc-listheader__views">
                <div className="mc-listheader-viewlist">
                    <ul className="mc-listheader-viewlist-buttongroup">
                        {
                            appGridViewItem.length > 0 ? appGridViewItem :
                                (
                                    <div style={{ color: '#bfbfbf', paddingTop: '4px', fontWeight: 'bold' }}>请添加视图标签...</div>
                                )
                        }
                    </ul>
                </div>
            </div>
        );
    }
}
