import * as React from 'react';
import { MapContext } from './MapProvider';
// tslint:disable:no-empty-interface
// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-no-multiline-js
export const MapConsumer = (WrappedComponent: any) => {
    return class extends React.PureComponent<any, any> {

        render() {
            return (
                <MapContext.Consumer>
                    {
                        (value: any) => {
                            return <WrappedComponent {...this.props} {...value} />;
                        }
                    }
                </MapContext.Consumer>);
        }
    };
};
