import { List } from 'immutable';

// PropertiesEnum为属性工具的枚举类，包含属性工具子控件的种类和对应的枚举名称
export enum PropertiesEnum {
    INPUT_TEXT = 'input_text',                  // 单行输入框
    INPUT_TEXTAREA = 'input_textarea',          // 多行输入框
    INPUT_NUMBER = 'input_number',              // 数字输入框
    INPUT_LIST = 'input_list',                  // 输入框单元素列表
    SWITCH = 'switch',                          // 开关选择器
    COLOR_PICKER = 'color_picker',              // 选色器
    SLIDER = 'slider'                           // 滑动输入条
}

/**
 * 属性类型
 */
export interface IProperty {
    pTitle: string;
    pKey: string;
    pValue: any;
    pType: PropertiesEnum;
}

/**
 * 属性分组类型
 */
export interface IPropertyGroup {
    groupTitle: string;
    groupKey: string;
    colNum: number;
    propertyList: List<IProperty>;
}

export interface IFontState {
    fontColor: string;
    fontStyle: string;
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    textDecoration: string;
    textValue: string;
}
