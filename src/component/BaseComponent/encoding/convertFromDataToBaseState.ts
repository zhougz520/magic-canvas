import { BaseState } from '../model/BaseState';
import { ContentState, ComponentType } from '../model/ContentState';
import { SizeState } from '../model/SizeState';
import { PositionState } from '../model/PositionState';
import { ICommentsMap } from '../model/types';

import { Map } from 'immutable';

export interface IComData {
    id: string;
    txt_v: string;
    w: number;
    h: number;
    l: number;
    t: number;
    p?: any;
    zIndex: number;
    comType: ComponentType | null;
    customState: any;
    commentsMap: Map<string, ICommentsMap>;
    comPath: string;
}

/**
 * 把Canvas中的data转译成baseState
 * @param data Canvas中的data
 */
export const convertFromDataToBaseState = (data: IComData): BaseState => {
    const contentState: ContentState = ContentState.create({
        cid: data.id,
        comType: data.comType,
        zIndex: data.zIndex,
        sizeState: SizeState.create({
            width: data.w,
            height: data.h
        }),
        positionState: PositionState.create({
            top: data.t,
            left: data.l
        }),
        // TODO 带格式的富文本
        richChildNode: data.txt_v,
        customState: data.customState,
        // TODO 组件对应的批注集合,用ordermap?
        commentsMap: data.commentsMap
    });

    return BaseState.createWithContent(contentState);
};
