import { IComData } from '../BaseComponent';

/**
 * 'Run'：运行模式
 * 'Edit'：编辑模式
 */
export type PageMode = 'Run' | 'Edit';

// 画布的偏移量
export interface ICompos {
    stageOffset: { top: number, left: number, right: number, bottom: number };  // stage相对body的偏移量
    canvasOffset: { top: number, left: number, right: number, bottom: number };  // canvas相对stage的偏移量
    borderOffset: { border: number };   // antd全局样式box-sizing导致的组件实际width和height会缩小2*border
}

// config格式
export interface IConfig {
    highPerformance: boolean;   // 高性能模式
    componentPosition: ICompos; // 画布的初始偏移量
    canvasSize: { width: number, height: number };  // 画布初始的宽高
}

// 数据库存储的数据结构
export type ComponentsType = Array<{
    t: string;
    p: IComData;
}>;

export const ComponentsMap = {
    Demo: { t: 'BaseComponent/demo/Demo', p: { name: 'demo', w: 100, h: 100 } },
    Comments: { t: 'Comments/Comments', p: { name: '批注', w: 204, h: 170 } },

    Universal_CheckBox: { t: 'UniversalComponents/CheckBox/CheckBox', p: { name: 'checkbox', w: 110, h: 24 } },
    Universal_Radio: { t: 'UniversalComponents/Radio/Radio', p: { name: 'radio', w: 110, h: 24 } },
    Universal_Button: { t: 'UniversalComponents/Button/Button', p: { name: 'button', w: 82, h: 32 } },
    Universal_Hyperlink: { t: 'UniversalComponents/Hyperlink/Hyperlink', p: { name: 'hyperlink', w: 80, h: 25 } },
    Universal_Selector: { t: 'UniversalComponents/Selector/Selector', p: { name: 'selector', w: 120, h: 32 } },
    Universal_Input: { t: 'UniversalComponents/Input/Input', p: { name: 'input', w: 200, h: 32 } },
    Universal_TextField: { t: 'UniversalComponents/TextField/TextField', p: { name: 'textarea', w: 280, h: 73 } }
};
