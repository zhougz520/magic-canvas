import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../../BaseComponent/index';
import { AppFormMenu, AppForm } from './form/index';
import { formDetail } from './StructureDemo';
import { MapProvider } from './MapProvider';

import '../sass/AppForm.scss';
import '../sass/Field.scss';

// tslint:disable-next-line:no-empty-interface
// tslint:disable:jsx-no-string-ref
export interface IDemoProps extends IBaseProps {
    showMenu: boolean;              // 显示 项目控件
    showNavBar: boolean;            // 显示 视图
    showTabItems: boolean;          // 显示 查询控件
    map_sm: string;                 // 版本(皮肤？)
}

export interface IDemoState extends IBaseState {
    selectedId?: string;  // 先...只能单选，后面看情况在调整
    title?: string;
    refs?: any;
}
// tslint:disable:jsx-no-string-ref
export default class AppFormContainer extends BaseComponent<IDemoProps, IDemoState> {
    static defaultProps = {
        showMenu: true,                 // 显示 项目控件
        showNavBar: true,               // 显示 左侧标签页
        showTabItems: true              // 显示 横向标签页
    };

    public com: HTMLElement | null = null;
    private menu: any = '';
    private form: any = '';
    private _isCanMove: boolean = false;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);
        this.state = {
            baseState: this.initBaseStateWithCustomState(props.childData),
            refs: this.refs
        };
    }
    componentDidMount() {
        const cid = this.getCid();
        let initData: any = this.props.childData;
        if (initData === undefined) {
            initData = JSON.stringify(formDetail.p).replace(/【cs】/g, cid);
            this.setCustomState(JSON.parse(initData));
        }
    }
    componentDidUpdate() {
        // console.log('refs', this.refs);
        // if (JSON.stringify(this.refs) !== JSON.stringify(this.state.refs)) {
        this.setState({
            refs: this.refs
        });
        // }
    }
    public isCanMove = () => {
        return this._isCanMove;
    }

    public setIsCanMove = (isCanMove: boolean): void => {
        this._isCanMove = isCanMove;
    }
    /**
     * map控件选中
     * @param id 组件id
     */
    public selectComChange = (e: any, id: string | undefined) => {
        if (id !== undefined) {
            this.setIsCanMove(false);
        } else {
            this.setIsCanMove(true);
        }
        this.setState({
            selectedId: id
        });
    }
    /**
     * map控件选中
     * @param id 组件id
     */
    public ontitleMouseDown = (e: any): void => {
        // this.setIsCanMove(true);
        this.selectComChange(e, undefined);
        this.fireSelectChange(e);
    }
    public render() {
        const { showMenu, pageMode, map_sm } = this.props;
        const { title } = this.state;
        const childData = this.getCustomState() !== null && this.getCustomState() !== undefined ? this.getCustomState().toJS() : undefined;
        if (childData !== undefined && childData.components.length > 0) {
            this.initCom(childData.components);
        }

        // 汇总style
        const currStyle = Object.assign(
            BaseStyle(
                this.getPositionState(),
                this.getSizeState(),
                this.getHierarchy()
            ),
            {
                overflow: 'auto'
            }
        );

        return (
            <MapProvider
                map_sm={map_sm}
                updateProps={this.updateProps}
                selectComChange={this.selectComChange}
                selectedId={this.state.selectedId}
                pageMode={pageMode}
                stateData={childData}
                refs={this.refs}
            >
                <div
                    className="ps-map"
                    style={currStyle}
                    ref={(ref) => this.com = ref}
                >
                    <div
                        className="title"
                        onMouseDown={this.ontitleMouseDown}
                    >
                        {title === undefined ? '标题' : title}
                    </div>
                    <div
                        className="form-form"
                    >
                        <div className="form-menu" style={{ display: !showMenu ? 'none' : '' }} >
                            {this.menu}
                        </div>
                        {this.form}
                    </div>
                </div>
            </MapProvider>
        );
    }

    // 初始化加载控件
    public initCom = (components: any[]) => {
        const { selectedId } = this.state;
        const { showNavBar, showTabItems } = this.props;

        components.forEach((com: any) => {
            switch (com.t) {
                case 'MapComponent/map/form/AppFormMenu':
                    this.menu = (
                        <AppFormMenu
                            selectedId={selectedId}
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/form/AppForm':
                    this.form = (
                        <AppForm
                            ref={`c.${com.p.id}`}
                            selectedId={selectedId}
                            updateProps={this.updateProps}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            showNavBar={showNavBar}
                            showTabItems={showTabItems}
                        />
                    );
                    break;
            }
        });
    }

    // 更新控件
    protected updateProps = (id: string, props: any) => {
        // 获取当前数据
        const childData = this.getCustomState().toJS();
        let newData: any;
        if (id === '') {
            // 当没有id的时候，直接更新整体data(新增组件的时候，直接更新整个CustomState)
            newData = props.p;
        } else {
            // 通过id查找到数据节点
            newData = this.updateComProps(childData, id, props);
        }
        // 更新数据到CustomState
        this.setCustomState(newData);
    }

    // 更新控件属性
    private updateComProps = (data: any, id: string, prop: any) => {
        let newData: any = data;
        data.components.forEach((com: any) => {
            if (com.p.id === id) {
                com.p = Object.assign({}, com.p, prop);
                newData = data;

                return newData;
            }
            // 如果存在子控件，则
            if (com.p.p !== undefined && com.p.p.components !== undefined) {
                this.updateComProps(com.p.p, id, prop);
            }
        });

        return newData;
    }
}
