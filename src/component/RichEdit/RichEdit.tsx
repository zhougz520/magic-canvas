import * as React from 'react';
import { EditType } from '../BaseComponent';
import { DraftPublic } from './Draft';
const { Editor, EditorState, RichUtils, InlineUtils, BlockUtils } = DraftPublic;

import { IEditProps, IEditState, IEditStyle } from './model/types';
import { EditStyle } from './model/EditStyle';
import { blockStyleFn } from './model/DraftUtils';

/**
 * RichEdit：画布上的编辑框，所有组件的文本编辑都调用此编辑框来进行
 */
/* tslint:disable:jsx-no-string-ref */
export class RichEdit extends React.PureComponent<IEditProps, IEditState> {
    public editor: HTMLElement | null = null;

    constructor(props: IEditProps, context?: any) {
        super(props, context);

        this.state = {
            position: { top: -10000, left: -10000 },
            size: { width: 0, height: 0 },
            style: null,
            editorState: EditorState.createEmpty()
        } ;
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
        this.setState({ editorState });
    }

    /**
     * tab按键方法
     */
    onTab = (e: any) => {
        this.onChange(RichUtils.onTab(e, this.state.editorState));
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
    // TODO e参数需要修改
    toggleULBlockTypeClass = (e: any) => {
        this.onChange(
            BlockUtils.setListBlockStyleData(
                this.state.editorState,
                'unordered-list-item',
                e.key === undefined ? 'image' : e.key
            )
        );
    }

    /**
     * 设置有序列表样式
     */
    toggleOLBlockTypeClass = (e: any) => {
        this.onChange(
            BlockUtils.setListBlockStyleData(
                this.state.editorState,
                'ordered-list-item',
                e.key === undefined ? 'decimal' : e.key
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
                    { 'text-align': textAlign.target.value }
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
     * 设置编辑框的状态
     * @param config 设置的对象
     */
    setEditState = (config: any, callback?: () => void): void => {
        this.setState(config, callback);
    }

    /**
     * 获取编辑框内的值
     */
    // TODO value带格式的富文本
    getEditValue = (richEditType: EditType): any => {
        switch (richEditType) {
            case 'RichEdit':
                return this.state.editorState;
        }
    }

    /**
     * 设置编辑框焦点
     */
    setFocus = (isOnFocus: boolean = true) => {
        if (isOnFocus) {
            (this.refs.editor as any).focus();
        } else {
            (this.refs.editor as any).blur();
        }
    }

    render() {
        const { position, size, style, editorState } = this.state;
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
                    // tslint:disable-next-line:jsx-no-string-ref
                    ref="editor"
                    blockStyleFn={blockStyleFn}
                />
            </div>
        );
    }

}
