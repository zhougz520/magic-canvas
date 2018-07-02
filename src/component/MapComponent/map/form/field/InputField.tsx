import * as React from 'react';
import { MapComponent, IBaseProps } from '../../../index';
import { Input } from 'antd';
import { MaskLayer } from '../../../../BaseComponent/mask/MaskLayer';
import { MapConsumer } from '../../MapConsumer';

// tslint:disable:indent
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IBaseProps {
	map_form_f_title: string;
	map_form_f_default: string;
	map_form_f_state: string;
	map_form_f_cols: number;
	map_form_f_disabled: boolean;
	map_form_f_hidden_t: boolean;
	map_form_f_type: string;
	titleWidth: number;
	unit: number;
	currUnit: number;
	index: number;
}

export class InputFieldClass extends MapComponent<IMapProps, any> {
	static defaultProps = {
		map_form_f_title: '字段',
		map_form_f_default: '',
		map_form_f_state: '0',
		map_form_f_cols: 1,
		map_form_f_disabled: false,
		map_form_f_hidden_t: true,
		titleWidth: 110,
		unit: 1,
		currUnit: 2,
		map_form_f_type: 'MapComponent/map/form/field/InputField'
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
			resizing: false,
			hover: {}
		};
	}
	public getItemStyle = (draggableStyle: any, isDragging: any) => ({
		// change background colour if dragging
		background: isDragging ? 'blue' : '',

		// styles we need to apply on draggables
		...draggableStyle
	})

	public render() {
		const {
			map_form_f_title,
			map_form_f_default,
			id,
			titleWidth,
			map_form_f_disabled,
			unit,
			currUnit,
			selectedId
		} = this.props;
		const { hover } = this.state;
		let borderClass = '';
		if (map_form_f_disabled) {
			borderClass = ' read-only';
		}

		return (
			<div
				ref={(ref) => this.com = ref}
				style={Object.assign({}, { width: `${((unit / currUnit) * 100).toFixed(2)}%` }, hover)}
				className={`field-bar `}
				onMouseDown={this.selectedCom}
				draggable
				onDragOver={this.handleFieldOver}
				// onDragOver={this.onDrageOver}
				onDragLeave={this.handleLeave}
				onDragEnd={this.handleLeave}
			>
				<MaskLayer id={id} />
				<table className={`field-tb ${selectedId === id ? 'map-selected' : ''}`}>
					<tbody>
						<tr>
							<td className={`field-title`} style={{ width: titleWidth }}>
								{map_form_f_title}
							</td>
							<td className="field-content">
								<Input
									type="text"
									className={map_form_f_disabled ? borderClass : ''}
									placeholder=""
									// onChange={this.onChangeText}
									disabled={map_form_f_disabled}
									defaultValue={map_form_f_default}
									value={map_form_f_default}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}
export const InputField = MapConsumer(InputFieldClass);
