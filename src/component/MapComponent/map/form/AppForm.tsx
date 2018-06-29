import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { NavBarItem, TabForm } from './index';
import { GlobalUtil } from '../../../util';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { MapConsumer } from '../MapConsumer';

export interface IMapProps extends IBaseProps {
    showNavBar: boolean;
    showTabItems: boolean;
    map_form_sni?: string;
}

// tslint:disable-next-line:no-empty-interface
// tslint:disable:jsx-no-string-ref
export class AppFormClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        selectedId: undefined,
        showNavBar: true,
        showTabItems: true,
        map_form_sni: undefined
    };

    private navBar: any;
    private tabForm: any;
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
        this.initTabForm(components);
        this.initNavBarItem(components);

        return (
            <div
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                className={`form-content`}
                style={Object.assign({}, { width: '100%' }, hover)}
            >
                <DragDropContext onDragEnd={this.onDragEnd} >
                    <Droppable droppableId="droppable" >
                        {this.navBar}
                    </Droppable>
                </DragDropContext>
                {this.tabForm}
            </div>
        );
    }

    // 初始化加载控件
    public initTabForm = (components: any[]) => {
        const { selectedId, map_form_sni, showTabItems, updateProps, selectComChange } = this.props;
        components.forEach((com: any, index: number) => {
            const { p, t } = com;
            if (t === 'MapComponent/map/form/NavBarItem') {
                const tabForm = GlobalUtil.isUndefined(p.p) ? undefined : p.p.components;
                if (!GlobalUtil.isUndefined(tabForm)
                    && (map_form_sni === undefined ?
                        index === 0 :
                        map_form_sni === p.id
                    )) {
                    // 整理tabForm
                    tabForm.forEach(
                        (tab: any) => {
                            if (tab.t === 'MapComponent/map/form/TabForm') {
                                this.tabForm = (
                                    <TabForm
                                        ref={`c.${tab.p.id}`}
                                        selectedId={selectedId}
                                        updateProps={updateProps}
                                        selectComChange={selectComChange}
                                        {...tab.p}
                                        showTabItems={showTabItems}
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
    public initNavBarItem = (components: any[]) => {
        const { selectedId, showTabItems, updateProps, selectComChange, showNavBar, map_form_sni } = this.props;
        const navBarList: any[] = [];
        components.forEach((com: any, index: number) => {
            const { t, p } = com;
            if (t === 'MapComponent/map/form/NavBarItem') {
                navBarList.push(
                    <NavBarItem
                        ref={`c.${p.id}`}
                        key={`c.${p.id}`}
                        index={index}
                        selectedId={selectedId}
                        selectOn={map_form_sni === undefined && index === 0 ? p.id : map_form_sni}
                        updateProps={updateProps}
                        selectComChange={selectComChange}
                        {...p}
                        showTabItems={showTabItems}
                        onChangeItem={this.onChangeItem}
                    />);
            }
        });
        this.navBar = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
            (
                <div className="form-navBar" ref={provided.innerRef} style={{ display: !showNavBar ? 'none' : '' }} >
                    {navBarList}
                </div>
            );
    }

    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/form/NavBarItem');
    }

    public onChangeItem = (navBarId: string) => {
        this.props.updateProps(this.props.id, {
            map_form_sni: navBarId
        });
    }
    /**
     * override
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        if (addData.t === 'MapComponent/map/form/NavBarItem') {
            const newNavBarItem = this.getChildComponent(id, data, addData);
            let childId = newNavBarItem.p.id;
            const tabForm = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/TabForm' });
            childId = tabForm.p.id;
            const tabItem = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/TabItem' });
            childId = tabItem.p.id;
            const sectionForm = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/SectionForm' });
            childId = sectionForm.p.id;
            const section = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/Section' });
            childId = section.p.id;
            this.getChildComponent(childId, data, { t: 'MapComponent/map/form/field/InputField' });
        }

        this.props.updateProps('', data);
    }
}
export const AppForm = MapConsumer(AppFormClass);
