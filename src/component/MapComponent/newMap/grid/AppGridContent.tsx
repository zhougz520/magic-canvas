import * as React from 'react';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppGridTableItem } from './AppGridTableItem';

import { GlobalUtil } from '../../../util';
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridContentProps extends IBaseProps {
    columns: any[];
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridContentState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppGridContent extends MapComponent<IAppGridContentProps, IAppGridContentState> {
    static defaultProps = {
        columns: []
    };

    constructor(props: IAppGridContentProps, context?: any) {
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
        if (this.props.columns.length === 0) {
            t = 'undefined';
        }

        return (t === 'MapComponent/newMap/grid/AppGridContent');
    }

    render() {
        const {
            theme,
            gridStyle,
            pageMode,
            selectedId,
            selectComChange,
            setChildPropertyGroup,
            updateProps,
            getRefs,
            stateData,
            columns,
            p
        } = this.props;
        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;
        const appGridTableItem: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any, index: number) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridContent' && columns.length > 0) {
                        appGridTableItem.push(
                            <AppGridTableItem
                                ref={`c.${p.id}`}
                                key={p.id}
                                index={index}
                                {...p}
                                theme={theme}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                columns={columns}
                                components={components}
                            />
                        );
                    }
                }
            );
        }

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable-appGridView" direction="horizontal">
                    {
                        (provided: DroppableProvided) =>
                            (
                                <div
                                    className="listheader-toolbar map-left"
                                    style={Object.assign(gridStyle === 'advanced' ? { minWidth: '150px' } : {}, this.state.hover)}
                                    ref={(ref) => this.com = ref}
                                    onDragOver={this.handleOver}
                                    onDragLeave={this.handleLeave}
                                >
                                    <div
                                        ref={provided.innerRef}
                                        style={{ height: '100%', width: '100%', lineHeight: '45px', textAlign: 'left'}}
                                    >
                                        {
                                            appGridTableItem.length > 0 ? appGridTableItem :
                                                (
                                                    <div style={{ color: '#bfbfbf', fontWeight: 'bold', textIndent: 20}}>请在此处添加表格数据</div>
                                                )
                                        }
                                    </div>
                                </div>
                            )
                    }
                </Droppable>
            </DragDropContext>
        );
    }
}
