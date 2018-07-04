import {
    BaseComponent,
    IBaseProps,
    IBaseState,
    EditType
} from '../BaseComponent';
import { CommandMap } from '../Canvas';
import { IToolButtonGroup } from './model/types';

import { DraftPublic } from 'xprst-draft';
const { FbjsUtils } = DraftPublic;
const { cx } = FbjsUtils;

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

    /**
     * 为普通文本设置加粗
     */
    public setFontPropsFromTool = (fontStyleType: string, value: any, key: number) => {
        const pKey: string = fontStyleType;
        let pValue: any = '';

        switch (fontStyleType) {
            case 'fontWeight':
                if (key === 0) {
                    pValue = this.getCustomState().getFontWeight() === value ? 'normal' : value;
                } else {
                    pValue = value;
                }
                break;
            case 'fontStyle':
                if (key === 0) {
                    pValue = this.getCustomState().getFontStyle() === value ? 'normal' : value;
                } else {
                    pValue = value;
                }
                break;
            case 'textDecoration':
                if (key === 0) {
                    pValue = cx({
                        'none': this.getCustomState().getTextDecoration() === value,
                        'underline': (value === 'underline' && this.getCustomState().getTextDecoration().includes('underline') === false) ||
                            (value !== 'underline' && this.getCustomState().getTextDecoration().includes('underline') === true),
                        'line-through': (value === 'line-through' && this.getCustomState().getTextDecoration().includes('line-through') === false) ||
                            (value !== 'line-through' && this.getCustomState().getTextDecoration().includes('line-through') === true)
                    });
                } else {
                    pValue = value;
                }
                break;
            case 'fontColor':
                pValue = value;
                break;
            case 'fontSize':
                pValue = value;
                break;
            case 'textAlign':
                if (key === 0) {
                    pValue = this.getCustomState().getTextAlign() === value ? 'left' : value;
                } else {
                    pValue = value;
                }
                break;
        }

        if (key === 0) {
            this.props.executeCommand({
                t: CommandMap.EDITOR_SETFIRSTVALUE,
                d: pValue
            });
        }
        this.setPropertiesFromProperty(pKey, pValue, () => {
            if (key === 0) {
                this.props.onCommandProperties && this.props.onCommandProperties(this.getFontPropsToTool());
            }
        });
    }
}
