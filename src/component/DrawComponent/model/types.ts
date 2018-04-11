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

export interface IReactData {
    pointX: number;
    pointY: number;
    width: number;
    height: number;
    anchorFill: string;
    stroke: string;
    strokeWidth: number;
    borderOffset: number;
}

export interface IBaseData {
    cid: string;
    anchorKey: string;
    position: { left: number, top: number, right?: number, bottom?: number };
    size: { width: number, height: number };
}
