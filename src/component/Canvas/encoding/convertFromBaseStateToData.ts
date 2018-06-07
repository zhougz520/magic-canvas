import {
    BaseState,
    ContentState,
    SizeState,
    PositionState,
    IComData,
    ICommentsList
} from '../../BaseComponent';
import { convertFromCustomStateToData } from './convertFromCustomStateToData';
import { List } from 'immutable';

/**
 * 把组件的baseState转成保存的data
 * @param baseState 组件baseState
 * @param baseProps 组件baseProps
 */
export const convertFromBaseStateToData = (baseState: BaseState, baseProps: {
    comPath: string;
    childData: any;
}): {
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
            txt_v: richChildNode && richChildNode.toJS ? richChildNode.toJS() : richChildNode,
            w: sizeState.getWidth(),
            h: sizeState.getHeight(),
            l: positionState.getLeft(),
            t: positionState.getTop(),
            p: baseProps.childData,
            zIndex: content.getZIndex(),
            customState: convertFromCustomStateToData(customState, baseProps.comPath),
            commentsList: commentsList.toArray(),
            comType: content.getComType()
        }
    };
};
