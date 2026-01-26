"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  BasicMarksPlugin: () => BasicMarksPlugin,
  BoldPlugin: () => BoldPlugin,
  CodePlugin: () => CodePlugin,
  ItalicPlugin: () => ItalicPlugin,
  SkipMarkPlugin: () => SkipMarkPlugin,
  StrikethroughPlugin: () => StrikethroughPlugin,
  SubscriptPlugin: () => SubscriptPlugin,
  SuperscriptPlugin: () => SuperscriptPlugin,
  UnderlinePlugin: () => UnderlinePlugin
});
module.exports = __toCommonJS(react_exports);

// src/react/BasicMarksPlugin.tsx
var import_react8 = require("@udecode/plate/react");

// src/lib/BaseBasicMarksPlugin.ts
var import_plate8 = require("@udecode/plate");

// src/lib/BaseBoldPlugin.ts
var import_plate = require("@udecode/plate");
var BaseBoldPlugin = (0, import_plate.createSlatePlugin)({
  key: "bold",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["STRONG", "B"] },
          {
            validStyle: {
              fontWeight: ["600", "700", "bold"]
            }
          }
        ],
        query: ({ element }) => !(0, import_plate.someHtmlElement)(
          element,
          (node) => node.style.fontWeight === "normal"
        )
      }
    }
  }
});

// src/lib/BaseCodePlugin.ts
var import_plate2 = require("@udecode/plate");
var BaseCodePlugin = (0, import_plate2.createSlatePlugin)({
  key: "code",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["CODE"] },
          { validStyle: { fontFamily: "Consolas" } }
        ],
        query({ element }) {
          const blockAbove = (0, import_plate2.findHtmlParentElement)(element, "P");
          if (blockAbove?.style.fontFamily === "Consolas") return false;
          return !(0, import_plate2.findHtmlParentElement)(element, "PRE");
        }
      }
    }
  }
});

// src/lib/BaseItalicPlugin.ts
var import_plate3 = require("@udecode/plate");
var BaseItalicPlugin = (0, import_plate3.createSlatePlugin)({
  key: "italic",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["EM", "I"] },
          { validStyle: { fontStyle: "italic" } }
        ],
        query: ({ element }) => !(0, import_plate3.someHtmlElement)(
          element,
          (node) => node.style.fontStyle === "normal"
        )
      }
    }
  }
});

// src/lib/BaseStrikethroughPlugin.ts
var import_plate4 = require("@udecode/plate");
var BaseStrikethroughPlugin = (0, import_plate4.createSlatePlugin)({
  key: "strikethrough",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["S", "DEL", "STRIKE"] },
          { validStyle: { textDecoration: "line-through" } }
        ],
        query: ({ element }) => !(0, import_plate4.someHtmlElement)(
          element,
          (node) => node.style.textDecoration === "none"
        )
      }
    }
  }
});

// src/lib/BaseSubscriptPlugin.ts
var import_plate5 = require("@udecode/plate");
var BaseSubscriptPlugin = (0, import_plate5.createSlatePlugin)({
  key: "subscript",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["SUB"] },
          { validStyle: { verticalAlign: "sub" } }
        ]
      }
    }
  }
});

// src/lib/BaseSuperscriptPlugin.ts
var import_plate6 = require("@udecode/plate");
var BaseSuperscriptPlugin = (0, import_plate6.createSlatePlugin)({
  key: "superscript",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["SUP"] },
          { validStyle: { verticalAlign: "super" } }
        ]
      }
    }
  }
});

// src/lib/BaseUnderlinePlugin.ts
var import_plate7 = require("@udecode/plate");
var BaseUnderlinePlugin = (0, import_plate7.createSlatePlugin)({
  key: "underline",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["U"] },
          { validStyle: { textDecoration: ["underline"] } }
        ],
        query: ({ element }) => !(0, import_plate7.someHtmlElement)(
          element,
          (node) => node.style.textDecoration === "none"
        )
      }
    }
  }
});

// src/lib/BaseBasicMarksPlugin.ts
var BaseBasicMarksPlugin = (0, import_plate8.createSlatePlugin)({
  key: "basicMarks",
  plugins: [
    BaseBoldPlugin,
    BaseCodePlugin,
    BaseItalicPlugin,
    BaseStrikethroughPlugin,
    BaseSubscriptPlugin,
    BaseSuperscriptPlugin,
    BaseUnderlinePlugin
  ]
});

// src/react/BoldPlugin.tsx
var import_react = require("@udecode/plate/react");
var BoldPlugin = (0, import_react.toPlatePlugin)(BaseBoldPlugin, ({ editor, type }) => ({
  shortcuts: {
    toggleBold: {
      keys: [[import_react.Key.Mod, "b"]],
      preventDefault: true,
      handler: () => {
        editor.tf.toggleMark(type);
      }
    }
  }
}));

// src/react/CodePlugin.tsx
var import_react2 = require("@udecode/plate/react");
var CodePlugin = (0, import_react2.toPlatePlugin)(BaseCodePlugin, ({ editor, type }) => ({
  shortcuts: {
    toggleCode: {
      keys: [[import_react2.Key.Mod, "e"]],
      preventDefault: true,
      handler: () => {
        editor.tf.toggleMark(type);
      }
    }
  }
}));

// src/react/ItalicPlugin.tsx
var import_react3 = require("@udecode/plate/react");
var ItalicPlugin = (0, import_react3.toPlatePlugin)(
  BaseItalicPlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleItalic: {
        keys: [[import_react3.Key.Mod, "i"]],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleMark(type);
        }
      }
    }
  })
);

// src/react/StrikethroughPlugin.tsx
var import_react4 = require("@udecode/plate/react");
var StrikethroughPlugin = (0, import_react4.toPlatePlugin)(
  BaseStrikethroughPlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleStrikethrough: {
        keys: [[import_react4.Key.Mod, import_react4.Key.Shift, "x"]],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleMark(type);
        }
      }
    }
  })
);

// src/react/SubscriptPlugin.tsx
var import_react6 = require("@udecode/plate/react");

// src/react/SuperscriptPlugin.tsx
var import_react5 = require("@udecode/plate/react");
var SuperscriptPlugin = (0, import_react5.toPlatePlugin)(
  BaseSuperscriptPlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleSuperscript: {
        keys: [[import_react5.Key.Mod, "period"]],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleMark(type, {
            remove: editor.getType(SubscriptPlugin)
          });
        }
      }
    }
  })
);

// src/react/SubscriptPlugin.tsx
var SubscriptPlugin = (0, import_react6.toPlatePlugin)(
  BaseSubscriptPlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleSubscript: {
        keys: [[import_react6.Key.Mod, "comma"]],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleMark(type, {
            remove: editor.getType(SuperscriptPlugin)
          });
        }
      }
    }
  })
);

// src/react/UnderlinePlugin.tsx
var import_react7 = require("@udecode/plate/react");
var UnderlinePlugin = (0, import_react7.toPlatePlugin)(
  BaseUnderlinePlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleUnderline: {
        keys: [[import_react7.Key.Mod, "u"]],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleMark(type);
        }
      }
    }
  })
);

// src/react/BasicMarksPlugin.tsx
var BasicMarksPlugin = (0, import_react8.toPlatePlugin)(BaseBasicMarksPlugin, {
  plugins: [
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    UnderlinePlugin
  ]
});

// src/react/SkipMarkPlugin.ts
var import_react9 = require("@udecode/plate/react");

// src/lib/BaseSkipMarkPlugin.ts
var import_plate9 = require("@udecode/plate");
var BaseSkipMarkPlugin = (0, import_plate9.createTSlatePlugin)({
  key: "skip-mark",
  options: {
    query: {
      allow: []
    }
  }
}).overrideEditor(({ editor, getOption, tf: { insertText } }) => ({
  transforms: {
    insertText(text, options) {
      if (import_plate9.RangeApi.isExpanded(editor.selection))
        return insertText(text, options);
      const allow = getOption("query").allow;
      const textNode = editor.api.node({
        mode: "lowest",
        match: (node) => {
          if (import_plate9.TextApi.isText(node)) {
            return allow.some((key) => !!node[key]);
          }
        }
      });
      if (!textNode) return insertText(text, options);
      const nextPoint = editor.api.start(textNode[1], { next: true });
      const nextNode = nextPoint && editor.api.node({
        at: nextPoint,
        mode: "lowest",
        match: (node) => {
          if (import_plate9.TextApi.isText(node)) {
            return allow.some((key) => !!node[key]);
          }
        }
      });
      const isBetweenSameMarks = nextNode && allow.findIndex((key) => !!textNode[0][key]) === allow.findIndex((key) => !!nextNode[0][key]);
      if (!isBetweenSameMarks && editor.api.isEnd(editor.selection?.focus, textNode[1])) {
        editor.tf.removeMarks(allow);
        insertText(text, options);
        return;
      }
      return insertText(text, options);
    }
  }
}));

// src/react/SkipMarkPlugin.ts
var SkipMarkPlugin = (0, import_react9.toPlatePlugin)(BaseSkipMarkPlugin);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BasicMarksPlugin,
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  SkipMarkPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin
});
//# sourceMappingURL=index.js.map