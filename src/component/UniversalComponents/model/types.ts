// PropertiesEnum为属性工具的枚举类，包含属性工具子控件的种类和对应的枚举名称
export enum PropertiesEnum {
    INPUT_STRING = 'input_string',               // 单行输入框
    INPUT_NUMBER = 'input_number',               // 数字输入框
    INPUT_TEXT = 'input_text',                   // 多行输入框
    SWITCH = 'switch',                           // 开关选择器
    INPUT_LIST = 'input_list',                   // 输入框单元素列表
    INPUT_OBJECT_LIST = 'input_object_list',     // 输入框对象列表
    COLOR_PICKER = 'color_picker',               // 选色器
    SLIDER = 'slider'                            // 滑动输入条
}

export interface IProperty {
    pTitle: string;
    pKey: string;
    pValue: any;
    pType: PropertiesEnum;
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
