import * as React from 'react';

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
            maxWidth: 1,
            top: -10000,
            left: -10000,
            style: null
        } ;
    }

    /**
     * 隐藏编辑框
     */
    hiddenEditCom = () => {
        this.setState({
            maxWidth: 1,
            top: -10000,
            left: -10000,
            style: null
        });
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
        this.setState({
            maxWidth,
            top,
            left,
            style
        });
    }

    /**
     * 设置编辑框内的值
     */
    // TODO value带格式的富文本
    setValue = (value: string): void => {
        (this.editor as HTMLElement).innerHTML = value;
    }

    /**
     * 获取编辑框内的值
     */
    // TODO value带格式的富文本
    getValue = (): string => {
        return (this.editor as HTMLElement).innerHTML;
    }

    /**
     * 设置编辑框焦点
     */
    setFocus = () => {
        if (this.editor !== null) {
            this.editor.focus();
        }
    }

    /**
     * 阻止编辑框上的鼠标事件冒泡到画布
     */
    handleMouseStop = (e: any) => {
        e.preventDefault();
    }

    componentDidMount() {
        if (this.editor) {
            // tslint:disable-next-line:no-console
            this.editor.addEventListener('focus', () => { console.log('Edit获得焦点'); });
            // tslint:disable-next-line:no-console
            this.editor.addEventListener('blur', () => { console.log('Edit失去焦点'); });
        }
    }

    render() {
        const { maxWidth, top, left, style } = this.state;
        const editStyle: IEditStyle = {
            maxWidth,
            top,
            left,
            style
        };

        return (
            <div
                ref={(handler) => this.editor = handler}
                contentEditable
                suppressContentEditableWarning
                style={EditStyle(editStyle)}
                tabIndex={-1}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
            />
        );
    }

}
