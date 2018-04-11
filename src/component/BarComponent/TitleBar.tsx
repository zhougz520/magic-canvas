import * as React from 'react';
import './bar.css';

export interface ITitleProps {
    collapsed: boolean;
}

export interface ITitleState {
    [key: string]: string;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Title extends React.PureComponent<ITitleProps, ITitleState> {
    constructor(props: ITitleProps) {
        super(props);
    }

    render() {
        const { collapsed } = this.props;

        const title = (
            collapsed ? '' : <div>title-bar page</div>
        );

        return (
            <React.Fragment>
                <div className={`title-bar ${collapsed ? 'collapsed' : ''}`}>{title}</div>
            </React.Fragment >
        );
    }
}