import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { Select } from 'antd';

const Option = Select.Option;

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    value?: string;
}

export class AppView extends MapComponent<IMapProps, any> {
    static defaultProps = {
        // value: 'test'
    };

    public com: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            data: props.data
        };
    }

    public render() {
        const { map_v_txt, map_v_o, map_v_w } = this.state.data;
        let arrOption = [];
        if (map_v_o instanceof Array) {
            arrOption = map_v_o;
        } else {
            arrOption = map_v_o === undefined ? [''] : map_v_o.replace(/<br>/g, '\r\n').split(/\r?\n/);
        }
        const options: any[] = [];
        if (arrOption !== undefined) {
            arrOption.map((mi: string) => {
                options.push(
                    <Option value={mi} key={mi}>{mi}</Option>
                );
            });
        }

        return (
            <table ref={(ref) => this.com = ref} style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td style={{ width: `${map_v_w}px`, fontFamily: '宋体' }}>
                            <b style={{ marginLeft: '20px' }}>{map_v_txt}</b>
                        </td>
                        <td>
                            <div className="first-page">
                                <Select style={{ width: '100%' }}>
                                    {options}
                                </Select>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    public onProjectValueChange = (value: string) => {
        this.setState({
            projectValue: value
        });
    }
}
