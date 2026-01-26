// src/environment.ts
var IS_APPLE = typeof navigator !== "undefined" && navigator.userAgent.includes("Mac OS X");

// src/escapeRegexp.ts
var escapeRegExp = (text) => {
  return text.replaceAll(/[#$()*+,.?[\\\]^s{|}-]/g, String.raw`\$&`);
};

// src/findHtmlParentElement.ts
var findHtmlParentElement = (el, nodeName) => {
  if (!el || el.nodeName === nodeName) {
    return el;
  }
  return findHtmlParentElement(el.parentElement, nodeName);
};

// src/getHandler.ts
var getHandler = (cb, ...args) => () => {
  cb?.(...args);
};

// src/hexToBase64.ts
var hexToBase64 = (hex) => {
  const hexPairs = hex.match(/\w{2}/g) || [];
  const binary = hexPairs.map(
    (hexPair) => String.fromCodePoint(Number.parseInt(hexPair, 16))
  );
  return btoa(binary.join(""));
};

// src/isUrl.ts
var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var emailLintRE = /mailto:([^?\\]+)/;
var localhostDomainRE = /^localhost[\d:?]*(?:[^\d:?]\S*)?$/;
var nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;
var isUrl = (string) => {
  if (typeof string !== "string") {
    return false;
  }
  const generalMatch = protocolAndDomainRE.exec(string);
  const emailLinkMatch = emailLintRE.exec(string);
  const match = generalMatch || emailLinkMatch;
  if (!match) {
    return false;
  }
  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }
  try {
    new URL(string);
  } catch {
    return false;
  }
  return localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol);
};

// src/mergeProps.ts
var mergeProps = (props, overrideProps, {
  handlerKeys,
  handlerQuery = (key) => key.startsWith("on")
} = {}) => {
  const map = /* @__PURE__ */ new Map();
  const acc = {};
  const mapProps = (_props) => {
    if (!_props) return;
    Object.entries(_props).forEach(([key, value]) => {
      if ((!handlerKeys || handlerKeys.includes(key)) && (!handlerQuery || handlerQuery(key)) && typeof value === "function") {
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)?.push(value);
        acc[key] = (...args) => {
          map.get(key)?.forEach((fn) => fn(...args));
        };
      } else {
        acc[key] = value;
      }
    });
  };
  mapProps(props);
  mapProps(overrideProps);
  return acc;
};

// src/sanitizeUrl.ts
var sanitizeUrl = (url, { allowedSchemes, permitInvalid = false }) => {
  if (!url) return null;
  if (url.startsWith("/") || url.startsWith("#")) {
    return url;
  }
  let parsedUrl = null;
  try {
    parsedUrl = new URL(url);
  } catch {
    return permitInvalid ? url : null;
  }
  if (allowedSchemes && !allowedSchemes.includes(parsedUrl.protocol.slice(0, -1))) {
    return null;
  }
  return parsedUrl.href;
};

// src/type-utils.ts
var isUndefined = (obj) => obj === void 0;
var isNull = (obj) => obj === null;
var isUndefinedOrNull = (obj) => isUndefined(obj) || isNull(obj);
var isDefined = (arg) => !isUndefinedOrNull(arg);
function bindFirst(fn, firstArg) {
  return (...args) => fn(firstArg, ...args);
}
export {
  IS_APPLE,
  bindFirst,
  escapeRegExp,
  findHtmlParentElement,
  getHandler,
  hexToBase64,
  isDefined,
  isNull,
  isUndefined,
  isUndefinedOrNull,
  isUrl,
  mergeProps,
  sanitizeUrl
};
//# sourceMappingURL=index.mjs.map