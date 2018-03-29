import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Resource<P = {}, S = {}> extends React.PureComponent<P, S> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const ResourceBar = styled.div`
            position: absolute;
            top: 80px;
            left: 0;
            width: 184px;
            bottom: 35px;
            border-right: 1px solid #cbcbcb;
            background-color: #fff;
        `;

        return (
            <React.Fragment>
                <ResourceBar className="resource-bar">resource-bar</ResourceBar>
            </React.Fragment>
        );
    }
}
