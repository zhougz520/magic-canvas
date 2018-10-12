import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppGridMenuItemButton } from './AppGridMenuItemButton';
import { AppGridMenuItemDropdown } from './AppGridMenuItemDropdown';
import { AppGridMenuItemSwitch } from './AppGridMenuItemSwitch';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

import { GlobalUtil } from '../../../util';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuLeftProps extends IBaseProps {
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuLeftState extends IBaseState {
}

// tslint:disable:jsx-wrap-multiline
/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppGridMenuLeft extends MapComponent<IAppGridMenuLeftProps, IAppGridMenuLeftState> {
    constructor(props: IAppGridMenuLeftProps, context?: any) {
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
        return (t === 'MapComponent/newMap/grid/AppGridMenuItemButton') ||
            (t === 'MapComponent/newMap/grid/AppGridMenuItemDropdown') ||
            (t === 'MapComponent/newMap/grid/AppGridMenuItemSwitch');
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
        const appGridMenuItem: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any, index: number) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridMenuItemButton') {
                        appGridMenuItem.push(
                            <AppGridMenuItemButton
                                ref={`c.${p.id}`}
                                key={p.id}
                                index={index}
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

                    if (t === 'MapComponent/newMap/grid/AppGridMenuItemDropdown') {
                        appGridMenuItem.push(
                            <AppGridMenuItemDropdown
                                ref={`c.${p.id}`}
                                key={p.id}
                                index={index}
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

                    if (t === 'MapComponent/newMap/grid/AppGridMenuItemSwitch') {
                        appGridMenuItem.push(
                            <AppGridMenuItemSwitch
                                ref={`c.${p.id}`}
                                key={p.id}
                                index={index}
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
                className="listheader-toolbar map-left"
                style={Object.assign({}, this.state.hover)}
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            >
                <DragDropContext onDragEnd={this.onDragEnd} >
                    <Droppable droppableId="droppable-appGridMenuLeft" direction="horizontal" >
                        {
                            (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
                                (
                                    <div
                                        ref={provided.innerRef}
                                        className={`drag-container`}
                                    >
                                        {
                                            appGridMenuItem.length > 0 ? appGridMenuItem :
                                                (
                                                    <div style={{ color: '#bfbfbf', paddingTop: '10px', fontWeight: 'bold' }}>请添加菜单左侧按钮...</div>
                                                )
                                        }
                                    </div>
                                )
                        }
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}
