import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Property<P = {}, S = {}> extends React.PureComponent<P, S> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const PropertyBar = styled.div`
            position: absolute;
            top: 80px;
            right: 0;
            width: 250px;
            bottom: 35px;
            border-left: 1px solid #cbcbcb;
            background-color: #fff;
        `;

        return (
            <React.Fragment>
                <PropertyBar className="props-bar">props-bar</PropertyBar>
            </React.Fragment>
        );
    }
}
