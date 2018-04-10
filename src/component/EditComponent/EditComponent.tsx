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

    // // Edit获取焦点
    // onEditComFocus = (com: IComponent) => {
    //     (this.editor as HTMLElement).focus();
    //     this.setCurrentCom(com);
    //     // tslint:disable-next-line:no-console
    //     console.log(com);
    // }

    // onEditComKeyDown = () => {
    //     const currentCom: IComponent | null = this.state.currentCom;
    //     if (currentCom !== null) {
    //         const comSize: ISize = currentCom.getSize();
    //         const comPosition: IPosition = currentCom.getPosition();
    //         const pos = this.props.componentPosition;

    //         const maxWidth = comSize.width;
    //         const top = comPosition.top + comSize.height / 2 + pos.canvasOffset.top;
    //         const left = comPosition.left + comSize.width / 2 + pos.canvasOffset.left;

    //         this.setPosition(maxWidth, top, left);
    //     }
    // }

    // // Edit失去焦点
    // onEditComBlur = () => {
    //     (this.editor as HTMLElement).blur();

    //     const value = (this.editor as HTMLElement).innerText;
    //     (this.editor as HTMLElement).innerText = '';

    //     this.hiddenEditCom();
    //     const currentCom: IComponent | null = this.state.currentCom;
    //     if (currentCom !== null) {
    //         currentCom.setRichChildNode(value);
    //     }
    // }

    // showEditCom = (size: ISize, position: IPosition) => {
    //     // tslint:disable-next-line:no-console
    //     console.log('showEditCom');
    //     // tslint:disable-next-line:no-console
    //     console.log(size);
    //     // tslint:disable-next-line:no-console
    //     console.log(position);
    // }

    hiddenEditCom = () => {
        this.setState({
            maxWidth: 1,
            top: -10000,
            left: -10000
        });
    }

    // sendContent = () => {
    //     // tslint:disable-next-line:no-console
    //     console.log('sendContent');
    // }

    // setCurrentCom = (com: IComponent): void => {
    //     this.setState({
    //         currentCom: com
    //     });
    // }

    onKeyDown = (e: any) => {
        if (this.props.handleKeyDownCommand && this.props.handleKeyDownCommand(e) === true) {
            return;
        }
    }

    onKeyUp = (e: any) => {
        if (this.props.handleKeyUpCommand && this.props.handleKeyUpCommand(e) === true) {
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

    componentDidMount() {
        this.setFocus();
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
            />
        );
    }

}
