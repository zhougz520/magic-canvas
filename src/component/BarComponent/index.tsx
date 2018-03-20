import * as React from 'react';
import { TitleBar, CommandBar, ResourceBar, PropsBar, ContributorBar } from './style';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class BarList<P = {}, S = {}> extends React.PureComponent<P, S> {
    /**
     * 由于使用的时PureComponent,所有不变的数据直接放在state中,变化的数据放过在StageStae中
     * @param props any
     */
    constructor(props: any) {
        super(props);
    }

    render() {

        return (
            <React.Fragment>
                <div className="title-bar page" style={TitleBar}>title-bar page</div>
                <div className="command-bar page" style={CommandBar} > command - bar page</div>
                <div className="resource-bar" style={ResourceBar}>resource-bar</div>
                <div className="props-bar" style={PropsBar}>props-bar</div>
                <div className="contributor-bar" style={ContributorBar}>contributor-bar</div>
            </React.Fragment>
        );
    }
}
