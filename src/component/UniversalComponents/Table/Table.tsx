import * as React from 'react';
import * as Handsontable from 'handsontable';
import { HotTable } from '@xprst/handsontable-react';
import 'handsontable/dist/handsontable.full.css';
import 'handsontable/languages/zh-CN';

import {
    BaseState,
    ContentState,
    BaseComponent,
    IBaseProps,
    IBaseState,
    BaseStyle,
    EditType,
    IRichEditOption,
    IFont,
    IPosition,
    ISize
} from '../../BaseComponent';
import { CommandMap } from '../../Canvas';
import { IToolButtonGroup, PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';

import { TableState, ITableState as ICustomTableState } from './TableState';
import '../sass/UComponents.scss';

import { GlobalUtil } from '../../util';
const { fromImmutableToJs } = GlobalUtil;
import { DraftPublic } from 'xprst-draft';
const { FbjsUtils } = DraftPublic;
const { cx } = FbjsUtils;
// tslint:disable-next-line:no-var-requires
const clone = require('clone');

import { Map, OrderedSet, List } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface ITableProps extends IBaseProps { }

export interface ITableState extends IBaseState {
    hidden: boolean;
}

/* tslint:disable:jsx-no-multiline-js no-console */
export default class Table extends BaseComponent<ITableProps, ITableState> {
    private hot: HotTable | null = null;

    private _padding: number = 8;
    private _isCanMove: boolean = false;
    private _defaultFont: IFont = {
        textAlign: 'left',
        fontColor: 'rgba(0, 0, 0, 0.65)',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        textDecoration: 'none'
    };

    constructor(props: ITableProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new TableState({
                formulaData: Handsontable.helper.createEmptySpreadsheetData(10, 10),
                cellData: [],
                mergeData: []
            }), '表格'),
            hidden: false
        };
    }

    /**
     * BaseComponent方法：组件是否可以移动
     * 组件自己重写
     */
    public isCanMove = () => {
        return this._isCanMove;
    }

    /************************************* begin 富文本 ****************************************/
    /**
     * 调用富文本编辑器
     */
    public getRichEditType = (): EditType => {
        return 'Text';
    }

    /**
     * 隐藏文本展示Div
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        this.setState({
            hidden: isHidden
        });
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = {
            top: comPosition.top + 7,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - this._padding,
            height: 16
        };
        const font: IFont = this._defaultFont;

        return { position, size, font };
    }

    /**
     * 获取组件富文本内容
     * 返回：带格式的富文本内容
     */
    public getRichChildNode = (): any => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getRichChildNode();
    }

    /**
     * 设置组件文本内容
     */
    public setRichChildNode = (param: any): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            richChildNode: param.value
        }) as ContentState;
        const newBaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('Rich'));
    }

    /**
     * 获取组件的字体属性，传给工具栏
     */
    public getFontPropsToTool = (): IToolButtonGroup => {
        const cellMeta: any = this.getHighLightCellMeta();
        let { textAlign, fontColor, fontStyle, fontSize, fontWeight, textDecoration } = this._defaultFont;
        textAlign = this.getCellStyle(cellMeta, 'textAlign', textAlign);
        fontColor = this.getCellStyle(cellMeta, 'fontColor', fontColor);
        fontStyle = this.getCellStyle(cellMeta, 'fontStyle', fontStyle);
        fontSize = Number(this.getCellStyle(cellMeta, 'fontSize', fontSize));
        fontWeight = this.getCellStyle(cellMeta, 'fontWeight', fontWeight);
        textDecoration = this.getCellStyle(cellMeta, 'textDecoration', textDecoration);

        return {
            bold: { disabled: false, value: fontWeight === 'bold' ? 1 : 0 },
            italic: { disabled: false, value: fontStyle === 'italic' ? 1 : 0 },
            underline: { disabled: false, value: textDecoration.includes('underline') ? 1 : 0 },
            strikethrough: { disabled: false, value: textDecoration.includes('line-through') ? 1 : 0 },
            fontSize: { disabled: false, value: fontSize },
            fontColor: { disabled: false, value: fontColor },
            textAlign: { disabled: false, value: textAlign }
        };
    }

    /**
     * 为普通文本设置加粗
     */
    public setFontPropsFromTool = (fontStyleType: string, value: any, key: number) => {
        const cellMeta: any = this.getHighLightCellMeta();
        const { textAlign, fontStyle, fontWeight, textDecoration } = this._defaultFont;

        const pKey: string = fontStyleType;
        let pValue: any = '';

        switch (fontStyleType) {
            case 'fontWeight':
                if (key === 0) {
                    pValue = this.getCellStyle(cellMeta, 'fontWeight', fontWeight) === value ? 'normal' : value;
                } else {
                    pValue = value;
                }
                break;
            case 'fontStyle':
                if (key === 0) {
                    pValue = this.getCellStyle(cellMeta, 'fontStyle', fontStyle) === value ? 'normal' : value;
                } else {
                    pValue = value;
                }
                break;
            case 'textDecoration':
                if (key === 0) {
                    pValue = cx({
                        'none': this.getCellStyle(cellMeta, 'textDecoration', textDecoration) === value,
                        'underline': (value === 'underline' && this.getCellStyle(cellMeta, 'textDecoration', textDecoration).includes('underline') === false) ||
                            (value !== 'underline' && this.getCellStyle(cellMeta, 'textDecoration', textDecoration).includes('underline') === true),
                        'line-through': (value === 'line-through' && this.getCellStyle(cellMeta, 'textDecoration', textDecoration).includes('line-through') === false) ||
                            (value !== 'line-through' && this.getCellStyle(cellMeta, 'textDecoration', textDecoration).includes('line-through') === true)
                    });
                } else {
                    pValue = value;
                }
                break;
            case 'fontColor':
                pValue = value;
                break;
            case 'fontSize':
                pValue = value;
                break;
            case 'textAlign':
                if (key === 0) {
                    pValue = this.getCellStyle(cellMeta, 'textAlign', textAlign) === value ? 'left' : value;
                } else {
                    pValue = value;
                }
                break;
        }

        if (key === 0) {
            this.props.executeCommand({
                t: CommandMap.EDITOR_SETFIRSTVALUE,
                d: pValue
            });
        }
        this.setPropertiesFromProperty(pKey, pValue, () => {
            if (key === 0) {
                this.props.onCommandProperties && this.props.onCommandProperties(this.getFontPropsToTool());
            }
        });
    }
    /************************************* end 富文本 ****************************************/

    /************************************* begin 属性设置 ****************************************/
    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const cellMeta: any = this.getHighLightCellMeta();
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 单元格属性
        propertyList = propertyList.push(
            { pTitle: '颜色填充', pKey: 'backgroundColor', pValue: this.getCellStyle(cellMeta, 'backgroundColor', '#FFF'), pType: PropertiesEnum.COLOR_PICKER }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '单元格属性', groupKey: 'cellProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any, callback?: () => void) => {
        if (this.hot) {
            const selected = this.hot.hotInstance.getSelected();
            if (!selected) return;

            for (let i = 0; i < selected.length; i += 1) {
                const item = selected[i];
                const startRow: number = Math.min(item[0], item[2]);
                const endRow: number = Math.max(item[0], item[2]);
                const startCol: number = Math.min(item[1], item[3]);
                const endCol: number = Math.max(item[1], item[3]);

                for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
                    for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
                        this.hot.hotInstance.setCellMeta(rowIndex, columnIndex, pKey, pValue);
                    }
                }
            }

            this.setCellData();
            setTimeout(() => {
                callback && callback();
            }, 0);
        }
    }
    /************************************* end 属性设置 ****************************************/

    /**
     * 表格自定义样式渲染
     */
    styleRenderer = (instance: any, td: any, row: any, col: any, prop: any, value: any, cellProperties: any) => {
        (Handsontable.renderers as any).getRenderer(cellProperties.type).apply(window, [instance, td, row, col, prop, value, cellProperties]);
        td.style.cssText = this.getCssText(cellProperties);
    }

    componentDidMount() {
        if (this.hot) {
            // 合并、取消合并
            this.hot.hotInstance.addHook('afterMergeCells', ((cellRange: any, mergeParent: any, auto: any) => {
                if (auto === false) {
                    this.setMergeCellsData();
                }
            }) as any);
            this.hot.hotInstance.addHook('afterUnmergeCells', ((cellRange: any, auto: any) => {
                if (auto === false) {
                    this.setMergeCellsData();
                }
            }) as any);

            // 修改列宽
            this.hot.hotInstance.addHook('afterColumnResize', ((currentColumn: any, newSize: any, isDoubleClick: any) => {
                this.setColWidths();
            }) as any);

            // 修改
            this.hot.hotInstance.addHook('afterChange', ((changes: any, source: any) => {
                if (source === 'edit' || source === 'CopyPaste.paste') {
                    this.setFormulaData();
                }
            }) as any);

            // 删除行
            this.hot.hotInstance.addHook('afterRemoveRow', ((index: any, amount: any, physicalRows: any, source: any) => {
                if (source === 'ContextMenu.removeRow') {
                    this.setFormulaData();
                }
            }) as any);

            // 删除列
            this.hot.hotInstance.addHook('afterRemoveCol', ((index: any, amount: any, physicalRows: any, source: any) => {
                if (source === 'ContextMenu.removeColumn') {
                    this.setFormulaData();
                }
            }) as any);

            // 新增行
            this.hot.hotInstance.addHook('afterCreateRow', ((index: any, amount: any, source: any) => {
                if (source === 'ContextMenu.rowAbove' || source === 'ContextMenu.rowBelow') {
                    this.setFormulaData();
                }
            }) as any);

            // 新增列
            this.hot.hotInstance.addHook('afterCreateCol', ((index: any, amount: any, source: any) => {
                if (source === 'ContextMenu.columnRight' || source === 'ContextMenu.columnLeft') {
                    this.setFormulaData();
                }
            }) as any);
        }
    }

    render() {
        console.log('render');
        const { hidden } = this.state;
        const customTableState: TableState = this.getCustomState();

        return (
            <div
                style={{
                    ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), true, this.isCanSelected()),
                    borderColor: '#d3d5d9',
                    backgroundColor: '#fff'
                }}
                onMouseDown={this.fireSelectChange}
            >
                <div
                    style={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: '#f0f0ff',
                        borderBottom: '1px solid #d3d5d9',
                        lineHeight: '30px',
                        paddingLeft: '8px'
                    }}
                    onMouseDown={this.onTitleMouseDown}
                    onMouseUp={this.onTitleMouseUp}
                    onDoubleClick={this.doDbClickToEdit}
                >
                    {hidden ? '' : this.getRichChildNode()}
                </div>
                <HotTable
                    id={`hot-${this.getCid()}`}
                    ref={(render: HotTable) => this.hot = render}
                    style={{ margin: '-1px' }}
                    renderer={this.styleRenderer as any}
                    width={this.getSizeState().getWidth()}
                    height={this.getSizeState().getHeight() - 30}
                    language="zh-CN"
                    data={clone(fromImmutableToJs(customTableState.getFormulaData()))}      // 数据
                    cell={fromImmutableToJs(customTableState.getCellData())}                // 单元格样式数据
                    mergeCells={fromImmutableToJs(customTableState.getMergeData())}         // 单元格合并数据
                    rowHeights={23}                                                         // 行高
                    colWidths={fromImmutableToJs(customTableState.getColWidths())}          // 列宽
                    colHeaders={customTableState.getColHeaders()}                           // 是否显示列标题
                    rowHeaders={customTableState.getRowHeaders()}                           // 是否显示行标题
                    // manualColumnMove={customTableState.getColHeaders()}         // 移动列
                    // manualRowMove={customTableState.getRowHeaders()}            // 移动行
                    manualColumnResize={customTableState.getColHeaders()}                   // 手动调整列宽
                    // manualRowResize={customTableState.getRowHeaders()}          // 手动调整行高
                    // autoRowSize                                                 // 自动调整行高
                    contextMenu={[
                        'row_above',
                        'row_below',
                        '---------',
                        'col_left',
                        'col_right',
                        '---------',
                        'remove_row',
                        'remove_col',
                        '---------',
                        'cut',
                        'copy',
                        '---------',
                        'mergeCells'
                    ]}                                                                      // 右键菜单
                    outsideClickDeselects={false}                                           // 在表格外点击是否丢失选中
                    stretchH="last"                                                         // 最后一行自适应
                    dragToScroll={false}
                />
            </div>
        );
    }

    /**
     * 设置组件是否可以移动
     */
    private setIsCanMove = (isCanMove: boolean): void => {
        this._isCanMove = isCanMove;
    }

    /**
     * 标题MouseDown
     */
    private onTitleMouseDown = (e: any) => {
        this.selectComChange(e, null);
        this.setIsCanMove(true);
    }

    /**
     * 标题MouseUp
     */
    private onTitleMouseUp = (e: any) => {
        this.setIsCanMove(false);
    }

    /**
     * 控件选中
     * @param id 组件id
     */
    private selectComChange = (e: any, id: string | null) => {
        if (id === null) {
            if (this.hot) {
                this.hot.hotInstance.deselectCell();
            }
        }
    }

    /**
     * 获取样式
     * @param cssText 样式字符串
     * @param name 样式名称
     */
    private getCellStyle = (cellMeta: any, name: string, defaultValue?: any): string => {
        let cssText = cellMeta[name];
        cssText = cssText ? cssText : defaultValue;

        return cssText ? cssText : '';
    }

    /**
     * 获取单元格样式
     * @param cellProperties 单元格属性
     */
    private getCssText = (cellProperties: any): string => {
        const { textAlign, fontColor, fontStyle, fontSize, fontWeight, textDecoration, backgroundColor } = cellProperties;
        const cssText: any[] = [];

        textAlign && cssText.push(`text-align: ${textAlign}`);
        fontColor && cssText.push(`color: ${fontColor}`);
        fontStyle && cssText.push(`font-style: ${fontStyle}`);
        fontSize && cssText.push(`font-size: ${fontSize}px`);
        fontWeight && cssText.push(`font-weight: ${fontWeight}`);
        textDecoration && cssText.push(`text-decoration: ${textDecoration}`);
        backgroundColor && cssText.push(`background-color: ${backgroundColor}`);

        return cssText.join(';');
    }

    /**
     * 获取高亮单元格
     */
    private getHighLightCellMeta = (): any => {
        let cellMeta: any = {};
        if (this.hot) {
            const selected = this.hot.hotInstance.getSelectedRange();
            if (selected) {
                const lastHighlight = (selected[selected.length - 1] as any).highlight;
                cellMeta = this.hot.hotInstance.getCellMeta(lastHighlight.row, lastHighlight.col) as any;
            }
        }

        return cellMeta;
    }

    /**
     * 设置数据
     */
    private setFormulaData = () => {
        setTimeout(() => {
            if (this.hot) {
                const formulaData = clone(this.hot.hotInstance.getData());

                const newTableState: TableState = TableState.set(this.getCustomState(), Map({ formulaData }));
                this.setCustomState(newTableState, true);
            }
        }, 0);
    }

    /**
     * 设置样式数据
     */
    private setCellData = () => {
        if (this.hot) {
            const cellData: any[] = [];
            const rowsCount: number = this.hot.hotInstance.countRows();
            for (let i = 0; i < rowsCount; i++) {
                const cellMetaAtRow = this.hot.hotInstance.getCellMetaAtRow(i);
                cellMetaAtRow.map(
                    (cellMeta: any, cellIndex: number) => {
                        cellData.push({
                            row: i,
                            col: cellIndex,
                            textAlign: cellMeta.textAlign ? cellMeta.textAlign : '',
                            fontColor: cellMeta.fontColor ? cellMeta.fontColor : '',
                            fontStyle: cellMeta.fontStyle ? cellMeta.fontStyle : '',
                            fontSize: cellMeta.fontSize ? cellMeta.fontSize : '',
                            fontWeight: cellMeta.fontWeight ? cellMeta.fontWeight : '',
                            textDecoration: cellMeta.textDecoration ? cellMeta.textDecoration : '',
                            backgroundColor: cellMeta.backgroundColor ? cellMeta.backgroundColor : ''
                        });
                    }
                );
            }

            const newTableState: TableState = TableState.set(this.getCustomState(), Map({ cellData }));
            this.setCustomState(newTableState);
        }
    }

    /**
     * 设置合并单元格数据
     */
    private setMergeCellsData = () => {
        if (this.hot) {
            const mergeData: any[] = [];
            const mergedCells = this.hot.hotInstance.getPlugin('mergeCells').mergedCellsCollection.mergedCells;
            mergedCells.map(
                (merged) => {
                    mergeData.push({
                        row: merged.row,
                        col: merged.col,
                        rowspan: merged.rowspan,
                        colspan: merged.colspan
                    });
                }
            );

            const newTableState: TableState = TableState.set(this.getCustomState(), Map({ mergeData }));
            this.setCustomState(newTableState);
        }
    }

    /**
     * 设置列宽数据
     */
    private setColWidths = () => {
        if (this.hot) {
            const colWidths = (this.getCustomState() as TableState).getColWidths();
            const newColWidths = this.hot.hotInstance.getPlugin('manualColumnResize').manualColumnWidths;
            newColWidths.map(
                (colWidth, index) => {
                    colWidths[index] = colWidth;
                }
            );

            const newTableState: TableState = TableState.set(this.getCustomState(), Map({ colWidths }));
            this.setCustomState(newTableState, true);
        }
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ICustomTableState
 */
export function convertFromDataToCustomState(
    customData: ICustomTableState
): any {
    return new TableState(customData);
}
