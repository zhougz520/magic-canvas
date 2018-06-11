import {
    BaseState,
    ContentState,
    SizeState,
    PositionState,
    IComData
} from '../../BaseComponent';
import { convertFromDataToCustomState } from './convertFromDataToCustomState';
import { convertFromDataToRich } from './convertFromDataToRich';
import { List } from 'immutable';

/**
 * 把Canvas中的data转译成baseState
 * @param data Canvas中的data
 * @param comPath 组件路径
 */
export const convertFromDataToBaseState = (data: IComData, comPath: string): BaseState => {
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
        richChildNode: convertFromDataToRich(data.txt_v, comPath),
        customState: convertFromDataToCustomState(data.customState, comPath),
        commentsList: List(data.commentsList)
    });

    return BaseState.createWithContent(contentState);
};
