import * as React from 'react';

import { PageMode } from '../../Stage';
import '../sass/Component.scss';

export interface IMaskLayerProps {
    id: string;
    pageMode?: PageMode;
    isCanSelected?: boolean;
    onDoubleClick?: (e: any) => void;
}

export class MaskLayer extends React.PureComponent<IMaskLayerProps, any> {
    constructor(props: IMaskLayerProps, context: any) {
        super(props, context);
    }

    public render() {
        const { id, pageMode, isCanSelected, onDoubleClick } = this.props;
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
                        onDoubleClick={onDoubleClick}
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
                        onDoubleClick={onDoubleClick}
                    />
                );
                break;
        }

        return element;
    }
}
