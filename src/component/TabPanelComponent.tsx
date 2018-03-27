import * as React from 'react';
import { IComponent } from './BaseComponent/IComponent';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class TabPanel<P = {}, S = {}> extends React.PureComponent<P, S> {
    /**
     * 由于使用的时PureComponent,所有不变的数据直接放在state中,变化的数据放过在StageStae中
     * @param props any
     */
    constructor(props: any) {
        super(props);
    }

    getRef = (key: string): IComponent | null => {
        const ref = this.refs[key] as any;

        return (ref as IComponent) || null;
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
            demoComponent.setSize({ width: 22, height: 33 });
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
            demoComponent.setPosition({ left: 11, right: 22, top: 33, bottom: 44 });
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

    render() {

        return (
            <div style={{ position: 'absolute', top: '20px', width: '800px', left: '1200px' }}>
                <ol>
                    当前选中的组件:
                </ol>
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
                <div style={{ backgroundColor: 'yellow', height: 24, width: '100%' }} id="myLable" />
            </div>
        );
    }
}
