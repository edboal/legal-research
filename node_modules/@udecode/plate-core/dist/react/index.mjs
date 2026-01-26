// src/react/slate-react.ts
import {
  DefaultPlaceholder,
  Editable,
  Slate
} from "slate-react";
import {
  useComposing,
  useFocused,
  useReadOnly,
  useSelected
} from "slate-react";
import { withReact } from "slate-react";

// src/react/components/EditorHotkeysEffect.tsx
import React15, { useEffect as useEffect2 } from "react";
import { useHotkeys } from "@udecode/react-hotkeys";
import { isDefined as isDefined6 } from "@udecode/utils";

// src/react/stores/element/useElement.ts
import { useAtomStoreValue as useAtomStoreValue4 } from "jotai-x";

// src/react/stores/plate/createPlateStore.ts
import React11, { useMemo } from "react";
import { atom as atom3 } from "jotai";
import { useAtomStoreSet, useAtomStoreState, useAtomStoreValue as useAtomStoreValue3 } from "jotai-x";

// src/react/libs/jotai.ts
import { atom } from "jotai";
import {
  createAtomStore,
  useStoreAtomState,
  useStoreAtomValue,
  useStoreSetAtom
} from "jotai-x";
import {
  useStoreSelect,
  useStoreState,
  useStoreValue,
  useTracked,
  useTrackedStore
} from "zustand-x";

// src/react/editor/withPlate.ts
import { createEditor as createEditor2 } from "@udecode/slate";

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

// src/lib/static/utils/getNodeDataAttributes.ts
import { TextApi } from "@udecode/slate";
import kebabCase from "lodash/kebabCase.js";
var getNodeDataAttributeKeys = (node) => {
  return Object.keys(node).filter(
    (key) => typeof node[key] !== "object" && (!TextApi.isText(node) || key !== "text")
  ).map((key) => keyToDataAttribute(key));
};
var keyToDataAttribute = (key) => {
  return `data-slate-${kebabCase(key)}`;
};

// src/internal/plugin/pipeInjectNodeProps.tsx
import clsx from "clsx";

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
        className: clsx(attributes?.className, newAttributes.className) || void 0,
        style: {
          ...attributes?.style,
          ...newAttributes.style
        }
      };
    }
  });
  return nodeProps;
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
var isSlateNode = (element) => {
  return isSlateLeaf(element) || isSlateElement(element) || isSlateVoid(element) || isSlateString(element) || isSlateText(element);
};
var isSlatePluginNode = (element, pluginKey) => {
  return element.classList.contains(`slate-${pluginKey}`);
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

// src/lib/utils/mergeDeepToNodes.ts
import merge3 from "lodash/merge.js";
var mergeDeepToNodes = (options) => {
  applyDeepToNodes({ ...options, apply: merge3 });
};

// src/lib/utils/normalizeDescendantsToDocumentFragment.ts
import {
  ElementApi as ElementApi3,
  TextApi as TextApi3
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

// src/lib/plugins/html/utils/isHtmlElement.ts
var isHtmlElement = (node) => node.nodeType === Node.ELEMENT_NODE;

// src/lib/plugins/html/utils/isHtmlText.ts
var isHtmlText = (node) => node.nodeType === Node.TEXT_NODE;

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
import castArray from "lodash/castArray.js";

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
          const validNodeNames = castArray(validNodeName);
          if (validNodeNames.length > 0 && !validNodeNames.includes(el.nodeName) && validNodeName !== "*")
            return false;
        }
        if (validClassName && !el.classList.contains(validClassName))
          return false;
        if (validStyle) {
          for (const [key, value] of Object.entries(validStyle)) {
            const values = castArray(value);
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
              const attributeValues = castArray(attributeValue);
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
import { ElementApi as ElementApi2, TextApi as TextApi2 } from "@udecode/slate";
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
      if (ElementApi2.isElement(child)) {
        if (Object.keys(node).length > 0) {
          mergeDeepToNodes({
            node: child,
            query: {
              filter: ([n]) => TextApi2.isText(n)
            },
            source: node
          });
        }
        arr.push(child);
      } else {
        const attributes = { ...node };
        if (TextApi2.isText(child) && child.text) {
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

// src/lib/plugins/html/utils/parseHtmlDocument.ts
var parseHtmlDocument = (html) => {
  return new DOMParser().parseFromString(html, "text/html");
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
var isInlineNode = (editor) => (node) => TextApi3.isText(node) || ElementApi3.isElement(node) && editor.api.isInline(node);
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
    if (ElementApi3.isElement(node)) {
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

// src/lib/libs/zustand.ts
import { createZustandStore as createZustandStore2 } from "zustand-x";

// src/react/plugins/SlateReactExtensionPlugin.ts
import { isDefined as isDefined5 } from "@udecode/utils";

// src/react/plugin/toPlatePlugin.ts
var methodsToWrap = [
  "configure",
  "configurePlugin",
  "extendEditorApi",
  "extendSelectors",
  "extendApi",
  "extendEditorTransforms",
  "extendTransforms",
  "overrideEditor",
  "extend",
  "extendPlugin"
];
function toPlatePlugin(basePlugin, extendConfig) {
  const plugin = { ...basePlugin };
  methodsToWrap.forEach((method) => {
    const originalMethod = plugin[method];
    plugin[method] = (...args) => {
      const slatePlugin = originalMethod(...args);
      return toPlatePlugin(slatePlugin);
    };
  });
  plugin.withComponent = (component) => {
    return plugin.extend({
      node: { component },
      render: { node: component }
    });
  };
  if (!extendConfig) return plugin;
  const extendedPlugin = plugin.extend(extendConfig);
  return extendedPlugin;
}
function toTPlatePlugin(basePlugin, extendConfig) {
  return toPlatePlugin(basePlugin, extendConfig);
}

// src/react/plugin/createPlatePlugin.ts
var createPlatePlugin = (config = {}) => {
  const plugin = createSlatePlugin(config);
  return toPlatePlugin(plugin);
};
function createTPlatePlugin(config = {}) {
  return createPlatePlugin(config);
}

// src/react/plugin/getEditorPlugin.ts
function getEditorPlugin2(editor, plugin) {
  return getEditorPlugin(editor, plugin);
}

// src/react/plugin/getPlugin.ts
function getPlugin(editor, plugin) {
  return editor.plugins[plugin.key] ?? createPlatePlugin({ key: plugin.key });
}

// src/react/plugin/omitPluginContext.ts
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

// src/react/plugins/SlateReactExtensionPlugin.ts
var SlateReactExtensionPlugin = toPlatePlugin(SlateExtensionPlugin, {
  handlers: {
    onKeyDown: ({ editor, event }) => {
      event.persist();
      editor.currentKeyboardEvent = event;
    }
  }
}).extendEditorApi(({ editor }) => ({
  redecorate: () => {
    editor.api.debug.warn(
      `The method editor.api.redecorate() has not been overridden. This may cause unexpected behavior. Please ensure that all required editor methods are properly defined.`,
      "OVERRIDE_MISSING"
    );
  }
})).overrideEditor(({ editor, tf: { normalizeNode } }) => ({
  transforms: {
    normalizeNode(entry, options) {
      if (isDefined5(entry[0]._memo)) {
        editor.tf.unsetNodes("_memo", { at: entry[1] });
        return;
      }
      normalizeNode(entry, options);
    }
  }
}));

// src/react/plugins/event-editor/EventEditorStore.ts
var EventEditorStore = createZustandStore2(
  {
    blur: null,
    focus: null,
    last: null
  },
  {
    mutative: true,
    name: "event-editor"
  }
);
var { useValue: useEventEditorValue } = EventEditorStore;

// src/react/plugins/event-editor/useFocusEditorEvents.ts
import { useEffect } from "react";
var FOCUS_EDITOR_EVENT = "focus-editor-event";
var BLUR_EDITOR_EVENT = "blur-editor-event";
var useFocusEditorEvents = ({
  editorRef,
  onEditorBlur,
  onEditorFocus
}) => {
  useEffect(() => {
    const onFocusEditor = (event) => {
      const id = event.detail.id;
      if (!!onEditorFocus && editorRef && editorRef.id === id) {
        onEditorFocus();
      }
    };
    const onBlurEditor = (event) => {
      const id = event.detail.id;
      if (!!onEditorBlur && editorRef && editorRef.id === id) {
        onEditorBlur();
      }
    };
    document.addEventListener(FOCUS_EDITOR_EVENT, onFocusEditor);
    document.addEventListener(BLUR_EDITOR_EVENT, onBlurEditor);
    return () => {
      document.removeEventListener(FOCUS_EDITOR_EVENT, onFocusEditor);
      document.removeEventListener(BLUR_EDITOR_EVENT, onBlurEditor);
    };
  }, [editorRef, onEditorBlur, onEditorFocus]);
};

// src/react/plugins/event-editor/EventEditorPlugin.ts
var EventEditorPlugin = createPlatePlugin({
  key: "eventEditor",
  handlers: {
    onBlur: ({ editor }) => {
      const focus = EventEditorStore.get("focus");
      if (focus === editor.id) {
        EventEditorStore.set("focus", null);
      }
      EventEditorStore.set("blur", editor.id);
      document.dispatchEvent(
        new CustomEvent(BLUR_EDITOR_EVENT, {
          detail: { id: editor.id }
        })
      );
    },
    onFocus: ({ editor }) => {
      EventEditorStore.set("focus", editor.id);
      document.dispatchEvent(
        new CustomEvent(FOCUS_EDITOR_EVENT, {
          detail: { id: editor.id }
        })
      );
    }
  }
});

// src/react/plugins/event-editor/getEventPlateId.ts
var getEventPlateId = (id) => {
  if (id) return id;
  const focus = EventEditorStore.get("focus");
  if (focus) return focus;
  const blur = EventEditorStore.get("blur");
  if (blur) return blur;
  return EventEditorStore.get("last") ?? "plate";
};

// src/react/plugins/paragraph/ParagraphPlugin.tsx
import { Key } from "@udecode/react-hotkeys";
var ParagraphPlugin = toPlatePlugin(
  BaseParagraphPlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleParagraph: {
        keys: [
          [Key.Mod, Key.Alt, "0"],
          [Key.Mod, Key.Shift, "0"]
        ],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleBlock(type);
        }
      }
    }
  })
);

// src/react/plugins/react/withPlateReact.ts
var withPlateReact = ({ editor }) => {
  return withReact(editor);
};

// src/react/plugins/react/ReactPlugin.ts
var ReactPlugin = toPlatePlugin(DOMPlugin, {
  key: "dom",
  extendEditor: withPlateReact
}).extendEditorTransforms(({ editor }) => {
  const { reset } = editor.tf;
  return {
    reset(options) {
      const isFocused = editor.api.isFocused();
      reset(options);
      if (isFocused) {
        editor.tf.focus({ edge: "startEditor" });
      }
    }
  };
});

// src/react/editor/getPlateCorePlugins.ts
var getPlateCorePlugins = () => [
  SlateReactExtensionPlugin,
  ReactPlugin,
  EventEditorPlugin,
  ParagraphPlugin
];

// src/react/editor/withPlate.ts
var withPlate = (e, { plugins = [], ...options } = {}) => {
  const editor = withSlate(e, {
    ...options,
    override: {
      ...options.override,
      components: {
        ...options.components,
        ...options.override?.components
      }
    },
    plugins: [...getPlateCorePlugins(), ...plugins]
  });
  return editor;
};
var createPlateEditor = ({
  editor = createEditor2(),
  ...options
} = {}) => {
  return withPlate(editor, options);
};

// src/react/utils/createPlateFallbackEditor.ts
var createPlateFallbackEditor = (options = {}) => {
  const editor = createPlateEditor(options);
  editor.isFallback = true;
  editor.apply = () => {
    throw new Error(
      "Cannot apply operations on the fallback editor. The fallback editor is used when a hook that depends on the Plate store was unable to locate a valid store. If you are using PlateController, use `useEditorMounted(id?: string)` or `!editor.isFallback` to ensure that a valid Plate store is available before attempting to call operations on the editor."
    );
  };
  return editor;
};

// src/react/utils/dom-attributes.ts
var DOM_HANDLERS = [
  // Clipboard Events
  "onCopy",
  "onCopyCapture",
  "onCut",
  "onCutCapture",
  "onPaste",
  "onPasteCapture",
  // Composition Events
  "onCompositionEnd",
  "onCompositionEndCapture",
  "onCompositionStart",
  "onCompositionStartCapture",
  "onCompositionUpdate",
  "onCompositionUpdateCapture",
  // Focus Events
  "onFocus",
  "onFocusCapture",
  "onBlur",
  "onBlurCapture",
  // Form Events
  "onDOMBeforeInput",
  "onBeforeInput",
  "onBeforeInputCapture",
  "onInput",
  "onInputCapture",
  "onReset",
  "onResetCapture",
  "onSubmit",
  "onSubmitCapture",
  "onInvalid",
  "onInvalidCapture",
  // Image Events
  "onLoad",
  "onLoadCapture",
  // Keyboard Events
  "onKeyDown",
  "onKeyDownCapture",
  "onKeyPress",
  "onKeyPressCapture",
  "onKeyUp",
  "onKeyUpCapture",
  // Media Events
  "onAbort",
  "onAbortCapture",
  "onCanPlay",
  "onCanPlayCapture",
  "onCanPlayThrough",
  "onCanPlayThroughCapture",
  "onDurationChange",
  "onDurationChangeCapture",
  "onEmptied",
  "onEmptiedCapture",
  "onEncrypted",
  "onEncryptedCapture",
  "onEnded",
  "onEndedCapture",
  "onLoadedData",
  "onLoadedDataCapture",
  "onLoadedMetadata",
  "onLoadedMetadataCapture",
  "onLoadStart",
  "onLoadStartCapture",
  "onPause",
  "onPauseCapture",
  "onPlay",
  "onPlayCapture",
  "onPlaying",
  "onPlayingCapture",
  "onProgress",
  "onProgressCapture",
  "onRateChange",
  "onRateChangeCapture",
  "onSeeked",
  "onSeekedCapture",
  "onSeeking",
  "onSeekingCapture",
  "onStalled",
  "onStalledCapture",
  "onSuspend",
  "onSuspendCapture",
  "onTimeUpdate",
  "onTimeUpdateCapture",
  "onVolumeChange",
  "onVolumeChangeCapture",
  "onWaiting",
  "onWaitingCapture",
  // MouseEvents
  "onAuxClick",
  "onAuxClickCapture",
  "onClick",
  "onClickCapture",
  "onContextMenu",
  "onContextMenuCapture",
  "onDoubleClick",
  "onDoubleClickCapture",
  "onDrag",
  "onDragCapture",
  "onDragEnd",
  "onDragEndCapture",
  "onDragEnter",
  "onDragEnterCapture",
  "onDragExit",
  "onDragExitCapture",
  "onDragLeave",
  "onDragLeaveCapture",
  "onDragOver",
  "onDragOverCapture",
  "onDragStart",
  "onDragStartCapture",
  "onDrop",
  "onDropCapture",
  "onMouseDown",
  "onMouseDownCapture",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseMoveCapture",
  "onMouseOut",
  "onMouseOutCapture",
  "onMouseOver",
  "onMouseOverCapture",
  "onMouseUp",
  "onMouseUpCapture",
  // Selection Events
  "onSelect",
  "onSelectCapture",
  // Touch Events
  "onTouchCancel",
  "onTouchCancelCapture",
  "onTouchEnd",
  "onTouchEndCapture",
  "onTouchMove",
  "onTouchMoveCapture",
  "onTouchStart",
  "onTouchStartCapture",
  // Pointer Events
  "onPointerDown",
  "onPointerDownCapture",
  "onPointerMove",
  "onPointerUp",
  "onPointerUpCapture",
  "onPointerCancel",
  "onPointerCancelCapture",
  "onPointerEnter",
  "onPointerLeave",
  "onPointerOver",
  "onPointerOverCapture",
  "onPointerOut",
  "onPointerOutCapture",
  "onGotPointerCapture",
  "onGotPointerCaptureCapture",
  "onLostPointerCapture",
  "onLostPointerCaptureCapture",
  // UI Events
  "onScroll",
  "onScrollCapture",
  // Wheel Events
  "onWheel",
  "onWheelCapture",
  // Animation Events
  "onAnimationStart",
  "onAnimationStartCapture",
  "onAnimationEnd",
  "onAnimationEndCapture",
  "onAnimationIteration",
  "onAnimationIterationCapture",
  // Transition Events
  "onTransitionEnd",
  "onTransitionEndCapture"
];

// src/react/utils/getRenderNodeProps.ts
import { clsx as clsx2 } from "clsx";
var getRenderNodeProps = ({
  attributes: nodeAttributes,
  editor,
  plugin,
  props
}) => {
  let newProps = {
    ...props,
    ...plugin ? getEditorPlugin2(editor, plugin) : {},
    editor
  };
  const { className } = props;
  const pluginProps = getPluginNodeProps({
    attributes: nodeAttributes,
    plugin,
    props: newProps
  });
  newProps = {
    ...pluginProps,
    attributes: {
      ...pluginProps.attributes,
      className: clsx2(
        getSlateClass(plugin?.node.type),
        pluginProps.attributes?.className,
        className
      ) || void 0
    }
  };
  newProps = pipeInjectNodeProps(
    editor,
    newProps,
    (node) => editor.api.findPath(node)
  );
  if (newProps.attributes?.style && Object.keys(newProps.attributes.style).length === 0) {
    delete newProps.attributes.style;
  }
  return newProps;
};

// src/react/utils/pipeHandler.ts
var convertDomEventToSyntheticEvent = (domEvent) => {
  let propagationStopped = false;
  return {
    ...domEvent,
    bubbles: domEvent.bubbles,
    cancelable: domEvent.cancelable,
    currentTarget: domEvent.currentTarget,
    defaultPrevented: domEvent.defaultPrevented,
    eventPhase: domEvent.eventPhase,
    isTrusted: domEvent.isTrusted,
    nativeEvent: domEvent,
    target: domEvent.target,
    timeStamp: domEvent.timeStamp,
    type: domEvent.type,
    isDefaultPrevented: () => domEvent.defaultPrevented,
    isPropagationStopped: () => propagationStopped,
    persist: () => {
      throw new Error(
        "persist is not implemented for synthetic events created using convertDomEventToSyntheticEvent"
      );
    },
    preventDefault: () => domEvent.preventDefault(),
    stopPropagation: () => {
      propagationStopped = true;
      domEvent.stopPropagation();
    }
  };
};
var isEventHandled = (event, handler) => {
  if (!handler) {
    return false;
  }
  const shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }
  return event.isPropagationStopped();
};
var pipeHandler = (editor, {
  editableProps,
  handlerKey
}) => {
  const propsHandler = editableProps?.[handlerKey];
  const relevantPlugins = editor.pluginList.filter(
    (plugin) => plugin.handlers?.[handlerKey]
  );
  if (relevantPlugins.length === 0 && !propsHandler) return;
  return (event) => {
    const isDomEvent = event instanceof Event;
    const handledEvent = isDomEvent ? convertDomEventToSyntheticEvent(event) : event;
    const eventIsHandled = relevantPlugins.some((plugin) => {
      const pluginHandler = plugin.handlers[handlerKey];
      const shouldTreatEventAsHandled = pluginHandler({
        ...getEditorPlugin2(editor, plugin),
        event: handledEvent
      });
      if (shouldTreatEventAsHandled != null) {
        return shouldTreatEventAsHandled;
      }
      return false;
    });
    if (eventIsHandled) return true;
    return isEventHandled(handledEvent, propsHandler);
  };
};

// src/react/utils/pipeOnChange.ts
var pipeOnChange = (editor, value) => {
  return editor.pluginList.some((plugin) => {
    const handler = plugin.handlers.onChange;
    if (!handler) {
      return false;
    }
    const shouldTreatEventAsHandled = handler({
      ...getEditorPlugin2(editor, plugin),
      value
    });
    if (shouldTreatEventAsHandled != null) {
      return shouldTreatEventAsHandled;
    }
    return false;
  });
};

// src/react/utils/pipeRenderElement.tsx
import React9 from "react";

// src/react/hooks/useEditableProps.ts
import React6 from "react";
import clsx6 from "clsx";
import { useAtomStoreValue } from "jotai-x";
import omit from "lodash/omit.js";
import { useDeepCompareMemo } from "use-deep-compare";

// src/react/utils/pipeRenderLeaf.tsx
import React3 from "react";
import clsx4 from "clsx";

// src/react/utils/pluginRenderLeaf.tsx
import React2 from "react";

// src/react/components/plate-nodes.tsx
import React from "react";
import { useComposedRef } from "@udecode/react-utils";
import { clsx as clsx3 } from "clsx";
var useNodeAttributes = (props, ref) => {
  return {
    ...props.attributes,
    className: clsx3(props.attributes.className, props.className) || void 0,
    ref: useComposedRef(ref, props.attributes.ref),
    style: { ...props.attributes.style, ...props.style }
  };
};
var PlateElement = React.forwardRef(function PlateElement2({ as: Tag = "div", children, ...props }, ref) {
  const attributes = useNodeAttributes(props, ref);
  const mounted = useEditorMounted();
  const block = React.useMemo(
    () => mounted && !!props.element.id && !!props.editor.api.isBlock(props.element),
    [props.element, props.editor, mounted]
  );
  const belowRootComponents = React.useMemo(
    () => props.editor?.pluginList.map((plugin) => plugin.render.belowRootNodes).filter(Boolean),
    [props.editor?.pluginList]
  );
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
var PlateText = React.forwardRef(({ as: Tag = "span", children, ...props }, ref) => {
  const attributes = useNodeAttributes(props, ref);
  return /* @__PURE__ */ React.createElement(Tag, { ...attributes }, children);
});
var PlateLeaf = React.forwardRef(({ as: Tag = "span", children, ...props }, ref) => {
  const attributes = useNodeAttributes(props, ref);
  return /* @__PURE__ */ React.createElement(Tag, { ...attributes }, children);
});

// src/react/utils/pluginRenderLeaf.tsx
var pluginRenderLeaf = (editor, plugin) => function render(props) {
  const {
    render: { leaf: leafComponent, node }
  } = plugin;
  const { children, leaf } = props;
  if (leaf[plugin.node.type ?? plugin.key]) {
    const Leaf = leafComponent ?? node ?? PlateLeaf;
    const ctxProps = getRenderNodeProps({
      attributes: leaf.attributes,
      editor,
      plugin,
      props
    });
    return /* @__PURE__ */ React2.createElement(Leaf, { ...ctxProps }, children);
  }
  return children;
};

// src/react/utils/pipeRenderLeaf.tsx
var pipeRenderLeaf = (editor, renderLeafProp) => {
  const renderLeafs = [];
  const leafPropsPlugins = [];
  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isLeaf && (plugin.node.isDecoration === true || plugin.render.leaf)) {
      renderLeafs.push(pluginRenderLeaf(editor, plugin));
    }
    if (plugin.node.leafProps) {
      leafPropsPlugins.push(plugin);
    }
  });
  return function render({ attributes, ...props }) {
    renderLeafs.forEach((renderLeaf) => {
      const newChildren = renderLeaf(props);
      if (newChildren !== void 0) {
        props.children = newChildren;
      }
    });
    leafPropsPlugins.forEach((plugin) => {
      if (props.leaf[plugin.node.type ?? plugin.key]) {
        const pluginLeafProps = typeof plugin.node.leafProps === "function" ? plugin.node.leafProps(props) : plugin.node.leafProps ?? {};
        if (pluginLeafProps.className) {
          pluginLeafProps.className = clsx4(
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
    const ctxProps = getRenderNodeProps({
      editor,
      props: { attributes, ...props }
    });
    return /* @__PURE__ */ React3.createElement(PlateLeaf, { ...ctxProps }, props.children);
  };
};

// src/react/utils/pipeRenderText.tsx
import React5 from "react";
import clsx5 from "clsx";

// src/react/utils/pluginRenderText.tsx
import React4 from "react";
var pluginRenderText = (editor, plugin) => function render(nodeProps) {
  const {
    render: { node }
  } = plugin;
  const { children, text } = nodeProps;
  if (text[plugin.node.type ?? plugin.key]) {
    const Text = node ?? PlateText;
    const ctxProps = getRenderNodeProps({
      attributes: nodeProps.attributes,
      editor,
      plugin,
      props: nodeProps
    });
    return /* @__PURE__ */ React4.createElement(Text, { ...ctxProps }, children);
  }
  return children;
};

// src/react/utils/pipeRenderText.tsx
var pipeRenderText = (editor, renderTextProp) => {
  const renderTexts = [];
  const textPropsPlugins = [];
  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isLeaf && plugin.node.isDecoration === false) {
      renderTexts.push(pluginRenderText(editor, plugin));
    }
    if (plugin.node.textProps) {
      textPropsPlugins.push(plugin);
    }
  });
  return function render({ attributes, ...props }) {
    renderTexts.forEach((renderText) => {
      const newChildren = renderText(props);
      if (newChildren !== void 0) {
        props.children = newChildren;
      }
    });
    textPropsPlugins.forEach((plugin) => {
      if (props.text[plugin.node.type ?? plugin.key]) {
        const pluginTextProps = typeof plugin.node.textProps === "function" ? plugin.node.textProps(props) : plugin.node.textProps ?? {};
        if (pluginTextProps.className) {
          pluginTextProps.className = clsx5(
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
    const ctxProps = getRenderNodeProps({
      editor,
      props: { attributes, ...props }
    });
    return /* @__PURE__ */ React5.createElement(PlateText, { ...ctxProps }, props.children);
  };
};

// src/react/hooks/useEditableProps.ts
var useEditableProps = ({
  disabled,
  readOnly: readOnlyProp,
  ...editableProps
} = {}) => {
  const { id } = editableProps;
  const editor = useEditorRef(id);
  const store = usePlateStore(id);
  const versionDecorate = useAtomStoreValue(store, "versionDecorate");
  const storeReadOnly = useAtomStoreValue(store, "readOnly");
  const storeDecorate = useAtomStoreValue(store, "decorate");
  const storeRenderLeaf = useAtomStoreValue(store, "renderLeaf");
  const storeRenderElement = useAtomStoreValue(store, "renderElement");
  const storeRenderText = useAtomStoreValue(store, "renderText");
  const decorateMemo = React6.useMemo(() => {
    return pipeDecorate(
      editor,
      storeDecorate ?? editableProps?.decorate
    );
  }, [editableProps?.decorate, editor, storeDecorate]);
  const decorate = React6.useMemo(() => {
    if (!versionDecorate || !decorateMemo) return;
    return (entry) => decorateMemo(entry);
  }, [decorateMemo, versionDecorate]);
  const renderElement = React6.useMemo(() => {
    return pipeRenderElement(
      editor,
      storeRenderElement ?? editableProps?.renderElement
    );
  }, [editableProps?.renderElement, editor, storeRenderElement]);
  const renderLeaf = React6.useMemo(() => {
    return pipeRenderLeaf(editor, storeRenderLeaf ?? editableProps?.renderLeaf);
  }, [editableProps?.renderLeaf, editor, storeRenderLeaf]);
  const renderText = React6.useMemo(() => {
    return pipeRenderText(editor, storeRenderText ?? editableProps?.renderText);
  }, [editableProps?.renderText, editor, storeRenderText]);
  const props = useDeepCompareMemo(() => {
    const _props = {
      decorate,
      renderElement,
      renderLeaf,
      renderText
    };
    DOM_HANDLERS.forEach((handlerKey) => {
      const handler = pipeHandler(editor, { editableProps, handlerKey });
      if (handler) {
        _props[handlerKey] = handler;
      }
    });
    return _props;
  }, [decorate, editableProps, renderElement, renderLeaf, renderText]);
  const readOnly = storeReadOnly || readOnlyProp || disabled;
  return useDeepCompareMemo(
    () => ({
      ...omit(editableProps, [
        ...DOM_HANDLERS,
        "renderElement",
        "renderLeaf",
        "renderText",
        "decorate"
      ]),
      ...props,
      "aria-disabled": disabled,
      className: clsx6(
        "slate-editor",
        "ignore-click-outside/toolbar",
        editableProps.className
      ),
      "data-readonly": readOnly,
      readOnly
    }),
    [editableProps, props, readOnly]
  );
};

// src/react/hooks/useNodePath.ts
import { useMemoizedSelector } from "@udecode/react-utils";
import { PathApi } from "@udecode/slate";
var useNodePath = (node) => {
  const editor = useEditorRef();
  return useMemoizedSelector(
    () => {
      return editor.api.findPath(node);
    },
    [editor, node],
    (a, b) => {
      return !!a && !!b && PathApi.equals(a, b);
    }
  );
};

// src/react/hooks/useSlateProps.ts
import React7 from "react";
import { useAtomStoreValue as useAtomStoreValue2 } from "jotai-x";
var useSlateProps = ({
  id
}) => {
  const editor = useEditorRef(id);
  const store = usePlateStore(id);
  const onChangeProp = useAtomStoreValue2(store, "onChange");
  const onValueChangeProp = useAtomStoreValue2(store, "onValueChange");
  const onSelectionChangeProp = useAtomStoreValue2(store, "onSelectionChange");
  const updateVersionEditor = useIncrementVersion("versionEditor", id);
  const updateVersionSelection = useIncrementVersion("versionSelection", id);
  const updateVersionValue = useIncrementVersion("versionValue", id);
  const onChange = React7.useCallback(
    (newValue) => {
      updateVersionEditor();
      const eventIsHandled = pipeOnChange(editor, newValue);
      if (!eventIsHandled) {
        onChangeProp?.({ editor, value: newValue });
      }
    },
    [editor, onChangeProp, updateVersionEditor]
  );
  const onValueChange = React7.useMemo(
    () => (value) => {
      updateVersionValue();
      onValueChangeProp?.({ editor, value });
    },
    [editor, onValueChangeProp, updateVersionValue]
  );
  const onSelectionChange = React7.useMemo(
    () => (selection) => {
      updateVersionSelection();
      onSelectionChangeProp?.({ editor, selection });
    },
    [editor, onSelectionChangeProp, updateVersionSelection]
  );
  return React7.useMemo(() => {
    return {
      key: editor.key,
      editor,
      initialValue: editor.children,
      value: editor.children,
      onChange,
      onSelectionChange,
      onValueChange
    };
  }, [editor, onChange, onSelectionChange, onValueChange]);
};

// src/react/utils/pluginRenderElement.tsx
import React8 from "react";

// src/react/stores/element/useElementStore.ts
var SCOPE_ELEMENT = "element";
var initialState = {
  element: null,
  entry: null,
  path: null
};
var { ElementProvider, elementStore, useElementStore } = createAtomStore(
  initialState,
  { name: "element", suppressWarnings: true }
);

// src/react/utils/pluginRenderElement.tsx
function ElementContent({ editor, plugin, ...props }) {
  const element = useElement();
  const { children: _children } = props;
  const key = plugin.key;
  const Element = plugin.render?.node ?? PlateElement;
  const aboveNodes = editor.pluginList.flatMap(
    (o) => o.render?.aboveNodes ?? []
  );
  const belowNodes = editor.pluginList.flatMap(
    (o) => o.render?.belowNodes ?? []
  );
  props = getRenderNodeProps({
    attributes: element.attributes,
    editor,
    plugin,
    props
  });
  let children = _children;
  belowNodes.forEach((withHOC2) => {
    const hoc = withHOC2({ ...props, key });
    if (hoc) {
      children = hoc({ ...props, children });
    }
  });
  let component = /* @__PURE__ */ React8.createElement(Element, { ...props }, children);
  aboveNodes.forEach((withHOC2) => {
    const hoc = withHOC2({ ...props, key });
    if (hoc) {
      component = hoc({ ...props, children: component });
    }
  });
  return component;
}
var pluginRenderElement = (editor, plugin) => function render(props) {
  const { element, path } = props;
  if (element.type === plugin.node.type) {
    return /* @__PURE__ */ React8.createElement(
      ElementProvider,
      {
        element,
        entry: [element, path],
        path,
        scope: plugin.key
      },
      /* @__PURE__ */ React8.createElement(ElementContent, { editor, plugin, ...props })
    );
  }
};

// src/react/utils/pipeRenderElement.tsx
var pipeRenderElement = (editor, renderElementProp) => {
  const renderElements = [];
  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isElement) {
      renderElements.push(pluginRenderElement(editor, plugin));
    }
  });
  return function render(props) {
    let element;
    const path = useNodePath(props.element);
    renderElements.some((renderElement) => {
      element = renderElement({ ...props, path });
      return !!element;
    });
    if (element) return element;
    if (renderElementProp) {
      return renderElementProp({ ...props, path });
    }
    const ctxProps = getRenderNodeProps({
      editor,
      props: { ...props, path }
    });
    return /* @__PURE__ */ React9.createElement(
      ElementProvider,
      {
        element: ctxProps.element,
        entry: [ctxProps.element, path],
        path,
        scope: ctxProps.element.type ?? "default"
      },
      /* @__PURE__ */ React9.createElement(PlateElement, { ...ctxProps }, props.children)
    );
  };
};

// src/react/stores/plate-controller/plateControllerStore.ts
import React10 from "react";
import { atom as atom2 } from "jotai";
var {
  PlateControllerProvider: PlateController,
  plateControllerStore,
  usePlateControllerStore: _usePlateControllerStore
} = createAtomStore(
  {
    activeId: atom2(null),
    editorStores: atom2({}),
    primaryEditorIds: atom2([])
  },
  {
    name: "plateController"
  }
);
var usePlateControllerLocalStore = (options) => _usePlateControllerStore({
  scope: typeof options === "string" ? options : void 0,
  warnIfNoStore: false,
  ...typeof options === "object" ? options : {}
});
var usePlateControllerExists = () => !!usePlateControllerLocalStore().store;
var usePlateControllerStore = (idProp) => {
  const storeAtom = React10.useMemo(
    () => atom2((get) => {
      const editorStores = get(plateControllerStore.atom.editorStores);
      const forId = (id) => {
        if (!id) return null;
        return editorStores[id] ?? null;
      };
      if (idProp) return forId(idProp);
      const lookupOrder = [
        get(plateControllerStore.atom.activeId),
        ...get(plateControllerStore.atom.primaryEditorIds)
      ];
      for (const id of lookupOrder) {
        const store = forId(id);
        if (store) return store;
      }
      return null;
    }),
    [idProp]
  );
  return useStoreAtomValue(usePlateControllerLocalStore(), storeAtom);
};

// src/react/stores/plate/createPlateStore.ts
var PLATE_SCOPE = "plate";
var GLOBAL_PLATE_SCOPE = Symbol("global-plate");
var createPlateStore = ({
  id,
  containerRef = { current: null },
  decorate = null,
  editor,
  isMounted = false,
  primary = true,
  readOnly = null,
  renderElement = null,
  renderLeaf = null,
  renderText = null,
  scrollRef = { current: null },
  versionDecorate = 1,
  versionEditor = 1,
  versionSelection = 1,
  versionValue = 1,
  onChange = null,
  onSelectionChange = null,
  onValueChange = null,
  ...state
} = {}) => createAtomStore(
  {
    containerRef,
    decorate,
    editor,
    isMounted,
    primary,
    readOnly,
    renderElement,
    renderLeaf,
    renderText,
    scrollRef,
    versionDecorate,
    versionEditor,
    versionSelection,
    versionValue,
    onChange,
    onSelectionChange,
    onValueChange,
    ...state
  },
  {
    name: "plate",
    suppressWarnings: true,
    extend: (atoms) => ({
      trackedEditor: atom3((get) => ({
        editor: get(atoms.editor),
        version: get(atoms.versionEditor)
      })),
      trackedSelection: atom3((get) => ({
        selection: get(atoms.editor).selection,
        version: get(atoms.versionSelection)
      })),
      trackedValue: atom3((get) => ({
        value: get(atoms.editor).children,
        version: get(atoms.versionValue)
      }))
    })
  }
);
var {
  PlateProvider: PlateStoreProvider,
  plateStore,
  usePlateSet: usePlateLocalSet,
  usePlateState: usePlateLocalState,
  usePlateStore: usePlateLocalStore,
  usePlateValue: usePlateLocalValue
} = createPlateStore();
var usePlateStore = (id) => {
  const localStore = usePlateLocalStore({ scope: id, warnIfNoStore: false }) ?? null;
  const [localStoreExists] = React11.useState(!!localStore.store);
  const store = localStoreExists ? localStore : (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePlateControllerStore(id)
  );
  const plateControllerExists = usePlateControllerExists();
  const fallbackStore = useMemo(createPlateStore, []).usePlateStore();
  if (!store) {
    if (plateControllerExists) {
      return fallbackStore;
    }
    throw new Error(
      `Plate hooks must be used inside a Plate or PlateController`
    );
  }
  return store;
};
var usePlateSet = (key, options) => {
  const store = usePlateStore(
    typeof options === "string" ? options : options?.scope
  );
  return useAtomStoreSet(store, key);
};
var usePlateValue = (key, options) => {
  const store = usePlateStore(
    typeof options === "string" ? options : options?.scope
  );
  return useAtomStoreValue3(store, key);
};
var usePlateState = (key, options) => {
  const store = usePlateStore(
    typeof options === "string" ? options : options?.scope
  );
  return useAtomStoreState(store, key);
};
var useEditorId = () => useAtomStoreValue3(usePlateStore(), "editor").id;
var useEditorContainerRef = (id) => {
  return useAtomStoreValue3(usePlateStore(id), "containerRef");
};
var useEditorScrollRef = (id) => {
  return useAtomStoreValue3(usePlateStore(id), "scrollRef");
};
var useScrollRef = (id) => {
  const scrollRef = useEditorScrollRef(id);
  const containerRef = useEditorContainerRef(id);
  return scrollRef.current ? scrollRef : containerRef;
};
var useEditorMounted = (id) => {
  return !!useAtomStoreValue3(usePlateStore(id), "isMounted");
};
var useEditorReadOnly = (id) => {
  return !!useAtomStoreValue3(usePlateStore(id), "readOnly");
};
var useEditorRef = (id) => {
  const store = usePlateStore(id);
  const editor = useAtomStoreValue3(store, "editor") ?? createPlateFallbackEditor();
  editor.store = store;
  return editor;
};
var useEditorSelection = (id) => usePlateStore(id).useTrackedSelectionValue().selection;
var useEditorState = (id) => {
  return usePlateStore(id).useTrackedEditorValue().editor;
};
var useEditorVersion = (id) => {
  return useAtomStoreValue3(usePlateStore(id), "versionEditor");
};
var useSelectionVersion = (id) => {
  return useAtomStoreValue3(usePlateStore(id), "versionSelection");
};
var useEditorValue = (id) => usePlateStore(id).useTrackedValueValue().value;
var useValueVersion = (id) => {
  return useAtomStoreValue3(usePlateStore(id), "versionValue");
};
var useIncrementVersion = (key, id) => {
  const previousVersionRef = React11.useRef(1);
  const store = usePlateStore(id);
  const setVersionDecorate = useAtomStoreSet(store, "versionDecorate");
  const setVersionSelection = useAtomStoreSet(store, "versionSelection");
  const setVersionValue = useAtomStoreSet(store, "versionValue");
  const setVersionEditor = useAtomStoreSet(store, "versionEditor");
  return React11.useCallback(() => {
    const nextVersion = previousVersionRef.current + 1;
    switch (key) {
      case "versionDecorate": {
        setVersionDecorate(nextVersion);
        break;
      }
      case "versionEditor": {
        setVersionEditor(nextVersion);
        break;
      }
      case "versionSelection": {
        setVersionSelection(nextVersion);
        break;
      }
      case "versionValue": {
        setVersionValue(nextVersion);
        break;
      }
    }
    previousVersionRef.current = nextVersion;
  }, [
    key,
    setVersionDecorate,
    setVersionEditor,
    setVersionSelection,
    setVersionValue
  ]);
};
var useRedecorate = (id) => {
  const updateDecorate = useIncrementVersion("versionDecorate", id);
  return React11.useCallback(() => {
    updateDecorate();
  }, [updateDecorate]);
};

// src/react/stores/plate/useEditorPlugin.ts
import React12 from "react";
function useEditorPlugin(p, id) {
  const editor = useEditorRef(id);
  return React12.useMemo(
    () => ({
      ...getEditorPlugin2(editor, p),
      store: editor.store
    }),
    [editor, p]
  );
}

// src/react/stores/plate/useEditorSelector.ts
import React13 from "react";
import { useStoreAtomValue as useStoreAtomValue2 } from "jotai-x";
import { selectAtom } from "jotai/utils";
var useEditorSelector = (selector, deps, { id, equalityFn = (a, b) => a === b } = {}) => {
  const selectorAtom = React13.useMemo(
    () => selectAtom(
      plateStore.atom.trackedEditor,
      ({ editor }, prev) => selector(editor, prev),
      equalityFn
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
  return useStoreAtomValue2(usePlateStore(id), selectorAtom);
};

// src/react/stores/plate/usePluginOption.ts
import { useStoreSelect as useStoreSelect2, useStoreValue as useStoreValue2 } from "zustand-x";
function usePluginOption(plugin, key, ...args) {
  const editor = useEditorRef();
  return useEditorPluginOption(editor, plugin, key, ...args);
}
function useEditorPluginOption(editor, plugin, key, ...args) {
  const store = editor.getOptionsStore(plugin);
  if (!store) {
    return void 0;
  }
  if (!(key in store.get("state")) && !(key in store.selectors)) {
    editor.api.debug.error(
      `usePluginOption: ${key} option is not defined in plugin ${plugin.key}`,
      "OPTION_UNDEFINED"
    );
    return void 0;
  }
  return useStoreValue2(store, key, ...args);
}
function usePluginOptions(plugin, selector, {
  id,
  equalityFn
} = {}) {
  const editor = useEditorRef(id);
  return useEditorPluginOptions(editor, plugin, selector, {
    equalityFn
  });
}
function useEditorPluginOptions(editor, plugin, selector, {
  equalityFn
} = {}) {
  const store = editor.getOptionsStore(plugin);
  if (!store) {
    return void 0;
  }
  return useStoreSelect2(store, selector, equalityFn);
}

// src/react/stores/element/useElement.ts
var useElement = (pluginKey = SCOPE_ELEMENT) => {
  const editor = useEditorRef();
  const value = useAtomStoreValue4(useElementStore(pluginKey), "element");
  if (!value) {
    editor.api.debug.warn(
      `useElement(${pluginKey}) hook must be used inside the node component's context`,
      "USE_ELEMENT_CONTEXT"
    );
    return {};
  }
  return value;
};

// src/react/stores/element/useElementSelector.ts
import React14 from "react";
import { useStoreAtomValue as useStoreAtomValue3 } from "jotai-x";
import { selectAtom as selectAtom2 } from "jotai/utils";
var useElementSelector = (selector, deps, {
  key,
  equalityFn = (a, b) => a === b
} = {}) => {
  const selectorAtom = React14.useMemo(
    () => selectAtom2(
      elementStore.atom.entry,
      (entry, prev) => selector(entry, prev),
      equalityFn
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
  return useStoreAtomValue3(useElementStore(key), selectorAtom);
};

// src/react/stores/element/usePath.ts
import { useAtomStoreValue as useAtomStoreValue5 } from "jotai-x";
var usePath = (pluginKey) => {
  const editor = useEditorRef();
  const value = useAtomStoreValue5(useElementStore(pluginKey), "path");
  if (!value) {
    editor.api.debug.warn(
      `usePath(${pluginKey}) hook must be used inside the node component's context`,
      "USE_ELEMENT_CONTEXT"
    );
    return void 0;
  }
  return value;
};

// src/react/stores/event-editor/useEventPlateId.ts
var useEventPlateId = (id) => {
  const focus = useEventEditorValue("focus");
  const blur = useEventEditorValue("blur");
  const last = useEventEditorValue("last");
  const providerId = useEditorRef().id;
  if (id) return id;
  if (focus) return focus;
  if (blur) return blur;
  return last ?? providerId ?? PLATE_SCOPE;
};

// src/react/components/EditorHotkeysEffect.tsx
function EditorHotkeysEffect({
  id,
  editableRef
}) {
  const editor = useEditorRef(id);
  return /* @__PURE__ */ React15.createElement(React15.Fragment, null, Object.entries(editor.shortcuts).map(([hotkeyString, hotkeyConfig]) => {
    if (!hotkeyConfig || !isDefined6(hotkeyConfig.keys) || !hotkeyConfig.handler) {
      return null;
    }
    return /* @__PURE__ */ React15.createElement(
      HotkeyEffect,
      {
        id,
        key: hotkeyString,
        editableRef,
        hotkeyConfig
      }
    );
  }));
}
function HotkeyEffect({
  id,
  editableRef,
  hotkeyConfig
}) {
  const editor = useEditorRef(id);
  const { keys, handler, ...options } = hotkeyConfig;
  const setHotkeyRef = useHotkeys(
    keys,
    (event, eventDetails) => {
      handler({
        editor,
        event,
        eventDetails
      });
    },
    {
      enableOnContentEditable: true,
      ...options
    },
    []
  );
  useEffect2(() => {
    if (editableRef.current) {
      setHotkeyRef(editableRef.current);
    }
  }, [setHotkeyRef, editableRef]);
  return null;
}

// src/react/components/EditorMethodsEffect.ts
import React16 from "react";
var EditorMethodsEffect = ({ id }) => {
  const editor = useEditorRef(id);
  const redecorate = useRedecorate(id);
  React16.useEffect(() => {
    editor.api.redecorate = redecorate;
  }, [editor, redecorate]);
  return null;
};

// src/react/components/EditorRefEffect.tsx
import React17 from "react";
import { useAtomStoreSet as useAtomStoreSet2, useAtomStoreValue as useAtomStoreValue6 } from "jotai-x";
function EditorRefPluginEffect({
  id,
  plugin
}) {
  const editor = useEditorRef(id);
  plugin.useHooks?.(getEditorPlugin2(editor, plugin));
  return null;
}
function EditorRefEffect({ id }) {
  const store = usePlateStore(id);
  const editor = useAtomStoreValue6(store, "editor");
  const setIsMounted = useAtomStoreSet2(store, "isMounted");
  React17.useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [setIsMounted]);
  return /* @__PURE__ */ React17.createElement(React17.Fragment, null, editor.pluginList.map((plugin) => /* @__PURE__ */ React17.createElement(EditorRefPluginEffect, { id, key: plugin.key, plugin })));
}

// src/react/components/EditorStateEffect.tsx
import React18 from "react";
var EditorStateEffect = React18.memo(() => {
  return null;
});

// src/react/components/Plate.tsx
import React20, { useId } from "react";

// src/internal/hooks/usePlateInstancesWarn.ts
import React19 from "react";
function checkPlateInstances() {
  globalThis.__PLATE_INSTANCES__ = (globalThis.__PLATE_INSTANCES__ || 0) + 1;
}
checkPlateInstances();
function usePlateInstancesWarn(disabled) {
  React19.useEffect(() => {
    if (!disabled && globalThis.__PLATE_INSTANCES__ && globalThis.__PLATE_INSTANCES__ > 1) {
      console.warn(
        "Detected multiple @udecode/plate-core instances!\nChoose only one of these packages in your dependencies:\n- @udecode/plate\n- @udecode/plate-core\n- @udecode/plate\n\n"
      );
    }
  }, [disabled]);
}

// src/react/components/Plate.tsx
function PlateInner({
  children,
  containerRef,
  decorate,
  editor,
  primary,
  readOnly,
  renderElement,
  renderLeaf,
  scrollRef,
  onChange,
  onSelectionChange,
  onValueChange
}) {
  return /* @__PURE__ */ React20.createElement(
    PlateStoreProvider,
    {
      readOnly,
      onChange,
      onSelectionChange,
      onValueChange,
      containerRef,
      decorate,
      editor,
      primary,
      renderElement,
      renderLeaf,
      scope: editor.id,
      scrollRef
    },
    children
  );
}
function Plate(props) {
  const id = useId();
  const containerRef = React20.useRef(null);
  const scrollRef = React20.useRef(null);
  usePlateInstancesWarn(props.suppressInstanceWarning);
  if (!props.editor) return null;
  props.editor.uid = "e-" + id.replaceAll(":", "");
  return /* @__PURE__ */ React20.createElement(
    PlateInner,
    {
      key: props.editor.key,
      containerRef,
      scrollRef,
      ...props
    }
  );
}

// src/react/components/PlateContainer.tsx
import React21 from "react";
var PlateContainer = ({
  children,
  ...props
}) => {
  const editor = useEditorRef();
  const containerRef = useEditorContainerRef();
  let afterContainer = null;
  let beforeContainer = null;
  const mainContainer = /* @__PURE__ */ React21.createElement("div", { id: editor.uid, ref: containerRef, ...props }, children);
  editor.pluginList.forEach((plugin) => {
    const {
      render: {
        afterContainer: AfterContainer,
        beforeContainer: BeforeContainer
      } = {}
    } = plugin;
    if (AfterContainer) {
      afterContainer = /* @__PURE__ */ React21.createElement(React21.Fragment, null, afterContainer, /* @__PURE__ */ React21.createElement(AfterContainer, { ...props }));
    }
    if (BeforeContainer) {
      beforeContainer = /* @__PURE__ */ React21.createElement(React21.Fragment, null, beforeContainer, /* @__PURE__ */ React21.createElement(BeforeContainer, { ...props }));
    }
  });
  return /* @__PURE__ */ React21.createElement(React21.Fragment, null, beforeContainer, mainContainer, afterContainer);
};
PlateContainer.displayName = "PlateContainer";

// src/react/components/PlateContent.tsx
import React24, { useRef } from "react";
import { useComposedRef as useComposedRef2 } from "@udecode/react-utils";

// src/react/components/PlateControllerEffect.ts
import React22 from "react";
import { useStableFn } from "@udecode/react-utils";
import { focusAtom } from "jotai-optics";
import { useAtomStoreSet as useAtomStoreSet3, useAtomStoreValue as useAtomStoreValue7 } from "jotai-x";
var PlateControllerEffect = ({
  id: idProp
}) => {
  const idFromStore = useEditorId();
  const id = idProp ?? idFromStore;
  const currentStoreAtom = React22.useMemo(
    () => focusAtom(
      plateControllerStore.atom.editorStores,
      (optic) => optic.prop(id)
    ),
    [id]
  );
  const setCurrentStore = useStableFn(
    usePlateControllerLocalStore().setAtom(currentStoreAtom),
    [currentStoreAtom]
  );
  const setPrimaryEditorIds = useStableFn(
    useAtomStoreSet3(usePlateControllerLocalStore(), "primaryEditorIds")
  );
  const setActiveId = useStableFn(
    useAtomStoreSet3(usePlateControllerLocalStore(), "activeId")
  );
  const store = usePlateStore(id);
  const primary = useAtomStoreValue7(store, "primary");
  const focused = useFocused();
  React22.useEffect(() => {
    setCurrentStore(store ?? null);
    return () => {
      setCurrentStore(null);
      setActiveId((activeId) => activeId === id ? null : activeId);
    };
  }, [store, setCurrentStore, setActiveId, id]);
  React22.useEffect(() => {
    if (primary) {
      setPrimaryEditorIds((ids) => [...ids, id]);
      return () => {
        setPrimaryEditorIds((ids) => ids.filter((i) => i !== id));
      };
    }
  }, [id, primary, setPrimaryEditorIds]);
  React22.useEffect(() => {
    if (id && focused) {
      setActiveId(id);
    }
  }, [id, focused, setActiveId]);
  return null;
};

// src/react/components/PlateSlate.tsx
import React23 from "react";
function PlateSlate({
  id,
  children
}) {
  const slateProps = useSlateProps({ id });
  const editor = useEditorRef(id);
  let aboveSlate = /* @__PURE__ */ React23.createElement(Slate, { ...slateProps }, children);
  editor.pluginList?.forEach((plugin) => {
    const {
      render: { aboveSlate: AboveSlate }
    } = plugin;
    if (AboveSlate) aboveSlate = /* @__PURE__ */ React23.createElement(AboveSlate, null, aboveSlate);
  });
  return aboveSlate;
}

// src/react/components/PlateContent.tsx
var PlateContent = React24.forwardRef(
  ({ autoFocusOnEditable, renderEditable, ...props }, ref) => {
    const { id } = props;
    const editor = useEditorRef(id);
    if (!editor) {
      throw new Error(
        "Editor not found. Please ensure that PlateContent is rendered below Plate."
      );
    }
    const editableProps = useEditableProps(props);
    const editableRef = useRef(null);
    const combinedRef = useComposedRef2(ref, editableRef);
    const editable = /* @__PURE__ */ React24.createElement(Editable, { ref: combinedRef, ...editableProps });
    let afterEditable = null;
    let beforeEditable = null;
    editor.pluginList.forEach((plugin) => {
      const {
        render: {
          afterEditable: AfterEditable,
          beforeEditable: BeforeEditable
        }
      } = plugin;
      if (AfterEditable) {
        afterEditable = /* @__PURE__ */ React24.createElement(React24.Fragment, null, afterEditable, /* @__PURE__ */ React24.createElement(AfterEditable, { ...editableProps }));
      }
      if (BeforeEditable) {
        beforeEditable = /* @__PURE__ */ React24.createElement(React24.Fragment, null, beforeEditable, /* @__PURE__ */ React24.createElement(BeforeEditable, { ...editableProps }));
      }
    });
    let aboveEditable = /* @__PURE__ */ React24.createElement(React24.Fragment, null, renderEditable ? renderEditable(editable) : editable, /* @__PURE__ */ React24.createElement(EditorMethodsEffect, { id }), /* @__PURE__ */ React24.createElement(EditorHotkeysEffect, { id, editableRef }), /* @__PURE__ */ React24.createElement(EditorRefEffect, { id }), /* @__PURE__ */ React24.createElement(PlateControllerEffect, { id }));
    editor.pluginList.forEach((plugin) => {
      const {
        render: { aboveEditable: AboveEditable }
      } = plugin;
      if (AboveEditable)
        aboveEditable = /* @__PURE__ */ React24.createElement(AboveEditable, null, aboveEditable);
    });
    const readOnly = props.readOnly ?? false;
    const prevReadOnly = React24.useRef(readOnly);
    React24.useEffect(() => {
      if (autoFocusOnEditable && prevReadOnly.current && !readOnly) {
        editor.tf.focus({ edge: "endEditor" });
      }
      prevReadOnly.current = readOnly;
    }, [autoFocusOnEditable, editor, readOnly]);
    return /* @__PURE__ */ React24.createElement(PlateSlate, { id }, beforeEditable, aboveEditable, afterEditable);
  }
);
PlateContent.displayName = "PlateContent";

// src/react/components/PlateTest.tsx
import React26 from "react";

// src/react/editor/usePlateEditor.ts
import React25 from "react";
function usePlateEditor(options = {}, deps = []) {
  return React25.useMemo(
    () => {
      if (options.enabled === false) return null;
      const editor = createPlateEditor(options);
      return editor;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.id, options.enabled, ...deps]
  );
}

// src/react/components/PlateTest.tsx
function PlateTest({
  editableProps,
  shouldNormalizeEditor,
  variant = "wordProcessor",
  ...props
}) {
  const { id, editor: _editor, plugins } = props;
  let editor = _editor;
  if (editor && !editor.pluginList) {
    editor = createPlateEditor({
      id,
      editor,
      plugins,
      shouldNormalizeEditor
    });
  }
  return /* @__PURE__ */ React26.createElement(Plate, { ...props, editor }, /* @__PURE__ */ React26.createElement(
    PlateContent,
    {
      "data-testid": "slate-content-editable",
      "data-variant": variant,
      autoFocus: true,
      ...editableProps
    }
  ));
}

// src/react/components/withHOC.tsx
import React27 from "react";
var withHOC = (HOC, Component, hocProps, hocRef) => React27.forwardRef((props, componentRef) => /* @__PURE__ */ React27.createElement(HOC, { ...hocProps, ref: hocRef }, /* @__PURE__ */ React27.createElement(Component, { ...props, ref: componentRef })));
export {
  BLUR_EDITOR_EVENT,
  DOM_HANDLERS,
  DefaultPlaceholder,
  Editable,
  EditorHotkeysEffect,
  EditorMethodsEffect,
  EditorRefEffect,
  EditorRefPluginEffect,
  EditorStateEffect,
  ElementProvider,
  EventEditorPlugin,
  EventEditorStore,
  FOCUS_EDITOR_EVENT,
  GLOBAL_PLATE_SCOPE,
  PLATE_SCOPE,
  ParagraphPlugin,
  Plate,
  PlateContainer,
  PlateContent,
  PlateController,
  PlateControllerEffect,
  PlateElement,
  PlateLeaf,
  PlateSlate,
  PlateStoreProvider,
  PlateTest,
  PlateText,
  ReactPlugin,
  SCOPE_ELEMENT,
  Slate,
  SlateReactExtensionPlugin,
  atom,
  convertDomEventToSyntheticEvent,
  createAtomStore,
  createPlateEditor,
  createPlateFallbackEditor,
  createPlatePlugin,
  createPlateStore,
  createTPlatePlugin,
  elementStore,
  getEditorPlugin2 as getEditorPlugin,
  getEventPlateId,
  getPlateCorePlugins,
  getPlugin,
  getRenderNodeProps,
  isEventHandled,
  omitPluginContext,
  pipeHandler,
  pipeOnChange,
  pipeRenderElement,
  pipeRenderLeaf,
  pipeRenderText,
  plateControllerStore,
  plateStore,
  pluginRenderElement,
  pluginRenderLeaf,
  pluginRenderText,
  toPlatePlugin,
  toTPlatePlugin,
  useComposing,
  useEditableProps,
  useEditorContainerRef,
  useEditorId,
  useEditorMounted,
  useEditorPlugin,
  useEditorPluginOption,
  useEditorPluginOptions,
  useEditorReadOnly,
  useEditorRef,
  useEditorScrollRef,
  useEditorSelection,
  useEditorSelector,
  useEditorState,
  useEditorValue,
  useEditorVersion,
  useElement,
  useElementSelector,
  useElementStore,
  useEventEditorValue,
  useEventPlateId,
  useFocusEditorEvents,
  useFocused,
  useIncrementVersion,
  useNodeAttributes,
  useNodePath,
  usePath,
  usePlateControllerExists,
  usePlateControllerLocalStore,
  usePlateControllerStore,
  usePlateEditor,
  usePlateLocalStore,
  usePlateSet,
  usePlateState,
  usePlateStore,
  usePlateValue,
  usePluginOption,
  usePluginOptions,
  useReadOnly,
  useRedecorate,
  useScrollRef,
  useSelected,
  useSelectionVersion,
  useSlateProps,
  useStoreAtomState,
  useStoreAtomValue,
  useStoreSelect,
  useStoreSetAtom,
  useStoreState,
  useStoreValue,
  useTracked,
  useTrackedStore,
  useValueVersion,
  withHOC,
  withPlate,
  withPlateReact,
  withReact
};
//# sourceMappingURL=index.mjs.map