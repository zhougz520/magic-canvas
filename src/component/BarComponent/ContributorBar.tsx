import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Contributor<P = {}, S = {}> extends React.PureComponent<P, S> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const ContributorBar = styled.div`
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 35px;
            border-top: 1px solid #cbcbcb;
            background-color: #fff;
            padding-left: 24px;
            padding-right: 24px;
            flex: 1 1;
            display: flex;
            flexWrap: nowrap;
            alignItems: center;
        `;

        return (
            <React.Fragment>
                <ContributorBar className="contributor-bar">contributor-bar</ContributorBar>
            </React.Fragment>
        );
    }
}
