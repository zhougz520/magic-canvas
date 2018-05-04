import { OperationType, IComponentList, IStack } from '../ICanvasState';
import { Map, OrderedSet, List, Stack } from 'immutable';

export const StackUtil = {
    getCanvasStack(t: any, oldUndoStack: Stack<IStack>, operationType: OperationType, comsData: Map<string, any> | OrderedSet<any>): Stack<IStack> {
        let newUndoStack: Stack<IStack>;
        let componentList: List<IComponentList> = List();
        let stackData: IStack;

        switch (operationType) {
            case 'create':
                (comsData as OrderedSet<any>).map(
                    (comData) => {
                        const component: IComponentList = {
                            cid: comData.p.id,
                            comData
                        };

                        componentList = componentList.push(component);
                    }
                );
                stackData = {
                    operationType,
                    componentList
                };
                newUndoStack = oldUndoStack.push(stackData);
                break;
            case 'modify':
                newUndoStack = oldUndoStack;
                break;
            case 'remove':
                (comsData as OrderedSet<any>).map(
                    (comData) => {
                        comData.p.baseState = t.getComponent(comData.p.id).getBaseState();
                        const component: IComponentList = {
                            cid: comData.p.id,
                            comData
                        };

                        componentList = componentList.push(component);
                    }
                );
                stackData = {
                    operationType,
                    componentList
                };
                newUndoStack = oldUndoStack.push(stackData);
                break;
            default:
                newUndoStack = oldUndoStack;
                break;
        }

        return newUndoStack;
    }
};
