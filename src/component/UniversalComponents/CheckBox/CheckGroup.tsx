import * as React from 'react';
import { BaseComponent, IBaseState, IBaseProps, ContentState, SizeState, PositionState, BaseState } from '../../..';
import { Checkbox as AntCheckbox} from 'antd';

import { BaseStyle } from '../../MapComponent';
import { CheckGroupState } from './CheckGroupState';
import { CheckboxChangeEvent } from 'antd/lib/Checkbox';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class CheckGoup extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        const contentState: ContentState = ContentState.create({
            cid: props.data.id,
            zIndex: props.zIndex,
            sizeState: SizeState.create({
                width: props.data.w,
                height: props.data.h
            }),
            positionState: PositionState.create({
                left: props.data.l,
                right: props.data.r,
                top: props.data.t,
                bottom: props.data.b
            }),
            richChildNode: props.data.txt_v,
            customState: new CheckGroupState()

        });

        this.state = {
            baseState: BaseState.createWithContent(contentState)
        } as Readonly<IBaseState>;
    }

    render() {
        const CheckboxList: string[] = this.getCustomState().getOptions();
        // tslint:disable-next-line:no-shadowed-variable
        const CheckboxElem = (CheckboxsList: string[]): any => {
            const res = [];
            for (let i = 0; i < CheckboxList.length; i++) {
                res.push(
                    <AntCheckbox
                        value={i}
                        key={CheckboxList[i]}
                    >
                        {CheckboxsList[i]}
                    </AntCheckbox>);
            }

            return res;
        };

        return (

            <div
                onMouseDown={this.onMouseDown}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
            >
                <AntCheckbox.Group
                    defaultValue={this.getCustomState().getDefaultValue()}
                    value={this.getCustomState().getValue()}
                    options={this.getCustomState().getOptions()}
                    onChange={this.onCheckGroupChange}
                >
                    {CheckboxElem(CheckboxList)}
                </AntCheckbox.Group>
            </div>
        );
    }

    private onCheckGroupChange = (checkedValue: any[]) => {

        const newCheckGroupState: CheckGroupState = CheckGroupState.set(
            this.getCustomState(),
            {
                value: checkedValue
            }
        );
        this.setCustomState(newCheckGroupState);
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseDown = (e: any) => {
        this.fireSelectChange(e, this.getCid());
    }
}
