import { nrcLog } from '../logger.js';

function addBone(name, origin, color, parent) {
	var group = new Group({
		name: name,
		origin: origin,
		color: color
	});
	group.init();
	if (parent) group.addTo(parent);
	return group;
}

function addPlayerCube(name, from, to, uvOffset, color, parentGroup) {
	var cube = new Cube({
		name: name,
		from: from,
		to: to,
		color: color,
		box_uv: true,
		uv_offset: uvOffset || [0, 0]
	});
	cube.init();
	cube.addTo(parentGroup);
	return cube;
}

export function buildEmoteRig() {
	nrcLog('buildEmoteRig() start');

	var bipedRig = addBone('bipedRig', [0, 0, 0], 0, null);

	var bipedHead = addBone('bipedHead', [0, 24, 0], 1, bipedRig);
	addPlayerCube('head', [-4, 24, -4], [4, 32, 4], [0, 0], 1, bipedHead);
	addBone('armorHead', [0, 24, 0], 2, bipedHead);

	var bipedBody = addBone('bipedBody', [0, 24, 0], 3, bipedRig);
	addPlayerCube('body', [-4, 12, -2], [4, 24, 2], [0, 16], 3, bipedBody);
	addBone('armorBody', [0, 24, 0], 4, bipedBody);

	var bipedRightArm = addBone('bipedRightArm', [5, 22, 0], 5, bipedRig);
	addPlayerCube('rightArm', [4, 12, -2], [8, 24, 2], [16, 32], 5, bipedRightArm);
	addBone('armorRightArm', [4, 22, 0], 6, bipedRightArm);

	var bipedLeftArm = addBone('bipedLeftArm', [-5, 22, 0], 7, bipedRig);
	addPlayerCube('leftArm', [-8, 12, -2], [-4, 24, 2], [32, 0], 7, bipedLeftArm);
	addBone('armorLeftArm', [-4, 22, 0], 8, bipedLeftArm);

	var bipedLeftLeg = addBone('bipedLeftLeg', [-2, 12, 0], 9, bipedRig);
	addPlayerCube('leftLeg', [-4, 0, -2], [0, 12, 2], [0, 32], 9, bipedLeftLeg);
	addBone('armorLeftLeg', [-2, 12, 0], 0, bipedLeftLeg);
	addBone('armorLeftBoot', [-2, 12, 0], 1, bipedLeftLeg);

	var bipedRightLeg = addBone('bipedRightLeg', [2, 12, 0], 2, bipedRig);
	addPlayerCube('rightLeg', [0, 0, -2], [4, 12, 2], [24, 16], 2, bipedRightLeg);
	addBone('armorRightLeg', [2, 12, 0], 3, bipedRightLeg);
	addBone('armorRightBoot', [2, 12, 0], 4, bipedRightLeg);

	Project.texture_width = 64;
	Project.texture_height = 64;
	Project.visible_box[0] = 5;
	Project.visible_box[1] = 3.5;

	Canvas.updateAll();
	nrcLog('buildEmoteRig() done. Cubes:', Cube.all.length, 'Groups:', Group.all.length);
}
