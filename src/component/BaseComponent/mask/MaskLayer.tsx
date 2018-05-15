import * as React from 'react';
import '../sass/Component.scss';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps {
    w?: any;              // 宽
    h?: any;              // 高
    l?: any;              // left
    t?: any;              // top
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
        const { w, h, l, t } = this.props;

        return (
            <div
                className="mask-layer"
                style={{ width: w, height: h, left: l, top: t }}
                ref={(handler: HTMLElement | null) => this.com = handler}
            />
        );
    }
}
