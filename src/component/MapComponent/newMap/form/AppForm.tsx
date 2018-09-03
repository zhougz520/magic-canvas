import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { AppMenuItem } from '../base/index';
import { TabForm } from './index';
import { GlobalUtil } from '../../../util';

export interface IMapProps extends IBaseProps {
    showTabItems: boolean;
    map_form_sni?: string;
    map_form_header_show?: boolean;
    map_form_foot_show?: boolean;
    map_form_title: string;
    theme?: string;
}

// tslint:disable:jsx-no-string-ref
export class AppFormClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        selectedId: undefined,
        showTabItems: true,
        map_form_sni: undefined,
        theme: '',
        map_form_header_show: true,
        map_form_foot_show: true
    };

    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            hover: {}
        };
    }

    public render() {
        const { hover } = this.state;
        const { p, map_form_title, theme, map_form_header_show, map_form_foot_show } = this.props;
        const components: any[] = GlobalUtil.isUndefined(p) ? [] : p.components;
        const tabFormList: any[] = [];
        const tabFormFootList: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.forEach((com, index) => {
                const { t } = com;
                if (t === 'pc/newMap/form/TabForm') {
                    tabFormList.push(<TabForm theme={theme} key={com.p.id} {...com.p} ref={`c.${com.p.id}`} />);
                } else if (t === 'pc/newMap/grid/AppGridMenuItem') {
                    tabFormFootList.push(<AppMenuItem key={com.p.id} {...com.p} ref={`c.${com.p.id}`} />);
                }
            });
        }

        return (
            <div
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                className={`map-form`}
                style={Object.assign({}, { width: '100%' }, hover)}
            >
                <div className={`form-title`} style={{ display: map_form_header_show ? '' : 'none' }}>
                    {map_form_title}
                </div>
                <div className={`form-content`}>
                    {tabFormList.length > 0 ? tabFormList : ''}
                </div>
                <div className={`form-foot`} style={{ display: map_form_foot_show ? '' : 'none' }}>
                    <ul>
                        {tabFormFootList.length > 0 ? tabFormFootList : ''}
                    </ul>
                </div>
            </div>
        );
    }

    /*重载添加组件*/
    // public componentCanBeAdded(t: string) {
    //     return (t === 'MapComponent/map/form/NavBarItem');
    // }

    public onChangeItem = (navBarId: string) => {
        this.props.updateProps(this.props.id, {
            map_form_sni: navBarId
        });
    }
    /**
     * override
     */
    public addChildComponent = (id: string, data: any, addData: any): any => {
        // if (addData.t === 'MapComponent/map/form/NavBarItem') {
        //     const newNavBarItem = this.getChildComponent(id, data, addData);
        //     let childId = newNavBarItem.p.id;
        //     const tabForm = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/TabForm' });
        //     childId = tabForm.p.id;
        //     const tabItem = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/TabItem' });
        //     childId = tabItem.p.id;
        //     const sectionForm = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/SectionForm' });
        //     childId = sectionForm.p.id;
        //     const section = this.getChildComponent(childId, data, { t: 'MapComponent/map/form/Section' });
        //     childId = section.p.id;
        //     this.getChildComponent(childId, data, { t: 'MapComponent/map/form/field/InputField' });
        // }

        // this.props.updateProps('', data);
    }
}
export const AppForm = AppFormClass;
