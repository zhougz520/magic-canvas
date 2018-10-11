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
            hidden: false,
            hover: {}
        };
    }

    /**
     * 重载添加组件
     * @param t 组件路径
     */
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/grid/AppGridViewItem');
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
            getRefs,
            stateData,
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
                                getRefs={getRefs}
                                stateData={stateData}
                            />
                        );
                    }
                }
            );
        }

        return (
            <div
                className="mc-listheader__views"
                style={Object.assign({}, this.state.hover)}
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            >
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
