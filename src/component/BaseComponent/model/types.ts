import { IPosition } from './PositionState';
import { ISize } from './SizeState';

// 富文本编辑模式
export type EditType = 'RichEdit' | 'Text' | 'TextArea' | 'none';

// 富文本组件展示参数类型
export interface IRichEditOption {
    position: IPosition;
    size: ISize;
    font: IFont;
}

// 可设置的文本类型
export interface IFont {
    textAlign: string;
    fontColor: string;
    fontStyle: string;
    textDecoration: string;
    fontSize: number;
    fontWeight: string;
}

// baseState设置后回调类型
export type CallBackType = 'Size' | 'Position' | 'ZIndex' | 'Rich' | 'Custom' | 'Stack';

// 组件对应的批注锚点数据类型
export interface ICommentsList {
    cid: string;
}

// 组件类型
export type ComponentType = 'Map' | 'Universal' | 'Comments' | 'CommentsRect' | 'ImageMagnifier';

// 组件data
export interface IComData {
    id: string;
    txt_v: any;
    w: number;
    h: number;
    l: number;
    t: number;
    p: any;
    zIndex: number;
    customState: any;
    commentsList: any;
    comType: ComponentType | null;
}
