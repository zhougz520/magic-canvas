import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { TabItem, SectionForm } from './index';
import { GlobalUtil } from '../../../util';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';

// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IBaseProps {
    showNavBar: boolean;
    showTabItems: boolean;
    map_form_sti?: string;
}

// tslint:disable-next-line:no-empty-interface
// tslint:disable:jsx-no-string-ref
export class TabForm extends MapComponent<IMapProps, any> {
    static defaultProps = {
        selectedId: undefined,
        showNavBar: true,
        showTabItems: true
    };

    private tabItem: any;
    private sectionForm: any;
    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            hover: {}
        };
    }

    public render() {
        const { hover } = this.state;
        const { p } = this.props;
        const components: any[] = GlobalUtil.isUndefined(p) ? [] : p.components;
        this.initSectionForm(components);
        this.initTabItem(components);

        return (
            <div
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                className={`form-tab`}
                style={Object.assign({}, { width: '100%' }, hover)}
            >
                <DragDropContext onDragEnd={this.onDragEnd} >
                    <Droppable droppableId="droppable" direction="horizontal">
                        {this.tabItem}
                    </Droppable>
                </DragDropContext>
                {this.sectionForm}
            </div>
        );
    }

    // 初始化加载控件
    public initSectionForm = (components: any[]) => {
        const { selectedId, map_form_sti, showTabItems, updateProps, selectComChange, getRefs, stateData } = this.props;
        components.forEach((com, index) => {
            const { p, t } = com;
            if (t === 'MapComponent/map/form/TabItem') {
                const sectionForm = GlobalUtil.isUndefined(p.p) ? undefined : p.p.components;
                if (!GlobalUtil.isUndefined(sectionForm)
                    && (map_form_sti === undefined ?
                        index === 0 :
                        map_form_sti === p.id
                    )) {
                    // 整理tabForm
                    sectionForm.forEach(
                        (sec: any) => {
                            if (sec.t === 'MapComponent/map/form/SectionForm') {
                                this.sectionForm = (
                                    <SectionForm
                                        ref={`c.${sec.p.id}`}
                                        selectedId={selectedId}
                                        updateProps={updateProps}
                                        selectComChange={selectComChange}
                                        {...sec.p}
                                        showTabItems={showTabItems}
                                        getRefs={getRefs}
                                        stateData={stateData}
                                    />
                                );
                            }
                        }
                    );
                }
            }
        });
    }
    // 初始化加载控件
    public initTabItem = (components: any[]) => {
        const { selectedId, showTabItems, updateProps, selectComChange, showNavBar, map_form_sti, getRefs } = this.props;
        const tabList: any[] = [];
        components.forEach((com: any, index: number) => {
            const { t, p } = com;
            if (t === 'MapComponent/map/form/TabItem') {
                tabList.push(
                    <TabItem
                        ref={`c.${p.id}`}
                        key={`c.${p.id}`}
                        selectedId={selectedId}
                        updateProps={updateProps}
                        selectComChange={selectComChange}
                        selectOn={map_form_sti === undefined && index === 0 ? p.id : map_form_sti}
                        {...p}
                        index={index}
                        showTabItems={showTabItems}
                        onChangeItem={this.onChangeItem}
                        getRefs={getRefs}
                    />);
            }
        });
        this.tabItem = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
            (
                <div className="form-tabItems" ref={provided.innerRef} style={{ display: !showNavBar ? 'none' : '' }} >
                    {tabList}
                </div>
            );
    }

    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/form/TabItem');
    }

    public onChangeItem = (tabId: string) => {
        this.props.updateProps(this.props.id, {
            map_form_sti: tabId
        });
    }
    /**
     * override
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        if (addData.t === 'MapComponent/map/form/TabItem') {
            const tabItem = this.getChildComponent(id, data, addData);
            let childId = tabItem.p.id;
            const sectionForm = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/SectionForm' });
            childId = sectionForm.p.id;
            const section = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/Section' });
            childId = section.p.id;
            this.getChildComponent(childId, data, { t: 'MapComponent/map/form/field/InputField' });
        }

        this.props.updateProps('', data);
    }
}
