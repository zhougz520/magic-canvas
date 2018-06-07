import {
    BaseState,
    ContentState,
    SizeState,
    PositionState,
    IBaseProps,
    IComData,
    ICommentsList
} from '../../BaseComponent';
import { List } from 'immutable';

export const convertFromBaseStateToData = (baseState: BaseState, baseProps: IBaseProps, customData: any): {
    t: string;
    p: IComData
} => {
    const content: ContentState = baseState.getCurrentContent();
    const sizeState: SizeState = content.getSizeState();
    const positionState: PositionState = content.getPositionState();
    const richChildNode: any = content.getRichChildNode();
    const commentsList: List<ICommentsList> = content.getCommentsList();

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
            customState: customData,
            commentsList: commentsList.toArray(),
            comType: content.getComType()
        }
    };
};
