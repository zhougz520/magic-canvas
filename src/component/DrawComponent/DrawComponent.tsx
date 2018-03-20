import * as React from 'react';
import { IDrawProps } from './IDrawProps';
import { IDrawState } from './IDrawState';

export default class DrawComponent<P extends IDrawProps, S extends IDrawState> extends React.PureComponent<P, S> {

}
