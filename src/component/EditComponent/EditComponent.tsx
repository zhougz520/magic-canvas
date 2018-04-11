import * as React from 'react';

import { IEditProps } from './IEditProps';
import { IEditState } from './IEditState';
import { IEditStyle, EditStyle } from './EditStyle';

/**
 * EditComponent：画布上的编辑框，所有组件的文本编辑都调用此编辑框来进行
 * 整个画布的焦点一直在EditComponent，避免中文输入的bug
 */
/* tslint:disable:jsx-no-string-ref */
export class EditComponent extends React.PureComponent<IEditProps, IEditState> {
    public editor: HTMLElement | null = null;

    constructor(props: IEditProps, context?: any) {
        super(props, context);

        this.state = {
            maxWidth: 1,
            top: -10000,
            left: -10000
        } ;
    }

    /**
     * 隐藏编辑框
     */
    hiddenEditCom = () => {
        this.setState({
            maxWidth: 1,
            top: -10000,
            left: -10000
        });
    }

    /**
     * 编辑框接收整个画布的KeyDown事件，然后转发到画布的KeyDown事件上做操作
     * 如果是非编辑模式就执行画布的KeyDown逻辑，如果是编辑模式就执行编辑框的操作逻辑
     */
    onKeyDown = (e: any) => {
        if (this.props.handleKeyDownCommand && this.props.handleKeyDownCommand(e) === true) {
            e.stopPropagation();
            e.preventDefault();

            return;
        }
    }

    /**
     * 同KeyDown
     */
    onKeyUp = (e: any) => {
        if (this.props.handleKeyUpCommand && this.props.handleKeyUpCommand(e) === true) {
            e.stopPropagation();
            e.preventDefault();

            return;
        }
    }

    /**
     * 设置编辑框位置
     * @param maxWidth 编辑框最大宽度
     * @param top 相对document的Y偏移量
     * @param left 相对document的X偏移量
     */
    setPosition = (maxWidth: number, top: number, left: number): void => {
        this.setState({
            maxWidth,
            top,
            left
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

    onBlur = () => {
        // this.setFocus();
    }

    componentDidMount() {
        // 编辑框常驻焦点，canvas获得焦点时也把焦点定位到编辑框
        this.setFocus();

        (this.editor as HTMLElement).addEventListener('mousedown', this.handleMouseStop);
        (this.editor as HTMLElement).addEventListener('mouseup', this.handleMouseStop);
        (this.editor as HTMLElement).addEventListener('mousemove', this.handleMouseStop);
    }

    /**
     * 阻止编辑框上的鼠标事件冒泡到画布
     */
    handleMouseStop = (e: any) => {
        e.stopPropagation();
    }

    render() {
        const { maxWidth, top, left } = this.state;
        const editStyle: IEditStyle = {
            maxWidth,
            top,
            left
        };

        return (
            <div
                id="_editComponent"
                ref={(handler) => this.editor = handler}
                contentEditable
                suppressContentEditableWarning
                style={EditStyle(editStyle)}
                tabIndex={-1}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                onBlur={this.onBlur}
            />
        );
    }

}
