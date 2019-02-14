import { IBaseProps } from '../../../IBaseProps';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IFieldProps extends IBaseProps {
    map_form_f_title: string;           // 字段名
    map_form_f_list: any[];             // 默认选项
    map_form_f_default: string;         // 默认值
    map_form_f_state: string;           // 字段状态（必填、非必填）
    map_form_f_cols: number;            // 横跨列数
    map_form_f_disabled: boolean;       // 只读
    map_form_f_hidden_t: boolean;       // 显示标题
    titleWidth: number;
    currUnit: number;
    map_form_f_type: string;            // 字段类型
}
