import {
    BaseComponent,
    IBaseProps,
    IBaseState,
    EditType
} from '../BaseComponent';
import { IToolButtonGroup } from './model/types';

// tslint:disable-next-line:no-empty-interface
export interface IBaseUniversalComponentProps extends IBaseProps { }

export interface IBaseUniversalComponentState extends IBaseState {
    hidden: boolean;
}

export class BaseUniversalComponent<P extends IBaseUniversalComponentProps, S extends IBaseUniversalComponentState>
    extends BaseComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {

    /**
     * 调用富文本编辑器
     */
    public getRichEditType = (): EditType => {
        return 'Text';
    }

    /**
     * 隐藏文本展示Div
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        this.setState({
            hidden: isHidden
        });
    }

    /**
     * 重写Base方法，是否可以双击修改
     */
    public isDbClickToEdit = (): boolean => {
        return true;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.getCustomState().getTextValue();
    }

    /**
     * 获取组件的字体属性，传给工具栏
     */
    public getFontPropsToTool = (): IToolButtonGroup => {
        return {
            bold: { disabled: false, value: this.getCustomState().getFontWeight() === 'bold' ? 1 : 0 },
            italic: { disabled: false, value: this.getCustomState().getFontStyle() === 'italic' ? 1 : 0 },
            underline: { disabled: false, value: this.getCustomState().getTextDecoration().includes('underline') ? 1 : 0 },
            strikethrough: { disabled: false, value: this.getCustomState().getTextDecoration().includes('line-through') ? 1 : 0 },
            fontSize: { disabled: false, value: this.getCustomState().getFontSize() },
            fontColor: { disabled: false, value: this.getCustomState().getFontColor() },
            textAlign: { disabled: false, value: this.getCustomState().getTextAlign() }
        };
    }
}
