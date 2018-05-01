import { IBoundary, IOffset } from '../model/types';
import { IComponent } from '../../BaseComponent';
import { Map } from 'immutable';

export const ComponentsUtil = {
    /**
     * 得到选中组件的坐标范围 {startPoint: {x: 0, y: 0}, endPoint: {x: 10, y: 10}}
     * @param coms 组件对象
     */
    getComponentsRange(coms: Map<string, any>): IBoundary {
        const startPoint: IOffset = {x: 1000000, y: 1000000};
        const endPoint: IOffset = {x: 0, y: 0};

        coms.map(
            (com: IComponent) => {
                const position = com.getPosition();
                const size = com.getSize();

                startPoint.x = Math.min(startPoint.x, position.left);
                startPoint.y = Math.min(startPoint.y, position.top);

                endPoint.x = Math.max(endPoint.x, position.left + size.width);
                endPoint.y = Math.max(endPoint.y, position.top + size.height);
            }
        );

        return {
            startPoint,
            endPoint
        };
    },

    /**
     * 更新ContentState中的CommentsMap
     * @param coms 选中组件
     * @param componentIndex Comments的componentIndex
     */
    updateCommentsMap(coms: Map<string, any>, componentIndex: number) {
        // 更新所选组件的commentsMap
        coms.map(
            (com: IComponent) => {
                const oldCommentsMap = com.getCommentsMap();
                const newCommentsMap = oldCommentsMap.merge(
                    Map().set('cs' + componentIndex, Map())
                );
                com.setCommentsMap(newCommentsMap);
            }
        );
    }
};
