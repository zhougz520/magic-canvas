import * as React from 'react';
import { MapComponent, IBaseProps } from '../../../index';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Checkbox } from 'antd';

// tslint:disable:indent
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IBaseProps {
	updateProps: (cid: string, updateProp: any) => void;
	map_form_f_title: string;
	map_form_f_default: string;
	map_form_f_state: string;
	map_form_f_cols: number;
	map_form_f_disabled: boolean;
	map_form_f_hidden_t: boolean;
	map_form_f_type: string;
	titleWidth: number;
	index: number;
}

export class SelectField extends MapComponent<IMapProps, any> {
	static defaultOptionProps = {
		map_form_f_title: '字段',
		map_form_f_default: '',
		map_form_f_state: '0',
		map_form_f_cols: 1,
		map_form_f_disabled: false,
		map_form_f_hidden_t: true,
		titleWidth: 110,
		map_form_f_type: 'pc/map/form/field/InputField'
	};

	public resizing = false;
	public mousePosition = {
		x: 0
	};
	public startW = 0;
	public dragWidth: HTMLElement | null = null;

	constructor(props: any, context?: any) {
		super(props, context);

		this.state = {
			currX: 0,
			resizing: false
		};
	}
	public getItemStyle = (draggableStyle: any, isDragging: any) => ({
		// change background colour if dragging
		background: isDragging ? 'blue' : '',

		// styles we need to apply on draggables
		...draggableStyle
	})

	public render() {
		const { map_form_f_title, map_form_f_default, id, index, titleWidth } = this.props;
		// 获取选项
		const arrRadio = map_form_f_default === undefined ? [] : map_form_f_default.replace(/<br>/g, '\r\n').split(/\r?\n/);
		const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
			<div
				onMouseDown={this.selectedCom}
				ref={provided.innerRef}
				{...provided.dragHandleProps}
				style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
			>
				<table className="field-tb">
					<tbody>
						<tr>
							<td className={`field-title`} style={{ width: titleWidth }}>
								{map_form_f_title}
							</td>
							<td className="field-content">
								{
									arrRadio.map((chkBox: string, num: number) => {
										if (chkBox === '') return '';

										return <Checkbox key={num} >{chkBox}</Checkbox>;
									})
								}
							</td>
						</tr>
					</tbody>
				</table>
				{provided.placeholder}
			</div>
		);

		return (
			<div ref={(ref) => this.com = ref} style={Object.assign({}, { width: '100%' })} className="field-bar">
				<Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
					{initDrag}
				</Draggable>
			</div>
		);
	}
}
