import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
// import { AppGridTitle } from './index';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    value?: string;
}

export class AppGrid extends MapComponent<IMapProps, any> {
    public com: HTMLElement | null = null;

    public render() {
        // const { data } = this.props;
        // const { p, w, h, map_sm } = data;

        return (
            <table ref={(ref) => this.com = ref} className="ps-map" >
                <tbody>
                    <tr>
                        <td>
                            {/* <AppGridTitle /> */}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
