import * as React from 'react';
import { PureComponent } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import 'handsontable/languages/de-CH';
import { Map } from 'immutable';
import { Button, Modal, Input } from 'antd';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps {
    // headParams: string[]; // 表头传入参数数组，数组序号0-2 对应输入框从左到右的位置
}

export default class Table extends PureComponent<IDemoProps, any> {
    static defaultProps = {
        // headParams: ['headParams0', 'headParams1', 'headParams2']
    };
    public hotInstance: any;
    public com: HTMLElement | null = null;
    public headCom: HTMLElement | null = null;
    public hotInstanceHead: any;
    activeLinkTargetRowCol: number[] | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            data: props.data,
            hover: false,
            ModalVisibled: false, // 超链接模态框是否显示
            ModalData: Map<string, any>()  // 超链接模态框数据
        };
        this.hotInstance = null;
    }

    componentDidMount() {
        const data = [
            ['1.1', 'sdfa', 'asdf', 'adsf3', '3fsadf', '3sdf', '<a href="https://www.baidu.com">百度1</a>', 'euzd', 'asdjfl', 'asdf'],
            ['1.2', 'sdfa', 'asdf', 'adsf3', '3fsadf', '3sdf', '<a href="https://www.baidu.com">百度2</a>', 'euzd', 'asdjfl', 'asdf'],
            ['1.3', 'sdfa', 'asdf', 'adsf3', '3fsadf', '3sdf', '<a href="https://www.baidu.com">百度3</a>', 'euzd', 'asdjfl', 'asdf']
        ];
        const head = [['客户', '', '系统版本', '', '']];

        // Handsontable.dom.addEvent(this.com, 'mousedown',  (event: any) => {
        //     if (event.target.firstChild.nodeName === 'A') {
        //     }
        //   });

        this.hotInstance = new Handsontable(this.com, {
            data,
            colHeaders: ['序号', '需求主题', '需求提出人', '需求人岗位', '场景', '痛点/价值点', '解决方案', '涉及模块', '期望完成日期', '需求负责人'],
            width: 940,
            height: 487,
            allowHtml: true,

            manualRowMove: true,
            manualRowResize: true,
            bindRowsWithHeaders: true,

            autoRowSize: true,
            wordWrap: true,
            mergeCells: [
                { row: 1, col: 1, rowspan: 1, colspan: 1 }
            ],
            colWidths: [40, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            columns: [
                {
                    type: 'text',
                    className: 'htCenter'
                }, {
                    type: 'text',
                    className: 'htCenter'
                }, {
                    type: 'text',
                    className: 'htCenter'
                }, {
                    type: 'text',
                    className: 'htCenter'
                }, {
                    type: 'text'
                }, {
                    type: 'text'
                }, {
                    renderer: 'html',
                    readOnly: true
                }, {
                    type: 'text'
                }, {
                    type: 'date',
                    dateFormat: 'YYYY-DD-MM',
                    correctFormat: true,
                    className: 'htCenter'
                }, {
                    type: 'text',
                    className: 'htCenter'
                }
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

        this.hotInstance.updateSettings({
            contextMenu: {
                callback: (key: string, options: any) => {
                    if (key === 'addLink' ) {
                        // tslint:disable-next-line:no-console
                        const colNum = options[0].start.col;
                        const rowNum = options[0].start.row;
                        const cell: any = this.hotInstance.getCell(rowNum, colNum, true);
                        if (cell.firstChild.nodeName === 'A') {
                            // 获取a 标签的 href和文本
                            const hrefValue = cell.firstChild.href;
                            const textValue = cell.firstChild.innerText;
                            let modalDataMap = Map();
                            modalDataMap = modalDataMap.set('Link_Modal_Text', textValue);
                            modalDataMap = modalDataMap.set('Link_Modal_Value', hrefValue);

                            this.setState({
                                ModalData: modalDataMap
                            });
                        } else {
                            // 其他 cell.firstChild.nodeName='#Text'
                            const textValue = cell.firstChild.textContent;
                            let modalDataMap = Map();
                            modalDataMap = modalDataMap.set('Link_Modal_Text', textValue);
                            modalDataMap = modalDataMap.set('Link_Modal_Value', '');
                            this.setState({
                                ModalData: modalDataMap
                            });
                        }
                        this.activeLinkTargetRowCol = [rowNum, colNum];

                        this.ShowModal();
                    }
                },
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
                    },
                    hsep2: '---------', // 提供分隔线
                    addLink: {name: '插入超链接'}

                }
            }
        });

        this.hotInstanceHead = new Handsontable(this.headCom, {
            data: head,
            width: 940,
            height: 24,
            colWidths: [40, 300, 100, 300, 200],
            autoRowSize: true,
            columns: (index: number) => {
                if (index === 0 || index === 2) {
                    return {
                        readOnly: true
                    };
                } else return {};
            }
        });
    }

    componentWillUnmount() {
        this.hotInstance.destroy();
        this.hotInstanceHead.destroy();
    }

    public onExportExcelClick = () => {
        const exportFile: any = this.hotInstance.getPlugin('exportFile');
        exportFile.downloadFile('csv', { filename: 'MyFile'});
    }

    public render() {

        return (
            <div style={{border: 'solid 1px red'}}>
                <Button onClick={this.onExportExcelClick} >导出</Button>
                <Button onClick={this.SaveTableData} >保存</Button>
                <div ref={(handler: HTMLElement | null) => this.headCom = handler} />
                <div ref={(handler: HTMLElement | null) => this.com = handler} />
                <div>
                    <Modal
                        title={'编辑超链接'}
                        visible={this.state.ModalVisibled}
                        onOk={this.HandleOk}
                        onCancel={this.HandleCancel}
                        okText={'确认'}
                        cancelText={'取消'}
                    >
                        <p>
                            <label>文本</label>
                            <Input
                                id={'Link_Modal_Text'}
                                placeholder={'请输入超链接显示的文本'}
                                value={this.state.ModalData.get('Link_Modal_Text')}
                                onChange={this.HandleChangeModalValue}
                            />
                        </p>
                        <p>
                            <label>链接</label>
                            <Input
                                id={'Link_Modal_Value'}
                                placeholder={'请输入链接地址'}
                                value={this.state.ModalData.get('Link_Modal_Value')}
                                onChange={this.HandleChangeModalValue}
                            />
                        </p>
                    </Modal>
                </div>
            </div>
        );
    }

    // 保存按钮 获取表格数据
    private SaveTableData = () => {
        const endRow = this.hotInstance.countRows() - 1;
        const endCol = this.hotInstance.countCols() - 1;

        const data = this.hotInstance.getData(0, 0, endRow, endCol);
        // tslint:disable-next-line:no-console
        console.log(data);
        // 可编辑单元格 坐标分别为（0，1）  （0，3） （0，5） 即 headData[1]/[3]/[5]
        const headData = this.hotInstanceHead.getData(0, 0, 0, 4);
        // tslint:disable-next-line:no-console
        console.log(headData);
    }

    private ShowModal = () => {
        this.setState({
            ModalVisibled: true
        });
    }

    private HandleOk = (e: any) => {

        const textValue = e.target.parentElement.parentElement.parentElement.getElementsByTagName('Input')[0].value;
        const hrefValue = e.target.parentElement.parentElement.parentElement.getElementsByTagName('Input')[1].value;

        if (this.activeLinkTargetRowCol !== null) {
            const cellTarget = this.hotInstance.getCell(this.activeLinkTargetRowCol[0], this.activeLinkTargetRowCol[1]);
            cellTarget.innerHTML = '<a href=' + hrefValue + '>' + textValue + '</a>';
            // 设置单元格超链接，清空modal框数据, 清空选中坐标
            let modalDataMap = Map();
            modalDataMap = modalDataMap.set('Link_Modal_Text', '');
            modalDataMap = modalDataMap.set('Link_Modal_Value', '');
            this.setState({
                ModalData: modalDataMap,
                ModalVisibled: false
            });
            this.activeLinkTargetRowCol = null;
        }
    }

    private HandleCancel = (e: any) => {
        let modalDataMap = Map();
        modalDataMap = modalDataMap.set('Link_Modal_Text', '');
        modalDataMap = modalDataMap.set('Link_Modal_Value', '');
        this.setState({
            ModalData: modalDataMap,
            ModalVisibled: false
          });
        this.activeLinkTargetRowCol = null;
    }

    private HandleChangeModalValue = (e: any) => {
        let modalData = this.state.ModalData;
        if (e.target.id === 'Link_Modal_Text') {
            modalData = modalData.set('Link_Modal_Text', e.target.value);
            setTimeout(() => {
                this.setState({
                    ModalData: modalData
                });
            }, 0);
        } else {
            modalData = modalData.set('Link_Modal_Value', e.target.value);
            this.setState({
                ModalData: modalData
            });
        }
    }

}
