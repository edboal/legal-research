import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';

/**
 * Enables support for basic marks:
 *
 * - Bold
 * - Code
 * - Italic
 * - Strikethrough
 * - Subscript
 * - Superscript
 * - Underline
 */
declare const BasicMarksPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"basicMarks", {}, {}, {}, {}>>;

declare const BoldPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"bold", {}, {}, {}, {}>>;

declare const CodePlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"code", {}, {}, {}, {}>>;

declare const ItalicPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"italic", {}, {}, {}, {}>>;

declare const SkipMarkPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"skip-mark", {
    query: {
        allow: string[];
    };
}, {}, {}, {}>>;

declare const StrikethroughPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"strikethrough", {}, {}, {}, {}>>;

declare const SubscriptPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"subscript", {}, {}, {}, {}>>;

declare const SuperscriptPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"superscript", {}, {}, {}, {}>>;

declare const UnderlinePlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"underline", {}, {}, {}, {}>>;

export { BasicMarksPlugin, BoldPlugin, CodePlugin, ItalicPlugin, SkipMarkPlugin, StrikethroughPlugin, SubscriptPlugin, SuperscriptPlugin, UnderlinePlugin };
