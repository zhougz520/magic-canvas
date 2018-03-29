import * as React from 'react';
import { Demo } from '../../../src/component/BaseComponent/demo/Demo';
import { CanvasDemo } from './CanvasDemo';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Example extends CanvasDemo<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedComponent: []
        };
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
            demoComponent.setSize({width: 100, height: 50});
        } else {
            console.log('nima');
        }
    }

    setSize2 = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.setSize({width: 200, height: 100});
        } else {
            console.log('nima');
        }
    }

    setSize3 = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.setSize({width: 300, height: 150});
        } else {
            console.log('nima');
        }
    }

    setUndoStack = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.setUndoStack();
        } else {
            console.log('nima');
        }
    }

    getPosition = () => {
        const demoComponent = this.getRef('DemoComponent');

        let myLableText: any = '';
        if (null !== demoComponent) {
            myLableText = JSON.stringify(demoComponent.getPosition());
        } else {
            myLableText = 'nima';
        }

        (document.getElementById('myLable') as HTMLElement).innerText = myLableText;
    }

    setPosition = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.setPosition({left: 700, right: 22, top: 100, bottom: 44});
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

    setUndo = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.undo();
        } else {
            console.log('nima');
        }
    }

    setRedo = () => {
        const demoComponent = this.getRef('DemoComponent');

        if (null !== demoComponent) {
            demoComponent.redo();
        } else {
            console.log('nima');
        }
    }

    selectionChanging = (metaKey: string): boolean => {
        console.log(`canvas 接受组件${metaKey} 选中事件`);

        return !metaKey;
    }

    render() {
        return (
            <React.Fragment>
                <Demo
                    ref="DemoComponent"
                    demoProp="DemoComponent"
                    data={{ w: 500, h: 100, l: 500, r: 10, t: 10, b: 10, text: '我是测试组件1' }}
                    selectionChanging={this.selectionChanging}
                />
                <ol>
                    Size:
                    <li>
                        <button onClick={this.getSize}>获取size</button>
                    </li>
                    <li>
                        <button onClick={this.setSize}>设置size</button>
                        <button onClick={this.setSize2}>设置size2</button>
                        <button onClick={this.setSize3}>设置size3</button>
                    </li>
                    <li>
                        <button onClick={this.setUndoStack}>设置堆栈</button>
                    </li>
                </ol>
                <ol>
                    Position:
                    <li>
                        <button onClick={this.getPosition}>获取Position</button>
                    </li>
                    <li>
                        <button onClick={this.setPosition}>设置Position</button>
                    </li>
                </ol>
                <ol>
                    <li>
                        <button onClick={this.setText}>设置文本</button>
                    </li>
                </ol>
                <ol>
                    撤销、重做（看最上面按钮console.log()出来的baseState的值）
                    <li>
                        <button onClick={this.setUndo}>撤销</button>
                    </li>
                    <li>
                        <button onClick={this.setRedo}>重做</button>
                    </li>
                </ol>
                获取到的值：
                <div style={{backgroundColor: 'yellow', height: 24, width: '100%'}} id="myLable" />
            </React.Fragment>
        );
    }
}
