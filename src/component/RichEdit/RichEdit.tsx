import * as React from 'react';
import * as keycode from 'keycode';
import { IFont } from '../BaseComponent';
import { IToolButtonGroup } from '../UniversalComponents';
import { DraftPublic } from 'xprst-draft';
const { Editor, EditorState, RichUtils, InlineUtils, BlockUtils, FbjsUtils } = DraftPublic;
const { cx } = FbjsUtils;

import { IEditProps, IEditState, IEditStyle } from './model/types';
import { EditStyle } from './model/EditStyle';
import { blockStyleFn } from './model/DraftUtils';

import './sass/RichEdit.scss';

/**
 * RichEdit：画布上的编辑框，所有组件的文本编辑都调用此编辑框来进行
 */
/* tslint:disable:jsx-no-string-ref jsx-no-multiline-js */
export class RichEdit extends React.PureComponent<IEditProps, IEditState> {
    public editor: HTMLElement | null = null;

    constructor(props: IEditProps, context?: any) {
        super(props, context);

        this.state = this.getDefaultEditState();
    }

    /**
     * 获取EditState默认值
     */
    getDefaultEditState = (): IEditState => {
        return {
            position: { top: -10000, left: -10000 },
            size: { width: 0, height: 0 },
            font: {
                textAlign: 'center',
                fontColor: 'rgba(0, 0, 0, 0.65)',
                fontStyle: 'normal',
                fontSize: 14,
                fontWeight: 'normal',
                textDecoration: 'none'
            },
            style: null,
            richEditType: 'none',
            editorState: EditorState.createEmpty(),
            value: ''
        };
    }

    /**
     * 快捷键触发方法
     */
    handleKeyCommand = (command: any, editorState: any) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);

            return true;
        }

        return false;
    }

    /**
     * Draft修改内容触发
     */
    onChange = (editorState: any) => {
        const { BOLD, ITALIC, UNDERLINE, STRIKETHROUGH } = InlineUtils.getSelectionInlineStyle(editorState);
        const { COLOR, FONTSIZE } = InlineUtils.getSelectionCustomInlineStyle(editorState, ['COLOR', 'FONTSIZE']);
        const TEXTALIGN = BlockUtils.getSelectedBlocksMetadata(editorState).get('text-align');

        const fontProps: IToolButtonGroup = {
            bold: { disabled: false, value: BOLD ? 1 : 0 },
            italic: { disabled: false, value: ITALIC ? 1 : 0 },
            underline: { disabled: false, value: UNDERLINE ? 1 : 0 },
            strikethrough: { disabled: false, value: STRIKETHROUGH ? 1 : 0 },
            fontSize: { disabled: false, value: FONTSIZE ? Number(FONTSIZE.substring(9)) : 14 },
            fontColor: { disabled: false, value: COLOR ? COLOR.substring(6) : 'rgba(0, 0, 0, 0.65)' },
            textAlign: { disabled: false, value: TEXTALIGN ? TEXTALIGN : 'left' }
        };
        this.props.onCommandProperties && this.props.onCommandProperties(fontProps);
        this.setState({ editorState });
    }

    /**
     * tab按键方法
     */
    onTab = (e: any) => {
        this.onChange(RichUtils.onTab(e, this.state.editorState));
    }

    /**
     * 撤销重做
     */
    undoRedo = (type: 'undo' | 'redo') => {
        if (this.state.editorState) {
            let newEditorState = null;
            if (type === 'undo') {
                newEditorState = EditorState.undo(this.state.editorState);
            } else {
                newEditorState = EditorState.redo(this.state.editorState);
            }
            this.onChange(newEditorState);
        }
    }

    /**
     * 设置InLineStyle
     * @param inlineStyle 对应Draft-js的inlineStyleRenderMap
     */
    toggleInlineStyle = (inlineStyle: any) => {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    /**
     * 设置无序列表样式
     */
    toggleULBlockTypeClass = (styleType: any) => {
        this.onChange(
            BlockUtils.setListBlockStyleData(
                this.state.editorState,
                'unordered-list-item',
                styleType ? styleType : 'image'
            )
        );
    }

    /**
     * 设置有序列表样式
     */
    toggleOLBlockTypeClass = (styleType: any) => {
        this.onChange(
            BlockUtils.setListBlockStyleData(
                this.state.editorState,
                'ordered-list-item',
                styleType ? styleType : 'decimal'
            )
        );
    }

    /**
     * 设置字体颜色
     */
    toggleFontColor = (color: any) => {
        this.onChange(
            InlineUtils.toggleCustomInlineStyle(
                this.state.editorState,
                'color',
                color
            )
        );
    }

    /**
     * 设置字体大小
     */
    toggleFontSize = (fontSize: any) => {
        this.onChange(
            InlineUtils.toggleCustomInlineStyle(
                this.state.editorState,
                'fontSize',
                fontSize
            )
        );
    }

    /**
     * 设置文本对齐方式
     */
    toggleTextAlign = (textAlign: any) => {
        const currentTextAlignment = BlockUtils.getSelectedBlocksMetadata(this.state.editorState).get('text-align');
        if (currentTextAlignment !== textAlign) {
            this.onChange(
                BlockUtils.mergeBlockData(
                    this.state.editorState,
                    { 'text-align': textAlign }
                )
            );
        } else {
            this.onChange(
                BlockUtils.mergeBlockData(
                    this.state.editorState,
                    { 'text-align': undefined }
                )
            );
        }
    }

    /**
     * 普通文本修改
     */
    onChangeForText = (e: any) => {
        this.setState({ value: e.target.value });
    }

    /**
     * 为普通文本设置加粗
     */
    toggleFontWeightForText = (fontWeight: string) => {
        const currentFont: IFont = this.state.font;
        const newFont: IFont = {
            ...currentFont,
            fontWeight: currentFont.fontWeight === fontWeight ? 'normal' : fontWeight
        };
        this.setFontState({
            font: newFont
        });
    }

    /**
     * 为普通文本设置斜体
     */
    toggleFontStyleForText = (fontStyle: string) => {
        const currentFont: IFont = this.state.font;
        const newFont: IFont = {
            ...currentFont,
            fontStyle: currentFont.fontStyle === fontStyle ? 'normal' : fontStyle
        };
        this.setFontState({
            font: newFont
        });
    }

    /**
     * 为普通文本设置下划线、删除线
     */
    toggleTextDecorationForText = (textDecoration: string) => {
        const currentFont: IFont = this.state.font;
        const newFont: IFont = {
            ...currentFont,
            textDecoration: cx({
                'none': currentFont.textDecoration === textDecoration,
                'underline': (textDecoration === 'underline' && currentFont.textDecoration.includes('underline') === false) ||
                    (textDecoration !== 'underline' && currentFont.textDecoration.includes('underline') === true),
                'line-through': (textDecoration === 'line-through' && currentFont.textDecoration.includes('line-through') === false) ||
                    (textDecoration !== 'line-through' && currentFont.textDecoration.includes('line-through') === true)
            })
        };
        this.setFontState({
            font: newFont
        });
    }

    /**
     * 为普通文本设置字体颜色
     */
    toggleFontColorForText = (fontColor: string) => {
        const currentFont: IFont = this.state.font;
        const newFont: IFont = {
            ...currentFont,
            fontColor
        };
        this.setFontState({
            font: newFont
        });
    }

    /**
     * 为普通文本设置字体大小
     */
    toggleFontSizeForText = (fontSize: number) => {
        const currentFont: IFont = this.state.font;
        const newFont: IFont = {
            ...currentFont,
            fontSize
        };
        this.setFontState({
            font: newFont
        });
    }

    /**
     * 为普通文本设置对齐方式
     */
    toggleTextAlignForText = (textAlign: string) => {
        const currentFont: IFont = this.state.font;
        const newFont: IFont = {
            ...currentFont,
            textAlign: currentFont.textAlign === textAlign ? 'left' : textAlign
        };
        this.setFontState({
            font: newFont
        });
    }

    /**
     * 设置编辑框的状态
     * @param config 设置的对象
     */
    setEditState = (config: any, callback?: () => void): void => {
        this.setState(config, callback);
    }

    setFontState = (config: any): void => {
        this.setState(config, () => {
            this.props.onCommandProperties && this.props.onCommandProperties(this.getFontPropsToTool());
        });
    }

    getFontPropsToTool = (): IToolButtonGroup => {
        const { fontWeight, fontStyle, textDecoration, fontColor, fontSize, textAlign } = this.state.font;

        return {
            bold: { disabled: false, value: fontWeight === 'bold' ? 1 : 0 },
            italic: { disabled: false, value: fontStyle === 'italic' ? 1 : 0 },
            underline: { disabled: false, value: textDecoration.includes('underline') === true ? 1 : 0 },
            strikethrough: { disabled: false, value: textDecoration.includes('line-through') === true ? 1 : 0 },
            fontSize: { disabled: false, value: fontSize },
            fontColor: { disabled: false, value: fontColor },
            textAlign: { disabled: false, value: textAlign }
        };
    }

    /**
     * 获取编辑框内的值
     */
    getEditValue = (): any => {
        const { richEditType } = this.state;

        switch (richEditType) {
            case 'RichEdit':
                return this.state.editorState;
            case 'Text':
            case 'TextArea':
                return this.state.value;
            case 'none':
                return '';
        }
    }

    /**
     * 设置编辑框焦点
     */
    setFocus = (isOnFocus: boolean = true) => {
        const { richEditType } = this.state;
        let target: any = null;
        switch (richEditType) {
            case 'RichEdit':
                target = this.refs.editor;
                break;
            case 'Text':
            case 'TextArea':
                target = this.refs.editorText;
                break;
            case 'none':
                target = null;
                break;
        }
        if (isOnFocus) {
            if (target) target.focus();
        } else {
            if (target) target.blur();
        }
    }

    onKeyDown = (e: any) => {
        const { richEditType } = this.state;
        const key: string = keycode(e);

        switch (richEditType) {
            case 'RichEdit':
                break;
            case 'Text':
                if (key === 'enter') {
                    this.props.onPressEnter && this.props.onPressEnter();
                }
                break;
            case 'TextArea':
                break;
            case 'none':
                break;
        }
    }

    render() {
        const { position, size, font, style, richEditType, editorState, value } = this.state;
        const editStyle: IEditStyle = {
            top: position.top,
            left: position.left,
            width: size.width,
            height: size.height,
            style
        };
        InlineUtils.extractInlineStyle(editorState);

        return (
            <div
                style={EditStyle(editStyle)}
            >
                <Editor
                    editorState={editorState}
                    inlineStyleRenderMap={InlineUtils.getDraftInlineStyleMap()}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    onTab={this.onTab}
                    ref="editor"
                    blockStyleFn={blockStyleFn}
                    disPlay={richEditType === 'RichEdit' ? false : true}
                />
                <div
                    className="RichText-root"
                    style={{
                        display: richEditType === 'Text' || richEditType === 'TextArea' ? 'block' : 'none'
                    }}
                >
                    <textarea
                        ref="editorText"
                        className="RichText-container"
                        onChange={this.onChangeForText}
                        value={value}
                        style={{
                            textAlign: font.textAlign as any,
                            color: font.fontColor as any,
                            fontStyle: font.fontStyle as any,
                            textDecoration: font.textDecoration as any,
                            fontSize: font.fontSize as any,
                            fontWeight: font.fontWeight as any
                        }}
                        onKeyDown={this.onKeyDown}
                    />
                </div>
            </div>
        );
    }

}
