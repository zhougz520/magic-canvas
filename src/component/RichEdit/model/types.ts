import { IPosition, ISize } from '../../BaseComponent';

export interface IEditState {
    position: IPosition;
    size: ISize;
    style: CSSStyleDeclaration | null;
    editorState: any;
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
