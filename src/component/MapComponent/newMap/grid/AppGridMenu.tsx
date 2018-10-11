import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppGridMenuLeft } from './AppGridMenuLeft';
import { AppGridMenuRight } from './AppGridMenuRight';

import { GlobalUtil } from '../../../util';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuProps extends IBaseProps {
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppGridMenu extends MapComponent<IAppGridMenuProps, IAppGridMenuState> {
    constructor(props: IAppGridMenuProps, context?: any) {
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
            getRefs,
            stateData,
            p
        } = this.props;

        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;
        let appGridMenuLeft: JSX.Element | null = null;
        let appGridMenuRight: JSX.Element | null = null;
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridMenuLeft') {
                        appGridMenuLeft = (
                            <AppGridMenuLeft
                                ref={`c.${p.id}`}
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

                    if (t === 'MapComponent/newMap/grid/AppGridMenuRight') {
                        appGridMenuRight = (
                            <AppGridMenuRight
                                ref={`c.${p.id}`}
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
            <div className="mc-listheader__addon">
                <div className="mc-listheader__addon-wrap">
                    <div className="mc-listheader__toolbar">
                        <div className="listheader-toolbar">
                            {
                                appGridMenuLeft !== null ? appGridMenuLeft : ''
                            }
                            {
                                appGridMenuRight !== null ? appGridMenuRight : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
