import * as React from 'react';

export const MapContext = React.createContext('map');
export interface IMapContextProps {
    updateProps: (cid: string, updateProp: any) => void;
    selectComChange: (e: any, cid: string) => void;
    map_sm?: string;                // 皮肤
    selectedId?: string;            // 当前选中的控件id
    pageMode?: string;              // 当前画布状态
    stateData?: any;                     // 当前控件的整体数据
    refs?: any;                     // 整体ref
}
export class MapProvider extends React.PureComponent<IMapContextProps, any> {
    static defaultProps = {
        map_sm: 'erp30',
        selectedId: undefined,
        pageMode: 'Edit'
    };

    render() {
        const { map_sm, selectedId, pageMode, updateProps, selectComChange, stateData, refs } = this.props;
        const value: any = {
            map_sm,
            selectedId,
            pageMode,
            updateProps,
            selectComChange,
            stateData,
            refs
        };
        console.log('MapContext.Provider refs', refs);

        return (
            <MapContext.Provider value={value}>
                {this.props.children}
            </MapContext.Provider>
        );
    }
}
