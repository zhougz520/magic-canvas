import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState } from '../../BaseComponent';
import { SelectorState } from './SelectorState';
import { Select as AntSelector } from 'antd';
import { BoxType } from '../../util/AnchorPoint';

const Option = AntSelector.Option;
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Selector extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new SelectorState())
        };
    }

    /**
     * 重写basecomponent方法, 设置此组件的类型
     */
    public getType(): string {
        return BoxType.BarType;
    }

    render() {
        const optionsList: string[] = this.getCustomState().getData();
        // tslint:disable-next-line:no-shadowed-variable
        const optionElem = (optionsList: string[]) => {
            const res = [];
            for (let i = 0; i < optionsList.length; i++) {
                res.push(<Option key={i} value={i}>{optionsList[i]}</Option>);
            }

            return res;
        };

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                onClick={this.onClick}
            >
                <AntSelector
                    disabled={this.getCustomState().getDisable()}
                    placeholder={this.getCustomState().getPlaceholder()}
                    style={{ width: this.getSizeState().getWidth(), height: this.getSizeState().getHeight() }}
                // onChange={this.handleChange}
                >
                    {optionElem(optionsList)}
                </AntSelector>

            </div>
        );
    }

    private onClick = () => {
        const newSelectorState: SelectorState = SelectorState.set(
            this.getCustomState(),
            {
                placeholder: 'this is a new placeholder'
            }
        );

        this.setCustomState(newSelectorState);
    }
}
