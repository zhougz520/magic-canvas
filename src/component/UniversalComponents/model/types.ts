import { List } from 'immutable';

// PropertiesEnum为属性工具的枚举类，包含属性工具子控件的种类和对应的枚举名称
export enum PropertiesEnum {
    INPUT_TEXT = 'input_text',                  // 单行输入框
    INPUT_TEXTAREA = 'input_textarea',          // 多行输入框
    INPUT_NUMBER = 'input_number',              // 数字输入框
    INPUT_LIST = 'input_list',                  // 输入框单元素列表
    SWITCH = 'switch',                          // 开关选择器
    COLOR_PICKER = 'color_picker',              // 选色器
    SLIDER = 'slider',                          // 滑动输入条
    SELECT = 'select'                           // 下拉选项
}
export interface IpList {
    key: string;
    value: string;
}
/**
 * 属性类型
 */
export interface IProperty {
    pTitle: string;
    pKey: string;
    pValue: any;
    pType: PropertiesEnum;
    pList?: IpList[];
}

/**
 * 属性分组类型
 */
export interface IPropertyGroup {
    groupTitle: string;
    groupKey: string;
    isActive: boolean;
    colNum: number;
    propertyList: List<IProperty>;
}

/**
 * 工具栏button属性
 */
export interface IEditToolButtonType {
    disabled: boolean;              // 是否禁用
    value: any;                     // 值（0:未选中；1:选中；其他）
}

/**
 * 工具栏button分组
 */
export interface IToolButtonGroup {
    bold: IEditToolButtonType;
    italic: IEditToolButtonType;
    underline: IEditToolButtonType;
    strikethrough: IEditToolButtonType;
    fontSize: IEditToolButtonType;
    fontColor: IEditToolButtonType;
    textAlign: IEditToolButtonType;
}

export const emptyButtonGroup = {
    bold: { disabled: false, value: 0 },
    italic: { disabled: false, value: 0 },
    underline: { disabled: false, value: 0 },
    strikethrough: { disabled: false, value: 0 },
    fontSize: { disabled: false, value: 14 },
    fontColor: { disabled: false, value: '#fff' },
    textAlign: { disabled: false, value: null }
};

export interface IFontState {
    fontColor: string;
    fontStyle: string;
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    textDecoration: string;
    textValue: string;
}
