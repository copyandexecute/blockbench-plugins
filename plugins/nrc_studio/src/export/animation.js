import { nrcLog } from '../logger.js';

function trimFloatStr(num) {
	var s = num.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
	return s || '0';
}

function arrOrZero(arr) {
	if (!arr) return [0, 0, 0];
	return [arr[0] || 0, arr[1] || 0, arr[2] || 0];
}

export function buildNrcAnimationFile() {
	var result = {
		format_version: '1.8.0',
		animations: {}
	};

	(Animation.all || []).forEach(function (animation) {
		var animData = {};

		if (animation.loop === 'loop') animData.loop = true;
		else if (animation.loop === 'hold') animData.loop = 'hold_on_last_frame';

		if (animation.length) animData.animation_length = animation.length;
		if (animation.override) animData.override_previous_animation = true;
		if (animation.anim_time_update) animData.anim_time_update = animation.anim_time_update;

		var bones = {};

		for (var uuid in animation.animators) {
			var animator = animation.animators[uuid];
			if (animator.type !== 'bone') continue;
			if (!animator.keyframes || !animator.keyframes.length) continue;

			var boneName = animator.name;
			var boneChannels = {};

			['rotation', 'position', 'scale'].forEach(function (channel) {
				var kfs = animator[channel];
				if (!kfs || !kfs.length) return;

				var channelData = {};
				var sorted = kfs.slice().sort(function (a, b) { return a.time - b.time; });

				sorted.forEach(function (kf) {
					var values = kf.getArray(kf.data_points.length > 1 ? 1 : 0);
					var timeKey = trimFloatStr(kf.time);

					if (kf.interpolation === 'bezier') {
						channelData[timeKey] = {
							post: values,
							lerp_mode: 'bezier',
							bezier_left_time: arrOrZero(kf.bezier_left_time),
							bezier_left_value: arrOrZero(kf.bezier_left_value),
							bezier_right_time: arrOrZero(kf.bezier_right_time),
							bezier_right_value: arrOrZero(kf.bezier_right_value)
						};
					} else if (kf.interpolation === 'catmullrom') {
						channelData[timeKey] = {
							post: values,
							lerp_mode: 'catmullrom'
						};
					} else {
						// linear — just the values array
						channelData[timeKey] = values;
					}
				});

				boneChannels[channel] = channelData;
			});

			if (Object.keys(boneChannels).length > 0) {
				bones[boneName] = boneChannels;
			}
		}

		if (Object.keys(bones).length > 0) {
			animData.bones = bones;
		}

		result.animations[animation.name] = animData;
	});

	nrcLog('Built animation file:', Object.keys(result.animations).join(', '));
	return result;
}
