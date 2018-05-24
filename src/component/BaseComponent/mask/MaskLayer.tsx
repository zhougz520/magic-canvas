import * as React from 'react';
import '../sass/Component.scss';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps {
    id: string;          // id
}
export class MaskLayer extends React.PureComponent<IDemoProps, any> {

    static defaultProps = {
        w: '100%',
        h: '100%'
    };
    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        const { id } = this.props;

        return (
            <div
                className="mask-layer"
                id={id}
            />
        );
    }
}
