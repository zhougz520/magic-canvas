import * as React from 'react';

import { PageMode } from '../../Stage';
import '../sass/Component.scss';

export interface IMaskLayerProps {
    id: string;          // id
    pageMode?: PageMode;
}

export class MaskLayer extends React.PureComponent<IMaskLayerProps, any> {
    constructor(props: IMaskLayerProps, context: any) {
        super(props, context);
    }

    public render() {
        const { id, pageMode } = this.props;

        let element;
        switch (pageMode) {
            case 'Edit':
            case 'Guest':
                element = (
                    <div
                        className="mask-layer"
                        id={id}
                    />
                );
                break;
            case 'Run':
                element = null;
                break;
            default:
                element = (
                    <div
                        className="mask-layer"
                        id={id}
                    />
                );
                break;
        }

        return element;
    }
}
