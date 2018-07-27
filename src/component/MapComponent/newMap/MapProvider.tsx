import * as React from 'react';

import { Theme } from './model/types';
import { PageMode } from '../../Stage';

export const MapContext = React.createContext('newMap');

export interface IMapContextProps {
    data: any;                      // 当前控件的整体数据
    selectedId: string | null;      // 当前选中的子控件id
    pageMode: PageMode;             // 当前画布状态
    theme: Theme;                   // 皮肤{ black:经典黑, blue:宝石蓝, green:橄榄绿, light-blue:天空蓝, light-green:荷叶绿, red:活力红, orange:欢快橙 }
    refs: any;                      // 整体ref
}

export class MapProvider extends React.PureComponent<IMapContextProps, any> {
    render() {
        const { data, selectedId, pageMode, theme, refs } = this.props;
        const value: any = {
            data,
            selectedId,
            pageMode,
            theme,
            refs
        };

        return (
            <MapContext.Provider value={value}>
                {this.props.children}
            </MapContext.Provider>
        );
    }
}
