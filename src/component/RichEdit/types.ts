export interface IEditState {
    maxWidth: number;
    top: number;
    left: number;
    style: CSSStyleDeclaration | null;
    editorState: any;
}

export interface IEditProps {
    componentPosition?: any;
}

export interface IEditStyle {
    maxWidth: number;
    top: number;
    left: number;
    style: CSSStyleDeclaration | null;
}
