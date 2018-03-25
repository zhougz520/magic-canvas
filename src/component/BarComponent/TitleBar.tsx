import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Title<P = {}, S = {}> extends React.PureComponent<P, S> {
    constructor(props: any) {
        super(props);
    }

    render() {

        const TitleBar = styled.div`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 45px;
            border-bottom: 1px solid #cbcbcb;
            background-color: #fff;
        `;

        return (
            <React.Fragment>
                <TitleBar className="title-bar page">title-bar page</TitleBar>
            </React.Fragment>
        );
    }
}
