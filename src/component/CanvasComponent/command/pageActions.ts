import { IBoundary } from '../model/types';
import { ComponentsUtil } from '../utils/ComponentsUtil';
import { IComponent } from '../../BaseComponent';
import { Map } from 'immutable';

export const pageActions = {
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind') {
                ins[key] = (this as any)[key].bind(ins);
            }
        }
    },

    // 获得当前绑定的this
    getThis() {
        return (this as any);
    },

    // 添加批注
    addComments() {
        // 获取stage的宽高，如果没有选中组件则在画布正中央添加批注
        const stageSize = this.getThis().props.getStageSize();
        if (stageSize === undefined) {
            return;
        }

        // 批注组件的数据
        const data = {
            offset: {x: 0, y: 0},
            props: {name: '批注', w: 204, h: 170},
            type: 'Comments/Comments',
            lineList: Map()
        };
        let position: {x: number, y: number};

        const selectedComponents: Map<string, any> = this.getThis().command.getSelectedComponents();
        if (selectedComponents.size > 0) {
            // 如果选中组件，向所有选中组件的最右侧距离100px添加批注,组件范围的中心与批注的中心相对
            const componentsRange: IBoundary = ComponentsUtil.getComponentsRange(selectedComponents);
            position = {
                x: componentsRange.endPoint.x + 100,
                y: Math.ceil((componentsRange.endPoint.y + componentsRange.startPoint.y) / 2 - data.props.h / 2)
            };

            // TODO Comments优化代码
            let lineList: Map<string, any> = Map();
            selectedComponents.map(
                (com: IComponent, key: string) => {
                    const positionCom = com.getPosition();
                    const sizeCom = com.getSize();

                    lineList = lineList.set(
                        key, {x1: positionCom.left + sizeCom.width, y1: positionCom.top, x2: position.x, y2: position.y}
                    );
                }
            );
            data.lineList = lineList;
        } else {
            // 如果没有选中组件，向画布中央添加批注
            position = {
                x: Math.ceil(stageSize.width / 2 - data.props.w / 2),
                y: Math.ceil(stageSize.height / 2 - data.props.h / 2)
            };
        }

        this.getThis().addCancasComponent(data, position, true);
    }

};
