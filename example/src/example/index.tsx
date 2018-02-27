import * as React from 'react';
import { Demo } from '../../../src/component/BaseComponent/demo/Demo';
import { CanvasDemo } from './CanvasDemo';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
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
            console.log(caicai!.getBaseState());
        } else {
            console.warn('nimei');
        }
    }

    render() {
        return (
            <React.Fragment>
                <Demo
                    ref="caicai"
                    demoProp="cainima"
                    w={10}
                    h={20}
                    selectionChanging={this.selectionChangin}
                />
                <button onClick={this.test}>调用</button>
            </React.Fragment>
        );
    }
}
