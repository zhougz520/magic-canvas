import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../index';
import { Section } from './index';
import { GlobalUtil } from '../../../util';
// import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_gm_txt?: string;
}
export interface IMapState extends IBaseState {
    dragonDrop: any;
}
// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-no-multiline-js
// tslint:disable:no-shadowed-variable
export class SectionFormClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_gm_txt: '标题',
        selectedId: undefined
    };

    public menus: HTMLElement | null = null;

    constructor(props: IMapProps, context?: any) {
        super(props, context);
        this.state = {
            dragonDrop: null,
            hover: {},
            ...props
        };
    }
    render() {
        const { p, pageMode, selectedId, selectComChange, setChildPropertyGroup, doChildDbClickToEdit, refs, stateData, updateProps } = this.props;
        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;

        return (
            <div
                ref={(ref) => this.com = ref}
                className="tab-content"
            >
                {
                    GlobalUtil.isUndefined(components) ? '' :
                        (
                            components.map((com: any, index: number) => {
                                const { t, p } = com;
                                if (t === 'MapComponent/newMap/form/Section') {
                                    return <Section
                                        key={p.id}
                                        {...p}
                                        ref={`c.${p.id}`}
                                        pageMode={pageMode}
                                        selectedId={selectedId}
                                        selectComChange={selectComChange}
                                        setChildPropertyGroup={setChildPropertyGroup}
                                        doChildDbClickToEdit={doChildDbClickToEdit}
                                        stateData={stateData}
                                        updateProps={updateProps}
                                        refs={refs}
                                    />;
                                } else {
                                    return '';
                                }
                            })
                        )
                }
            </div>
        );
    }
    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/form/Section');
    }
    /**
     * override
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        if (addData.t === 'MapComponent/newMap/form/Section') {
            const section = this.getChildComponent(id, data, addData);
            let childId = section.p.id;
            childId = section.p.id;
            this.getChildComponent(childId, data, { t: 'MapComponent/newMap/form/field/InputField' });
        }

        this.props.updateProps('', data);
    }
    // 更新控件属性
    private updateComProps = (data: any, id: string, prop: any) => {
        let newData: any = data;
        data.components.forEach((com: any) => {
            if (com.p.id === id) {
                com.p = Object.assign({}, com.p, prop);
                newData = data;

                return newData;
            }
            // 如果存在子控件，则
            if (com.p.p !== undefined && com.p.p.components !== undefined) {
                this.updateComProps(com.p.p, id, prop);
            }
        });

        return newData;
    }
}
export const SectionForm = SectionFormClass;
