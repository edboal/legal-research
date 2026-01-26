var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/internal/HotkeysProvider.tsx
import React2, {
  createContext as createContext2,
  useCallback,
  useContext as useContext2,
  useState
} from "react";

// src/internal/BoundHotkeysProxyProvider.tsx
import React, { createContext, useContext } from "react";
var BoundHotkeysProxyProvider = createContext(void 0);
var useBoundHotkeysProxy = () => {
  return useContext(BoundHotkeysProxyProvider);
};
function BoundHotkeysProxyProviderProvider({
  addHotkey,
  children,
  removeHotkey
}) {
  return /* @__PURE__ */ React.createElement(BoundHotkeysProxyProvider.Provider, { value: { addHotkey, removeHotkey } }, children);
}

// src/internal/deepEqual.ts
function deepEqual(x, y) {
  return x && y && typeof x === "object" && typeof y === "object" ? Object.keys(x).length === Object.keys(y).length && Object.keys(x).reduce(
    (isEqual, key) => isEqual && deepEqual(x[key], y[key]),
    true
  ) : x === y;
}

// src/internal/HotkeysProvider.tsx
var HotkeysContext = createContext2({
  activeScopes: [],
  // This array has to be empty instead of containing '*' as default, to check if the provider is set or not
  disableScope: () => {
  },
  enableScope: () => {
  },
  hotkeys: [],
  toggleScope: () => {
  }
});
var useHotkeysContext = () => {
  return useContext2(HotkeysContext);
};
var HotkeysProvider = ({
  children,
  initiallyActiveScopes = ["*"]
}) => {
  const [internalActiveScopes, setInternalActiveScopes] = useState(
    initiallyActiveScopes
  );
  const [boundHotkeys, setBoundHotkeys] = useState([]);
  const enableScope = useCallback((scope) => {
    setInternalActiveScopes((prev) => {
      if (prev.includes("*")) {
        return [scope];
      }
      return Array.from(/* @__PURE__ */ new Set([...prev, scope]));
    });
  }, []);
  const disableScope = useCallback((scope) => {
    setInternalActiveScopes((prev) => {
      return prev.filter((s) => s !== scope);
    });
  }, []);
  const toggleScope = useCallback((scope) => {
    setInternalActiveScopes((prev) => {
      if (prev.includes(scope)) {
        return prev.filter((s) => s !== scope);
      } else {
        if (prev.includes("*")) {
          return [scope];
        }
        return Array.from(/* @__PURE__ */ new Set([...prev, scope]));
      }
    });
  }, []);
  const addBoundHotkey = useCallback((hotkey) => {
    setBoundHotkeys((prev) => [...prev, hotkey]);
  }, []);
  const removeBoundHotkey = useCallback((hotkey) => {
    setBoundHotkeys((prev) => prev.filter((h) => !deepEqual(h, hotkey)));
  }, []);
  return /* @__PURE__ */ React2.createElement(
    HotkeysContext.Provider,
    {
      value: {
        activeScopes: internalActiveScopes,
        disableScope,
        enableScope,
        hotkeys: boundHotkeys,
        toggleScope
      }
    },
    /* @__PURE__ */ React2.createElement(
      BoundHotkeysProxyProviderProvider,
      {
        addHotkey: addBoundHotkey,
        removeHotkey: removeBoundHotkey
      },
      children
    )
  );
};

// src/internal/parseHotkeys.ts
var reservedModifierKeywords = /* @__PURE__ */ new Set([
  "shift",
  "alt",
  "meta",
  "mod",
  "ctrl",
  "control"
]);
var mappedKeys = {
  AltLeft: "alt",
  AltRight: "alt",
  ControlLeft: "ctrl",
  ControlRight: "ctrl",
  MetaLeft: "meta",
  MetaRight: "meta",
  OSLeft: "meta",
  OSRight: "meta",
  ShiftLeft: "shift",
  ShiftRight: "shift",
  down: "arrowdown",
  esc: "escape",
  left: "arrowleft",
  return: "enter",
  right: "arrowright",
  up: "arrowup"
};
function mapKey(key) {
  return (mappedKeys[key.trim()] || key.trim()).toLowerCase().replace(/key|digit|numpad/, "");
}
function isHotkeyModifier(key) {
  return reservedModifierKeywords.has(key);
}
function parseKeysHookInput(keys, delimiter = ",") {
  return keys.toLowerCase().split(delimiter);
}
function parseHotkey(hotkey, splitKey = "+", useKey = false, description) {
  const keys = hotkey.toLocaleLowerCase().split(splitKey).map((k) => mapKey(k));
  const modifiers = {
    alt: keys.includes("alt"),
    ctrl: keys.includes("ctrl") || keys.includes("control"),
    meta: keys.includes("meta"),
    mod: keys.includes("mod"),
    shift: keys.includes("shift"),
    useKey
  };
  const singleCharKeys = keys.filter((k) => !reservedModifierKeywords.has(k));
  return __spreadProps(__spreadValues({}, modifiers), {
    description,
    keys: singleCharKeys
  });
}

// src/internal/isHotkeyPressed.ts
(() => {
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", (e) => {
      if (e.code === void 0) {
        return;
      }
      pushToCurrentlyPressedKeys([mapKey(e.code)]);
    });
    document.addEventListener("keyup", (e) => {
      if (e.code === void 0) {
        return;
      }
      removeFromCurrentlyPressedKeys([mapKey(e.code)]);
    });
  }
  if (typeof window !== "undefined") {
    window.addEventListener("blur", () => {
      currentlyPressedKeys.clear();
    });
  }
})();
var currentlyPressedKeys = /* @__PURE__ */ new Set();
function isReadonlyArray(value) {
  return Array.isArray(value);
}
function isHotkeyPressed(key, delimiter = ",") {
  const hotkeyArray = isReadonlyArray(key) ? key : key.split(delimiter);
  return hotkeyArray.every(
    (hotkey) => currentlyPressedKeys.has(hotkey.trim().toLowerCase())
  );
}
function pushToCurrentlyPressedKeys(key) {
  const hotkeyArray = Array.isArray(key) ? key : [key];
  if (currentlyPressedKeys.has("meta")) {
    currentlyPressedKeys.forEach(
      (key2) => !isHotkeyModifier(key2) && currentlyPressedKeys.delete(key2.toLowerCase())
    );
  }
  hotkeyArray.forEach(
    (hotkey) => currentlyPressedKeys.add(hotkey.toLowerCase())
  );
}
function removeFromCurrentlyPressedKeys(key) {
  const hotkeyArray = Array.isArray(key) ? key : [key];
  if (key === "meta") {
    currentlyPressedKeys.clear();
  } else {
    hotkeyArray.forEach(
      (hotkey) => currentlyPressedKeys.delete(hotkey.toLowerCase())
    );
  }
}

// src/internal/key.ts
var Key = {
  /** Changes the input mode on an external audio/video receiver (AVR) unit. */
  AVRInput: "AVRInput",
  /** Toggles the power on an external AVR unit. */
  AVRPower: "AVRPower",
  /**
   * The Accept, Commit, or OK key or button. Accepts the currently selected
   * option or input method sequence conversion.
   */
  Accept: "Accept",
  /** The numeric keypad's addition key, +. */
  Add: "Add",
  /** The Again key. Redoes or repeats a previous action. */
  Again: "Again",
  /**
   * The All Candidates key, which starts multi-candidate mode, in which
   * multiple candidates are displayed for the ongoing input.
   */
  AllCandidates: "AllCandidates",
  /** The Alphanumeric key. */
  Alphanumeric: "Alphanumeric",
  /**
   * The Alt (Alternative) key. This is the Option ⌥ key on Mac, or the Alt key
   * on Windows.
   */
  Alt: "Alt",
  /**
   * The AltGr or AltGraph (Alternate Graphics) key. Enables the ISO Level 3
   * shift modifier (where Shift is the level 2 modifier).
   */
  AltGraph: "AltGraph",
  /**
   * Presents a list of recently-used applications which lets the user change
   * apps quickly.
   */
  AppSwitch: "AppSwitch",
  /** The down arrow key. */
  ArrowDown: "ArrowDown",
  /** The left arrow key. */
  ArrowLeft: "ArrowLeft",
  /** The right arrow key. */
  ArrowRight: "ArrowRight",
  /** The up arrow key. */
  ArrowUp: "ArrowUp",
  /** The Attn (Attention) key. */
  Attn: "Attn",
  /** Adjusts audio balance toward the left. */
  AudioBalanceLeft: "AudioBalanceLeft",
  /** Adjusts audio balance twoard the right. */
  AudioBalanceRight: "AudioBalanceRight",
  /**
   * Reduces bass boosting or cycles downward through bass boost modes or
   * states.
   */
  AudioBassBoostDown: "AudioBassBoostDown",
  /** Toggles bass boosting on and off. */
  AudioBassBoostToggle: "AudioBassBoostToggle",
  /**
   * Increases the amoung of bass boosting, or cycles upward through a set of
   * bass boost modes or states.
   */
  AudioBassBoostUp: "AudioBassBoostUp",
  /** Decreases the amount of bass. */
  AudioBassDown: "AudioBassDown",
  /** Increases the amount of bass. */
  AudioBassUp: "AudioBassUp",
  /** Adjusts the audio fader toward the front. */
  AudioFaderFront: "AudioFaderFront",
  /** Adjustts the audio fader toward the rear. */
  AudioFaderRear: "AudioFaderRear",
  /** Selects the next available surround sound mode. */
  AudioSurroundModeNext: "AudioSurroundModeNext",
  /** Decreases the amount of treble. */
  AudioTrebleDown: "AudioTrebleDown",
  /** Increases the amount of treble. */
  AudioTrebleUp: "AudioTrebleUp",
  /** Decreases the audio volume. */
  AudioVolumeDown: "AudioVolumeDown",
  /** Mutes the audio. */
  AudioVolumeMute: "AudioVolumeMute",
  /** Increases the audio volume. */
  AudioVolumeUp: "AudioVolumeUp",
  /** The Backspace key. This key is labeled Delete on Mac keyboards. */
  Backspace: "Backspace",
  /**
   * The Brightness Down key. Typically used to reduce the brightness of the
   * display.
   */
  BrightnessDown: "BrightnessDown",
  /** The Brightness Up key. Typically increases the brightness of the display. */
  BrightnessUp: "BrightnessUp",
  /**
   * Navigates to the previous content or page in the current Web view's
   * history.
   */
  BrowserBack: "BrowserBack",
  /** Opens the user's list of bookmarks/favorites. */
  BrowserFavorites: "BrowserFavorites",
  /** Navigates to the next content or page in the current Web view's history. */
  BrowserForward: "BrowserForward",
  /** Navigates to the user's preferred home page. */
  BrowserHome: "BrowserHome",
  /** Refreshes the current page or contentl. */
  BrowserRefresh: "BrowserRefresh",
  /**
   * Activates the user's preferred search engine or the search interface within
   * their browser.
   */
  BrowserSearch: "BrowserSearch",
  /** Stops loading the currently displayed Web view or content. */
  BrowserStop: "BrowserStop",
  /** The Call key; dials the number which has been entered. */
  Call: "Call",
  /** The Camera key; activates the camera. */
  Camera: "Camera",
  /** The Focus key; focuses the camera. */
  CameraFocus: "CameraFocus",
  /** The Cancel key. */
  Cancel: "Cancel",
  /**
   * The Caps Lock key. Toggles the capital character lock on and off for
   * subsequent input.
   */
  CapsLock: "CapsLock",
  /** Switches to the previous channel. */
  ChannelDown: "ChannelDown",
  /** Switches to the next channel. */
  ChannelUp: "ChannelUp",
  /** The Clear key. Removes the currently selected input. */
  Clear: "Clear",
  /** Closes the current document or message. Must not exit the application. */
  Close: "Close",
  /** Toggles closed captioning on and off. */
  ClosedCaptionToggle: "ClosedCaptionToggle",
  /**
   * The Code Input key, which enables code input mode, which lets the user
   * enter characters by typing their code points (their Unicode character
   * numbers, typically).
   */
  CodeInput: "CodeInput",
  /**
   * General-purpose media function key, color-coded red; this has index 0 among
   * the colored keys.
   */
  ColorF0Red: "ColorF0Red",
  /**
   * General-purpose media funciton key, color-coded green; this has index 1
   * among the colored keys.
   */
  ColorF1Green: "ColorF1Green",
  /**
   * General-purpose media funciton key, color-coded yellow; this has index 2
   * among the colored keys.
   */
  ColorF2Yellow: "ColorF2Yellow",
  /**
   * General-purpose media funciton key, color-coded blue; this has index 3
   * among the colored keys.
   */
  ColorF3Blue: "ColorF3Blue",
  /**
   * General-purpose media funciton key, color-coded grey; this has index 4
   * among the colored keys.
   */
  ColorF4Grey: "ColorF4Grey",
  /**
   * General-purpose media funciton key, color-coded brown; this has index 5
   * among the colored keys.
   */
  ColorF5Brown: "ColorF5Brown",
  /** The Compose key. */
  Compose: "Compose",
  /**
   * Shows the context menu. Typically found between the Windows (or OS) key and
   * the Control key on the right side of the keyboard.
   */
  ContextMenu: "ContextMenu",
  /** The Control, Ctrl, or Ctl key. Allows typing control characters. */
  Control: "Control",
  /**
   * The Convert key, which instructs the IME to convert the current input
   * method sequence into the resulting character.
   */
  Convert: "Convert",
  /** The Copy key (on certain extended keyboards). */
  Copy: "Copy",
  /** The Cursor Select key, CrSel. */
  CrSel: "CrSel",
  /** The Cut key (on certain extended keyboards). */
  Cut: "Cut",
  /** Switches the input source to the Digital Video Recorder (DVR). */
  DVR: "DVR",
  /**
   * A dead "combining" key; that is, a key which is used in tandem with other
   * keys to generate accented and other modified characters. If pressed by
   * itself, it doesn't generate a character. If you wish to identify which
   * specific dead key was pressed (in cases where more than one exists), you
   * can do so by examining the KeyboardEvent's associated compositionupdate
   * event's data property.
   */
  Dead: "Dead",
  /**
   * The decimal point key (typically . or , depending on the region. In newer
   * browsers, this value to simply be the character generated by the decimal
   * key (one of those two characters). [1]
   */
  Decimal: "Decimal",
  /** The Delete key, Del. */
  Delete: "Delete",
  /**
   * Adjusts the brightness of the device by toggling between two brightness
   * levels or by cycling among multiple brightness levels.
   */
  Dimmer: "Dimmer",
  /** Cycles among video sources. */
  DisplaySwap: "DisplaySwap",
  /** The numeric keypad's division key, /. */
  Divide: "Divide",
  /**
   * The Eisu key. This key's purpose is defined by the IME, but may be used to
   * close the IME.
   */
  Eisu: "Eisu",
  /**
   * The Eject key. Ejects removable media (or toggles an optical storage device
   * tray open and closed).
   */
  Eject: "Eject",
  /** The End key. Moves to the end of content. */
  End: "End",
  /** The End Call or Hang Up button. */
  EndCall: "EndCall",
  /** The Enter or ↵ key (sometimes labeled Return). */
  Enter: "Enter",
  /**
   * Erase to End of Field. Deletes all characters from the current cursor
   * position to the end of the current field.
   */
  EraseEof: "EraseEof",
  /**
   * The Esc (Escape) key. Typically used as an exit, cancel, or "escape this
   * operation" button. Historically, the Escape character was used to signal
   * the start of a special control sequence of characters called an "escape
   * sequence."
   */
  Escape: "Escape",
  /** The ExSel (Extend Selection) key. */
  ExSel: "ExSel",
  /** The Execute key. */
  Execute: "Execute",
  /** The Exit button, which exits the curreent application or menu. */
  Exit: "Exit",
  /** The first general-purpose function key, F1. */
  F1: "F1",
  /** The F2 key. */
  F2: "F2",
  /** The F3 key. */
  F3: "F3",
  /** The F4 key. */
  F4: "F4",
  /** The F5 key. */
  F5: "F5",
  /** The F6 key. */
  F6: "F6",
  /** The F7 key. */
  F7: "F7",
  /** The F8 key. */
  F8: "F8",
  /** The F9 key. */
  F9: "F9",
  /** The F10 key. */
  F10: "F10",
  /** The F11 key. */
  F11: "F11",
  /** The F12 key. */
  F12: "F12",
  /** The F13 key. */
  F13: "F13",
  /** The F14 key. */
  F14: "F14",
  /** The F15 key. */
  F15: "F15",
  /** The F16 key. */
  F16: "F16",
  /** The F17 key. */
  F17: "F17",
  /** The F18 key. */
  F18: "F18",
  /** The F19 key. */
  F19: "F19",
  /** The F20 key. */
  F20: "F20",
  /** Clears the program or content stored in the first favorites list slot. */
  FavoriteClear0: "FavoriteClear0",
  /** Clears the program or content stored in the second favorites list slot. */
  FavoriteClear1: "FavoriteClear1",
  /** Clears the program or content stored in the third favorites list slot. */
  FavoriteClear2: "FavoriteClear2",
  /** Clears the program or content stored in the fourth favorites list slot. */
  FavoriteClear3: "FavoriteClear3",
  /**
   * Selects (recalls) the program or content stored in the first favorites list
   * slot.
   */
  FavoriteRecall0: "FavoriteRecall0",
  /**
   * Selects (recalls) the program or content stored in the second favorites
   * list slot.
   */
  FavoriteRecall1: "FavoriteRecall1",
  /**
   * Selects (recalls) the program or content stored in the third favorites list
   * slot.
   */
  FavoriteRecall2: "FavoriteRecall2",
  /**
   * Selects (recalls) the program or content stored in the fourth favorites
   * list slot.
   */
  FavoriteRecall3: "FavoriteRecall3",
  /** Stores the current program or content into the first favorites list slot. */
  FavoriteStore0: "FavoriteStore0",
  /** Stores the current program or content into the second favorites list slot. */
  FavoriteStore1: "FavoriteStore1",
  /** Stores the current program or content into the third favorites list slot. */
  FavoriteStore2: "FavoriteStore2",
  /** Stores the current program or content into the fourth favorites list slot. */
  FavoriteStore3: "FavoriteStore3",
  /**
   * The Final (Final Mode) key is used on some Asian keyboards to enter final
   * mode when using IMEs.
   */
  FinalMode: "FinalMode",
  /**
   * The Find key. Opens an interface (typically a dialog box) for performing a
   * find/search operation.
   */
  Find: "Find",
  /** The Finish key. */
  Finish: "Finish",
  /**
   * The Fn (Function modifier) key. Used to allow generating function key
   * (F1-F15, for instance) characters on keyboards without a dedicated function
   * key area. Often handled in hardware so that events aren't generated for
   * this key.
   */
  Fn: "Fn",
  /**
   * The FnLock or F-Lock (Function Lock) key.Toggles the function key mode
   * described by "Fn" on and off. Often handled in hardware so that events
   * aren't generated for this key.
   */
  FnLock: "FnLock",
  /** The Back button. */
  GoBack: "GoBack",
  /**
   * The Home button, which takes the user to the phone's main screen (usually
   * an application launcher).
   */
  GoHome: "GoHome",
  /**
   * Switches to the first character group on an ISO/IEC 9995 keyboard. Each key
   * may have multiple groups of characters, each in its own column. Pressing
   * this key instructs the device to interpret keypresses as coming from the
   * first column on subsequent keystrokes.
   */
  GroupFirst: "GroupFirst",
  /** Switches to the last character group on an ISO/IEC 9995 keyboard. */
  GroupLast: "GroupLast",
  /** Switches to the next character group on an ISO/IEC 9995 keyboard. */
  GroupNext: "GroupNext",
  /** Switches to the previous character group on an ISO/IEC 9995 keyboard. */
  GroupPrevious: "GroupPrevious",
  /** Toggles the display of the program or content guide. */
  Guide: "Guide",
  /**
   * If the guide is currently displayed, this button tells the guide to display
   * the next day's content.
   */
  GuideNextDay: "GuideNextDay",
  /**
   * If the guide is currently displayed, this button tells the guide to display
   * the previous day's content.
   */
  GuidePreviousDay: "GuidePreviousDay",
  /**
   * The Hangul (Korean character set) mode key, which toggles between Hangul
   * and English entry modes.
   */
  HangulMode: "HangulMode",
  /**
   * Selects the Hanja mode, for converting Hangul characters to the more
   * specific Hanja characters.
   */
  HanjaMode: "HanjaMode",
  /** The Hankaku (half-width characters) key. */
  Hankaku: "Hankaku",
  /**
   * The Headset Hook key. This is typically actually a button on the headset
   * which is used to hang up calls and play or pause media.
   */
  HeadsetHook: "HeadsetHook",
  /** The Help key. Opens or toggles the display of help information. */
  Help: "Help",
  /**
   * The Hibernate key. This saves the state of the computer to disk and then
   * shuts down; the computer can be returned to its previous state by restoring
   * the saved state information.
   */
  Hibernate: "Hibernate",
  /** The Hiragana key; selects Kana characters mode. */
  Hiragana: "Hiragana",
  /** Toggles between the Hiragana and Katakana writing systems. */
  HiraganaKatakana: "HiraganaKatakana",
  /** The Home key. Moves to the start of content. */
  Home: "Home",
  /** The Hyper key. */
  Hyper: "Hyper",
  /**
   * Toggles the display of information about the currently selected content,
   * program, or media.
   */
  Info: "Info",
  /** The Insert key, Ins. Toggles between inserting and overwriting text. */
  Insert: "Insert",
  /**
   * Tellls the device to perform an instant replay (typically some form of
   * jumping back a short amount of time then playing it again, possibly but not
   * usually in slow motion).
   */
  InstantReplay: "InstantReplay",
  /**
   * Selects the Junja mode, in which Korean is represented using single-byte
   * Latin characters.
   */
  JunjaMode: "JunjaMode",
  /** The Kana Mode (Kana Lock) key. */
  KanaMode: "KanaMode",
  /**
   * The Kanji Mode key. Enables entering Japanese text using the ideographic
   * characters of Chinese origin.
   */
  KanjiMode: "KanjiMode",
  /** The Katakana key. */
  Katakana: "Katakana",
  /** The 11 key found on certain media numeric keypads. */
  Key11: "Key11",
  /** The 12 key found on certain media numeric keypads. */
  Key12: "Key12",
  /** The Redial button, which redials the last-called number. */
  LastNumberRedial: "LastNumberRedial",
  /** The first generic application launcher button. */
  LaunchApplication1: "LaunchApplication1",
  /** The second generic application launcher button. */
  LaunchApplication2: "LaunchApplication2",
  /** The third generic application launcher button. */
  LaunchApplication3: "LaunchApplication3",
  /** The fourth generic application launcher button. */
  LaunchApplication4: "LaunchApplication4",
  /** The fifth generic application launcher button. */
  LaunchApplication5: "LaunchApplication5",
  /** The sixth generic application launcher button. */
  LaunchApplication6: "LaunchApplication6",
  /** The seventh generic application launcher button. */
  LaunchApplication7: "LaunchApplication7",
  /** The eighth generic application launcher button. */
  LaunchApplication8: "LaunchApplication8",
  /** The ninth generic application launcher button. */
  LaunchApplication9: "LaunchApplication9",
  /** The 10th generic application launcher button. */
  LaunchApplication10: "LaunchApplication10",
  /** The 11th generic application launcher button. */
  LaunchApplication11: "LaunchApplication11",
  /** The 12th generic application launcher button. */
  LaunchApplication12: "LaunchApplication12",
  /** The 13th generic application launcher button. */
  LaunchApplication13: "LaunchApplication13",
  /** The 14th generic application launcher button. */
  LaunchApplication14: "LaunchApplication14",
  /** The 15th generic application launcher button. */
  LaunchApplication15: "LaunchApplication15",
  /** The 16th generic application launcher button. */
  LaunchApplication16: "LaunchApplication16",
  /**
   * The Calculator key, often labeled with an icon such as . This is often used
   * as a generic application launcher key (APPCOMMAND_LAUNCH_APP2).
   */
  LaunchCalculator: "LaunchCalculator",
  /** The Calendar key, often labeled with an icon like . */
  LaunchCalendar: "LaunchCalendar",
  /** The Contacts key. */
  LaunchContacts: "LaunchContacts",
  /** The Mail key. This is often displayed as . */
  LaunchMail: "LaunchMail",
  /** The Media Player key. */
  LaunchMediaPlayer: "LaunchMediaPlayer",
  /** The Music Player key, often labeled with an icon such as . */
  LaunchMusicPlayer: "LaunchMusicPlayer",
  /**
   * The My Computer key on Windows keyboards. This is often used as a generic
   * application launcher key (APPCOMMAND_LAUNCH_APP1).
   */
  LaunchMyComputer: "LaunchMyComputer",
  /** The Phone key, to open the phone dialer application if one is present. */
  LaunchPhone: "LaunchPhone",
  /** The Screen Saver key. */
  LaunchScreenSaver: "LaunchScreenSaver",
  /**
   * The Spreadsheet key. This key may be labeled with an icon such as or that
   * of a specific spreadsheet application.
   */
  LaunchSpreadsheet: "LaunchSpreadsheet",
  /**
   * The Web Browser key. This key is frequently labeled with an icon such as or
   * the icon of a specific browser, depending on the device manufacturer.
   */
  LaunchWebBrowser: "LaunchWebBrowser",
  /** The WebCam key. Opens the webcam application. */
  LaunchWebCam: "LaunchWebCam",
  /**
   * The Word Processor key. This may be an icon of a specific word processor
   * application, or a generic document icon.
   */
  LaunchWordProcessor: "LaunchWordProcessor",
  /** Opens content liniked to the current program, if available and possible. */
  Link: "Link",
  /** Lists the current program. */
  ListProgram: "ListProgram",
  /** Toggles a display listing currently available live content or programs. */
  LiveContent: "LiveContent",
  /** Locks or unlocks the currently selected content or pgoram. */
  Lock: "Lock",
  /** The LogOff key. */
  LogOff: "LogOff",
  /** Opens the user interface to forward a message. */
  MailForward: "MailForward",
  /** Opens the user interface to reply to a message. */
  MailReply: "MailReply",
  /** Sends the current message. */
  MailSend: "MailSend",
  /**
   * A button which cycles among the notification modes: silent, vibrate, ring,
   * and so forth.
   */
  MannerMode: "MannerMode",
  /**
   * Presents a list of media applications, such as photo viewers, audio and
   * video players, and games. [1]
   */
  MediaApps: "MediaApps",
  /** The Audio Track key. */
  MediaAudioTrack: "MediaAudioTrack",
  /** Starts, continues, or increases the speed of fast forwarding the media. */
  MediaFastForward: "MediaFastForward",
  /** Jumps back to the last-viewed content, program, or other media. */
  MediaLast: "MediaLast",
  /**
   * Pauses the currently playing media. Some older applications use simply
   * "Pause" but this is not correct.
   */
  MediaPause: "MediaPause",
  /**
   * Starts or continues playing media at normal speed, if not already doing so.
   * Has no effect otherwise.
   */
  MediaPlay: "MediaPlay",
  /** Toggles between playing and pausing the current media. */
  MediaPlayPause: "MediaPlayPause",
  /** Starts or resumes recording media. */
  MediaRecord: "MediaRecord",
  /** Starts, continues, or increases the speed of rewinding the media. */
  MediaRewind: "MediaRewind",
  /** Skips backward to the previous content or program. */
  MediaSkipBackward: "MediaSkipBackward",
  /** Skips forward to the next content or program. */
  MediaSkipForward: "MediaSkipForward",
  /** Steps backward to the previous content or program. */
  MediaStepBackward: "MediaStepBackward",
  /** Steps forward to the next content or program. */
  MediaStepForward: "MediaStepForward",
  /**
   * Stops the current media activity (such as playing, recording, pausing,
   * forwarding, or rewinding). Has no effect if the media is currently stopped
   * already.
   */
  MediaStop: "MediaStop",
  /**
   * Top Menu button; opens the media's main menu, such as on a DVD or Blu-Ray
   * disc.
   */
  MediaTopMenu: "MediaTopMenu",
  /** Seeks to the next media or program track. */
  MediaTrackNext: "MediaTrackNext",
  /** Seeks to the previous media or program track. */
  MediaTrackPrevious: "MediaTrackPrevious",
  /**
   * The Meta key. Allows issuing special command inputs. This is the Windows
   * logo key, or the Command ⌘ key on Mac.
   */
  Meta: "Meta",
  /** Toggles the microphone on and off. */
  MicrophoneToggle: "MicrophoneToggle",
  /** Decreases the microphone's input volume. */
  MicrophoneVolumeDown: "MicrophoneVolumeDown",
  /** Mutes the microphone input. */
  MicrophoneVolumeMute: "MicrophoneVolumeMute",
  /** Increases the microphone's input volume. */
  MicrophoneVolumeUp: "MicrophoneVolumeUp",
  /** The Mod key. This is the Command ⌘ on Mac, or the Control key on Windows. */
  Mod: "Mod",
  /** The Mode Change key. Toggles or cycles among input modes of IMEs. */
  ModeChange: "ModeChange",
  /** The numeric keypad's multiplication key, *. */
  Multiply: "Multiply",
  /** Navigates into a submenu or option. */
  NavigateIn: "NavigateIn",
  /** Navigates to the next item. */
  NavigateNext: "NavigateNext",
  /** Navigates out of the current screen or menu. */
  NavigateOut: "NavigateOut",
  /** Navigates to the previous item. */
  NavigatePrevious: "NavigatePrevious",
  /** Creates a new document or message. */
  New: "New",
  /**
   * The Next Candidate function key. Selects the next possible match for the
   * ongoing input.
   */
  NextCandidate: "NextCandidate",
  /** Cycles to the next channel in the favorites list. */
  NextFavoriteChannel: "NextFavoriteChannel",
  /**
   * Cycles to the next saved user profile, if this feature is supported and
   * multiple profiles exist.
   */
  NextUserProfile: "NextUserProfile",
  /**
   * The NonConvert ("Don't convert") key. This accepts the current input method
   * sequence without running conversion when using an IME.
   */
  NonConvert: "NonConvert",
  /** The Notification key. */
  Notification: "Notification",
  /**
   * The NumLock (Number Lock) key. Toggles the numeric keypad between number
   * entry some other mode (often directional arrows).
   */
  NumLock: "NumLock",
  /**
   * Opens the user interface for selecting on demand content or programs to
   * watch.
   */
  OnDemand: "OnDemand",
  /** Opens an existing document or message. */
  Open: "Open",
  /**
   * The Page Down (or PgDn) key. Scrolls down or displays the next page of
   * content.
   */
  PageDown: "PageDown",
  /**
   * The Page Up (or PgUp) key. Scrolls up or displays the previous page of
   * content.
   */
  PageUp: "PageUp",
  /** Starts the process of pairing the remote with a device to be controlled. */
  Pairing: "Pairing",
  /** Paste from the clipboard. */
  Paste: "Paste",
  /**
   * The Pause key. Pauses the current application or state, if applicable. This
   * shouldn't be confused with the "MediaPause" key value, which is used for
   * media controllers, rather than to control applications and processes.
   */
  Pause: "Pause",
  /** A button to move the picture-in-picture view downward. */
  PinPDown: "PinPDown",
  /** A button to control moving the picture-in-picture view. */
  PinPMove: "PinPMove",
  /** Toggles display of th epicture-in-picture view on and off. */
  PinPToggle: "PinPToggle",
  /** A button to move the picture-in-picture view upward. */
  PinPUp: "PinPUp",
  /**
   * The Play key. Resumes a previously paused application, if applicable. This
   * shouldn't be confused with the "MediaPlay" key value, which is used for
   * media controllers, rather than to control applications and processes.
   */
  Play: "Play",
  /** Decreases the media playback rate. */
  PlaySpeedDown: "PlaySpeedDown",
  /** Returns the media playback rate to normal. */
  PlaySpeedReset: "PlaySpeedReset",
  /** Increases the media playback rate. */
  PlaySpeedUp: "PlaySpeedUp",
  /**
   * The Power button or key, to toggle power on and off. Not all systems pass
   * this key through to to the user agent.
   */
  Power: "Power",
  /** The PowerOff or PowerDown key. Shuts off the system. */
  PowerOff: "PowerOff",
  /**
   * The Previous Candidate key. Selects the previous possible match for the
   * ongoing input.
   */
  PreviousCandidate: "PreviousCandidate",
  /** Prints the current document or message. */
  Print: "Print",
  /**
   * The PrintScreen or PrtScr key. Sometimes SnapShot. Captures the screen and
   * prints it or saves it to disk.
   */
  PrintScreen: "PrintScreen",
  /** The Process key. Instructs the IME to process the conversion. */
  Process: "Process",
  /** The Props (Properties) key. */
  Props: "Props",
  /** Toggles random media (also known as "shuffle mode") on and off. */
  RandomToggle: "RandomToggle",
  /**
   * A code sent when the remote control's battery is low. This doesn't actually
   * correspond to a physical key at all.
   */
  RcLowBattery: "RcLowBattery",
  /** Cycles among the available media recording speeds. */
  RecordSpeedNext: "RecordSpeedNext",
  /** Redo the last action. */
  Redo: "Redo",
  /**
   * Toggles radio frequency (RF) input bypass mode on and off. RF bypass mode
   * passes RF input directly to the RF output without any processing or
   * filtering.
   */
  RfBypass: "RfBypass",
  /** The Romaji key; selects the Roman character set. */
  Romaji: "Romaji",
  /** Cycles among input modes on an external set-top box (STB). */
  STBInput: "STBInput",
  /** Toggles on and off an external STB. */
  STBPower: "STBPower",
  /** Saves the current document or message. */
  Save: "Save",
  /**
   * Toggles the channel scan mode on and off; this is a mode which flips
   * through channels automatically until the user stops the scan.
   */
  ScanChannelsToggle: "ScanChannelsToggle",
  /** Cycles through the available screen display modes. */
  ScreenModeNext: "ScreenModeNext",
  /** The Scroll Lock key. Toggles beteen scrolling and cursor movement modes. */
  ScrollLock: "ScrollLock",
  /** The Select key. */
  Select: "Select",
  /**
   * The numeric keypad's places separator character (in the United States, this
   * is a comma, but elsewhere it is frequently a period).
   */
  Separator: "Separator",
  /** Toggles display of the device's settings screen on and off. */
  Settings: "Settings",
  /**
   * The Shift key. Modifies keystrokes to allow typing upper (or other) case
   * letters, and to support typing punctuation and other special characters.
   */
  Shift: "Shift",
  /**
   * The Single Candidate key. Enables single candidate mode (as opposed to
   * multi-candidate mode); in this mode, only one candidate is displayed at a
   * time.
   */
  SingleCandidate: "SingleCandidate",
  /** The first general-purpose virtual function key. */
  Soft1: "Soft1",
  /** The second general-purpose virtual function key. */
  Soft2: "Soft2",
  /** The third general-purpose virtual function key. */
  Soft3: "Soft3",
  /** The fourth general-purpose virtual function key. */
  Soft4: "Soft4",
  /**
   * Presents a list of possible corrections for a word which was incorrectly
   * identified.
   */
  SpeechCorrectionList: "SpeechCorrectionList",
  /**
   * Toggles between dictation mode and command/control mode. This lets the
   * speech engine know whether to interpret spoken words as input text or as
   * commands.
   */
  SpeechInputToggle: "SpeechInputToggle",
  /** Starts spell checking the current document. */
  SpellCheck: "SpellCheck",
  /** Toggles split screen display mode on and off. */
  SplitScreenToggle: "SplitScreenToggle",
  /**
   * The Standby key; also known as Suspend or Sleep. This turns off the display
   * and puts the computer in a low power consumption mode, without completely
   * powering off.
   */
  Standby: "Standby",
  /** Toggles the display of subtitles on and off if they're available. */
  Subtitle: "Subtitle",
  /** The numeric keypad's subtraction key, -. */
  Subtract: "Subtract",
  /** The Super key. */
  Super: "Super",
  /** The Symbol modifier key (found on certain virtual keyboards). */
  Symbol: "Symbol",
  /** The Symbol Lock key. */
  SymbolLock: "SymbolLock",
  /** Switches into TV viewing mode. */
  TV: "TV",
  /** Toggles 3D TV mode on and off. */
  TV3DMode: "TV3DMode",
  /** Toggles between antenna and cable inputs. */
  TVAntennaCable: "TVAntennaCable",
  /** Toggles audio description mode on and off. */
  TVAudioDescription: "TVAudioDescription",
  /**
   * Decreases trhe audio description's mixing volume; reduces the volume of the
   * audio descriptions relative to the program sound.
   */
  TVAudioDescriptionMixDown: "TVAudioDescriptionMixDown",
  /**
   * Increases the audio description's mixing volume; increases the volume of
   * the audio descriptions relative to the program sound.
   */
  TVAudioDescriptionMixUp: "TVAudioDescriptionMixUp",
  /**
   * Displays or hides the media contents available for playback (this may be a
   * channel guide showing the currently airing programs, or a list of media
   * files to play).
   */
  TVContentsMenu: "TVContentsMenu",
  /** Displays or hides the TV's data service menu. */
  TVDataService: "TVDataService",
  /** Cycles the input mode on an external TV. */
  TVInput: "TVInput",
  /** Switches to the input "Component 1." */
  TVInputComponent1: "TVInputComponent1",
  /** Switches to the input "Component 2." */
  TVInputComponent2: "TVInputComponent2",
  /** Switches to the input "Composite 1." */
  TVInputComposite1: "TVInputComposite1",
  /** Switches to the input "Composite 2." */
  TVInputComposite2: "TVInputComposite2",
  /** Switches to the input "HDMI 1." */
  TVInputHDMI1: "TVInputHDMI1",
  /** Switches to the input "HDMI 2." */
  TVInputHDMI2: "TVInputHDMI2",
  /** Switches to the input "HDMI 3." */
  TVInputHDMI3: "TVInputHDMI3",
  /** Switches to the input "HDMI 4." */
  TVInputHDMI4: "TVInputHDMI4",
  /** Switches to the input "VGA 1." */
  TVInputVGA1: "TVInputVGA1",
  /** The Media Context menu key. */
  TVMediaContext: "TVMediaContext",
  /** Toggle the TV's network connection on and off. */
  TVNetwork: "TVNetwork",
  /** Put the TV into number entry mode. */
  TVNumberEntry: "TVNumberEntry",
  /** The device's power button. */
  TVPower: "TVPower",
  /** Radio button. */
  TVRadioService: "TVRadioService",
  /** Satellite button. */
  TVSatellite: "TVSatellite",
  /** Broadcast Satellite button. */
  TVSatelliteBS: "TVSatelliteBS",
  /** Communication Satellite button. */
  TVSatelliteCS: "TVSatelliteCS",
  /** Toggles among available satellites. */
  TVSatelliteToggle: "TVSatelliteToggle",
  /**
   * Selects analog terrestrial television service (analog cable or antenna
   * reception).
   */
  TVTerrestrialAnalog: "TVTerrestrialAnalog",
  /**
   * Selects digital terrestrial television service (digital cable or antenna
   * receiption).
   */
  TVTerrestrialDigital: "TVTerrestrialDigital",
  /** Timer programming button. */
  TVTimer: "TVTimer",
  /** The Horizontal Tab key, Tab. */
  Tab: "Tab",
  /** Toggles display of teletext, if available. */
  Teletext: "Teletext",
  /** Undo the last action. */
  Undo: "Undo",
  /**
   * The user agent wasn't able to map the event's virtual keycode to a specific
   * key value. This can happen due to hardware or software constraints, or
   * because of constraints around the platform on which the user agent is
   * running.
   */
  Unidentified: "Unidentified",
  /** Cycles through the available video modes. */
  VideoModeNext: "VideoModeNext",
  /** The Voice Dial key. Initiates voice dialing. */
  VoiceDial: "VoiceDial",
  /**
   * The WakeUp key; used to wake the computer from the hibernation or standby
   * modes.
   */
  WakeUp: "WakeUp",
  /**
   * Causes the device to identify itself in some fashion, such as by flashing a
   * light, briefly changing the brightness of indicator lights, or emitting a
   * tone.
   */
  Wink: "Wink",
  /** The Zenkaku (full width) characters key. */
  Zenkaku: "Zenkaku",
  /** The Zenkaku/Hankaku (full width/half width) toggle key. */
  ZenkakuHanaku: "ZenkakuHanaku",
  /** The ZoomIn key. */
  ZoomIn: "ZoomIn",
  /** The ZoomOut key. */
  ZoomOut: "ZoomOut",
  /**
   * Toggles between full-screen and scaled content display, or otherwise change
   * the magnification level.
   */
  ZoomToggle: "ZoomToggle"
};

// src/internal/useRecordHotkeys.ts
import { useCallback as useCallback2, useState as useState2 } from "react";
function useRecordHotkeys() {
  const [keys, setKeys] = useState2(/* @__PURE__ */ new Set());
  const [isRecording, setIsRecording] = useState2(false);
  const handler = useCallback2((event) => {
    if (event.code === void 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setKeys((prev) => {
      const newKeys = new Set(prev);
      newKeys.add(mapKey(event.code));
      return newKeys;
    });
  }, []);
  const stop = useCallback2(() => {
    if (typeof document !== "undefined") {
      document.removeEventListener("keydown", handler);
      setIsRecording(false);
    }
  }, [handler]);
  const start = useCallback2(() => {
    setKeys(/* @__PURE__ */ new Set());
    if (typeof document !== "undefined") {
      stop();
      document.addEventListener("keydown", handler);
      setIsRecording(true);
    }
  }, [handler, stop]);
  const resetKeys = useCallback2(() => {
    setKeys(/* @__PURE__ */ new Set());
  }, []);
  return [keys, { isRecording, resetKeys, start, stop }];
}

// src/internal/useHotkeys.ts
import {
  useCallback as useCallback3,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef as useRef2,
  useState as useState3
} from "react";

// src/internal/useDeepEqualMemo.ts
import { useRef } from "react";
function useDeepEqualMemo(value) {
  const ref = useRef();
  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
}

// src/internal/validators.ts
function maybePreventDefault(e, hotkey, preventDefault) {
  if (typeof preventDefault === "function" && preventDefault(e, hotkey) || preventDefault === true) {
    e.preventDefault();
  }
}
function isHotkeyEnabled(e, hotkey, enabled) {
  if (typeof enabled === "function") {
    return enabled(e, hotkey);
  }
  return enabled === true || enabled === void 0;
}
function isKeyboardEventTriggeredByInput(ev) {
  return isHotkeyEnabledOnTag(ev, ["input", "textarea", "select"]);
}
function isHotkeyEnabledOnTag({ target }, enabledOnTags = false) {
  const targetTagName = target && target.tagName;
  if (isReadonlyArray(enabledOnTags)) {
    return Boolean(
      targetTagName && (enabledOnTags == null ? void 0 : enabledOnTags.some(
        (tag) => tag.toLowerCase() === targetTagName.toLowerCase()
      ))
    );
  }
  return Boolean(targetTagName && enabledOnTags && enabledOnTags);
}
function isScopeActive(activeScopes, scopes) {
  if (activeScopes.length === 0 && scopes) {
    console.warn(
      'A hotkey has the "scopes" option set, however no active scopes were found. If you want to use the global scopes feature, you need to wrap your app in a <HotkeysProvider>'
    );
    return true;
  }
  if (!scopes) {
    return true;
  }
  return activeScopes.some((scope) => scopes.includes(scope)) || activeScopes.includes("*");
}
var isHotkeyMatchingKeyboardEvent = (e, hotkey, ignoreModifiers = false) => {
  const { alt, ctrl, keys, meta, mod, shift, useKey } = hotkey;
  const { altKey, code, ctrlKey, key: producedKey, metaKey, shiftKey } = e;
  const mappedCode = mapKey(code);
  if (useKey && (keys == null ? void 0 : keys.length) === 1 && keys.includes(producedKey)) {
    return true;
  }
  if (!(keys == null ? void 0 : keys.includes(mappedCode)) && !["alt", "control", "ctrl", "meta", "os", "shift", "unknown"].includes(
    mappedCode
  )) {
    return false;
  }
  if (!ignoreModifiers) {
    if (alt !== altKey && mappedCode !== "alt") {
      return false;
    }
    if (shift !== shiftKey && mappedCode !== "shift") {
      return false;
    }
    if (mod) {
      if (!metaKey && !ctrlKey) {
        return false;
      }
    } else {
      if (meta !== metaKey && mappedCode !== "meta" && mappedCode !== "os") {
        return false;
      }
      if (ctrl !== ctrlKey && mappedCode !== "ctrl" && mappedCode !== "control") {
        return false;
      }
    }
  }
  if (keys && keys.length === 1 && keys.includes(mappedCode)) {
    return true;
  } else if (keys) {
    return isHotkeyPressed(keys);
  } else if (!keys) {
    return true;
  }
  return false;
};

// src/internal/useHotkeys.ts
var stopPropagation = (e) => {
  e.stopPropagation();
  e.preventDefault();
  e.stopImmediatePropagation();
};
var useSafeLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
function useHotkeys(keys, callback, options, dependencies) {
  const [ref, setRef] = useState3(null);
  const hasTriggeredRef = useRef2(false);
  const _options = Array.isArray(options) ? Array.isArray(dependencies) ? void 0 : dependencies : options;
  const _keys = useMemo(() => {
    if (Array.isArray(keys) && keys.length > 0 && Array.isArray(keys[0])) {
      return keys.map(
        (keyCombo) => keyCombo.map((k) => k.toString()).join((_options == null ? void 0 : _options.splitKey) || "+")
      ).join((_options == null ? void 0 : _options.delimiter) || ",");
    } else if (Array.isArray(keys)) {
      return keys.join((_options == null ? void 0 : _options.delimiter) || ",");
    }
    return keys;
  }, [keys, _options == null ? void 0 : _options.splitKey, _options == null ? void 0 : _options.delimiter]);
  const _deps = Array.isArray(options) ? options : Array.isArray(dependencies) ? dependencies : void 0;
  const memoisedCB = useCallback3(callback, _deps != null ? _deps : []);
  const cbRef = useRef2(memoisedCB);
  cbRef.current = _deps ? memoisedCB : callback;
  const memoisedOptions = useDeepEqualMemo(_options);
  const { activeScopes } = useHotkeysContext();
  const proxy = useBoundHotkeysProxy();
  useSafeLayoutEffect(() => {
    if ((memoisedOptions == null ? void 0 : memoisedOptions.enabled) === false || !isScopeActive(activeScopes, memoisedOptions == null ? void 0 : memoisedOptions.scopes)) {
      return;
    }
    const listener = (e, isKeyUp = false) => {
      var _a;
      if (isKeyboardEventTriggeredByInput(e) && !isHotkeyEnabledOnTag(e, memoisedOptions == null ? void 0 : memoisedOptions.enableOnFormTags)) {
        return;
      }
      if (ref !== null) {
        const rootNode = ref.getRootNode();
        if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement !== ref && !ref.contains(rootNode.activeElement)) {
          stopPropagation(e);
          return;
        }
      }
      if (((_a = e.target) == null ? void 0 : _a.isContentEditable) && !(memoisedOptions == null ? void 0 : memoisedOptions.enableOnContentEditable)) {
        return;
      }
      parseKeysHookInput(_keys, memoisedOptions == null ? void 0 : memoisedOptions.delimiter).forEach((key) => {
        var _a2, _b, _c;
        const hotkey = parseHotkey(
          key,
          memoisedOptions == null ? void 0 : memoisedOptions.splitKey,
          memoisedOptions == null ? void 0 : memoisedOptions.useKey
        );
        if (isHotkeyMatchingKeyboardEvent(
          e,
          hotkey,
          memoisedOptions == null ? void 0 : memoisedOptions.ignoreModifiers
        ) || ((_a2 = hotkey.keys) == null ? void 0 : _a2.includes("*"))) {
          if (((_b = memoisedOptions == null ? void 0 : memoisedOptions.ignoreEventWhenPrevented) != null ? _b : true) && e.defaultPrevented) {
            return;
          }
          if ((_c = memoisedOptions == null ? void 0 : memoisedOptions.ignoreEventWhen) == null ? void 0 : _c.call(memoisedOptions, e)) {
            return;
          }
          if (isKeyUp && hasTriggeredRef.current) {
            return;
          }
          if (!isHotkeyEnabled(e, hotkey, memoisedOptions == null ? void 0 : memoisedOptions.enabled)) {
            stopPropagation(e);
            return;
          }
          cbRef.current(e, hotkey);
          maybePreventDefault(e, hotkey, memoisedOptions == null ? void 0 : memoisedOptions.preventDefault);
          if (!isKeyUp) {
            hasTriggeredRef.current = true;
          }
        }
      });
    };
    const handleKeyDown = (event) => {
      if (event.code === void 0) {
        return;
      }
      pushToCurrentlyPressedKeys(mapKey(event.code));
      if ((memoisedOptions == null ? void 0 : memoisedOptions.keydown) === void 0 && (memoisedOptions == null ? void 0 : memoisedOptions.keyup) !== true || (memoisedOptions == null ? void 0 : memoisedOptions.keydown)) {
        listener(event);
      }
    };
    const handleKeyUp = (event) => {
      if (event.code === void 0) {
        return;
      }
      removeFromCurrentlyPressedKeys(mapKey(event.code));
      hasTriggeredRef.current = false;
      if (memoisedOptions == null ? void 0 : memoisedOptions.keyup) {
        listener(event, true);
      }
    };
    const domNode = ref || (_options == null ? void 0 : _options.document) || document;
    domNode.addEventListener("keyup", handleKeyUp);
    domNode.addEventListener("keydown", handleKeyDown);
    if (proxy) {
      parseKeysHookInput(_keys, memoisedOptions == null ? void 0 : memoisedOptions.delimiter).forEach(
        (key) => proxy.addHotkey(
          parseHotkey(
            key,
            memoisedOptions == null ? void 0 : memoisedOptions.splitKey,
            memoisedOptions == null ? void 0 : memoisedOptions.useKey,
            memoisedOptions == null ? void 0 : memoisedOptions.description
          )
        )
      );
    }
    return () => {
      domNode.removeEventListener("keyup", handleKeyUp);
      domNode.removeEventListener("keydown", handleKeyDown);
      if (proxy) {
        parseKeysHookInput(_keys, memoisedOptions == null ? void 0 : memoisedOptions.delimiter).forEach(
          (key) => proxy.removeHotkey(
            parseHotkey(
              key,
              memoisedOptions == null ? void 0 : memoisedOptions.splitKey,
              memoisedOptions == null ? void 0 : memoisedOptions.useKey,
              memoisedOptions == null ? void 0 : memoisedOptions.description
            )
          )
        );
      }
    };
  }, [ref, _keys, memoisedOptions, activeScopes]);
  return setRef;
}
export {
  HotkeysProvider,
  Key,
  isHotkeyPressed,
  useHotkeys,
  useHotkeysContext,
  useRecordHotkeys
};
//# sourceMappingURL=index.mjs.map