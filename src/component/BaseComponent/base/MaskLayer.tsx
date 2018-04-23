import * as React from 'react';
import '../sass/Component.scss';

export class MaskLayer extends React.PureComponent {
    public com: HTMLElement | null = null;

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                className="mask-layer"
            />
        );
    }
}
