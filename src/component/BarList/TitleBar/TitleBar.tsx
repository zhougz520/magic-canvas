import * as React from 'react';
import '../sass/bar.scss';

export interface ITitleProps {
    collapsed: boolean;
}

export interface ITitleState {
    [key: string]: string;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export class TitleBar extends React.PureComponent<ITitleProps, ITitleState> {
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
