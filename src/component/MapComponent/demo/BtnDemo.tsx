import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import BtnChildDemo from './BtnChildDemo';
import DragOnDrop from 'drag-on-drop';
import { GlobalUtil } from '../../util/GlobalUtil';

export interface IMapProps extends IBaseProps  {
    updateProps: (cid: string, updateProp: any) => void;
    value?: string;
}

export default class BtnDemo extends MapComponent<IMapProps, any> {
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
            this.com.addEventListener('mouseover', this.handleOver);
            this.com.addEventListener('mouseleave', this.handleLeave);
            this.com.addEventListener('mousemove', this.handleLeave);
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
        if (GlobalUtil.isEmptyString(localStorage.__dnd_type) || GlobalUtil.isEmptyString(localStorage.__dnd_value)) return;
        if (localStorage.__dnd_type !== 'dragging_cs') return;
        const data = JSON.parse(localStorage.__dnd_value);
        this.addChildComponent(this.state.data, data);
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
}
