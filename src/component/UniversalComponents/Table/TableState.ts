import { Record } from 'immutable';

/**
 * TableState的属性
 */
export interface ITableState {
    formulaData: any[];     // 表格数据
    cellData: any[];        // 单元格数据
    mergeData: any[];       // 合并数据
    rowHeights: any[];      // 行高
    colWidths: any[];       // 列宽
    colHeaders: boolean;
    rowHeaders: boolean;
}

const defaultRecord: ITableState = {
    formulaData: [],
    cellData: [],
    mergeData: [],
    rowHeights: [],
    colWidths: [],
    colHeaders: true,
    rowHeaders: true
};

export const TableStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建基类的TableState
 * 提供初始化、get\set对应属性的方法
 */
export class TableState extends TableStateRecord {
    /**
     * 通过传入对象初始化TableState
     * @param tableState ITableState中属性的集合对象（eg：{type: 'primary'}）
     */
    static create(tableState: ITableState): TableState {
        return new TableState(tableState);
    }

    /**
     * 给TableState设置内容
     * @param tableState this.getCustomState()
     * @param put ITableState属性的集合
     */
    static set(tableState: TableState, put: any): TableState {
        const map: any = tableState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new TableState(map);
    }

    getFormulaData(): any[] {
        return this.get('formulaData');
    }

    getCellData(): any[] {
        return this.get('cellData');
    }

    getMergeData(): any[] {
        return this.get('mergeData');
    }

    getRowHeights(): any[] {
        return this.get('rowHeights');
    }

    getColWidths(): any[] {
        return this.get('colWidths');
    }

    getColHeaders(): boolean {
        return this.get('colHeaders');
    }

    getRowHeaders(): boolean {
        return this.get('rowHeaders');
    }

}
