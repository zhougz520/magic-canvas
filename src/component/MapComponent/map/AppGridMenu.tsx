import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { AppGridMenuItem } from './index';
import DragOnDrop from 'drag-on-drop';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_gm_txt?: string;
}

export class AppGridMenu extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_gm_txt: '标题',
        selectedId: undefined
    };

    public com: HTMLElement | null = null;
    public menus: HTMLElement | null = null;

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            ...props,
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

        const dragonDrop = new DragOnDrop(this.menus);

        this.setState({ dragonDrop });
    }

    componentDidUpdate() {
        const { dragonDrop } = this.state;
        // this public method allows dragon drop to
        // reassess the updated items and handles
        dragonDrop.initElements();
    }

    public render() {
        const { hover } = this.state;
        const { updateProps, map_gm_txt, map_sm, p, id, selectedId } = this.props;
        const components = p === undefined ? undefined : p.components;
        const menus: any = components === undefined ? '' :
            (
                components.map((com: any) => {
                    const { t } = com;
                    if (t === 'MapComponent/map/AppGridMenuItem') {
                        return (
                            <AppGridMenuItem
                                key={com.p.id}
                                {...com.p}
                                updateProps={updateProps}
                            />);
                    }
                })
            );

        return (
            <div
                onClick={this.selectedCom}
                ref={(ref) => this.com = ref}
                className={`csr-pc-map-grid-menu ${map_sm || ''} ${selectedId === id ? 'selectecd' : ''}`}
                style={Object.assign({}, { width: '100%', backgroundColor: hover ? '#007ACC' : '#4984c2' })}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            >
                <div className="app-grid-menu-title" >
                    <b>{map_gm_txt}</b>
                </div>
                <div ref={(ref) => this.menus = ref} style={{ float: 'right' }}>
                    {menus}
                </div>
            </div>
        );
    }

    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/AppGridMenuItem');
    }

    public handleDrop = (e: any) => {
        const data: any = this.getAddComponent();
        // 校验是否能被添加
        if (!this.componentCanBeAdded(data.type)) {
            e.stopPropagation();

            return;
        }
        this.addChildComponent(this.state, data);
        e.stopPropagation();
    }

    public handleOver = (e: any) => {
        const data: any = this.getAddComponent();
        if (data === undefined) return;
        // 校验是否能被添加
        if (!this.componentCanBeAdded(data.type)) return;
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
