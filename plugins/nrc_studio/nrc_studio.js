(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/constants.js
  var NRC_FORMAT_ID = "nrc_studio_model";
  var NrcModelType = {
    EMOTE: "Emote"
    // Future: COSMETIC: 'Cosmetic', PROP: 'Prop'
  };

  // src/logger.js
  var LOG_PATH = null;
  try {
    LOG_PATH = __require("path").join(__require("os").tmpdir(), "nrc_studio.log");
  } catch (e) {
  }
  var _logLines = [];
  function _flushLog() {
    if (!LOG_PATH) return;
    try {
      __require("fs").writeFileSync(LOG_PATH, _logLines.join("\n") + "\n", "utf-8");
    } catch (e) {
    }
  }
  function nrcLog() {
    const msg = "[NRC Studio] " + Array.from(arguments).join(" ");
    console.log(msg);
    _logLines.push((/* @__PURE__ */ new Date()).toISOString().slice(11, 23) + " " + msg);
    _flushLog();
  }
  function nrcWarn() {
    const msg = "[NRC Studio] WARN " + Array.from(arguments).join(" ");
    console.warn(msg);
    _logLines.push((/* @__PURE__ */ new Date()).toISOString().slice(11, 23) + " " + msg);
    _flushLog();
  }

  // src/templates/emote.js
  function addBone(name, origin, color, parent) {
    var group = new Group({
      name,
      origin,
      color
    });
    group.init();
    if (parent) group.addTo(parent);
    return group;
  }
  function addPlayerCube(name, from, to, uvOffset, color, parentGroup) {
    var cube = new Cube({
      name,
      from,
      to,
      color,
      box_uv: true,
      uv_offset: uvOffset || [0, 0]
    });
    cube.init();
    cube.addTo(parentGroup);
    return cube;
  }
  function buildEmoteRig() {
    nrcLog("buildEmoteRig() start");
    var bipedRig = addBone("bipedRig", [0, 0, 0], 0, null);
    var bipedHead = addBone("bipedHead", [0, 24, 0], 1, bipedRig);
    addPlayerCube("head", [-4, 24, -4], [4, 32, 4], [0, 0], 1, bipedHead);
    addBone("armorHead", [0, 24, 0], 2, bipedHead);
    var bipedBody = addBone("bipedBody", [0, 24, 0], 3, bipedRig);
    addPlayerCube("body", [-4, 12, -2], [4, 24, 2], [0, 16], 3, bipedBody);
    addBone("armorBody", [0, 24, 0], 4, bipedBody);
    var bipedRightArm = addBone("bipedRightArm", [5, 22, 0], 5, bipedRig);
    addPlayerCube("rightArm", [4, 12, -2], [8, 24, 2], [16, 32], 5, bipedRightArm);
    addBone("armorRightArm", [4, 22, 0], 6, bipedRightArm);
    var bipedLeftArm = addBone("bipedLeftArm", [-5, 22, 0], 7, bipedRig);
    addPlayerCube("leftArm", [-8, 12, -2], [-4, 24, 2], [32, 0], 7, bipedLeftArm);
    addBone("armorLeftArm", [-4, 22, 0], 8, bipedLeftArm);
    var bipedLeftLeg = addBone("bipedLeftLeg", [-2, 12, 0], 9, bipedRig);
    addPlayerCube("leftLeg", [-4, 0, -2], [0, 12, 2], [0, 32], 9, bipedLeftLeg);
    addBone("armorLeftLeg", [-2, 12, 0], 0, bipedLeftLeg);
    addBone("armorLeftBoot", [-2, 12, 0], 1, bipedLeftLeg);
    var bipedRightLeg = addBone("bipedRightLeg", [2, 12, 0], 2, bipedRig);
    addPlayerCube("rightLeg", [0, 0, -2], [4, 12, 2], [24, 16], 2, bipedRightLeg);
    addBone("armorRightLeg", [2, 12, 0], 3, bipedRightLeg);
    addBone("armorRightBoot", [2, 12, 0], 4, bipedRightLeg);
    Project.texture_width = 64;
    Project.texture_height = 64;
    Project.visible_box[0] = 5;
    Project.visible_box[1] = 3.5;
    Canvas.updateAll();
    nrcLog("buildEmoteRig() done. Cubes:", Cube.all.length, "Groups:", Group.all.length);
  }

  // src/format.js
  function loadTemplate(modelType, name) {
    nrcLog("loadTemplate called with type:", modelType, "name:", name);
    if (modelType === "EMOTE") {
      if (name) Project.name = name;
      Project.box_uv = true;
      buildEmoteRig();
      nrcLog("Emote rig built. Cubes:", Cube.all.length, "Groups:", Group.all.length);
    } else {
      nrcWarn("Unknown model type:", modelType);
    }
  }
  function createNrcFormat() {
    var format2 = new ModelFormat(NRC_FORMAT_ID, {
      id: NRC_FORMAT_ID,
      icon: "emoji_people",
      name: "NRC Studio Model",
      description: "Animated model for NoRiskClient (emotes, cosmetics, etc.)",
      category: "minecraft",
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
    format2.new = function() {
      var dialog = new Dialog({
        id: "nrc_studio_new_project",
        title: "New NRC Studio Model",
        form: {
          model_type: {
            type: "select",
            label: "Model Type",
            default: "EMOTE",
            options: NrcModelType
          },
          name: {
            type: "text",
            label: "Model Name",
            value: "new_nrc_emote"
          }
        },
        onConfirm: function(formResult) {
          nrcLog("Dialog confirmed:", JSON.stringify(formResult));
          dialog.hide();
          if (newProject(format2)) {
            nrcLog("Project created, loading template...");
            loadTemplate(formResult.model_type, formResult.name);
            Project.nrc_model_type = formResult.model_type;
          } else {
            nrcWarn("newProject() returned false");
          }
        }
      });
      dialog.show();
    };
    return format2;
  }

  // src/export/model.js
  function isNrcModel() {
    return Format && Format.id === NRC_FORMAT_ID;
  }
  function createExportModelAction() {
    return new Action("nrc_export_model", {
      name: "Export NRC Model",
      icon: "icon-objects",
      description: "Export bedrock .geo.json model for NRC",
      category: "file",
      condition: function() {
        return isNrcModel();
      },
      click: function() {
        Codecs.bedrock.export();
      }
    });
  }

  // src/export/animation.js
  function trimFloatStr(num) {
    var s = num.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    return s || "0";
  }
  function arrOrZero(arr) {
    if (!arr) return [0, 0, 0];
    return [arr[0] || 0, arr[1] || 0, arr[2] || 0];
  }
  function buildNrcAnimationFile() {
    var result = {
      format_version: "1.8.0",
      animations: {}
    };
    (Animation.all || []).forEach(function(animation) {
      var animData = {};
      if (animation.loop === "loop") animData.loop = true;
      else if (animation.loop === "hold") animData.loop = "hold_on_last_frame";
      if (animation.length) animData.animation_length = animation.length;
      if (animation.override) animData.override_previous_animation = true;
      if (animation.anim_time_update) animData.anim_time_update = animation.anim_time_update;
      var bones = {};
      for (var uuid in animation.animators) {
        var animator = animation.animators[uuid];
        if (animator.type !== "bone") continue;
        if (!animator.keyframes || !animator.keyframes.length) continue;
        var boneName = animator.name;
        var boneChannels = {};
        ["rotation", "position", "scale"].forEach(function(channel) {
          var kfs = animator[channel];
          if (!kfs || !kfs.length) return;
          var channelData = {};
          var sorted = kfs.slice().sort(function(a, b) {
            return a.time - b.time;
          });
          sorted.forEach(function(kf) {
            var values = kf.getArray(kf.data_points.length > 1 ? 1 : 0);
            var timeKey = trimFloatStr(kf.time);
            if (kf.interpolation === "bezier") {
              channelData[timeKey] = {
                post: values,
                lerp_mode: "bezier",
                bezier_left_time: arrOrZero(kf.bezier_left_time),
                bezier_left_value: arrOrZero(kf.bezier_left_value),
                bezier_right_time: arrOrZero(kf.bezier_right_time),
                bezier_right_value: arrOrZero(kf.bezier_right_value)
              };
            } else if (kf.interpolation === "catmullrom") {
              channelData[timeKey] = {
                post: values,
                lerp_mode: "catmullrom"
              };
            } else {
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
    nrcLog("Built animation file:", Object.keys(result.animations).join(", "));
    return result;
  }

  // src/index.js
  var format;
  var exportModelAction;
  var exportAnimAction;
  var modelTypeProperty;
  BBPlugin.register("nrc_studio", {
    title: "NRC Studio",
    icon: "emoji_people",
    author: "NoRiskClient",
    description: "Create emotes and cosmetics for NoRiskClient",
    version: "1.0.0",
    variant: "both",
    tags: ["Minecraft: Java Edition"],
    onload() {
      modelTypeProperty = new Property(ModelProject, "string", "nrc_model_type", {
        label: "NRC Model Type",
        default: NrcModelType.EMOTE,
        condition: { formats: [NRC_FORMAT_ID] }
      });
      format = createNrcFormat();
      exportModelAction = createExportModelAction();
      exportAnimAction = new Action("nrc_export_animation", {
        name: "Export NRC Animation",
        icon: "movie",
        description: "Export .animation.json with native bezier support for NRC",
        category: "file",
        condition: function() {
          return isNrcModel();
        },
        click: function() {
          var content = JSON.stringify(buildNrcAnimationFile(), null, "	");
          Blockbench.export({
            resource_id: "animation",
            type: "JSON Animation",
            extensions: ["json"],
            name: (Project.name || "animation") + ".animation",
            content
          });
        }
      });
      MenuBar.addAction(exportModelAction, "file.export");
      MenuBar.addAction(exportAnimAction, "file.export");
      nrcLog("Plugin loaded");
    },
    onunload() {
      if (exportModelAction) {
        exportModelAction.delete();
      }
      if (exportAnimAction) {
        exportAnimAction.delete();
      }
      if (modelTypeProperty) {
        modelTypeProperty.delete();
      }
      if (format) {
        format.delete();
      }
      nrcLog("Plugin unloaded");
    }
  });
})();
