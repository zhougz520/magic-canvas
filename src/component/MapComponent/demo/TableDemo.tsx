import * as React from 'react';
import { PureComponent } from 'react';
import Handsontable from 'handsontable-pro';
import 'handsontable/dist/handsontable.full.css';
import 'handsontable-pro/languages/de-CH';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps {
    // data: any;
}

export default class BtnDemo extends PureComponent<IDemoProps, any> {
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
        const data = Handsontable.helper.createSpreadsheetData(100, 100);
        this.hotInstance = new Handsontable(this.com, {
            data,
            rowHeaders: true,
            colHeaders: true,
            filters: true,
            // dropdownMenu: true,
            manualColumnResize: true,
            manualRowResize: true,
            manualColumnFreeze: true,
            fixedColumnsLeft: 2,
            dropdownMenu: true,
            mergeCells: [
                { row: 1, col: 1, rowspan: 1, colspan: 1 }
            ],
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
            <div>
                <button onClick={this.onExportExcelClick} />
                <div ref={(handler: HTMLElement | null) => this.com = handler} />
            </div>
        );
    }
}
