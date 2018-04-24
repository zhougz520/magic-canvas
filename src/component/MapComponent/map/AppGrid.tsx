import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { Checkbox } from 'antd';
// import { AppGridTitle } from './index';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_g_mc: boolean;   // 是否多选
    map_g_sl: number;   // 滚动条位置
    map_g_pg: boolean;   // 是否显示分页栏

    map_g_data: any;   // grid数据
    map_g_modal: boolean;  // 是否开启grid数据编辑
    map_g_tree: boolean;    // 是否TreeGrid
}

export class AppGrid extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_g_mc: false,
        map_g_sl: false,
        map_g_pg: false,
        map_g_data: false,
        map_g_modal: false,
        map_g_tree: false
    };

    public com: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            ...props
        };
    }

    public render() {
        const { map_g_mc, map_g_sl, map_g_pg, map_g_data, map_g_modal, map_g_tree, w, h } = this.state;

        return (
            <div ref={(ref) => this.com = ref} className="csr-pc-map-app-grid">
                <div style={{ display: map_g_tree ? 'none' : '' }}>
                    {map_g_mc ? (<Checkbox defaultChecked={false} />) : `序号`}
                </div>
            </div>
        );
    }
}
