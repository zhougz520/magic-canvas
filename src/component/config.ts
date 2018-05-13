// 画布的偏移量
export interface ICompos {
    stageOffset: { top: number, left: number, right: number, bottom: number };  // stage相对body的偏移量
    canvasOffset: { top: number, left: number, right: number, bottom: number };  // canvas相对stage的偏移量
    borderOffset: { border: number };   // antd全局样式box-sizing导致的组件实际width和height会缩小2*border
}

export interface IConfig {
    highPerformance: boolean;
    componentPosition: ICompos; // 画布的初始偏移量
    canvasSize: { width: number, height: number };  // 画布初始的宽高百分比
}

// config的值为不可修改值，尽量用Record
export const config: IConfig = {
    highPerformance: true,
    componentPosition: {
        stageOffset: { top: 80, left: 184, right: 250, bottom: 35 },
        canvasOffset: { top: 0, left: 0, right: 0, bottom: 0 },
        borderOffset: { border: 1 }
    },
    canvasSize: { width: 2560, height: 1440 }
};

// PropertiesEnum为属性工具的枚举类，包含属性工具子控件的种类和对应的枚举名称
export const PropertiesEnum = {
    INPUT_STRING: 'input_string',    // 单行输入框
    INPUT_NUMBER: 'input_number',    // 数字输入框
    INPUT_TEXT: 'input_text',    // 多行输入框
    SWITCH: 'switch',    // 开关选择器
    INPUT_LIST: 'input_list',  // 输入框单元素列表
    INPUT_OBJECT_LIST: 'input_object_list'  // 输入框对象列表
};
