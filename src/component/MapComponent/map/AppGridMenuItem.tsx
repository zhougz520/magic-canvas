import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { Dropdown, Menu, Icon } from 'antd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_mi_txt?: string;
    map_mi_dd?: string[];
    map_mi_si?: boolean;
    map_mi_ico?: string;
    map_mi_sa?: boolean;
}

export class AppGridMenuItem extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_mi_txt: '按钮',
        map_mi_sa: false
    };

    public com: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            ...props
        };
    }

    public render() {
        const { map_mi_txt, map_mi_dd, map_mi_ico, map_mi_si, map_mi_sa } = this.state;

        const dropDownMenu: any[] = [];
        if (map_mi_dd !== undefined) {
            let idx = 0;
            map_mi_dd.map((mi: string) => {
                dropDownMenu.push(
                    mi === '-' ?
                        <Menu.Divider key={idx} /> :
                        <Menu.Item key={idx}>{mi}</Menu.Item>
                );
                idx++;
            });
        }
        const menu = (
            <Menu>
                {dropDownMenu}
            </Menu>
        );

        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <div ref={(ref) => this.com = ref} className="app-grid-menu-item">
                    {map_mi_txt}
                    {map_mi_si ? (<div className={`ico ${map_mi_ico}`} />) : ''}
                    <Icon
                        type="caret-down"
                        className="dropDownArrow"
                        style={{ display: map_mi_sa ? `block` : `none` }}
                    />
                </div>
            </Dropdown>
        );
    }
}