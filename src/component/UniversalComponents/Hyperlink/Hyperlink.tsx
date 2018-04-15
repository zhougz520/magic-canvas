import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState } from '../../BaseComponent';
import { HyperlinkState } from './HyperlinkState';
import { BoxType } from '../../util/AnchorPoint';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Hyperlink extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new HyperlinkState())
        } as Readonly<IBaseState>;
    }

    /**
     * 重写basecomponent方法, 设置此组件的类型
     */
    public getType(): string {
        return BoxType.BarType;
    }

    render() {
        return (
            <div
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                ref={(handler) => this.com = handler}
            >
                <a
                    href={this.getCustomState().getHerf()}
                >
                    {this.getCustomState().getContent()}
                </a>
            </div>
        );
    }

}
