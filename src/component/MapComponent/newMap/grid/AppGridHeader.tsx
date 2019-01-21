import * as React from 'react';

import { IBaseProps } from '../../IBaseProps';
import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';
import { AppGridTableTitle } from './AppGridTableTitle';

import { GlobalUtil } from '../../../util';
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridHeaderProps extends IBaseProps {
    map_g_check: boolean;
    map_g_num: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridHeaderState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppGridHeader extends MapComponent<IAppGridHeaderProps, IAppGridHeaderState> {
    static defaultProps = {
        map_g_check: false,
        map_g_num: true
    };

    constructor(props: IAppGridHeaderProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    /**
     * 重载添加组件
     * @param t 组件路径
     */
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/grid/AppGridHeader');
    }

    render() {
        const {
            theme,
            gridStyle,
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
        const appGridTableTitle: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any, index: number) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridHeader') {
                        appGridTableTitle.push(
                            <AppGridTableTitle
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
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable-appGridView" direction="horizontal">
                    {
                        (provided: DroppableProvided) =>

                            (
                                <div
                                    style={Object.assign(gridStyle === 'advanced' ? { minWidth: '150px' } : {}, {background: '#fafafa'})}
                                    ref={(ref) => this.com = ref}
                                    onDragOver={this.handleOver}
                                    onDragLeave={this.handleLeave}
                                >
                                    <div
                                        className="flex-row"
                                        ref={provided.innerRef}
                                        style={Object.assign({ width: '100%', lineHeight: '42px', textAlign: 'left'}, this.state.hover)}
                                    >
                                        {
                                            appGridTableTitle.length > 0 ? appGridTableTitle :
                                                (
                                                    <div style={{ color: '#bfbfbf', fontWeight: 'bold', textIndent: 20}}>请在此处添加列</div>
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
