import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { TreeSelect } from 'antd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_pddt_txt?: string;
    map_pddt_o?: string[];
}

export class ProjectDDTree extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_pddt_txt: '组织架构',
        map_pddt_o: [],
        selectedId: undefined
    };

    public com: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            ...props
        };
    }

    public render() {
        const { map_pddt_txt, map_pddt_o, selectedId, id } = this.props;
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
            <table
                onMouseDown={this.selectedCom}
                className={`csr-pc-map-app-project ${selectedId === id ? 'selectecd' : ''}`}
                ref={(ref) => this.com = ref}
                style={{ width: '100%' }}
            >
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
