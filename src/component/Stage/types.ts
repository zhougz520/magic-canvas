import { IComData } from '../BaseComponent';

/**
 * 'Run'：运行模式
 * 'Edit'：编辑模式
 * 'Guest'：访客模式
 */
export type PageMode = 'Run' | 'Edit' | 'Guest';

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
}

// 数据库存储的数据结构
export type ComponentsType = Array<{
    t: string;
    p: IComData;
}>;

export const ComponentsMap = {
    Universal_CheckBox: { t: 'UniversalComponents/CheckBox/CheckBox', p: { name: '多选', w: 110, h: 24 } },
    Universal_Radio: { t: 'UniversalComponents/Radio/Radio', p: { name: '单选', w: 110, h: 24 } },
    Universal_Button: { t: 'UniversalComponents/Button/Button', p: { name: '按钮', w: 82, h: 32 } },
    Universal_Hyperlink: { t: 'UniversalComponents/Hyperlink/Hyperlink', p: { name: '超链接', w: 80, h: 25 } },
    Universal_Selector: { t: 'UniversalComponents/Selector/Selector', p: { name: '下拉框', w: 120, h: 32 } },
    Universal_Input: { t: 'UniversalComponents/Input/Input', p: { name: '单行输入', w: 200, h: 32 } },
    Universal_TextField: { t: 'UniversalComponents/TextField/TextField', p: { name: '多行输入', w: 280, h: 73 } },
    Universal_Image: { t: 'UniversalComponents/ImageCom/Image', p: { name: '图片', w: 300, h: 200 } },
    Universal_RichText: { t: 'UniversalComponents/RichText/RichText', p: { name: '文本', w: 204, h: 170 } }
};

export type ContextMenuType = 'menu' | 'separator';

export interface IContextMenuItems {
    type: ContextMenuType;
    label?: string;
    enabled?: boolean;
    click?: () => void;
}
