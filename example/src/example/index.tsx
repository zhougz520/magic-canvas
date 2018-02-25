import * as React from 'react';
import { Demo } from '../../../src/component/BaseComponent/Demo';
import { CanvasDemo } from './CanvasDemo';
// import styled from 'styled-components';

export default class Example extends CanvasDemo<any, any> {
    constructor(props: any) {
        super(props);
    }

    selectionChangin = (newState: boolean, keyStatus: any): boolean => {
        alert(newState);

        return true;
    }

    test = () => {
        const caicai = this.getRef('caicai');

        if (null !== caicai) {
            console.log(caicai!.getSize());
            console.log(caicai!.getPostion());
        } else {
            console.warn('nimei');
        }
    }

    render() {
        return (
            <React.Fragment>
                <Demo
                    // tslint:disable-next-line:jsx-no-string-ref
                    ref="caicai"
                    demoProp="cainima"
                    selectionChanging={this.selectionChangin}
                />
                <button onClick={this.test}>調用啊</button>
            </React.Fragment>
        );
    }
}
