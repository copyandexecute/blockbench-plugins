import { NRC_FORMAT_ID } from '../constants.js';

export function isNrcModel() {
	return Format && Format.id === NRC_FORMAT_ID;
}

export function createExportModelAction() {
	return new Action('nrc_export_model', {
		name: 'Export NRC Model',
		icon: 'icon-objects',
		description: 'Export bedrock .geo.json model for NRC',
		category: 'file',
		condition: function () { return isNrcModel(); },
		click: function () {
			Codecs.bedrock.export();
		}
	});
}
