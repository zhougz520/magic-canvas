import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppFindAdvancedItem } from './AppFindAdvancedItem';

import { GlobalUtil } from '../../../util';

import { Button } from 'antd';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

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
            hidden: false,
            hover: {}
        };
    }

    /**
     * 重载添加组件
     * @param t 组件路径
     */
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/grid/AppFindAdvancedItem');
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
        const appFindAdvancedItem: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any, index: number) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppFindAdvancedItem') {
                        appFindAdvancedItem.push(
                            <AppFindAdvancedItem
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
            <div className="mc-filter">
                <div
                    className="mc-filter-controls"
                    style={Object.assign({}, this.state.hover)}
                    ref={(ref) => this.com = ref}
                    onDragOver={this.handleOver}
                    onDragLeave={this.handleLeave}
                >
                    <DragDropContext onDragEnd={this.onDragEnd} >
                        <Droppable droppableId="droppable-appFindAdvanced" >
                            {
                                (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
                                    (
                                        <div
                                            ref={provided.innerRef}
                                            className={`drag-container`}
                                        >
                                            {
                                                appFindAdvancedItem.length > 0 ? appFindAdvancedItem :
                                                    (
                                                        <div className="mc-filter-item">
                                                            <div style={{ width: '200px', color: 'rgb(191, 191, 191)' }}>请添加高级搜索组件...</div>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    )
                            }
                        </Droppable>
                    </DragDropContext>
                </div>
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
