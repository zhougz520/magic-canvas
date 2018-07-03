import { IComponent } from '../BaseComponent';
import { IPropertyGroup, IToolButtonGroup } from '../UniversalComponents';
import { ComponentsType } from '../Stage';
import { Map, OrderedSet } from 'immutable';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    /**
     * 加载画布数据
     */
    initCanvas: (components: ComponentsType, canvasSize: { width: number; height: number; }) => void;

    /**
     * 获取组件对象
     */
    getComponent: (cid: string) => IComponent | null;

    /**
     * 获取保存数据
     */
    getSaveData: () => { width: number; height: number, detail: any };

    /**
     * 设置画布是否变脏
     */
    setIsDirty: (isDirty: boolean) => void;

    /**
     * 执行命令
     */
    executeCommand: (cmd: any) => void;

    /**
     * 获取选中组件的属性集合
     */
    getSelectedProperties: (selectedComs: Map<string, IComponent>) => OrderedSet<IPropertyGroup>;

    /**
     * 获取选中组件的工具栏集合
     */
    getSelectedToolButtons: (selectedComs: Map<string, IComponent>) => IToolButtonGroup;
}
