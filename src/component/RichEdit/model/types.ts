import { IPosition, ISize, IFont, EditType } from '../../BaseComponent';

export interface IEditState {
    position: IPosition;
    size: ISize;
    font: IFont;
    style: CSSStyleDeclaration | null;
    richEditType: EditType;
    editorState: any;
    value: any;
}

// tslint:disable-next-line:no-empty-interface
export interface IEditProps {
}

export interface IEditStyle {
    top: number;
    left: number;
    width: number;
    height: number;
    style: CSSStyleDeclaration | null;
}
