import * as React from 'react';
import { Input, Select, DatePicker, Checkbox} from 'antd';

import { IBaseProps } from '../../IBaseProps';
import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';

import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridTableItemProps extends IBaseProps {
    columns: any[];
    components: any[];
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridTableItemState extends IBaseState {
    rowItem: any;
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridTableItem extends MapComponent<IAppGridTableItemProps, IAppGridTableItemState> {

    constructor(props: IAppGridTableItemProps, context?: any) {
        super(props, context);
        this.state = {
            hidden: false,
            hover: {},
            rowItem: this.props.components[0] || {}
        };
    }

    /**
     * 重载添加组件
     * @param t 组件路径
     */
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/grid/AppGridTableItem');
    }

    public mapComponentChange(value: any, item: any, rowItemState: any, type: string) {
        const { updateProps, selectedId } = this.props;
        if (selectedId) {
            switch (type) {
                case 'input':
                    rowItemState.p[item.id.replace(/\./g, '')] = value.target.value;
                    break;
                case 'date':
                    rowItemState.p[item.id.replace(/\./g, '')] = value ? value.format('YYYY-MM-DD') : '';
                    break;
            }
            updateProps(selectedId, rowItemState.p);
        }
    }

    render() {
        const { selectedId, id, index, columns, components } = this.props;
        let { rowItem } = this.state;
        if (index) {
            rowItem = components[index];
        }

        return (
            <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                {
                    (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                            className={`flex-row ${selectedId === id ? 'map-selected' : ''}`}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            onMouseDown={(e) => {
                                this.selectedCom(e);
                            }}
                        >
                            {columns.map(
                                (item: any) => {
                                    let element: any = '';
                                    const map_gh_dataType = item.map_gh_dataType ?  item.map_gh_dataType : 'txt';
                                    const map_gh_align = item.map_gh_align ?  item.map_gh_align : 'center';
                                    const map_gh_width = item.map_gh_width ?  item.map_gh_width + 'px' : '0px';
                                    switch (map_gh_dataType) {
                                        case 'txt':
                                        case 'input':
                                            element = <Input placeholder="请输入"size="small" value={rowItem.p[item.id.replace(/\./g, '')]} onChange={(e) => this.mapComponentChange(e, item, rowItem, 'input')} />;
                                            break;
                                        case 'link':
                                            element = <Input placeholder="请输入" style={{color: '#1890ff'}} size="small" value={rowItem.p[item.id.replace(/\./g, '')]} onChange={(e) => this.mapComponentChange(e, item, rowItem, 'input')} />;
                                            break;
                                        case 'select':
                                            element = <Select defaultValue="选择框" size="small"/>;
                                            break;
                                        case 'date':
                                            element = <DatePicker size="small" placeholder="请选择"  format={rowItem.p[item.id.replace(/\./g, '')]} onChange={(value, dateString) => this.mapComponentChange(value, item, rowItem, 'date')} />;
                                            break;
                                        case 'number':
                                            element = <Input size="small" placeholder="请选择" value={rowItem.p[item.id.replace(/\./g, '')]} onChange={(e) => this.mapComponentChange(e, item, rowItem, 'input')} />;
                                            break;
                                        case 'radio':
                                            element = <Checkbox />;
                                            break;
                                        default:
                                            element = <span>&nbsp</span>;
                                    }

                                    return <div key={item.id} className="flex1 rowItem" style={{minWidth: map_gh_width, textAlign: map_gh_align}}><div className="cellStyle">{element}</div></div>;
                                })
                            }
                        </div>
                    )
                }
            </Draggable>
        );
    }
}
