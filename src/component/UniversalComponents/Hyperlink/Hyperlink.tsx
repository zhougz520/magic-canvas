import * as React from 'react';
import { BaseComponent, IBaseState, IBaseProps, ContentState, SizeState, PositionState, BaseState } from '../../..';
import { HyperlinkState, IHyperlinkState } from './HyperlinkState';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Hyperlink extends BaseComponent<IDemoProps, IBaseState> {
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
            customState: new HyperlinkState()

        });

        this.state = {
            baseState: BaseState.createWithContent(contentState)
        } as Readonly<IBaseState>;
    }

    // render(){
    //     return (
    //         <Ant
    //     )
    // }
}
