export type Theme = 'black' | 'blue' | 'green' | 'light-blue' | 'light-green' | 'red' | 'orange';

export enum ETheme {
    'black' = '经典黑',
    'blue' = '宝石蓝',
    'green' = '橄榄绿',
    'light-blue' = '天空蓝',
    'light-green' = '荷叶绿',
    'red' = '活力红',
    'orange' = '欢快橙'
}

export interface IComData {
    t: string;
    p: any;
}
