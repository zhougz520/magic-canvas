import * as React from 'react';
import { DraftPublic } from './Draft';
const { Editor, EditorState, RichUtils, InlineUtils, FbjsUtils } = DraftPublic;
const { cx } = FbjsUtils;

import { IEditProps, IEditState, IEditStyle } from './types';
import { EditStyle } from './EditStyle';

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

    handleKeyCommand = (command: any, editorState: any) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);

            return true;
        }

        return false;
    }

    onChange = (editorState: any) => this.setState({ editorState });

    onTab = (e: any) => {
        this.onChange(RichUtils.onTab(e, this.state.editorState));
    }

    blockStyleFn = (block: any): string => {
        const blockAlignment = block.getData() && block.getData().get('text-align');
        const styleULType = block.getData() && block.getData().get('unordered-list-item');
        const styleOLType = block.getData() && block.getData().get('ordered-list-item');

        return this.getListItemClasses(blockAlignment, styleULType === undefined ? styleOLType : styleULType);
    }

    getListItemClasses = (align: string | undefined, styleType: string | undefined) => {
        return cx({
            'block-aligned-center': align === 'center',
            'block-aligned-justify': align === 'justify',
            'block-aligned-right': align === 'right',
            'block-aligned-left': align === 'left',
            'unordered-list-item-image': styleType === 'image',
            'unordered-list-item-disc': styleType === 'disc',
            'unordered-list-item-circle': styleType === 'circle',
            'unordered-list-item-square': styleType === 'square',
            'ordered-list-item-decimal': styleType === 'decimal',
            'ordered-list-item-lower-alpha': styleType === 'lower-alpha',
            'ordered-list-item-lower-roman': styleType === 'lower-roman'
        });
    }

    toggleInlineStyle = (inlineStyle: any) => {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    /**
     * 隐藏编辑框
     */
    hiddenEditCom = () => {
        // this.setState({
        //     maxWidth: 1,
        //     top: -10000,
        //     left: -10000,
        //     style: null
        // });
    }

    /**
     * TODO KeyDown
     */
    onKeyDown = (e: any) => {
        // e.preventDefault();
    }

    /**
     * TODO KeyUp
     */
    onKeyUp = (e: any) => {
        // e.preventDefault();
    }

    /**
     * 设置编辑框的状态
     * @param maxWidth 编辑框最大宽度
     * @param top 相对document的Y偏移量
     * @param left 相对document的X偏移量
     * @param font fontStyle
     */
    setEditComState = (maxWidth: number, top: number, left: number, style: CSSStyleDeclaration): void => {
        // this.setState({
        //     maxWidth,
        //     top,
        //     left,
        //     style
        // });
    }

    /**
     * 设置编辑框内的值
     */
    // TODO value带格式的富文本
    setValue = (value: string): void => {
        // (this.editor as HTMLElement).innerHTML = value;
    }

    /**
     * 获取编辑框内的值
     */
    // TODO value带格式的富文本
    getValue = (): void => {
        // return (this.editor as HTMLElement).innerHTML;
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
                    blockStyleFn={this.blockStyleFn}
                />
            </div>
        );
    }

}
