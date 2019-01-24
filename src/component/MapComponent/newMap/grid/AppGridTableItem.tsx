import * as React from 'react';
import { Input, Select, DatePicker, Checkbox, InputNumber} from 'antd';
import { IBaseProps } from '../../IBaseProps';
import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';
import * as moment from 'moment';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridTableItemProps extends IBaseProps {
    columns: any[];
    components: any[];
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridTableItemState extends IBaseState {
    rowItem: any;
    showControlId: string;
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridTableItem extends MapComponent<IAppGridTableItemProps, IAppGridTableItemState> {

    constructor(props: IAppGridTableItemProps, context?: any) {
        super(props, context);
        this.state = {
            hidden: false,
            hover: {},
            rowItem: this.props.components[0] || {},
            showControlId: ''
        };
    }

    /**
     * 重载添加组件
     * @param t 组件路径
     */
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/grid/AppGridTableItem');
    }

    render() {
        const { selectedId, id, index, columns, components } = this.props;
        const { showControlId } = this.state;
        let { rowItem } = this.state;
        if (index) {
            rowItem = components[index];
        }

        return (
            <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                {
                    (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                            className={`flex-row ${selectedId === id ? 'map-select-open' : ''}`}
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
                                            element = (
                                                showControlId === item.id ?
                                                <Input
                                                    placeholder="请输入"
                                                    size="small"
                                                    value={rowItem.p[item.id.replace(/\./g, '')]}
                                                    onChange={(e) => this.mapComponentChange(e, item, rowItem, 'input')}
                                                /> :
                                                <span>{rowItem.p[item.id.replace(/\./g, '')]}</span>
                                            );
                                            break;
                                        case 'input':
                                            element = <Input
                                                placeholder="请输入"
                                                size="small"
                                                value={rowItem.p[item.id.replace(/\./g, '')]}
                                                onChange={(e) => this.mapComponentChange(e, item, rowItem, 'input')}
                                            />;
                                            break;
                                        case 'link':
                                            element = (
                                                showControlId === item.id ?
                                                <Input
                                                    placeholder="请输入"
                                                    size="small"
                                                    value={rowItem.p[item.id.replace(/\./g, '')]}
                                                    onChange={(e) => this.mapComponentChange(e, item, rowItem, 'input')}
                                                /> :
                                                <a href={rowItem.p[item.id.replace(/\./g, '')]} style={{textDecoration: 'underline'}}>{rowItem.p[item.id.replace(/\./g, '')]}</a>
                                            );
                                            break;
                                        case 'select':
                                            element = <Select defaultValue="选择框" size="small"/>;
                                            break;
                                        case 'date':
                                            const dateValue = rowItem.p[item.id.replace(/\./g, '')];
                                            const isDate = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/.test(dateValue);
                                            element = <DatePicker
                                                size="small"
                                                placeholder="请选择"
                                                format={'YYYY-MM-DD'}
                                                value={(isDate ? moment(dateValue, 'YYYY-MM-DD') : undefined )}
                                                onChange={(value, dateString) => this.mapComponentChange(value, item, rowItem, 'date')}
                                            />;
                                            break;
                                        case 'number':
                                            element = <InputNumber
                                                placeholder="请输入"
                                                size="small"
                                                value={rowItem.p[item.id.replace(/\./g, '')]}
                                                onChange={(e) => this.mapComponentChange(e, item, rowItem, 'inputNumber')}
                                            />;
                                            break;
                                        case 'radio':
                                            element = <Checkbox />;
                                            break;
                                        case 'lookup':
                                            element = <span>＋</span>;
                                            break;
                                        default:
                                            element = '';
                                    }

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex1 rowItem"
                                            onMouseEnter={() => this.setState({showControlId: item.id})}
                                            onMouseLeave={() => this.setState({showControlId: ''})}
                                            style={{minWidth: map_gh_width, textAlign: map_gh_align}}
                                        >
                                            <div className="cellStyle" ref={(ref) => this.editCom = ref}>
                                                {element}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )
                }
            </Draggable>
        );
    }

    private mapComponentChange(value: any, item: any, rowItemState: any, type: string) {
        const { updateProps, selectedId } = this.props;
        if (selectedId) {
            switch (type) {
                case 'input':
                    rowItemState.p[item.id.replace(/\./g, '')] = value.target.value;
                    break;
                case 'date':
                    rowItemState.p[item.id.replace(/\./g, '')] = value ? value.format('YYYY-MM-DD') : '';
                    break;
                case 'inputNumber':
                    rowItemState.p[item.id.replace(/\./g, '')] = `${value}`;
                    break;
            }
            updateProps(selectedId, rowItemState.p);
        }
    }
}
