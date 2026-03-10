import { NRC_FORMAT_ID, NrcModelType } from './constants.js';
import { nrcLog, nrcWarn } from './logger.js';
import { buildEmoteRig } from './templates/emote.js';

function loadTemplate(modelType, name) {
	nrcLog('loadTemplate called with type:', modelType, 'name:', name);
	if (modelType === 'EMOTE') {
		if (name) Project.name = name;
		Project.box_uv = true;
		buildEmoteRig();
		nrcLog('Emote rig built. Cubes:', Cube.all.length, 'Groups:', Group.all.length);
	} else {
		nrcWarn('Unknown model type:', modelType);
	}
}

export function createNrcFormat() {
	var format = new ModelFormat(NRC_FORMAT_ID, {
		id: NRC_FORMAT_ID,
		icon: 'emoji_people',
		name: 'NRC Studio Model',
		description: 'Animated model for NoRiskClient (emotes, cosmetics, etc.)',
		category: 'minecraft',
		box_uv: true,
		optional_box_uv: true,
		single_texture: true,
		animated_textures: false,
		bone_rig: true,
		centered_grid: true,
		rotate_cubes: true,
		locators: true,
		uv_rotation: true,
		select_texture_for_particles: false,
		texture_mcmeta: false,
		animation_files: true,
		display_mode: false,
		animation_mode: true,
		codec: Codecs.project
	});

	format.new = function () {
		var dialog = new Dialog({
			id: 'nrc_studio_new_project',
			title: 'New NRC Studio Model',
			form: {
				model_type: {
					type: 'select',
					label: 'Model Type',
					default: 'EMOTE',
					options: NrcModelType
				},
				name: {
					type: 'text',
					label: 'Model Name',
					value: 'new_nrc_emote'
				}
			},
			onConfirm: function (formResult) {
				nrcLog('Dialog confirmed:', JSON.stringify(formResult));
				dialog.hide();
				if (newProject(format)) {
					nrcLog('Project created, loading template...');
					loadTemplate(formResult.model_type, formResult.name);
					Project.nrc_model_type = formResult.model_type;
				} else {
					nrcWarn('newProject() returned false');
				}
			}
		});
		dialog.show();
	};

	return format;
}
