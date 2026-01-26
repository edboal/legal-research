// src/lib/editor/withSlate.ts
import {
  createEditor
} from "@udecode/slate";
import { nanoid } from "nanoid";

// src/internal/plugin/resolvePlugins.ts
import {
  assignLegacyApi,
  assignLegacyTransforms,
  syncLegacyMethods
} from "@udecode/slate";
import { isDefined as isDefined2 } from "@udecode/utils";
import merge2 from "lodash/merge.js";
import { createZustandStore } from "zustand-x";

// src/lib/plugin/createSlatePlugin.ts
import { isDefined } from "@udecode/utils";

// src/internal/utils/isFunction.ts
function isFunction(value) {
  return typeof value === "function";
}

// src/internal/utils/mergePlugins.ts
import mergeWith from "lodash/mergeWith.js";
function mergePlugins(basePlugin, ...sourcePlugins) {
  return mergeWith(
    {},
    basePlugin,
    ...sourcePlugins,
    (objValue, srcValue, key) => {
      if (Array.isArray(srcValue)) {
        return srcValue;
      }
      if (key === "options") {
        return { ...objValue, ...srcValue };
      }
    }
  );
}

// src/lib/plugin/createSlatePlugin.ts
function createSlatePlugin(config = {}) {
  let baseConfig;
  let initialExtension;
  if (isFunction(config)) {
    baseConfig = { key: "" };
    initialExtension = (editor) => config(editor);
  } else {
    baseConfig = config;
  }
  const key = baseConfig.key ?? "";
  const plugin = mergePlugins(
    {
      key,
      __apiExtensions: [],
      __configuration: null,
      __extensions: initialExtension ? [initialExtension] : [],
      __selectorExtensions: [],
      api: {},
      dependencies: [],
      editor: {},
      handlers: {},
      inject: {},
      node: { type: key },
      options: {},
      override: {},
      parser: {},
      parsers: {},
      plugins: [],
      priority: 100,
      render: {},
      shortcuts: {},
      transforms: {}
    },
    config
  );
  if (plugin.node.isLeaf && !isDefined(plugin.node.isDecoration)) {
    plugin.node.isDecoration = true;
  }
  plugin.configure = (config2) => {
    const newPlugin = { ...plugin };
    newPlugin.__configuration = (ctx) => isFunction(config2) ? config2(ctx) : config2;
    return createSlatePlugin(newPlugin);
  };
  plugin.configurePlugin = (p, config2) => {
    const newPlugin = { ...plugin };
    const configureNestedPlugin = (plugins) => {
      let found = false;
      const updatedPlugins = plugins.map((nestedPlugin) => {
        if (nestedPlugin.key === p.key) {
          found = true;
          return createSlatePlugin({
            ...nestedPlugin,
            __configuration: (ctx) => isFunction(config2) ? config2(ctx) : config2
          });
        }
        if (nestedPlugin.plugins && nestedPlugin.plugins.length > 0) {
          const result2 = configureNestedPlugin(nestedPlugin.plugins);
          if (result2.found) {
            found = true;
            return { ...nestedPlugin, plugins: result2.plugins };
          }
        }
        return nestedPlugin;
      });
      return { found, plugins: updatedPlugins };
    };
    const result = configureNestedPlugin(newPlugin.plugins);
    newPlugin.plugins = result.plugins;
    return createSlatePlugin(newPlugin);
  };
  plugin.extendEditorApi = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [
      ...newPlugin.__apiExtensions,
      { extension, isPluginSpecific: false }
    ];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendSelectors = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__selectorExtensions = [
      ...newPlugin.__selectorExtensions,
      extension
    ];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendApi = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [
      ...newPlugin.__apiExtensions,
      { extension, isPluginSpecific: true }
    ];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendEditorTransforms = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [
      ...newPlugin.__apiExtensions,
      { extension, isPluginSpecific: false, isTransform: true }
    ];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendTransforms = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [
      ...newPlugin.__apiExtensions,
      { extension, isPluginSpecific: true, isTransform: true }
    ];
    return createSlatePlugin(newPlugin);
  };
  plugin.overrideEditor = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [
      ...newPlugin.__apiExtensions,
      {
        extension,
        isOverride: true,
        isPluginSpecific: false,
        isTransform: true
      }
    ];
    return createSlatePlugin(newPlugin);
  };
  plugin.extend = (extendConfig) => {
    let newPlugin = { ...plugin };
    if (isFunction(extendConfig)) {
      newPlugin.__extensions = [
        ...newPlugin.__extensions,
        extendConfig
      ];
    } else {
      newPlugin = mergePlugins(newPlugin, extendConfig);
    }
    return createSlatePlugin(newPlugin);
  };
  plugin.clone = () => mergePlugins(plugin);
  plugin.extendPlugin = (p, extendConfig) => {
    const newPlugin = { ...plugin };
    const extendNestedPlugin = (plugins) => {
      let found = false;
      const updatedPlugins = plugins.map((nestedPlugin) => {
        if (nestedPlugin.key === p.key) {
          found = true;
          return createSlatePlugin({
            ...nestedPlugin,
            __extensions: [
              ...nestedPlugin.__extensions,
              (ctx) => isFunction(extendConfig) ? extendConfig(ctx) : extendConfig
            ]
          });
        }
        if (nestedPlugin.plugins && nestedPlugin.plugins.length > 0) {
          const result2 = extendNestedPlugin(nestedPlugin.plugins);
          if (result2.found) {
            found = true;
            return { ...nestedPlugin, plugins: result2.plugins };
          }
        }
        return nestedPlugin;
      });
      return { found, plugins: updatedPlugins };
    };
    const result = extendNestedPlugin(newPlugin.plugins);
    newPlugin.plugins = result.plugins;
    if (!result.found) {
      newPlugin.plugins.push(
        createSlatePlugin({
          key: p.key,
          __extensions: [
            (ctx) => isFunction(extendConfig) ? extendConfig(ctx) : extendConfig
          ]
        })
      );
    }
    return createSlatePlugin(newPlugin);
  };
  return plugin;
}
function createTSlatePlugin(config = {}) {
  return createSlatePlugin(config);
}

// src/lib/plugin/getEditorPlugin.ts
function getEditorPlugin(editor, p) {
  const plugin = editor.getPlugin(p);
  return {
    api: editor.api,
    editor,
    plugin,
    setOption: (keyOrOptions, value) => editor.setOption(plugin, keyOrOptions, value),
    setOptions: (options) => editor.setOptions(plugin, options),
    tf: editor.transforms,
    type: plugin.node.type,
    getOption: (key, ...args) => editor.getOption(plugin, key, ...args),
    getOptions: () => editor.getOptions(plugin)
  };
}

// src/internal/plugin/resolvePlugin.ts
import merge from "lodash/merge.js";
var resolvePlugin = (editor, _plugin) => {
  let plugin = mergePlugins({}, _plugin);
  plugin.__resolved = true;
  if (plugin.__configuration) {
    const configResult = plugin.__configuration(
      getEditorPlugin(editor, plugin)
    );
    plugin = mergePlugins(plugin, configResult);
    delete plugin.__configuration;
  }
  if (plugin.__extensions && plugin.__extensions.length > 0) {
    plugin.__extensions.forEach((extension) => {
      plugin = mergePlugins(
        plugin,
        extension(getEditorPlugin(editor, plugin))
      );
    });
    plugin.__extensions = [];
  }
  const targetPluginToInject = plugin.inject?.targetPluginToInject;
  const targetPlugins = plugin.inject?.targetPlugins;
  if (targetPluginToInject && targetPlugins && targetPlugins.length > 0) {
    plugin.inject = plugin.inject || {};
    plugin.inject.plugins = merge(
      {},
      plugin.inject.plugins,
      Object.fromEntries(
        targetPlugins.map((targetPlugin) => {
          const injectedPlugin = targetPluginToInject({
            ...getEditorPlugin(editor, plugin),
            targetPlugin
          });
          return [targetPlugin, injectedPlugin];
        })
      )
    );
  }
  if (plugin.node?.component) {
    plugin.render.node = plugin.node.component;
  }
  if (plugin.render?.node) {
    plugin.node.component = plugin.render.node;
  }
  validatePlugin(editor, plugin);
  return plugin;
};
var validatePlugin = (editor, plugin) => {
  if (!plugin.__extensions) {
    editor.api.debug.error(
      `Invalid plugin '${plugin.key}', you should use createSlatePlugin.`,
      "USE_CREATE_PLUGIN"
    );
  }
  if (plugin.node.isElement && plugin.node.isLeaf) {
    editor.api.debug.error(
      `Plugin ${plugin.key} cannot be both an element and a leaf.`,
      "PLUGIN_NODE_TYPE"
    );
  }
};

// src/lib/plugin/getSlatePlugin.ts
function getSlatePlugin(editor, p) {
  let plugin = p;
  const editorPlugin = editor.plugins[p.key];
  if (!editorPlugin) {
    if (!plugin.node) {
      plugin = createSlatePlugin(plugin);
    }
    return plugin.__resolved ? plugin : resolvePlugin(editor, plugin);
  }
  return editorPlugin;
}
function getPluginType(editor, plugin) {
  const p = editor.getPlugin(plugin);
  return p.node.type ?? p.key ?? "";
}
var getPluginTypes = (editor, plugins) => plugins.map((plugin) => editor.getType(plugin));

// src/internal/plugin/resolvePlugins.ts
var resolvePlugins = (editor, plugins = []) => {
  editor.pluginList = [];
  editor.plugins = {};
  editor.shortcuts = {};
  const resolvedPlugins = resolveAndSortPlugins(editor, plugins);
  applyPluginsToEditor(editor, resolvedPlugins);
  resolvePluginOverrides(editor);
  resolvePluginStores(editor);
  editor.pluginList.forEach((plugin) => {
    if (plugin.extendEditor) {
      editor = plugin.extendEditor(getEditorPlugin(editor, plugin));
      syncLegacyMethods(editor);
    }
    resolvePluginMethods(editor, plugin);
  });
  resolvePluginShortcuts(editor);
  return editor;
};
var resolvePluginStores = (editor) => {
  editor.pluginList.forEach((plugin) => {
    let store = createZustandStore(plugin.options, {
      mutative: true,
      name: plugin.key
    });
    if (plugin.__selectorExtensions && plugin.__selectorExtensions.length > 0) {
      plugin.__selectorExtensions.forEach((extension) => {
        const extendedOptions = extension(getEditorPlugin(editor, plugin));
        store = store.extendSelectors(() => extendedOptions);
      });
    }
    plugin.optionsStore = store;
  });
};
var resolvePluginMethods = (editor, plugin) => {
  Object.entries(plugin.api).forEach(([apiKey, apiFunction]) => {
    editor.api[apiKey] = apiFunction;
  });
  if (plugin.__apiExtensions && plugin.__apiExtensions.length > 0) {
    plugin.__apiExtensions.forEach(
      ({ extension, isOverride, isPluginSpecific, isTransform }) => {
        const newExtensions = extension(getEditorPlugin(editor, plugin));
        if (isOverride) {
          if (newExtensions.api) {
            merge2(editor.api, newExtensions.api);
            merge2(plugin.api, newExtensions.api);
            assignLegacyApi(editor, editor.api);
          }
          if (newExtensions.transforms) {
            merge2(editor.transforms, newExtensions.transforms);
            merge2(plugin.transforms, newExtensions.transforms);
            assignLegacyTransforms(editor, newExtensions.transforms);
          }
        } else if (isTransform) {
          if (isPluginSpecific) {
            if (!editor.transforms[plugin.key]) {
              editor.transforms[plugin.key] = {};
            }
            if (!plugin.transforms[plugin.key]) {
              plugin.transforms[plugin.key] = {};
            }
            merge2(editor.transforms[plugin.key], newExtensions);
            merge2(plugin.transforms[plugin.key], newExtensions);
          } else {
            merge2(editor.transforms, newExtensions);
            merge2(plugin.transforms, newExtensions);
            assignLegacyTransforms(editor, newExtensions);
          }
        } else {
          if (isPluginSpecific) {
            if (!editor.api[plugin.key]) {
              editor.api[plugin.key] = {};
            }
            if (!plugin.api[plugin.key]) {
              plugin.api[plugin.key] = {};
            }
            merge2(editor.api[plugin.key], newExtensions);
            merge2(plugin.api[plugin.key], newExtensions);
          } else {
            merge2(editor.api, newExtensions);
            merge2(plugin.api, newExtensions);
            assignLegacyApi(editor, editor.api);
          }
        }
      }
    );
    delete plugin.__apiExtensions;
  }
};
var resolvePluginShortcuts = (editor) => {
  const shortcutsByPriority = [];
  editor.pluginList.forEach((plugin) => {
    Object.entries(plugin.shortcuts).forEach(([key, hotkey]) => {
      if (hotkey === null) {
        const index = shortcutsByPriority.findIndex((item) => item.key === key);
        if (index !== -1) {
          shortcutsByPriority.splice(index, 1);
        }
      } else {
        const priority = hotkey.priority ?? plugin.priority;
        const existingIndex = shortcutsByPriority.findIndex(
          (item) => item.key === key
        );
        if (existingIndex === -1 || priority >= shortcutsByPriority[existingIndex].priority) {
          if (existingIndex !== -1) {
            shortcutsByPriority.splice(existingIndex, 1);
          }
          shortcutsByPriority.push({ key, hotkey, priority });
        }
      }
    });
  });
  shortcutsByPriority.sort((a, b) => b.hotkey.priority - a.hotkey.priority);
  editor.shortcuts = Object.fromEntries(
    shortcutsByPriority.map(({ key, hotkey }) => {
      const { priority, ...hotkeyWithoutPriority } = hotkey;
      return [key, hotkeyWithoutPriority];
    })
  );
};
var flattenAndResolvePlugins = (editor, plugins) => {
  const pluginMap = /* @__PURE__ */ new Map();
  const processPlugin = (plugin) => {
    const resolvedPlugin = resolvePlugin(editor, plugin);
    const existingPlugin = pluginMap.get(resolvedPlugin.key);
    if (existingPlugin) {
      pluginMap.set(
        resolvedPlugin.key,
        mergePlugins(existingPlugin, resolvedPlugin)
      );
    } else {
      pluginMap.set(resolvedPlugin.key, resolvedPlugin);
    }
    if (resolvedPlugin.plugins && resolvedPlugin.plugins.length > 0) {
      resolvedPlugin.plugins.forEach(processPlugin);
    }
  };
  plugins.forEach(processPlugin);
  return pluginMap;
};
var resolveAndSortPlugins = (editor, plugins) => {
  const pluginMap = flattenAndResolvePlugins(editor, plugins);
  const enabledPlugins = Array.from(pluginMap.values()).filter(
    (plugin) => plugin.enabled !== false
  );
  enabledPlugins.sort((a, b) => b.priority - a.priority);
  const orderedPlugins = [];
  const visited = /* @__PURE__ */ new Set();
  const visit = (plugin) => {
    if (visited.has(plugin.key)) return;
    visited.add(plugin.key);
    plugin.dependencies?.forEach((depKey) => {
      const depPlugin = pluginMap.get(depKey);
      if (depPlugin) {
        visit(depPlugin);
      } else {
        editor.api.debug.warn(
          `Plugin "${plugin.key}" depends on missing plugin "${depKey}"`,
          "PLUGIN_DEPENDENCY_MISSING"
        );
      }
    });
    orderedPlugins.push(plugin);
  };
  enabledPlugins.forEach(visit);
  return orderedPlugins;
};
var applyPluginsToEditor = (editor, plugins) => {
  editor.pluginList = plugins;
  editor.plugins = Object.fromEntries(
    plugins.map((plugin) => [plugin.key, plugin])
  );
};
var resolvePluginOverrides = (editor) => {
  const applyOverrides = (plugins) => {
    let overriddenPlugins = [...plugins];
    const enabledOverrides = {};
    const componentOverrides = {};
    const pluginOverrides = {};
    for (const plugin of plugins) {
      if (plugin.override.enabled) {
        Object.assign(enabledOverrides, plugin.override.enabled);
      }
      if (plugin.override.components) {
        Object.entries(plugin.override.components).forEach(
          ([key, component]) => {
            if (!componentOverrides[key] || plugin.priority > componentOverrides[key].priority) {
              componentOverrides[key] = {
                component,
                priority: plugin.priority
              };
            }
          }
        );
      }
      if (plugin.override.plugins) {
        Object.entries(plugin.override.plugins).forEach(([key, value]) => {
          pluginOverrides[key] = mergePlugins(pluginOverrides[key], value);
          if (value.enabled !== void 0) {
            enabledOverrides[key] = value.enabled;
          }
        });
      }
    }
    overriddenPlugins = overriddenPlugins.map((p) => {
      let updatedPlugin = { ...p };
      if (pluginOverrides[p.key]) {
        updatedPlugin = mergePlugins(updatedPlugin, pluginOverrides[p.key]);
      }
      if (componentOverrides[p.key] && (!p.render.node && !p.node.component || componentOverrides[p.key].priority > p.priority)) {
        updatedPlugin.render.node = componentOverrides[p.key].component;
        updatedPlugin.node.component = componentOverrides[p.key].component;
      }
      const enabled = enabledOverrides[p.key] ?? updatedPlugin.enabled;
      if (isDefined2(enabled)) {
        updatedPlugin.enabled = enabled;
      }
      return updatedPlugin;
    });
    return overriddenPlugins.filter((p) => p.enabled !== false).map((plugin) => ({
      ...plugin,
      plugins: applyOverrides(plugin.plugins || [])
    }));
  };
  editor.pluginList = applyOverrides(editor.pluginList);
  editor.plugins = Object.fromEntries(
    editor.pluginList.map((plugin) => [plugin.key, plugin])
  );
};

// src/lib/plugins/AstPlugin.ts
var AstPlugin = createSlatePlugin({
  key: "ast",
  parser: {
    format: "application/x-slate-fragment",
    deserialize: ({ data }) => {
      const decoded = decodeURIComponent(window.atob(data));
      let parsed;
      try {
        parsed = JSON.parse(decoded);
      } catch {
      }
      return parsed;
    }
  }
});

// src/lib/plugins/HistoryPlugin.ts
import { withHistory } from "@udecode/slate";
var withPlateHistory = ({ editor }) => withHistory(editor);
var HistoryPlugin = createSlatePlugin({
  key: "history",
  extendEditor: withPlateHistory
});

// src/lib/plugins/InlineVoidPlugin.ts
var withInlineVoid = ({
  api: { isInline, isSelectable, isVoid, markableVoid },
  editor
}) => {
  const voidTypes = [];
  const inlineTypes = [];
  const markableVoidTypes = [];
  const nonSelectableTypes = [];
  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isInline) {
      inlineTypes.push(plugin.node.type);
    }
    if (plugin.node.isVoid) {
      voidTypes.push(plugin.node.type);
    }
    if (plugin.node.isMarkableVoid) {
      markableVoidTypes.push(plugin.node.type);
    }
    if (plugin.node.isSelectable === false) {
      nonSelectableTypes.push(plugin.node.type);
    }
  });
  return {
    api: {
      isInline(element) {
        return inlineTypes.includes(element.type) ? true : isInline(element);
      },
      isSelectable(element) {
        return nonSelectableTypes.includes(element.type) ? false : isSelectable(element);
      },
      isVoid(element) {
        return voidTypes.includes(element.type) ? true : isVoid(element);
      },
      markableVoid(element) {
        return markableVoidTypes.includes(element.type) ? true : markableVoid(element);
      }
    }
  };
};
var InlineVoidPlugin = createSlatePlugin({
  key: "inlineVoid"
}).overrideEditor(withInlineVoid);

// src/internal/plugin/pipeInsertFragment.ts
var pipeInsertFragment = (editor, injectedPlugins, { fragment, ...options }) => {
  editor.tf.withoutNormalizing(() => {
    injectedPlugins.some((p) => {
      return p.parser?.preInsert?.({
        ...getEditorPlugin(editor, p),
        fragment,
        ...options
      }) === true;
    });
    editor.tf.insertFragment(fragment);
  });
};

// src/internal/plugin/pipeTransformData.ts
var pipeTransformData = (editor, plugins, { data, dataTransfer }) => {
  plugins.forEach((p) => {
    const transformData = p.parser?.transformData;
    if (!transformData) return;
    data = transformData({
      ...getEditorPlugin(editor, p),
      data,
      dataTransfer
    });
  });
  return data;
};

// src/internal/plugin/pipeTransformFragment.ts
var pipeTransformFragment = (editor, plugins, { fragment, ...options }) => {
  plugins.forEach((p) => {
    const transformFragment = p.parser?.transformFragment;
    if (!transformFragment) return;
    fragment = transformFragment({
      fragment,
      ...options,
      ...getEditorPlugin(editor, p)
    });
  });
  return fragment;
};

// src/lib/utils/applyDeepToNodes.ts
import {
  NodeApi,
  queryNode
} from "@udecode/slate";
var applyDeepToNodes = ({
  apply,
  node,
  path = [],
  query,
  source
}) => {
  const entry = [node, path];
  if (queryNode(entry, query)) {
    if (typeof source === "function") {
      apply(node, source());
    } else {
      apply(node, source);
    }
  }
  if (!NodeApi.isAncestor(node)) return;
  node.children.forEach((child, index) => {
    applyDeepToNodes({
      apply,
      node: child,
      path: path.concat([index]),
      query,
      source
    });
  });
};

// src/lib/utils/defaultsDeepToNodes.ts
import defaults from "lodash/defaults.js";
var defaultsDeepToNodes = (options) => {
  applyDeepToNodes({ ...options, apply: defaults });
};

// src/lib/utils/getInjectMatch.ts
import { ElementApi } from "@udecode/slate";

// src/lib/utils/getKeysByTypes.ts
var getKeysByTypes = (editor, types) => {
  return Object.values(editor.plugins).filter((plugin) => types.includes(plugin.node.type)).map((plugin) => plugin.key);
};
var getKeyByType = (editor, type) => {
  const plugin = Object.values(editor.plugins).find(
    (plugin2) => plugin2.node.type === type
  );
  return plugin?.key ?? type;
};

// src/lib/utils/getInjectMatch.ts
var getInjectMatch = (editor, plugin) => {
  return (node, path) => {
    const {
      inject: {
        excludeBelowPlugins,
        excludePlugins,
        isBlock: _isBlock,
        isElement: _isElement,
        isLeaf,
        maxLevel,
        targetPlugins
      }
    } = plugin;
    const element = ElementApi.isElement(node) ? node : void 0;
    if (_isElement && !element) return false;
    if (_isBlock && (!element || !editor.api.isBlock(element))) return false;
    if (isLeaf && element) return false;
    if (element?.type) {
      if (excludePlugins?.includes(getKeyByType(editor, element.type))) {
        return false;
      }
      if (targetPlugins && !targetPlugins.includes(getKeyByType(editor, element.type))) {
        return false;
      }
    }
    if (excludeBelowPlugins || maxLevel) {
      if (maxLevel && path.length > maxLevel) {
        return false;
      }
      if (excludeBelowPlugins) {
        const excludeTypes = getKeysByTypes(editor, excludeBelowPlugins);
        const isBelow = editor.api.above({
          at: path,
          match: (n) => ElementApi.isElement(n) && excludeTypes.includes(n.type)
        });
        if (isBelow) return false;
      }
    }
    return true;
  };
};

// src/lib/utils/getInjectedPlugins.ts
var getInjectedPlugins = (editor, plugin) => {
  const injectedPlugins = [];
  [...editor.pluginList].reverse().forEach((p) => {
    const injectedPlugin = p.inject.plugins?.[plugin.key];
    if (injectedPlugin) injectedPlugins.push(injectedPlugin);
  });
  return [plugin, ...injectedPlugins];
};

// src/lib/utils/getPluginNodeProps.ts
import pick from "lodash/pick.js";

// src/lib/static/pipeRenderElementStatic.tsx
import React4 from "react";

// src/lib/static/components/slate-nodes.tsx
import React from "react";
import { clsx } from "clsx";
var useNodeAttributes = (props, ref) => {
  return {
    ...props.attributes,
    className: clsx(props.attributes.className, props.className) || void 0,
    ref,
    style: { ...props.attributes.style, ...props.style }
  };
};
var SlateElement = React.forwardRef(function SlateElement2({ as: Tag = "div", children, ...props }, ref) {
  const attributes = useNodeAttributes(props, ref);
  const block = !!props.element.id && !!props.editor.api.isBlock(props.element);
  const belowRootComponents = props.editor.pluginList.map((plugin) => plugin.render.belowRootNodes).filter(Boolean);
  return /* @__PURE__ */ React.createElement(
    Tag,
    {
      "data-slate-node": "element",
      "data-slate-inline": attributes["data-slate-inline"],
      "data-block-id": block ? props.element.id : void 0,
      ...attributes,
      style: {
        position: "relative",
        ...attributes?.style
      }
    },
    children,
    belowRootComponents?.map((Component, index) => /* @__PURE__ */ React.createElement(Component, { key: index, ...props }))
  );
});
var SlateText = React.forwardRef(({ as: Tag = "span", children, ...props }, ref) => {
  const attributes = useNodeAttributes(props, ref);
  return /* @__PURE__ */ React.createElement(Tag, { ...attributes }, children);
});
var SlateLeaf = React.forwardRef(({ as: Tag = "span", children, ...props }, ref) => {
  const attributes = useNodeAttributes(props, ref);
  return /* @__PURE__ */ React.createElement(Tag, { ...attributes }, children);
});

// src/lib/static/pluginRenderElementStatic.tsx
import React3 from "react";

// src/lib/static/utils/createStaticString.ts
import React2 from "react";
function createStaticString({ text }) {
  return React2.createElement(
    "span",
    { "data-slate-string": true },
    text === "" ? "\uFEFF" : text
  );
}

// src/lib/static/utils/getNodeDataAttributes.ts
import { TextApi } from "@udecode/slate";
import kebabCase from "lodash/kebabCase.js";
var getNodeDataAttributes = (editor, node, {
  isElement,
  isLeaf,
  isText
}) => {
  const dataAttributes = Object.keys(node).reduce((acc, key) => {
    if (typeof node[key] === "object") return acc;
    if (isElement && key === "children") return acc;
    if ((isLeaf || isText) && key === "text") return acc;
    const plugin = editor.plugins[key];
    if (isLeaf && plugin?.node.isLeaf && plugin?.node.isDecoration !== true) {
      return acc;
    }
    if (isText && plugin?.node.isLeaf && plugin?.node.isDecoration !== false) {
      return acc;
    }
    const attributeName = keyToDataAttribute(key);
    return { ...acc, [attributeName]: node[key] };
  }, {});
  return dataAttributes;
};
var getPluginDataAttributes = (editor, plugin, node) => {
  const isElement = plugin.node.isElement;
  const isLeaf = plugin.node.isLeaf && plugin.node.isDecoration === true;
  const isText = plugin.node.isLeaf && plugin.node.isDecoration === false;
  const dataAttributes = getNodeDataAttributes(editor, node, {
    isElement,
    isLeaf,
    isText
  });
  const customAttributes = plugin.node.toDataAttributes?.({
    ...plugin ? getEditorPlugin(editor, plugin) : {},
    node
  }) ?? {};
  return { ...dataAttributes, ...customAttributes };
};
var getNodeDataAttributeKeys = (node) => {
  return Object.keys(node).filter(
    (key) => typeof node[key] !== "object" && (!TextApi.isText(node) || key !== "text")
  ).map((key) => keyToDataAttribute(key));
};
var keyToDataAttribute = (key) => {
  return `data-slate-${kebabCase(key)}`;
};

// src/lib/static/utils/getRenderNodeStaticProps.ts
import clsx3 from "clsx";

// src/internal/plugin/pipeInjectNodeProps.tsx
import clsx2 from "clsx";

// src/internal/plugin/pluginInjectNodeProps.ts
import { isDefined as isDefined3 } from "@udecode/utils";
var pluginInjectNodeProps = (editor, plugin, nodeProps, getElementPath) => {
  const {
    key,
    inject: { nodeProps: injectNodeProps }
  } = plugin;
  const { element, text } = nodeProps;
  const node = element ?? text;
  if (!node) return;
  if (!injectNodeProps) return;
  const {
    classNames,
    defaultNodeValue,
    nodeKey = key,
    query,
    styleKey = nodeKey,
    transformClassName,
    transformNodeValue,
    transformProps,
    transformStyle,
    validNodeValues
  } = injectNodeProps;
  const injectMatch = getInjectMatch(editor, plugin);
  if (!injectMatch(node, getElementPath(node))) return;
  const queryResult = query?.({
    ...injectNodeProps,
    ...getEditorPlugin(editor, plugin),
    nodeProps
  });
  if (query && !queryResult) {
    return;
  }
  const nodeValue = node[nodeKey];
  if (!transformProps && (!isDefined3(nodeValue) || validNodeValues && !validNodeValues.includes(nodeValue) || nodeValue === defaultNodeValue)) {
    return;
  }
  const transformOptions = {
    ...nodeProps,
    ...getEditorPlugin(editor, plugin),
    nodeValue
  };
  const value = transformNodeValue?.(transformOptions) ?? nodeValue;
  transformOptions.value = value;
  let newProps = {};
  if (element && nodeKey) {
    newProps.className = `slate-${nodeKey}-${nodeValue}`;
  }
  if (classNames?.[nodeValue] || transformClassName) {
    newProps.className = transformClassName?.(transformOptions) ?? classNames?.[value];
  }
  if (styleKey) {
    newProps.style = transformStyle?.(transformOptions) ?? {
      [styleKey]: value
    };
  }
  if (transformProps) {
    newProps = transformProps({ ...transformOptions, props: newProps }) ?? newProps;
  }
  return newProps;
};

// src/internal/plugin/pipeInjectNodeProps.tsx
var pipeInjectNodeProps = (editor, nodeProps, getElementPath) => {
  editor.pluginList.forEach((plugin) => {
    if (plugin.inject.nodeProps) {
      const newAttributes = pluginInjectNodeProps(
        editor,
        plugin,
        nodeProps,
        getElementPath
      );
      if (!newAttributes) return;
      const attributes = nodeProps.attributes;
      nodeProps.attributes = {
        ...attributes,
        ...newAttributes,
        className: clsx2(attributes?.className, newAttributes.className) || void 0,
        style: {
          ...attributes?.style,
          ...newAttributes.style
        }
      };
    }
  });
  return nodeProps;
};

// src/lib/static/utils/getRenderNodeStaticProps.ts
var getRenderNodeStaticProps = ({
  attributes: nodeAttributes,
  editor,
  node,
  plugin,
  props
}) => {
  let newProps = {
    ...props,
    ...plugin ? getEditorPlugin(editor, plugin) : {},
    editor
  };
  const { className } = props;
  const pluginProps = getPluginNodeProps({
    attributes: nodeAttributes,
    node,
    plugin,
    props: newProps
  });
  newProps = {
    ...pluginProps,
    attributes: {
      ...pluginProps.attributes,
      className: clsx3(getSlateClass(plugin?.node.type), className) || void 0
    }
  };
  newProps = pipeInjectNodeProps(
    editor,
    newProps,
    (node2) => editor.api.findPath(node2)
  );
  if (newProps.style && Object.keys(newProps.style).length === 0) {
    delete newProps.style;
  }
  return newProps;
};

// src/lib/static/utils/pipeDecorate.ts
var pipeDecorate = (editor, decorateProp) => {
  const relevantPlugins = editor.pluginList.filter((plugin) => plugin.decorate);
  if (relevantPlugins.length === 0 && !decorateProp) return;
  return (entry) => {
    let ranges = [];
    const addRanges = (newRanges) => {
      if (newRanges?.length) ranges = [...ranges, ...newRanges];
    };
    relevantPlugins.forEach((plugin) => {
      addRanges(
        plugin.decorate({
          ...getEditorPlugin(editor, plugin),
          entry
        })
      );
    });
    if (decorateProp) {
      addRanges(
        decorateProp({
          editor,
          entry
        })
      );
    }
    return ranges;
  };
};

// src/lib/static/utils/stripHtmlClassNames.ts
var classAttrRegExp = / class="([^"]*)"/g;
var stripHtmlClassNames = (html, { preserveClassNames = ["slate-"] }) => {
  if (preserveClassNames.length === 0) {
    return html.replaceAll(classAttrRegExp, "");
  }
  const preserveRegExp = new RegExp(
    preserveClassNames.map((cn) => `^${cn}`).join("|")
  );
  return html.replaceAll(
    classAttrRegExp,
    (match, className) => {
      const classesToKeep = className.split(/\s+/).filter((cn) => preserveRegExp.test(cn));
      return classesToKeep.length === 0 ? "" : ` class="${classesToKeep.join(" ")}"`;
    }
  );
};

// src/lib/static/utils/stripSlateDataAttributes.ts
var stripSlateDataAttributes = (rawHtml) => rawHtml.replaceAll(/ data-slate(?:-node|-type|-leaf|-string)="[^"]+"/g, "").replaceAll(/ data-testid="[^"]+"/g, "");

// src/lib/static/pluginRenderElementStatic.tsx
var pluginRenderElementStatic = (editor, plugin, components) => function render(nodeProps) {
  if (nodeProps.element.type === plugin.node.type) {
    const element = nodeProps.element;
    const key = plugin.key;
    const Element = components?.[plugin.key] ?? SlateElement;
    let { children } = nodeProps;
    const aboveNodes = editor.pluginList.flatMap(
      (o) => o.render?.aboveNodes ?? []
    );
    const belowNodes = editor.pluginList.flatMap(
      (o) => o.render?.belowNodes ?? []
    );
    const dataAttributes = getPluginDataAttributes(editor, plugin, element);
    nodeProps = getRenderNodeStaticProps({
      attributes: {
        ...element.attributes,
        ...dataAttributes
      },
      editor,
      node: element,
      plugin,
      props: nodeProps
    });
    belowNodes.forEach((withHOC) => {
      const hoc = withHOC({ ...nodeProps, key });
      if (hoc) {
        children = hoc({ ...nodeProps, children });
      }
    });
    let component = /* @__PURE__ */ React3.createElement(Element, { ...nodeProps }, children);
    aboveNodes.forEach((withHOC) => {
      const hoc = withHOC({ ...nodeProps, key });
      if (hoc) {
        component = hoc({ ...nodeProps, children: component });
      }
    });
    return component;
  }
};

// src/lib/static/pipeRenderElementStatic.tsx
var pipeRenderElementStatic = (editor, {
  components,
  renderElement: renderElementProp
}) => {
  const renderElements = [];
  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isElement) {
      renderElements.push(
        pluginRenderElementStatic(editor, plugin, components)
      );
    }
  });
  return function render(props) {
    let element;
    renderElements.some((renderElement) => {
      element = renderElement(props);
      return !!element;
    });
    if (element) return element;
    if (renderElementProp) {
      return renderElementProp(props);
    }
    const ctxProps = getRenderNodeStaticProps({
      editor,
      props: { ...props }
    });
    return /* @__PURE__ */ React4.createElement(SlateElement, { ...ctxProps }, props.children);
  };
};

// src/lib/static/pluginRenderLeafStatic.tsx
import React7 from "react";
import clsx6 from "clsx";

// src/lib/static/components/PlateStatic.tsx
import React6 from "react";
import {
  ElementApi as ElementApi2,
  isElementDecorationsEqual,
  isTextDecorationsEqual,
  RangeApi,
  TextApi as TextApi2
} from "@udecode/slate";
import clsx5 from "clsx";

// src/lib/static/pluginRenderTextStatic.tsx
import React5 from "react";
import clsx4 from "clsx";
var pluginRenderTextStatic = (editor, plugin, components) => function render(nodeProps) {
  const { children, text } = nodeProps;
  if (text[plugin.node.type ?? plugin.key]) {
    const Text = components?.[plugin.key] ?? SlateText;
    const ctxProps = getRenderNodeStaticProps({
      attributes: { ...text.attributes },
      editor,
      node: text,
      plugin,
      props: nodeProps
    });
    return /* @__PURE__ */ React5.createElement(Text, { ...ctxProps }, children);
  }
  return children;
};
var pipeRenderTextStatic = (editor, {
  components,
  renderText: renderTextProp
}) => {
  const renderTexts = [];
  const textPropsPlugins = [];
  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isLeaf && plugin.node.isDecoration === false) {
      renderTexts.push(pluginRenderTextStatic(editor, plugin, components));
    }
    if (plugin.node.textProps) {
      textPropsPlugins.push(plugin);
    }
  });
  return function render({ attributes, ...props }) {
    renderTexts.forEach((render2) => {
      const newChildren = render2(props);
      if (newChildren !== void 0) {
        props.children = newChildren;
      }
    });
    textPropsPlugins.forEach((plugin) => {
      if (props.text[plugin.node.type ?? plugin.key]) {
        const pluginTextProps = typeof plugin.node.textProps === "function" ? plugin.node.textProps(props) : plugin.node.textProps ?? {};
        if (pluginTextProps.className) {
          pluginTextProps.className = clsx4(
            props.className,
            pluginTextProps.className
          );
        }
        attributes = {
          ...attributes,
          ...pluginTextProps
        };
      }
    });
    if (renderTextProp) {
      return renderTextProp({ attributes, ...props });
    }
    const ctxProps = getRenderNodeStaticProps({
      editor,
      props: { attributes, ...props }
    });
    const text = ctxProps.text;
    const dataAttributes = getNodeDataAttributes(editor, text, {
      isText: true
    });
    return /* @__PURE__ */ React5.createElement(
      SlateText,
      {
        ...ctxProps,
        attributes: {
          ...ctxProps.attributes,
          ...dataAttributes
        }
      }
    );
  };
};

// src/lib/static/components/PlateStatic.tsx
function BaseElementStatic({
  components,
  decorate,
  decorations,
  editor,
  element = { children: [], type: "" }
}) {
  const renderElement = pipeRenderElementStatic(editor, { components });
  const attributes = {
    "data-slate-node": "element",
    ref: null
  };
  let children = /* @__PURE__ */ React6.createElement(
    Children,
    {
      components,
      decorate,
      decorations,
      editor
    },
    element.children
  );
  if (editor.api.isVoid(element)) {
    attributes["data-slate-void"] = true;
    children = /* @__PURE__ */ React6.createElement(
      "span",
      {
        style: {
          color: "transparent",
          height: "0",
          outline: "none",
          position: "absolute"
        },
        "data-slate-spacer": true
      },
      /* @__PURE__ */ React6.createElement(
        Children,
        {
          components,
          decorate,
          decorations,
          editor
        },
        element.children
      )
    );
  }
  if (editor.api.isInline(element)) {
    attributes["data-slate-inline"] = true;
  }
  return /* @__PURE__ */ React6.createElement(React6.Fragment, null, renderElement?.({ attributes, children, element }));
}
var ElementStatic = React6.memo(BaseElementStatic, (prev, next) => {
  return (prev.element === next.element || prev.element._memo !== void 0 && prev.element._memo === next.element._memo) && isElementDecorationsEqual(prev.decorations, next.decorations);
});
function BaseLeafStatic({
  components,
  decorations,
  editor,
  text = { text: "" }
}) {
  const renderLeaf = pipeRenderLeafStatic(editor, { components });
  const renderText = pipeRenderTextStatic(editor, { components });
  const decoratedLeaves = TextApi2.decorations(text, decorations);
  const leafElements = decoratedLeaves.map(({ leaf, position }, index) => {
    const leafElement = renderLeaf({
      attributes: { "data-slate-leaf": true },
      children: /* @__PURE__ */ React6.createElement("span", { "data-slate-string": true }, leaf.text === "" ? "\uFEFF" : leaf.text),
      leaf,
      leafPosition: position,
      text: leaf
    });
    return /* @__PURE__ */ React6.createElement(React6.Fragment, { key: index }, leafElement);
  });
  return renderText({
    attributes: { "data-slate-node": "text", ref: null },
    children: leafElements,
    text
  });
}
var LeafStatic = React6.memo(BaseLeafStatic, (prev, next) => {
  return (
    // prev.text === next.text &&
    TextApi2.equals(next.text, prev.text) && isTextDecorationsEqual(next.decorations, prev.decorations)
  );
});
var defaultDecorate = () => [];
function Children({
  children = [],
  components,
  decorate = defaultDecorate,
  decorations = [],
  editor
}) {
  return /* @__PURE__ */ React6.createElement(React6.Fragment, null, children.map((child, i) => {
    const p = editor.api.findPath(child);
    let ds = [];
    if (p) {
      const range = editor.api.range(p);
      ds = decorate([child, p]);
      for (const dec of decorations) {
        const d = RangeApi.intersection(dec, range);
        if (d) {
          ds.push(d);
        }
      }
    }
    return ElementApi2.isElement(child) ? /* @__PURE__ */ React6.createElement(
      ElementStatic,
      {
        key: i,
        components,
        decorate,
        decorations: ds,
        editor,
        element: child
      }
    ) : /* @__PURE__ */ React6.createElement(
      LeafStatic,
      {
        key: i,
        components,
        decorations: ds,
        editor,
        text: child
      }
    );
  }));
}
function PlateStatic(props) {
  const { className, components, editor, value, ...rest } = props;
  if (value) {
    editor.children = value;
  }
  const decorate = pipeDecorate(editor);
  let afterEditable = null;
  let beforeEditable = null;
  editor.pluginList.forEach((plugin) => {
    const {
      render: { afterEditable: AfterEditable, beforeEditable: BeforeEditable }
    } = plugin;
    if (AfterEditable) {
      afterEditable = /* @__PURE__ */ React6.createElement(React6.Fragment, null, afterEditable, /* @__PURE__ */ React6.createElement(AfterEditable, null));
    }
    if (BeforeEditable) {
      beforeEditable = /* @__PURE__ */ React6.createElement(React6.Fragment, null, beforeEditable, /* @__PURE__ */ React6.createElement(BeforeEditable, null));
    }
  });
  const content = /* @__PURE__ */ React6.createElement(
    "div",
    {
      className: clsx5("slate-editor", className),
      "data-slate-editor": true,
      "data-slate-node": "value",
      ...rest
    },
    /* @__PURE__ */ React6.createElement(
      Children,
      {
        components,
        decorate,
        decorations: [],
        editor
      },
      editor.children
    )
  );
  let aboveEditable = /* @__PURE__ */ React6.createElement(React6.Fragment, null, beforeEditable, content, afterEditable);
  editor.pluginList.forEach((plugin) => {
    const {
      render: { aboveEditable: AboveEditable }
    } = plugin;
    if (AboveEditable) {
      aboveEditable = /* @__PURE__ */ React6.createElement(AboveEditable, null, aboveEditable);
    }
  });
  return aboveEditable;
}

// src/lib/static/pluginRenderLeafStatic.tsx
var pluginRenderLeafStatic = (editor, plugin, components) => function render(props) {
  const { children, leaf } = props;
  if (leaf[plugin.node.type ?? plugin.key]) {
    const Leaf = plugin.render.leaf ?? components?.[plugin.key] ?? SlateLeaf;
    const ctxProps = getRenderNodeStaticProps({
      attributes: { ...leaf.attributes },
      editor,
      node: leaf,
      plugin,
      props
    });
    return /* @__PURE__ */ React7.createElement(Leaf, { ...ctxProps }, children);
  }
  return children;
};
var pipeRenderLeafStatic = (editor, {
  components,
  renderLeaf: renderLeafProp
}) => {
  const renderLeafs = [];
  const leafPropsPlugins = [];
  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isLeaf && (plugin.node.isDecoration === true || plugin.render.leaf)) {
      renderLeafs.push(pluginRenderLeafStatic(editor, plugin, components));
    }
    if (plugin.node.leafProps) {
      leafPropsPlugins.push(plugin);
    }
  });
  return function render({ attributes, ...props }) {
    renderLeafs.forEach((render2) => {
      const newChildren = render2(props);
      if (newChildren !== void 0) {
        props.children = newChildren;
      }
    });
    leafPropsPlugins.forEach((plugin) => {
      if (props.leaf[plugin.node.type ?? plugin.key]) {
        const pluginLeafProps = typeof plugin.node.leafProps === "function" ? plugin.node.leafProps(props) : plugin.node.leafProps ?? {};
        if (pluginLeafProps.className) {
          pluginLeafProps.className = clsx6(
            props.className,
            pluginLeafProps.className
          );
        }
        attributes = {
          ...attributes,
          ...pluginLeafProps
        };
      }
    });
    if (renderLeafProp) {
      return renderLeafProp({ attributes, ...props });
    }
    const ctxProps = getRenderNodeStaticProps({
      editor,
      props: { attributes, ...props }
    });
    const leaf = ctxProps.leaf;
    const dataAttributes = getNodeDataAttributes(editor, leaf, {
      isLeaf: true
    });
    return /* @__PURE__ */ React7.createElement(
      SlateLeaf,
      {
        ...ctxProps,
        attributes: {
          ...ctxProps.attributes,
          ...dataAttributes
        }
      }
    );
  };
};

// src/lib/static/serializeHtml.tsx
import React8 from "react";
import { decode } from "html-entities";
var getReactDOMServer = async () => {
  const ReactDOMServer = (await import("react-dom/server")).default;
  return ReactDOMServer;
};
var renderComponentToHtml = (ReactDOMServer, Component, props) => {
  return decode(
    ReactDOMServer.renderToStaticMarkup(React8.createElement(Component, props))
  );
};
var serializeHtml = async (editor, {
  components,
  editorComponent: EditorComponent = PlateStatic,
  preserveClassNames,
  props = {},
  stripClassNames = false,
  stripDataAttributes = false
}) => {
  const ReactDOMServer = await getReactDOMServer();
  let htmlString = renderComponentToHtml(ReactDOMServer, EditorComponent, {
    components,
    editor,
    ...props
  });
  if (stripClassNames) {
    htmlString = stripHtmlClassNames(htmlString, {
      preserveClassNames
    });
  }
  if (stripDataAttributes) {
    htmlString = stripSlateDataAttributes(htmlString);
  }
  return htmlString;
};

// src/lib/static/deserialize/checkUtils.ts
var isSlateVoid = (element) => {
  return element.dataset.slateVoid === "true";
};
var isSlateElement = (element) => {
  return element.dataset.slateNode === "element";
};
var isSlateText = (element) => {
  return element.dataset.slateNode === "text";
};
var isSlateString = (element) => {
  return element.dataset.slateString === "true";
};
var isSlateLeaf = (element) => {
  return element.dataset.slateLeaf === "true";
};
var isSlateEditor = (element) => {
  return element.dataset.slateEditor === "true";
};
var isSlateNode = (element) => {
  return isSlateLeaf(element) || isSlateElement(element) || isSlateVoid(element) || isSlateString(element) || isSlateText(element);
};
var isSlatePluginElement = (element, pluginKey) => {
  return element.dataset.slateNode === "element" && element.classList.contains(`slate-${pluginKey}`);
};
var isSlatePluginNode = (element, pluginKey) => {
  return element.classList.contains(`slate-${pluginKey}`);
};
var getSlateElements = (element) => {
  return Array.from(element.querySelectorAll('[data-slate-node="element"]'));
};

// src/lib/static/deserialize/htmlStringToEditorDOM.ts
var getEditorDOMFromHtmlString = (html) => {
  const node = document.createElement("body");
  node.innerHTML = html;
  const editorNode = node.querySelector('[data-slate-editor="true"]');
  return editorNode;
};

// src/lib/utils/getPluginNodeProps.ts
var getPluginNodeProps = ({
  attributes: nodeAttributes,
  node,
  plugin,
  props
}) => {
  const newProps = { ...props, attributes: { ...props.attributes } };
  if (plugin?.node.props) {
    const pluginNodeProps = (typeof plugin.node.props === "function" ? plugin.node.props(newProps) : plugin.node.props) ?? {};
    newProps.attributes = {
      ...newProps.attributes,
      ...pluginNodeProps
    };
  }
  if (nodeAttributes && plugin) {
    newProps.attributes = {
      ...newProps.attributes,
      ...pick(
        nodeAttributes,
        ...plugin.node.dangerouslyAllowAttributes ?? [],
        [...node ? getNodeDataAttributeKeys(node) : []]
      )
    };
  }
  Object.keys(newProps.attributes).forEach((key) => {
    if (newProps.attributes?.[key] === void 0) {
      delete newProps.attributes?.[key];
    }
  });
  return newProps;
};

// src/lib/utils/getSlateClass.ts
var getSlateClass = (type) => type ? `slate-${type}` : "";

// src/lib/utils/hotkeys.ts
import { IS_APPLE } from "@udecode/utils";
import { isKeyHotkey } from "is-hotkey";
import { isHotkey } from "is-hotkey";
var HOTKEYS = {
  bold: "mod+b",
  compose: ["down", "left", "right", "up", "backspace", "enter"],
  deleteBackward: "shift?+backspace",
  deleteForward: "shift?+delete",
  extendBackward: "shift+left",
  extendForward: "shift+right",
  insertSoftBreak: "shift+enter",
  italic: "mod+i",
  moveBackward: "left",
  moveForward: "right",
  moveWordBackward: "ctrl+left",
  moveWordForward: "ctrl+right",
  splitBlock: "enter",
  tab: "tab",
  undo: "mod+z",
  untab: "shift+tab"
};
var APPLE_HOTKEYS = {
  deleteBackward: ["ctrl+backspace", "ctrl+h"],
  deleteForward: ["ctrl+delete", "ctrl+d"],
  deleteLineBackward: "cmd+shift?+backspace",
  deleteLineForward: ["cmd+shift?+delete", "ctrl+k"],
  deleteWordBackward: "opt+shift?+backspace",
  deleteWordForward: "opt+shift?+delete",
  extendLineBackward: "opt+shift+up",
  extendLineForward: "opt+shift+down",
  moveLineBackward: "opt+up",
  moveLineForward: "opt+down",
  moveWordBackward: "opt+left",
  moveWordForward: "opt+right",
  redo: "cmd+shift+z",
  transposeCharacter: "ctrl+t"
};
var WINDOWS_HOTKEYS = {
  deleteWordBackward: "ctrl+shift?+backspace",
  deleteWordForward: "ctrl+shift?+delete",
  redo: ["ctrl+y", "ctrl+shift+z"]
};
var createHotkey = (key) => {
  const generic = HOTKEYS[key];
  const apple = APPLE_HOTKEYS[key];
  const windows = WINDOWS_HOTKEYS[key];
  const isGeneric = generic && isKeyHotkey(generic);
  const isApple = apple && isKeyHotkey(apple);
  const isWindows = windows && isKeyHotkey(windows);
  return (event) => {
    if (isGeneric?.(event)) return true;
    if (IS_APPLE && isApple?.(event)) return true;
    if (!IS_APPLE && isWindows?.(event)) return true;
    return false;
  };
};
var createComposing = (key) => (editor, event, {
  composing
} = {}) => {
  if (!createHotkey(key)(event)) return false;
  if (!!composing !== editor.api.isComposing()) return false;
  return true;
};
var Hotkeys = {
  isBold: createHotkey("bold"),
  isCompose: createHotkey("compose"),
  isDeleteBackward: createHotkey("deleteBackward"),
  isDeleteForward: createHotkey("deleteForward"),
  isDeleteLineBackward: createHotkey("deleteLineBackward"),
  isDeleteLineForward: createHotkey("deleteLineForward"),
  isDeleteWordBackward: createHotkey("deleteWordBackward"),
  isDeleteWordForward: createHotkey("deleteWordForward"),
  isExtendBackward: createHotkey("extendBackward"),
  isExtendForward: createHotkey("extendForward"),
  isExtendLineBackward: createHotkey("extendLineBackward"),
  isExtendLineForward: createHotkey("extendLineForward"),
  isItalic: createHotkey("italic"),
  isMoveBackward: createHotkey("moveBackward"),
  isMoveForward: createHotkey("moveForward"),
  isMoveLineBackward: createHotkey("moveLineBackward"),
  isMoveLineForward: createHotkey("moveLineForward"),
  isMoveWordBackward: createHotkey("moveWordBackward"),
  isMoveWordForward: createHotkey("moveWordForward"),
  isRedo: createHotkey("redo"),
  isSoftBreak: createHotkey("insertSoftBreak"),
  isSplitBlock: createHotkey("splitBlock"),
  isTab: createComposing("tab"),
  isTransposeCharacter: createHotkey("transposeCharacter"),
  isUndo: createHotkey("undo"),
  isUntab: createComposing("untab")
};

// src/lib/utils/isType.ts
import castArray from "lodash/castArray.js";
var isType = (editor, node, key) => {
  const keys = castArray(key);
  const types = [];
  keys.forEach((_key) => types.push(editor.getType({ key: _key })));
  return types.includes(node?.type);
};

// src/lib/utils/mergeDeepToNodes.ts
import merge3 from "lodash/merge.js";
var mergeDeepToNodes = (options) => {
  applyDeepToNodes({ ...options, apply: merge3 });
};

// src/lib/utils/normalizeDescendantsToDocumentFragment.ts
import {
  ElementApi as ElementApi4,
  TextApi as TextApi4
} from "@udecode/slate";

// src/lib/plugins/debug/DebugPlugin.ts
var PlateError = class extends Error {
  constructor(message, type = "DEFAULT") {
    super(`[${type}] ${message}`);
    this.type = type;
    this.name = "PlateError";
  }
};
var DebugPlugin = createTSlatePlugin({
  key: "debug",
  options: {
    isProduction: process.env.NODE_ENV === "production",
    logger: {
      error: (message, type, details) => console.error(`${type ? `[${type}] ` : ""}${message}`, details),
      info: (message, type, details) => console.info(`${type ? `[${type}] ` : ""}${message}`, details),
      log: (message, type, details) => console.log(`${type ? `[${type}] ` : ""}${message}`, details),
      warn: (message, type, details) => console.warn(`${type ? `[${type}] ` : ""}${message}`, details)
    },
    logLevel: process.env.NODE_ENV === "production" ? "error" : "log",
    throwErrors: true
  }
}).extendEditorApi(({ getOptions }) => {
  const logLevels = ["error", "warn", "info", "log"];
  const log = (level, message, type, details) => {
    if (process.env.NODE_ENV === "production") return;
    const options = getOptions();
    if (options.isProduction && level === "log") return;
    if (logLevels.indexOf(level) <= logLevels.indexOf(options.logLevel)) {
      if (level === "error" && options.throwErrors) {
        throw new PlateError(message, type);
      } else {
        options.logger[level]?.(message, type, details);
      }
    }
  };
  return {
    debug: {
      error: (message, type, details) => log("error", message, type, details),
      info: (message, type, details) => log("info", message, type, details),
      log: (message, type, details) => log("log", message, type, details),
      warn: (message, type, details) => log("warn", message, type, details)
    }
  };
});

// src/lib/plugins/dom/DOMPlugin.ts
import { bindFirst } from "@udecode/utils";

// src/lib/plugins/dom/withScrolling.ts
import isUndefined from "lodash/isUndefined.js";
import omitBy from "lodash/omitBy.js";
var withScrolling = (editor, fn, options) => {
  const prevOptions = editor.getOptions(DOMPlugin);
  const prevAutoScroll = AUTO_SCROLL.get(editor) ?? false;
  if (options) {
    const ops = {
      ...prevOptions,
      ...omitBy(options, isUndefined)
    };
    editor.setOptions(DOMPlugin, ops);
  }
  AUTO_SCROLL.set(editor, true);
  fn();
  AUTO_SCROLL.set(editor, prevAutoScroll);
  editor.setOptions(DOMPlugin, prevOptions);
};

// src/lib/plugins/dom/DOMPlugin.ts
var AUTO_SCROLL = /* @__PURE__ */ new WeakMap();
var DOMPlugin = createTSlatePlugin({
  key: "dom",
  options: {
    scrollMode: "last",
    scrollOperations: {
      insert_node: true,
      insert_text: true
    },
    scrollOptions: {
      scrollMode: "if-needed"
    }
  }
}).extendEditorApi(({ editor }) => ({
  isScrolling: () => {
    return AUTO_SCROLL.get(editor) ?? false;
  }
})).extendEditorTransforms(({ editor }) => ({
  withScrolling: bindFirst(withScrolling, editor)
})).overrideEditor(({ api, editor, getOption, tf: { apply } }) => ({
  transforms: {
    apply(operation) {
      if (api.isScrolling()) {
        apply(operation);
        const scrollOperations = getOption("scrollOperations");
        if (!scrollOperations[operation.type]) return;
        const matched = editor.operations.filter(
          (op) => !!scrollOperations[op.type]
        );
        if (matched.length === 0) return;
        const mode = getOption("scrollMode");
        const targetOp = mode === "first" ? matched[0] : matched.at(-1);
        if (!targetOp) return;
        const { offset, path } = targetOp.path ? targetOp : {};
        if (!path) return;
        const scrollOptions = getOption("scrollOptions");
        const scrollTarget = {
          offset: offset ?? 0,
          path
        };
        api.scrollIntoView(scrollTarget, scrollOptions);
        return;
      }
      return apply(operation);
    }
  }
}));

// src/lib/plugins/html/HtmlPlugin.ts
import { bindFirst as bindFirst2 } from "@udecode/utils";

// src/lib/plugins/html/constants.ts
var CARRIAGE_RETURN = "\r";
var LINE_FEED = "\n";
var NO_BREAK_SPACE = "\xA0";
var SPACE = " ";
var TAB = "	";
var ZERO_WIDTH_SPACE = "\u200B";

// src/lib/plugins/html/utils/isHtmlElement.ts
var isHtmlElement = (node) => node.nodeType === Node.ELEMENT_NODE;

// src/lib/plugins/html/utils/traverseHtmlNode.ts
var traverseHtmlNode = (node, callback) => {
  const keepTraversing = callback(node);
  if (!keepTraversing) {
    return;
  }
  let child = node.firstChild;
  while (child) {
    const currentChild = child;
    const previousChild = child.previousSibling;
    child = child.nextSibling;
    traverseHtmlNode(currentChild, callback);
    if (
      // An unwrap was made. Need to compute the next child again.
      !currentChild.previousSibling && !currentChild.nextSibling && !currentChild.parentNode && child && previousChild !== child.previousSibling && child.parentNode
    ) {
      child = previousChild ? previousChild.nextSibling : node.firstChild;
    } else if (
      // A list was created. Need to compute the next child again.
      !currentChild.previousSibling && !currentChild.nextSibling && !currentChild.parentNode && child && !child.previousSibling && !child.nextSibling && !child.parentNode
    ) {
      if (previousChild) {
        child = previousChild.nextSibling ? previousChild.nextSibling.nextSibling : null;
      } else if (node.firstChild) {
        child = node.firstChild.nextSibling;
      }
    }
  }
};

// src/lib/plugins/html/utils/traverseHtmlElements.ts
var traverseHtmlElements = (rootNode, callback) => {
  traverseHtmlNode(rootNode, (node) => {
    if (!isHtmlElement(node)) {
      return true;
    }
    return callback(node);
  });
};

// src/lib/plugins/html/utils/cleanHtmlBrElements.ts
var cleanHtmlBrElements = (rootNode) => {
  traverseHtmlElements(rootNode, (element) => {
    if (element.tagName !== "BR") {
      return true;
    }
    const replacementTextNode = document.createTextNode(LINE_FEED);
    if (element.parentElement) {
      element.parentElement.replaceChild(replacementTextNode, element);
    }
    return false;
  });
};

// src/lib/plugins/html/utils/cleanHtmlCrLf.ts
var cleanHtmlCrLf = (html) => {
  return html.replaceAll(/\r\n|\r/g, "\n");
};

// src/lib/plugins/html/utils/cleanHtmlEmptyElements.ts
var ALLOWED_EMPTY_ELEMENTS = /* @__PURE__ */ new Set(["BR", "IMG", "TD", "TH"]);
var isEmpty = (element) => {
  return !ALLOWED_EMPTY_ELEMENTS.has(element.nodeName) && !element.innerHTML.trim();
};
var removeIfEmpty = (element) => {
  if (isEmpty(element)) {
    const { parentElement } = element;
    element.remove();
    if (parentElement) {
      removeIfEmpty(parentElement);
    }
  }
};
var cleanHtmlEmptyElements = (rootNode) => {
  traverseHtmlElements(rootNode, (element) => {
    removeIfEmpty(element);
    return true;
  });
};

// src/lib/plugins/html/utils/replaceTagName.ts
var replaceTagName = (element, tagName) => {
  const newElement = document.createElement(tagName);
  newElement.innerHTML = element.innerHTML;
  for (const { name } of element.attributes) {
    const value = element.getAttribute(name);
    if (value) {
      newElement.setAttribute(name, value);
    }
  }
  if (element.parentNode) {
    element.parentNode.replaceChild(newElement, element);
  }
  return newElement;
};

// src/lib/plugins/html/utils/cleanHtmlFontElements.ts
var cleanHtmlFontElements = (rootNode) => {
  traverseHtmlElements(rootNode, (element) => {
    if (element.tagName === "FONT") {
      if (element.textContent) {
        replaceTagName(element, "span");
      } else {
        element.remove();
      }
    }
    return true;
  });
};

// src/lib/plugins/html/utils/isHtmlFragmentHref.ts
var isHtmlFragmentHref = (href) => href.startsWith("#");

// src/lib/plugins/html/utils/unwrapHtmlElement.ts
var unwrapHtmlElement = (element) => {
  element.outerHTML = element.innerHTML;
};

// src/lib/plugins/html/utils/cleanHtmlLinkElements.ts
var cleanHtmlLinkElements = (rootNode) => {
  traverseHtmlElements(rootNode, (element) => {
    if (element.tagName !== "A") {
      return true;
    }
    const href = element.getAttribute("href");
    if (!href || isHtmlFragmentHref(href)) {
      unwrapHtmlElement(element);
    }
    if (href && element.querySelector("img")) {
      for (const span of element.querySelectorAll("span")) {
        if (!span.textContent) {
          unwrapHtmlElement(span);
        }
      }
    }
    return true;
  });
};

// src/lib/plugins/html/utils/isHtmlText.ts
var isHtmlText = (node) => node.nodeType === Node.TEXT_NODE;

// src/lib/plugins/html/utils/traverseHtmlTexts.ts
var traverseHtmlTexts = (rootNode, callback) => {
  traverseHtmlNode(rootNode, (node) => {
    if (!isHtmlText(node)) {
      return true;
    }
    return callback(node);
  });
};

// src/lib/plugins/html/utils/cleanHtmlTextNodes.ts
var cleanHtmlTextNodes = (rootNode) => {
  traverseHtmlTexts(rootNode, (textNode) => {
    if (/^\n\s*$/.test(textNode.data) && (textNode.previousElementSibling || textNode.nextElementSibling)) {
      textNode.remove();
      return true;
    }
    textNode.data = textNode.data.replaceAll(/\n\s*/g, "\n");
    if (textNode.data.includes(CARRIAGE_RETURN) || textNode.data.includes(LINE_FEED) || textNode.data.includes(NO_BREAK_SPACE)) {
      const hasSpace = textNode.data.includes(SPACE);
      const hasNonWhitespace = /\S/.test(textNode.data);
      const hasLineFeed = textNode.data.includes(LINE_FEED);
      if (!(hasSpace || hasNonWhitespace) && !hasLineFeed) {
        if (textNode.data === NO_BREAK_SPACE) {
          textNode.data = SPACE;
          return true;
        }
        textNode.remove();
        return true;
      }
      if (textNode.previousSibling && textNode.previousSibling.nodeName === "BR" && textNode.parentElement) {
        textNode.previousSibling.remove();
        const matches = /^[\n\r]+/.exec(textNode.data);
        const offset = matches ? matches[0].length : 0;
        textNode.data = textNode.data.slice(Math.max(0, offset)).replaceAll(new RegExp(LINE_FEED, "g"), SPACE).replaceAll(new RegExp(CARRIAGE_RETURN, "g"), SPACE);
        textNode.data = `
${textNode.data}`;
      } else {
        textNode.data = textNode.data.replaceAll(new RegExp(LINE_FEED, "g"), SPACE).replaceAll(new RegExp(CARRIAGE_RETURN, "g"), SPACE);
      }
    }
    return true;
  });
};

// src/lib/plugins/html/utils/inlineTagNames.ts
var inlineTagNames = /* @__PURE__ */ new Set([
  "A",
  "ABBR",
  "ACRONYM",
  "B",
  "BDI",
  "BDO",
  "BIG",
  "BR",
  "BUTTON",
  "CANVAS",
  "CITE",
  "CODE",
  "CONTENT",
  "DATA",
  "DEL",
  "DFN",
  "EM",
  "EMBED",
  "FONT",
  "I",
  "IFRAME",
  "IMG",
  "IMG",
  "INPUT",
  "INS",
  "KBD",
  "LABEL",
  "MAP",
  "MARK",
  "MARQUEE",
  "math",
  "MENUITEM",
  "METER",
  "NOBR",
  "OBJECT",
  "OUTPUT",
  "PICTURE",
  "PORTAL",
  "PROGRESS",
  "Q",
  "S",
  "SAMP",
  "SELECT",
  "SHADOW",
  "SMALL",
  "SOURCE",
  "SPAN",
  "STRIKE",
  "STRONG",
  "SUB",
  "SUP",
  "svg",
  "TEXTAREA",
  "TIME",
  "TRACK",
  "TT",
  "U",
  "VAR",
  "VIDEO",
  "WBR"
]);

// src/lib/plugins/html/utils/isHtmlInlineElement.ts
var isHtmlInlineElement = (node) => {
  if (!isHtmlElement(node)) return false;
  const element = node;
  const tagNameIsInline = inlineTagNames.has(element.tagName);
  const displayProperty = element.style.display.split(" ")[0];
  if (displayProperty === "") {
    return tagNameIsInline;
  }
  if (displayProperty.startsWith("inline")) {
    return true;
  }
  if (displayProperty === "inherit" && element.parentElement) {
    return isHtmlInlineElement(element.parentElement);
  }
  if (["contents", "initial", "none", "revert", "revert-layer", "unset"].includes(
    displayProperty
  )) {
    return tagNameIsInline;
  }
  return false;
};

// src/lib/plugins/html/utils/isHtmlBlockElement.ts
var isHtmlBlockElement = (node) => {
  if (!isHtmlElement(node)) return false;
  const element = node;
  return !isHtmlInlineElement(element);
};

// src/lib/plugins/html/utils/isHtmlTable.ts
var isHtmlTable = (element) => element.nodeName === "TABLE";

// src/lib/plugins/html/utils/copyBlockMarksToSpanChild.ts
var copyBlockMarksToSpanChild = (rootNode) => {
  traverseHtmlElements(rootNode, (element) => {
    const el = element;
    const styleAttribute = element.getAttribute("style");
    if (!styleAttribute) return true;
    if (isHtmlBlockElement(el) && !isHtmlTable(el)) {
      const {
        style: {
          backgroundColor,
          color,
          fontFamily,
          fontSize,
          fontStyle,
          fontWeight,
          textDecoration
        }
      } = el;
      if (backgroundColor || color || fontFamily || fontSize || fontStyle || fontWeight || textDecoration) {
        const span = document.createElement("span");
        if (!["inherit", "initial"].includes(color)) {
          span.style.color = color;
        }
        span.style.fontFamily = fontFamily;
        span.style.fontSize = fontSize;
        if (!["inherit", "initial", "normal"].includes(color)) {
          span.style.fontStyle = fontStyle;
        }
        if (![400, "normal"].includes(fontWeight)) {
          span.style.fontWeight = fontWeight;
        }
        span.style.textDecoration = textDecoration;
        span.innerHTML = el.innerHTML;
        element.innerHTML = span.outerHTML;
      }
    }
    return true;
  });
};

// src/lib/plugins/html/utils/collapse-white-space/collapseString.ts
var collapseString = (text, {
  shouldCollapseWhiteSpace = true,
  trimEnd = "collapse",
  trimStart = "collapse",
  whiteSpaceIncludesNewlines = true
} = {}) => {
  if (trimStart === "all") {
    text = text.replace(/^\s+/, "");
  }
  if (trimEnd === "single-newline") {
    text = text.replace(/\n$/, "");
  }
  if (shouldCollapseWhiteSpace) {
    if (whiteSpaceIncludesNewlines) {
      text = text.replaceAll(/\s+/g, " ");
    } else {
      text = text.replaceAll(/[^\S\n\r]+/g, " ");
      text = text.replaceAll(/^[^\S\n\r]+/gm, "");
      text = text.replaceAll(/[^\S\n\r]+$/gm, "");
    }
  }
  return text;
};

// src/lib/plugins/html/utils/collapse-white-space/isLastNonEmptyTextOfInlineFormattingContext.ts
var isLastNonEmptyTextOfInlineFormattingContext = (initialText) => {
  let currentNode = initialText;
  while (true) {
    if (currentNode.nextSibling) {
      currentNode = currentNode.nextSibling;
    } else {
      currentNode = currentNode.parentElement;
      if (currentNode && isHtmlBlockElement(currentNode)) {
        return true;
      }
      currentNode = currentNode?.nextSibling || null;
    }
    if (!currentNode) {
      return true;
    }
    if (isHtmlBlockElement(currentNode)) {
      return true;
    }
    if ((currentNode.textContent || "").length > 0) {
      return false;
    }
  }
};

// src/lib/plugins/html/utils/collapse-white-space/stateTransforms.ts
var upsertInlineFormattingContext = (state) => {
  if (state.inlineFormattingContext) {
    state.inlineFormattingContext.atStart = false;
  } else {
    state.inlineFormattingContext = {
      atStart: true,
      lastHasTrailingWhiteSpace: false
    };
  }
};
var endInlineFormattingContext = (state) => {
  state.inlineFormattingContext = null;
};

// src/lib/plugins/html/utils/collapse-white-space/collapseWhiteSpaceText.ts
var collapseWhiteSpaceText = (text, state) => {
  const textContent = text.textContent || "";
  const isWhiteSpaceOnly = textContent.trim() === "";
  if (state.inlineFormattingContext || !isWhiteSpaceOnly) {
    upsertInlineFormattingContext(state);
  }
  const { whiteSpaceRule } = state;
  const trimStart = (() => {
    if (whiteSpaceRule !== "normal") return "collapse";
    if (!state.inlineFormattingContext || state.inlineFormattingContext.atStart || state.inlineFormattingContext.lastHasTrailingWhiteSpace)
      return "all";
    return "collapse";
  })();
  const trimEnd = (() => {
    if (whiteSpaceRule === "normal") return "collapse";
    if (isLastNonEmptyTextOfInlineFormattingContext(text))
      return "single-newline";
    return "collapse";
  })();
  const shouldCollapseWhiteSpace = {
    normal: true,
    pre: false,
    "pre-line": true
  }[whiteSpaceRule];
  const whiteSpaceIncludesNewlines = whiteSpaceRule !== "pre-line";
  const collapsedTextContent = collapseString(textContent || "", {
    shouldCollapseWhiteSpace,
    trimEnd,
    trimStart,
    whiteSpaceIncludesNewlines
  });
  if (state.inlineFormattingContext && shouldCollapseWhiteSpace) {
    state.inlineFormattingContext.lastHasTrailingWhiteSpace = collapsedTextContent.endsWith(" ");
  }
  text.textContent = collapsedTextContent;
};

// src/lib/plugins/html/utils/collapse-white-space/collapseWhiteSpaceNode.ts
var collapseWhiteSpaceNode = (node, state) => {
  if (isHtmlElement(node)) {
    collapseWhiteSpaceElement(node, state);
    return;
  }
  if (isHtmlText(node)) {
    collapseWhiteSpaceText(node, state);
    return;
  }
  collapseWhiteSpaceChildren(node, state);
};

// src/lib/plugins/html/utils/collapse-white-space/collapseWhiteSpaceChildren.ts
var collapseWhiteSpaceChildren = (node, state) => {
  const childNodes = Array.from(node.childNodes);
  for (const childNode of childNodes) {
    collapseWhiteSpaceNode(childNode, state);
  }
};

// src/lib/plugins/html/utils/collapse-white-space/inferWhiteSpaceRule.ts
var inferWhiteSpaceRule = (element) => {
  const whiteSpaceProperty = element.style.whiteSpace;
  switch (whiteSpaceProperty) {
    case "break-spaces":
    case "pre":
    case "pre-wrap": {
      return "pre";
    }
    case "normal":
    case "nowrap": {
      return "normal";
    }
    case "pre-line": {
      return "pre-line";
    }
  }
  if (element.tagName === "PRE") {
    return "pre";
  }
  if (whiteSpaceProperty === "initial") {
    return "normal";
  }
  return null;
};

// src/lib/plugins/html/utils/collapse-white-space/collapseWhiteSpaceElement.ts
var collapseWhiteSpaceElement = (element, state) => {
  const isInlineElement = isHtmlInlineElement(element);
  const previousWhiteSpaceRule = state.whiteSpaceRule;
  const inferredWhiteSpaceRule = inferWhiteSpaceRule(element);
  if (inferredWhiteSpaceRule) {
    state.whiteSpaceRule = inferredWhiteSpaceRule;
  }
  if (!isInlineElement) {
    endInlineFormattingContext(state);
  }
  collapseWhiteSpaceChildren(element, state);
  if (!isInlineElement) {
    endInlineFormattingContext(state);
  }
  state.whiteSpaceRule = previousWhiteSpaceRule;
};

// src/lib/plugins/html/utils/collapse-white-space/collapseWhiteSpace.ts
var collapseWhiteSpace = (element) => {
  const clonedElement = element.cloneNode(true);
  const state = {
    inlineFormattingContext: null,
    whiteSpaceRule: "normal"
  };
  collapseWhiteSpaceElement(clonedElement, state);
  return clonedElement;
};

// src/lib/plugins/html/utils/htmlBodyToFragment.ts
import { jsx } from "slate-hyperscript";

// src/lib/plugins/html/utils/deserializeHtmlNodeChildren.ts
var deserializeHtmlNodeChildren = (editor, node, isSlateParent = false) => {
  return Array.from(node.childNodes).flatMap((child) => {
    if (child.nodeType === 1 && !isSlateNode(child) && isSlateParent) {
      return deserializeHtmlNodeChildren(
        editor,
        child,
        isSlateParent
      );
    }
    return deserializeHtmlNode(editor)(child);
  });
};

// src/lib/plugins/html/utils/htmlBodyToFragment.ts
var htmlBodyToFragment = (editor, element) => {
  if (element.nodeName === "BODY") {
    return jsx(
      "fragment",
      {},
      deserializeHtmlNodeChildren(editor, element)
    );
  }
};

// src/lib/plugins/html/utils/htmlBrToNewLine.ts
var htmlBrToNewLine = (node) => {
  if (node.nodeName === "BR") {
    return "\n";
  }
};

// src/lib/plugins/html/utils/htmlElementToElement.ts
import { jsx as jsx2 } from "slate-hyperscript";

// src/lib/plugins/html/utils/pluginDeserializeHtml.ts
import { isDefined as isDefined4 } from "@udecode/utils";
import castArray2 from "lodash/castArray.js";

// src/lib/plugins/html/utils/getDataNodeProps.ts
var getDefaultNodeProps = ({
  element,
  type
}) => {
  if (!isSlatePluginNode(element, type) && !isSlateLeaf(element)) return;
  const dataAttributes = {};
  Object.entries(element.dataset).forEach(([key, value]) => {
    if (key.startsWith("slate") && value && // Ignore slate default attributes
    !["slateInline", "slateLeaf", "slateNode", "slateVoid"].includes(key)) {
      const attributeKey = key.slice(5).charAt(0).toLowerCase() + key.slice(6);
      if (value === void 0) return;
      let parsedValue = value;
      if (value === "true") parsedValue = true;
      else if (value === "false") parsedValue = false;
      else if (!Number.isNaN(Number(value))) parsedValue = Number(value);
      dataAttributes[attributeKey] = parsedValue;
    }
  });
  if (Object.keys(dataAttributes).length > 0) {
    return dataAttributes;
  }
};
var getDataNodeProps = ({
  editor,
  element,
  plugin
}) => {
  const toNodeProps = plugin.parsers.html?.deserializer?.toNodeProps;
  const disableDefaultNodeProps = plugin.parsers.html?.deserializer?.disableDefaultNodeProps ?? false;
  const defaultNodeProps = disableDefaultNodeProps ? {} : getDefaultNodeProps({
    ...getEditorPlugin(editor, plugin),
    element
  });
  if (!toNodeProps) return defaultNodeProps;
  const customNodeProps = toNodeProps({
    ...getEditorPlugin(editor, plugin),
    element
  }) ?? {};
  return {
    ...defaultNodeProps,
    ...customNodeProps
  };
};

// src/lib/plugins/html/utils/pluginDeserializeHtml.ts
var getDeserializedWithStaticRules = (plugin) => {
  let deserializer = plugin.parsers?.html?.deserializer;
  const rules = deserializer?.rules ?? [];
  const hasSlateRule = rules.some(
    (rule) => rule.validClassName?.includes(`slate-${plugin.key}`)
  );
  const staticRules = hasSlateRule ? rules : [
    {
      validClassName: `slate-${plugin.key}`,
      validNodeName: "*"
    },
    ...rules
  ];
  if (!deserializer) deserializer = { rules: staticRules };
  deserializer.rules = staticRules;
  return deserializer;
};
var pluginDeserializeHtml = (editor, plugin, {
  deserializeLeaf,
  element: el
}) => {
  const {
    node: { isElement: isElementRoot, isLeaf: isLeafRoot }
  } = plugin;
  const deserializer = getDeserializedWithStaticRules(plugin);
  if (!deserializer) return;
  const {
    attributeNames,
    isElement: isElementRule,
    isLeaf: isLeafRule,
    query,
    rules
  } = deserializer;
  let { parse } = deserializer;
  const isElement = isElementRule || isElementRoot;
  const isLeaf = isLeafRule || isLeafRoot;
  if (!deserializeLeaf && !isElement) {
    return;
  }
  if (deserializeLeaf && !isLeaf) {
    return;
  }
  if (rules) {
    const isValid = rules.some(
      ({ validAttribute, validClassName, validNodeName = "*", validStyle }) => {
        if (validNodeName) {
          const validNodeNames = castArray2(validNodeName);
          if (validNodeNames.length > 0 && !validNodeNames.includes(el.nodeName) && validNodeName !== "*")
            return false;
        }
        if (validClassName && !el.classList.contains(validClassName))
          return false;
        if (validStyle) {
          for (const [key, value] of Object.entries(validStyle)) {
            const values = castArray2(value);
            if (!values.includes(el.style[key]) && value !== "*")
              return;
            if (value === "*" && !el.style[key]) return;
            const defaultNodeValue = plugin.inject.nodeProps?.defaultNodeValue;
            if (defaultNodeValue && defaultNodeValue === el.style[key]) {
              return false;
            }
          }
        }
        if (validAttribute) {
          if (typeof validAttribute === "string") {
            if (!el.getAttributeNames().includes(validAttribute)) return false;
          } else {
            for (const [attributeName, attributeValue] of Object.entries(
              validAttribute
            )) {
              const attributeValues = castArray2(attributeValue);
              const elAttribute = el.getAttribute(attributeName);
              if (!isDefined4(elAttribute) || !attributeValues.includes(elAttribute))
                return false;
            }
          }
        }
        return true;
      }
    );
    if (!isValid) return;
  }
  if (query && !query({ ...getEditorPlugin(editor, plugin), element: el })) {
    return;
  }
  if (!parse)
    if (isElement) {
      parse = ({ type }) => ({ type });
    } else if (isLeaf) {
      parse = ({ type }) => ({ [type]: true });
    } else {
      return;
    }
  const parsedNode = (() => {
    if (isSlateNode(el)) {
      return {};
    }
    return parse({
      ...getEditorPlugin(editor, plugin),
      element: el,
      node: {}
    }) ?? {};
  })();
  const dataNodeProps = getDataNodeProps({
    editor,
    element: el,
    plugin
  });
  let node = {
    ...parsedNode,
    ...dataNodeProps
  };
  if (Object.keys(node).length === 0) return;
  const injectedPlugins = getInjectedPlugins(editor, plugin);
  injectedPlugins.forEach((injectedPlugin) => {
    const res = injectedPlugin.parsers?.html?.deserializer?.parse?.({
      ...getEditorPlugin(editor, plugin),
      element: el,
      node
    });
    if (res && !isSlateNode(el)) {
      node = {
        ...node,
        ...res
      };
    }
  });
  if (attributeNames) {
    const elementAttributes = {};
    const elementAttributeNames = el.getAttributeNames();
    for (const elementAttributeName of elementAttributeNames) {
      if (attributeNames.includes(elementAttributeName)) {
        elementAttributes[elementAttributeName] = el.getAttribute(elementAttributeName);
      }
    }
    if (Object.keys(elementAttributes).length > 0) {
      node.attributes = elementAttributes;
    }
  }
  return { ...deserializer, node };
};

// src/lib/plugins/html/utils/pipeDeserializeHtmlElement.ts
var pipeDeserializeHtmlElement = (editor, element) => {
  let result;
  [...editor.pluginList].reverse().some((plugin) => {
    result = pluginDeserializeHtml(editor, plugin, { element });
    return !!result;
  });
  return result;
};

// src/lib/plugins/html/utils/htmlElementToElement.ts
var htmlElementToElement = (editor, element, isSlate = false) => {
  const deserialized = pipeDeserializeHtmlElement(editor, element);
  if (deserialized) {
    const { node, withoutChildren } = deserialized;
    let descendants = node.children ?? deserializeHtmlNodeChildren(editor, element, isSlate);
    if (descendants.length === 0 || withoutChildren || isSlateVoid(element)) {
      descendants = [{ text: "" }];
    }
    return jsx2("element", node, descendants);
  }
};

// src/lib/plugins/html/utils/htmlElementToLeaf.ts
import { ElementApi as ElementApi3, TextApi as TextApi3 } from "@udecode/slate";
import { jsx as jsx3 } from "slate-hyperscript";

// src/lib/plugins/html/utils/pipeDeserializeHtmlLeaf.ts
var pipeDeserializeHtmlLeaf = (editor, element) => {
  let node = {};
  [...editor.pluginList].reverse().forEach((plugin) => {
    const deserialized = pluginDeserializeHtml(editor, plugin, {
      deserializeLeaf: true,
      element
    });
    if (!deserialized) return;
    node = { ...node, ...deserialized.node };
  });
  return node;
};

// src/lib/plugins/html/utils/htmlElementToLeaf.ts
var htmlElementToLeaf = (editor, element) => {
  const node = pipeDeserializeHtmlLeaf(editor, element);
  return deserializeHtmlNodeChildren(editor, element).reduce(
    (arr, child) => {
      if (!child) return arr;
      if (ElementApi3.isElement(child)) {
        if (Object.keys(node).length > 0) {
          mergeDeepToNodes({
            node: child,
            query: {
              filter: ([n]) => TextApi3.isText(n)
            },
            source: node
          });
        }
        arr.push(child);
      } else {
        const attributes = { ...node };
        if (TextApi3.isText(child) && child.text) {
          Object.keys(attributes).forEach((key) => {
            if (attributes[key] && child[key]) {
              attributes[key] = child[key];
            }
          });
        }
        arr.push(jsx3("text", attributes, child));
      }
      return arr;
    },
    []
  );
};

// src/lib/plugins/html/utils/htmlTextNodeToString.ts
var htmlTextNodeToString = (node) => {
  if (isHtmlText(node)) {
    if (node.parentElement?.dataset.platePreventDeserialization) return "";
    return node.textContent || "";
  }
};

// src/lib/plugins/html/utils/deserializeHtmlNode.ts
var deserializeHtmlNode = (editor) => (node) => {
  const textNode = htmlTextNodeToString(node);
  if (textNode) return textNode;
  if (!isHtmlElement(node)) return null;
  const breakLine = htmlBrToNewLine(node);
  if (breakLine) return breakLine;
  const fragment = htmlBodyToFragment(editor, node);
  if (fragment) return fragment;
  const element = htmlElementToElement(
    editor,
    node,
    isSlateNode(node)
  );
  if (element) return element;
  return htmlElementToLeaf(editor, node);
};

// src/lib/plugins/html/utils/deserializeHtmlElement.ts
var deserializeHtmlElement = (editor, element) => {
  return deserializeHtmlNode(editor)(element);
};

// src/lib/plugins/html/utils/htmlStringToDOMNode.ts
var htmlStringToDOMNode = (rawHtml) => {
  const node = document.createElement("body");
  node.innerHTML = rawHtml;
  return node;
};

// src/lib/plugins/html/utils/deserializeHtml.ts
var deserializeHtml = (editor, {
  collapseWhiteSpace: shouldCollapseWhiteSpace = true,
  defaultElementPlugin,
  element
}) => {
  if (typeof element === "string") {
    element = htmlStringToDOMNode(element);
  }
  if (shouldCollapseWhiteSpace) {
    element = collapseWhiteSpace(element);
  }
  const fragment = deserializeHtmlElement(editor, element);
  return normalizeDescendantsToDocumentFragment(editor, {
    defaultElementPlugin,
    descendants: fragment
  });
};

// src/lib/plugins/html/utils/findHtmlElement.ts
var findHtmlElement = (rootNode, predicate) => {
  let res = null;
  traverseHtmlElements(rootNode, (node) => {
    if (predicate(node)) {
      res = node;
      return false;
    }
    return true;
  });
  return res;
};
var someHtmlElement = (rootNode, predicate) => {
  return !!findHtmlElement(rootNode, predicate);
};

// src/lib/plugins/html/utils/getHtmlComments.ts
var acceptNode = () => NodeFilter.FILTER_ACCEPT;
var getHtmlComments = (node) => {
  const comments = [];
  const iterator = document.createNodeIterator(node, NodeFilter.SHOW_COMMENT, {
    acceptNode
  });
  let currentNode = iterator.nextNode();
  while (currentNode) {
    if (currentNode.nodeValue) {
      comments.push(currentNode.nodeValue);
    }
    currentNode = iterator.nextNode();
  }
  return comments;
};

// src/lib/plugins/html/utils/isHtmlComment.ts
var isHtmlComment = (node) => node.nodeType === Node.COMMENT_NODE;

// src/lib/plugins/html/utils/isOlSymbol.ts
var isOlSymbol = (symbol) => {
  return /[\da-np-z]\S/.test(symbol.toLowerCase());
};

// src/lib/plugins/html/utils/parseHtmlDocument.ts
var parseHtmlDocument = (html) => {
  return new DOMParser().parseFromString(html, "text/html");
};

// src/lib/plugins/html/utils/parseHtmlElement.ts
var parseHtmlElement = (html) => {
  const { body } = parseHtmlDocument(html);
  return body.firstElementChild;
};

// src/lib/plugins/html/utils/postCleanHtml.ts
var postCleanHtml = (html) => {
  const cleanHtml = html.trim().replaceAll(new RegExp(ZERO_WIDTH_SPACE, "g"), "");
  return `<body>${cleanHtml}</body>`;
};

// src/lib/plugins/html/utils/removeHtmlSurroundings.ts
var removeBeforeHtml = (html) => {
  const index = html.indexOf("<html");
  if (index === -1) {
    return html;
  }
  return html.slice(Math.max(0, index));
};
var removeAfterHtml = (html) => {
  const index = html.lastIndexOf("</html>");
  if (index === -1) {
    return html;
  }
  return html.slice(0, Math.max(0, index + "</html>".length));
};
var removeHtmlSurroundings = (html) => {
  return removeBeforeHtml(removeAfterHtml(html));
};

// src/lib/plugins/html/utils/preCleanHtml.ts
var cleaners = [removeHtmlSurroundings, cleanHtmlCrLf];
var preCleanHtml = (html) => {
  return cleaners.reduce((result, clean) => clean(result), html);
};

// src/lib/plugins/html/utils/traverseHtmlComments.ts
var traverseHtmlComments = (rootNode, callback) => {
  traverseHtmlNode(rootNode, (node) => {
    if (!isHtmlComment(node)) {
      return true;
    }
    return callback(node);
  });
};

// src/lib/plugins/html/utils/removeHtmlNodesBetweenComments.ts
var removeHtmlNodesBetweenComments = (rootNode, start, end) => {
  const isClosingComment = (node) => isHtmlComment(node) && node.data === end;
  traverseHtmlComments(rootNode, (comment) => {
    if (comment.data === start) {
      let node = comment.nextSibling;
      comment.remove();
      while (node && !isClosingComment(node)) {
        const { nextSibling } = node;
        node.remove();
        node = nextSibling;
      }
      if (node && isClosingComment(node)) {
        node.remove();
      }
    }
    return true;
  });
};

// src/lib/plugins/html/HtmlPlugin.ts
var HtmlPlugin = createSlatePlugin({
  key: "html"
}).extendApi(({ editor }) => ({
  deserialize: bindFirst2(deserializeHtml, editor)
})).extend({
  parser: {
    format: "text/html",
    deserialize: ({ api, data }) => {
      const document2 = parseHtmlDocument(data);
      return api.html.deserialize({
        element: document2.body
      });
    }
  }
});

// src/lib/plugins/length/LengthPlugin.ts
var LengthPlugin = createTSlatePlugin({
  key: "length"
}).overrideEditor(({ editor, getOptions, tf: { apply } }) => ({
  transforms: {
    apply(operation) {
      editor.tf.withoutNormalizing(() => {
        apply(operation);
        const options = getOptions();
        if (options.maxLength) {
          const length = editor.api.string([]).length;
          if (length > options.maxLength) {
            const overflowLength = length - options.maxLength;
            editor.tf.delete({
              distance: overflowLength,
              reverse: true,
              unit: "character"
            });
          }
        }
      });
    }
  }
}));

// src/lib/plugins/paragraph/BaseParagraphPlugin.ts
var BaseParagraphPlugin = createSlatePlugin({
  key: "p",
  node: {
    isElement: true
  },
  parsers: {
    html: {
      deserializer: {
        rules: [
          {
            validNodeName: "P"
          }
        ],
        query: ({ element }) => element.style.fontFamily !== "Consolas"
      }
    }
  }
});

// src/internal/plugin/pipeNormalizeInitialValue.ts
var pipeNormalizeInitialValue = (editor) => {
  editor.pluginList.forEach((p) => {
    p.normalizeInitialValue?.({
      ...getEditorPlugin(editor, p),
      value: editor.children
    });
  });
};

// src/lib/plugins/slate-extension/SlateExtensionPlugin.ts
var SlateExtensionPlugin = createSlatePlugin({
  key: "slateExtension"
}).overrideEditor(
  ({
    editor,
    tf: { apply, deleteBackward, deleteForward, deleteFragment }
  }) => {
    const resetMarks = () => {
      if (editor.api.isAt({ start: true })) {
        editor.tf.removeMarks();
      }
    };
    return {
      api: {
        create: {
          block: (node) => ({
            children: [{ text: "" }],
            type: editor.getType(BaseParagraphPlugin),
            ...node
          })
        }
      },
      transforms: {
        apply(operation) {
          if (operation.type === "set_selection") {
            const { properties } = operation;
            editor.prevSelection = properties;
            apply(operation);
            editor.currentKeyboardEvent = null;
            return;
          }
          apply(operation);
        },
        deleteBackward(unit) {
          deleteBackward(unit);
          resetMarks();
        },
        deleteForward(unit) {
          deleteForward(unit);
          resetMarks();
        },
        deleteFragment(options) {
          deleteFragment(options);
          resetMarks();
        }
      }
    };
  }
).extendEditorTransforms(({ editor }) => ({
  /**
   * Initialize the editor value, selection and normalization. Set `value` to
   * `null` to skip children initialization.
   */
  async init({
    autoSelect,
    selection,
    shouldNormalizeEditor,
    value
  }) {
    if (value !== null) {
      if (typeof value === "string") {
        editor.children = editor.api.html.deserialize({
          element: value
        });
      } else if (typeof value === "function") {
        editor.children = await value(editor);
      } else if (value) {
        editor.children = value;
      }
      if (!editor.children || editor.children?.length === 0) {
        editor.children = editor.api.create.value();
      }
    }
    if (selection) {
      editor.selection = selection;
    } else if (autoSelect) {
      const edge = autoSelect === "start" ? "start" : "end";
      const target = edge === "start" ? editor.api.start([]) : editor.api.end([]);
      editor.tf.select(target);
    }
    if (editor.children.length > 0) {
      pipeNormalizeInitialValue(editor);
    }
    if (shouldNormalizeEditor) {
      editor.tf.normalize({ force: true });
    }
  },
  setValue: (value) => {
    let children = value;
    if (typeof value === "string") {
      children = editor.api.html.deserialize({
        element: value
      });
    } else if (!value || value.length === 0) {
      children = editor.api.create.value();
    }
    editor.tf.replaceNodes(children, {
      at: [],
      children: true
    });
  }
}));

// src/lib/utils/normalizeDescendantsToDocumentFragment.ts
var isInlineNode = (editor) => (node) => TextApi4.isText(node) || ElementApi4.isElement(node) && editor.api.isInline(node);
var makeBlockLazy = (type) => () => ({
  children: [],
  type
});
var hasDifferentChildNodes = (descendants, isInline) => {
  return descendants.some((descendant, index, arr) => {
    const prevDescendant = arr[index - 1];
    if (index !== 0) {
      return isInline(descendant) !== isInline(prevDescendant);
    }
    return false;
  });
};
var normalizeDifferentNodeTypes = (descendants, isInline, makeDefaultBlock) => {
  const hasDifferentNodes = hasDifferentChildNodes(descendants, isInline);
  const { fragment } = descendants.reduce(
    (memo, node) => {
      if (hasDifferentNodes && isInline(node)) {
        let block = memo.precedingBlock;
        if (!block) {
          block = makeDefaultBlock();
          memo.precedingBlock = block;
          memo.fragment.push(block);
        }
        block.children.push(node);
      } else {
        memo.fragment.push(node);
        memo.precedingBlock = null;
      }
      return memo;
    },
    {
      fragment: [],
      precedingBlock: null
    }
  );
  return fragment;
};
var normalizeEmptyChildren = (descendants) => {
  if (descendants.length === 0) {
    return [{ text: "" }];
  }
  return descendants;
};
var normalize = (descendants, isInline, makeDefaultBlock) => {
  descendants = normalizeEmptyChildren(descendants);
  descendants = normalizeDifferentNodeTypes(
    descendants,
    isInline,
    makeDefaultBlock
  );
  descendants = descendants.map((node) => {
    if (ElementApi4.isElement(node)) {
      return {
        ...node,
        children: normalize(
          node.children,
          isInline,
          makeDefaultBlock
        )
      };
    }
    return node;
  });
  return descendants;
};
var normalizeDescendantsToDocumentFragment = (editor, {
  defaultElementPlugin = BaseParagraphPlugin,
  descendants
}) => {
  const isInline = isInlineNode(editor);
  const defaultType = editor.getType(defaultElementPlugin);
  const makeDefaultBlock = makeBlockLazy(defaultType);
  return normalize(descendants, isInline, makeDefaultBlock);
};

// src/lib/utils/omitPluginContext.ts
var omitPluginContext = (ctx) => {
  const {
    api,
    editor,
    getOption,
    getOptions,
    plugin,
    setOption,
    setOptions,
    tf,
    type,
    ...rest
  } = ctx;
  return rest;
};

// src/lib/utils/overridePluginsByKey.ts
import defaultsDeep from "lodash/defaultsDeep.js";
var overridePluginsByKey = (plugin, overrideByKey = {}, nested = false) => {
  if (overrideByKey[plugin.key]) {
    const {
      __extensions: pluginOverridesExtensions,
      plugins: pluginOverridesPlugins,
      ...pluginOverrides
    } = overrideByKey[plugin.key];
    plugin = defaultsDeep({}, pluginOverrides, plugin);
    if (pluginOverridesExtensions) {
      plugin.__extensions = [
        ...plugin.__extensions || [],
        ...pluginOverridesExtensions
      ];
    }
    if (!nested) {
      pluginOverridesPlugins?.forEach((pOverrides) => {
        if (!plugin.plugins) plugin.plugins = [];
        const found = plugin.plugins.find((p) => p.key === pOverrides.key);
        if (!found) plugin.plugins.push(pOverrides);
      });
    }
  }
  if (plugin.plugins) {
    plugin.plugins = plugin.plugins.map(
      (p) => overridePluginsByKey(p, overrideByKey, true)
    );
  }
  return plugin;
};

// src/lib/utils/pipeInsertDataQuery.ts
var pipeInsertDataQuery = (editor, plugins, { data, dataTransfer }) => plugins.every((p) => {
  const query = p.parser?.query;
  return !query || query({
    ...getEditorPlugin(editor, p),
    data,
    dataTransfer
  });
});

// src/lib/plugins/ParserPlugin.ts
var ParserPlugin = createSlatePlugin({
  key: "parser"
}).overrideEditor(({ editor, tf: { insertData } }) => ({
  transforms: {
    insertData(dataTransfer) {
      const inserted = [...editor.pluginList].reverse().some((plugin) => {
        const parser = plugin.parser;
        if (!parser) return false;
        const injectedPlugins = getInjectedPlugins(editor, plugin);
        const { deserialize, format, mimeTypes } = parser;
        if (!format) return false;
        const formats = Array.isArray(format) ? format : [format];
        const mimeTypeList = mimeTypes || formats.map((fmt) => fmt.includes("/") ? fmt : `text/${fmt}`);
        for (const mimeType of mimeTypeList) {
          let data = dataTransfer.getData(mimeType);
          if (!data) continue;
          if (!pipeInsertDataQuery(editor, injectedPlugins, {
            data,
            dataTransfer
          })) {
            continue;
          }
          data = pipeTransformData(editor, injectedPlugins, {
            data,
            dataTransfer
          });
          let fragment = deserialize?.({
            ...getEditorPlugin(editor, plugin),
            data,
            dataTransfer
          });
          if (!fragment?.length) continue;
          fragment = pipeTransformFragment(editor, injectedPlugins, {
            data,
            dataTransfer,
            fragment
          });
          if (fragment.length === 0) continue;
          pipeInsertFragment(editor, injectedPlugins, {
            data,
            dataTransfer,
            fragment
          });
          return true;
        }
        return false;
      });
      if (inserted) return;
      insertData(dataTransfer);
    }
  }
}));

// src/lib/plugins/getCorePlugins.ts
var getCorePlugins = ({
  maxLength,
  plugins = []
}) => {
  let corePlugins = [
    DebugPlugin,
    SlateExtensionPlugin,
    DOMPlugin,
    HistoryPlugin,
    InlineVoidPlugin,
    ParserPlugin,
    maxLength ? LengthPlugin.configure({
      options: { maxLength }
    }) : LengthPlugin,
    HtmlPlugin,
    AstPlugin,
    BaseParagraphPlugin
  ];
  const customPluginsMap = new Map(
    plugins.map((plugin) => [plugin.key, plugin])
  );
  corePlugins = corePlugins.map((corePlugin) => {
    const customPlugin = customPluginsMap.get(corePlugin.key);
    if (customPlugin) {
      const index = plugins.findIndex((p) => p.key === corePlugin.key);
      if (index !== -1) {
        plugins.splice(index, 1);
      }
      return customPlugin;
    }
    return corePlugin;
  });
  return corePlugins;
};

// src/lib/editor/withSlate.ts
var withSlate = (e, {
  id,
  autoSelect,
  maxLength,
  plugins = [],
  rootPlugin,
  selection,
  shouldNormalizeEditor,
  skipInitialization,
  value,
  ...pluginConfig
} = {}) => {
  const editor = e;
  editor.id = id ?? editor.id ?? nanoid();
  editor.key = editor.key ?? nanoid();
  editor.isFallback = false;
  editor.prevSelection = null;
  editor.currentKeyboardEvent = null;
  editor.getApi = () => editor.api;
  editor.getTransforms = () => editor.transforms;
  editor.getPlugin = (plugin) => getSlatePlugin(editor, plugin);
  editor.getType = (plugin) => getPluginType(editor, plugin);
  editor.getInjectProps = (plugin) => {
    return editor.getPlugin(plugin).inject?.nodeProps ?? {};
  };
  editor.getOptionsStore = (plugin) => {
    return editor.getPlugin(plugin).optionsStore;
  };
  editor.getOptions = (plugin) => {
    const store = editor.getOptionsStore(plugin);
    if (!store) return editor.getPlugin(plugin).options;
    return editor.getOptionsStore(plugin).get("state");
  };
  editor.getOption = (plugin, key, ...args) => {
    const store = editor.getOptionsStore(plugin);
    if (!store) return editor.getPlugin(plugin).options[key];
    if (!(key in store.get("state")) && !(key in store.selectors)) {
      editor.api.debug.error(
        `editor.getOption: ${key} option is not defined in plugin ${plugin.key}.`,
        "OPTION_UNDEFINED"
      );
      return;
    }
    return store.get(key, ...args);
  };
  editor.setOption = (plugin, key, ...args) => {
    const store = editor.getOptionsStore(plugin);
    if (!store) return;
    if (!(key in store.get("state"))) {
      editor.api.debug.error(
        `editor.setOption: ${key} option is not defined in plugin ${plugin.key}.`,
        "OPTION_UNDEFINED"
      );
      return;
    }
    store.set(key, ...args);
  };
  editor.setOptions = (plugin, options) => {
    const store = editor.getOptionsStore(plugin);
    if (!store) return;
    if (typeof options === "object") {
      store.set("state", (draft) => {
        Object.assign(draft, options);
      });
    } else if (typeof options === "function") {
      store.set("state", options);
    }
  };
  const corePlugins = getCorePlugins({
    maxLength,
    plugins
  });
  let rootPluginInstance = createSlatePlugin({
    key: "root",
    priority: 1e4,
    ...pluginConfig,
    plugins: [...corePlugins, ...plugins]
  });
  if (rootPlugin) {
    rootPluginInstance = rootPlugin(rootPluginInstance);
  }
  resolvePlugins(editor, [rootPluginInstance]);
  const normalizeNode = editor.tf.normalizeNode;
  editor.tf.normalizeNode = (...args) => {
    if (!editor.api.shouldNormalizeNode(args[0])) {
      return;
    }
    return normalizeNode(...args);
  };
  editor.normalizeNode = editor.tf.normalizeNode;
  if (!skipInitialization) {
    void editor.tf.init({
      autoSelect,
      selection,
      shouldNormalizeEditor,
      value
    });
  }
  return editor;
};
var createSlateEditor = ({
  editor = createEditor(),
  ...options
} = {}) => {
  return withSlate(editor, options);
};

// src/lib/libs/nanoid.ts
import { nanoid as nanoid2 } from "nanoid";

// src/lib/libs/zustand.ts
import { createZustandStore as createZustandStore2 } from "zustand-x";
export {
  AUTO_SCROLL,
  AstPlugin,
  BaseParagraphPlugin,
  CARRIAGE_RETURN,
  DOMPlugin,
  DebugPlugin,
  ElementStatic,
  HistoryPlugin,
  Hotkeys,
  HtmlPlugin,
  InlineVoidPlugin,
  LINE_FEED,
  LeafStatic,
  LengthPlugin,
  NO_BREAK_SPACE,
  ParserPlugin,
  PlateError,
  PlateStatic,
  SPACE,
  SlateElement,
  SlateExtensionPlugin,
  SlateLeaf,
  SlateText,
  TAB,
  ZERO_WIDTH_SPACE,
  applyDeepToNodes,
  cleanHtmlBrElements,
  cleanHtmlCrLf,
  cleanHtmlEmptyElements,
  cleanHtmlFontElements,
  cleanHtmlLinkElements,
  cleanHtmlTextNodes,
  collapseString,
  collapseWhiteSpace,
  collapseWhiteSpaceChildren,
  collapseWhiteSpaceElement,
  collapseWhiteSpaceNode,
  collapseWhiteSpaceText,
  copyBlockMarksToSpanChild,
  createHotkey,
  createSlateEditor,
  createSlatePlugin,
  createStaticString,
  createTSlatePlugin,
  createZustandStore2 as createZustandStore,
  defaultsDeepToNodes,
  deserializeHtml,
  deserializeHtmlElement,
  deserializeHtmlNode,
  deserializeHtmlNodeChildren,
  endInlineFormattingContext,
  findHtmlElement,
  getCorePlugins,
  getDataNodeProps,
  getEditorDOMFromHtmlString,
  getEditorPlugin,
  getHtmlComments,
  getInjectMatch,
  getInjectedPlugins,
  getKeyByType,
  getKeysByTypes,
  getNodeDataAttributeKeys,
  getNodeDataAttributes,
  getPluginDataAttributes,
  getPluginNodeProps,
  getPluginType,
  getPluginTypes,
  getRenderNodeStaticProps,
  getSlateClass,
  getSlateElements,
  getSlatePlugin,
  htmlBodyToFragment,
  htmlBrToNewLine,
  htmlElementToElement,
  htmlElementToLeaf,
  htmlStringToDOMNode,
  htmlTextNodeToString,
  inferWhiteSpaceRule,
  inlineTagNames,
  isHotkey,
  isHtmlBlockElement,
  isHtmlComment,
  isHtmlElement,
  isHtmlFragmentHref,
  isHtmlInlineElement,
  isHtmlTable,
  isHtmlText,
  isLastNonEmptyTextOfInlineFormattingContext,
  isOlSymbol,
  isSlateEditor,
  isSlateElement,
  isSlateLeaf,
  isSlateNode,
  isSlatePluginElement,
  isSlatePluginNode,
  isSlateString,
  isSlateText,
  isSlateVoid,
  isType,
  keyToDataAttribute,
  mergeDeepToNodes,
  nanoid2 as nanoid,
  normalizeDescendantsToDocumentFragment,
  omitPluginContext,
  overridePluginsByKey,
  parseHtmlDocument,
  parseHtmlElement,
  pipeDecorate,
  pipeDeserializeHtmlElement,
  pipeDeserializeHtmlLeaf,
  pipeInsertDataQuery,
  pipeRenderElementStatic,
  pipeRenderLeafStatic,
  pipeRenderTextStatic,
  pluginDeserializeHtml,
  pluginRenderElementStatic,
  pluginRenderLeafStatic,
  pluginRenderTextStatic,
  postCleanHtml,
  preCleanHtml,
  removeHtmlNodesBetweenComments,
  removeHtmlSurroundings,
  replaceTagName,
  serializeHtml,
  someHtmlElement,
  stripHtmlClassNames,
  stripSlateDataAttributes,
  traverseHtmlComments,
  traverseHtmlElements,
  traverseHtmlNode,
  traverseHtmlTexts,
  unwrapHtmlElement,
  upsertInlineFormattingContext,
  useNodeAttributes,
  withInlineVoid,
  withPlateHistory,
  withScrolling,
  withSlate
};
//# sourceMappingURL=index.mjs.map