import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle, IPosition, ISize } from '../BaseComponent';
import { DraftPublic } from '../RichEdit';
const { Editor, EditorState } = DraftPublic;
// import { CommentsLine } from './CommentsLine';
// import { Map } from 'immutable';

import './sass/Comments.scss';

export interface ICommentsState extends IBaseState {
    hidden: boolean;
}

export default class Comments extends BaseComponent<IBaseProps, ICommentsState> {
    private _padding: number = 8;

    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        // TODO 优化代码
        // const propsBaseState = props.baseState;
        // if (propsBaseState !== null && propsBaseState !== undefined) {
        //     this.state = {
        //         baseState: propsBaseState
        //     };
        // } else {
        //     this.state = {
        //         baseState: this.initBaseStateWithCustomState(props.data.lineList)
        //     };
        // }
        this.state = {
            baseState: this.initBaseStateWithCustomState(null, EditorState.createEmpty()),
            hidden: false
        };
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditorSizeAndPosition = (): {
        position: IPosition;
        size: ISize;
    } => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = {
            top: comPosition.top + this._padding,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - 2 * this._padding,
            height: comSize.height - 2 * this._padding
        };

        return { position, size };
    }

    public hiddenEditor = (hidden: boolean): void => {
        this.setState({
            hidden
        });
    }

    render() {
        // const rectList: JSX.Element[] = [];
        const { hidden } = this.state;
        const richChildNode = this.getRichChildNode();

        // TODO Comments优化代码
        // const lineList: Map<string, any> = this.getCustomState();
        // lineList.map(
        //     (value, key) => {
        //         const { x1, y1, x2, y2 } = value;
        //         rectList.push(
        //             <CommentsLine key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
        //         );
        //     }
        // );

        return (
            // <React.Fragment>
            //     <div
            //         className="comments"
            //         onMouseDown={this.fireSelectChange}
            //         style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            //         dangerouslySetInnerHTML={{__html: richChildNode}}
            //     />
            //     <svg
            //         xmlns="http://www.w3.org/2000/svg"
            //         version="1.1"
            //         width="100%"
            //         height="100%"
            //         pointerEvents="none"
            //         style={{position: 'absolute', zIndex: this.getHierarchy()}}
            //     >
            //         {rectList}
            //     </svg>
            // </React.Fragment>
            <div
                className="comments"
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <Editor
                    editorState={richChildNode}
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={() => { return; }}
                    readOnly
                    customContentStyle={{padding: this._padding, display: hidden ? 'none' : 'block'}}
                />
            </div>
        );
    }
}
