export interface IEditState {
    maxWidth: number;
    top: number;
    left: number;
    style: CSSStyleDeclaration | null;
}

export interface IEditProps {
    componentPosition: any;

    handleKeyDownCommand?: (e: any) => boolean;
    handleKeyUpCommand?: (e: any) => boolean;
}

export interface IEditStyle {
    maxWidth: number;
    top: number;
    left: number;
    style: CSSStyleDeclaration | null;
}
