import {
    BaseState,
    ContentState,
    SizeState,
    PositionState,
    IComData,
    ICommentsList
} from '../../BaseComponent';
import { IOffset } from '../model/types';
import { convertFromCustomStateToData } from './convertFromCustomStateToData';
import { convertFromRichToData } from './convertFromRichToData';
import { List } from 'immutable';

/**
 * 把组件的baseState转成保存的data
 * @param baseState 组件baseState
 * @param baseProps 组件baseProps
 */
export const convertFromBaseStateToData = (
    baseState: BaseState,
    baseProps: {
        comPath: string;
        childData: any;
    },
    offset: IOffset = { x: 0, y: 0 }
): {
        t: string;
        p: IComData
    } => {
    const content: ContentState = baseState.getCurrentContent();
    const sizeState: SizeState = content.getSizeState();
    const positionState: PositionState = content.getPositionState();
    const richChildNode: any = content.getRichChildNode();
    const commentsList: List<ICommentsList> = content.getCommentsList();
    const customState: any = content.getCustomState();

    return {
        t: baseProps.comPath,
        p: {
            id: content.getCid(),
            txt_v: convertFromRichToData(richChildNode, baseProps.comPath),
            w: sizeState.getWidth(),
            h: sizeState.getHeight(),
            l: positionState.getLeft() - offset.x,
            t: positionState.getTop() - offset.y,
            p: baseProps.childData,
            zIndex: content.getZIndex(),
            customState: convertFromCustomStateToData(customState, baseProps.comPath, offset),
            commentsList: commentsList.toArray(),
            comType: content.getComType()
        }
    };
};
