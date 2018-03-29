import * as React from 'react';
import Title from './TitleBar';
import Command from './CommandBar';
import Resource from './ResourceBar';
import Property from './PropertyBar';
import Contributor from './ContributorBar';

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
                <Title />
                <Command />
                <Resource />
                <Property />
                <Contributor />
            </React.Fragment>
        );
    }
}
