import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../index';
import { Section } from './index';
import { GlobalUtil } from '../../../util';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import * as DragStyle from '../DragStyle';

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
// tslint:disable:jsx-wrap-multiline
export class SectionFormClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_gm_txt: '标题',
        selectedId: undefined
    };

    public menus: HTMLElement | null = null;
    private sectionList: any;

    constructor(props: IMapProps, context?: any) {
        super(props, context);
        this.state = {
            dragonDrop: null,
            hover: {},
            ...props
        };
    }

    public getItemStyle = (draggableStyle: any, isDragging: any) => ({

        // change background colour if dragging
        background: isDragging ? DragStyle.BaseDragStyle.background : '',

        // styles we need to apply on draggables
        ...draggableStyle
    })
    render() {
        const { p, id, selectedId } = this.props;
        const { hover } = this.state;
        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;
        this.initSectonList(components);

        return (
            <div
                ref={(ref) => this.com = ref}
                className={`tab-content ${selectedId === id ? 'map-select-open' : ''}`}
                style={Object.assign({}, { width: '100%' }, hover)}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            // onMouseDown={this.selectedCom}
            >
                <Droppable droppableId="droppable-sectionList" >
                    {this.sectionList}
                </Droppable>
            </div>
        );
    }

    // 初始化加载控件
    public initSectonList = (components: any[]) => {
        const { pageMode, selectedId, selectComChange, setChildPropertyGroup, doChildDbClickToEdit, getRefs, stateData, updateProps } = this.props;
        let tabList: any[] = [];
        if (GlobalUtil.isUndefined(components)) return;
        tabList = components.map((com: any, index: number) => {
            const { t, p } = com;
            if (t === 'MapComponent/newMap/form/Section') {
                return <Section
                    key={p.id}
                    {...p}
                    ref={`c.${p.id}`}
                    index={index}
                    id={p.id}
                    pageMode={pageMode}
                    selectedId={selectedId}
                    selectComChange={selectComChange}
                    setChildPropertyGroup={setChildPropertyGroup}
                    doChildDbClickToEdit={doChildDbClickToEdit}
                    stateData={stateData}
                    updateProps={updateProps}
                    getRefs={getRefs}
                />;
            } else {
                return '';
            }
        });
        this.sectionList = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
            (
                <div
                    ref={provided.innerRef}
                >
                    {tabList}
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
