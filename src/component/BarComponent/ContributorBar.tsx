import * as React from 'react';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Contributor<P = {}, S = {}> extends React.PureComponent<P, S> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const styleObj: React.CSSProperties = {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '35px',
            borderTop: '1px solid #cbcbcb',
            backgroundColor: '#fff',
            paddingLeft: '24px',
            paddingRight: '24px',
            flex: '1 1',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center'
        };

        return (
            <React.Fragment>
                <div className="contributor-bar" style={styleObj}>contributor-bar</div>
            </React.Fragment>
        );
    }
}
