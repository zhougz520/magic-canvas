import * as React from 'react';
import { PureComponent } from 'react';
import Handsontable from 'handsontable-pro';
import 'handsontable/dist/handsontable.full.css';
import 'handsontable-pro/languages/de-CH';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps {
    // data: any;
}

export default class Table extends PureComponent<IDemoProps, any> {
    static defaultProps = {
        // value: 'test'
    };
    public hotInstance: any;
    public com: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            data: props.data,
            hover: false
        };
        this.hotInstance = null;
    }

    componentDidMount() {
        const data = [
            ['1.1', 'sdfa', 'asdf', 'adsf3', '3fsadf', '3sdf', 'hjldsf', 'euzd', 'asdjfl', 'asdf'],
            ['1.2', 'sdfa', 'asdf', 'adsf3', '3fsadf', '3sdf', 'hjldsf', 'euzd', 'asdjfl', 'asdf'],
            ['1.3', 'sdfa', 'asdf', 'adsf3', '3fsadf', '3sdf', 'hjldsf', 'euzd', 'asdjfl', 'asdf']
        ];
        this.hotInstance = new Handsontable(this.com, {
            data,
            // filters: true,
            colHeaders: [
                    '序号', '需求主题', '需求提出人', '需求人岗位', '场景', '痛点/价值点', '解决方案', '涉及模块', '期望完成日期', '需求负责人'
                ],
            rowHeaders: true,
            // dropdownMenu: true,
            // manualColumnResize: true,
            manualRowResize: true,
            manualColumnFreeze: true,
            bindRowsWithHeaders: true,
            // fixedColumnsLeft: 2,
            // dropdownMenu: true,
            // autoColumnSize : true,
            wordWrap: true,
            // stretchH: ,
            mergeCells: [
                { row: 1, col: 1, rowspan: 1, colspan: 1 }
            ],
            colWidths: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            contextMenu: {   // 自定义右键菜单，可汉化，默认布尔值
                items: {
                    row_above: {
                        name: '上方插入一行'
                    },
                    row_below: {
                        name: '下方插入一行'
                    },
                    hsep1: '---------', // 提供分隔线
                    remove_row: {
                        name: '删除行'
                    }
                }
            } // 右键效果
        });
    }

    componentWillUnmount() {
        this.hotInstance.destroy();
    }

    public onExportExcelClick = () => {
        const exportFile: any = this.hotInstance.getPlugin('exportFile');
        exportFile.downloadFile('xlsx', { filename: 'MyFile'});
    }

    public render() {
        return (
            <div style={{border: 'solid 1px red'}}>
                <div>
                    <input readOnly value={'客户'}/>
                    <input value={'test'} onChange={this.HandleChange}/>
                    <input readOnly value={'系统版本'}/>
                    <input value={'test'}  onChange={this.HandleChange}/>
                    <input value={'test'}  onChange={this.HandleChange}/>
                </div>
                {/* <button onClick={this.onExportExcelClick} /> */}
                <div ref={(handler: HTMLElement | null) => this.com = handler} />
            </div>
        );
    }

    private HandleChange = (e: any) => {
        // tslint:disable-next-line:no-console
        console.log(e);
    }
}
