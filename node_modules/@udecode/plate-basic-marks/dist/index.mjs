// src/lib/BaseBasicMarksPlugin.ts
import { createSlatePlugin as createSlatePlugin8 } from "@udecode/plate";

// src/lib/BaseBoldPlugin.ts
import { createSlatePlugin, someHtmlElement } from "@udecode/plate";
var BaseBoldPlugin = createSlatePlugin({
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
        query: ({ element }) => !someHtmlElement(
          element,
          (node) => node.style.fontWeight === "normal"
        )
      }
    }
  }
});

// src/lib/BaseCodePlugin.ts
import { createSlatePlugin as createSlatePlugin2, findHtmlParentElement } from "@udecode/plate";
var BaseCodePlugin = createSlatePlugin2({
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
          const blockAbove = findHtmlParentElement(element, "P");
          if (blockAbove?.style.fontFamily === "Consolas") return false;
          return !findHtmlParentElement(element, "PRE");
        }
      }
    }
  }
});

// src/lib/BaseItalicPlugin.ts
import { createSlatePlugin as createSlatePlugin3, someHtmlElement as someHtmlElement2 } from "@udecode/plate";
var BaseItalicPlugin = createSlatePlugin3({
  key: "italic",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["EM", "I"] },
          { validStyle: { fontStyle: "italic" } }
        ],
        query: ({ element }) => !someHtmlElement2(
          element,
          (node) => node.style.fontStyle === "normal"
        )
      }
    }
  }
});

// src/lib/BaseStrikethroughPlugin.ts
import { createSlatePlugin as createSlatePlugin4, someHtmlElement as someHtmlElement3 } from "@udecode/plate";
var BaseStrikethroughPlugin = createSlatePlugin4({
  key: "strikethrough",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["S", "DEL", "STRIKE"] },
          { validStyle: { textDecoration: "line-through" } }
        ],
        query: ({ element }) => !someHtmlElement3(
          element,
          (node) => node.style.textDecoration === "none"
        )
      }
    }
  }
});

// src/lib/BaseSubscriptPlugin.ts
import { createSlatePlugin as createSlatePlugin5 } from "@udecode/plate";
var BaseSubscriptPlugin = createSlatePlugin5({
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
import { createSlatePlugin as createSlatePlugin6 } from "@udecode/plate";
var BaseSuperscriptPlugin = createSlatePlugin6({
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
import { createSlatePlugin as createSlatePlugin7, someHtmlElement as someHtmlElement4 } from "@udecode/plate";
var BaseUnderlinePlugin = createSlatePlugin7({
  key: "underline",
  node: { isLeaf: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          { validNodeName: ["U"] },
          { validStyle: { textDecoration: ["underline"] } }
        ],
        query: ({ element }) => !someHtmlElement4(
          element,
          (node) => node.style.textDecoration === "none"
        )
      }
    }
  }
});

// src/lib/BaseBasicMarksPlugin.ts
var BaseBasicMarksPlugin = createSlatePlugin8({
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

// src/lib/BaseSkipMarkPlugin.ts
import {
  createTSlatePlugin,
  RangeApi,
  TextApi
} from "@udecode/plate";
var BaseSkipMarkPlugin = createTSlatePlugin({
  key: "skip-mark",
  options: {
    query: {
      allow: []
    }
  }
}).overrideEditor(({ editor, getOption, tf: { insertText } }) => ({
  transforms: {
    insertText(text, options) {
      if (RangeApi.isExpanded(editor.selection))
        return insertText(text, options);
      const allow = getOption("query").allow;
      const textNode = editor.api.node({
        mode: "lowest",
        match: (node) => {
          if (TextApi.isText(node)) {
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
          if (TextApi.isText(node)) {
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
export {
  BaseBasicMarksPlugin,
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseSkipMarkPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin
};
//# sourceMappingURL=index.mjs.map