import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppGridMenuItemButton } from './AppGridMenuItemButton';
import { AppGridMenuItemDropdown } from './AppGridMenuItemDropdown';
import { AppGridMenuItemSwitch } from './AppGridMenuItemSwitch';

import { GlobalUtil } from '../../../util';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuRightProps extends IBaseProps {
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuRightState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppGridMenuRight extends MapComponent<IAppGridMenuRightProps, IAppGridMenuRightState> {
    constructor(props: IAppGridMenuRightProps, context?: any) {
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
        const appGridMenuItem: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridMenuItemButton') {
                        appGridMenuItem.push(
                            <AppGridMenuItemButton
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

                    if (t === 'MapComponent/newMap/grid/AppGridMenuItemDropdown') {
                        appGridMenuItem.push(
                            <AppGridMenuItemDropdown
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

                    if (t === 'MapComponent/newMap/grid/AppGridMenuItemSwitch') {
                        appGridMenuItem.push(
                            <AppGridMenuItemSwitch
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
            <ul className="listheader-toolbar map-right">
                {
                    appGridMenuItem.length > 0 ? appGridMenuItem :
                        (
                            <div style={{ color: '#bfbfbf', paddingTop: '10px', fontWeight: 'bold' }}>请添加菜单右侧按钮...</div>
                        )
                }
            </ul>
        );
    }
}
