import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig } from '@udecode/plate';

declare const BaseBasicMarksPlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"basicMarks", {}, {}, {}, {}>>;

/** Enables support for bold formatting */
declare const BaseBoldPlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"bold", {}, {}, {}, {}>>;

/** Enables support for code formatting */
declare const BaseCodePlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"code", {}, {}, {}, {}>>;

/** Enables support for italic formatting. */
declare const BaseItalicPlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"italic", {}, {}, {}, {}>>;

type SkipMarkConfig = PluginConfig<'skip-mark', {
    query: {
        allow: string[];
    };
}>;
declare const BaseSkipMarkPlugin: _udecode_plate_core.SlatePlugin<SkipMarkConfig>;

/** Enables support for strikethrough formatting. */
declare const BaseStrikethroughPlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"strikethrough", {}, {}, {}, {}>>;

/** Enables support for subscript formatting. */
declare const BaseSubscriptPlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"subscript", {}, {}, {}, {}>>;

/** Enables support for superscript formatting. */
declare const BaseSuperscriptPlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"superscript", {}, {}, {}, {}>>;

/** Enables support for underline formatting. */
declare const BaseUnderlinePlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"underline", {}, {}, {}, {}>>;

export { BaseBasicMarksPlugin, BaseBoldPlugin, BaseCodePlugin, BaseItalicPlugin, BaseSkipMarkPlugin, BaseStrikethroughPlugin, BaseSubscriptPlugin, BaseSuperscriptPlugin, BaseUnderlinePlugin, type SkipMarkConfig };
