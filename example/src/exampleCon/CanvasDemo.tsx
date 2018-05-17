import * as React from 'react';
import { IComponent } from '../../../src';

export class CanvasDemo<P = {}, S = {}> extends React.PureComponent<P, S> {
    getRef = (key: string): IComponent | null => {
        const ref = this.refs[key] as any;

        return (ref as IComponent) || null;
    }
}
