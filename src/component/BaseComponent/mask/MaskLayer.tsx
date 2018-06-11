import * as React from 'react';
import '../sass/Component.scss';

export interface IMaskLayerProps {
    id: string;          // id
}

export class MaskLayer extends React.PureComponent<IMaskLayerProps, any> {
    constructor(props: IMaskLayerProps, context: any) {
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
