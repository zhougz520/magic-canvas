import * as React from 'react';
import '../sass/Component.scss';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps {
    w: any;              // 显示 项目控件
    h: any;              // 显示 视图
}
export class MaskLayer extends React.PureComponent<IDemoProps, any> {

    static defaultProps = {
        w: '100%',
        h: '100%'
    };
    public com: HTMLElement | null = null;
    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        const { w, h } = this.props;

        return (
            <div
                style={{ width: w, height: h }}
                ref={(handler: HTMLElement | null) => this.com = handler}
                className="mask-layer"
            />
        );
    }
}
