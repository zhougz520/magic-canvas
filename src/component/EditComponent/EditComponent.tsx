import * as React from 'react';
import styled from 'styled-components';

import { IEditProps } from './IEditProps';
import { IEditState } from './IEditState';
import { IEditStyle, EditStyle } from './EditStyle';
import { ISize, IPosition, IComponent } from '../BaseComponent';

const EditDiv = styled.div`
    border-color: transparent;
    border-style: solid;
    display: inline-block;
    position: absolute;
    overflow: visible;
    word-wrap: normal;
    border-width: 0;
    min-width: 1px;
    resize: none;
    padding: 0px;
    margin: 0px;
`;

/* tslint:disable:jsx-no-string-ref */
export class EditComponent extends React.PureComponent<IEditProps, IEditState> {
    public editor: HTMLElement | null = null;

    constructor(props: IEditProps, context?: any) {
        super(props, context);

        this.state = {
            maxWidth: 1,
            top: -1000,
            left: -1000,
            currentCom: null
        } ;
    }

    // Edit获取焦点
    onEditComFocus = (com: IComponent) => {
        (this.editor as HTMLElement).focus();
        this.setCurrentCom(com);
        // tslint:disable-next-line:no-console
        console.log(com);
    }

    onEditComKeyDown = () => {
        const currentCom: IComponent | null = this.state.currentCom;
        if (currentCom !== null) {
            const comSize: ISize = currentCom.getSize();
            const comPosition: IPosition = currentCom.getPosition();
            const pos = this.props.componentPosition;

            const maxWidth = comSize.width;
            const top = comPosition.top + comSize.height / 2 + pos.canvasOffset.top;
            const left = comPosition.left + comSize.width / 2 + pos.canvasOffset.left;

            this.setPosition(maxWidth, top, left);
        }
    }

    // Edit失去焦点
    onEditComBlur = () => {
        (this.editor as HTMLElement).blur();

        const value = (this.editor as HTMLElement).innerText;
        (this.editor as HTMLElement).innerText = '';

        this.hiddenEditCom();
        const currentCom: IComponent | null = this.state.currentCom;
        if (currentCom !== null) {
            currentCom.setRichChildNode(value);
        }
    }

    showEditCom = (size: ISize, position: IPosition) => {
        // tslint:disable-next-line:no-console
        console.log('showEditCom');
        // tslint:disable-next-line:no-console
        console.log(size);
        // tslint:disable-next-line:no-console
        console.log(position);
    }

    hiddenEditCom = () => {
        this.setState({
            maxWidth: 1,
            top: -1000,
            left: -1000
        });
    }

    sendContent = () => {
        // tslint:disable-next-line:no-console
        console.log('sendContent');
    }

    setCurrentCom = (com: IComponent): void => {
        this.setState({
            currentCom: com
        });
    }

    setPosition = (maxWidth: number, top: number, left: number): void => {
        this.setState({
            maxWidth,
            top,
            left
        });
    }

    render() {
        const { maxWidth, top, left } = this.state;
        const editStyle: IEditStyle = {
            maxWidth,
            top,
            left
        };

        return (
            <EditDiv
                id="editComponent"
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={(handler) => this.editor = handler}
                contentEditable
                suppressContentEditableWarning
                style={EditStyle(editStyle)}
                tabIndex={-1}
                onKeyDown={this.onEditComKeyDown}
                onBlur={this.onEditComBlur}
            />
        );
    }

}
