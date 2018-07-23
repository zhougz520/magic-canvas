import * as React from 'react';

import { PageMode } from '../../Stage';
import '../sass/Component.scss';

export interface IMaskLayerProps {
    id: string;
    pageMode?: PageMode;
    isCanSelected?: boolean;
}

export class MaskLayer extends React.PureComponent<IMaskLayerProps, any> {
    constructor(props: IMaskLayerProps, context: any) {
        super(props, context);
    }

    public render() {
        const { id, pageMode, isCanSelected } = this.props;
        const pointerEvents = isCanSelected === false ? 'none' : 'auto';

        let element;
        switch (pageMode) {
            case 'Edit':
            case 'Guest':
                element = (
                    <div
                        className="mask-layer"
                        style={{ pointerEvents }}
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
                        style={{ pointerEvents }}
                        id={id}
                    />
                );
                break;
        }

        return element;
    }
}
