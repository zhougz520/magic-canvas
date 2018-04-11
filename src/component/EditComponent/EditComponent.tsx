import * as React from 'react';

import { IEditProps } from './IEditProps';
import { IEditState } from './IEditState';
import { IEditStyle, EditStyle } from './EditStyle';

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

    hiddenEditCom = () => {
        this.setState({
            maxWidth: 1,
            top: -10000,
            left: -10000
        });
    }

    onKeyDown = (e: any) => {
        if (this.props.handleKeyDownCommand && this.props.handleKeyDownCommand(e) === true) {
            e.stopPropagation();
            e.preventDefault();

            return;
        }
    }

    onKeyUp = (e: any) => {
        if (this.props.handleKeyUpCommand && this.props.handleKeyUpCommand(e) === true) {
            e.stopPropagation();
            e.preventDefault();

            return;
        }
    }

    setPosition = (maxWidth: number, top: number, left: number): void => {
        this.setState({
            maxWidth,
            top,
            left
        });
    }

    setValue = (value: string): void => {
        (this.editor as HTMLElement).innerHTML = value;
    }

    getValue = (): string => {
        return (this.editor as HTMLElement).innerHTML;
    }

    setFocus = () => {
        if (this.editor !== null) {
            this.editor.focus();
        }
    }

    onBlur = () => {
        // this.setFocus();
    }

    componentDidMount() {
        this.setFocus();
        (this.editor as HTMLElement).addEventListener('mousedown', this.handleMouseStop);
        (this.editor as HTMLElement).addEventListener('mouseup', this.handleMouseStop);
        (this.editor as HTMLElement).addEventListener('mousemove', this.handleMouseStop);
    }

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
