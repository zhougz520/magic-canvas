import * as React from 'react';
// import styled from 'styled-components';

import { EditStyle } from './EditStyle';

// const EditDiv = styled.div`
//     border-color: black;
//     border-style: solid;
//     display: inline-block;
//     position: absolute;
//     overflow: visible;
//     word-wrap: normal;
//     border-width: 1;
//     min-width: 1px;
//     min-height: 1em;
//     resize: none;
//     padding: 0px;
//     margin: 0px;

//     /* outline: none; */
//     line-height: 1.2;
//     text-align: center;

//     transform-origin: 0px 0px 0px;
//     transform: scale(1, 1) translate(-50%, -50%);

//     z-index: 1000;
// `;

export class EditComponent extends React.PureComponent<any, any> {
    public editor: HTMLElement | null = null;

    componentDidMount() {
        (this.editor as HTMLElement).focus();

        (this.editor as HTMLElement).addEventListener('keydown', (e) => {
            // tslint:disable-next-line:no-console
            console.log(e);
        });
    }

    render() {
        const { position, size } = this.props;

        return (
            <div
                id="editComponent"
                contentEditable
                suppressContentEditableWarning
                style={EditStyle(position, size)}
                ref={(ref: HTMLElement | null) => (this.editor = ref)}
            />
        );
    }

}
