import * as React from 'react';
import { MapContext } from './MapProvider';
// tslint:disable:no-empty-interface
// tslint:disable:jsx-no-string-ref
// tslint:disable:jsx-no-multiline-js
export const MapConsumer = (WrappedComponent: any) => {
    class WrappedComponentHoc extends React.PureComponent<any, any> {

        public com: HTMLElement | null = null;
        render() {

            return (
                <MapContext.Consumer>
                    {
                        (value: any) => {
                            return <WrappedComponent {...this.props} {...value} ref={this.props.forwardedRef} />;
                        }
                    }
                </MapContext.Consumer>);
        }
    }

    const newWrappedComponent = (props: any, ref: any) => {
        return <WrappedComponentHoc {...props} forwardedRef={ref} />;
    };

    return React.forwardRef(newWrappedComponent);
};
