import { IBaseProps } from '../../../index';
/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IFieldProps extends IBaseProps {
    map_form_f_title: string;
    map_form_f_default: string;
    map_form_f_state: string;
    map_form_f_cols: number;
    map_form_f_disabled: boolean;
    map_form_f_hidden_t: boolean;
    map_form_f_type: string;
    titleWidth: number;
    index: number;
}
