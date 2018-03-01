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

    getSize = () => {
        const demoComponent = this.getRef('DemoComponent');

        let myLableText: any = '';
        if (null !== demoComponent) {
            myLableText = JSON.stringify(demoComponent.getSize());
        } else {
            myLableText = 'nima';
        }

        (document.getElementById('myLable') as HTMLElement).innerText = myLableText;
    }

    setSize = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.setSize({width: 22, height: 33});
        } else {
            console.log('nima');
        }
    }

    getPostion = () => {
        const demoComponent = this.getRef('DemoComponent');

        let myLableText: any = '';
        if (null !== demoComponent) {
            myLableText = JSON.stringify(demoComponent.getPostion());
        } else {
            myLableText = 'nima';
        }

        (document.getElementById('myLable') as HTMLElement).innerText = myLableText;
    }

    setPostion = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.setPostion({left: 11, right: 22, top: 33, bottom: 44});
        } else {
            console.log('nima');
        }
    }

    getIsSelected = () => {
        const demoComponent = this.getRef('DemoComponent');

        let myLableText: any = '';
        if (null !== demoComponent) {
            myLableText = JSON.stringify(demoComponent.getIsSelected());
        } else {
            myLableText = 'nima';
        }

        (document.getElementById('myLable') as HTMLElement).innerText = myLableText;
    }

    setIsSelected = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            const isSelected = demoComponent.getIsSelected();
            demoComponent.setIsSelected(!isSelected);
        } else {
            console.log('nima');
        }
    }

    setText = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.setRichChildNode('O(∩_∩)O哈哈哈~');
        } else {
            console.log('nima');
        }
    }

    render() {
        return (
            <React.Fragment>
                <Demo
                    ref="DemoComponent"
                    demoProp="DemoComponent"
                    // size
                    w={10}
                    h={10}
                    // postion
                    l={10}
                    r={10}
                    t={10}
                    b={10}
                    // richChildNode
                    data={'我是富文本内容'}
                />
                <ol>
                    Size:
                    <li>
                        <button onClick={this.getSize}>获取size</button>
                    </li>
                    <li>
                        <button onClick={this.setSize}>设置size</button>
                    </li>
                </ol>
                <ol>
                    Postion:
                    <li>
                        <button onClick={this.getPostion}>获取postion</button>
                    </li>
                    <li>
                        <button onClick={this.setPostion}>设置postion</button>
                    </li>
                </ol>
                <ol>
                    是否选中:
                    <li>
                        <button onClick={this.getIsSelected}>获取选中状态</button>
                    </li>
                    <li>
                        <button onClick={this.setIsSelected}>设置选中状态</button>
                    </li>
                </ol>
                <ol>
                    <li>
                        <button onClick={this.setText}>设置文本</button>
                    </li>
                </ol>
                获取到的值：
                <div style={{backgroundColor: 'yellow', height: 24, width: '100%'}} id="myLable" />
            </React.Fragment>
        );
    }
}
