import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { TreeSelect } from 'antd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    value?: string;
}

export class ProjectDDTree extends MapComponent<IMapProps, any> {
    static defaultProps = {
        value: 'test'
    };

    public com: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            data: props.data
        };
    }

    public render() {
        const { map_pddt_txt, map_pddt_o } = this.state.data;
        const options: any[] = [];
        if (map_pddt_o !== undefined) {
            map_pddt_o.map((mi: string) => {
                options.push(
                    {
                        label: mi,
                        value: mi,
                        key: mi
                    }
                );
            });
        }
        const treeData = options;

        return (
            <table ref={(ref) => this.com = ref} style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '75px', fontFamily: '宋体' }}>
                            <b style={{ color: '#66666' }}>{map_pddt_txt}</b>
                        </td>
                        <td>
                            <div className="first-page">
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={treeData}
                                    treeDefaultExpandAll
                                    onChange={this.onProjectValueChange}
                                    defaultValue={map_pddt_o[0]}
                                />
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
