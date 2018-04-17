import * as React from 'react';
import { PureComponent } from 'react';
import BtnChildDemo from './BtnChildDemo';
import DragOnDrop from 'drag-on-drop';
// import Button from '../../UniversalComponents/Button/Button';
import util from '../../util';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps {
    fireSelect: (cid: string, e: any) => void;
    value?: string;
    data: any;
}

export interface IDemoState {
    demoState: string;
    backGroundColor: string;
}

export default class Mask extends PureComponent<IDemoProps, any> {
    static defaultProps = {
        value: 'test'
    };

    public com: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            data: props.data,
            hover: false
        };
    }

    componentDidMount() {
        if (this.com != null) {
            this.com.addEventListener('drop', this.handleDrop);
        }

        const dragonDrop = new DragOnDrop(this.com);

        this.setState({ dragonDrop });
    }

    componentDidUpdate() {
        const { dragonDrop } = this.state;
        // this public method allows dragon drop to
        // reassess the updated items and handles
        dragonDrop.initElements();
    }

    public render() {
        const { fireSelect } = this.props;
        const { hover, data } = this.state;
        const children: any = [];
        if (data.p.components.length > 0) {
            const currCom: any = null;
            data.p.components.forEach((com: any) => {
                switch (com.t) {
                    case 'MapComponent/demo/BtnChildDemo':
                        children.push(
                            <BtnChildDemo
                                key={`c.${com.p.id}`}
                                data={com.p}
                                // tslint:disable-next-line:jsx-no-string-ref
                                ref={`c.${com.p.id}`}
                                fireSelect={fireSelect}
                            />);
                        break;
                    // case 'UniversalComponents/Button/Button':
                    //     children.push(
                    //         <Button
                    //             id={`c.${com.p.id}`}
                    //             data={com.p}
                    //             // tslint:disable-next-line:jsx-no-string-ref
                    //             ref={`c.${com.p.id}`}
                    //             fireSelect={fireSelect}
                    //         />);
                    //     break;
                }
                children.push(currCom);
            });
        }

        return (
            <div
                style={{ padding: 30, backgroundColor: hover ? '#007ACC' : 'white' }}
                ref={(handler: HTMLElement | null) => this.com = handler}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            >
            {children}
            </div>
        );
    }

    public handleDrop = (e: any) => {
        if (util.isEmptyString(localStorage.__dnd_type) || util.isEmptyString(localStorage.__dnd_value)) return;
        if (localStorage.__dnd_type !== 'dragging_cs') return;
        const data = JSON.parse(localStorage.__dnd_value);
        this.addChildComponent(data);
        e.stopPropagation();
    }

    public handleOver = (e: any) => {
        this.setState({
            hover: true
        });
        e.preventDefault();
    }

    public handleLeave = (e: any) => {
        this.setState({
            hover: false
        });
        e.preventDefault();
    }

    public addChildComponent = (addData: any) => {
        const { data } = this.state;
        const childId: string = this.newComponentsId(data.p.components, `${data.id}.cs`);
        data.p.components.push({
            t: addData.type,
            p: Object.assign({}, addData.props, { id: childId, txt_v: 'test'})
        });
        this.setState({
            data
        });
    }

    public newComponentsId = (collection: any[], prefix = 'cs', pid = '') => {
        const ids: number[] = [];
        collection.forEach((cs: any) => {
            ids.push(parseInt(cs.p.id.replace(prefix, ''), undefined));
        });
        if (ids.length === 0) {
            return `${pid === '' ? '' : `${pid}.`}${prefix}1`;
        } else {
            ids.sort((a: any, b: any) => a - b);

            return `${pid === '' ? '' : `${pid}.`}${prefix}${ids[ids.length - 1] + 1}`;
        }
    }
}
