import { NRC_FORMAT_ID, NrcModelType } from './constants.js';
import { nrcLog } from './logger.js';
import { createNrcFormat } from './format.js';
import { createExportModelAction, isNrcModel } from './export/model.js';
import { buildNrcAnimationFile } from './export/animation.js';

let format;
let exportModelAction;
let exportAnimAction;
let modelTypeProperty;

BBPlugin.register('nrc_studio', {
	title: 'NRC Studio',
	icon: 'emoji_people',
	author: 'NoRiskClient',
	description: 'Create emotes and cosmetics for NoRiskClient',
	version: '1.0.0',
	variant: 'both',
	tags: ['Minecraft: Java Edition'],

	onload() {
		modelTypeProperty = new Property(ModelProject, 'string', 'nrc_model_type', {
			label: 'NRC Model Type',
			default: NrcModelType.EMOTE,
			condition: { formats: [NRC_FORMAT_ID] }
		});

		format = createNrcFormat();

		exportModelAction = createExportModelAction();

		exportAnimAction = new Action('nrc_export_animation', {
			name: 'Export NRC Animation',
			icon: 'movie',
			description: 'Export .animation.json with native bezier support for NRC',
			category: 'file',
			condition: function () { return isNrcModel(); },
			click: function () {
				var content = JSON.stringify(buildNrcAnimationFile(), null, '\t');
				Blockbench.export({
					resource_id: 'animation',
					type: 'JSON Animation',
					extensions: ['json'],
					name: (Project.name || 'animation') + '.animation',
					content: content
				});
			}
		});

		MenuBar.addAction(exportModelAction, 'file.export');
		MenuBar.addAction(exportAnimAction, 'file.export');

		nrcLog('Plugin loaded');
	},

	onunload() {
		if (exportModelAction) { exportModelAction.delete(); }
		if (exportAnimAction) { exportAnimAction.delete(); }
		if (modelTypeProperty) { modelTypeProperty.delete(); }
		if (format) { format.delete(); }

		nrcLog('Plugin unloaded');
	}
});
