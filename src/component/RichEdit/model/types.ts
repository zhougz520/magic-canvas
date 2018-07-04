import { IPosition, ISize, IFont, EditType } from '../../BaseComponent';
import { IToolButtonGroup } from '../../UniversalComponents';

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
    onPressEnter?: () => void;
    onCommandProperties?: (buttonGroup: IToolButtonGroup) => void;
}

export interface IEditStyle {
    top: number;
    left: number;
    width: number;
    height: number;
    style: CSSStyleDeclaration | null;
}
