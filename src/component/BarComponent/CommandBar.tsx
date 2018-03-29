import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Command<P = {}, S = {}> extends React.PureComponent<P, S> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const CommandBar = styled.div`
            position: absolute;
            top: 46px;
            left: 0;
            right: 0;
            height: 32px;
            border-top: 1px solid #fafafa;
            border-bottom: 1px solid #cbcbcb;
            background-color: #fff;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            transition-property: top;
            transition-duration: .3s;
            transition-timing-function: cubic-bezier(.65,.05,.36,1);
        `;

        return (
            <React.Fragment>
                <CommandBar className="command-bar page"> command - bar page</CommandBar>
            </React.Fragment>
        );
    }
}
