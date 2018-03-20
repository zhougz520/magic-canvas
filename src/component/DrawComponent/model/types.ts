import { List } from 'immutable';

export interface IDrawCommand {
    [key: string]: any;
}

/**
 * svg画的边框线
 */
export interface ILine {
    pointX1: number;
    pointY1: number;
    pointX2: number;
    pointY2: number;
}

/**
 * svg画的点
 */
export interface IPoint {
    circleX: number;
    circleY: number;
}

export interface IFrame {
    cid: string;
    border: List<ILine>;
    anchor: List<IPoint>;
}
