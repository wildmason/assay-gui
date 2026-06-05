// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e8, o9) {
    if (this._$cssResult$ = true, o9 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e8;
  }
  get styleSheet() {
    let t5 = this.o;
    const s4 = this.t;
    if (e && void 0 === t5) {
      const e8 = void 0 !== s4 && 1 === s4.length;
      e8 && (t5 = o.get(s4)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e8 && o.set(s4, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var i = (t5, ...e8) => {
  const o9 = 1 === t5.length ? t5[0] : e8.reduce((e9, s4, o10) => e9 + ((t6) => {
    if (true === t6._$cssResult$) return t6.cssText;
    if ("number" == typeof t6) return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t5[o10 + 1], t5[0]);
  return new n(o9, t5, s);
};
var S = (s4, o9) => {
  if (e) s4.adoptedStyleSheets = o9.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else for (const e8 of o9) {
    const o10 = document.createElement("style"), n6 = t.litNonce;
    void 0 !== n6 && o10.setAttribute("nonce", n6), o10.textContent = e8.cssText, s4.appendChild(o10);
  }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e8 = "";
  for (const s4 of t6.cssRules) e8 += s4.cssText;
  return r(e8);
})(t5) : t5;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s4) => t5;
var u = { toAttribute(t5, s4) {
  switch (s4) {
    case Boolean:
      t5 = t5 ? l : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s4) {
  let i7 = t5;
  switch (s4) {
    case Boolean:
      i7 = null !== t5;
      break;
    case Number:
      i7 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i7 = JSON.parse(t5);
      } catch (t6) {
        i7 = null;
      }
  }
  return i7;
} };
var f = (t5, s4) => !i2(t5, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ??= []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t5, s4), !s4.noAccessor) {
      const i7 = Symbol(), h3 = this.getPropertyDescriptor(t5, i7, s4);
      void 0 !== h3 && e2(this.prototype, t5, h3);
    }
  }
  static getPropertyDescriptor(t5, s4, i7) {
    const { get: e8, set: r6 } = h(this.prototype, t5) ?? { get() {
      return this[s4];
    }, set(t6) {
      this[s4] = t6;
    } };
    return { get: e8, set(s5) {
      const h3 = e8?.call(this);
      r6?.call(this, s5), this.requestUpdate(t5, h3, i7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t5 = n2(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t6 = this.properties, s4 = [...r2(t6), ...o2(t6)];
      for (const i7 of s4) this.createProperty(i7, t6[i7]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s4 = litPropertyMetadata.get(t5);
      if (void 0 !== s4) for (const [t6, i7] of s4) this.elementProperties.set(t6, i7);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s4] of this.elementProperties) {
      const i7 = this._$Eu(t6, s4);
      void 0 !== i7 && this._$Eh.set(i7, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i7 = [];
    if (Array.isArray(s4)) {
      const e8 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e8) i7.unshift(c(s5));
    } else void 0 !== s4 && i7.push(c(s4));
    return i7;
  }
  static _$Eu(t5, s4) {
    const i7 = s4.attribute;
    return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
  }
  addController(t5) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
  }
  removeController(t5) {
    this._$EO?.delete(t5);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i7 of s4.keys()) this.hasOwnProperty(i7) && (t5.set(i7, this[i7]), delete this[i7]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t5) => t5.hostDisconnected?.());
  }
  attributeChangedCallback(t5, s4, i7) {
    this._$AK(t5, i7);
  }
  _$ET(t5, s4) {
    const i7 = this.constructor.elementProperties.get(t5), e8 = this.constructor._$Eu(t5, i7);
    if (void 0 !== e8 && true === i7.reflect) {
      const h3 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s4, i7.type);
      this._$Em = t5, null == h3 ? this.removeAttribute(e8) : this.setAttribute(e8, h3), this._$Em = null;
    }
  }
  _$AK(t5, s4) {
    const i7 = this.constructor, e8 = i7._$Eh.get(t5);
    if (void 0 !== e8 && this._$Em !== e8) {
      const t6 = i7.getPropertyOptions(e8), h3 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
      this._$Em = e8;
      const r6 = h3.fromAttribute(s4, t6.type);
      this[e8] = r6 ?? this._$Ej?.get(e8) ?? r6, this._$Em = null;
    }
  }
  requestUpdate(t5, s4, i7, e8 = false, h3) {
    if (void 0 !== t5) {
      const r6 = this.constructor;
      if (false === e8 && (h3 = this[t5]), i7 ??= r6.getPropertyOptions(t5), !((i7.hasChanged ?? f)(h3, s4) || i7.useDefault && i7.reflect && h3 === this._$Ej?.get(t5) && !this.hasAttribute(r6._$Eu(t5, i7)))) return;
      this.C(t5, s4, i7);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t5, s4, { useDefault: i7, reflect: e8, wrapped: h3 }, r6) {
    i7 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t5) && (this._$Ej.set(t5, r6 ?? s4 ?? this[t5]), true !== h3 || void 0 !== r6) || (this._$AL.has(t5) || (this.hasUpdated || i7 || (s4 = void 0), this._$AL.set(t5, s4)), true === e8 && this._$Em !== t5 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t5));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t7, s5] of this._$Ep) this[t7] = s5;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0) for (const [s5, i7] of t6) {
        const { wrapped: t7 } = i7, e8 = this[s5];
        true !== t7 || this._$AL.has(s5) || void 0 === e8 || this.C(s5, void 0, i7, e8);
      }
    }
    let t5 = false;
    const s4 = this._$AL;
    try {
      t5 = this.shouldUpdate(s4), t5 ? (this.willUpdate(s4), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t5 = false, this._$EM(), s5;
    }
    t5 && this._$AE(s4);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Eq &&= this._$Eq.forEach((t6) => this._$ET(t6, this[t6])), this._$EM();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t5) => t5;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var u2 = Array.isArray;
var d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t5) => (i7, ...s4) => ({ _$litType$: t5, strings: i7, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t5, i7) {
  if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i7) : i7;
}
var N = (t5, i7) => {
  const s4 = t5.length - 1, e8 = [];
  let n6, l4 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c5 = v;
  for (let i8 = 0; i8 < s4; i8++) {
    const s5 = t5[i8];
    let a4, u4, d3 = -1, f3 = 0;
    for (; f3 < s5.length && (c5.lastIndex = f3, u4 = c5.exec(s5), null !== u4); ) f3 = c5.lastIndex, c5 === v ? "!--" === u4[1] ? c5 = _ : void 0 !== u4[1] ? c5 = m : void 0 !== u4[2] ? (y2.test(u4[2]) && (n6 = RegExp("</" + u4[2], "g")), c5 = p2) : void 0 !== u4[3] && (c5 = p2) : c5 === p2 ? ">" === u4[0] ? (c5 = n6 ?? v, d3 = -1) : void 0 === u4[1] ? d3 = -2 : (d3 = c5.lastIndex - u4[2].length, a4 = u4[1], c5 = void 0 === u4[3] ? p2 : '"' === u4[3] ? $ : g) : c5 === $ || c5 === g ? c5 = p2 : c5 === _ || c5 === m ? c5 = v : (c5 = p2, n6 = void 0);
    const x3 = c5 === p2 && t5[i8 + 1].startsWith("/>") ? " " : "";
    l4 += c5 === v ? s5 + r3 : d3 >= 0 ? (e8.push(a4), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x3) : s5 + o3 + (-2 === d3 ? i8 : x3);
  }
  return [V(t5, l4 + (t5[s4] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e8];
};
var S2 = class _S {
  constructor({ strings: t5, _$litType$: i7 }, e8) {
    let r6;
    this.parts = [];
    let l4 = 0, a4 = 0;
    const u4 = t5.length - 1, d3 = this.parts, [f3, v2] = N(t5, i7);
    if (this.el = _S.createElement(f3, e8), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r6 = P.nextNode()) && d3.length < u4; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes()) for (const t6 of r6.getAttributeNames()) if (t6.endsWith(h2)) {
          const i8 = v2[a4++], s4 = r6.getAttribute(t6).split(o3), e9 = /([.?@])?(.*)/.exec(i8);
          d3.push({ type: 1, index: l4, name: e9[2], strings: s4, ctor: "." === e9[1] ? I : "?" === e9[1] ? L : "@" === e9[1] ? z : H }), r6.removeAttribute(t6);
        } else t6.startsWith(o3) && (d3.push({ type: 6, index: l4 }), r6.removeAttribute(t6));
        if (y2.test(r6.tagName)) {
          const t6 = r6.textContent.split(o3), i8 = t6.length - 1;
          if (i8 > 0) {
            r6.textContent = s2 ? s2.emptyScript : "";
            for (let s4 = 0; s4 < i8; s4++) r6.append(t6[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l4 });
            r6.append(t6[i8], c3());
          }
        }
      } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l4 });
      else {
        let t6 = -1;
        for (; -1 !== (t6 = r6.data.indexOf(o3, t6 + 1)); ) d3.push({ type: 7, index: l4 }), t6 += o3.length - 1;
      }
      l4++;
    }
  }
  static createElement(t5, i7) {
    const s4 = l2.createElement("template");
    return s4.innerHTML = t5, s4;
  }
};
function M(t5, i7, s4 = t5, e8) {
  if (i7 === E) return i7;
  let h3 = void 0 !== e8 ? s4._$Co?.[e8] : s4._$Cl;
  const o9 = a2(i7) ? void 0 : i7._$litDirective$;
  return h3?.constructor !== o9 && (h3?._$AO?.(false), void 0 === o9 ? h3 = void 0 : (h3 = new o9(t5), h3._$AT(t5, s4, e8)), void 0 !== e8 ? (s4._$Co ??= [])[e8] = h3 : s4._$Cl = h3), void 0 !== h3 && (i7 = M(t5, h3._$AS(t5, i7.values), h3, e8)), i7;
}
var R = class {
  constructor(t5, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    const { el: { content: i7 }, parts: s4 } = this._$AD, e8 = (t5?.creationScope ?? l2).importNode(i7, true);
    P.currentNode = e8;
    let h3 = P.nextNode(), o9 = 0, n6 = 0, r6 = s4[0];
    for (; void 0 !== r6; ) {
      if (o9 === r6.index) {
        let i8;
        2 === r6.type ? i8 = new k(h3, h3.nextSibling, this, t5) : 1 === r6.type ? i8 = new r6.ctor(h3, r6.name, r6.strings, this, t5) : 6 === r6.type && (i8 = new Z(h3, this, t5)), this._$AV.push(i8), r6 = s4[++n6];
      }
      o9 !== r6?.index && (h3 = P.nextNode(), o9++);
    }
    return P.currentNode = l2, e8;
  }
  p(t5) {
    let i7 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i7), i7 += s4.strings.length - 2) : s4._$AI(t5[i7])), i7++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t5, i7, s4, e8) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i7, this._$AM = s4, this.options = e8, this._$Cv = e8?.isConnected ?? true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === t5?.nodeType && (t5 = i7.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i7 = this) {
    t5 = M(this, t5, i7), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
  }
  O(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  T(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
  }
  _(t5) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
  }
  $(t5) {
    const { values: i7, _$litType$: s4 } = t5, e8 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e8) this._$AH.p(i7);
    else {
      const t6 = new R(e8, this), s5 = t6.u(this.options);
      t6.p(i7), this.T(s5), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i7 = C.get(t5.strings);
    return void 0 === i7 && C.set(t5.strings, i7 = new S2(t5)), i7;
  }
  k(t5) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s4, e8 = 0;
    for (const h3 of t5) e8 === i7.length ? i7.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i7[e8], s4._$AI(h3), e8++;
    e8 < i7.length && (this._$AR(s4 && s4._$AB.nextSibling, e8), i7.length = e8);
  }
  _$AR(t5 = this._$AA.nextSibling, s4) {
    for (this._$AP?.(false, true, s4); t5 !== this._$AB; ) {
      const s5 = i3(t5).nextSibling;
      i3(t5).remove(), t5 = s5;
    }
  }
  setConnected(t5) {
    void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i7, s4, e8, h3) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i7, this._$AM = e8, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
  }
  _$AI(t5, i7 = this, s4, e8) {
    const h3 = this.strings;
    let o9 = false;
    if (void 0 === h3) t5 = M(this, t5, i7, 0), o9 = !a2(t5) || t5 !== this._$AH && t5 !== E, o9 && (this._$AH = t5);
    else {
      const e9 = t5;
      let n6, r6;
      for (t5 = h3[0], n6 = 0; n6 < h3.length - 1; n6++) r6 = M(this, e9[s4 + n6], i7, n6), r6 === E && (r6 = this._$AH[n6]), o9 ||= !a2(r6) || r6 !== this._$AH[n6], r6 === A ? t5 = A : t5 !== A && (t5 += (r6 ?? "") + h3[n6 + 1]), this._$AH[n6] = r6;
    }
    o9 && !e8 && this.j(t5);
  }
  j(t5) {
    t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A ? void 0 : t5;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
  }
};
var z = class extends H {
  constructor(t5, i7, s4, e8, h3) {
    super(t5, i7, s4, e8, h3), this.type = 5;
  }
  _$AI(t5, i7 = this) {
    if ((t5 = M(this, t5, i7, 0) ?? A) === E) return;
    const s4 = this._$AH, e8 = t5 === A && s4 !== A || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h3 = t5 !== A && (s4 === A || e8);
    e8 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var Z = class {
  constructor(t5, i7, s4) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    M(this, t5);
  }
};
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
var D = (t5, i7, s4) => {
  const e8 = s4?.renderBefore ?? i7;
  let h3 = e8._$litPart$;
  if (void 0 === h3) {
    const t6 = s4?.renderBefore ?? null;
    e8._$litPart$ = h3 = new k(i7.insertBefore(c3(), t6), t6, void 0, s4 ?? {});
  }
  return h3._$AI(t5), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t5 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t5.firstChild, t5;
  }
  update(t5) {
    const r6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ??= []).push("4.2.2");

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t5) => (e8, o9) => {
  void 0 !== o9 ? o9.addInitializer(() => {
    customElements.define(t5, e8);
  }) : customElements.define(t5, e8);
};

// node_modules/@lit/reactive-element/decorators/property.js
var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r4 = (t5 = o5, e8, r6) => {
  const { kind: n6, metadata: i7 } = r6;
  let s4 = globalThis.litPropertyMetadata.get(i7);
  if (void 0 === s4 && globalThis.litPropertyMetadata.set(i7, s4 = /* @__PURE__ */ new Map()), "setter" === n6 && ((t5 = Object.create(t5)).wrapped = true), s4.set(r6.name, t5), "accessor" === n6) {
    const { name: o9 } = r6;
    return { set(r7) {
      const n7 = e8.get.call(this);
      e8.set.call(this, r7), this.requestUpdate(o9, n7, t5, true, r7);
    }, init(e9) {
      return void 0 !== e9 && this.C(o9, void 0, t5, e9), e9;
    } };
  }
  if ("setter" === n6) {
    const { name: o9 } = r6;
    return function(r7) {
      const n7 = this[o9];
      e8.call(this, r7), this.requestUpdate(o9, n7, t5, true, r7);
    };
  }
  throw Error("Unsupported decorator location: " + n6);
};
function n4(t5) {
  return (e8, o9) => "object" == typeof o9 ? r4(t5, e8, o9) : ((t6, e9, o10) => {
    const r6 = e9.hasOwnProperty(o10);
    return e9.constructor.createProperty(o10, t6), r6 ? Object.getOwnPropertyDescriptor(e9, o10) : void 0;
  })(t5, e8, o9);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}

// node_modules/@lit/reactive-element/decorators/base.js
var e4 = (e8, t5, c5) => (c5.configurable = true, c5.enumerable = true, Reflect.decorate && "object" != typeof t5 && Object.defineProperty(e8, t5, c5), c5);

// node_modules/@lit/reactive-element/decorators/query.js
function e5(e8, r6) {
  return (n6, s4, i7) => {
    const o9 = (t5) => t5.renderRoot?.querySelector(e8) ?? null;
    if (r6) {
      const { get: e9, set: r7 } = "object" == typeof s4 ? n6 : i7 ?? (() => {
        const t5 = Symbol();
        return { get() {
          return this[t5];
        }, set(e10) {
          this[t5] = e10;
        } };
      })();
      return e4(n6, s4, { get() {
        let t5 = e9.call(this);
        return void 0 === t5 && (t5 = o9(this), (null !== t5 || this.hasUpdated) && r7.call(this, t5)), t5;
      } });
    }
    return e4(n6, s4, { get() {
      return o9(this);
    } });
  };
}

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
function o6(o9) {
  return (e8, n6) => {
    const { slot: r6, selector: s4 } = o9 ?? {}, c5 = "slot" + (r6 ? `[name=${r6}]` : ":not([name])");
    return e4(e8, n6, { get() {
      const t5 = this.renderRoot?.querySelector(c5), e9 = t5?.assignedElements(o9) ?? [];
      return void 0 === s4 ? e9 : e9.filter((t6) => t6.matches(s4));
    } });
  };
}

// node_modules/lit-html/directive.js
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e6 = (t5) => (...e8) => ({ _$litDirective$: t5, values: e8 });
var i5 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e8, i7) {
    this._$Ct = t5, this._$AM = e8, this._$Ci = i7;
  }
  _$AS(t5, e8) {
    return this.update(t5, e8);
  }
  update(t5, e8) {
    return this.render(...e8);
  }
};

// node_modules/lit-html/directives/unsafe-html.js
var e7 = class extends i5 {
  constructor(i7) {
    if (super(i7), this.it = A, i7.type !== t4.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r6) {
    if (r6 === A || null == r6) return this._t = void 0, this.it = r6;
    if (r6 === E) return r6;
    if ("string" != typeof r6) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r6 === this.it) return this._t;
    this.it = r6;
    const s4 = [r6];
    return s4.raw = s4, this._t = { _$litType$: this.constructor.resultType, strings: s4, values: [] };
  }
};
e7.directiveName = "unsafeHTML", e7.resultType = 1;
var o7 = e6(e7);

// node_modules/lit-html/static.js
var a3 = Symbol.for("");
var o8 = (t5) => {
  if (t5?.r === a3) return t5?._$litStatic$;
};
var i6 = (t5, ...r6) => ({ _$litStatic$: r6.reduce((r7, e8, a4) => r7 + ((t6) => {
  if (void 0 !== t6._$litStatic$) return t6._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t6}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(e8) + t5[a4 + 1], t5[0]), r: a3 });
var l3 = /* @__PURE__ */ new Map();
var n5 = (t5) => (r6, ...e8) => {
  const a4 = e8.length;
  let s4, i7;
  const n6 = [], u4 = [];
  let c5, $4 = 0, f3 = false;
  for (; $4 < a4; ) {
    for (c5 = r6[$4]; $4 < a4 && void 0 !== (i7 = e8[$4], s4 = o8(i7)); ) c5 += s4 + r6[++$4], f3 = true;
    $4 !== a4 && u4.push(i7), n6.push(c5), $4++;
  }
  if ($4 === a4 && n6.push(r6[a4]), f3) {
    const t6 = n6.join("$$lit$$");
    void 0 === (r6 = l3.get(t6)) && (n6.raw = n6, l3.set(t6, r6 = n6)), e8 = u4;
  }
  return t5(r6, ...e8);
};
var u3 = n5(b2);
var c4 = n5(w);
var $2 = n5(T);

// dist/aegis.js
var er = [
  { id: "aegis", label: "Aegis", description: "The native v2 system brands." },
  {
    id: "spectrum",
    label: "Spectrum",
    description: "The ported v1 Aegis themeset \u2014 one brand, 12 hand-tuned looks led by Stone & Moss."
  }
];
function k2(e8, t5, a4, r6, i7) {
  return {
    id: e8,
    direction: t5,
    label: a4,
    description: r6,
    isDark: t5 === "dark",
    isHighContrast: e8 === "high-contrast",
    swatch: i7
  };
}
var Aa = [
  {
    id: "default",
    family: "aegis",
    label: "Aegis",
    description: "The neutral system flagship \u2014 indigo accent on cool grays; the only theme that follows your OS light / dark / contrast.",
    defaultVariant: "light",
    followsSystem: true,
    variants: [
      k2("light", "light", "Light", "Neutral Aegis \u2014 indigo accent on cool light grays.", {
        bg: "oklch(0.99 0 0)",
        surface: "oklch(0.99 0 0)",
        fg: "oklch(0.15 0.005 240)",
        accent: "oklch(0.54 0.19 255)"
      }),
      k2("dark", "dark", "Dark", "Neutral Aegis \u2014 indigo accent on deep cool grays.", {
        bg: "oklch(0.08 0.003 240)",
        surface: "oklch(0.15 0.005 240)",
        fg: "oklch(0.98 0.002 240)",
        accent: "oklch(0.62 0.16 255)"
      }),
      k2("high-contrast", "light", "High contrast", "Maximum-contrast black-on-white for AAA legibility.", {
        bg: "oklch(1 0 0)",
        surface: "oklch(1 0 0)",
        fg: "oklch(0 0 0)",
        accent: "oklch(0.25 0.16 255)"
      })
    ]
  },
  {
    id: "cinnabar",
    family: "aegis",
    label: "Cinnabar",
    description: "Cinnabar \u2014 vermilion accent (the mineral vermilion is ground from) over warm grays.",
    defaultVariant: "light",
    followsSystem: false,
    variants: [
      k2("light", "light", "Quarry", "Vermilion accent over warm light stone.", {
        bg: "oklch(0.99 0.002 60)",
        surface: "oklch(0.99 0.002 60)",
        fg: "oklch(0.15 0.008 60)",
        accent: "oklch(0.48 0.21 30)"
      }),
      k2("dark", "dark", "Lacquer", "Vermilion accent over deep warm stone.", {
        bg: "oklch(0.08 0.005 60)",
        surface: "oklch(0.15 0.008 60)",
        fg: "oklch(0.98 0.004 60)",
        accent: "oklch(0.62 0.18 30)"
      })
    ]
  },
  {
    id: "editorial",
    family: "aegis",
    label: "Editorial",
    description: "Bridge editorial direction \u2014 flax accent, Fraunces serif, warm stone.",
    defaultVariant: "dark",
    followsSystem: false,
    variants: [
      k2("dark", "dark", "Antique Brown", "Flax accent, Fraunces serif, warm dark stone.", {
        bg: "#13120f",
        surface: "#1c1b18",
        fg: "#e8e6df",
        accent: "oklch(0.75 0.1 85)"
      }),
      k2("light", "light", "Daylight", "Flax accent, Fraunces serif, warm paper.", {
        bg: "oklch(0.95 0.007 80)",
        surface: "oklch(0.95 0.007 80)",
        fg: "#13120f",
        accent: "oklch(0.75 0.1 85)"
      })
    ]
  },
  {
    id: "metro",
    family: "aegis",
    label: "Metro",
    description: "Paper Ticket transit signage \u2014 ink rules, mono type, zero radius.",
    defaultVariant: "light",
    followsSystem: false,
    variants: [
      k2("light", "light", "Paper Ticket", "Transit signage \u2014 ink rules, mono type, zero radius.", {
        bg: "oklch(0.945 0.018 85)",
        surface: "oklch(0.945 0.018 85)",
        fg: "oklch(0.14 0.005 85)",
        accent: "oklch(0.55 0.17 35)"
      }),
      k2("dark", "dark", "Night Depot", "After-dark transit board \u2014 paper ink on deep night.", {
        bg: "oklch(0.1 0.004 85)",
        surface: "oklch(0.14 0.005 85)",
        fg: "oklch(0.945 0.018 85)",
        accent: "oklch(0.55 0.17 35)"
      })
    ]
  },
  {
    id: "crucible",
    family: "aegis",
    label: "Crucible",
    description: "Bioluminescent glassmorphism \u2014 frosted slate surfaces over a variegated atmosphere, lit by a molten amber-gold accent.",
    defaultVariant: "dark",
    followsSystem: false,
    variants: [
      k2("dark", "dark", "Molten", "The lit forge \u2014 molten amber on deep GitHub-slate, frosted glass over a green/blue/ember atmosphere.", {
        bg: "#0d1117",
        surface: "#161b22",
        fg: "#f6f8fa",
        accent: "oklch(0.8 0.155 60)"
      }),
      k2("light", "light", "Quench", "The cooled forge \u2014 molten amber on bright slate-white, frosted glass over a soft atmosphere.", {
        bg: "#ffffff",
        surface: "#f6f8fa",
        fg: "#0d1117",
        accent: "oklch(0.72 0.15 59)"
      })
    ]
  },
  /* ── Spectrum — the ported v1 Aegis themeset ───────────────────────────
   * ONE brand (`data-theme="spectrum"`), 12 palette variants. Each variant is
   * a fixed v1 look that self-declares its own color-scheme, so a Spectrum
   * variant never follows the OS and never light/dark-toggles — it IS its
   * scheme. Stone & Moss leads; the rest follow v1's order. The four light
   * variants are warm-light, neutral-light, solarized-precision, sage-linen. */
  {
    id: "spectrum",
    family: "spectrum",
    label: "Spectrum",
    description: "The ported v1 Aegis themeset \u2014 12 hand-tuned looks led by Stone & Moss.",
    defaultVariant: "stone-moss",
    followsSystem: false,
    variants: [
      k2("stone-moss", "dark", "Stone & Moss", "Forest-Moss green over cool, deep stone grays \u2014 the v1 Wildmason flagship.", {
        bg: "#2a2c2b",
        surface: "#464a49",
        fg: "#d8e0d8",
        accent: "#82a682"
      }),
      k2("warm-light", "light", "Warm Light", "Solarized-adjacent light: teal-blue ink on warm putty paper, petrol-blue accent.", {
        bg: "#ececea",
        surface: "#d2d2ce",
        fg: "#002b36",
        accent: "#105987"
      }),
      k2("neutral-light", "light", "Neutral Light", "Chromaless light: near-black ink on plain light grey, royal-blue accent.", {
        bg: "#ebebeb",
        surface: "#d0d0d0",
        fg: "#111111",
        accent: "#1b4a9e"
      }),
      k2("arctic-night", "dark", "Arctic Night", "Nord polar twilight: blue-slate stone under a glacial-teal accent.", {
        bg: "#2e3440",
        surface: "#434c5e",
        fg: "#eceff4",
        accent: "#8fc4d3"
      }),
      k2("vampires-kiss", "dark", "Vampire's Kiss", "Dracula gothic: purple-slate stone, lavender accent, neon status.", {
        bg: "#21222c",
        surface: "#44475a",
        fg: "#f8f8f2",
        accent: "#c9a7fa"
      }),
      k2("twilight-peach", "dark", "Twilight Peach", "Warm peach accent over deep indigo twilight surfaces.", {
        bg: "#171827",
        surface: "#292a48",
        fg: "#eeedf8",
        accent: "#f5986a"
      }),
      k2("thistle-mocha", "dark", "Thistle Mocha", "Thistle-lavender accent over warm espresso-mocha surfaces.", {
        bg: "#221918",
        surface: "#403635",
        fg: "#ede9e1",
        accent: "#c4a8d8"
      }),
      k2("solarized-precision", "light", "Solarized Precision", "Warm Solarized light: blue-grey ink on cream/tan, teal-blue accent.", {
        bg: "#ede7d2",
        surface: "#d4cba8",
        fg: "#2c3e48",
        accent: "#185c78"
      }),
      k2("posh-sandalwood", "dark", "Posh Sandalwood", "Monokai hot-pink accent over warm olive-brown sandalwood.", {
        bg: "#27271f",
        surface: "#403c30",
        fg: "#fdf0e0",
        accent: "#f92672"
      }),
      k2("crepuscular-sky", "dark", "Crepuscular Sky", "Golden-orange crepuscular-ray accent over deep navy.", {
        bg: "#121523",
        surface: "#1d2338",
        fg: "#edd9a3",
        accent: "#c09d06"
      }),
      k2("source-control-dark", "dark", "Source Control Dark", "GitHub-dark developer console: near-black blue stone, emerald accent.", {
        bg: "#0d1117",
        surface: "#21262d",
        fg: "#f0f6fc",
        accent: "#3fb950"
      }),
      k2("sage-linen", "light", "Sage & Linen", "Cool eucalyptus light: forest ink on sage-green paper, forest-green accent.", {
        bg: "#d4ded4",
        surface: "#e6efe5",
        fg: "#1e2822",
        accent: "#3a5a43"
      })
    ]
  }
];
function Wo() {
  return er.map((e8) => ({
    family: e8,
    brands: Aa.filter((t5) => t5.family === e8.id)
  })).filter((e8) => e8.brands.length > 0);
}
var Go = { theme: "default", variant: null };
function va(e8) {
  return Aa.find((t5) => t5.id === e8);
}
function Xo(e8, t5) {
  var a4;
  return (a4 = va(e8)) == null ? void 0 : a4.variants.find((r6) => r6.id === t5);
}
function Zo(e8, t5) {
  var a4;
  return !!((a4 = va(e8)) != null && a4.variants.some((r6) => r6.id === t5));
}
function vr() {
  return typeof window > "u" || typeof window.matchMedia != "function" ? "light" : window.matchMedia("(prefers-contrast: more)").matches ? "high-contrast" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function Jo(e8) {
  if (e8.variant) return e8.variant;
  const t5 = va(e8.theme);
  return t5 != null && t5.followsSystem ? vr() : (t5 == null ? void 0 : t5.defaultVariant) ?? "light";
}
function Qo(e8, t5 = typeof document < "u" ? document.documentElement : void 0) {
  if (!t5) return;
  for (const r6 of Aa) {
    r6.id !== "default" && t5.classList.remove(r6.id);
    for (const i7 of r6.variants) t5.classList.remove(i7.id);
  }
  for (const r6 of er) t5.classList.remove(r6.id);
  const a4 = e8.theme ? va(e8.theme) : void 0;
  e8.theme && e8.theme !== "default" && a4 ? (t5.setAttribute("data-theme", e8.theme), t5.setAttribute("data-collection", a4.family)) : (t5.removeAttribute("data-theme"), t5.removeAttribute("data-collection")), e8.variant ? t5.setAttribute("data-variant", e8.variant) : t5.removeAttribute("data-variant");
}
var br = Object.getOwnPropertyDescriptor;
var gr = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? br(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = o9(i7) || i7);
  return i7;
};
var ka = class extends i4 {
  render() {
    return b2`<slot></slot>`;
  }
};
ka.styles = i`
    :host {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
  `;
ka = gr([
  t3("ae-visually-hidden")
], ka);
var mr = Object.defineProperty;
var _r = Object.getOwnPropertyDescriptor;
var za = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? _r(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && mr(t5, a4, i7), i7;
};
var qt = class extends i4 {
  constructor() {
    super(...arguments), this.target = "", this.disabled = false, this._destination = null, this._portaled = /* @__PURE__ */ new Set(), this._onSlotChange = () => {
      this._reconcile();
    };
  }
  render() {
    return b2`<slot @slotchange=${this._onSlotChange}></slot>`;
  }
  updated(e8) {
    (e8.has("disabled") || e8.has("target")) && this._reconcile();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._releaseAll();
  }
  _reconcile() {
    var r6;
    if (this.disabled) {
      this._releaseAll();
      return;
    }
    const e8 = this._resolveTarget();
    if (!e8) return;
    e8 !== this._destination && (this._releaseAll(), this._destination = e8);
    const t5 = (r6 = this.shadowRoot) == null ? void 0 : r6.querySelector("slot");
    if (!t5) return;
    const a4 = t5.assignedNodes({ flatten: false });
    for (const i7 of a4)
      this._portaled.has(i7) || (e8.appendChild(i7), this._portaled.add(i7));
  }
  _releaseAll() {
    for (const e8 of this._portaled)
      e8 instanceof Element && e8.remove();
    this._portaled.clear(), this._destination = null;
  }
  _resolveTarget() {
    if (!this.target) return document.body;
    const e8 = document.querySelector(this.target);
    return e8 instanceof HTMLElement ? e8 : document.body;
  }
};
qt.styles = i`
    :host {
      display: none;
    }
    :host([disabled]) {
      display: contents;
    }
  `;
za([
  n4({ type: String })
], qt.prototype, "target", 2);
za([
  n4({ type: Boolean, reflect: true })
], qt.prototype, "disabled", 2);
qt = za([
  t3("ae-portal")
], qt);
var y3 = i`
  outline: var(--ae-focus-ring-width) var(--ae-focus-ring-style)
    var(--ae-color-focus-ring);
  outline-offset: var(--ae-focus-ring-offset);
`;
var ie = i`
  outline-color: var(--ae-color-danger);
`;
i`
  :host {
    box-sizing: border-box;
    font-family: var(--ae-font-family-sans);
    font-size: var(--ae-font-size-default);
    line-height: var(--ae-line-height-default);
    color: var(--ae-color-fg);
  }
  :host([hidden]) {
    display: none !important;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
var tr = i`
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
`;
var Yt = i`
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  textarea:-webkit-autofill:active,
  input:autofill,
  textarea:autofill {
    -webkit-text-fill-color: var(--ae-input-autofill-fg, var(--ae-color-fg));
    -webkit-box-shadow: inset 0 0 0 1000px
      var(--ae-input-autofill-bg, transparent);
    box-shadow: inset 0 0 0 1000px
      var(--ae-input-autofill-bg, transparent);
    caret-color: var(--ae-input-autofill-fg, var(--ae-color-fg));
    transition:
      background-color 600000s 0s,
      color 600000s 0s;
  }
`;
var yr = Object.defineProperty;
var wr = Object.getOwnPropertyDescriptor;
var Ee = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? wr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && yr(t5, a4, i7), i7;
};
var U = class extends i4 {
  constructor() {
    super(), this.variant = "secondary", this.size = "md", this.type = "button", this.disabled = false, this.loading = false, this.loadingBar = "bottom", this.fullWidth = false, this._onClick = (e8) => {
      if (this.disabled || this.loading) {
        e8.preventDefault(), e8.stopImmediatePropagation();
        return;
      }
      if (this.type === "submit" || this.type === "reset") {
        const t5 = this._internals.form;
        t5 && (this.type === "submit" ? t5.requestSubmit() : t5.reset());
      }
    }, this._internals = this.attachInternals();
  }
  render() {
    return b2`
      <button
        part="button"
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-disabled=${this.disabled ? "true" : A}
        aria-busy=${this.loading ? "true" : A}
        @click=${this._onClick}
      >
        <span class="button-inner">
          ${this.loading ? b2`<span class="loading-spin" aria-hidden="true">
                <svg viewBox="0 0 32 32">
                  <circle class="track" cx="16" cy="16" r="13"></circle>
                  <circle class="ind" cx="16" cy="16" r="13"></circle>
                </svg>
              </span>` : A}
          <span class="start-slot"><slot name="start"></slot></span>
          <slot></slot>
          <span class="end-slot"><slot name="end"></slot></span>
        </span>
        ${this.loading ? b2`<span
              class="loading-bar"
              part="loading-bar"
              aria-hidden="true"
            ></span>` : A}
      </button>
    `;
  }
  focus(e8) {
    var t5;
    (t5 = this._btn) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._btn) == null || e8.blur();
  }
};
U.formAssociated = true;
U.styles = i`
    /*
     * --ae-button-bg / --ae-button-bg-hover / --ae-button-bg-active / --ae-button-fg /
     * --ae-button-border are declared at :host so the variant selectors
     * (:host([variant='primary']) etc.) can rewrite them per-variant.
     * Their fallback chain to semantic --ae-color-* tokens is what lets
     * dark / cinnabar / high-contrast themes affect button colors (those
     * themes override the semantic tokens, not the button tokens).
     *
     * Typography Tier 3 tokens (--ae-button-font-family / -font-weight /
     * -letter-spacing / -text-transform) and shape tokens
     * (--ae-button-radius) are deliberately NOT declared at :host. A
     * :host declaration would shadow inherited root-level theme
     * overrides because directly-applied rules win over inheritance. They
     * are resolved at the consumption point below via var(--token, default)
     * so themes can override them at :root.<theme> and the values cascade
     * into the shadow root through inheritance.
     */
    :host {
      --ae-button-bg: var(--ae-color-bg-subtle);
      --ae-button-bg-hover: var(--ae-color-bg-muted);
      --ae-button-bg-active: var(--ae-color-bg-muted);
      --ae-button-fg: var(--ae-color-fg);
      --ae-button-border: var(--ae-color-border);

      display: inline-flex;
      vertical-align: middle;
    }

    :host([full-width]) {
      display: flex;
      width: 100%;
    }

    button {
      all: unset;
      box-sizing: border-box;
      position: relative;
      /* Clips the absolutely-positioned loading bar to the button's
       * rounded corners. Safe for the focus ring — focusRing uses an
       * outline, which overflow never clips. */
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ae-button-gap, var(--ae-space-2));
      cursor: pointer;
      user-select: none;
      font-family: var(--ae-button-font-family, var(--ae-font-family-ui));
      font-weight: var(--ae-button-font-weight, var(--ae-font-weight-medium));
      letter-spacing: var(--ae-button-letter-spacing, var(--ae-letter-spacing-normal));
      text-transform: var(--ae-button-text-transform, none);
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      background: var(--ae-button-bg);
      color: var(--ae-button-fg);
      border: var(--ae-border-width-1) solid var(--ae-button-border);
      border-radius: var(--ae-button-radius, var(--ae-radius-default));
      /* Default none — a brand can set an accent glow (e.g. Crucible's molten
       * halo) without forking the component. Already in the transition list. */
      box-shadow: var(--ae-button-shadow, none);
      /* Frosted-glass hook — defaults to none (NOT the global surface filter)
       * so opaque primary/danger fills and chromeless ghost/tertiary buttons
       * aren't frosted. A brand opts the translucent secondary variant in via
       * --ae-button-backdrop-filter (Crucible). */
      backdrop-filter: var(--ae-button-backdrop-filter, none);
      -webkit-backdrop-filter: var(--ae-button-backdrop-filter, none);
      transition:
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        box-shadow var(--ae-duration-fast) var(--ae-easing-ease-out);
      width: 100%;
    }

    button:hover:not(:disabled) {
      background: var(--ae-button-bg-hover);
    }

    button:active:not(:disabled) {
      background: var(--ae-button-bg-active);
    }

    button:focus-visible {
      ${y3}
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }

    /*
     * A loading button is set disabled to block activation, but it
     * must NOT inherit the disabled DIMMING — otherwise the label and
     * the loading bar render at 0.55 opacity and read as washed out.
     * A loading button stays full-strength; the bar conveys "busy",
     * and the cursor signals progress rather than "not allowed".
     */
    :host([loading]) button:disabled {
      opacity: 1;
      cursor: progress;
    }

    /*
     * Sizes. Each metric resolves through a per-size token whose fallback is
     * the original v2 value, so the default / cinnabar / editorial / metro
     * brands render unchanged while a brand (e.g. Spectrum's Stone & Moss) can
     * pin the exact v1 control geometry — height, padding, font-size, and the
     * per-size corner radius (v1 rounds sm tighter than md/lg).
     */
    :host([size='sm']) button {
      font-size: var(--ae-button-font-size-sm, var(--ae-font-size-sm));
      padding: var(--ae-button-padding-sm, var(--ae-space-1) var(--ae-space-3));
      min-height: var(--ae-button-height-sm, 1.75rem);
      border-radius: var(--ae-button-radius-sm, var(--ae-button-radius, var(--ae-radius-default)));
    }
    :host([size='md']) button {
      font-size: var(--ae-button-font-size-md, var(--ae-font-size-sm));
      padding: var(--ae-button-padding-md, var(--ae-space-2) var(--ae-space-4));
      min-height: var(--ae-button-height-md, 2.25rem);
    }
    :host([size='lg']) button {
      font-size: var(--ae-button-font-size-lg, var(--ae-font-size-md));
      padding: var(--ae-button-padding-lg, var(--ae-space-3) var(--ae-space-5));
      min-height: var(--ae-button-height-lg, 2.75rem);
    }

    /* Variants */
    :host([variant='primary']) {
      /* Resting / hover / active fills flow through overridable tokens so a
       * brand can give the primary button a custom fill — e.g. Crucible's
       * molten amber gradient — without disturbing other brands. Mirrors the
       * --ae-button-secondary-bg indirection. Resolved here (not :host) so a
       * :root brand override reaches the shadow root via inheritance. */
      --ae-button-bg: var(--ae-button-primary-bg, var(--ae-color-accent));
      --ae-button-bg-hover: var(--ae-button-primary-bg-hover, var(--ae-color-accent-hover));
      --ae-button-bg-active: var(--ae-button-primary-bg-active, var(--ae-color-accent-active));
      --ae-button-fg: var(--ae-color-fg-on-accent);
      --ae-button-border: transparent;
    }
    :host([variant='secondary']) {
      /* Resting fill flows through an overridable token so a brand can make
       * secondary a transparent outline button (v1 Spectrum) rather than the
       * default filled secondary, without disturbing other brands. */
      --ae-button-bg: var(--ae-button-secondary-bg, var(--ae-color-bg));
      --ae-button-bg-hover: var(--ae-color-bg-subtle);
      --ae-button-bg-active: var(--ae-color-bg-muted);
      --ae-button-fg: var(--ae-color-fg);
      --ae-button-border: var(--ae-color-border-strong);
    }
    :host([variant='tertiary']) {
      --ae-button-bg: transparent;
      --ae-button-bg-hover: var(--ae-color-bg-subtle);
      --ae-button-bg-active: var(--ae-color-bg-muted);
      --ae-button-fg: var(--ae-color-fg);
      --ae-button-border: transparent;
    }
    :host([variant='ghost']) {
      --ae-button-bg: transparent;
      --ae-button-bg-hover: var(--ae-color-hover-overlay);
      --ae-button-bg-active: var(--ae-color-active-overlay);
      --ae-button-fg: var(--ae-color-fg-muted);
      --ae-button-border: transparent;
    }
    :host([variant='danger']) {
      --ae-button-bg: var(--ae-color-danger);
      --ae-button-bg-hover: var(--ae-color-danger-emphasis);
      --ae-button-bg-active: var(--ae-color-danger-emphasis);
      --ae-button-fg: var(--ae-color-fg-on-danger);
      --ae-button-border: transparent;
    }

    .button-inner {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    /*
     * Icon spacing is applied as a margin on the ACTUALLY-slotted start/end
     * content, not as a flex gap on .button-inner. The wrapper spans render
     * unconditionally, so a flex gap would add phantom width to every
     * icon-less button (two gaps = mis-centered + ~12px too wide vs the v1
     * .wm-btn, which only spaces between real items). With margins on
     * ::slotted content, an empty start/end wrapper contributes nothing.
     */
    ::slotted([slot='start']) {
      margin-inline-end: var(--ae-button-gap, var(--ae-space-2));
    }
    ::slotted([slot='end']) {
      margin-inline-start: var(--ae-button-gap, var(--ae-space-2));
    }

    /*
     * Loading affordances. One token set selects three theme-specific
     * visuals so a theme picks its loading language without forking the
     * component:
     *
     *   - Flat bar (DEFAULT) — a solid segment slides along an edge of the
     *     button (.loading-bar::before); the label stays fully visible.
     *   - Spinner — an inline arc next to the label (.loading-spin),
     *     revealed by flipping the display tokens (Editorial uses this).
     *   - Barber-pole / hazard tape — opt-in textured bar set via the
     *     --ae-button-loading-bar-image token. This is Metro-ONLY; every
     *     other theme uses the flat bar or the spinner.
     *
     * Defaults render the flat bar: the barber-pole layer is transparent
     * (image: none) and the sliding segment is shown. A theme opts into a
     * different visual purely through tokens.
     */
    .loading-bar {
      display: var(--ae-button-loading-bar-display, block);
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: var(--ae-button-loading-bar-height, 4px);
      overflow: hidden;
      pointer-events: none;
      /* Barber-pole layer — transparent unless a theme sets an image (Metro).
       * background-position scrolls it one tile per cycle for a seamless loop. */
      background-image: var(--ae-button-loading-bar-image, none);
      background-size: var(--ae-button-loading-bar-stripe, 0.5rem)
        var(--ae-button-loading-bar-stripe, 0.5rem);
      animation: ae-button-loading-scroll
        var(--ae-button-loading-bar-duration, 0.8s) linear infinite;
    }
    /*
     * Flat-bar segment — the DEFAULT visual. A solid block ~40% of the
     * track wide, sliding edge to edge. A theme that wants the textured bar
     * instead (Metro) hides this via --ae-button-loading-segment-display.
     */
    .loading-bar::before {
      content: '';
      display: var(--ae-button-loading-segment-display, block);
      position: absolute;
      top: 0;
      bottom: 0;
      left: -40%;
      width: 40%;
      background: var(--ae-button-loading-bar-fill, var(--ae-button-fg));
      animation: ae-button-loading-slide
        var(--ae-button-loading-slide-duration, 1.15s)
        var(--ae-easing-ease-in-out, ease-in-out) infinite;
    }
    :host([loading-bar='top']) .loading-bar {
      bottom: auto;
      top: 0;
    }

    /*
     * Inline spinner — opt-in (Editorial). Sits next to the label inside
     * .button-inner; hidden by default. A simple rotating arc matching the
     * standalone ae-spinner so they read consistently. Color defaults to
     * currentColor (the button text), so it contrasts every variant.
     */
    .loading-spin {
      display: var(--ae-button-loading-spinner-display, none);
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      flex: 0 0 auto;
      /* Space the spinner from the label the same way a slotted start icon
       * is spaced — .button-inner has no flex gap by design, so without this
       * the arc butts directly against the label. Defaults to the button's
       * icon gap; Editorial tightens it to --ae-space-1 (4px). */
      margin-inline-end: var(--ae-button-loading-spinner-gap, var(--ae-button-gap, var(--ae-space-2)));
    }
    .loading-spin svg {
      width: 100%;
      height: 100%;
      animation: ae-button-spin-rotate 0.8s linear infinite;
    }
    .loading-spin circle {
      fill: none;
      stroke-width: 3.5;
      stroke-linecap: round;
    }
    .loading-spin .track {
      stroke: color-mix(in oklch, currentColor 25%, transparent);
    }
    .loading-spin .ind {
      stroke: var(--ae-button-loading-spinner-color, currentColor);
      stroke-dasharray: 55 200;
    }

    @keyframes ae-button-loading-scroll {
      to {
        background-position: var(--ae-button-loading-bar-stripe, 0.5rem) 0;
      }
    }
    @keyframes ae-button-loading-slide {
      0% { left: -40%; }
      100% { left: 100%; }
    }
    @keyframes ae-button-spin-rotate {
      to { transform: rotate(360deg); }
    }

    /*
     * Reduced motion: stop all loading motion. The flat segment would
     * otherwise rest off-screen (left:-40%), so pin it to a static, dim,
     * full-width fill so the busy state stays perceivable; the spinner and
     * hazard bar keep a static visible frame. aria-busy carries the state.
     */
    @media (prefers-reduced-motion: reduce) {
      .loading-bar,
      .loading-spin svg {
        animation: none;
      }
      .loading-bar::before {
        animation: none;
        left: 0;
        width: 100%;
        opacity: 0.55;
      }
    }
  `;
Ee([
  n4({ type: String, reflect: true })
], U.prototype, "variant", 2);
Ee([
  n4({ type: String, reflect: true })
], U.prototype, "size", 2);
Ee([
  n4({ type: String })
], U.prototype, "type", 2);
Ee([
  n4({ type: Boolean, reflect: true })
], U.prototype, "disabled", 2);
Ee([
  n4({ type: Boolean, reflect: true })
], U.prototype, "loading", 2);
Ee([
  n4({ type: String, reflect: true, attribute: "loading-bar" })
], U.prototype, "loadingBar", 2);
Ee([
  n4({ type: Boolean, reflect: true, attribute: "full-width" })
], U.prototype, "fullWidth", 2);
Ee([
  e5("button")
], U.prototype, "_btn", 2);
U = Ee([
  t3("ae-button")
], U);
var xr = Object.defineProperty;
var kr = Object.getOwnPropertyDescriptor;
var ba = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? kr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && xr(t5, a4, i7), i7;
};
var ga = /* @__PURE__ */ new Map();
function en(e8) {
  for (const [t5, a4] of Object.entries(e8))
    ga.set(t5, a4);
}
function tn(e8) {
  ga.delete(e8);
}
function an() {
  return [...ga.keys()].sort();
}
var yt = class extends i4 {
  constructor() {
    super(...arguments), this.name = "", this.label = "", this.size = "";
  }
  render() {
    const e8 = !this.label, t5 = this.name ? ga.get(this.name) : void 0;
    return b2`
      <span
        part="svg"
        class="svg-wrap"
        role=${e8 ? A : "img"}
        aria-label=${e8 ? A : this.label}
        aria-hidden=${e8 ? "true" : A}
      >
        ${t5 ? o7(t5) : b2`<slot></slot>`}
      </span>
    `;
  }
};
yt.styles = i`
    :host {
      --ae-icon-size: 1em;
      --ae-icon-color: currentColor;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--ae-icon-size);
      height: var(--ae-icon-size);
      flex-shrink: 0;
      line-height: 1;
      color: var(--ae-icon-color);
    }
    :host([size='xs']) { --ae-icon-size: 0.75rem; }
    :host([size='sm']) { --ae-icon-size: 1rem; }
    :host([size='md']) { --ae-icon-size: 1.25rem; }
    :host([size='lg']) { --ae-icon-size: 1.5rem; }
    :host([size='xl']) { --ae-icon-size: 2rem; }

    .svg-wrap,
    ::slotted(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
    .svg-wrap svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `;
ba([
  n4({ type: String, reflect: true })
], yt.prototype, "name", 2);
ba([
  n4({ type: String })
], yt.prototype, "label", 2);
ba([
  n4({ type: String, reflect: true })
], yt.prototype, "size", 2);
yt = ba([
  t3("ae-icon")
], yt);
var $r = Object.defineProperty;
var Sr = Object.getOwnPropertyDescriptor;
var ct = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Sr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && $r(t5, a4, i7), i7;
};
var me = class extends i4 {
  constructor() {
    super(...arguments), this.direction = "column", this.gap = "md", this.align = "", this.justify = "", this.wrap = false, this.inline = false;
  }
  render() {
    return b2`<slot></slot>`;
  }
};
me.styles = i`
    :host {
      display: flex;
      box-sizing: border-box;
      min-width: 0;
    }
    :host([inline]) { display: inline-flex; }

    :host([direction='column']) { flex-direction: column; }
    :host([direction='row'])    { flex-direction: row; }

    :host([gap='none']) { gap: 0; }
    :host([gap='xs'])   { gap: var(--ae-space-1); }
    :host([gap='sm'])   { gap: var(--ae-space-2); }
    :host([gap='md'])   { gap: var(--ae-space-4); }
    :host([gap='lg'])   { gap: var(--ae-space-6); }
    :host([gap='xl'])   { gap: var(--ae-space-8); }
    :host([gap='2xl']) { gap: var(--ae-space-12); }

    :host([align='start'])    { align-items: flex-start; }
    :host([align='center'])   { align-items: center; }
    :host([align='end'])      { align-items: flex-end; }
    :host([align='stretch'])  { align-items: stretch; }
    :host([align='baseline']) { align-items: baseline; }

    :host([justify='start'])   { justify-content: flex-start; }
    :host([justify='center'])  { justify-content: center; }
    :host([justify='end'])     { justify-content: flex-end; }
    :host([justify='between']) { justify-content: space-between; }
    :host([justify='around'])  { justify-content: space-around; }
    :host([justify='evenly'])  { justify-content: space-evenly; }

    :host([wrap]) { flex-wrap: wrap; }
  `;
ct([
  n4({ type: String, reflect: true })
], me.prototype, "direction", 2);
ct([
  n4({ type: String, reflect: true })
], me.prototype, "gap", 2);
ct([
  n4({ type: String, reflect: true })
], me.prototype, "align", 2);
ct([
  n4({ type: String, reflect: true })
], me.prototype, "justify", 2);
ct([
  n4({ type: Boolean, reflect: true })
], me.prototype, "wrap", 2);
ct([
  n4({ type: Boolean, reflect: true })
], me.prototype, "inline", 2);
me = ct([
  t3("ae-stack")
], me);
var Er = Object.defineProperty;
var Cr = Object.getOwnPropertyDescriptor;
var ma = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Cr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Er(t5, a4, i7), i7;
};
var wt = class extends i4 {
  constructor() {
    super(...arguments), this.orientation = "horizontal", this.decorative = false, this.weight = "regular", this._onSlotChange = () => this.requestUpdate();
  }
  /** True when the default slot has any meaningful (non-whitespace) content. */
  _hasLabel() {
    return Array.from(this.childNodes).some(
      (e8) => e8.nodeType === Node.ELEMENT_NODE || e8.nodeType === Node.TEXT_NODE && (e8.textContent ?? "").trim() !== ""
    );
  }
  render() {
    const e8 = this.decorative ? "none" : "separator", t5 = this._hasLabel();
    return b2`
      <span
        class="rule"
        role=${e8}
        aria-orientation=${this.decorative ? A : this.orientation}
      ></span>
      <span class="label" ?hidden=${!t5}>
        <slot @slotchange=${this._onSlotChange}></slot>
      </span>
      <span class="rule" aria-hidden="true" ?hidden=${!t5}></span>
    `;
  }
};
wt.styles = i`
    :host {
      --ae-divider-color: var(--ae-color-border);
      --_w: var(--ae-border-width-1);
      display: flex;
      align-items: center;
      gap: var(--ae-space-3);
      color: var(--ae-color-fg-muted);
      font-size: var(--ae-font-size-xs);
      line-height: 1;
    }
    :host([weight='thin']) { --_w: 1px; }
    :host([weight='regular']) { --_w: var(--ae-border-width-1); }
    :host([weight='strong']) { --_w: var(--ae-border-width-2); }

    :host([orientation='horizontal']) {
      width: 100%;
    }
    :host([orientation='vertical']) {
      flex-direction: column;
      height: 100%;
      width: auto;
      align-self: stretch;
    }

    .rule {
      flex: 1 1 auto;
      background: var(--ae-divider-color);
    }
    :host([orientation='horizontal']) .rule { height: var(--_w); }
    :host([orientation='vertical']) .rule { width: var(--_w); }

    .label {
      display: inline-flex;
      flex: 0 0 auto;
      white-space: nowrap;
    }
    /* When no label is slotted, the label box and trailing rule collapse so the
       single remaining rule spans edge-to-edge with no flex gap left dangling. */
    .label[hidden],
    .rule[hidden] { display: none; }
  `;
ma([
  n4({ type: String, reflect: true })
], wt.prototype, "orientation", 2);
ma([
  n4({ type: Boolean, reflect: true })
], wt.prototype, "decorative", 2);
ma([
  n4({ type: String, reflect: true })
], wt.prototype, "weight", 2);
wt = ma([
  t3("ae-divider")
], wt);
var Ar = Object.defineProperty;
var zr = Object.getOwnPropertyDescriptor;
var _a = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? zr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ar(t5, a4, i7), i7;
};
var xt = class extends i4 {
  constructor() {
    super(...arguments), this.elevation = "low", this.padding = "md", this.interactive = false, this._hasHeader = false, this._hasFooter = false, this._onSlotChange = (e8) => {
      const t5 = e8.target, a4 = t5.assignedNodes({ flatten: true }).length > 0;
      t5.name === "header" && (this._hasHeader = a4), t5.name === "footer" && (this._hasFooter = a4), this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._hasHeader = this.querySelector(':scope > [slot="header"]') !== null, this._hasFooter = this.querySelector(':scope > [slot="footer"]') !== null;
  }
  render() {
    return b2`
      <div part="card" class="card">
        <div part="header" class="header" ?hidden=${!this._hasHeader}>
          <slot name="header" @slotchange=${this._onSlotChange}></slot>
        </div>
        <div part="body" class="body">
          <slot></slot>
        </div>
        <div part="footer" class="footer" ?hidden=${!this._hasFooter}>
          <slot name="footer" @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `;
  }
};
xt.styles = i`
    :host {
      --ae-card-bg: var(--ae-color-bg-elevated);
      --ae-card-fg: var(--ae-color-fg);
      --ae-card-border: var(--ae-color-border);
      --ae-card-radius: var(--ae-radius-lg);
      --ae-card-padding: var(--ae-space-4);
      --ae-card-title-font-family: var(--ae-font-family-display);
      display: block;
    }

    .card {
      background: var(--ae-card-bg);
      backdrop-filter: var(--ae-card-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-card-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-card-fg);
      border: var(--ae-border-width-1) solid var(--ae-card-border);
      border-radius: var(--ae-card-radius);
      overflow: hidden;
      transition: box-shadow var(--ae-duration-fast) var(--ae-easing-ease-out),
        transform var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    :host([elevation='flat']) .card { box-shadow: var(--ae-shadow-none); }
    :host([elevation='low']) .card  { box-shadow: var(--ae-shadow-xs); }
    :host([elevation='mid']) .card  { box-shadow: var(--ae-shadow-md); }
    :host([elevation='high']) .card { box-shadow: var(--ae-shadow-lg); }

    :host([interactive]) .card {
      cursor: pointer;
    }
    :host([interactive]) .card:hover {
      box-shadow: var(--ae-shadow-md);
    }
    :host([interactive]) .card:active {
      transform: translateY(1px);
    }

    .header,
    .body,
    .footer {
      padding: var(--ae-card-padding);
    }
    .header { border-bottom: var(--ae-border-width-1) solid var(--ae-color-border-subtle); }
    .footer { border-top: var(--ae-border-width-1) solid var(--ae-color-border-subtle); background: var(--ae-color-bg-subtle); }

    /* Route slotted heading-level title to the display font family.
     * Editorial-direction themes flip --ae-font-family-display to a
     * serif stack, so card titles automatically pick up the serif. */
    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      font-family: var(--ae-card-title-font-family);
    }

    :host([padding='none']) .header,
    :host([padding='none']) .body,
    :host([padding='none']) .footer { padding: 0; }
    :host([padding='sm']) { --ae-card-padding: var(--ae-space-3); }
    :host([padding='md']) { --ae-card-padding: var(--ae-space-4); }
    :host([padding='lg']) { --ae-card-padding: var(--ae-space-6); }

    /* Hide header/footer wrappers when their slots are empty */
    .header:not(:has(slot[name='header']:not([data-empty]))) { display: none; }
    .footer:not(:has(slot[name='footer']:not([data-empty]))) { display: none; }
  `;
_a([
  n4({ type: String, reflect: true })
], xt.prototype, "elevation", 2);
_a([
  n4({ type: String, reflect: true })
], xt.prototype, "padding", 2);
_a([
  n4({ type: Boolean, reflect: true })
], xt.prototype, "interactive", 2);
xt = _a([
  t3("ae-card")
], xt);
var Dr = Object.defineProperty;
var Pr = Object.getOwnPropertyDescriptor;
var Wt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Pr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Dr(t5, a4, i7), i7;
};
var tt = class extends i4 {
  constructor() {
    super(...arguments), this.tone = "neutral", this.variant = "soft", this.size = "md", this.removable = false, this._onRemove = (e8) => {
      e8.stopPropagation(), this.dispatchEvent(
        new CustomEvent("ae-remove", { bubbles: true, composed: true })
      );
    };
  }
  render() {
    return b2`
      <span part="tag" class="tag">
        <slot name="start"></slot>
        <slot></slot>
        ${this.removable ? b2`<button
              part="remove"
              class="remove"
              aria-label="Remove"
              @click=${this._onRemove}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" width="10" height="10">
                <path
                  d="M3 3 L9 9 M9 3 L3 9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>` : A}
      </span>
    `;
  }
};
tt.styles = i`
    :host {
      --_bg: var(--ae-color-bg-muted);
      --_fg: var(--ae-color-fg);
      --_border: transparent;
      display: inline-flex;
      vertical-align: middle;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-1);
      background: var(--_bg);
      backdrop-filter: var(--ae-tag-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-tag-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--_fg);
      border: var(--ae-border-width-1) solid var(--_border);
      /* Default to pill (--ae-radius-full); theme packs can flatten to
       * rectangle via --ae-tag-radius. Token is consumed via var()
       * with a fallback so themes can override at :root.<name> without
       * the cascade-shadowing trap that a :host default would create. */
      border-radius: var(--ae-tag-radius, var(--ae-radius-full));
      font-size: var(--ae-tag-font-size, var(--ae-font-size-xs));
      font-weight: var(--ae-tag-font-weight, var(--ae-font-weight-medium));
      line-height: var(--ae-tag-line-height, 1);
      white-space: nowrap;
      padding: var(--ae-tag-padding, var(--ae-space-1) var(--ae-space-2));
    }
    :host([size='sm']) .tag {
      font-size: 0.6875rem;
      padding: 2px var(--ae-space-2);
    }

    /* Tone × variant matrix */
    :host([tone='neutral'][variant='soft']) {
      --_bg: var(--ae-color-bg-muted);
      --_fg: var(--ae-color-fg);
    }
    :host([tone='neutral'][variant='solid']) {
      --_bg: var(--ae-color-gray-800);
      --_fg: var(--ae-color-gray-0);
    }
    :host([tone='neutral'][variant='outline']) {
      --_bg: transparent;
      --_fg: var(--ae-color-fg);
      --_border: var(--ae-color-border-strong);
    }

    :host([tone='accent'][variant='soft']) {
      --_bg: var(--ae-color-accent-subtle);
      --_fg: var(--ae-color-accent-emphasis);
    }
    :host([tone='accent'][variant='solid']) {
      --_bg: var(--ae-color-accent);
      --_fg: var(--ae-color-fg-on-accent);
    }
    :host([tone='accent'][variant='outline']) {
      --_bg: transparent;
      --_fg: var(--ae-color-accent-emphasis);
      --_border: var(--ae-color-accent);
    }

    :host([tone='success'][variant='soft']) {
      --_bg: var(--ae-color-success-subtle);
      --_fg: var(--ae-color-success-emphasis);
    }
    :host([tone='success'][variant='solid']) {
      --_bg: var(--ae-color-success);
      --_fg: var(--ae-color-fg-on-success);
    }

    :host([tone='warning'][variant='soft']) {
      --_bg: var(--ae-color-warning-subtle);
      --_fg: var(--ae-color-warning-emphasis);
    }
    :host([tone='warning'][variant='solid']) {
      --_bg: var(--ae-color-warning);
      --_fg: var(--ae-color-fg-on-warning);
    }

    :host([tone='danger'][variant='soft']) {
      --_bg: var(--ae-color-danger-subtle);
      --_fg: var(--ae-color-danger-emphasis);
    }
    :host([tone='danger'][variant='solid']) {
      --_bg: var(--ae-color-danger);
      --_fg: var(--ae-color-fg-on-danger);
    }

    :host([tone='info'][variant='soft']) {
      --_bg: var(--ae-color-info-subtle);
      --_fg: var(--ae-color-info-emphasis);
    }
    :host([tone='info'][variant='solid']) {
      --_bg: var(--ae-color-info);
      --_fg: var(--ae-color-fg-on-info);
    }

    .remove {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      transition: opacity var(--ae-duration-fast);
    }
    .remove:hover,
    .remove:focus-visible {
      opacity: 1;
    }
    .remove:focus-visible {
      outline: var(--ae-focus-ring-width) var(--ae-focus-ring-style)
        var(--ae-color-focus-ring);
      outline-offset: 1px;
    }
  `;
Wt([
  n4({ type: String, reflect: true })
], tt.prototype, "tone", 2);
Wt([
  n4({ type: String, reflect: true })
], tt.prototype, "variant", 2);
Wt([
  n4({ type: String, reflect: true })
], tt.prototype, "size", 2);
Wt([
  n4({ type: Boolean, reflect: true })
], tt.prototype, "removable", 2);
tt = Wt([
  t3("ae-tag")
], tt);
var Or = Object.defineProperty;
var Tr = Object.getOwnPropertyDescriptor;
var Et = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Tr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Or(t5, a4, i7), i7;
};
var Le = class extends i4 {
  constructor() {
    super(...arguments), this.tone = "danger", this.variant = "number", this.max = 99, this.label = "";
  }
  render() {
    if (this.variant === "dot")
      return this.label ? b2`<span class="badge" role="img" aria-label=${this.label}></span>` : b2`<span class="badge" aria-hidden="true"></span>`;
    const e8 = typeof this.count == "number" ? this.count > this.max ? `${this.max}+` : String(this.count) : A;
    return this.label ? b2`<span class="badge" role="img" aria-label=${this._numberAriaLabel(e8)}
          ><span aria-hidden="true">${e8}<slot></slot></span
        ></span>` : b2`<span class="badge">${e8}<slot></slot></span>`;
  }
  _numberAriaLabel(e8) {
    const t5 = typeof e8 == "string" ? e8 : "";
    return t5 ? `${t5} ${this.label}`.trim() : this.label;
  }
};
Le.styles = i`
    :host {
      --_bg: var(--ae-color-danger);
      --_fg: var(--ae-color-fg-on-danger);
      display: inline-flex;
      vertical-align: middle;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--_bg);
      color: var(--_fg);
      font-size: 0.6875rem;
      font-weight: var(--ae-font-weight-semibold);
      line-height: 1;
      min-width: 1.25rem;
      height: 1.25rem;
      padding: 0 var(--ae-space-1);
      border-radius: var(--ae-radius-full);
      box-sizing: border-box;
    }

    :host([variant='dot']) .badge {
      min-width: 0.5rem;
      height: 0.5rem;
      padding: 0;
    }

    :host([tone='neutral']) { --_bg: var(--ae-color-gray-600); --_fg: var(--ae-color-gray-0); }
    :host([tone='accent'])  { --_bg: var(--ae-color-accent); --_fg: var(--ae-color-fg-on-accent); }
    :host([tone='success']) { --_bg: var(--ae-color-success); --_fg: var(--ae-color-fg-on-success); }
    :host([tone='warning']) { --_bg: var(--ae-color-warning); --_fg: var(--ae-color-fg-on-warning); }
    :host([tone='danger'])  { --_bg: var(--ae-color-danger); --_fg: var(--ae-color-fg-on-danger); }
    :host([tone='info'])    { --_bg: var(--ae-color-info); --_fg: var(--ae-color-fg-on-info); }
  `;
Et([
  n4({ type: String, reflect: true })
], Le.prototype, "tone", 2);
Et([
  n4({ type: String, reflect: true })
], Le.prototype, "variant", 2);
Et([
  n4({ type: Number })
], Le.prototype, "max", 2);
Et([
  n4({ type: Number })
], Le.prototype, "count", 2);
Et([
  n4({ type: String })
], Le.prototype, "label", 2);
Le = Et([
  t3("ae-badge")
], Le);
var Lr = Object.defineProperty;
var Ir = Object.getOwnPropertyDescriptor;
var Da = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ir(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Lr(t5, a4, i7), i7;
};
var Vt = class extends i4 {
  constructor() {
    super(...arguments), this.size = "md", this.label = "Loading";
  }
  render() {
    return b2`
      <svg viewBox="0 0 32 32" role="status" aria-label=${this.label}>
        <circle class="track" cx="16" cy="16" r="13"></circle>
        <circle class="indicator" cx="16" cy="16" r="13"></circle>
      </svg>
      <span class="stripe-ring" role="status" aria-label=${this.label}></span>
    `;
  }
};
Vt.styles = i`
    /*
     * Tier 3 spinner tokens (--ae-spinner-size / -track / -color) are
     * consumed via var(--token, fallback) below rather than declared
     * at :host. A :host declaration would shadow inherited root-level
     * theme overrides — see ae-input.ts for the cascade reasoning.
     *
     * The size attribute selectors below DO set --ae-spinner-size at
     * :host because that's a per-instance size variant, not a token
     * themes care about — themes wanting to override size would target
     * the element directly.
     */
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--ae-spinner-size, 1.25rem);
      height: var(--ae-spinner-size, 1.25rem);
    }
    :host([size='xs']) { --ae-spinner-size: 0.75rem; }
    :host([size='sm']) { --ae-spinner-size: 1rem; }
    :host([size='md']) { --ae-spinner-size: 1.25rem; }
    :host([size='lg']) { --ae-spinner-size: 1.75rem; }
    :host([size='xl']) { --ae-spinner-size: 2.5rem; }

    svg {
      width: 100%;
      height: 100%;
      display: var(--ae-spinner-svg-display, block);
      animation: ae-spinner-rotate 1.4s linear infinite;
    }
    circle {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      transform-origin: center;
    }
    .track {
      stroke: var(--ae-spinner-track, color-mix(in oklch, currentColor 20%, transparent));
    }
    .indicator {
      stroke: var(--ae-spinner-color, currentColor);
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0;
      animation: ae-spinner-dash 1.4s ease-in-out infinite;
    }

    /*
     * Optional stripe-ring variant. Hidden by default (display: none);
     * a theme opts in by flipping --ae-spinner-stripe-display to block
     * AND --ae-spinner-svg-display to none. The square element is
     * painted with --ae-spinner-stripe (a color or gradient) and
     * masked into a ring band so the diagonal hazard tape shows through a
     * STATIC ring window. The tape scrolls left→right via background-position
     * (it does NOT rotate) — the same trick ae-button's loading bar uses — and
     * Metro feeds it the same --ae-hazard-tape gradient as --ae-progress-fill.
     * SVG strokes can't take a CSS gradient, which is why this is a separate
     * masked div rather than a token on the arc.
     */
    .stripe-ring {
      display: var(--ae-spinner-stripe-display, none);
      width: 100%;
      height: 100%;
      background: var(--ae-spinner-stripe, transparent);
      /* Tile the tape into a fixed square = one full 45° period in BOTH axes
         (an 8px tape → 8·√2 ≈ 11.3137px). Tiling then reconstructs the gradient
         seamlessly, and because the scroll shifts by this SAME distance the loop
         lands on an identical tile — pixel-exact, no reset hitch. Without a fixed
         tile the gradient renders at element size and background-repeat seams it,
         which jumps on the ring (it's hidden on the thin loading bar). */
      background-size:
        var(--ae-spinner-stripe-cycle, 11.3137px)
        var(--ae-spinner-stripe-cycle, 11.3137px);
      /*
       * Ring mask. The four stops matter: transparent center → opaque
       * band → hard transparent at 100%. Without the final transparent
       * stop the gradient's last color continues past the inscribed
       * circle out to the SQUARE's corners, rendering as "a square with
       * a hole punched in it" rather than a ring.
       */
      -webkit-mask: radial-gradient(
        farthest-side,
        transparent calc(100% - var(--ae-spinner-stripe-band, 3px)),
        #000 calc(100% - var(--ae-spinner-stripe-band, 3px)),
        #000 100%,
        transparent 100%
      );
      mask: radial-gradient(
        farthest-side,
        transparent calc(100% - var(--ae-spinner-stripe-band, 3px)),
        #000 calc(100% - var(--ae-spinner-stripe-band, 3px)),
        #000 100%,
        transparent 100%
      );
      animation: ae-spinner-stripe-scroll var(--ae-spinner-stripe-duration, 0.8s)
        linear infinite;
    }

    @keyframes ae-spinner-stripe-scroll {
      /* Static ring; scroll the tape left→right. A 45° tape with an 8px diagonal
         period repeats after an 8·√2 ≈ 11.3137px horizontal shift — one seamless
         cycle, the same background-position scroll as ae-button's loading bar. */
      to { background-position: var(--ae-spinner-stripe-cycle, 11.3137px) 0; }
    }

    @keyframes ae-spinner-rotate {
      to { transform: rotate(360deg); }
    }
    @keyframes ae-spinner-dash {
      0%   { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
      50%  { stroke-dasharray: 90, 200; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124; }
    }

    /*
     * Reduced-motion: stop the continuous spin. The static arc (.indicator
     * keeps its base 80,200 dasharray) plus role="status" / aria-label keep
     * the loading state perceivable without vestibular-triggering motion.
     * The global token reset can't reach these hardcoded-duration keyframes.
     */
    @media (prefers-reduced-motion: reduce) {
      svg,
      .indicator,
      .stripe-ring {
        animation: none;
      }
    }
  `;
Da([
  n4({ type: String, reflect: true })
], Vt.prototype, "size", 2);
Da([
  n4({ type: String })
], Vt.prototype, "label", 2);
Vt = Da([
  t3("ae-spinner")
], Vt);
var Mr = [
  "aria-label",
  "aria-description"
];
var Ce = class {
  constructor(t5, a4) {
    this._descForwarded = null, this._labelForwarded = false, this._host = t5, this._getTarget = a4, t5.addController(this);
  }
  hostConnected() {
    typeof MutationObserver == "function" && (this._observer = new MutationObserver(() => this._host.requestUpdate()), this._observer.observe(this._host, {
      attributes: true,
      attributeFilter: [...Mr]
    })), this.sync();
  }
  hostDisconnected() {
    var t5;
    (t5 = this._observer) == null || t5.disconnect(), this._observer = void 0;
  }
  hostUpdated() {
    this.sync();
  }
  /**
   * Copy each forwarded attribute from host → inner control. An empty or
   * absent value clears the corresponding attribute on the target so that
   * removing a label on the host removes it on the control too.
   *
   * The attribute is intentionally LEFT on the host as well: the host
   * wrapper carries no implicit ARIA role, so a stray `aria-label` on it is
   * not surfaced as a separate accessible node — but stripping it would
   * fight `ae-form-field`, which sets the attribute on the host and would
   * otherwise see it vanish on the next mutation tick.
   */
  sync() {
    const t5 = this._getTarget();
    if (!t5) return;
    const a4 = this._host.getAttribute("aria-label");
    a4 !== null && a4 !== "" ? (t5.getAttribute("aria-label") !== a4 && t5.setAttribute("aria-label", a4), this._labelForwarded = true) : this._labelForwarded && (t5.removeAttribute("aria-label"), this._labelForwarded = false);
    const r6 = this._host.getAttribute("aria-description");
    r6 !== null && r6 !== "" ? (t5.getAttribute("aria-description") !== r6 && t5.setAttribute("aria-description", r6), this._descForwarded = r6, this._host.removeAttribute("aria-description")) : this._descForwarded === null && t5.hasAttribute("aria-description") && t5.removeAttribute("aria-description");
  }
};
var Br = Object.defineProperty;
var Fr = Object.getOwnPropertyDescriptor;
var $3 = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Fr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Br(t5, a4, i7), i7;
};
var x2 = class extends i4 {
  constructor() {
    super(), this.type = "text", this.value = "", this.placeholder = "", this.disabled = false, this.readonly = false, this.required = false, this.invalid = false, this.name = "", this.size = "md", this.min = "", this.max = "", this.step = "", this.autocomplete = "", this.inputmode = "", this.pattern = "", this.spellcheck = true, this.autofocus = false, this.clearable = false, this._hasStart = false, this._hasEnd = false, this._ariaForward = new Ce(this, () => this._input), this._onStartSlotChange = (e8) => {
      const t5 = e8.target;
      this._hasStart = t5.assignedNodes({ flatten: true }).length > 0;
    }, this._onEndSlotChange = (e8) => {
      const t5 = e8.target;
      this._hasEnd = t5.assignedNodes({ flatten: true }).length > 0;
    }, this._onInput = (e8) => {
      this.value = e8.target.value, this.dispatchEvent(
        new CustomEvent("ae-input", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      );
    }, this._onChange = () => {
      this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      );
    }, this._onClear = () => {
      var e8;
      this.value = "", this.dispatchEvent(
        new CustomEvent("ae-clear", { bubbles: true, composed: true })
      ), this.dispatchEvent(
        new CustomEvent("ae-input", {
          bubbles: true,
          composed: true,
          detail: { value: "" }
        })
      ), (e8 = this._input) == null || e8.focus();
    }, this._onStepUp = () => this._stepValue(1), this._onStepDown = () => this._stepValue(-1), this._preventBlur = (e8) => e8.preventDefault(), this._internals = typeof this.attachInternals == "function" ? this.attachInternals() : null;
  }
  connectedCallback() {
    super.connectedCallback(), this._hasStart = this.querySelector(':scope > [slot="start"]') !== null, this._hasEnd = this.querySelector(':scope > [slot="end"]') !== null;
  }
  render() {
    const e8 = this.clearable && !this.disabled && !this.readonly && this.value !== "";
    return b2`
      <div part="wrapper" class="wrapper">
        <span class="affix affix-start" ?hidden=${!this._hasStart}>
          <slot name="start" @slotchange=${this._onStartSlotChange}></slot>
        </span>
        <input
          part="input"
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder || A}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${this.invalid ? "true" : A}
          name=${this.name || A}
          min=${this.min || A}
          max=${this.max || A}
          step=${this.step || A}
          autocomplete=${this.autocomplete || A}
          inputmode=${this.inputmode || A}
          pattern=${this.pattern || A}
          spellcheck=${this.spellcheck ? A : "false"}
          @input=${this._onInput}
          @change=${this._onChange}
        />
        ${this.type === "number" ? b2`<span part="stepper" class="stepper">
              <button
                part="stepper-up"
                class="stepper-btn"
                type="button"
                tabindex="-1"
                aria-label="Increase"
                ?disabled=${this.disabled || this.readonly || this._atBound(1)}
                @mousedown=${this._preventBlur}
                @click=${this._onStepUp}
              >
                <svg viewBox="0 0 10 10" aria-hidden="true" width="10" height="10">
                  <path
                    d="M2 6.25 L5 3.25 L8 6.25"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                part="stepper-down"
                class="stepper-btn"
                type="button"
                tabindex="-1"
                aria-label="Decrease"
                ?disabled=${this.disabled || this.readonly || this._atBound(-1)}
                @mousedown=${this._preventBlur}
                @click=${this._onStepDown}
              >
                <svg viewBox="0 0 10 10" aria-hidden="true" width="10" height="10">
                  <path
                    d="M2 3.75 L5 6.75 L8 3.75"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </span>` : A}
        ${e8 ? b2`<button
              part="clear"
              class="clear"
              type="button"
              aria-label="Clear input"
              @click=${this._onClear}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true" width="10" height="10">
                <path
                  d="M3 3 L9 9 M9 3 L3 9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>` : A}
        <span class="affix affix-end" ?hidden=${!this._hasEnd}>
          <slot name="end" @slotchange=${this._onEndSlotChange}></slot>
        </span>
      </div>
    `;
  }
  willUpdate(e8) {
    e8.has("value") && typeof this.value != "string" && (this.value = this.value == null ? "" : String(this.value));
  }
  updated(e8) {
    (e8.has("value") || e8.has("required")) && this._syncFormState();
  }
  _syncFormState() {
    var e8;
    typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function" && (this._internals.setFormValue(this.value), this.required && this.value === "" ? this._internals.setValidity({ valueMissing: true }, "Please fill out this field.", this._input) : this._internals.setValidity({}));
  }
  // -- Number stepper ---------------------------------------------------
  // type="number" renders a ± spinner (v1 number-input parity). The native UA
  // spinners are stripped in CSS; these give a consistent, larger hit target
  // and themeable chrome. Keyboard users still get the native ArrowUp/Down on
  // the focused input, so the buttons are mouse affordance (tabindex -1) — the
  // behavior stays keyboard-operable without adding redundant tab stops.
  /** Numeric step, defaulting to 1. `step="any"` and invalid values → 1. */
  _numericStep() {
    const e8 = (this.step ?? "").trim();
    if (!e8 || e8 === "any") return 1;
    const t5 = Number(e8);
    return Number.isFinite(t5) && t5 > 0 ? t5 : 1;
  }
  /** Parse a numeric bound attr to a number, or null when unset/blank. */
  _bound(e8) {
    const t5 = (e8 ?? "").trim();
    if (t5 === "") return null;
    const a4 = Number(t5);
    return Number.isFinite(a4) ? a4 : null;
  }
  _currentNumber() {
    const e8 = this.value.trim();
    if (e8 === "") return null;
    const t5 = Number(e8);
    return Number.isFinite(t5) ? t5 : null;
  }
  /** Decimal places implied by the step, so we round away float drift. */
  _stepDecimals(e8) {
    const t5 = String(e8), a4 = t5.indexOf(".");
    return a4 === -1 ? 0 : t5.length - a4 - 1;
  }
  /** True when stepping in `dir` is impossible (value already at the bound). */
  _atBound(e8) {
    const t5 = this._currentNumber();
    if (t5 == null) return false;
    const a4 = this._bound(this.min), r6 = this._bound(this.max);
    return e8 > 0 ? r6 != null && t5 >= r6 : a4 != null && t5 <= a4;
  }
  _stepValue(e8) {
    var d3, p3;
    if (this.disabled || this.readonly) return;
    const t5 = this._numericStep(), a4 = this._bound(this.min), r6 = this._bound(this.max), i7 = this._currentNumber();
    let s4;
    i7 == null ? s4 = e8 > 0 ? a4 ?? t5 : r6 ?? -t5 : s4 = i7 + e8 * t5, a4 != null && s4 < a4 && (s4 = a4), r6 != null && s4 > r6 && (s4 = r6);
    const o9 = this._stepDecimals(t5);
    o9 > 0 && (s4 = Number(s4.toFixed(Math.min(o9, 100))));
    const h3 = String(s4);
    if (h3 === this.value) {
      (d3 = this._input) == null || d3.focus();
      return;
    }
    this.value = h3, this.dispatchEvent(
      new CustomEvent("ae-input", { bubbles: true, composed: true, detail: { value: this.value } })
    ), this.dispatchEvent(
      new CustomEvent("ae-change", { bubbles: true, composed: true, detail: { value: this.value } })
    ), (p3 = this._input) == null || p3.focus();
  }
  focus(e8) {
    var t5;
    (t5 = this._input) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._input) == null || e8.blur();
  }
  firstUpdated() {
    var e8;
    this.autofocus && ((e8 = this._input) == null || e8.focus());
  }
  /** Form-association lifecycle: invoked when the host form is reset. */
  formResetCallback() {
    this.value = "";
  }
};
x2.formAssociated = true;
x2.styles = i`
    /*
     * Tier 3 tokens (--ae-input-bg / -bg-hover / -bg-focus / -border /
     * -border-hover / -border-focus / -fg / -radius / -placeholder) are
     * read inside the .wrapper rules via var(--token, fallback) rather
     * than declared at :host. A :host declaration would be a directly-
     * applied rule on the shadow host that shadows root-level theme
     * overrides via the cascade (inheritance loses to direct rules),
     * which prevents themes from overriding these tokens at :root.<name>.
     * Using var() fallback at the consumption point lets root overrides
     * flow into the shadow root through inheritance.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
      width: 100%;
    }

    .wrapper {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-2);
      width: 100%;
      background: var(--ae-input-bg, var(--ae-color-bg));
      /* Frosted-glass hook: inert (none) for every theme except those that set
       * --ae-surface-backdrop-filter (Crucible). The field bg must be
       * translucent for the blur to refract — Crucible makes --ae-input-bg so. */
      backdrop-filter: var(--ae-input-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-input-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-input-fg, var(--ae-color-fg));
      border: var(--ae-border-width-1) solid
        var(--ae-input-border, var(--ae-color-border-strong));
      border-radius: var(--ae-input-radius, var(--ae-radius-default));
      padding: 0 var(--ae-space-3);
      transition:
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        box-shadow var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    .wrapper:hover:not(:focus-within) {
      background: var(--ae-input-bg-hover, var(--ae-input-bg, var(--ae-color-bg)));
      border-color: var(--ae-input-border-hover,
        var(--ae-input-border, var(--ae-color-border-strong)));
    }

    .wrapper:focus-within {
      ${y3}
      background: var(--ae-input-bg-focus, var(--ae-input-bg, var(--ae-color-bg)));
      border-color: var(--ae-input-border-focus, var(--ae-color-accent));
    }

    :host([invalid]) .wrapper,
    :host([invalid]) .wrapper:hover:not(:focus-within),
    :host([invalid]) .wrapper:focus-within {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .wrapper:focus-within {
      ${ie}
    }

    :host([disabled]) .wrapper {
      background: var(--ae-color-bg-subtle);
      color: var(--ae-color-fg-disabled);
      cursor: not-allowed;
    }

    :host([readonly]) .wrapper {
      background: var(--ae-color-bg-subtle);
    }

    input {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      font: inherit;
      color: inherit;
      background: transparent;
      line-height: 1;
    }
    input::placeholder {
      color: var(--ae-input-placeholder, var(--ae-color-fg-subtle));
      opacity: 1;
    }
    input:disabled {
      cursor: not-allowed;
    }
    /* Remove number-input UA spinners (consistent across sizes/themes). */
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }

    /* Sizes */
    :host([size='sm']) .wrapper {
      font-size: var(--ae-font-size-sm);
      min-height: 1.75rem;
    }
    :host([size='md']) .wrapper {
      font-size: var(--ae-font-size-sm);
      min-height: 2.25rem;
    }
    :host([size='lg']) .wrapper {
      font-size: var(--ae-font-size-md);
      min-height: 2.75rem;
    }
    :host([size='sm']) input { padding: var(--ae-space-1) 0; }
    :host([size='md']) input { padding: var(--ae-space-2) 0; }
    :host([size='lg']) input { padding: var(--ae-space-3) 0; }

    .affix {
      display: inline-flex;
      align-items: center;
      align-self: stretch;
      color: var(--ae-color-fg-muted);
      flex: 0 0 auto;
      background: var(--ae-input-affix-bg, transparent);
      padding: var(--ae-input-affix-padding, 0);
    }
    .affix-start {
      /* Pull the start affix flush against the wrapper's left edge
       * so themes that style it as a paper-2 cell (Metro) read as a
       * contiguous prefix block rather than a floating icon. The
       * negative margin matches the wrapper's horizontal padding. */
      margin-left: var(--ae-input-affix-pull, 0);
      margin-right: var(--ae-input-affix-gap, 0);
      border-right: var(--ae-input-affix-separator, 0 solid transparent);
    }
    .affix-end {
      margin-right: var(--ae-input-affix-pull, 0);
      margin-left: var(--ae-input-affix-gap, 0);
      border-left: var(--ae-input-affix-separator, 0 solid transparent);
    }
    .affix[hidden] { display: none; }

    .clear {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25em;
      height: 1.25em;
      border-radius: 50%;
      cursor: pointer;
      color: var(--ae-color-fg-muted);
      opacity: 0.7;
      transition: opacity var(--ae-duration-fast);
    }
    .clear:hover,
    .clear:focus-visible {
      opacity: 1;
    }
    .clear:focus-visible {
      ${y3}
    }

    /* Number stepper (type="number"). A vertical ± strip on the trailing edge,
     * replacing the stripped UA spinners. Geometry defaults to v1's metrics
     * (20x14 buttons, 10px chevrons) so every theme gets a clean spinner and
     * the Spectrum collection matches v1 with no extra overrides; colors flow
     * from semantic tokens so each theme is correct automatically. */
    .stepper {
      display: flex;
      flex-direction: column;
      flex: none;
      align-self: center;
      justify-content: center;
      gap: var(--ae-input-stepper-gap, 1px);
      padding: var(--ae-input-stepper-padding, 0 2px 0 0);
    }
    .stepper-btn {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--ae-input-stepper-btn-width, 1.25rem);
      height: var(--ae-input-stepper-btn-height, 0.875rem);
      border-radius: var(--ae-input-stepper-radius, var(--ae-radius-xs));
      color: var(--ae-input-stepper-color, var(--ae-color-fg-muted));
      cursor: pointer;
      transition:
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        opacity var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .stepper-btn:hover:not(:disabled) {
      color: var(--ae-input-stepper-color-hover, var(--ae-color-fg));
      background: var(--ae-input-stepper-bg-hover, var(--ae-color-hover-overlay));
    }
    .stepper-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }
    .stepper-btn svg {
      width: var(--ae-input-stepper-icon-size, 10px);
      height: var(--ae-input-stepper-icon-size, 10px);
      display: block;
    }

    ${Yt}
  `;
$3([
  n4({ type: String, reflect: true })
], x2.prototype, "type", 2);
$3([
  n4({ type: String })
], x2.prototype, "value", 2);
$3([
  n4({ type: String })
], x2.prototype, "placeholder", 2);
$3([
  n4({ type: Boolean, reflect: true })
], x2.prototype, "disabled", 2);
$3([
  n4({ type: Boolean, reflect: true })
], x2.prototype, "readonly", 2);
$3([
  n4({ type: Boolean, reflect: true })
], x2.prototype, "required", 2);
$3([
  n4({ type: Boolean, reflect: true })
], x2.prototype, "invalid", 2);
$3([
  n4({ type: String, reflect: true })
], x2.prototype, "name", 2);
$3([
  n4({ type: String, reflect: true })
], x2.prototype, "size", 2);
$3([
  n4({ type: String })
], x2.prototype, "min", 2);
$3([
  n4({ type: String })
], x2.prototype, "max", 2);
$3([
  n4({ type: String })
], x2.prototype, "step", 2);
$3([
  n4({ type: String })
], x2.prototype, "autocomplete", 2);
$3([
  n4({ type: String })
], x2.prototype, "inputmode", 2);
$3([
  n4({ type: String })
], x2.prototype, "pattern", 2);
$3([
  n4({ type: Boolean })
], x2.prototype, "spellcheck", 2);
$3([
  n4({ type: Boolean })
], x2.prototype, "autofocus", 2);
$3([
  n4({ type: Boolean, reflect: true })
], x2.prototype, "clearable", 2);
$3([
  r5()
], x2.prototype, "_hasStart", 2);
$3([
  r5()
], x2.prototype, "_hasEnd", 2);
$3([
  e5("input")
], x2.prototype, "_input", 2);
x2 = $3([
  t3("ae-input")
], x2);
var jr = Object.defineProperty;
var Nr = Object.getOwnPropertyDescriptor;
var I2 = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Nr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && jr(t5, a4, i7), i7;
};
var S3 = class extends i4 {
  constructor() {
    super(), this.value = "", this.placeholder = "", this.disabled = false, this.readonly = false, this.required = false, this.invalid = false, this.name = "", this.size = "md", this.rows = 3, this.autoresize = false, this.spellcheck = true, this._ariaForward = new Ce(this, () => this._ta), this._onInput = (e8) => {
      this.value = e8.target.value, this.dispatchEvent(
        new CustomEvent("ae-input", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      );
    }, this._onChange = () => {
      this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      );
    }, this._internals = typeof this.attachInternals == "function" ? this.attachInternals() : null;
  }
  render() {
    return b2`
      <div part="wrapper" class="wrapper">
        <textarea
          part="textarea"
          .value=${this.value}
          rows=${this.rows}
          placeholder=${this.placeholder || A}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${this.invalid ? "true" : A}
          name=${this.name || A}
          maxlength=${this.maxlength ?? A}
          minlength=${this.minlength ?? A}
          spellcheck=${this.spellcheck ? A : "false"}
          @input=${this._onInput}
          @change=${this._onChange}
        ></textarea>
      </div>
    `;
  }
  updated(e8) {
    (e8.has("value") || e8.has("required")) && this._syncFormState(), this.autoresize && e8.has("value") && !this._supportsFieldSizing() && this._autosize();
  }
  _supportsFieldSizing() {
    var e8;
    return ((e8 = CSS == null ? void 0 : CSS.supports) == null ? void 0 : e8.call(CSS, "field-sizing", "content")) ?? false;
  }
  _autosize() {
    const e8 = this._ta;
    e8 && (e8.style.height = "auto", e8.style.height = `${e8.scrollHeight}px`);
  }
  _syncFormState() {
    var e8;
    typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function" && (this._internals.setFormValue(this.value), this.required && this.value === "" ? this._internals.setValidity({ valueMissing: true }, "Please fill out this field.", this._ta) : this._internals.setValidity({}));
  }
  focus(e8) {
    var t5;
    (t5 = this._ta) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._ta) == null || e8.blur();
  }
  formResetCallback() {
    this.value = "";
  }
};
S3.formAssociated = true;
S3.styles = i`
    /*
     * Tier 3 tokens read via var(--token, fallback) instead of declared
     * at :host — see the equivalent comment in ae-input.ts for the
     * cascade-shadowing reasoning.
     */
    :host {
      display: inline-flex;
      vertical-align: top;
      width: 100%;
    }

    .wrapper {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      background: var(--ae-textarea-bg, var(--ae-color-bg));
      /* Frosted-glass hook — see ae-input.ts. Inert unless a theme sets
       * --ae-surface-backdrop-filter and a translucent --ae-textarea-bg. */
      backdrop-filter: var(--ae-textarea-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-textarea-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-textarea-fg, var(--ae-color-fg));
      border: var(--ae-border-width-1) solid
        var(--ae-textarea-border, var(--ae-color-border-strong));
      border-radius: var(--ae-textarea-radius, var(--ae-radius-default));
      transition:
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        box-shadow var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    .wrapper:hover:not(:focus-within) {
      background: var(--ae-textarea-bg-hover, var(--ae-textarea-bg, var(--ae-color-bg)));
      border-color: var(--ae-textarea-border-hover,
        var(--ae-textarea-border, var(--ae-color-border-strong)));
    }

    .wrapper:focus-within {
      ${y3}
      background: var(--ae-textarea-bg-focus, var(--ae-textarea-bg, var(--ae-color-bg)));
      border-color: var(--ae-textarea-border-focus, var(--ae-color-accent));
    }

    :host([invalid]) .wrapper,
    :host([invalid]) .wrapper:hover:not(:focus-within),
    :host([invalid]) .wrapper:focus-within {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .wrapper:focus-within {
      ${ie}
    }

    :host([disabled]) .wrapper {
      background: var(--ae-color-bg-subtle);
      color: var(--ae-color-fg-disabled);
      cursor: not-allowed;
    }
    :host([readonly]) .wrapper {
      background: var(--ae-color-bg-subtle);
    }

    textarea {
      all: unset;
      flex: 1 1 auto;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      font: inherit;
      color: inherit;
      background: transparent;
      line-height: var(--ae-line-height-normal);
      resize: vertical;
      padding: var(--ae-space-2) var(--ae-space-3);
    }
    textarea::placeholder {
      color: var(--ae-textarea-placeholder, var(--ae-color-fg-subtle));
      opacity: 1;
    }
    textarea:disabled {
      cursor: not-allowed;
      resize: none;
    }

    /* Native sizing-with-content where supported. */
    :host([autoresize]) textarea {
      field-sizing: content;
      resize: none;
    }

    /* Sizes */
    :host([size='sm']) .wrapper { font-size: var(--ae-font-size-sm); }
    :host([size='md']) .wrapper { font-size: var(--ae-font-size-sm); }
    :host([size='lg']) .wrapper { font-size: var(--ae-font-size-md); }

    ${Yt}
  `;
I2([
  n4({ type: String })
], S3.prototype, "value", 2);
I2([
  n4({ type: String })
], S3.prototype, "placeholder", 2);
I2([
  n4({ type: Boolean, reflect: true })
], S3.prototype, "disabled", 2);
I2([
  n4({ type: Boolean, reflect: true })
], S3.prototype, "readonly", 2);
I2([
  n4({ type: Boolean, reflect: true })
], S3.prototype, "required", 2);
I2([
  n4({ type: Boolean, reflect: true })
], S3.prototype, "invalid", 2);
I2([
  n4({ type: String, reflect: true })
], S3.prototype, "name", 2);
I2([
  n4({ type: String, reflect: true })
], S3.prototype, "size", 2);
I2([
  n4({ type: Number })
], S3.prototype, "rows", 2);
I2([
  n4({ type: Boolean, reflect: true })
], S3.prototype, "autoresize", 2);
I2([
  n4({ type: Number })
], S3.prototype, "maxlength", 2);
I2([
  n4({ type: Number })
], S3.prototype, "minlength", 2);
I2([
  n4({ type: Boolean })
], S3.prototype, "spellcheck", 2);
I2([
  e5("textarea")
], S3.prototype, "_ta", 2);
S3 = I2([
  t3("ae-textarea")
], S3);
var Rr = Object.defineProperty;
var qr = Object.getOwnPropertyDescriptor;
var Ae = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? qr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Rr(t5, a4, i7), i7;
};
var K = class extends i4 {
  constructor() {
    super(), this.checked = false, this.indeterminate = false, this.disabled = false, this.required = false, this.invalid = false, this.name = "", this.value = "on", this._ariaForward = new Ce(this, () => this._btn), this._onToggle = () => {
      this.disabled || (this.indeterminate ? (this.indeterminate = false, this.checked = true) : this.checked = !this.checked, this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { checked: this.checked }
        })
      ));
    }, this._onKeyDown = (e8) => {
      (e8.key === " " || e8.code === "Space") && (e8.preventDefault(), this._onToggle());
    }, this._internals = typeof this.attachInternals == "function" ? this.attachInternals() : null;
  }
  render() {
    let e8 = "false";
    return this.indeterminate ? e8 = "mixed" : this.checked && (e8 = "true"), b2`
      <button
        class="host-button"
        type="button"
        role="checkbox"
        aria-checked=${e8}
        aria-disabled=${this.disabled ? "true" : A}
        aria-required=${this.required ? "true" : A}
        aria-invalid=${this.invalid ? "true" : A}
        ?disabled=${this.disabled}
        @click=${this._onToggle}
        @keydown=${this._onKeyDown}
      >
        <span part="control" class="control">
          ${this.indeterminate ? b2`<svg class="icon" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 7 L11 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>` : this.checked ? b2`<svg class="icon" viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M3 7 L6 10 L11 4"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>` : A}
        </span>
        <span part="label" class="label"><slot></slot></span>
      </button>
    `;
  }
  updated(e8) {
    (e8.has("checked") || e8.has("required")) && this._syncFormState();
  }
  _syncFormState() {
    var e8;
    typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function" && (this._internals.setFormValue(this.checked ? this.value : null), this.required && !this.checked ? this._internals.setValidity({ valueMissing: true }, "Please check this box if you want to proceed.", this._btn) : this._internals.setValidity({}));
  }
  focus(e8) {
    var t5;
    (t5 = this._btn) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._btn) == null || e8.blur();
  }
  formResetCallback() {
    this.checked = this.hasAttribute("checked"), this.indeterminate = this.hasAttribute("indeterminate");
  }
};
K.formAssociated = true;
K.styles = i`
    /*
     * Theme-overridable tokens (--ae-checkbox-bg, -bg-checked, -border,
     * -border-checked, -fg, -radius) are NOT declared at :host — a :host
     * declaration would shadow inherited root-level theme overrides
     * because directly-applied rules win over inheritance. They are
     * resolved at the consumption point below via var(--token, default)
     * so themes can override them at :root.<theme> and the values
     * cascade into the shadow root through inheritance. Locked down by
     * src/theme-integration.test.ts.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    .host-button {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-2);
      cursor: pointer;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg);
      line-height: var(--ae-line-height-snug);
    }

    .host-button:focus-visible .control {
      ${y3}
    }

    .control {
      box-sizing: border-box;
      width: 1.125rem;
      height: 1.125rem;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--ae-checkbox-bg, var(--ae-color-bg));
      border: var(--ae-checkbox-border-width, var(--ae-border-width-1)) solid
        var(--ae-checkbox-border, var(--ae-color-border-strong));
      border-radius: var(--ae-checkbox-radius, var(--ae-radius-sm));
      color: var(--ae-checkbox-fg, var(--ae-color-fg-on-accent));
      transition:
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    :host([checked]) .control,
    :host([indeterminate]) .control {
      background: var(--ae-checkbox-bg-checked, var(--ae-color-accent));
      border-color: var(--ae-checkbox-border-checked, var(--ae-color-accent));
      /* Bioluminescent accent: a brand (Crucible) can set a molten glow on the
       * checked box without forking the component. Default none. */
      box-shadow: var(--ae-checkbox-glow, none);
    }

    :host([disabled]) .host-button {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }

    /* Invalid: recolor the indicator border to danger. Placed AFTER the
     * checked/indeterminate rule so the danger border wins in every state,
     * matching ae-input's "always danger when invalid" behavior. */
    :host([invalid]) .control {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .host-button:focus-visible .control {
      ${ie}
    }

    .icon {
      width: var(--ae-checkbox-icon-size, 0.875rem);
      height: var(--ae-checkbox-icon-size, 0.875rem);
      display: block;
    }
  `;
Ae([
  n4({ type: Boolean, reflect: true })
], K.prototype, "checked", 2);
Ae([
  n4({ type: Boolean, reflect: true })
], K.prototype, "indeterminate", 2);
Ae([
  n4({ type: Boolean, reflect: true })
], K.prototype, "disabled", 2);
Ae([
  n4({ type: Boolean, reflect: true })
], K.prototype, "required", 2);
Ae([
  n4({ type: Boolean, reflect: true })
], K.prototype, "invalid", 2);
Ae([
  n4({ type: String, reflect: true })
], K.prototype, "name", 2);
Ae([
  n4({ type: String })
], K.prototype, "value", 2);
Ae([
  e5(".host-button")
], K.prototype, "_btn", 2);
K = Ae([
  t3("ae-checkbox")
], K);
var Vr = Object.defineProperty;
var Hr = Object.getOwnPropertyDescriptor;
var Ye = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Hr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Vr(t5, a4, i7), i7;
};
var Q = /* @__PURE__ */ new Map();
function ja(e8) {
  if (!e8.name) return;
  let t5 = Q.get(e8.name);
  t5 || (t5 = /* @__PURE__ */ new Set(), Q.set(e8.name, t5)), t5.add(e8);
}
function Ur(e8) {
  if (!e8.name) return;
  const t5 = Q.get(e8.name);
  t5 && (t5.delete(e8), t5.size === 0 && Q.delete(e8.name));
}
function Kr(e8) {
  const t5 = Q.get(e8.name);
  return t5 ? [...t5].filter((a4) => a4 !== e8 && a4.isConnected) : [];
}
var ee = class extends i4 {
  constructor() {
    super(), this.checked = false, this.disabled = false, this.required = false, this.invalid = false, this.name = "", this.value = "on", this._previousName = "", this._ariaForward = new Ce(this, () => this._btn), this._onClick = () => {
      this.disabled || this.checked || (this.checked = true, this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      ));
    }, this._onKeyDown = (e8) => {
      if (!this.disabled) {
        if (e8.key === " " || e8.code === "Space") {
          e8.preventDefault(), this._onClick();
          return;
        }
        (e8.key === "ArrowRight" || e8.key === "ArrowDown" || e8.key === "ArrowLeft" || e8.key === "ArrowUp") && (e8.preventDefault(), this._moveFocus(e8.key === "ArrowRight" || e8.key === "ArrowDown" ? 1 : -1));
      }
    }, this._internals = typeof this.attachInternals == "function" ? this.attachInternals() : null;
  }
  connectedCallback() {
    super.connectedCallback(), ja(this), this._previousName = this.name;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Ur(this);
  }
  render() {
    return b2`
      <button
        class="host-button"
        type="button"
        role="radio"
        aria-checked=${this.checked ? "true" : "false"}
        aria-disabled=${this.disabled ? "true" : A}
        aria-required=${this.required ? "true" : A}
        aria-invalid=${this.invalid ? "true" : A}
        ?disabled=${this.disabled}
        tabindex=${this._tabindexValue()}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
      >
        <span part="control" class="control"><span class="dot"></span></span>
        <span part="label" class="label"><slot></slot></span>
      </button>
    `;
  }
  updated(e8) {
    if (e8.has("name")) {
      const t5 = this._previousName;
      if (t5) {
        const a4 = Q.get(t5);
        a4 && (a4.delete(this), a4.size === 0 && Q.delete(t5));
      }
      ja(this), this._previousName = this.name;
    }
    if (e8.has("checked") && (this._syncFormState(), this.checked))
      for (const t5 of Kr(this))
        t5.checked && (t5.checked = false);
    e8.has("required") && this._syncFormState();
  }
  _tabindexValue() {
    if (this.disabled) return "-1";
    const e8 = Q.get(this.name);
    return !e8 || e8.size === 0 ? "0" : [...e8].some((r6) => r6.checked) ? this.checked ? "0" : "-1" : [...e8].find((r6) => r6.isConnected) === this ? "0" : "-1";
  }
  _syncFormState() {
    var a4;
    if (typeof ((a4 = this._internals) == null ? void 0 : a4.setFormValue) != "function") return;
    this.checked ? this._internals.setFormValue(this.value) : this._internals.setFormValue(null);
    const e8 = [...Q.get(this.name) ?? []].some((r6) => r6.required), t5 = [...Q.get(this.name) ?? []].some((r6) => r6.checked);
    e8 && !t5 ? this._internals.setValidity({ valueMissing: true }, "Please select one of these options.", this._btn) : this._internals.setValidity({});
  }
  _moveFocus(e8) {
    const t5 = Q.get(this.name);
    if (!t5) return;
    const a4 = [...t5].filter((s4) => !s4.disabled && s4.isConnected);
    if (a4.length === 0) return;
    const r6 = a4.indexOf(this);
    if (r6 === -1) return;
    const i7 = a4[(r6 + e8 + a4.length) % a4.length];
    i7.checked = true, i7.focus(), i7.dispatchEvent(
      new CustomEvent("ae-change", {
        bubbles: true,
        composed: true,
        detail: { value: i7.value }
      })
    );
  }
  focus(e8) {
    var t5;
    (t5 = this._btn) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._btn) == null || e8.blur();
  }
  formResetCallback() {
    this.checked = this.hasAttribute("checked");
  }
};
ee.formAssociated = true;
ee.styles = i`
    /*
     * Theme-overridable tokens (--ae-radio-bg, -bg-checked, -border,
     * -border-checked) are NOT declared at :host — :host declarations
     * would shadow inherited root-level theme overrides. Locked down by
     * src/theme-integration.test.ts.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    .host-button {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-2);
      cursor: pointer;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg);
      line-height: var(--ae-line-height-snug);
    }

    .host-button:focus-visible .control {
      ${y3}
      outline-offset: 3px;
    }

    .control {
      box-sizing: border-box;
      width: 1.125rem;
      height: 1.125rem;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--ae-radio-bg, var(--ae-color-bg));
      border: var(--ae-border-width-1) solid
        var(--ae-radio-border, var(--ae-color-border-strong));
      border-radius: 50%;
      transition:
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    :host([checked]) .control {
      border-color: var(--ae-radio-border-checked, var(--ae-color-accent));
      /* Bioluminescent accent — see ae-checkbox.ts. Default none. */
      box-shadow: var(--ae-radio-glow, none);
    }

    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--ae-radio-bg-checked, var(--ae-color-accent));
      transform: scale(0);
      transition: transform var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    :host([checked]) .dot {
      transform: scale(1);
    }

    :host([disabled]) .host-button {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }

    /* Invalid: recolor the ring border to danger. Placed AFTER the checked
     * rule so the danger border wins in every state, matching ae-input. */
    :host([invalid]) .control {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .host-button:focus-visible .control {
      ${ie}
    }
  `;
Ye([
  n4({ type: Boolean, reflect: true })
], ee.prototype, "checked", 2);
Ye([
  n4({ type: Boolean, reflect: true })
], ee.prototype, "disabled", 2);
Ye([
  n4({ type: Boolean, reflect: true })
], ee.prototype, "required", 2);
Ye([
  n4({ type: Boolean, reflect: true })
], ee.prototype, "invalid", 2);
Ye([
  n4({ type: String, reflect: true })
], ee.prototype, "name", 2);
Ye([
  n4({ type: String })
], ee.prototype, "value", 2);
Ye([
  e5(".host-button")
], ee.prototype, "_btn", 2);
ee = Ye([
  t3("ae-radio")
], ee);
var Yr = Object.defineProperty;
var Wr = Object.getOwnPropertyDescriptor;
var Ct = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Wr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Yr(t5, a4, i7), i7;
};
var oe = class extends i4 {
  constructor() {
    super(...arguments), this.label = "", this.hideLabel = false, this.name = "", this.required = false, this.orientation = "vertical", this._legendId = `ae-radio-group-legend-${++oe._idSeq}`, this._onSlotChange = () => {
      this._forwardName();
    };
  }
  updated(e8) {
    e8.has("name") && this._forwardName();
  }
  /** Forward the group `name` to child radios that don't declare their own. */
  _forwardName() {
    if (!this.name) return;
    const e8 = Array.from(
      this.querySelectorAll(":scope > ae-radio")
    );
    for (const t5 of e8)
      t5.getAttribute("name") || t5.setAttribute("name", this.name);
  }
  render() {
    const e8 = this.label || this._hasLabelSlot;
    return b2`
      ${e8 ? b2`<span
            part="legend"
            class="legend ${this.hideLabel ? "hidden" : ""}"
            id=${this._legendId}
          >
            ${this.label ? b2`${this.label}` : b2`<slot name="label"></slot>`}
            ${this.required ? b2`<span class="required-mark" aria-hidden="true">*</span>` : A}
          </span>` : A}
      <div
        part="group"
        class="group"
        role="radiogroup"
        aria-labelledby=${e8 ? this._legendId : A}
        aria-required=${this.required ? "true" : A}
      >
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }
  get _hasLabelSlot() {
    return this.querySelector(':scope > [slot="label"]') !== null;
  }
};
oe._idSeq = 0;
oe.styles = i`
    :host {
      display: inline-flex;
      flex-direction: column;
      gap: var(--ae-space-2);
      font-family: var(--ae-font-family-sans);
    }
    .legend {
      font-size: var(--ae-font-size-sm);
      font-weight: var(--ae-font-weight-medium);
      color: var(--ae-color-fg);
      line-height: var(--ae-line-height-snug);
    }
    .legend.hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .required-mark {
      /* Danger glyph on the page bg — text-tuned -emphasis stop, matching
       * ae-form-field's required mark and the library-wide danger-text convention. */
      color: var(--ae-color-danger-emphasis);
      margin-left: 2px;
    }
    .group {
      display: flex;
      flex-direction: column;
      gap: var(--ae-space-2);
    }
    :host([orientation='horizontal']) .group {
      flex-direction: row;
      gap: var(--ae-space-4);
    }
  `;
Ct([
  n4({ type: String, reflect: true })
], oe.prototype, "label", 2);
Ct([
  n4({ type: Boolean, reflect: true, attribute: "hide-label" })
], oe.prototype, "hideLabel", 2);
Ct([
  n4({ type: String, reflect: true })
], oe.prototype, "name", 2);
Ct([
  n4({ type: Boolean, reflect: true })
], oe.prototype, "required", 2);
Ct([
  n4({ type: String, reflect: true })
], oe.prototype, "orientation", 2);
oe = Ct([
  t3("ae-radio-group")
], oe);
var Gr = Object.defineProperty;
var Xr = Object.getOwnPropertyDescriptor;
var ge = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Xr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Gr(t5, a4, i7), i7;
};
var R2 = class extends i4 {
  constructor() {
    super(), this.checked = false, this.disabled = false, this.required = false, this.invalid = false, this.name = "", this.value = "on", this.label = "", this.size = "md", this._ariaForward = new Ce(this, () => this._btn), this._onToggle = () => {
      this.disabled || (this.checked = !this.checked, this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { checked: this.checked }
        })
      ));
    }, this._onKeyDown = (e8) => {
      (e8.key === " " || e8.code === "Space") && (e8.preventDefault(), this._onToggle());
    }, this._internals = typeof this.attachInternals == "function" ? this.attachInternals() : null;
  }
  render() {
    return b2`
      <button
        class="host-button"
        type="button"
        role="switch"
        aria-checked=${this.checked ? "true" : "false"}
        aria-disabled=${this.disabled ? "true" : A}
        aria-required=${this.required ? "true" : A}
        aria-invalid=${this.invalid ? "true" : A}
        aria-label=${this.label || A}
        ?disabled=${this.disabled}
        @click=${this._onToggle}
        @keydown=${this._onKeyDown}
      >
        <span part="track" class="track">
          <span part="thumb" class="thumb"></span>
        </span>
        <span part="label" class="label"><slot></slot></span>
      </button>
    `;
  }
  updated(e8) {
    (e8.has("checked") || e8.has("required")) && this._syncFormState();
  }
  _syncFormState() {
    var e8;
    typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function" && (this._internals.setFormValue(this.checked ? this.value : null), this.required && !this.checked ? this._internals.setValidity({ valueMissing: true }, "Please toggle this switch.", this._btn) : this._internals.setValidity({}));
  }
  focus(e8) {
    var t5;
    (t5 = this._btn) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._btn) == null || e8.blur();
  }
  formResetCallback() {
    this.checked = this.hasAttribute("checked");
  }
};
R2.formAssociated = true;
R2.styles = i`
    /*
     * Theme-overridable tokens (--ae-switch-bg, -bg-checked, -thumb,
     * -thumb-checked, -radius, -thumb-radius, -border-shadow) are NOT
     * declared at :host — :host declarations would shadow inherited
     * root-level theme overrides. Resolved at consumption point via
     * var(--token, default). Locked down by
     * src/theme-integration.test.ts.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    .host-button {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-2);
      cursor: pointer;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg);
      line-height: var(--ae-line-height-snug);
    }

    .host-button:focus-visible .track {
      ${y3}
    }

    /* The md track size, thumb inset, and thumb shadow are tokenized so a
     * brand can resize the toggle (the Spectrum collection runs v1's larger
     * 40x22 track on a 3px inset). The thumb size and travel are DERIVED from
     * the track + inset so they stay self-consistent at any size:
     *   thumb  = track-height - 2*inset
     *   travel = track-width  - track-height
     * Both default calcs reduce to the prior literals, so default rendering is
     * byte-identical. */
    .track {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      width: var(--ae-switch-track-width, 2.25rem);
      height: var(--ae-switch-track-height, 1.25rem);
      background: var(--ae-switch-bg, var(--ae-color-border-strong));
      border-radius: var(--ae-switch-radius, var(--ae-radius-full));
      box-shadow: var(--ae-switch-border-shadow, none);
      transition: background-color var(--ae-duration-fast) var(--ae-easing-ease-out);
      flex: 0 0 auto;
    }

    .thumb {
      position: absolute;
      top: var(--ae-switch-thumb-inset, 2px);
      left: var(--ae-switch-thumb-inset, 2px);
      width: calc(var(--ae-switch-track-height, 1.25rem) - 2 * var(--ae-switch-thumb-inset, 2px));
      height: calc(var(--ae-switch-track-height, 1.25rem) - 2 * var(--ae-switch-thumb-inset, 2px));
      background: var(--ae-switch-thumb, var(--ae-color-bg));
      border-radius: var(--ae-switch-thumb-radius, 50%);
      box-shadow: var(--ae-switch-thumb-shadow, var(--ae-shadow-xs));
      transition:
        transform var(--ae-duration-fast) var(--ae-easing-ease-out),
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    :host([checked]) .track {
      background: var(--ae-switch-bg-checked, var(--ae-color-accent));
      /* Bioluminescent accent: a molten glow on the "on" track. Falls back to
       * the resting border-shadow so non-glow themes are unchanged. */
      box-shadow: var(--ae-switch-glow, var(--ae-switch-border-shadow, none));
    }

    :host([checked]) .thumb {
      transform: translateX(calc(var(--ae-switch-track-width, 2.25rem) - var(--ae-switch-track-height, 1.25rem)));
      background: var(--ae-switch-thumb-checked,
        var(--ae-switch-thumb, var(--ae-color-bg)));
    }

    /* Sizes (v2-only — v1 ships a single toggle size). Thumb sizes derive from
     * the shared inset token so they stay centered under any brand's inset. */
    :host([size='sm']) .track { width: 1.75rem; height: 1rem; }
    :host([size='sm']) .thumb {
      width: calc(1rem - 2 * var(--ae-switch-thumb-inset, 2px));
      height: calc(1rem - 2 * var(--ae-switch-thumb-inset, 2px));
    }
    :host([size='sm'][checked]) .thumb { transform: translateX(calc(1.75rem - 1rem)); }

    :host([size='lg']) .track { width: 2.75rem; height: 1.5rem; }
    :host([size='lg']) .thumb {
      width: calc(1.5rem - 2 * var(--ae-switch-thumb-inset, 2px));
      height: calc(1.5rem - 2 * var(--ae-switch-thumb-inset, 2px));
    }
    :host([size='lg'][checked]) .thumb { transform: translateX(calc(2.75rem - 1.5rem)); }

    :host([disabled]) .host-button {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }

    /* Invalid: the track is a filled pill with no border, so signal the
     * error with a danger outline ring around it. When focused, the focus
     * ring takes over the outline and invalidRing recolors it to danger so
     * the two states stay visually consistent. */
    :host([invalid]) .track {
      outline: var(--ae-focus-ring-width) solid var(--ae-color-danger);
      outline-offset: 2px;
    }
    :host([invalid]) .host-button:focus-visible .track {
      ${ie}
    }
  `;
ge([
  n4({ type: Boolean, reflect: true })
], R2.prototype, "checked", 2);
ge([
  n4({ type: Boolean, reflect: true })
], R2.prototype, "disabled", 2);
ge([
  n4({ type: Boolean, reflect: true })
], R2.prototype, "required", 2);
ge([
  n4({ type: Boolean, reflect: true })
], R2.prototype, "invalid", 2);
ge([
  n4({ type: String, reflect: true })
], R2.prototype, "name", 2);
ge([
  n4({ type: String })
], R2.prototype, "value", 2);
ge([
  n4({ type: String })
], R2.prototype, "label", 2);
ge([
  n4({ type: String, reflect: true })
], R2.prototype, "size", 2);
ge([
  e5(".host-button")
], R2.prototype, "_btn", 2);
R2 = ge([
  t3("ae-switch")
], R2);
var Zr = Object.defineProperty;
var Jr = Object.getOwnPropertyDescriptor;
var At = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Jr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Zr(t5, a4, i7), i7;
};
var ne = class extends i4 {
  constructor() {
    super(...arguments), this.label = "", this.helper = "", this.error = "", this.required = false, this.disabled = false, this._controlId = `ae-form-field-${++ne._idSeq}`, this._labelTargetId = this._controlId, this._hasSingleControl = true, this._hasSlotMap = /* @__PURE__ */ new Map(), this._onSlotChange = (e8) => {
      var r6, i7;
      const t5 = e8.target, a4 = t5.assignedNodes({ flatten: true }).filter(
        (s4) => s4.nodeType === Node.ELEMENT_NODE
      );
      if (t5.name) {
        this._hasSlotMap.set(t5.name, a4.length > 0);
        const s4 = (i7 = (r6 = this.shadowRoot) == null ? void 0 : r6.querySelector("slot:not([name])")) == null ? void 0 : i7.assignedElements({ flatten: true })[0];
        s4 && this._applyStateToControl(s4);
      } else {
        this._hasSingleControl = a4.length === 1;
        const s4 = a4[0];
        s4 && (s4.id || (s4.id = this._controlId), this._labelTargetId = s4.id, this._applyStateToControl(s4));
      }
      this.requestUpdate();
    };
  }
  render() {
    const e8 = this.error !== "", t5 = `${this._controlId}-label`, a4 = `${this._controlId}-helper`, r6 = `${this._controlId}-error`;
    return b2`
      ${this.label || this._hasSlot("label") ? b2`<label
            part="label"
            class="label"
            id=${t5}
            for=${this._labelTargetId}
          >
            ${this.label ? b2`${this.label}` : b2`<slot name="label"></slot>`}
            ${this.required ? b2`<span class="required-mark" aria-hidden="true">*</span>` : A}
          </label>` : A}

      <div
        class="control-wrap"
        role=${this._hasSingleControl ? A : "group"}
        aria-labelledby=${this._hasSingleControl ? A : this.label || this._hasSlot("label") ? t5 : A}
      >
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>

      ${e8 ? b2`<div part="error" class="error" id=${r6} role="alert">
            ${this.error || b2`<slot name="error"></slot>`}
          </div>` : this.helper || this._hasSlot("helper") ? b2`<div part="helper" class="helper" id=${a4}>
              ${this.helper || b2`<slot name="helper"></slot>`}
            </div>` : A}
    `;
  }
  _hasSlot(e8) {
    return this._hasSlotMap.get(e8) === true;
  }
  updated(e8) {
    var t5;
    if (e8.has("error") || e8.has("required") || e8.has("disabled") || e8.has("label")) {
      const a4 = (t5 = this.shadowRoot) == null ? void 0 : t5.querySelector("slot:not([name])"), r6 = a4 == null ? void 0 : a4.assignedElements({ flatten: true })[0];
      r6 && this._applyStateToControl(r6);
    }
  }
  _applyStateToControl(e8) {
    this.error ? (e8.setAttribute("invalid", ""), e8.setAttribute("aria-invalid", "true")) : (e8.removeAttribute("invalid"), e8.removeAttribute("aria-invalid")), this.required && e8.setAttribute("required", ""), this.disabled && e8.setAttribute("disabled", ""), e8.id || (e8.id = this._controlId), e8.removeAttribute("aria-describedby");
    const t5 = this._labelText;
    t5 ? (e8.hasAttribute("data-ae-field-label") || !e8.hasAttribute("aria-label")) && (e8.setAttribute("aria-label", t5), e8.setAttribute("data-ae-field-label", "")) : e8.hasAttribute("data-ae-field-label") && (e8.removeAttribute("aria-label"), e8.removeAttribute("data-ae-field-label"));
    const a4 = this._descriptionText;
    a4 ? (e8.setAttribute("aria-description", a4), e8.setAttribute("data-ae-field-desc", "")) : e8.hasAttribute("data-ae-field-desc") && (e8.removeAttribute("aria-description"), e8.removeAttribute("data-ae-field-desc"));
  }
  /** Visible label text, from the `label` attribute or the label slot. */
  get _labelText() {
    return (this.label || this._slotText("label")).trim();
  }
  /** The active description text: error takes precedence over helper. */
  get _descriptionText() {
    return this.error || this._hasSlot("error") ? (this.error || this._slotText("error")).trim() : this.helper || this._hasSlot("helper") ? (this.helper || this._slotText("helper")).trim() : "";
  }
  _slotText(e8) {
    var a4;
    const t5 = (a4 = this.shadowRoot) == null ? void 0 : a4.querySelector(
      `slot[name="${e8}"]`
    );
    return t5 ? t5.assignedNodes({ flatten: true }).map((r6) => r6.textContent ?? "").join(" ").trim() : "";
  }
};
ne._idSeq = 0;
ne.styles = i`
    :host {
      --ae-form-field-gap: var(--ae-space-1);
      --ae-form-field-label-fg: var(--ae-color-fg);
      --ae-form-field-helper-fg: var(--ae-color-fg-muted);
      /* Error text sits ON the page bg, so it uses the text-tuned -emphasis
       * danger stop — the same token alert / toast / tag / link use for danger
       * text. (Plain --ae-color-danger is the FILL stop, darkened on some dark
       * themes so white text crosses AA on a danger button; as text-on-bg it can
       * fall under 4.5:1 — e.g. editorial, where it measured 2.75:1.) */
      --ae-form-field-error-fg: var(--ae-color-danger-emphasis);

      display: flex;
      flex-direction: column;
      gap: var(--ae-form-field-gap);
      font-family: var(--ae-font-family-sans);
    }

    .label {
      font-size: var(--ae-font-size-sm);
      font-weight: var(--ae-font-weight-medium);
      color: var(--ae-form-field-label-fg);
      line-height: var(--ae-line-height-snug);
    }
    .required-mark {
      /* Danger glyph on the page bg — text-tuned -emphasis stop (see error-fg). */
      color: var(--ae-color-danger-emphasis);
      margin-left: 2px;
    }

    .helper {
      font-size: var(--ae-font-size-xs);
      color: var(--ae-form-field-helper-fg);
      line-height: var(--ae-line-height-snug);
    }

    .error {
      font-size: var(--ae-font-size-xs);
      color: var(--ae-form-field-error-fg);
      line-height: var(--ae-line-height-snug);
    }

    ::slotted(*) {
      margin-top: var(--ae-space-1);
    }
  `;
At([
  n4({ type: String, reflect: true })
], ne.prototype, "label", 2);
At([
  n4({ type: String, reflect: true })
], ne.prototype, "helper", 2);
At([
  n4({ type: String, reflect: true })
], ne.prototype, "error", 2);
At([
  n4({ type: Boolean, reflect: true })
], ne.prototype, "required", 2);
At([
  n4({ type: Boolean, reflect: true })
], ne.prototype, "disabled", 2);
ne = At([
  t3("ae-form-field")
], ne);
var Qr = Object.getOwnPropertyDescriptor;
var ei = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Qr(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = o9(i7) || i7);
  return i7;
};
var $a = class extends i4 {
  render() {
    return b2`<slot></slot>`;
  }
};
$a.styles = i`
    :host {
      display: block;
      /* Resting: null the slotted control's chrome color so it looks like
         static text. The border BOX is preserved by the control itself, so the
         reveal below is zero-layout-shift. */
      --ae-input-bg: transparent;
      --ae-input-border: transparent;
      --ae-textarea-bg: transparent;
      --ae-textarea-border: transparent;
      --ae-select-bg: transparent;
      --ae-select-border: transparent;
    }

    /* Reveal on hover or while editing: inherit hands each token back to the
       control, which then falls through to its own var(--tok, fallback)
       default (theme-aware) — including its native :hover / :focus chrome. */
    :host(:hover),
    :host(:focus-within) {
      --ae-input-bg: inherit;
      --ae-input-border: inherit;
      --ae-textarea-bg: inherit;
      --ae-textarea-border: inherit;
      --ae-select-bg: inherit;
      --ae-select-border: inherit;
    }

    ::slotted(*) {
      width: 100%;
    }
  `;
$a = ei([
  t3("ae-ghost-field")
], $a);
function ar(e8) {
  return typeof Element < "u" && e8 in Element.prototype;
}
function rr(e8, t5, a4) {
  e8[t5] = a4;
}
function ti(e8, t5, a4, r6) {
  ar(t5) ? (rr(e8, t5, r6), e8.removeAttribute(a4)) : r6 && r6.id ? e8.setAttribute(a4, r6.id) : e8.removeAttribute(a4);
}
function ir(e8, t5, a4, r6) {
  const i7 = r6.filter((s4) => !!s4);
  if (ar(t5))
    rr(e8, t5, i7.length ? i7 : null), e8.removeAttribute(a4);
  else {
    const s4 = i7.map((o9) => o9.id).filter(Boolean);
    s4.length ? e8.setAttribute(a4, s4.join(" ")) : e8.removeAttribute(a4);
  }
}
function kt(e8, t5) {
  ti(e8, "ariaActiveDescendantElement", "aria-activedescendant", t5);
}
function Ie(e8, t5) {
  ir(e8, "ariaControlsElements", "aria-controls", t5);
}
function ai(e8, t5) {
  ir(e8, "ariaLabelledByElements", "aria-labelledby", t5);
}
var ri = Object.defineProperty;
var ii = Object.getOwnPropertyDescriptor;
var dt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? ii(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ri(t5, a4, i7), i7;
};
var _e = class extends i4 {
  constructor() {
    super(...arguments), this.value = "", this.label = null, this.disabled = false, this.active = false, this.selected = false, this.filterHidden = false;
  }
  /** Resolves the display label: explicit attribute, else slotted text. */
  get textLabel() {
    return this.label !== null && this.label !== "" ? this.label : (this.textContent ?? "").trim();
  }
  render() {
    return b2`
      <span part="option" class="row" role="presentation">
        <svg
          class="check"
          viewBox="0 0 16 16"
          aria-hidden="true"
          width="12"
          height="12"
        >
          <path
            d="M3 8 L7 12 L13 4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <slot></slot>
      </span>
    `;
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "option");
  }
  /**
   * Mirror the parent-driven selection and disabled state onto the ARIA
   * attributes a `role="option"` requires. The `selected` / `disabled`
   * boolean attributes are styling hooks the parent toggles; on their own
   * they carry no semantics, so assistive technology never hears which
   * option is chosen or which are unavailable. `aria-selected` is emitted
   * unconditionally as `true`/`false` (the listbox option contract), while
   * `aria-disabled` is present only when the option is disabled.
   */
  updated() {
    this.setAttribute("aria-selected", this.selected ? "true" : "false"), this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled");
  }
};
_e.styles = i`
    :host {
      --ae-option-bg-active: var(--ae-color-bg-muted);
      --ae-option-fg-active: var(--ae-color-fg);
      --ae-option-bg-selected: var(--ae-color-accent-subtle);
      --ae-option-padding-y: var(--ae-space-2);
      --ae-option-padding-x: var(--ae-space-3);

      display: block;
      cursor: pointer;
      user-select: none;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg);
      border-radius: var(--ae-radius-sm);
      line-height: var(--ae-line-height-snug);
    }

    :host([disabled]) {
      color: var(--ae-color-fg-disabled);
      cursor: not-allowed;
    }

    :host([active]:not([disabled])) {
      background: var(--ae-option-bg-active);
      color: var(--ae-option-fg-active);
    }

    :host([selected]) {
      background: var(--ae-option-bg-selected);
      color: var(--ae-color-accent-emphasis);
      font-weight: var(--ae-font-weight-medium);
    }

    :host([filter-hidden]) {
      display: none;
    }

    /*
     * Padding lives on the row, NOT on :host. A consumer's global reset such
     * as \`* { padding: 0 }\` is a document-tree declaration, and in the cascade
     * a normal document declaration overrides a normal \`:host\` declaration —
     * so host padding silently collapses to 0 under such a reset (a very
     * common one). A document-scope \`*\` selector cannot reach an element
     * inside this shadow tree, so the row's padding is immune. The
     * \`--ae-option-padding-*\` custom props (defined on :host) still drive it,
     * so per-instance overrides keep working.
     */
    .row {
      display: flex;
      align-items: center;
      gap: var(--ae-space-2);
      padding: var(--ae-option-padding-y) var(--ae-option-padding-x);
    }

    .check {
      width: 1em;
      height: 1em;
      flex: none;
      opacity: 0;
    }
    :host([selected]) .check {
      opacity: 1;
    }
  `;
dt([
  n4({ type: String, reflect: true })
], _e.prototype, "value", 2);
dt([
  n4({ type: String, reflect: true })
], _e.prototype, "label", 2);
dt([
  n4({ type: Boolean, reflect: true })
], _e.prototype, "disabled", 2);
dt([
  n4({ type: Boolean, reflect: true })
], _e.prototype, "active", 2);
dt([
  n4({ type: Boolean, reflect: true })
], _e.prototype, "selected", 2);
dt([
  n4({ type: Boolean, reflect: true, attribute: "filter-hidden" })
], _e.prototype, "filterHidden", 2);
_e = dt([
  t3("ae-option")
], _e);
var si = Object.defineProperty;
var oi = Object.getOwnPropertyDescriptor;
var Y = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? oi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && si(t5, a4, i7), i7;
};
var O = class extends i4 {
  constructor() {
    super(), this.value = "", this.placeholder = "Select\u2026", this.disabled = false, this.required = false, this.invalid = false, this.multiple = false, this.name = "", this.size = "md", this._open = false, this._activeId = "", this._ariaForward = new Ce(this, () => this._trigger), this._typeBuffer = "", this._typeTimer = 0, this._listboxId = `ae-select-listbox-${Math.random().toString(36).slice(2, 9)}`, this._docListenersBound = false, this._listboxEl = null, this._onScrollOrResize = () => {
      this._positionListbox();
    }, this._onDocPointerDown = (e8) => {
      const t5 = e8.target;
      t5 && (this.contains(t5) || this._listboxEl && this._listboxEl.contains(t5) || (this._open = false));
    }, this._onSlotChange = () => {
      this._syncSelectionFlags();
    }, this._onTriggerClick = (e8) => {
      this.disabled || (e8.preventDefault(), this._open = !this._open);
    }, this._onTriggerBlur = (e8) => {
      const t5 = e8.relatedTarget;
      t5 && this._listboxEl && this._listboxEl.contains(t5) || queueMicrotask(() => {
        const a4 = document.activeElement;
        a4 && this._listboxEl && this._listboxEl.contains(a4) || a4 !== this._trigger && (this._open = false);
      });
    }, this._onTriggerKeyDown = (e8) => {
      var a4;
      if (this.disabled) return;
      const t5 = e8.key;
      if (!this._open) {
        if (t5 === "ArrowDown" || t5 === "ArrowUp" || t5 === "Enter" || t5 === " ") {
          e8.preventDefault(), this._open = true;
          return;
        }
        if (t5.length === 1 && /\S/.test(t5)) {
          this._open = true, this._typeahead(t5);
          return;
        }
        return;
      }
      switch (t5) {
        case "Escape":
          e8.preventDefault(), this._open = false, (a4 = this._trigger) == null || a4.focus();
          return;
        case "ArrowDown":
          e8.preventDefault(), this._moveActive(1);
          return;
        case "ArrowUp":
          e8.preventDefault(), this._moveActive(-1);
          return;
        case "Home":
          e8.preventDefault(), this._moveToEdge("start");
          return;
        case "End":
          e8.preventDefault(), this._moveToEdge("end");
          return;
        case "Enter":
        case " ": {
          e8.preventDefault();
          const r6 = this.options.find((i7) => i7.id === this._activeId);
          r6 && this._commitSelection(r6);
          return;
        }
        case "Tab":
          this._open = false;
          return;
        default:
          t5.length === 1 && /\S/.test(t5) && this._typeahead(t5);
      }
    }, this._onListboxMouseDown = (e8) => {
      const t5 = e8.target;
      t5 && t5.closest("ae-option") && e8.preventDefault();
    }, this._onListboxClick = (e8) => {
      const t5 = e8.target;
      if (!t5) return;
      const a4 = t5.closest("ae-option");
      a4 && (e8.preventDefault(), this._commitSelection(a4));
    }, this._onListboxHover = (e8) => {
      const t5 = e8.target;
      if (!t5) return;
      const a4 = t5.closest("ae-option");
      !a4 || a4.disabled || a4.id && a4.id !== this._activeId && this._setActive(a4.id);
    }, this._internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncFormValue();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._removeDocListeners(), this._open && this._closeAndRestore();
  }
  willUpdate(e8) {
    e8.has("value") && typeof this.value != "string" && (this.value = this.value == null ? "" : String(this.value));
  }
  updated(e8) {
    if (e8.has("value") && (this._syncSelectionFlags(), this._syncFormValue()), e8.has("_open")) {
      const t5 = e8.get("_open") !== void 0;
      this._open ? (this.setAttribute("data-open", ""), this._mountListbox(), this._addDocListeners(), this._positionListbox(), this._ensureActive(), t5 && this.dispatchEvent(
        new CustomEvent("ae-open", { bubbles: true, composed: true })
      )) : (this.removeAttribute("data-open"), this._closeAndRestore(), this._removeDocListeners(), t5 && this.dispatchEvent(
        new CustomEvent("ae-close", { bubbles: true, composed: true })
      ));
    }
    (e8.has("_open") || e8.has("_activeId")) && this._syncAriaRefs();
  }
  /**
   * Associate the shadow-DOM trigger with the light-DOM portaled listbox
   * (`aria-controls`) and the active option (`aria-activedescendant`).
   * These IDREFs cross a shadow boundary, so they are expressed through
   * AOM element references rather than the string-id attributes the
   * template can emit. See {@link setControls}/{@link setActiveDescendant}.
   */
  _syncAriaRefs() {
    const e8 = this._trigger;
    if (e8)
      if (this._open && this._listboxEl) {
        Ie(e8, [this._listboxEl]);
        const t5 = this._activeId ? this.options.find((a4) => a4.id === this._activeId) ?? null : null;
        kt(e8, t5);
      } else
        Ie(e8, []), kt(e8, null);
  }
  /** Returns all `<ae-option>` children regardless of current parent. */
  get options() {
    return this._listboxEl ? Array.from(this._listboxEl.querySelectorAll(":scope > ae-option")) : Array.from(this.querySelectorAll(":scope > ae-option"));
  }
  _optionByValue(e8) {
    return this.options.find((t5) => t5.value === e8);
  }
  get _selectedValues() {
    return this.value ? this.multiple ? this.value.split(",").map((e8) => e8.trim()).filter(Boolean) : [this.value] : [];
  }
  get _displayLabel() {
    const e8 = this._selectedValues;
    return e8.length === 0 ? "" : e8.map((a4) => {
      var r6;
      return ((r6 = this._optionByValue(a4)) == null ? void 0 : r6.textLabel) ?? "";
    }).filter(Boolean).join(", ");
  }
  render() {
    const e8 = this._displayLabel;
    return b2`
      <button
        part="trigger"
        class="trigger"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded=${this._open ? "true" : "false"}
        aria-required=${this.required ? "true" : A}
        aria-invalid=${this.invalid ? "true" : A}
        aria-disabled=${this.disabled ? "true" : A}
        ?disabled=${this.disabled}
        @click=${this._onTriggerClick}
        @keydown=${this._onTriggerKeyDown}
        @blur=${this._onTriggerBlur}
      >
        <span class="value">
          ${e8 ? b2`<span>${e8}</span>` : b2`<span class="placeholder">${this.placeholder}</span>`}
        </span>
        <svg
          class="caret"
          viewBox="0 0 12 12"
          aria-hidden="true"
          width="10"
          height="10"
        >
          <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <span class="options-host" hidden>
        <slot @slotchange=${this._onSlotChange}></slot>
      </span>
    `;
  }
  // -- Listbox portal --------------------------------------------------
  _mountListbox() {
    if (this._listboxEl) return;
    const e8 = document.createElement("div");
    e8.id = this._listboxId, e8.setAttribute("role", "listbox"), e8.setAttribute("part", "listbox"), e8.setAttribute("aria-multiselectable", this.multiple ? "true" : "false"), e8.dataset.aeSelectListbox = "", Object.assign(e8.style, {
      position: "absolute",
      zIndex: "var(--ae-z-popover, 1400)",
      background: "var(--ae-select-listbox-bg, var(--ae-color-bg-elevated))",
      color: "var(--ae-color-fg)",
      border: "1px solid var(--ae-color-border)",
      borderRadius: "var(--ae-select-listbox-radius, var(--ae-radius-md))",
      boxShadow: "var(--ae-select-listbox-shadow, var(--ae-shadow-lg))",
      backdropFilter: "var(--ae-select-listbox-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      WebkitBackdropFilter: "var(--ae-select-listbox-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      padding: "var(--ae-space-1)",
      minWidth: "12rem",
      maxHeight: "16rem",
      overflowY: "auto",
      fontFamily: "var(--ae-font-family-sans)"
    });
    const t5 = Array.from(this.querySelectorAll(":scope > ae-option"));
    for (const a4 of t5)
      e8.appendChild(a4);
    e8.addEventListener("mousedown", this._onListboxMouseDown), e8.addEventListener("click", this._onListboxClick), e8.addEventListener("mousemove", this._onListboxHover), document.body.appendChild(e8), this._listboxEl = e8;
  }
  _closeAndRestore() {
    if (!this._listboxEl) return;
    const e8 = Array.from(this._listboxEl.querySelectorAll(":scope > ae-option"));
    for (const t5 of e8)
      t5.active = false, this.appendChild(t5);
    this._listboxEl.removeEventListener("mousedown", this._onListboxMouseDown), this._listboxEl.removeEventListener("click", this._onListboxClick), this._listboxEl.removeEventListener("mousemove", this._onListboxHover), this._listboxEl.remove(), this._listboxEl = null;
  }
  _positionListbox() {
    if (!this._listboxEl) return;
    const e8 = this.getBoundingClientRect(), t5 = window.scrollY + e8.bottom + 4, a4 = window.scrollX + e8.left;
    this._listboxEl.style.top = `${t5}px`, this._listboxEl.style.left = `${a4}px`, this._listboxEl.style.minWidth = `${e8.width}px`;
  }
  _addDocListeners() {
    this._docListenersBound || (window.addEventListener("scroll", this._onScrollOrResize, true), window.addEventListener("resize", this._onScrollOrResize), document.addEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = true);
  }
  _removeDocListeners() {
    this._docListenersBound && (window.removeEventListener("scroll", this._onScrollOrResize, true), window.removeEventListener("resize", this._onScrollOrResize), document.removeEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = false);
  }
  // -- Selection model -------------------------------------------------
  _syncSelectionFlags() {
    const e8 = new Set(this._selectedValues);
    for (const t5 of this.options)
      t5.selected = e8.has(t5.value), t5.id || (t5.id = `ae-option-${Math.random().toString(36).slice(2, 9)}`);
  }
  _syncFormValue() {
    var e8;
    typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function" && (this._internals.setFormValue(this.value), this.required && !this.value ? this._internals.setValidity({ valueMissing: true }, "Please select an option.") : this._internals.setValidity({}));
  }
  _ensureActive() {
    const e8 = this.options.filter((r6) => !r6.disabled);
    if (e8.length === 0) {
      this._setActive("");
      return;
    }
    const t5 = this._optionByValue(this._selectedValues[0] ?? ""), a4 = t5 && !t5.disabled ? t5 : e8[0];
    a4 && this._setActive(a4.id);
  }
  _setActive(e8) {
    this._activeId = e8;
    for (const t5 of this.options)
      if (t5.active = t5.id === e8, t5.active && this._listboxEl) {
        const a4 = t5.getBoundingClientRect(), r6 = this._listboxEl.getBoundingClientRect();
        (a4.top < r6.top || a4.bottom > r6.bottom) && t5.scrollIntoView({ block: "nearest" });
      }
  }
  _commitSelection(e8) {
    var t5;
    if (!e8.disabled) {
      if (this.multiple) {
        const a4 = new Set(this._selectedValues);
        a4.has(e8.value) ? a4.delete(e8.value) : a4.add(e8.value), this.value = Array.from(a4).join(",");
      } else
        this.value = e8.value, this._open = false, (t5 = this._trigger) == null || t5.focus();
      this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      );
    }
  }
  _moveActive(e8) {
    const t5 = this.options.filter((s4) => !s4.disabled);
    if (t5.length === 0) return;
    const r6 = (t5.findIndex((s4) => s4.id === this._activeId) + e8 + t5.length) % t5.length, i7 = t5[r6 < 0 ? 0 : r6];
    i7 && this._setActive(i7.id);
  }
  _moveToEdge(e8) {
    const t5 = this.options.filter((r6) => !r6.disabled), a4 = e8 === "start" ? t5[0] : t5[t5.length - 1];
    a4 && this._setActive(a4.id);
  }
  _typeahead(e8) {
    this._typeTimer && window.clearTimeout(this._typeTimer), this._typeBuffer += e8.toLowerCase(), this._typeTimer = window.setTimeout(() => {
      this._typeBuffer = "";
    }, 500);
    const a4 = this.options.filter((r6) => !r6.disabled).find((r6) => r6.textLabel.toLowerCase().startsWith(this._typeBuffer));
    a4 && this._setActive(a4.id);
  }
  focus(e8) {
    var t5;
    (t5 = this._trigger) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._trigger) == null || e8.blur();
  }
  /** Programmatic open. Returns once the listbox is mounted in the DOM. */
  async open() {
    this.disabled || (this._open = true, await this.updateComplete);
  }
  /** Programmatic close. */
  async close() {
    this._open = false, await this.updateComplete;
  }
  /** Whether the listbox is currently open. */
  get isOpen() {
    return this._open;
  }
  /** Form-associated validity state, delegated to ElementInternals. */
  get validity() {
    return this._internals.validity;
  }
  /** Current validation message, delegated to ElementInternals. */
  get validationMessage() {
    return this._internals.validationMessage;
  }
  /** Trigger validation reporting, delegated to ElementInternals. */
  reportValidity() {
    return this._internals.reportValidity();
  }
  /** Check whether the control is currently valid. */
  checkValidity() {
    return this._internals.checkValidity();
  }
};
O.formAssociated = true;
O.styles = i`
    /*
     * Tier 3 select tokens are read via var(--token, fallback) inside
     * the consumption rules below so root-level theme overrides cascade
     * into the shadow DOM. See ae-input.ts for the cascade reasoning.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
      position: relative;
      min-width: 12rem;
    }

    button.trigger {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ae-space-2);
      width: 100%;
      cursor: pointer;
      font-family: var(--ae-font-family-ui);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-select-fg, var(--ae-color-fg));
      background: var(--ae-select-bg, var(--ae-color-bg));
      /* Frosted-glass hook — see ae-input.ts. */
      backdrop-filter: var(--ae-select-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-select-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-border-width-1) solid
        var(--ae-select-border, var(--ae-color-border-strong));
      border-radius: var(--ae-select-radius, var(--ae-radius-default));
      padding: var(--ae-select-padding, var(--ae-space-2) var(--ae-space-3));
      min-height: 2.25rem;
      transition:
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        box-shadow var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    :host([size='sm']) button.trigger {
      font-size: var(--ae-font-size-sm);
      padding: var(--ae-space-1) var(--ae-space-2);
      min-height: 1.75rem;
    }
    :host([size='lg']) button.trigger {
      font-size: var(--ae-font-size-md);
      padding: var(--ae-space-3) var(--ae-space-4);
      min-height: 2.75rem;
    }

    button.trigger:hover:not(:disabled) {
      background: var(--ae-select-bg-hover, var(--ae-select-bg, var(--ae-color-bg)));
      border-color: var(--ae-select-border-hover, var(--ae-color-accent));
    }
    button.trigger:focus-visible {
      ${y3}
      background: var(--ae-select-bg-focus, var(--ae-select-bg, var(--ae-color-bg)));
      border-color: var(--ae-select-border-focus, var(--ae-color-accent));
    }
    button.trigger:disabled {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }

    :host([invalid]) button.trigger,
    :host([invalid]) button.trigger:hover:not(:disabled),
    :host([invalid]) button.trigger:focus-visible {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) button.trigger:focus-visible {
      ${ie}
    }

    .value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1 1 auto;
      text-align: start;
    }
    .placeholder {
      color: var(--ae-select-placeholder, var(--ae-color-fg-subtle));
    }
    .caret {
      all: unset;
      box-sizing: border-box;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--ae-color-fg-muted);
      padding: 0 var(--ae-space-1);
      transition:
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        transform var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .caret:hover {
      color: var(--ae-color-fg);
    }
    :host([data-open]) .caret {
      transform: rotate(180deg);
    }

    .options-host {
      display: none;
    }
  `;
Y([
  n4({ type: String, reflect: true })
], O.prototype, "value", 2);
Y([
  n4({ type: String, reflect: true })
], O.prototype, "placeholder", 2);
Y([
  n4({ type: Boolean, reflect: true })
], O.prototype, "disabled", 2);
Y([
  n4({ type: Boolean, reflect: true })
], O.prototype, "required", 2);
Y([
  n4({ type: Boolean, reflect: true })
], O.prototype, "invalid", 2);
Y([
  n4({ type: Boolean, reflect: true })
], O.prototype, "multiple", 2);
Y([
  n4({ type: String, reflect: true })
], O.prototype, "name", 2);
Y([
  n4({ type: String, reflect: true })
], O.prototype, "size", 2);
Y([
  r5()
], O.prototype, "_open", 2);
Y([
  r5()
], O.prototype, "_activeId", 2);
Y([
  e5("button")
], O.prototype, "_trigger", 2);
O = Y([
  t3("ae-select")
], O);
var ni = Object.defineProperty;
var li = Object.getOwnPropertyDescriptor;
var W = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? li(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ni(t5, a4, i7), i7;
};
var T2 = class extends i4 {
  constructor() {
    super(), this.value = "", this.placeholder = "", this.disabled = false, this.required = false, this.invalid = false, this.freeform = false, this.filter = false, this.name = "", this._open = false, this._activeId = "", this._ariaForward = new Ce(this, () => this._input), this._listboxId = `ae-combobox-listbox-${Math.random().toString(36).slice(2, 9)}`, this._listboxEl = null, this._docListenersBound = false, this._onScrollOrResize = () => this._positionListbox(), this._onDocPointerDown = (e8) => {
      const t5 = e8.target;
      t5 && (this.contains(t5) || this._listboxEl && this._listboxEl.contains(t5) || (this._commitOnBlur(), this._open = false));
    }, this._onSlotChange = () => {
      this._syncSelectionFlags();
    }, this._onInput = (e8) => {
      const t5 = e8.target.value;
      this._open || (this._open = true), this.filter && this._applyFilter(), this._ensureActive(), this.dispatchEvent(
        new CustomEvent("ae-input", {
          bubbles: true,
          composed: true,
          detail: { value: t5 }
        })
      );
    }, this._suppressReopenOnFocus = false, this._onFocus = () => {
      this._suppressReopenOnFocus || this.options.length > 0 && (this._open = true);
    }, this._onBlur = (e8) => {
      const t5 = e8.relatedTarget;
      t5 && this._listboxEl && this._listboxEl.contains(t5) || queueMicrotask(() => {
        const a4 = document.activeElement;
        a4 && this._listboxEl && this._listboxEl.contains(a4) || a4 !== this._input && (this._commitOnBlur(), this._open = false);
      });
    }, this._onCaretClick = (e8) => {
      e8.preventDefault(), !this.disabled && (this._open = !this._open, this._open && this._input.focus());
    }, this._onKeyDown = (e8) => {
      if (this.disabled) return;
      const t5 = e8.key;
      if (!this._open && (t5 === "ArrowDown" || t5 === "ArrowUp")) {
        e8.preventDefault(), this._open = true;
        return;
      }
      switch (t5) {
        case "Escape":
          this._open && (e8.preventDefault(), this._open = false);
          return;
        case "ArrowDown":
          e8.preventDefault(), this._moveActive(1);
          return;
        case "ArrowUp":
          e8.preventDefault(), this._moveActive(-1);
          return;
        case "Home":
          this._open && (e8.preventDefault(), this._moveToEdge("start"));
          return;
        case "End":
          this._open && (e8.preventDefault(), this._moveToEdge("end"));
          return;
        case "Enter": {
          const a4 = this._input.value, r6 = this._matchByLabel(a4);
          if (this.freeform && a4 && !r6) {
            e8.preventDefault(), this._commitOnBlur(), this._open = false;
            return;
          }
          const i7 = this.options.find((s4) => s4.id === this._activeId);
          this._open && i7 ? (e8.preventDefault(), this._commitOption(i7)) : this.freeform && (e8.preventDefault(), this._commitOnBlur());
          return;
        }
        case "Tab":
          this._open && (this._commitOnBlur(), this._open = false);
          return;
      }
    }, this._onListboxMouseDown = (e8) => {
      const t5 = e8.target;
      t5 && t5.closest("ae-option") && e8.preventDefault();
    }, this._onListboxClick = (e8) => {
      const t5 = e8.target;
      if (!t5) return;
      const a4 = t5.closest("ae-option");
      a4 && (e8.preventDefault(), this._commitOption(a4));
    }, this._onListboxHover = (e8) => {
      const t5 = e8.target;
      if (!t5) return;
      const a4 = t5.closest("ae-option");
      !a4 || a4.disabled || a4.filterHidden || a4.id !== this._activeId && this._setActive(a4.id);
    }, this._internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncFormValue();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._removeDocListeners(), this._listboxEl && this._closeAndRestore();
  }
  updated(e8) {
    if (e8.has("value") && (this._syncSelectionFlags(), this._syncFormValue()), e8.has("_open")) {
      const t5 = e8.get("_open") !== void 0;
      this._open ? (this.setAttribute("data-open", ""), this._mountListbox(), this._addDocListeners(), this._positionListbox(), this._applyFilter(), this._ensureActive(), t5 && this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true }))) : (this.removeAttribute("data-open"), this._closeAndRestore(), this._removeDocListeners(), t5 && this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true })));
    }
    (e8.has("_open") || e8.has("_activeId")) && this._syncAriaRefs();
  }
  /**
   * Associate the shadow-DOM input with the light-DOM portaled listbox
   * (`aria-controls`) and the active option (`aria-activedescendant`)
   * through AOM element references, since those IDREFs cross the shadow
   * boundary and cannot be expressed with string ids in the template.
   */
  _syncAriaRefs() {
    const e8 = this._input;
    if (e8)
      if (this._open && this._listboxEl) {
        Ie(e8, [this._listboxEl]);
        const t5 = this._activeId ? this.options.find((a4) => a4.id === this._activeId) ?? null : null;
        kt(e8, t5);
      } else
        Ie(e8, []), kt(e8, null);
  }
  get options() {
    return this._listboxEl ? Array.from(this._listboxEl.querySelectorAll(":scope > ae-option")) : Array.from(this.querySelectorAll(":scope > ae-option"));
  }
  _visibleOptions() {
    return this.options.filter((e8) => !e8.disabled && !e8.filterHidden);
  }
  render() {
    return b2`
      <div class="field">
        <input
          part="input"
          type="text"
          role="combobox"
          aria-autocomplete=${this.filter ? "list" : "none"}
          aria-expanded=${this._open ? "true" : "false"}
          aria-required=${this.required ? "true" : A}
          aria-invalid=${this.invalid ? "true" : A}
          aria-disabled=${this.disabled ? "true" : A}
          placeholder=${this.placeholder || A}
          ?disabled=${this.disabled}
          .value=${this.value}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        />
        <button
          class="caret"
          type="button"
          tabindex="-1"
          aria-label="Toggle options"
          @click=${this._onCaretClick}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true" width="10" height="10">
            <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <span class="options-host" hidden>
        <slot @slotchange=${this._onSlotChange}></slot>
      </span>
    `;
  }
  // -- Portal -----------------------------------------------------------
  _mountListbox() {
    if (this._listboxEl) return;
    const e8 = document.createElement("div");
    e8.id = this._listboxId, e8.setAttribute("role", "listbox"), e8.setAttribute("part", "listbox"), e8.dataset.aeComboboxListbox = "", Object.assign(e8.style, {
      position: "absolute",
      zIndex: "var(--ae-z-popover, 1400)",
      background: "var(--ae-color-bg-elevated)",
      color: "var(--ae-color-fg)",
      border: "1px solid var(--ae-color-border)",
      borderRadius: "var(--ae-combobox-listbox-radius, var(--ae-radius-md))",
      boxShadow: "var(--ae-combobox-listbox-shadow, var(--ae-shadow-lg))",
      backdropFilter: "var(--ae-combobox-listbox-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      WebkitBackdropFilter: "var(--ae-combobox-listbox-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      padding: "var(--ae-space-1)",
      minWidth: "14rem",
      maxHeight: "16rem",
      overflowY: "auto",
      fontFamily: "var(--ae-font-family-sans)"
    });
    const t5 = Array.from(this.querySelectorAll(":scope > ae-option"));
    for (const a4 of t5) e8.appendChild(a4);
    e8.addEventListener("mousedown", this._onListboxMouseDown), e8.addEventListener("click", this._onListboxClick), e8.addEventListener("mousemove", this._onListboxHover), document.body.appendChild(e8), this._listboxEl = e8;
  }
  _closeAndRestore() {
    if (!this._listboxEl) return;
    const e8 = Array.from(this._listboxEl.querySelectorAll(":scope > ae-option"));
    for (const t5 of e8)
      t5.active = false, t5.filterHidden = false, this.appendChild(t5);
    this._listboxEl.removeEventListener("mousedown", this._onListboxMouseDown), this._listboxEl.removeEventListener("click", this._onListboxClick), this._listboxEl.removeEventListener("mousemove", this._onListboxHover), this._listboxEl.remove(), this._listboxEl = null;
  }
  _positionListbox() {
    if (!this._listboxEl) return;
    const e8 = this.getBoundingClientRect();
    this._listboxEl.style.top = `${window.scrollY + e8.bottom + 4}px`, this._listboxEl.style.left = `${window.scrollX + e8.left}px`, this._listboxEl.style.minWidth = `${e8.width}px`;
  }
  _addDocListeners() {
    this._docListenersBound || (window.addEventListener("scroll", this._onScrollOrResize, true), window.addEventListener("resize", this._onScrollOrResize), document.addEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = true);
  }
  _removeDocListeners() {
    this._docListenersBound && (window.removeEventListener("scroll", this._onScrollOrResize, true), window.removeEventListener("resize", this._onScrollOrResize), document.removeEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = false);
  }
  // -- Selection / filter ----------------------------------------------
  _syncSelectionFlags() {
    for (const e8 of this.options)
      e8.selected = e8.value === this.value, e8.id || (e8.id = `ae-option-${Math.random().toString(36).slice(2, 9)}`);
  }
  _syncFormValue() {
    var e8;
    typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function" && (this._internals.setFormValue(this.value), this.required && !this.value ? this._internals.setValidity({ valueMissing: true }, "Please complete this field.") : !this.freeform && this.value && !this._matchByValue(this.value) && !this._matchByLabel(this.value) ? this._internals.setValidity({ customError: true }, "Value must match an option.") : this._internals.setValidity({}));
  }
  _matchByValue(e8) {
    return this.options.find((t5) => t5.value === e8);
  }
  _matchByLabel(e8) {
    const t5 = e8.toLowerCase();
    return this.options.find((a4) => a4.textLabel.toLowerCase() === t5);
  }
  _applyFilter() {
    var t5;
    if (!this.filter) {
      for (const a4 of this.options) a4.filterHidden = false;
      return;
    }
    const e8 = ((t5 = this._input) == null ? void 0 : t5.value.toLowerCase()) ?? "";
    for (const a4 of this.options)
      a4.filterHidden = e8.length > 0 && !a4.textLabel.toLowerCase().includes(e8);
  }
  _ensureActive() {
    const e8 = this._visibleOptions();
    if (e8.length === 0) {
      this._activeId = "";
      return;
    }
    if (e8.find((r6) => r6.id === this._activeId)) return;
    const a4 = e8.find((r6) => r6.value === this.value) ?? e8[0];
    a4 && this._setActive(a4.id);
  }
  _setActive(e8) {
    this._activeId = e8;
    for (const t5 of this.options)
      if (t5.active = t5.id === e8, t5.active && this._listboxEl) {
        const a4 = t5.getBoundingClientRect(), r6 = this._listboxEl.getBoundingClientRect();
        (a4.top < r6.top || a4.bottom > r6.bottom) && t5.scrollIntoView({ block: "nearest" });
      }
  }
  _commitOption(e8) {
    e8.disabled || (this.value = e8.value, this._input.value = e8.textLabel, this._open = false, this.dispatchEvent(
      new CustomEvent("ae-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value }
      })
    ), this._suppressReopenOnFocus = true, this._input.focus(), this._suppressReopenOnFocus = false);
  }
  _commitOnBlur() {
    var a4;
    const e8 = ((a4 = this._input) == null ? void 0 : a4.value) ?? "";
    if (this.freeform) {
      e8 !== this.value && (this.value = e8, this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      ));
      return;
    }
    const t5 = this._matchByLabel(e8) ?? this._matchByValue(e8);
    if (t5)
      this.value !== t5.value ? (this.value = t5.value, this._input.value = t5.textLabel, this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      )) : this._input.value = t5.textLabel;
    else {
      const r6 = this._matchByValue(this.value);
      this._input.value = r6 ? r6.textLabel : "";
    }
  }
  _moveActive(e8) {
    const t5 = this._visibleOptions();
    if (t5.length === 0) return;
    const r6 = (t5.findIndex((s4) => s4.id === this._activeId) + e8 + t5.length) % t5.length, i7 = t5[r6 < 0 ? 0 : r6];
    i7 && this._setActive(i7.id);
  }
  _moveToEdge(e8) {
    const t5 = this._visibleOptions(), a4 = e8 === "start" ? t5[0] : t5[t5.length - 1];
    a4 && this._setActive(a4.id);
  }
  focus(e8) {
    var t5;
    (t5 = this._input) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._input) == null || e8.blur();
  }
  /** Programmatic open. */
  async open() {
    this.disabled || (this._open = true, await this.updateComplete);
  }
  /** Programmatic close. */
  async close() {
    this._open = false, await this.updateComplete;
  }
  /** Whether the listbox is currently open. */
  get isOpen() {
    return this._open;
  }
  /** Form-associated validity state, delegated to ElementInternals. */
  get validity() {
    return this._internals.validity;
  }
  /** Current validation message, delegated to ElementInternals. */
  get validationMessage() {
    return this._internals.validationMessage;
  }
  /** Trigger validation reporting, delegated to ElementInternals. */
  reportValidity() {
    return this._internals.reportValidity();
  }
  /** Check whether the control is currently valid. */
  checkValidity() {
    return this._internals.checkValidity();
  }
};
T2.formAssociated = true;
T2.styles = i`
    /*
     * Tier 3 combobox tokens are read via var(--token, fallback) inside
     * the consumption rules — see ae-input.ts for the cascade reasoning.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
      position: relative;
      min-width: 14rem;
    }

    .field {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      min-height: 2.25rem;
      font-size: var(--ae-font-size-sm);
      gap: var(--ae-combobox-gap, var(--ae-space-2));
      width: 100%;
      background: var(--ae-combobox-bg, var(--ae-color-bg));
      /* Frosted-glass hook — see ae-input.ts. */
      backdrop-filter: var(--ae-combobox-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-combobox-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-border-width-1) solid
        var(--ae-combobox-border, var(--ae-color-border-strong));
      border-radius: var(--ae-combobox-radius, var(--ae-radius-default));
      padding: var(--ae-combobox-padding, 0 var(--ae-space-2) 0 var(--ae-space-3));
      transition:
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .field:hover:not(:has(input:focus-visible)) {
      background: var(--ae-combobox-bg-hover,
        var(--ae-combobox-bg, var(--ae-color-bg)));
      border-color: var(--ae-combobox-border-hover,
        var(--ae-combobox-border, var(--ae-color-border-strong)));
    }
    .field:has(input:focus-visible) {
      ${y3}
      background: var(--ae-combobox-bg-focus,
        var(--ae-combobox-bg, var(--ae-color-bg)));
      border-color: var(--ae-combobox-border-focus, var(--ae-color-accent));
    }
    :host([disabled]) .field {
      opacity: var(--ae-opacity-disabled, 0.55);
      cursor: not-allowed;
    }

    :host([invalid]) .field,
    :host([invalid]) .field:hover:not(:has(input:focus-visible)),
    :host([invalid]) .field:has(input:focus-visible) {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .field:has(input:focus-visible) {
      ${ie}
    }

    input {
      all: unset;
      flex: 1 1 auto;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      font-family: var(--ae-font-family-ui);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-combobox-fg, var(--ae-color-fg));
      /* The .field owns the 36px box (border-box min-height) and centers the
       * input, matching ae-select's trigger model. The input adds no vertical
       * padding/height of its own — otherwise it inflated the field ~3px past
       * the select height. */
      padding: 0;
    }
    input::placeholder {
      color: var(--ae-combobox-placeholder, var(--ae-color-fg-subtle));
    }

    .caret {
      all: unset;
      box-sizing: border-box;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--ae-color-fg-muted);
      padding: 0 var(--ae-space-1);
      transition:
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        transform var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .caret:hover {
      color: var(--ae-color-fg);
    }
    :host([data-open]) .caret {
      transform: rotate(180deg);
    }

    .options-host {
      display: none;
    }

    ${Yt}
  `;
W([
  n4({ type: String, reflect: true })
], T2.prototype, "value", 2);
W([
  n4({ type: String, reflect: true })
], T2.prototype, "placeholder", 2);
W([
  n4({ type: Boolean, reflect: true })
], T2.prototype, "disabled", 2);
W([
  n4({ type: Boolean, reflect: true })
], T2.prototype, "required", 2);
W([
  n4({ type: Boolean, reflect: true })
], T2.prototype, "invalid", 2);
W([
  n4({ type: Boolean, reflect: true })
], T2.prototype, "freeform", 2);
W([
  n4({ type: Boolean, reflect: true })
], T2.prototype, "filter", 2);
W([
  n4({ type: String, reflect: true })
], T2.prototype, "name", 2);
W([
  r5()
], T2.prototype, "_open", 2);
W([
  r5()
], T2.prototype, "_activeId", 2);
W([
  e5("input")
], T2.prototype, "_input", 2);
T2 = W([
  t3("ae-combobox")
], T2);
var ci = Object.defineProperty;
var di = Object.getOwnPropertyDescriptor;
var V2 = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? di(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ci(t5, a4, i7), i7;
};
var D2 = class extends i4 {
  constructor() {
    super(), this.min = 0, this.max = 100, this.step = 1, this.value = 0, this.disabled = false, this.invalid = false, this.name = "", this.orientation = "horizontal", this.range = false, this.marks = false, this._activeThumb = 0, this._pointerDragging = false, this._draggingThumb = 0, this._onThumbKeyDown = (e8) => {
      if (this.disabled) return;
      const t5 = Number(e8.currentTarget.dataset.thumb);
      this._activeThumb = t5;
      const a4 = this.step * 10;
      let r6 = 0;
      switch (e8.key) {
        case "ArrowRight":
        case "ArrowUp":
          r6 = e8.shiftKey ? a4 : this.step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          r6 = -(e8.shiftKey ? a4 : this.step);
          break;
        case "PageUp":
          r6 = a4;
          break;
        case "PageDown":
          r6 = -a4;
          break;
        case "Home":
          e8.preventDefault(), this._setThumb(t5, this.min);
          return;
        case "End":
          e8.preventDefault(), this._setThumb(t5, this.max);
          return;
        default:
          return;
      }
      e8.preventDefault();
      const [i7, s4] = this._values, o9 = t5 === 0 ? i7 : s4;
      this._setThumb(t5, o9 + r6);
    }, this._onTrackPointerDown = (e8) => {
      if (this.disabled || e8.target.classList.contains("thumb")) return;
      const t5 = this._valueFromPointer(e8);
      if (t5 !== null) {
        if (this.range) {
          const [a4, r6] = this._values, i7 = Math.abs(t5 - a4) <= Math.abs(t5 - r6) ? 0 : 1;
          this._setThumb(i7, t5), this._activeThumb = i7;
        } else
          this._setThumb(0, t5);
        this._startDrag(this._activeThumb, e8);
      }
    }, this._onThumbPointerDown = (e8) => {
      if (this.disabled) return;
      const t5 = Number(e8.currentTarget.dataset.thumb);
      this._activeThumb = t5, this._startDrag(t5, e8);
    }, this._onPointerMove = (e8) => {
      if (!this._pointerDragging) return;
      const t5 = this._valueFromPointer(e8);
      t5 !== null && this._setThumb(this._draggingThumb, t5);
    }, this._onPointerUp = () => {
      this._pointerDragging = false;
    }, this._internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncFormValue(), typeof MutationObserver == "function" && (this._ariaObserver = new MutationObserver(() => this.requestUpdate()), this._ariaObserver.observe(this, {
      attributes: true,
      attributeFilter: ["aria-label", "aria-description"]
    }));
  }
  disconnectedCallback() {
    var e8;
    super.disconnectedCallback(), (e8 = this._ariaObserver) == null || e8.disconnect(), this._ariaObserver = void 0;
  }
  /** Host-level accessible name, applied to the thumb(s). */
  get _hostLabel() {
    return this.getAttribute("aria-label") ?? "";
  }
  get _hostDescription() {
    return this.getAttribute("aria-description") ?? "";
  }
  /** Per-thumb accessible name. In range mode the two thumbs are
   *  distinguished as the minimum and maximum handles. */
  _thumbLabel(e8) {
    const t5 = this._hostLabel;
    return t5 ? this.range ? e8 === 0 ? `${t5}, minimum` : `${t5}, maximum` : t5 : A;
  }
  _valueText(e8) {
    return this.formatValue ? this.formatValue(e8) : A;
  }
  updated(e8) {
    (e8.has("value") || e8.has("min") || e8.has("max") || e8.has("range")) && this._syncFormValue();
  }
  get _values() {
    if (this.range) {
      const t5 = Array.isArray(this.value) ? this.value : [this.min, this.max];
      return [
        this._clamp(this._snap(t5[0] ?? this.min)),
        this._clamp(this._snap(t5[1] ?? this.max))
      ];
    }
    const e8 = typeof this.value == "number" ? this.value : this.min;
    return [this._clamp(this._snap(e8)), 0];
  }
  _clamp(e8) {
    return Math.min(this.max, Math.max(this.min, e8));
  }
  _snap(e8) {
    if (!Number.isFinite(this.step) || this.step <= 0) return e8;
    const t5 = this.min, a4 = Math.round((e8 - t5) / this.step) * this.step + t5, r6 = (`${this.step}`.split(".")[1] ?? "").length;
    return r6 > 0 ? Number(a4.toFixed(r6)) : a4;
  }
  _percentFor(e8) {
    return this.max === this.min ? 0 : (e8 - this.min) / (this.max - this.min) * 100;
  }
  _syncFormValue() {
    var t5;
    if (typeof ((t5 = this._internals) == null ? void 0 : t5.setFormValue) != "function") return;
    const e8 = this.range ? Array.isArray(this.value) ? `${this.value[0]},${this.value[1]}` : `${this.min},${this.max}` : `${typeof this.value == "number" ? this.value : this.min}`;
    this._internals.setFormValue(e8);
  }
  render() {
    const [e8, t5] = this._values, a4 = this.orientation === "vertical", r6 = this._percentFor(e8), i7 = this._percentFor(t5), s4 = this.range ? Math.min(r6, i7) : 0, o9 = this.range ? Math.max(r6, i7) : r6, h3 = a4 ? `bottom:${s4}%; height:${o9 - s4}%; left:0; right:0;` : `left:${s4}%; width:${o9 - s4}%;`, d3 = a4 ? `bottom:${r6}%; left:50%;` : `left:${r6}%; top:50%;`, p3 = a4 ? `bottom:${i7}%; left:50%;` : `left:${i7}%; top:50%;`, b3 = this.marks ? this._renderMarks() : A;
    return b2`
      <div class="wrap">
        <div
          class="track"
          part="track"
          @pointerdown=${this._onTrackPointerDown}
        >
          <div class="fill" part="fill" style=${h3}></div>
          ${b3}
          <div
            class="thumb"
            part="thumb"
            role="slider"
            tabindex=${this.disabled ? -1 : 0}
            aria-valuemin=${this.min}
            aria-valuemax=${this.range ? t5 : this.max}
            aria-valuenow=${e8}
            aria-valuetext=${this._valueText(e8)}
            aria-orientation=${this.orientation}
            aria-label=${this._thumbLabel(0)}
            aria-description=${this._hostDescription || A}
            aria-disabled=${this.disabled ? "true" : A}
            aria-invalid=${this.invalid ? "true" : A}
            data-thumb="0"
            style=${d3}
            @keydown=${this._onThumbKeyDown}
            @pointerdown=${this._onThumbPointerDown}
            @focus=${() => this._activeThumb = 0}
          ></div>
          ${this.range ? b2`<div
                class="thumb"
                part="thumb"
                role="slider"
                tabindex=${this.disabled ? -1 : 0}
                aria-valuemin=${e8}
                aria-valuemax=${this.max}
                aria-valuenow=${t5}
                aria-valuetext=${this._valueText(t5)}
                aria-orientation=${this.orientation}
                aria-label=${this._thumbLabel(1)}
                aria-description=${this._hostDescription || A}
                aria-disabled=${this.disabled ? "true" : A}
                aria-invalid=${this.invalid ? "true" : A}
                data-thumb="1"
                style=${p3}
                @keydown=${this._onThumbKeyDown}
                @pointerdown=${this._onThumbPointerDown}
                @focus=${() => this._activeThumb = 1}
              ></div>` : A}
        </div>
      </div>
    `;
  }
  _renderMarks() {
    if (!Number.isFinite(this.step) || this.step <= 0) return A;
    const e8 = [], t5 = Math.floor((this.max - this.min) / this.step);
    if (t5 > 64) return A;
    const a4 = this.orientation === "vertical";
    for (let r6 = 0; r6 <= t5; r6++) {
      const i7 = this.min + r6 * this.step;
      if (i7 > this.max) break;
      const s4 = this._percentFor(i7), o9 = a4 ? `bottom:${s4}%; left:50%;` : `left:${s4}%; top:50%;`;
      e8.push(b2`<span class="mark" part="mark" style=${o9}></span>`);
    }
    return e8;
  }
  _setThumb(e8, t5) {
    const a4 = this._clamp(this._snap(t5));
    let [r6, i7] = this._values;
    this.range ? (e8 === 0 ? r6 = Math.min(a4, i7) : i7 = Math.max(a4, r6), this.value = [r6, i7]) : this.value = a4, this.dispatchEvent(
      new CustomEvent("ae-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value }
      })
    );
  }
  _startDrag(e8, t5) {
    this._pointerDragging = true, this._draggingThumb = e8;
    const a4 = t5.currentTarget;
    try {
      a4.setPointerCapture(t5.pointerId);
    } catch {
    }
    a4.addEventListener("pointermove", this._onPointerMove), a4.addEventListener("pointerup", this._onPointerUp, { once: true }), a4.addEventListener("pointercancel", this._onPointerUp, { once: true });
  }
  _valueFromPointer(e8) {
    const t5 = this._trackEl;
    if (!t5) return null;
    const a4 = t5.getBoundingClientRect();
    if (a4.width === 0 && a4.height === 0) return null;
    let r6;
    return this.orientation === "vertical" ? r6 = 1 - (e8.clientY - a4.top) / a4.height : r6 = (e8.clientX - a4.left) / a4.width, r6 = Math.max(0, Math.min(1, r6)), this.min + r6 * (this.max - this.min);
  }
  /** Form-associated validity state, delegated to ElementInternals. */
  get validity() {
    return this._internals.validity;
  }
  /** Validation message. */
  get validationMessage() {
    return this._internals.validationMessage;
  }
};
D2.formAssociated = true;
D2.styles = i`
    /*
     * Theme-overridable tokens (--ae-slider-track-bg, -track-fill,
     * -track-radius, -track-size, -thumb-bg, -thumb-border,
     * -thumb-radius, -thumb-rotate) are NOT declared at :host — :host
     * declarations would shadow inherited root-level theme overrides.
     * Resolved at the consumption point via var(--token, default).
     * Locked down by src/theme-integration.test.ts.
     *
     * --ae-slider-thumb-size remains at :host — it's a consumer-
     * instance concern, not a theme one.
     */
    :host {
      --ae-slider-thumb-size: 1.125rem;

      display: inline-block;
      width: 16rem;
      box-sizing: border-box;
      font-family: var(--ae-font-family-sans);
    }
    :host([orientation='vertical']) {
      width: auto;
      height: 12rem;
    }
    :host([disabled]) {
      opacity: var(--ae-opacity-disabled, 0.55);
      pointer-events: none;
    }

    /*
     * The hit-area padding lives on .wrap, NOT on :host. A consumer's global
     * reset (\`* { padding: 0 }\`) is a document-tree declaration and overrides
     * a normal :host one in the cascade, so host padding would silently
     * collapse to 0 — shrinking the slider's clickable area to the bare track.
     * A document \`*\` selector can't reach inside this shadow tree, so .wrap's
     * padding is immune.
     */
    .wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: var(--ae-space-3) 0;
      box-sizing: border-box;
    }
    :host([orientation='vertical']) .wrap {
      flex-direction: column;
      justify-content: center;
      padding: 0 var(--ae-space-3);
    }

    .track {
      position: relative;
      width: 100%;
      height: var(--ae-slider-track-size, 4px);
      background: var(--ae-slider-track-bg, var(--ae-color-border));
      border-radius: var(--ae-slider-track-radius, var(--ae-radius-full));
      cursor: pointer;
    }
    :host([orientation='vertical']) .track {
      width: var(--ae-slider-track-size, 4px);
      height: 100%;
    }

    .fill {
      position: absolute;
      background: var(--ae-slider-track-fill, var(--ae-color-accent));
      border-radius: var(--ae-slider-track-radius, var(--ae-radius-full));
      /* Bioluminescent accent: a brand (Crucible) can make the filled track
       * glow molten. Default none. */
      box-shadow: var(--ae-slider-fill-glow, none);
      top: 0;
      bottom: 0;
    }
    :host([orientation='vertical']) .fill {
      left: 0;
      right: 0;
      top: auto;
      bottom: auto;
    }

    .thumb {
      position: absolute;
      width: var(--ae-slider-thumb-size);
      height: var(--ae-slider-thumb-size);
      background: var(--ae-slider-thumb-bg, var(--ae-color-bg-elevated));
      border: 2px solid
        var(--ae-slider-thumb-border, var(--ae-color-accent));
      border-radius: var(--ae-slider-thumb-radius, 50%);
      box-shadow: var(--ae-slider-thumb-shadow, var(--ae-shadow-sm));
      top: 50%;
      /* --ae-slider-thumb-rotate slots between the centering translate
       * and any further transforms a theme might inject. Default is
       * rotate(0deg) (identity) so the thumb sits axis-aligned;
       * themes like Metro override to rotate(45deg) for a diamond. */
      transform:
        translate(-50%, -50%)
        var(--ae-slider-thumb-rotate, rotate(0deg));
      cursor: grab;
      touch-action: none;
      transition: box-shadow var(--ae-duration-fast);
    }
    :host([orientation='vertical']) .thumb {
      top: auto;
      left: 50%;
      transform:
        translate(-50%, 50%)
        var(--ae-slider-thumb-rotate, rotate(0deg));
    }
    .thumb:focus-visible {
      ${y3}
      box-shadow: var(--ae-shadow-md);
    }
    .thumb:active {
      cursor: grabbing;
    }

    /* Invalid: recolor the thumb border + focus ring to danger. */
    :host([invalid]) .thumb {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .thumb:focus-visible {
      ${ie}
    }

    .mark {
      position: absolute;
      width: 2px;
      height: 8px;
      background: var(--ae-color-fg-subtle);
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      border-radius: var(--ae-radius-xs);
    }
    :host([orientation='vertical']) .mark {
      width: 8px;
      height: 2px;
      left: 50%;
      top: auto;
      transform: translate(-50%, 50%);
    }
  `;
V2([
  n4({ type: Number, reflect: true })
], D2.prototype, "min", 2);
V2([
  n4({ type: Number, reflect: true })
], D2.prototype, "max", 2);
V2([
  n4({ type: Number, reflect: true })
], D2.prototype, "step", 2);
V2([
  n4({ reflect: true, converter: {
    fromAttribute: (e8) => {
      if (e8 === null) return 0;
      if (e8.includes(",")) {
        const a4 = e8.split(",").map((r6) => Number(r6.trim()));
        if (a4.length === 2 && a4.every((r6) => Number.isFinite(r6)))
          return [a4[0], a4[1]];
      }
      const t5 = Number(e8);
      return Number.isFinite(t5) ? t5 : 0;
    },
    toAttribute: (e8) => Array.isArray(e8) ? `${e8[0]},${e8[1]}` : String(e8)
  } })
], D2.prototype, "value", 2);
V2([
  n4({ type: Boolean, reflect: true })
], D2.prototype, "disabled", 2);
V2([
  n4({ type: Boolean, reflect: true })
], D2.prototype, "invalid", 2);
V2([
  n4({ type: String, reflect: true })
], D2.prototype, "name", 2);
V2([
  n4({ type: String, reflect: true })
], D2.prototype, "orientation", 2);
V2([
  n4({ type: Boolean, reflect: true })
], D2.prototype, "range", 2);
V2([
  n4({ type: Boolean, reflect: true })
], D2.prototype, "marks", 2);
V2([
  r5()
], D2.prototype, "_activeThumb", 2);
V2([
  e5(".track")
], D2.prototype, "_trackEl", 2);
D2 = V2([
  t3("ae-slider")
], D2);
var hi = Object.defineProperty;
var pi = Object.getOwnPropertyDescriptor;
var M2 = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? pi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && hi(t5, a4, i7), i7;
};
var E2 = class extends i4 {
  constructor() {
    super(), this.value = "", this.min = "", this.max = "", this.disabled = false, this.required = false, this.invalid = false, this.name = "", this.format = "YYYY-MM-DD", this.weekstart = 0, this._open = false, this._viewYear = (/* @__PURE__ */ new Date()).getFullYear(), this._viewMonth = (/* @__PURE__ */ new Date()).getMonth(), this._focusedISO = "", this._ariaForward = new Ce(this, () => this._input), this._calId = `ae-date-cal-${Math.random().toString(36).slice(2, 9)}`, this._calEl = null, this._docListenersBound = false, this._onScrollOrResize = () => this._positionCalendar(), this._onDocPointerDown = (e8) => {
      const t5 = e8.target;
      t5 && (this.contains(t5) || this._calEl && this._calEl.contains(t5) || (this._open = false));
    }, this._onToggleClick = (e8) => {
      this.disabled || (e8.preventDefault(), this._open = !this._open);
    }, this._onInput = (e8) => {
      const t5 = e8.target.value, a4 = fi(t5, this.format);
      a4 && (this.value = a4, this.dispatchEvent(
        new CustomEvent("ae-change", { bubbles: true, composed: true, detail: { value: this.value } })
      ));
    }, this._onInputBlur = () => {
      this._input.value = this._displayValue();
    }, this._onInputKeyDown = (e8) => {
      e8.key === "ArrowDown" && !this._open ? (e8.preventDefault(), this._open = true) : e8.key === "Escape" && this._open && (e8.preventDefault(), this._open = false, this._input.focus());
    }, this._onCalendarClick = (e8) => {
      const t5 = e8.target;
      if (!t5) return;
      const a4 = t5.closest("[data-nav]");
      if (a4) {
        e8.preventDefault(), this._navigateMonth(a4.dataset.nav === "next" ? 1 : -1);
        return;
      }
      const r6 = t5.closest("[data-iso]");
      if (r6) {
        e8.preventDefault();
        const i7 = r6.dataset.iso;
        this._selectDate(i7);
      }
    }, this._onCalendarKeyDown = (e8) => {
      const t5 = e8.key;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Enter", " ", "Escape"].includes(t5)) return;
      if (e8.preventDefault(), t5 === "Escape") {
        this._open = false, this._input.focus();
        return;
      }
      if (t5 === "Enter" || t5 === " ") {
        this._selectDate(this._focusedISO);
        return;
      }
      const r6 = j(this._focusedISO);
      if (!r6) return;
      const i7 = new Date(r6);
      switch (t5) {
        case "ArrowLeft":
          i7.setDate(r6.getDate() - 1);
          break;
        case "ArrowRight":
          i7.setDate(r6.getDate() + 1);
          break;
        case "ArrowUp":
          i7.setDate(r6.getDate() - 7);
          break;
        case "ArrowDown":
          i7.setDate(r6.getDate() + 7);
          break;
        case "PageUp":
          e8.shiftKey ? i7.setFullYear(r6.getFullYear() - 1) : i7.setMonth(r6.getMonth() - 1);
          break;
        case "PageDown":
          e8.shiftKey ? i7.setFullYear(r6.getFullYear() + 1) : i7.setMonth(r6.getMonth() + 1);
          break;
        case "Home":
          i7.setDate(r6.getDate() - r6.getDay() + this.weekstart);
          break;
        case "End":
          i7.setDate(r6.getDate() + (6 - r6.getDay() + this.weekstart));
          break;
      }
      this._focusedISO = sa(i7), this._viewYear = i7.getFullYear(), this._viewMonth = i7.getMonth();
    }, this._internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncFormValue(), this._seedViewFromValue();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._removeDocListeners(), this._calEl && this._unmountCalendar();
  }
  updated(e8) {
    if (e8.has("value") && (this._syncFormValue(), this._seedViewFromValue()), (e8.has("_open") || e8.has("_viewYear") || e8.has("_viewMonth") || e8.has("_focusedISO") || e8.has("value")) && this._open && (this._calEl || this._mountCalendar(), this._positionCalendar(), this._renderCalendar()), e8.has("_open")) {
      const t5 = e8.get("_open") !== void 0;
      this._open ? (this.setAttribute("data-open", ""), this._addDocListeners(), t5 && this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true }))) : (this.removeAttribute("data-open"), this._unmountCalendar(), this._removeDocListeners(), t5 && this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true }))), this._syncAriaRefs();
    }
  }
  /**
   * Point the shadow-DOM input's `aria-controls` at the portaled calendar
   * dialog (light DOM) via an AOM element reference. The relationship
   * crosses the shadow boundary, so the string-id form on the input can't
   * resolve it; AOM can. Cleared when the calendar is closed.
   */
  _syncAriaRefs() {
    const e8 = this._input;
    e8 && Ie(e8, this._open && this._calEl ? [this._calEl] : []);
  }
  _seedViewFromValue() {
    const e8 = j(this.value);
    if (e8)
      this._viewYear = e8.getFullYear(), this._viewMonth = e8.getMonth(), this._focusedISO = this.value;
    else if (!this._focusedISO) {
      const t5 = /* @__PURE__ */ new Date();
      this._focusedISO = sa(t5);
    }
  }
  _syncFormValue() {
    var e8;
    if (typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function")
      if (this._internals.setFormValue(this.value), this.required && !this.value)
        this._internals.setValidity({ valueMissing: true }, "Please choose a date.");
      else if (this.value) {
        const t5 = j(this.value);
        t5 ? this.min && t5 < j(this.min) ? this._internals.setValidity({ rangeUnderflow: true }, `Date must be on or after ${this.min}.`) : this.max && t5 > j(this.max) ? this._internals.setValidity({ rangeOverflow: true }, `Date must be on or before ${this.max}.`) : this._internals.setValidity({}) : this._internals.setValidity({ badInput: true }, "Invalid date.");
      } else
        this._internals.setValidity({});
  }
  render() {
    return b2`
      <div class="field">
        <input
          part="input"
          type="text"
          inputmode="numeric"
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded=${this._open ? "true" : "false"}
          aria-required=${this.required ? "true" : A}
          aria-invalid=${this.invalid ? "true" : A}
          aria-disabled=${this.disabled ? "true" : A}
          ?disabled=${this.disabled}
          placeholder=${this.format}
          .value=${this._displayValue()}
          @input=${this._onInput}
          @blur=${this._onInputBlur}
          @keydown=${this._onInputKeyDown}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label="Open calendar"
          @click=${this._onToggleClick}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
            <rect x="2" y="3" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4" />
            <line x1="2" y1="6.5" x2="14" y2="6.5" stroke="currentColor" stroke-width="1.4" />
            <line x1="5.5" y1="2" x2="5.5" y2="5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            <line x1="10.5" y1="2" x2="10.5" y2="5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    `;
  }
  _displayValue() {
    if (!this.value) return "";
    const e8 = j(this.value);
    return e8 ? ui(e8, this.format) : this.value;
  }
  // -- Calendar portal -------------------------------------------------
  _mountCalendar() {
    if (this._calEl) return;
    const e8 = document.createElement("div");
    e8.id = this._calId, e8.setAttribute("role", "dialog"), e8.setAttribute("aria-label", "Choose a date"), e8.setAttribute("part", "calendar"), Object.assign(e8.style, {
      position: "absolute",
      zIndex: "var(--ae-z-popover, 1400)",
      background: "var(--ae-date-picker-cal-bg, var(--ae-color-bg-elevated))",
      backdropFilter: "var(--ae-date-picker-cal-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      WebkitBackdropFilter: "var(--ae-date-picker-cal-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      color: "var(--ae-color-fg)",
      border: "var(--ae-date-picker-cal-border, 1px solid var(--ae-color-border))",
      borderRadius: "var(--ae-date-picker-cal-radius, var(--ae-radius-md))",
      boxShadow: "var(--ae-shadow-lg)",
      padding: "var(--ae-space-3)",
      fontFamily: "var(--ae-font-family-sans)",
      fontSize: "var(--ae-font-size-sm)",
      minWidth: "17rem"
    }), e8.addEventListener("click", this._onCalendarClick), e8.addEventListener("keydown", this._onCalendarKeyDown), document.body.appendChild(e8), this._calEl = e8;
  }
  _unmountCalendar() {
    this._calEl && (this._calEl.removeEventListener("click", this._onCalendarClick), this._calEl.removeEventListener("keydown", this._onCalendarKeyDown), this._calEl.remove(), this._calEl = null);
  }
  _positionCalendar() {
    if (!this._calEl) return;
    const e8 = this.getBoundingClientRect();
    this._calEl.style.top = `${window.scrollY + e8.bottom + 4}px`, this._calEl.style.left = `${window.scrollX + e8.left}px`;
  }
  _renderCalendar() {
    if (!this._calEl) return;
    const e8 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], t5 = this._dayHeaders(), a4 = this._monthGrid(this._viewYear, this._viewMonth), r6 = j(this.min), i7 = j(this.max), s4 = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--ae-space-2);">
        <button type="button" data-nav="prev" aria-label="Previous month"
          style="all:unset; cursor:pointer; padding:var(--ae-space-1) var(--ae-space-2); border-radius:var(--ae-radius-sm);">\u2039</button>
        <span style="font-weight:var(--ae-font-weight-semibold);">
          ${e8[this._viewMonth]} ${this._viewYear}
        </span>
        <button type="button" data-nav="next" aria-label="Next month"
          style="all:unset; cursor:pointer; padding:var(--ae-space-1) var(--ae-space-2); border-radius:var(--ae-radius-sm);">\u203A</button>
      </div>
    `, o9 = t5.map(
      (p3) => `<div style="text-align:center; font-size:var(--ae-font-size-xs); color:var(--ae-color-fg-subtle); font-weight:var(--ae-font-weight-semibold); padding:var(--ae-space-1) 0;">${p3}</div>`
    ).join(""), h3 = a4.map((p3) => {
      const b3 = sa(p3.date), g2 = p3.date.getMonth() === this._viewMonth, m2 = b3 === this.value, w2 = b3 === this._focusedISO, se = r6 && p3.date < r6 || i7 && p3.date > i7, A2 = [
        "all:unset",
        "cursor:" + (se ? "not-allowed" : "pointer"),
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "aspect-ratio:1",
        "border-radius:var(--ae-date-picker-cal-day-radius, var(--ae-radius-sm))",
        "font-size:var(--ae-font-size-sm)",
        g2 ? "color:var(--ae-color-fg)" : "color:var(--ae-color-fg-subtle)",
        m2 ? "background:var(--ae-date-picker-cal-day-selected-bg, var(--ae-color-accent));color:var(--ae-date-picker-cal-day-selected-fg, var(--ae-color-fg-on-accent));" : "",
        w2 && !m2 ? "outline:2px solid var(--ae-color-accent);outline-offset:-2px;" : "",
        se ? "opacity:0.4" : ""
      ].join(";");
      return `<button type="button" part="day" data-iso="${b3}" ${se ? 'aria-disabled="true" disabled' : ""} aria-selected="${m2}" tabindex="${w2 ? 0 : -1}" style="${A2}">${p3.date.getDate()}</button>`;
    }).join("");
    this._calEl.innerHTML = `
      ${s4}
      <div role="grid" aria-label="Calendar" style="display:grid; grid-template-columns:repeat(7,1fr); gap:2px;">
        ${o9}
        ${h3}
      </div>
    `;
    const d3 = this._calEl.querySelector(`[data-iso="${this._focusedISO}"]`);
    d3 && d3.focus({ preventScroll: true });
  }
  _dayHeaders() {
    const e8 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return this.weekstart === 1 ? [...e8.slice(1), e8[0]] : e8;
  }
  _monthGrid(e8, t5) {
    const i7 = (new Date(e8, t5, 1).getDay() - this.weekstart + 7) % 7, s4 = new Date(e8, t5, 1 - i7), o9 = [];
    for (let h3 = 0; h3 < 42; h3++) {
      const d3 = new Date(s4);
      d3.setDate(s4.getDate() + h3), o9.push({ date: d3 });
    }
    return o9;
  }
  _addDocListeners() {
    this._docListenersBound || (window.addEventListener("scroll", this._onScrollOrResize, true), window.addEventListener("resize", this._onScrollOrResize), document.addEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = true);
  }
  _removeDocListeners() {
    this._docListenersBound && (window.removeEventListener("scroll", this._onScrollOrResize, true), window.removeEventListener("resize", this._onScrollOrResize), document.removeEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = false);
  }
  _navigateMonth(e8) {
    const t5 = new Date(this._viewYear, this._viewMonth + e8, 1);
    this._viewYear = t5.getFullYear(), this._viewMonth = t5.getMonth();
  }
  _selectDate(e8) {
    const t5 = j(e8);
    if (!t5) return;
    const a4 = j(this.min), r6 = j(this.max);
    a4 && t5 < a4 || r6 && t5 > r6 || (this.value = e8, this.dispatchEvent(
      new CustomEvent("ae-change", { bubbles: true, composed: true, detail: { value: e8 } })
    ), this._open = false, this._input.focus());
  }
  focus(e8) {
    var t5;
    (t5 = this._input) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._input) == null || e8.blur();
  }
  /** Programmatic open. */
  async open() {
    this.disabled || (this._open = true, await this.updateComplete);
  }
  /** Programmatic close. */
  async close() {
    this._open = false, await this.updateComplete;
  }
  /** Whether the calendar is currently open. */
  get isOpen() {
    return this._open;
  }
  /** Form-associated validity state. */
  get validity() {
    return this._internals.validity;
  }
  /** Validation message. */
  get validationMessage() {
    return this._internals.validationMessage;
  }
};
E2.formAssociated = true;
E2.styles = i`
    /*
     * Theme-overridable tokens (--ae-date-picker-bg, -border, -radius,
     * -toggle-bg, -toggle-border, -cal-bg, -cal-border, -cal-radius,
     * -cal-day-radius, -cal-day-selected-bg/-fg) are NOT declared at
     * :host — :host declarations would shadow inherited theme overrides.
     * Resolved at consumption point via var(--token, default). Locked
     * down by src/theme-integration.test.ts.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
      position: relative;
      min-width: 12rem;
    }

    .field {
      display: inline-flex;
      align-items: stretch;
      width: 100%;
      background: var(--ae-date-picker-bg, var(--ae-color-bg));
      backdrop-filter: var(--ae-date-picker-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-date-picker-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-border-width-1) solid
        var(--ae-date-picker-border, var(--ae-color-border-strong));
      border-radius: var(--ae-date-picker-radius, var(--ae-radius-default));
      transition: border-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .field:has(input:focus-visible) {
      ${y3}
      border-color: var(--ae-color-accent);
    }
    :host([disabled]) .field {
      opacity: var(--ae-opacity-disabled, 0.55);
      cursor: not-allowed;
    }

    :host([invalid]) .field,
    :host([invalid]) .field:has(input:focus-visible) {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .field:has(input:focus-visible) {
      ${ie}
    }

    input {
      all: unset;
      flex: 1 1 auto;
      box-sizing: border-box;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg);
      padding: var(--ae-space-2) var(--ae-space-3);
      min-height: 2.25rem;
    }

    /* Affix-style toggle button — sits inside the field with its own
     * background and an optional separator border. By default the
     * affix is transparent + has no separator (looks like an embedded
     * icon button); Metro overrides both to render a paper-2 affix
     * with a 2px ink left-border separator. */
    .toggle {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 var(--ae-space-2);
      color: var(--ae-color-fg-muted);
      background: var(--ae-date-picker-toggle-bg, transparent);
      border-left: var(--ae-date-picker-toggle-border, 0 solid transparent);
      flex-shrink: 0;
    }
    .toggle:focus-visible {
      ${y3}
    }

    ${Yt}
  `;
M2([
  n4({ type: String, reflect: true })
], E2.prototype, "value", 2);
M2([
  n4({ type: String, reflect: true })
], E2.prototype, "min", 2);
M2([
  n4({ type: String, reflect: true })
], E2.prototype, "max", 2);
M2([
  n4({ type: Boolean, reflect: true })
], E2.prototype, "disabled", 2);
M2([
  n4({ type: Boolean, reflect: true })
], E2.prototype, "required", 2);
M2([
  n4({ type: Boolean, reflect: true })
], E2.prototype, "invalid", 2);
M2([
  n4({ type: String, reflect: true })
], E2.prototype, "name", 2);
M2([
  n4({ type: String, reflect: true })
], E2.prototype, "format", 2);
M2([
  n4({ type: Number, reflect: true })
], E2.prototype, "weekstart", 2);
M2([
  r5()
], E2.prototype, "_open", 2);
M2([
  r5()
], E2.prototype, "_viewYear", 2);
M2([
  r5()
], E2.prototype, "_viewMonth", 2);
M2([
  r5()
], E2.prototype, "_focusedISO", 2);
M2([
  e5("input")
], E2.prototype, "_input", 2);
E2 = M2([
  t3("ae-date-picker")
], E2);
function sa(e8) {
  const t5 = e8.getFullYear().toString().padStart(4, "0"), a4 = (e8.getMonth() + 1).toString().padStart(2, "0"), r6 = e8.getDate().toString().padStart(2, "0");
  return `${t5}-${a4}-${r6}`;
}
function j(e8) {
  if (!e8) return null;
  const t5 = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(e8);
  if (!t5) return null;
  const [, a4, r6, i7] = t5, s4 = Number(a4), o9 = Number(r6) - 1, h3 = Number(i7);
  if (!Number.isFinite(s4) || !Number.isFinite(o9) || !Number.isFinite(h3)) return null;
  const d3 = new Date(s4, o9, h3);
  return d3.getFullYear() !== s4 || d3.getMonth() !== o9 || d3.getDate() !== h3 ? null : d3;
}
function ui(e8, t5) {
  return t5.replace(/YYYY/g, e8.getFullYear().toString().padStart(4, "0")).replace(/YY/g, e8.getFullYear().toString().slice(-2)).replace(/MM/g, (e8.getMonth() + 1).toString().padStart(2, "0")).replace(/M/g, (e8.getMonth() + 1).toString()).replace(/DD/g, e8.getDate().toString().padStart(2, "0")).replace(/D/g, e8.getDate().toString());
}
function fi(e8, t5) {
  if (!e8) return null;
  const a4 = j(e8);
  if (a4) return sa(a4);
  const r6 = [], i7 = t5.replace(/YYYY|YY|MM|M|DD|D/g, (g2) => g2 === "YYYY" ? (r6.push({ key: "Y", len: 4 }), "(\\d{4})") : g2 === "YY" ? (r6.push({ key: "Y", len: 2 }), "(\\d{2})") : g2 === "MM" ? (r6.push({ key: "M", len: 2 }), "(\\d{2})") : g2 === "M" ? (r6.push({ key: "M", len: 1 }), "(\\d{1,2})") : g2 === "DD" ? (r6.push({ key: "D", len: 2 }), "(\\d{2})") : g2 === "D" ? (r6.push({ key: "D", len: 1 }), "(\\d{1,2})") : g2), o9 = new RegExp(`^${i7}$`).exec(e8);
  if (!o9) return null;
  let h3 = 0, d3 = 0, p3 = 0;
  for (let g2 = 0; g2 < r6.length; g2++) {
    const m2 = r6[g2], w2 = Number(o9[g2 + 1]);
    m2.key === "Y" ? h3 = m2.len === 2 ? 2e3 + w2 : w2 : m2.key === "M" ? d3 = w2 : m2.key === "D" && (p3 = w2);
  }
  const b3 = `${h3.toString().padStart(4, "0")}-${d3.toString().padStart(2, "0")}-${p3.toString().padStart(2, "0")}`;
  return j(b3) ? b3 : null;
}
var vi = Object.defineProperty;
var bi = Object.getOwnPropertyDescriptor;
var H2 = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? bi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && vi(t5, a4, i7), i7;
};
var P2 = class extends i4 {
  constructor() {
    super(), this.value = "", this.step = 15, this.min = "", this.max = "", this.format = 24, this.disabled = false, this.required = false, this.invalid = false, this.name = "", this._open = false, this._activeIdx = -1, this._ariaForward = new Ce(this, () => this._input), this._popupId = `ae-time-popup-${Math.random().toString(36).slice(2, 9)}`, this._popupEl = null, this._docListenersBound = false, this._onScrollOrResize = () => this._positionPopup(), this._onDocPointerDown = (e8) => {
      const t5 = e8.target;
      t5 && (this.contains(t5) || this._popupEl && this._popupEl.contains(t5) || (this._open = false));
    }, this._onToggleClick = (e8) => {
      this.disabled || (e8.preventDefault(), this._open = !this._open, this._open && this._input.focus());
    }, this._onFocus = () => {
    }, this._onInput = (e8) => {
      const t5 = e8.target.value, a4 = gi(t5);
      a4 !== null && (this.value = a4, this.dispatchEvent(
        new CustomEvent("ae-change", { bubbles: true, composed: true, detail: { value: a4 } })
      ));
    }, this._onBlur = () => {
      this._input.value = ia(this.value, this.format), queueMicrotask(() => {
        const e8 = document.activeElement;
        e8 && this._popupEl && this._popupEl.contains(e8) || e8 !== this._input && (this._open = false);
      });
    }, this._onKeyDown = (e8) => {
      if (this.disabled) return;
      const t5 = e8.key;
      if (!this._open && (t5 === "ArrowDown" || t5 === "ArrowUp")) {
        e8.preventDefault(), this._open = true;
        return;
      }
      if (this._open)
        switch (t5) {
          case "Escape":
            e8.preventDefault(), this._open = false, this._input.focus();
            return;
          case "ArrowDown":
            e8.preventDefault(), this._moveActive(1);
            return;
          case "ArrowUp":
            e8.preventDefault(), this._moveActive(-1);
            return;
          case "Home":
            e8.preventDefault(), this._activeIdx = 0;
            return;
          case "End":
            e8.preventDefault(), this._activeIdx = this._generateOptions().length - 1;
            return;
          case "Enter":
          case " ": {
            e8.preventDefault();
            const r6 = this._generateOptions()[this._activeIdx];
            r6 && this._commit(r6);
            return;
          }
          case "Tab":
            this._open = false;
            return;
        }
    }, this._onPopupClick = (e8) => {
      const t5 = e8.target;
      if (!t5) return;
      const a4 = t5.closest("[data-value]");
      if (!a4) return;
      e8.preventDefault();
      const r6 = a4.dataset.value;
      this._commit(r6);
    }, this._internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncFormValue();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._removeDocListeners(), this._popupEl && this._unmountPopup();
  }
  updated(e8) {
    if (e8.has("value") && this._syncFormValue(), e8.has("_open")) {
      const t5 = e8.get("_open") !== void 0;
      this._open ? (this.setAttribute("data-open", ""), this._mountPopup(), this._addDocListeners(), this._positionPopup(), this._renderPopup(), this._scrollActiveIntoView(), t5 && this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true }))) : (this.removeAttribute("data-open"), this._unmountPopup(), this._syncActiveDescendant(), this._removeDocListeners(), t5 && this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true })));
    } else e8.has("_activeIdx") && this._open ? (this._renderPopup(), this._scrollActiveIntoView()) : e8.has("value") && this._open && this._renderPopup();
  }
  _syncFormValue() {
    var e8;
    if (typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function")
      if (this._internals.setFormValue(this.value), this.required && !this.value)
        this._internals.setValidity({ valueMissing: true }, "Please choose a time.");
      else if (this.value && !J(this.value))
        this._internals.setValidity({ badInput: true }, "Invalid time.");
      else if (this.value) {
        const t5 = J(this.value), a4 = J(this.min), r6 = J(this.max);
        t5 !== null && a4 !== null && t5 < a4 ? this._internals.setValidity({ rangeUnderflow: true }, `Time must be at or after ${this.min}.`) : t5 !== null && r6 !== null && t5 > r6 ? this._internals.setValidity({ rangeOverflow: true }, `Time must be at or before ${this.max}.`) : this._internals.setValidity({});
      } else
        this._internals.setValidity({});
  }
  render() {
    return b2`
      <div class="field">
        <input
          part="input"
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this._open ? "true" : "false"}
          aria-required=${this.required ? "true" : A}
          aria-invalid=${this.invalid ? "true" : A}
          aria-disabled=${this.disabled ? "true" : A}
          ?disabled=${this.disabled}
          placeholder=${this.format === 12 ? "h:mm AM" : "HH:MM"}
          .value=${ia(this.value, this.format)}
          @input=${this._onInput}
          @blur=${this._onBlur}
          @keydown=${this._onKeyDown}
          @focus=${this._onFocus}
        />
        <button
          class="toggle"
          type="button"
          tabindex="-1"
          aria-label="Open time list"
          @click=${this._onToggleClick}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.4" />
            <path d="M8 4 L8 8 L11 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    `;
  }
  // -- Options ---------------------------------------------------------
  _generateOptions() {
    const e8 = Math.max(1, Number(this.step) || 15), t5 = J(this.min) ?? 0, a4 = J(this.max) ?? 24 * 60 - 1, r6 = [];
    for (let i7 = t5; i7 <= a4; i7 += e8)
      r6.push(oa(i7));
    return r6;
  }
  // -- Popup -----------------------------------------------------------
  _mountPopup() {
    if (this._popupEl) return;
    const e8 = document.createElement("div");
    e8.id = this._popupId, e8.setAttribute("role", "listbox"), e8.setAttribute("part", "popup"), Object.assign(e8.style, {
      position: "absolute",
      zIndex: "var(--ae-z-popover, 1400)",
      background: "var(--ae-time-picker-popup-bg, var(--ae-color-bg-elevated))",
      backdropFilter: "var(--ae-time-picker-popup-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      WebkitBackdropFilter: "var(--ae-time-picker-popup-backdrop-filter, var(--ae-surface-backdrop-filter, none))",
      color: "var(--ae-color-fg)",
      border: "var(--ae-time-picker-popup-border, 1px solid var(--ae-color-border))",
      borderRadius: "var(--ae-time-picker-popup-radius, var(--ae-radius-md))",
      boxShadow: "var(--ae-shadow-lg)",
      padding: "var(--ae-space-1)",
      minWidth: "10rem",
      maxHeight: "14rem",
      overflowY: "auto",
      fontFamily: "var(--ae-font-family-sans)",
      fontSize: "var(--ae-font-size-sm)"
    }), e8.addEventListener("click", this._onPopupClick), document.body.appendChild(e8), this._popupEl = e8;
  }
  _unmountPopup() {
    this._popupEl && (this._popupEl.removeEventListener("click", this._onPopupClick), this._popupEl.remove(), this._popupEl = null);
  }
  _positionPopup() {
    if (!this._popupEl) return;
    const e8 = this.getBoundingClientRect();
    this._popupEl.style.top = `${window.scrollY + e8.bottom + 4}px`, this._popupEl.style.left = `${window.scrollX + e8.left}px`, this._popupEl.style.minWidth = `${e8.width}px`;
  }
  _renderPopup() {
    if (!this._popupEl) return;
    const e8 = this._generateOptions(), t5 = J(this.value);
    if (this._activeIdx < 0 || this._activeIdx >= e8.length) {
      const a4 = e8.findIndex((r6) => J(r6) === t5);
      this._activeIdx = a4 >= 0 ? a4 : 0;
    }
    this._popupEl.innerHTML = e8.map((a4, r6) => {
      const i7 = J(a4) === t5, o9 = [
        "all:unset",
        "display:block",
        "cursor:pointer",
        "padding:var(--ae-space-2) var(--ae-space-3)",
        "border-radius:var(--ae-radius-sm)",
        "user-select:none",
        r6 === this._activeIdx ? "background:var(--ae-color-bg-muted)" : "",
        i7 ? "color:var(--ae-color-accent-emphasis); font-weight:var(--ae-font-weight-medium); background:var(--ae-color-accent-subtle);" : ""
      ].join(";");
      return `<button type="button" role="option" part="option" id="${this._popupId}-opt-${r6}" data-idx="${r6}" data-value="${a4}" aria-selected="${i7}" style="${o9}">${ia(a4, this.format)}</button>`;
    }).join(""), this._syncActiveDescendant();
  }
  /**
   * Associate the shadow-DOM combobox input with the body-portaled listbox
   * (`aria-controls`) and the currently-highlighted option
   * (`aria-activedescendant`). Both relationships cross the shadow boundary
   * — the popup lives in `document.body` — so they are expressed through AOM
   * element references rather than the string-id attributes a shadow root
   * cannot resolve. Cleared when the popup is closed.
   */
  _syncActiveDescendant() {
    const e8 = this._input;
    if (e8)
      if (this._open && this._popupEl) {
        Ie(e8, [this._popupEl]);
        const t5 = this._popupEl.querySelector(
          `[data-idx="${this._activeIdx}"]`
        );
        kt(e8, t5);
      } else
        Ie(e8, []), kt(e8, null);
  }
  _scrollActiveIntoView() {
    if (!this._popupEl) return;
    const e8 = this._popupEl.querySelector(`[data-idx="${this._activeIdx}"]`);
    if (!e8) return;
    const t5 = e8.getBoundingClientRect(), a4 = this._popupEl.getBoundingClientRect();
    (t5.top < a4.top || t5.bottom > a4.bottom) && e8.scrollIntoView({ block: "nearest" });
  }
  _addDocListeners() {
    this._docListenersBound || (window.addEventListener("scroll", this._onScrollOrResize, true), window.addEventListener("resize", this._onScrollOrResize), document.addEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = true);
  }
  _removeDocListeners() {
    this._docListenersBound && (window.removeEventListener("scroll", this._onScrollOrResize, true), window.removeEventListener("resize", this._onScrollOrResize), document.removeEventListener("pointerdown", this._onDocPointerDown, true), this._docListenersBound = false);
  }
  _moveActive(e8) {
    const t5 = this._generateOptions();
    if (t5.length === 0) return;
    const a4 = (this._activeIdx + e8 + t5.length) % t5.length;
    this._activeIdx = a4 < 0 ? 0 : a4;
  }
  _commit(e8) {
    this.value = e8, this._input.value = ia(e8, this.format), this._open = false, this.dispatchEvent(
      new CustomEvent("ae-change", { bubbles: true, composed: true, detail: { value: e8 } })
    ), this._input.focus();
  }
  focus(e8) {
    var t5;
    (t5 = this._input) == null || t5.focus(e8);
  }
  blur() {
    var e8;
    (e8 = this._input) == null || e8.blur();
  }
  async open() {
    this.disabled || (this._open = true, await this.updateComplete);
  }
  async close() {
    this._open = false, await this.updateComplete;
  }
  get isOpen() {
    return this._open;
  }
  get validity() {
    return this._internals.validity;
  }
  get validationMessage() {
    return this._internals.validationMessage;
  }
};
P2.formAssociated = true;
P2.styles = i`
    /*
     * Theme-overridable tokens (--ae-time-picker-bg, -border, -radius,
     * -toggle-bg, -toggle-border, -popup-bg, -popup-border, -popup-radius)
     * are NOT declared at :host — :host declarations would shadow
     * inherited theme overrides. Locked down by
     * src/theme-integration.test.ts.
     */
    :host {
      display: inline-flex;
      vertical-align: middle;
      position: relative;
      min-width: 10rem;
    }

    .field {
      display: inline-flex;
      align-items: stretch;
      width: 100%;
      background: var(--ae-time-picker-bg, var(--ae-color-bg));
      backdrop-filter: var(--ae-time-picker-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-time-picker-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-border-width-1) solid
        var(--ae-time-picker-border, var(--ae-color-border-strong));
      border-radius: var(--ae-time-picker-radius, var(--ae-radius-default));
    }
    .field:has(input:focus-visible) {
      ${y3}
      border-color: var(--ae-color-accent);
    }
    :host([disabled]) .field {
      opacity: var(--ae-opacity-disabled, 0.55);
      cursor: not-allowed;
    }

    :host([invalid]) .field,
    :host([invalid]) .field:has(input:focus-visible) {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .field:has(input:focus-visible) {
      ${ie}
    }

    input {
      all: unset;
      flex: 1 1 auto;
      box-sizing: border-box;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg);
      padding: var(--ae-space-2) var(--ae-space-3);
      min-height: 2.25rem;
    }
    input::placeholder {
      color: var(--ae-color-fg-subtle);
    }

    .toggle {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 var(--ae-space-2);
      color: var(--ae-color-fg-muted);
      background: var(--ae-time-picker-toggle-bg, transparent);
      border-left: var(--ae-time-picker-toggle-border, 0 solid transparent);
      flex-shrink: 0;
    }
    .toggle:focus-visible {
      ${y3}
    }

    ${Yt}
  `;
H2([
  n4({ type: String, reflect: true })
], P2.prototype, "value", 2);
H2([
  n4({ type: Number, reflect: true })
], P2.prototype, "step", 2);
H2([
  n4({ type: String, reflect: true })
], P2.prototype, "min", 2);
H2([
  n4({ type: String, reflect: true })
], P2.prototype, "max", 2);
H2([
  n4({ type: Number, reflect: true })
], P2.prototype, "format", 2);
H2([
  n4({ type: Boolean, reflect: true })
], P2.prototype, "disabled", 2);
H2([
  n4({ type: Boolean, reflect: true })
], P2.prototype, "required", 2);
H2([
  n4({ type: Boolean, reflect: true })
], P2.prototype, "invalid", 2);
H2([
  n4({ type: String, reflect: true })
], P2.prototype, "name", 2);
H2([
  r5()
], P2.prototype, "_open", 2);
H2([
  r5()
], P2.prototype, "_activeIdx", 2);
H2([
  e5("input")
], P2.prototype, "_input", 2);
P2 = H2([
  t3("ae-time-picker")
], P2);
function J(e8) {
  if (!e8) return null;
  const t5 = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(e8);
  if (!t5) return null;
  const a4 = Number(t5[1]), r6 = Number(t5[2]);
  return a4 < 0 || a4 > 23 || r6 < 0 || r6 > 59 ? null : a4 * 60 + r6;
}
function oa(e8) {
  const t5 = Math.floor(e8 / 60), a4 = e8 % 60;
  return `${t5.toString().padStart(2, "0")}:${a4.toString().padStart(2, "0")}`;
}
function ia(e8, t5) {
  if (!e8) return "";
  const a4 = J(e8);
  if (a4 === null) return e8;
  const r6 = Math.floor(a4 / 60), i7 = a4 % 60;
  if (t5 === 24) return oa(a4);
  const s4 = r6 < 12 ? "AM" : "PM";
  let o9 = r6 % 12;
  return o9 === 0 && (o9 = 12), `${o9}:${i7.toString().padStart(2, "0")} ${s4}`;
}
function gi(e8) {
  if (!e8) return null;
  const t5 = J(e8);
  if (t5 !== null) return oa(t5);
  const a4 = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/.exec(e8.trim());
  if (a4) {
    let r6 = Number(a4[1]);
    const i7 = Number(a4[2]), s4 = a4[3].toUpperCase();
    return r6 < 1 || r6 > 12 || i7 < 0 || i7 > 59 ? null : (s4 === "AM" ? r6 === 12 && (r6 = 0) : r6 !== 12 && (r6 += 12), oa(r6 * 60 + i7));
  }
  return null;
}
var mi = Object.defineProperty;
var _i = Object.getOwnPropertyDescriptor;
var G = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? _i(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && mi(t5, a4, i7), i7;
};
var L2 = class extends i4 {
  constructor() {
    super(), this.accept = "", this.multiple = false, this.disabled = false, this.required = false, this.invalid = false, this.name = "", this.capture = "", this.label = "Choose file\u2026", this._files = [], this._dragOver = false, this._onTriggerClick = () => {
      var e8;
      this.disabled || (e8 = this._input) == null || e8.click();
    }, this._onFileChange = (e8) => {
      const t5 = e8.target, a4 = Array.from(t5.files ?? []);
      this._setFiles(a4);
    }, this._onDragOver = (e8) => {
      this.disabled || e8.dataTransfer && (e8.preventDefault(), e8.dataTransfer.dropEffect = "copy", this._dragOver || (this._dragOver = true, this.setAttribute("data-dragging", "")));
    }, this._onDragLeave = (e8) => {
      if (this.disabled) return;
      e8.preventDefault();
      const t5 = e8.relatedTarget;
      t5 && e8.currentTarget.contains(t5) || (this._dragOver = false, this.removeAttribute("data-dragging"));
    }, this._onDrop = (e8) => {
      var r6;
      if (this.disabled) return;
      e8.preventDefault(), this._dragOver = false, this.removeAttribute("data-dragging");
      const t5 = Array.from(((r6 = e8.dataTransfer) == null ? void 0 : r6.files) ?? []);
      if (t5.length === 0) return;
      const a4 = this.multiple ? t5 : t5.slice(0, 1);
      this._setFiles(a4);
    }, this._internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback(), this._syncFormValue();
  }
  updated(e8) {
    e8.has("_files") && this._syncFormValue();
  }
  _syncFormValue() {
    var t5;
    if (typeof ((t5 = this._internals) == null ? void 0 : t5.setFormValue) != "function") return;
    if (this._files.length === 0) {
      this._internals.setFormValue(null), this.required ? this._internals.setValidity({ valueMissing: true }, "Please choose a file.") : this._internals.setValidity({});
      return;
    }
    const e8 = new FormData();
    for (const a4 of this._files)
      e8.append(this.name || "file", a4, a4.name);
    this._internals.setFormValue(e8), this._internals.setValidity({});
  }
  /** Public read-only access to the current selection. */
  get files() {
    return this._files;
  }
  render() {
    return b2`
      <div
        class="dropzone"
        part="dropzone"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        <span class="start-row">
          <slot name="start"></slot>
          <span class="label">
            <span class="label-emphasis">${this.label}</span> or drag and drop
          </span>
        </span>
        <button
          class="trigger"
          part="trigger"
          type="button"
          aria-disabled=${this.disabled ? "true" : A}
          aria-invalid=${this.invalid ? "true" : A}
          ?disabled=${this.disabled}
          @click=${this._onTriggerClick}
        >
          Browse files
        </button>
        <input
          type="file"
          tabindex="-1"
          aria-hidden="true"
          accept=${this.accept || A}
          ?multiple=${this.multiple}
          ?required=${this.required}
          ?disabled=${this.disabled}
          capture=${this.capture || A}
          @change=${this._onFileChange}
        />
      </div>
      ${this._files.length > 0 ? b2`<ul class="file-list">
            ${this._files.map(
      (e8, t5) => b2`<li class="file-row" part="file">
                <span class="file-name" title=${e8.name}>${e8.name}</span>
                <span class="file-size">${yi(e8.size)}</span>
                <button
                  class="remove"
                  type="button"
                  aria-label=${`Remove ${e8.name}`}
                  ?disabled=${this.disabled}
                  @click=${() => this._removeFile(t5)}
                >
                  <svg viewBox="0 0 12 12" aria-hidden="true" width="12" height="12">
                    <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </button>
              </li>`
    )}
          </ul>` : A}
    `;
  }
  _removeFile(e8) {
    const t5 = this._files.slice();
    t5.splice(e8, 1), this._setFiles(t5), this._input && (this._input.value = "");
  }
  _setFiles(e8) {
    this._files = e8, this.dispatchEvent(
      new CustomEvent("ae-change", {
        bubbles: true,
        composed: true,
        detail: { files: e8.slice() }
      })
    );
  }
  focus(e8) {
    var a4;
    const t5 = (a4 = this.shadowRoot) == null ? void 0 : a4.querySelector(".trigger");
    t5 == null || t5.focus(e8);
  }
  /** Form-associated validity. */
  get validity() {
    return this._internals.validity;
  }
  /** Validation message. */
  get validationMessage() {
    return this._internals.validationMessage;
  }
};
L2.formAssociated = true;
L2.styles = i`
    /* Surface defaults live in the var() fallbacks (not declared at :host) so a
     * brand can recolor the drop zone at :root without being shadowed. Metro
     * turns it into the source FileDrop: a 3px dashed ink frame on paper-2 with
     * a ticket-styled (ink-framed, uppercase mono) browse trigger. */
    :host {
      display: block;
      font-family: var(--ae-font-family-sans);
    }

    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ae-space-2);
      background: var(--ae-file-input-bg, var(--ae-color-bg));
      backdrop-filter: var(--ae-file-input-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-file-input-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-file-input-border-width, var(--ae-border-width-1)) dashed
        var(--ae-file-input-border, var(--ae-color-border-strong));
      border-radius: var(--ae-file-input-radius, var(--ae-radius-default));
      padding: var(--ae-file-input-padding, var(--ae-space-4));
      text-align: center;
      transition:
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    :host([data-dragging]) .dropzone {
      border-color: var(--ae-file-input-border-active, var(--ae-color-accent));
      background: var(--ae-color-accent-subtle);
    }
    :host([disabled]) .dropzone {
      opacity: var(--ae-opacity-disabled, 0.55);
      cursor: not-allowed;
    }

    /* Invalid: recolor the (dashed) drop-zone border to danger so the
     * error reads even before the trigger is focused. */
    :host([invalid]) .dropzone {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .trigger {
      border-color: var(--ae-color-danger);
    }
    :host([invalid]) .trigger:focus-visible {
      ${ie}
    }

    .start-row {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-2);
    }
    .start-row ::slotted(*) {
      color: var(--ae-color-fg-muted);
    }

    .label {
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg-muted);
    }
    .label-emphasis {
      color: var(--ae-color-accent-emphasis);
      font-weight: var(--ae-font-weight-medium);
    }

    .trigger {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-2);
      padding: var(--ae-space-2) var(--ae-space-3);
      border: var(--ae-border-width-1) solid
        var(--ae-file-input-trigger-border, var(--ae-color-border-strong));
      border-radius: var(--ae-file-input-trigger-radius, var(--ae-radius-default));
      font-size: var(--ae-font-size-sm);
      font-weight: var(--ae-file-input-trigger-weight, inherit);
      letter-spacing: var(--ae-file-input-trigger-tracking, normal);
      text-transform: var(--ae-file-input-trigger-transform, none);
      color: var(--ae-color-fg);
      background: var(--ae-file-input-trigger-bg, var(--ae-color-bg));
    }
    .trigger:hover:not(:disabled) {
      background: var(--ae-color-bg-subtle);
    }
    .trigger:focus-visible {
      ${y3}
    }
    .trigger:disabled {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }

    input[type='file'] {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .file-list {
      list-style: none;
      margin: var(--ae-space-3) 0 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--ae-space-2);
      width: 100%;
    }

    .file-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ae-space-2);
      padding: var(--ae-space-2) var(--ae-space-3);
      background: var(--ae-color-bg-subtle);
      border-radius: var(--ae-radius-sm);
      font-size: var(--ae-font-size-sm);
    }
    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1 1 auto;
      min-width: 0;
    }
    .file-size {
      flex: none;
      color: var(--ae-color-fg-subtle);
      font-size: var(--ae-font-size-xs);
      font-variant-numeric: tabular-nums;
    }
    .remove {
      all: unset;
      cursor: pointer;
      color: var(--ae-color-fg-muted);
      padding: var(--ae-space-1);
      border-radius: var(--ae-radius-sm);
      display: inline-flex;
    }
    .remove:hover {
      color: var(--ae-color-danger-emphasis);
    }
    .remove:focus-visible {
      ${y3}
    }
  `;
G([
  n4({ type: String, reflect: true })
], L2.prototype, "accept", 2);
G([
  n4({ type: Boolean, reflect: true })
], L2.prototype, "multiple", 2);
G([
  n4({ type: Boolean, reflect: true })
], L2.prototype, "disabled", 2);
G([
  n4({ type: Boolean, reflect: true })
], L2.prototype, "required", 2);
G([
  n4({ type: Boolean, reflect: true })
], L2.prototype, "invalid", 2);
G([
  n4({ type: String, reflect: true })
], L2.prototype, "name", 2);
G([
  n4({ type: String, reflect: true })
], L2.prototype, "capture", 2);
G([
  n4({ type: String, reflect: true })
], L2.prototype, "label", 2);
G([
  r5()
], L2.prototype, "_files", 2);
G([
  r5()
], L2.prototype, "_dragOver", 2);
G([
  e5('input[type="file"]')
], L2.prototype, "_input", 2);
L2 = G([
  t3("ae-file-input")
], L2);
function yi(e8) {
  return e8 < 1024 ? `${e8} B` : e8 < 1024 * 1024 ? `${(e8 / 1024).toFixed(1)} KB` : e8 < 1024 * 1024 * 1024 ? `${(e8 / 1024 / 1024).toFixed(1)} MB` : `${(e8 / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
var wi = Object.defineProperty;
var xi = Object.getOwnPropertyDescriptor;
var ze = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? xi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && wi(t5, a4, i7), i7;
};
var q = class extends i4 {
  constructor() {
    super(...arguments), this.open = false, this.placement = "bottom", this.offset = 8, this.flip = true, this.closeOnClickOutside = true, this.closeOnEscape = true, this.anchor = "", this._resolvedPlacement = "bottom", this._panelEl = null, this._movedChildren = [], this._placeholder = null, this._scrollAncestors = [], this._rafId = 0, this._previouslyFocused = null, this._scheduleReposition = () => {
      this.open && (this._rafId && cancelAnimationFrame(this._rafId), this._rafId = requestAnimationFrame(() => {
        this._rafId = 0, this._position();
      }));
    }, this._onKeyDown = (e8) => {
      this.open && e8.key === "Escape" && this.closeOnEscape && (e8.stopPropagation(), this.open = false);
    }, this._onPointerDown = (e8) => {
      if (!this.open || !this.closeOnClickOutside) return;
      const t5 = this._panelEl, a4 = this._resolveAnchor(), r6 = e8.target, i7 = typeof e8.composedPath == "function" ? e8.composedPath() : [];
      Na(t5, r6, i7) || Na(a4, r6, i7) || (this.open = false);
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("resize", this._scheduleReposition, { passive: true }), document.addEventListener("keydown", this._onKeyDown), document.addEventListener("pointerdown", this._onPointerDown, true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("resize", this._scheduleReposition), document.removeEventListener("keydown", this._onKeyDown), document.removeEventListener("pointerdown", this._onPointerDown, true), this._releaseScrollAncestors(), this._rafId && cancelAnimationFrame(this._rafId), this._teardownPanel();
  }
  updated(e8) {
    var t5;
    if (e8.has("open")) {
      const a4 = this._resolveAnchor();
      if (this.open)
        this._previouslyFocused = document.activeElement ?? null, this._mountPanel(), this._attachScrollAncestors(), this._scheduleReposition(), a4 == null || a4.setAttribute("aria-haspopup", "dialog"), a4 == null || a4.setAttribute("aria-expanded", "true"), requestAnimationFrame(() => {
          if (!this.open || !this._panelEl) return;
          (this._panelEl.querySelector(q.FOCUSABLE) ?? this._panelEl).focus();
        }), this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true }));
      else {
        this._unmountPanel(), this._releaseScrollAncestors(), a4 == null || a4.setAttribute("aria-expanded", "false");
        const r6 = this._previouslyFocused;
        this._previouslyFocused = null, (t5 = r6 == null ? void 0 : r6.focus) == null || t5.call(r6), this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true }));
      }
    } else this.open && (e8.has("placement") || e8.has("offset") || e8.has("flip") || e8.has("anchor")) && this._scheduleReposition();
  }
  /** Returns the body-portal panel element for tests / consumers. */
  getPanel() {
    return this._panelEl;
  }
  _mountPanel() {
    if (this._panelEl) return;
    const e8 = document.createElement("div");
    e8.setAttribute("part", "panel"), e8.classList.add("ae-popover-panel"), e8.setAttribute("role", "dialog"), e8.tabIndex = -1;
    const t5 = this.getAttribute("aria-label"), a4 = this.getAttribute("aria-labelledby");
    t5 && e8.setAttribute("aria-label", t5), a4 && e8.setAttribute("aria-labelledby", a4), e8.dataset.placement = this._resolvedPlacement, e8.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: var(--ae-z-popover, 1400);
      min-width: var(--ae-popover-min-width, 12rem);
      max-width: min(calc(100vw - 16px), 24rem);
      background: var(--ae-popover-bg, var(--ae-color-bg-elevated));
      color: var(--ae-popover-fg, var(--ae-color-fg));
      border: var(--ae-popover-border-width, var(--ae-border-width-1, 1px)) solid var(--ae-popover-border, var(--ae-color-border));
      border-radius: var(--ae-popover-radius, var(--ae-radius-md));
      box-shadow: var(--ae-popover-shadow, var(--ae-shadow-md));
      backdrop-filter: var(--ae-popover-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-popover-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      padding: var(--ae-popover-padding, var(--ae-space-3));
      box-sizing: border-box;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-default);
      line-height: var(--ae-line-height-default);
      pointer-events: auto;
    `, this._placeholder = document.createComment("ae-popover-children"), this.appendChild(this._placeholder), this._movedChildren = [];
    const r6 = Array.from(this.childNodes);
    for (const i7 of r6)
      i7 !== this._placeholder && (this._movedChildren.push(i7), e8.appendChild(i7));
    document.body.appendChild(e8), this._panelEl = e8;
  }
  _unmountPanel() {
    if (this._panelEl) {
      if (this._placeholder && this._placeholder.parentNode === this) {
        for (const e8 of this._movedChildren)
          this.insertBefore(e8, this._placeholder);
        this._placeholder.remove();
      }
      this._movedChildren = [], this._placeholder = null, this._panelEl.remove(), this._panelEl = null;
    }
  }
  _teardownPanel() {
    this._panelEl && (this._panelEl.remove(), this._panelEl = null), this._movedChildren = [], this._placeholder = null;
  }
  _resolveAnchor() {
    var e8;
    if (this.anchor instanceof HTMLElement) return this.anchor;
    if (typeof this.anchor == "string" && this.anchor) {
      const t5 = this.getRootNode(), a4 = ((e8 = t5.querySelector) == null ? void 0 : e8.call(t5, this.anchor)) ?? document.querySelector(this.anchor);
      return a4 instanceof HTMLElement ? a4 : null;
    }
    return this.previousElementSibling instanceof HTMLElement ? this.previousElementSibling : null;
  }
  _position() {
    const e8 = this._resolveAnchor(), t5 = this._panelEl;
    if (!e8 || !t5) return;
    const a4 = e8.getBoundingClientRect(), r6 = t5.getBoundingClientRect(), i7 = window.innerWidth || document.documentElement.clientWidth || 0, s4 = window.innerHeight || document.documentElement.clientHeight || 0, o9 = this.offset, h3 = (g2) => {
      let m2 = 0, w2 = 0;
      const [se, A2 = "center"] = g2.split("-");
      switch (se) {
        case "top":
          w2 = a4.top - r6.height - o9, m2 = a4.left + a4.width / 2 - r6.width / 2, A2 === "start" && (m2 = a4.left), A2 === "end" && (m2 = a4.right - r6.width);
          break;
        case "bottom":
          w2 = a4.bottom + o9, m2 = a4.left + a4.width / 2 - r6.width / 2, A2 === "start" && (m2 = a4.left), A2 === "end" && (m2 = a4.right - r6.width);
          break;
        case "left":
          m2 = a4.left - r6.width - o9, w2 = a4.top + a4.height / 2 - r6.height / 2, A2 === "start" && (w2 = a4.top), A2 === "end" && (w2 = a4.bottom - r6.height);
          break;
        case "right":
          m2 = a4.right + o9, w2 = a4.top + a4.height / 2 - r6.height / 2, A2 === "start" && (w2 = a4.top), A2 === "end" && (w2 = a4.bottom - r6.height);
          break;
      }
      return { x: m2, y: w2 };
    }, d3 = (g2, m2) => {
      const w2 = g2.split("-")[0];
      return w2 === "top" ? m2.y < 0 : w2 === "bottom" ? m2.y + r6.height > s4 : w2 === "left" ? m2.x < 0 : w2 === "right" ? m2.x + r6.width > i7 : false;
    };
    let p3 = this.placement, b3 = h3(p3);
    if (this.flip && d3(p3, b3)) {
      const g2 = this._flipPlacement(p3), m2 = h3(g2);
      d3(g2, m2) || (p3 = g2, b3 = m2);
    }
    b3.x = Math.max(4, Math.min(b3.x, Math.max(4, i7 - r6.width - 4))), b3.y = Math.max(4, Math.min(b3.y, Math.max(4, s4 - r6.height - 4))), this._resolvedPlacement = p3, t5.style.transform = `translate(${b3.x}px, ${b3.y}px)`, t5.dataset.placement = p3;
  }
  _flipPlacement(e8) {
    const [t5, a4] = e8.split("-"), i7 = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[t5] ?? t5;
    return a4 ? `${i7}-${a4}` : i7;
  }
  _attachScrollAncestors() {
    this._releaseScrollAncestors();
    const e8 = this._resolveAnchor();
    if (!e8) return;
    let t5 = e8.parentElement;
    for (; t5 && t5 !== document.body; ) {
      const a4 = getComputedStyle(t5);
      /(auto|scroll|overlay)/.test(a4.overflow + a4.overflowX + a4.overflowY) && (t5.addEventListener("scroll", this._scheduleReposition, { passive: true }), this._scrollAncestors.push(t5)), t5 = t5.parentElement;
    }
    window.addEventListener("scroll", this._scheduleReposition, { passive: true });
  }
  _releaseScrollAncestors() {
    for (const e8 of this._scrollAncestors)
      e8.removeEventListener("scroll", this._scheduleReposition);
    this._scrollAncestors = [], window.removeEventListener("scroll", this._scheduleReposition);
  }
  render() {
    return b2``;
  }
};
q.FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
q.styles = i`
    :host {
      display: contents;
    }
  `;
ze([
  n4({ type: Boolean, reflect: true })
], q.prototype, "open", 2);
ze([
  n4({ type: String, reflect: true })
], q.prototype, "placement", 2);
ze([
  n4({ type: Number, reflect: true })
], q.prototype, "offset", 2);
ze([
  n4({ type: Boolean, reflect: true })
], q.prototype, "flip", 2);
ze([
  n4({ type: Boolean, reflect: true, attribute: "close-on-click-outside" })
], q.prototype, "closeOnClickOutside", 2);
ze([
  n4({ type: Boolean, reflect: true, attribute: "close-on-escape" })
], q.prototype, "closeOnEscape", 2);
ze([
  n4()
], q.prototype, "anchor", 2);
ze([
  r5()
], q.prototype, "_resolvedPlacement", 2);
q = ze([
  t3("ae-popover")
], q);
function Na(e8, t5, a4) {
  if (!e8) return false;
  if (t5 === e8 || a4.includes(e8) || t5 && typeof e8.contains == "function" && e8.contains(t5)) return true;
  let r6 = t5;
  for (; r6; ) {
    if (r6 === e8) return true;
    r6 = r6.parentNode;
  }
  return false;
}
var ki = Object.defineProperty;
var $i = Object.getOwnPropertyDescriptor;
var ht = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? $i(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ki(t5, a4, i7), i7;
};
var Si = 0;
var ye = class extends i4 {
  constructor() {
    super(...arguments), this.for = "", this.target = null, this.placement = "top", this.delay = 200, this.disabled = false, this._open = false, this._tipEl = null, this._anchorEl = null, this._showTimer = null, this._hideTimer = null, this._tooltipId = `ae-tooltip-${++Si}`, this._rafId = 0, this._scrollAncestors = [], this._onMouseEnter = () => {
      this.disabled || (this._cancelHide(), this._scheduleShow());
    }, this._onMouseLeave = () => {
      this._cancelShow(), this._scheduleHide();
    }, this._onTipEnter = () => {
      this._cancelHide();
    }, this._onTipLeave = () => {
      this._hide();
    }, this._onFocusIn = () => {
      this.disabled || this._show();
    }, this._onFocusOut = () => {
      this._cancelShow(), this._hide();
    }, this._onKeyDown = (e8) => {
      this._open && e8.key === "Escape" && this._hide();
    }, this._scheduleReposition = () => {
      this._open && (this._rafId && cancelAnimationFrame(this._rafId), this._rafId = requestAnimationFrame(() => {
        this._rafId = 0, this._position();
      }));
    };
  }
  connectedCallback() {
    super.connectedCallback(), queueMicrotask(() => this._wireAnchor()), window.addEventListener("resize", this._scheduleReposition, { passive: true }), document.addEventListener("keydown", this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unwireAnchor(), window.removeEventListener("resize", this._scheduleReposition), document.removeEventListener("keydown", this._onKeyDown), this._showTimer && clearTimeout(this._showTimer), this._hideTimer && clearTimeout(this._hideTimer), this._rafId && cancelAnimationFrame(this._rafId), this._releaseScrollAncestors(), this._hide();
  }
  updated(e8) {
    (e8.has("for") || e8.has("target")) && (this._unwireAnchor(), this._wireAnchor());
  }
  _resolveAnchor() {
    var e8;
    if (this.target instanceof HTMLElement) return this.target;
    if (this.for) {
      const t5 = this.getRootNode(), a4 = ((e8 = t5.getElementById) == null ? void 0 : e8.call(t5, this.for)) ?? document.getElementById(this.for);
      return a4 instanceof HTMLElement ? a4 : null;
    }
    return this.previousElementSibling instanceof HTMLElement ? this.previousElementSibling : null;
  }
  _wireAnchor() {
    const e8 = this._resolveAnchor();
    if (!e8) return;
    this._anchorEl = e8;
    const a4 = (e8.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
    a4.includes(this._tooltipId) || (a4.push(this._tooltipId), e8.setAttribute("aria-describedby", a4.join(" "))), e8.addEventListener("mouseenter", this._onMouseEnter), e8.addEventListener("mouseleave", this._onMouseLeave), e8.addEventListener("focusin", this._onFocusIn), e8.addEventListener("focusout", this._onFocusOut);
  }
  _unwireAnchor() {
    if (!this._anchorEl) return;
    const t5 = (this._anchorEl.getAttribute("aria-describedby") ?? "").split(/\s+/).filter((a4) => a4 && a4 !== this._tooltipId);
    t5.length ? this._anchorEl.setAttribute("aria-describedby", t5.join(" ")) : this._anchorEl.removeAttribute("aria-describedby"), this._anchorEl.removeEventListener("mouseenter", this._onMouseEnter), this._anchorEl.removeEventListener("mouseleave", this._onMouseLeave), this._anchorEl.removeEventListener("focusin", this._onFocusIn), this._anchorEl.removeEventListener("focusout", this._onFocusOut), this._anchorEl = null;
  }
  _scheduleShow() {
    this._cancelShow(), this._showTimer = setTimeout(() => {
      this._showTimer = null, this._show();
    }, this.delay);
  }
  _cancelShow() {
    this._showTimer && (clearTimeout(this._showTimer), this._showTimer = null);
  }
  /** Grace period before hiding, so the pointer can reach the tip (1.4.13). */
  _scheduleHide() {
    this._cancelHide(), this._hideTimer = setTimeout(() => {
      this._hideTimer = null, this._hide();
    }, 150);
  }
  _cancelHide() {
    this._hideTimer && (clearTimeout(this._hideTimer), this._hideTimer = null);
  }
  _show() {
    this._cancelHide(), !(this.disabled || this._open) && (this._open = true, this._mountTip(), this._attachScrollAncestors(), this._scheduleReposition());
  }
  _hide() {
    this._open && (this._open = false, this._unmountTip(), this._releaseScrollAncestors());
  }
  _mountTip() {
    if (this._tipEl) return;
    const e8 = document.createElement("div");
    e8.id = this._tooltipId, e8.setAttribute("role", "tooltip"), e8.setAttribute("part", "tip"), e8.classList.add("ae-tooltip-tip"), e8.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: var(--ae-z-tooltip, 1500);
      background: var(--ae-tooltip-bg, var(--ae-color-bg-inverse));
      color: var(--ae-tooltip-fg, var(--ae-color-fg-inverse));
      font-family: var(--ae-tooltip-font-family, var(--ae-font-family-sans));
      font-size: var(--ae-tooltip-font-size, var(--ae-font-size-xs));
      font-weight: var(--ae-tooltip-font-weight, normal);
      letter-spacing: var(--ae-tooltip-tracking, normal);
      line-height: var(--ae-tooltip-line-height, var(--ae-line-height-snug));
      padding: var(--ae-tooltip-padding, 4px 8px);
      border-radius: var(--ae-tooltip-radius, var(--ae-radius-sm));
      box-shadow: var(--ae-tooltip-shadow, var(--ae-shadow-sm));
      backdrop-filter: var(--ae-tooltip-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-tooltip-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      max-width: var(--ae-tooltip-max-width, 16rem);
      pointer-events: auto;
      box-sizing: border-box;
    `, e8.textContent = this.textContent ?? "", e8.addEventListener("mouseenter", this._onTipEnter), e8.addEventListener("mouseleave", this._onTipLeave), document.body.appendChild(e8), this._tipEl = e8;
  }
  _unmountTip() {
    this._tipEl && (this._tipEl.remove(), this._tipEl = null);
  }
  _position() {
    const e8 = this._anchorEl, t5 = this._tipEl;
    if (!e8 || !t5) return;
    const a4 = e8.getBoundingClientRect(), r6 = t5.getBoundingClientRect(), i7 = window.innerWidth || document.documentElement.clientWidth || 0, s4 = window.innerHeight || document.documentElement.clientHeight || 0, o9 = 8, [h3, d3 = "center"] = this.placement.split("-");
    let p3 = 0, b3 = 0;
    switch (h3) {
      case "top":
        b3 = a4.top - r6.height - o9, p3 = a4.left + a4.width / 2 - r6.width / 2, d3 === "start" && (p3 = a4.left), d3 === "end" && (p3 = a4.right - r6.width);
        break;
      case "bottom":
        b3 = a4.bottom + o9, p3 = a4.left + a4.width / 2 - r6.width / 2, d3 === "start" && (p3 = a4.left), d3 === "end" && (p3 = a4.right - r6.width);
        break;
      case "left":
        p3 = a4.left - r6.width - o9, b3 = a4.top + a4.height / 2 - r6.height / 2, d3 === "start" && (b3 = a4.top), d3 === "end" && (b3 = a4.bottom - r6.height);
        break;
      case "right":
        p3 = a4.right + o9, b3 = a4.top + a4.height / 2 - r6.height / 2, d3 === "start" && (b3 = a4.top), d3 === "end" && (b3 = a4.bottom - r6.height);
        break;
    }
    p3 = Math.max(4, Math.min(p3, Math.max(4, i7 - r6.width - 4))), b3 = Math.max(4, Math.min(b3, Math.max(4, s4 - r6.height - 4))), t5.style.transform = `translate(${p3}px, ${b3}px)`;
  }
  _attachScrollAncestors() {
    this._releaseScrollAncestors();
    const e8 = this._anchorEl;
    if (!e8) return;
    let t5 = e8.parentElement;
    for (; t5 && t5 !== document.body; ) {
      const a4 = getComputedStyle(t5);
      /(auto|scroll|overlay)/.test(a4.overflow + a4.overflowX + a4.overflowY) && (t5.addEventListener("scroll", this._scheduleReposition, { passive: true }), this._scrollAncestors.push(t5)), t5 = t5.parentElement;
    }
    window.addEventListener("scroll", this._scheduleReposition, { passive: true });
  }
  _releaseScrollAncestors() {
    for (const e8 of this._scrollAncestors)
      e8.removeEventListener("scroll", this._scheduleReposition);
    this._scrollAncestors = [], window.removeEventListener("scroll", this._scheduleReposition);
  }
  /** Returns the body-attached tip element for tests / consumers. */
  getTip() {
    return this._tipEl;
  }
  /** Force-show without delay. Useful for programmatic activation and tests. */
  show() {
    this._show();
  }
  /** Force-hide. */
  hide() {
    this._cancelShow(), this._hide();
  }
  render() {
    return b2``;
  }
};
ye.styles = i`
    :host {
      display: none;
    }
  `;
ht([
  n4({ type: String, reflect: true })
], ye.prototype, "for", 2);
ht([
  n4()
], ye.prototype, "target", 2);
ht([
  n4({ type: String, reflect: true })
], ye.prototype, "placement", 2);
ht([
  n4({ type: Number, reflect: true })
], ye.prototype, "delay", 2);
ht([
  n4({ type: Boolean, reflect: true })
], ye.prototype, "disabled", 2);
ht([
  r5()
], ye.prototype, "_open", 2);
ye = ht([
  t3("ae-tooltip")
], ye);
var Pa = class {
  constructor() {
    this._inerted = [], this._bodyOverflow = null, this._active = false;
  }
  /**
   * Inert all body-level siblings except the one that contains `live`, and
   * (unless `lockScroll` is false) lock body scroll.
   *
   * @param live       Any element inside the overlay subtree. Its
   *                   top-level ancestor under `<body>` is kept interactive.
   * @param lockScroll Whether to also set `overflow: hidden` on `<body>`.
   */
  activate(t5, a4 = true) {
    if (this._active) return;
    this._active = true;
    const r6 = t5 ? Ei(t5) : null;
    for (const i7 of Array.from(document.body.children))
      i7 !== r6 && i7 instanceof HTMLElement && !i7.inert && (i7.inert = true, this._inerted.push(i7));
    a4 && (this._bodyOverflow = document.body.style.overflow, document.body.style.overflow = "hidden");
  }
  /** Restore the inert flags this controller set and unlock body scroll. */
  release() {
    if (this._active) {
      this._active = false;
      for (const t5 of this._inerted)
        t5.inert = false;
      this._inerted = [], this._bodyOverflow !== null && (document.body.style.overflow = this._bodyOverflow, this._bodyOverflow = null);
    }
  }
  /** Whether the background is currently inerted. */
  get active() {
    return this._active;
  }
};
function Ei(e8) {
  let t5 = e8;
  for (; t5.parentElement && t5.parentElement !== document.body; )
    t5 = t5.parentElement;
  return t5;
}
var Ci = Object.defineProperty;
var Ai = Object.getOwnPropertyDescriptor;
var We = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ai(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ci(t5, a4, i7), i7;
};
var zi = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"], ae-button:not([disabled])';
var le = class extends i4 {
  constructor() {
    super(...arguments), this.open = false, this.size = "md", this.closeOnClickOutside = false, this.closeOnEscape = true, this.labelledby = "", this.describedby = "", this._previouslyFocused = null, this._previousBodyOverflow = "", this._hasHeader = false, this._hasFooter = false, this._bgInert = new Pa(), this._onCancel = (e8) => {
      if (!this.closeOnEscape) {
        e8.preventDefault();
        return;
      }
      e8.preventDefault(), this.open = false, this.dispatchEvent(new CustomEvent("ae-close-cancel", { bubbles: true, composed: true }));
    }, this._onDialogClick = (e8) => {
      this.closeOnClickOutside && e8.target === this._dialog && (this.open = false, this.dispatchEvent(new CustomEvent("ae-close-cancel", { bubbles: true, composed: true })));
    }, this._onKeyDown = (e8) => {
      if (e8.key === "Tab") {
        const t5 = this._getFocusables();
        if (t5.length === 0) {
          e8.preventDefault();
          return;
        }
        const a4 = t5[0], r6 = t5[t5.length - 1], i7 = this.getRootNode().activeElement;
        e8.shiftKey && i7 === a4 ? (e8.preventDefault(), r6.focus()) : !e8.shiftKey && i7 === r6 && (e8.preventDefault(), a4.focus());
      }
    }, this._onSlotChange = (e8) => {
      const t5 = e8.target, a4 = t5.assignedNodes({ flatten: true }).length > 0;
      t5.name === "header" && (this._hasHeader = a4), t5.name === "footer" && (this._hasFooter = a4), this.requestUpdate();
    };
  }
  updated(e8) {
    e8.has("open") && (this.open ? this._openDialog() : this._closeDialog());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._bgInert.release(), this._restoreBodyScroll();
  }
  _openDialog() {
    if (!this._dialog) return;
    this._previouslyFocused = document.activeElement ?? null, this._lockBodyScroll();
    let e8 = false;
    if (typeof this._dialog.showModal == "function")
      try {
        this._dialog.showModal(), e8 = true;
      } catch {
        this._dialog.setAttribute("open", "");
      }
    else
      this._dialog.setAttribute("open", "");
    e8 || this._bgInert.activate(this, false), this.labelledby && this._dialog.setAttribute("aria-labelledby", this.labelledby), this.describedby && this._dialog.setAttribute("aria-describedby", this.describedby), queueMicrotask(() => this._focusFirst()), this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true }));
  }
  _closeDialog() {
    var e8, t5;
    if (this._dialog) {
      if (typeof this._dialog.close == "function")
        try {
          this._dialog.close();
        } catch {
          this._dialog.removeAttribute("open");
        }
      else
        this._dialog.removeAttribute("open");
      this._bgInert.release(), this._restoreBodyScroll(), (t5 = (e8 = this._previouslyFocused) == null ? void 0 : e8.focus) == null || t5.call(e8), this._previouslyFocused = null, this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true }));
    }
  }
  _lockBodyScroll() {
    this._previousBodyOverflow = document.body.style.overflow, document.body.style.overflow = "hidden";
  }
  _restoreBodyScroll() {
    this._previousBodyOverflow !== void 0 && (document.body.style.overflow = this._previousBodyOverflow);
  }
  _focusFirst() {
    const t5 = this._getFocusables()[0];
    t5 == null || t5.focus();
  }
  _getFocusables() {
    return this._dialog ? Array.from(this.querySelectorAll(zi)).filter((t5) => t5.offsetParent !== null || t5 === document.activeElement) : [];
  }
  render() {
    return b2`
      <dialog
        part="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby=${this.labelledby || A}
        aria-describedby=${this.describedby || A}
        @cancel=${this._onCancel}
        @click=${this._onDialogClick}
        @keydown=${this._onKeyDown}
      >
        <div class="inner">
          <div part="header" class="header" ?hidden=${!this._hasHeader}>
            <slot name="header" @slotchange=${this._onSlotChange}></slot>
          </div>
          <div part="body" class="body">
            <slot></slot>
          </div>
          <div part="footer" class="footer" ?hidden=${!this._hasFooter}>
            <slot name="footer" @slotchange=${this._onSlotChange}></slot>
          </div>
        </div>
      </dialog>
    `;
  }
};
le.styles = i`
    :host {
      display: contents;
    }

    dialog {
      padding: 0;
      /* Default to a transparent (effectively borderless) edge so existing
       * themes are unchanged, but make --ae-modal-border live so a brand can
       * give the panel a defined edge (v1's dialog panel has a 1px border). */
      border: var(--ae-modal-border-width, var(--ae-border-width-1)) solid var(--ae-modal-border, transparent);
      background: var(--ae-modal-bg, var(--ae-color-bg-elevated));
      color: var(--ae-modal-fg, var(--ae-color-fg));
      border-radius: var(--ae-modal-radius, var(--ae-radius-lg));
      box-shadow: var(--ae-modal-shadow, var(--ae-shadow-2xl));
      backdrop-filter: var(--ae-modal-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-modal-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      width: var(--ae-modal-width, 28rem);
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 32px);
      overflow: hidden;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-default);
      line-height: var(--ae-line-height-default);
      z-index: var(--ae-z-modal);
    }

    dialog::backdrop {
      background: var(--ae-modal-backdrop, var(--ae-color-bg-overlay));
      /*
       * Frost + desaturate the page BEHIND the scrim — the editorial
       * "DimmedPage" treatment. Distinct from --ae-modal-backdrop-filter,
       * which frosts the modal surface itself. Default none, so only an
       * opted-in theme (editorial) blurs the page behind the modal.
       */
      backdrop-filter: var(--ae-modal-backdrop-page-filter, none);
      -webkit-backdrop-filter: var(--ae-modal-backdrop-page-filter, none);
    }

    :host([size='sm']) { --ae-modal-width: 20rem; }
    :host([size='md']) { --ae-modal-width: 28rem; }
    :host([size='lg']) { --ae-modal-width: 36rem; }
    :host([size='xl']) { --ae-modal-width: 48rem; }
    :host([size='full']) {
      --ae-modal-width: 100vw;
    }
    :host([size='full']) dialog {
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
    }

    .inner {
      display: grid;
      grid-template-rows: auto 1fr auto;
      max-height: inherit;
    }

    .header,
    .body,
    .footer {
      padding: var(--ae-modal-padding, var(--ae-space-5));
    }
    .header {
      border-bottom: var(--ae-modal-divider-width, var(--ae-border-width-1)) solid
        var(--ae-modal-divider, var(--ae-color-border-subtle));
      font-family: var(--ae-modal-title-font-family, var(--ae-font-family-display));
      font-weight: var(--ae-modal-title-font-weight, var(--ae-font-weight-semibold));
      letter-spacing: var(--ae-modal-title-tracking, normal);
      font-size: var(--ae-modal-title-font-size, var(--ae-font-size-lg));
    }
    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      font-family: var(--ae-modal-title-font-family, var(--ae-font-family-display));
      /* A slotted heading carries the UA-default heading margin + size;
       * the .header region owns the title's sizing and padding, so the
       * heading must collapse its own box to sit flush. font: inherit
       * pulls the .header's font-size/weight onto the title. */
      margin: 0;
      font-size: inherit;
      font-weight: inherit;
      line-height: var(--ae-line-height-tight, 1.25);
    }
    .footer {
      border-top: var(--ae-modal-divider-width, var(--ae-border-width-1)) solid
        var(--ae-modal-divider, var(--ae-color-border-subtle));
      background: var(--ae-modal-footer-bg, var(--ae-color-bg-subtle));
      display: flex;
      gap: var(--ae-space-2);
      justify-content: flex-end;
    }
    .body {
      overflow: auto;
    }

    [hidden] {
      display: none !important;
    }
  `;
We([
  n4({ type: Boolean, reflect: true })
], le.prototype, "open", 2);
We([
  n4({ type: String, reflect: true })
], le.prototype, "size", 2);
We([
  n4({ type: Boolean, reflect: true, attribute: "close-on-click-outside" })
], le.prototype, "closeOnClickOutside", 2);
We([
  n4({ type: Boolean, reflect: true, attribute: "close-on-escape" })
], le.prototype, "closeOnEscape", 2);
We([
  n4({ type: String, reflect: true })
], le.prototype, "labelledby", 2);
We([
  n4({ type: String, reflect: true })
], le.prototype, "describedby", 2);
We([
  e5("dialog")
], le.prototype, "_dialog", 2);
le = We([
  t3("ae-modal")
], le);
var Di = Object.defineProperty;
var Pi = Object.getOwnPropertyDescriptor;
var Ge = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Pi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Di(t5, a4, i7), i7;
};
var Oi = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"], ae-button:not([disabled])';
var ce = class extends i4 {
  constructor() {
    super(...arguments), this.open = false, this.title = "", this.description = "", this.confirmLabel = "OK", this.cancelLabel = "Cancel", this.tone = "neutral", this.closeOnEscape = true, this._portalEl = null, this._slotMount = null, this._bodyChildren = [], this._bodyPlaceholder = null, this._previouslyFocused = null, this._bgInert = new Pa(), this._onConfirm = () => {
      this.dispatchEvent(new CustomEvent("ae-confirm", { bubbles: true, composed: true })), this.open = false;
    }, this._onCancel = () => {
      this.dispatchEvent(new CustomEvent("ae-cancel", { bubbles: true, composed: true })), this.open = false;
    }, this._onKeyDown = (e8) => {
      this.open && e8.key === "Escape" && this.closeOnEscape && (e8.stopPropagation(), this._onCancel());
    }, this._onTrapKey = (e8) => {
      if (e8.key !== "Tab") return;
      const t5 = this._getFocusables();
      if (t5.length === 0) {
        e8.preventDefault();
        return;
      }
      const a4 = t5[0], r6 = t5[t5.length - 1], i7 = document.activeElement;
      e8.shiftKey && i7 === a4 ? (e8.preventDefault(), r6.focus()) : !e8.shiftKey && i7 === r6 && (e8.preventDefault(), a4.focus());
    };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("keydown", this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this._onKeyDown), this._bgInert.release(), this._portalEl && this._teardownPortal();
  }
  updated(e8) {
    e8.has("open") ? this.open ? this._openDialog() : this._closeDialog() : this.open && this._renderInPortal();
  }
  _openDialog() {
    this._ensurePortal(), this._renderInPortal(), this._mountSlottedChildren(), this._previouslyFocused = document.activeElement ?? null, this._bgInert.activate(this._portalEl), queueMicrotask(() => this._focusFirst());
  }
  _closeDialog() {
    var e8, t5;
    this._unmountSlottedChildren(), this._bgInert.release(), this._teardownPortal(), (t5 = (e8 = this._previouslyFocused) == null ? void 0 : e8.focus) == null || t5.call(e8), this._previouslyFocused = null, this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true }));
  }
  _ensurePortal() {
    if (this._portalEl) return;
    const e8 = document.createElement("div");
    e8.dataset.aeDialogPortal = "", document.body.appendChild(e8), this._portalEl = e8;
  }
  _teardownPortal() {
    this._portalEl && (D(A, this._portalEl), this._portalEl.remove(), this._portalEl = null, this._slotMount = null);
  }
  _renderInPortal() {
    if (!this._portalEl) return;
    const e8 = this.title ? "ae-dialog-title" : void 0, t5 = "ae-dialog-body", a4 = this.tone === "danger" ? "danger" : "primary";
    D(
      b2`
        <style>
          .overlay {
            position: fixed;
            inset: 0;
            z-index: var(--ae-z-modal, 1300);
            display: grid;
            place-items: center;
            background: var(--ae-color-bg-overlay);
            padding: 16px;
            box-sizing: border-box;
          }
          .surface {
            background: var(--ae-dialog-bg, var(--ae-color-bg-elevated));
            color: var(--ae-color-fg);
            border: var(--ae-dialog-border-width, var(--ae-border-width-1)) solid var(--ae-dialog-border, transparent);
            border-radius: var(--ae-dialog-radius, var(--ae-radius-lg));
            box-shadow: var(--ae-dialog-shadow, var(--ae-shadow-2xl));
            backdrop-filter: var(--ae-dialog-backdrop-filter, var(--ae-surface-backdrop-filter, none));
            -webkit-backdrop-filter: var(--ae-dialog-backdrop-filter, var(--ae-surface-backdrop-filter, none));
            width: var(--ae-dialog-width, 24rem);
            max-width: 100%;
            max-height: calc(100vh - 32px);
            overflow: hidden;
            display: grid;
            grid-template-rows: auto 1fr auto;
            font-family: var(--ae-font-family-sans);
            font-size: var(--ae-font-size-default);
            line-height: var(--ae-line-height-default);
          }
          .title {
            padding: var(--ae-space-4) var(--ae-space-5) 0;
            font-family: var(--ae-dialog-title-font-family, var(--ae-font-family-display));
            font-weight: var(--ae-dialog-title-font-weight, var(--ae-font-weight-semibold));
            letter-spacing: var(--ae-dialog-title-tracking, normal);
            font-size: var(--ae-dialog-title-font-size, var(--ae-font-size-lg));
          }
          .body {
            padding: var(--ae-space-3) var(--ae-space-5) var(--ae-space-4);
            color: var(--ae-color-fg-muted);
            overflow: auto;
          }
          .footer {
            padding: var(--ae-space-3) var(--ae-space-4);
            display: flex;
            gap: var(--ae-space-2);
            justify-content: flex-end;
            background: var(--ae-dialog-footer-bg, var(--ae-color-bg-subtle));
            border-top: var(--ae-dialog-divider-width, var(--ae-border-width-1)) solid
              var(--ae-dialog-divider, var(--ae-color-border-subtle));
          }
          .btn {
            all: unset;
            box-sizing: border-box;
            cursor: pointer;
            padding: var(--ae-space-2) var(--ae-space-4);
            border-radius: var(--ae-radius-md);
            border: var(--ae-border-width-1) solid var(--ae-color-border-strong);
            font-weight: var(--ae-font-weight-medium);
            font-size: var(--ae-font-size-sm);
            background: var(--ae-color-bg);
            color: var(--ae-color-fg);
          }
          .btn:focus-visible {
            outline: var(--ae-focus-ring-width) var(--ae-focus-ring-style) var(--ae-color-focus-ring);
            outline-offset: var(--ae-focus-ring-offset);
          }
          .btn[data-variant='primary'] {
            background: var(--ae-color-accent);
            border-color: transparent;
            color: var(--ae-color-fg-on-accent);
          }
          .btn[data-variant='danger'] {
            background: var(--ae-color-danger);
            border-color: transparent;
            color: var(--ae-color-fg-on-danger);
          }
        </style>
        <div class="overlay" part="overlay" @keydown=${this._onTrapKey}>
          <div
            class="surface"
            part="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby=${e8 ?? A}
            aria-describedby=${t5}
          >
            ${this.title ? b2`<div part="title" id="ae-dialog-title" class="title">${this.title}</div>` : A}
            <div part="body" id="ae-dialog-body" class="body">
              <div class="slot-mount"></div>
              ${this.description ? b2`<p>${this.description}</p>` : A}
            </div>
            <div part="footer" class="footer">
              <button
                type="button"
                part="cancel"
                class="btn"
                data-action="cancel"
                @click=${this._onCancel}
              >${this.cancelLabel}</button>
              <button
                type="button"
                part="confirm"
                class="btn"
                data-action="confirm"
                data-variant=${a4}
                @click=${this._onConfirm}
              >${this.confirmLabel}</button>
            </div>
          </div>
        </div>
      `,
      this._portalEl
    ), this._slotMount = this._portalEl.querySelector(".slot-mount");
  }
  _mountSlottedChildren() {
    if (!this._slotMount || this._bodyPlaceholder) return;
    this._bodyPlaceholder = document.createComment("ae-dialog-children"), this.appendChild(this._bodyPlaceholder), this._bodyChildren = [];
    const e8 = Array.from(this.childNodes);
    for (const t5 of e8)
      t5 !== this._bodyPlaceholder && (this._bodyChildren.push(t5), this._slotMount.appendChild(t5));
  }
  _unmountSlottedChildren() {
    if (this._bodyPlaceholder && this._bodyPlaceholder.parentNode === this) {
      for (const e8 of this._bodyChildren)
        this.insertBefore(e8, this._bodyPlaceholder);
      this._bodyPlaceholder.remove();
    }
    this._bodyChildren = [], this._bodyPlaceholder = null;
  }
  _getFocusables() {
    return this._portalEl ? Array.from(this._portalEl.querySelectorAll(Oi)) : [];
  }
  _focusFirst() {
    var t5, a4;
    if (this.tone === "danger") {
      const r6 = (t5 = this._portalEl) == null ? void 0 : t5.querySelector('[data-action="cancel"]');
      r6 == null || r6.focus();
      return;
    }
    const e8 = (a4 = this._portalEl) == null ? void 0 : a4.querySelector('[data-action="confirm"]');
    e8 == null || e8.focus();
  }
  /** Returns the dialog surface element for tests / consumers. */
  getSurface() {
    var e8;
    return ((e8 = this._portalEl) == null ? void 0 : e8.querySelector(".surface")) ?? null;
  }
  render() {
    return b2``;
  }
};
ce.styles = i`
    :host {
      display: contents;
    }
  `;
Ge([
  n4({ type: Boolean, reflect: true })
], ce.prototype, "open", 2);
Ge([
  n4({ type: String, reflect: true })
], ce.prototype, "title", 2);
Ge([
  n4({ type: String, reflect: true })
], ce.prototype, "description", 2);
Ge([
  n4({ type: String, reflect: true, attribute: "confirm-label" })
], ce.prototype, "confirmLabel", 2);
Ge([
  n4({ type: String, reflect: true, attribute: "cancel-label" })
], ce.prototype, "cancelLabel", 2);
Ge([
  n4({ type: String, reflect: true })
], ce.prototype, "tone", 2);
Ge([
  n4({ type: Boolean, reflect: true, attribute: "close-on-escape" })
], ce.prototype, "closeOnEscape", 2);
ce = Ge([
  t3("ae-dialog")
], ce);
var Ti = Object.defineProperty;
var Li = Object.getOwnPropertyDescriptor;
var Xe = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Li(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ti(t5, a4, i7), i7;
};
var Ii = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"], ae-button:not([disabled])';
var de = class extends i4 {
  constructor() {
    super(...arguments), this.open = false, this.placement = "end", this.size = "md", this.closeOnClickOutside = true, this.closeOnEscape = true, this.labelledby = "", this._hasHeader = false, this._hasFooter = false, this._previouslyFocused = null, this._previousBodyOverflow = "", this._mounted = false, this._onKeyDown = (e8) => {
      this.open && (e8.key === "Escape" && this.closeOnEscape && (e8.stopPropagation(), this.open = false), e8.key === "Tab" && this._trapTab(e8));
    }, this._onBackdropClick = () => {
      this.closeOnClickOutside && (this.open = false);
    }, this._onTransitionEnd = (e8) => {
      var a4;
      if (e8.propertyName !== "transform") return;
      const t5 = e8.target;
      t5 && ((a4 = t5.getAttribute) == null ? void 0 : a4.call(t5, "part")) !== "drawer" || (this.open ? this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true })) : this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true })));
    }, this._onSlotChange = (e8) => {
      const t5 = e8.target, a4 = t5.assignedNodes({ flatten: true }).length > 0;
      t5.name === "header" && (this._hasHeader = a4), t5.name === "footer" && (this._hasFooter = a4), this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("keydown", this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this._onKeyDown), this._restoreBodyScroll();
  }
  updated(e8) {
    e8.has("open") && (this.open ? this._openDrawer() : this._closeDrawer());
  }
  _openDrawer() {
    this._mounted = true, this._previouslyFocused = document.activeElement ?? null, this._lockBodyScroll(), queueMicrotask(() => this._focusFirst());
  }
  _closeDrawer() {
    var e8, t5;
    this._restoreBodyScroll(), (t5 = (e8 = this._previouslyFocused) == null ? void 0 : e8.focus) == null || t5.call(e8), this._previouslyFocused = null;
  }
  _lockBodyScroll() {
    this._previousBodyOverflow = document.body.style.overflow, document.body.style.overflow = "hidden";
  }
  _restoreBodyScroll() {
    document.body.style.overflow = this._previousBodyOverflow;
  }
  _trapTab(e8) {
    const t5 = this._getFocusables();
    if (t5.length === 0) {
      e8.preventDefault();
      return;
    }
    const a4 = t5[0], r6 = t5[t5.length - 1], i7 = this.getRootNode().activeElement;
    e8.shiftKey && i7 === a4 ? (e8.preventDefault(), r6.focus()) : !e8.shiftKey && i7 === r6 && (e8.preventDefault(), a4.focus());
  }
  _getFocusables() {
    return Array.from(this.querySelectorAll(Ii));
  }
  _focusFirst() {
    var t5;
    (t5 = this._getFocusables()[0]) == null || t5.focus();
  }
  render() {
    return this._mounted, b2`
      <div part="backdrop" class="backdrop" @click=${this._onBackdropClick} aria-hidden="true"></div>
      <aside
        part="drawer"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby=${this.labelledby || A}
        aria-hidden=${this.open ? "false" : "true"}
        @transitionend=${this._onTransitionEnd}
      >
        <div part="header" class="header" ?hidden=${!this._hasHeader}>
          <slot name="header" @slotchange=${this._onSlotChange}></slot>
        </div>
        <div part="body" class="body">
          <slot></slot>
        </div>
        <div part="footer" class="footer" ?hidden=${!this._hasFooter}>
          <slot name="footer" @slotchange=${this._onSlotChange}></slot>
        </div>
      </aside>
    `;
  }
};
de.styles = i`
    :host {
      display: contents;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: var(--ae-z-overlay);
      background: var(--ae-drawer-backdrop, var(--ae-color-bg-overlay));
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--ae-duration-normal) var(--ae-easing-ease-out);
    }

    .drawer {
      position: fixed;
      z-index: var(--ae-z-modal);
      background: var(--ae-drawer-bg, var(--ae-color-bg-elevated));
      color: var(--ae-drawer-fg, var(--ae-color-fg));
      box-shadow: var(--ae-drawer-shadow, var(--ae-shadow-2xl));
      backdrop-filter: var(--ae-drawer-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-drawer-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-default);
      line-height: var(--ae-line-height-default);
      display: grid;
      grid-template-rows: auto 1fr auto;
      box-sizing: border-box;
      transition: transform var(--ae-duration-normal) var(--ae-easing-ease-out);
    }

    /* Placement & size */
    :host([size='sm']) { --ae-drawer-size: 18rem; }
    :host([size='md']) { --ae-drawer-size: 24rem; }
    :host([size='lg']) { --ae-drawer-size: 32rem; }
    :host([size='full']) { --ae-drawer-size: 100%; }

    :host([placement='start']) .drawer,
    :host([placement='end']) .drawer {
      top: 0;
      bottom: 0;
      width: var(--ae-drawer-size, 24rem);
      max-width: 100vw;
    }
    :host([placement='top']) .drawer,
    :host([placement='bottom']) .drawer {
      left: 0;
      right: 0;
      height: var(--ae-drawer-size, 24rem);
      max-height: 100vh;
    }

    /* Leading-edge border (the edge facing the content). Off by default
     * (width 0 / transparent); Metro draws the source SlidePanel's 3px ink
     * rule along it. */
    :host([placement='start']) .drawer {
      left: 0; transform: translateX(-100%);
      border-right: var(--ae-drawer-border-width, 0) solid var(--ae-drawer-border, transparent);
    }
    :host([placement='end']) .drawer {
      right: 0; transform: translateX(100%);
      border-left: var(--ae-drawer-border-width, 0) solid var(--ae-drawer-border, transparent);
    }
    :host([placement='top']) .drawer {
      top: 0;  transform: translateY(-100%);
      border-bottom: var(--ae-drawer-border-width, 0) solid var(--ae-drawer-border, transparent);
    }
    :host([placement='bottom']) .drawer {
      bottom: 0; transform: translateY(100%);
      border-top: var(--ae-drawer-border-width, 0) solid var(--ae-drawer-border, transparent);
    }

    :host([open]) .backdrop {
      opacity: 1;
      pointer-events: auto;
    }
    :host([open]) .drawer {
      transform: translate(0, 0);
    }

    /*
     * When closed, hide the panel so its focusable content leaves the tab
     * order (otherwise off-screen-transformed content stays Tab-reachable —
     * a focus-management defect). visibility:hidden is DELAYED until after
     * the slide-out transition so the exit animation still plays. This
     * CSS-only "unmount" replaces the is-dismounted class, which was
     * never actually applied to the element.
     */
    :host(:not([open])) .drawer {
      visibility: hidden;
      transition:
        transform var(--ae-duration-normal) var(--ae-easing-ease-out),
        visibility 0s linear var(--ae-duration-normal);
    }
    :host([open]) .drawer {
      visibility: visible;
    }

    .header,
    .body,
    .footer {
      padding: var(--ae-space-5);
    }
    .header {
      border-bottom: var(--ae-drawer-divider-width, var(--ae-border-width-1)) solid
        var(--ae-drawer-divider, var(--ae-color-border-subtle));
      font-weight: var(--ae-drawer-title-font-weight, var(--ae-font-weight-semibold));
      letter-spacing: var(--ae-drawer-title-tracking, normal);
      font-size: var(--ae-font-size-lg);
    }
    .body {
      overflow: auto;
    }
    .footer {
      border-top: var(--ae-drawer-divider-width, var(--ae-border-width-1)) solid
        var(--ae-drawer-divider, var(--ae-color-border-subtle));
      background: var(--ae-drawer-footer-bg, var(--ae-color-bg-subtle));
      display: flex;
      gap: var(--ae-space-2);
      justify-content: flex-end;
    }
    [hidden] { display: none !important; }
  `;
Xe([
  n4({ type: Boolean, reflect: true })
], de.prototype, "open", 2);
Xe([
  n4({ type: String, reflect: true })
], de.prototype, "placement", 2);
Xe([
  n4({ type: String, reflect: true })
], de.prototype, "size", 2);
Xe([
  n4({ type: Boolean, reflect: true, attribute: "close-on-click-outside" })
], de.prototype, "closeOnClickOutside", 2);
Xe([
  n4({ type: Boolean, reflect: true, attribute: "close-on-escape" })
], de.prototype, "closeOnEscape", 2);
Xe([
  n4({ type: String, reflect: true })
], de.prototype, "labelledby", 2);
Xe([
  e5('[part="drawer"]')
], de.prototype, "_panel", 2);
de = Xe([
  t3("ae-drawer")
], de);
var Mi = Object.defineProperty;
var Bi = Object.getOwnPropertyDescriptor;
var Gt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Bi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Mi(t5, a4, i7), i7;
};
var at = class extends i4 {
  constructor() {
    super(...arguments), this.open = false, this.tone = "neutral", this.duration = 5e3, this.dismissible = true, this._hideTimer = null, this._pauseAutoDismiss = () => {
      this._hideTimer && (clearTimeout(this._hideTimer), this._hideTimer = null);
    }, this._resumeAutoDismiss = () => {
      this.open && this._scheduleAutoDismiss();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.open && this._scheduleAutoDismiss();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._hideTimer && (clearTimeout(this._hideTimer), this._hideTimer = null);
  }
  updated(e8) {
    e8.has("open") && (this.open ? this._scheduleAutoDismiss() : this._hideTimer && (clearTimeout(this._hideTimer), this._hideTimer = null)), e8.has("duration") && this.open && this._scheduleAutoDismiss();
  }
  _scheduleAutoDismiss() {
    this._hideTimer && clearTimeout(this._hideTimer), !(this.duration <= 0) && (this._hideTimer = setTimeout(() => {
      this._hideTimer = null, this.dismiss();
    }, this.duration));
  }
  /** Dismisses the toast and fires ae-dismiss. */
  dismiss() {
    this.open && (this.open = false, this.dispatchEvent(new CustomEvent("ae-dismiss", { bubbles: true, composed: true })));
  }
  get _isAssertive() {
    return this.tone === "warning" || this.tone === "danger";
  }
  render() {
    const e8 = this._isAssertive ? "alert" : "status", t5 = this._isAssertive ? "assertive" : "polite";
    return b2`
      <div
        part="toast"
        class="toast"
        role=${e8}
        aria-live=${t5}
        aria-atomic="true"
        @mouseenter=${this._pauseAutoDismiss}
        @mouseleave=${this._resumeAutoDismiss}
        @focusin=${this._pauseAutoDismiss}
        @focusout=${this._resumeAutoDismiss}
      >
        <div class="content">
          <div part="title" class="title"><slot name="title"></slot></div>
          <div part="body" class="body"><slot></slot></div>
        </div>
        <div class="actions">
          <slot name="action"></slot>
          ${this.dismissible ? b2`<button
                type="button"
                part="dismiss"
                class="dismiss"
                aria-label="Dismiss"
                @click=${this.dismiss}
              >×</button>` : A}
        </div>
      </div>
    `;
  }
};
at.styles = i`
    :host {
      /* Tone-driven surface tokens stay declared here (the tone modifiers
       * below re-point them); their values read theme-aware semantic vars so a
       * brand still recolors them. Geometry tokens (radius/shadow) must NOT be
       * declared at :host — a :host declaration would shadow a brand's
       * :root[data-collection] override (e.g. Spectrum's tighter toast). Their
       * defaults live at the consumption point via var(--token, fallback). */
      --ae-toast-bg: var(--ae-toast-neutral-bg, var(--ae-color-bg-elevated));
      --ae-toast-fg: var(--ae-toast-neutral-fg, var(--ae-color-fg));
      --ae-toast-border: var(--ae-toast-neutral-border, var(--ae-color-border));
      --ae-toast-strip: var(--ae-toast-neutral-strip, inset 0 0 0 0 transparent);
      display: block;
      pointer-events: auto;
    }

    .toast {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: var(--ae-toast-gap, var(--ae-space-3));
      align-items: start;
      background: var(--ae-toast-bg);
      backdrop-filter: var(--ae-toast-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-toast-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-toast-fg);
      border: var(--ae-border-width-1) solid var(--ae-toast-border);
      border-radius: var(--ae-toast-radius, var(--ae-radius-md));
      /* The leading inset is the optional tone edge-strip (Metro's ticket-stub
         color rule); it stacks before the drop shadow and is a no-op
         (transparent, 0-width) until a theme points --ae-toast-*-strip at a
         real inset. */
      box-shadow: var(--ae-toast-strip, inset 0 0 0 0 transparent),
        var(--ae-toast-shadow, var(--ae-shadow-lg));
      padding: var(--ae-toast-padding, var(--ae-space-3) var(--ae-space-4));
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-toast-font-size, var(--ae-font-size-sm));
      line-height: var(--ae-toast-line-height, var(--ae-line-height-snug));
      min-width: var(--ae-toast-min-width, 16rem);
      max-width: var(--ae-toast-max-width, 28rem);
      box-sizing: border-box;
    }

    .content {
      display: grid;
      gap: var(--ae-space-1);
    }

    .title {
      font-weight: var(--ae-toast-title-weight, var(--ae-font-weight-semibold));
      text-transform: var(--ae-toast-title-transform, none);
      letter-spacing: var(--ae-toast-title-tracking, normal);
      font-size: var(--ae-toast-title-size, inherit);
    }

    .actions {
      display: flex;
      gap: var(--ae-space-1);
      align-items: center;
      /* Metro divides the action column from the body with a 2px ink rule
         (the source's bordered action button); off by default. */
      border-inline-start: var(--ae-toast-actions-divider, none);
      padding-inline-start: var(--ae-toast-actions-pad, 0);
    }

    button.dismiss {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      padding: var(--ae-space-1);
      border-radius: var(--ae-radius-sm);
      color: var(--ae-color-fg-muted);
      line-height: 1;
      font-size: var(--ae-font-size-md);
    }
    button.dismiss:focus-visible {
      outline: var(--ae-focus-ring-width) var(--ae-focus-ring-style) var(--ae-color-focus-ring);
      outline-offset: var(--ae-focus-ring-offset);
    }
    button.dismiss:hover {
      background: var(--ae-color-bg-muted);
      color: var(--ae-color-fg);
    }

    /* Tone styling. Each tone re-points the surface tokens through a per-tone
     * indirection (--ae-toast-<tone>-bg/-fg/-border/-strip) that defaults to the
     * subtle-tint treatment. A brand recolors a tone by SETTING those
     * indirection vars at :root (inherited) — it can't override --ae-toast-bg
     * directly because this :host([tone]) declaration would shadow it. Metro
     * uses this to flip tones to solid signal bg + paper/ink text + an edge
     * strip (the source's ticket-stub toast). */
    :host([tone='accent']) {
      --ae-toast-bg: var(--ae-toast-accent-bg, var(--ae-color-accent-subtle));
      --ae-toast-border: var(--ae-toast-accent-border, var(--ae-color-accent));
      --ae-toast-fg: var(--ae-toast-accent-fg, var(--ae-color-accent-emphasis));
      --ae-toast-strip: var(--ae-toast-accent-strip, inset 0 0 0 0 transparent);
    }
    :host([tone='success']) {
      --ae-toast-bg: var(--ae-toast-success-bg, var(--ae-color-success-subtle));
      --ae-toast-border: var(--ae-toast-success-border, var(--ae-color-success));
      --ae-toast-fg: var(--ae-toast-success-fg, var(--ae-color-success-emphasis));
      --ae-toast-strip: var(--ae-toast-success-strip, inset 0 0 0 0 transparent);
    }
    :host([tone='warning']) {
      --ae-toast-bg: var(--ae-toast-warning-bg, var(--ae-color-warning-subtle));
      --ae-toast-border: var(--ae-toast-warning-border, var(--ae-color-warning));
      --ae-toast-fg: var(--ae-toast-warning-fg, var(--ae-color-warning-emphasis));
      --ae-toast-strip: var(--ae-toast-warning-strip, inset 0 0 0 0 transparent);
    }
    :host([tone='danger']) {
      --ae-toast-bg: var(--ae-toast-danger-bg, var(--ae-color-danger-subtle));
      --ae-toast-border: var(--ae-toast-danger-border, var(--ae-color-danger));
      --ae-toast-fg: var(--ae-toast-danger-fg, var(--ae-color-danger-emphasis));
      --ae-toast-strip: var(--ae-toast-danger-strip, inset 0 0 0 0 transparent);
    }
    :host([tone='info']) {
      --ae-toast-bg: var(--ae-toast-info-bg, var(--ae-color-info-subtle));
      --ae-toast-border: var(--ae-toast-info-border, var(--ae-color-info));
      --ae-toast-fg: var(--ae-toast-info-fg, var(--ae-color-info-emphasis));
      --ae-toast-strip: var(--ae-toast-info-strip, inset 0 0 0 0 transparent);
    }
    :host(:not([open])) {
      display: none;
    }
  `;
Gt([
  n4({ type: Boolean, reflect: true })
], at.prototype, "open", 2);
Gt([
  n4({ type: String, reflect: true })
], at.prototype, "tone", 2);
Gt([
  n4({ type: Number, reflect: true })
], at.prototype, "duration", 2);
Gt([
  n4({ type: Boolean, reflect: true })
], at.prototype, "dismissible", 2);
at = Gt([
  t3("ae-toast")
], at);
var Fi = "ae-toast-region";
function ji(e8) {
  const t5 = `${Fi}-${e8}`;
  let a4 = document.getElementById(t5);
  if (a4) return a4;
  a4 = document.createElement("div"), a4.id = t5, a4.setAttribute("role", "region"), a4.setAttribute("aria-label", "Notifications"), a4.style.cssText = `
    position: fixed;
    z-index: var(--ae-z-toast, 1600);
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
    padding: 16px;
    box-sizing: border-box;
    max-width: 100vw;
  `;
  const [r6, i7] = e8.split("-");
  return r6 === "top" ? (a4.style.top = "0", a4.style.bottom = "") : (a4.style.bottom = "0", a4.style.top = "", a4.style.flexDirection = "column-reverse"), i7 === "start" ? (a4.style.left = "0", a4.style.right = "", a4.style.alignItems = "flex-start") : (a4.style.right = "0", a4.style.left = "", a4.style.alignItems = "flex-end"), document.body.appendChild(a4), a4;
}
function rn(e8) {
  const t5 = document.createElement("ae-toast");
  if (t5.tone = e8.tone ?? "neutral", t5.duration = e8.duration ?? 5e3, t5.dismissible = e8.dismissible ?? true, e8.title) {
    const r6 = document.createElement("span");
    r6.slot = "title", r6.textContent = e8.title, t5.appendChild(r6);
  }
  if (typeof e8.message == "string") {
    const r6 = document.createElement("span");
    r6.textContent = e8.message, t5.appendChild(r6);
  } else
    t5.appendChild(e8.message);
  if (e8.action) {
    const r6 = document.createElement("button");
    r6.slot = "action", r6.type = "button", r6.textContent = e8.action.label, r6.style.cssText = `
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid currentColor;
      font: inherit;
    `, r6.addEventListener("click", () => e8.action.onClick(t5)), t5.appendChild(r6);
  }
  return ji(e8.region ?? "bottom-end").appendChild(t5), t5.open = true, t5.addEventListener("ae-dismiss", () => {
    queueMicrotask(() => t5.remove());
  }), t5;
}
var Ni = Object.defineProperty;
var Ri = Object.getOwnPropertyDescriptor;
var zt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ri(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ni(t5, a4, i7), i7;
};
var Me = class extends i4 {
  constructor() {
    super(...arguments), this.value = "", this.type = "item", this.name = "", this.disabled = false, this.selected = false, this._onClick = (e8) => {
      if (this.disabled) {
        e8.preventDefault(), e8.stopPropagation();
        return;
      }
      this._activate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "-1"), this.hasAttribute("role") || this.setAttribute("role", "menuitem");
  }
  updated() {
    this._syncAria();
  }
  /**
   * Drive the host role and checked/disabled ARIA state from the reactive
   * `type` / `selected` / `disabled` properties. Checkbox and radio items
   * own their role outright; a plain item respects a consumer-supplied role
   * but otherwise reverts to `menuitem` (including when `type` flips back
   * from checkbox/radio).
   */
  _syncAria() {
    if (this.type === "checkbox")
      this.setAttribute("role", "menuitemcheckbox");
    else if (this.type === "radio")
      this.setAttribute("role", "menuitemradio");
    else {
      const e8 = this.getAttribute("role");
      (!e8 || e8 === "menuitemcheckbox" || e8 === "menuitemradio") && this.setAttribute("role", "menuitem");
    }
    this.type === "checkbox" || this.type === "radio" ? this.setAttribute("aria-checked", this.selected ? "true" : "false") : this.removeAttribute("aria-checked"), this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled");
  }
  /** Programmatic activation (used by parent for keyboard handling). */
  activate() {
    this.disabled || this._activate();
  }
  _activate() {
    this.type === "checkbox" ? this.selected = !this.selected : this.type === "radio" && (this.selected = true), this.dispatchEvent(
      new CustomEvent("ae-select", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, item: this, checked: this.selected }
      })
    );
  }
  /** Text content used for typeahead matching. */
  get matchText() {
    return (this.textContent ?? "").trim().toLowerCase();
  }
  render() {
    return b2`
      <div part="item" class="item" @click=${this._onClick}>
        <span class="start"><slot name="start"></slot></span>
        <span part="label" class="label"><slot></slot></span>
        <span class="end"><slot name="end"></slot></span>
      </div>
    `;
  }
};
Me.styles = i`
    /* Item tokens live in the var() fallbacks (not declared at :host) so a brand
     * theme can recolor the row / its highlight at :root without being shadowed
     * by a directly-matched :host declaration. Metro squares the corners and
     * lights the active row gold (matching the command-palette selected row). */
    :host {
      display: block;
    }

    .item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: var(--ae-space-2);
      align-items: center;
      padding: var(--ae-menu-item-padding, var(--ae-space-2) var(--ae-space-3));
      color: var(--ae-menu-item-fg, var(--ae-color-fg));
      border-radius: var(--ae-menu-item-radius, var(--ae-radius-sm));
      cursor: pointer;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      line-height: 1.25;
      user-select: none;
      transition: background-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    :host([disabled]) .item {
      color: var(--ae-color-fg-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }

    :host([data-active]) .item {
      background: var(--ae-menu-item-bg-hover, var(--ae-color-bg-muted));
      color: var(--ae-menu-item-fg-active, var(--ae-menu-item-fg, var(--ae-color-fg)));
      outline: none;
    }

    .item:hover:not([data-disabled]) {
      background: var(--ae-menu-item-bg-hover, var(--ae-color-bg-muted));
      color: var(--ae-menu-item-fg-active, var(--ae-menu-item-fg, var(--ae-color-fg)));
    }

    .start,
    .end {
      display: inline-flex;
      align-items: center;
      color: var(--ae-color-fg-muted);
    }
    .start:empty,
    .end:empty {
      display: none;
    }

    :host([selected]) .end::after {
      content: '✓';
      color: var(--ae-color-accent-emphasis);
    }
    /* Radio items use a filled disc rather than a check, the convention
       that distinguishes single-choice from multi-choice menu items. */
    :host([type='radio'][selected]) .end::after {
      content: '•';
    }
  `;
zt([
  n4({ type: String, reflect: true })
], Me.prototype, "value", 2);
zt([
  n4({ type: String, reflect: true })
], Me.prototype, "type", 2);
zt([
  n4({ type: String, reflect: true })
], Me.prototype, "name", 2);
zt([
  n4({ type: Boolean, reflect: true })
], Me.prototype, "disabled", 2);
zt([
  n4({ type: Boolean, reflect: true })
], Me.prototype, "selected", 2);
Me = zt([
  t3("ae-menu-item")
], Me);
var qi = Object.defineProperty;
var Vi = Object.getOwnPropertyDescriptor;
var pt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Vi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && qi(t5, a4, i7), i7;
};
var we = class extends i4 {
  constructor() {
    super(...arguments), this.open = false, this.placement = "bottom-start", this.closeOnClickOutside = true, this.closeOnEscape = true, this.anchor = "", this._activeIndex = -1, this._panelEl = null, this._movedChildren = [], this._placeholder = null, this._typeahead = "", this._typeaheadTimer = null, this._previouslyFocused = null, this._rafId = 0, this._scheduleReposition = () => {
      this.open && (this._rafId && cancelAnimationFrame(this._rafId), this._rafId = requestAnimationFrame(() => {
        this._rafId = 0, this._position();
      }));
    }, this._onKeyDown = (e8) => {
      if (this.open)
        switch (e8.key) {
          case "ArrowDown":
          case "ArrowRight":
            e8.preventDefault(), this._move(1);
            break;
          case "ArrowUp":
          case "ArrowLeft":
            e8.preventDefault(), this._move(-1);
            break;
          case "Home":
            e8.preventDefault(), this._moveTo(this._firstEnabledIndex());
            break;
          case "End": {
            e8.preventDefault();
            const t5 = this.items;
            for (let a4 = t5.length - 1; a4 >= 0; a4--)
              if (!t5[a4].disabled) {
                this._activeIndex = a4, this._focusActive();
                return;
              }
            break;
          }
          case "Enter":
          case " ": {
            e8.preventDefault();
            const t5 = this.items[this._activeIndex];
            t5 && !t5.disabled && t5.activate();
            break;
          }
          case "Escape":
            this.closeOnEscape && (e8.preventDefault(), e8.stopPropagation(), this.open = false);
            break;
          case "Tab":
            this.open = false;
            break;
          default:
            e8.key.length === 1 && /\S/.test(e8.key) && this._typeaheadMatch(e8.key);
        }
    }, this._onPointerDown = (e8) => {
      if (!this.open || !this.closeOnClickOutside) return;
      const t5 = this._panelEl, a4 = this._resolveAnchor(), r6 = e8.target, i7 = typeof e8.composedPath == "function" ? e8.composedPath() : [];
      Ra(t5, r6, i7) || Ra(a4, r6, i7) || (this.open = false);
    }, this._onSelect = (e8) => {
      const t5 = e8.detail.item;
      if (!(t5 != null && t5.disabled)) {
        if (t5 && (t5.type === "checkbox" || t5.type === "radio")) {
          t5.type === "radio" && this._clearRadioGroup(t5);
          return;
        }
        this.open = false;
      }
    };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("keydown", this._onKeyDown), document.addEventListener("pointerdown", this._onPointerDown, true), window.addEventListener("resize", this._scheduleReposition, { passive: true }), window.addEventListener("scroll", this._scheduleReposition, { passive: true }), this.addEventListener("ae-select", this._onSelect);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this._onKeyDown), document.removeEventListener("pointerdown", this._onPointerDown, true), window.removeEventListener("resize", this._scheduleReposition), window.removeEventListener("scroll", this._scheduleReposition), this.removeEventListener("ae-select", this._onSelect), this._teardownPanel(), this._rafId && cancelAnimationFrame(this._rafId);
  }
  updated(e8) {
    var t5, a4;
    e8.has("open") ? this.open ? (this._mountPanel(), this._previouslyFocused = document.activeElement ?? null, this._activeIndex = this._firstEnabledIndex(), this._scheduleReposition(), this._focusActive(), this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true }))) : (this._unmountPanel(), (a4 = (t5 = this._previouslyFocused) == null ? void 0 : t5.focus) == null || a4.call(t5), this._previouslyFocused = null, this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true }))) : this.open && this._scheduleReposition(), e8.has("_activeIndex") && this._highlightActive();
  }
  /** Returns the body-attached panel for tests / consumers. */
  getPanel() {
    return this._panelEl;
  }
  /** Returns the menu items currently rendered. */
  get items() {
    return this._panelEl ? Array.from(this._panelEl.querySelectorAll("ae-menu-item")) : Array.from(this.querySelectorAll("ae-menu-item"));
  }
  _firstEnabledIndex() {
    return this.items.findIndex((e8) => !e8.disabled);
  }
  _resolveAnchor() {
    var e8;
    if (this.anchor instanceof HTMLElement) return this.anchor;
    if (typeof this.anchor == "string" && this.anchor) {
      const t5 = this.getRootNode(), a4 = ((e8 = t5.querySelector) == null ? void 0 : e8.call(t5, this.anchor)) ?? document.querySelector(this.anchor);
      return a4 instanceof HTMLElement ? a4 : null;
    }
    return this.previousElementSibling instanceof HTMLElement ? this.previousElementSibling : null;
  }
  _mountPanel() {
    if (this._panelEl) return;
    const e8 = document.createElement("div");
    e8.setAttribute("part", "panel"), e8.setAttribute("role", "menu"), e8.classList.add("ae-menu-panel"), e8.tabIndex = -1, e8.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: var(--ae-z-popover, 1400);
      min-width: 10rem;
      max-width: 18rem;
      background: var(--ae-menu-bg, var(--ae-color-bg-elevated));
      color: var(--ae-menu-fg, var(--ae-color-fg));
      border: var(--ae-menu-border-width, var(--ae-border-width-1, 1px)) solid var(--ae-menu-border, var(--ae-color-border));
      border-radius: var(--ae-menu-radius, var(--ae-radius-md));
      box-shadow: var(--ae-menu-shadow, var(--ae-shadow-md));
      backdrop-filter: var(--ae-menu-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-menu-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      padding: var(--ae-menu-padding, var(--ae-space-1));
      box-sizing: border-box;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      line-height: var(--ae-line-height-snug);
      outline: none;
    `, this._placeholder = document.createComment("ae-menu-children"), this.appendChild(this._placeholder), this._movedChildren = [];
    const t5 = Array.from(this.childNodes);
    for (const a4 of t5)
      a4 !== this._placeholder && (this._movedChildren.push(a4), e8.appendChild(a4));
    e8.addEventListener("ae-select", (a4) => {
      const r6 = a4.detail;
      this.dispatchEvent(
        new CustomEvent("ae-select", {
          bubbles: true,
          composed: true,
          detail: r6
        })
      );
    }), document.body.appendChild(e8), this._panelEl = e8;
  }
  _unmountPanel() {
    if (this._panelEl) {
      if (this._placeholder && this._placeholder.parentNode === this) {
        for (const e8 of this._movedChildren)
          this.insertBefore(e8, this._placeholder);
        this._placeholder.remove();
      }
      this._movedChildren = [], this._placeholder = null, this._panelEl.remove(), this._panelEl = null;
    }
  }
  _teardownPanel() {
    this._panelEl && (this._panelEl.remove(), this._panelEl = null), this._movedChildren = [], this._placeholder = null;
  }
  _position() {
    const e8 = this._resolveAnchor(), t5 = this._panelEl;
    if (!e8 || !t5) return;
    const a4 = e8.getBoundingClientRect(), r6 = t5.getBoundingClientRect(), i7 = window.innerWidth || document.documentElement.clientWidth || 0, s4 = window.innerHeight || document.documentElement.clientHeight || 0, o9 = 4, [h3, d3 = "center"] = this.placement.split("-");
    let p3 = 0, b3 = 0;
    switch (h3) {
      case "top":
        b3 = a4.top - r6.height - o9, p3 = a4.left + a4.width / 2 - r6.width / 2, d3 === "start" && (p3 = a4.left), d3 === "end" && (p3 = a4.right - r6.width);
        break;
      case "bottom":
        b3 = a4.bottom + o9, p3 = a4.left + a4.width / 2 - r6.width / 2, d3 === "start" && (p3 = a4.left), d3 === "end" && (p3 = a4.right - r6.width);
        break;
      case "left":
        p3 = a4.left - r6.width - o9, b3 = a4.top + a4.height / 2 - r6.height / 2;
        break;
      case "right":
        p3 = a4.right + o9, b3 = a4.top + a4.height / 2 - r6.height / 2;
        break;
    }
    p3 = Math.max(4, Math.min(p3, Math.max(4, i7 - r6.width - 4))), b3 = Math.max(4, Math.min(b3, Math.max(4, s4 - r6.height - 4))), t5.style.transform = `translate(${p3}px, ${b3}px)`;
  }
  _highlightActive() {
    this.items.forEach((t5, a4) => {
      a4 === this._activeIndex ? t5.setAttribute("data-active", "") : t5.removeAttribute("data-active");
    });
  }
  _focusActive() {
    const e8 = this.items[this._activeIndex];
    e8 == null || e8.focus();
  }
  _move(e8) {
    const t5 = this.items;
    if (t5.length === 0) return;
    let a4 = this._activeIndex;
    for (let r6 = 0; r6 < t5.length && (a4 = (a4 + e8 + t5.length) % t5.length, !!t5[a4].disabled); r6++)
      ;
    this._activeIndex = a4, this._focusActive();
  }
  _moveTo(e8) {
    const t5 = this.items;
    e8 < 0 || e8 >= t5.length || t5[e8].disabled || (this._activeIndex = e8, this._focusActive());
  }
  _typeaheadMatch(e8) {
    this._typeaheadTimer && clearTimeout(this._typeaheadTimer), this._typeahead += e8.toLowerCase(), this._typeaheadTimer = setTimeout(() => {
      this._typeahead = "", this._typeaheadTimer = null;
    }, 500);
    const t5 = this.items, a4 = (this._activeIndex + 1) % Math.max(1, t5.length);
    for (let r6 = 0; r6 < t5.length; r6++) {
      const i7 = (a4 + r6) % t5.length, s4 = t5[i7];
      if (!s4.disabled && s4.matchText.startsWith(this._typeahead)) {
        this._activeIndex = i7, this._focusActive();
        return;
      }
    }
  }
  /** Deselect the other radio items sharing the activated item's group. */
  _clearRadioGroup(e8) {
    for (const t5 of this.items)
      t5 !== e8 && t5.type === "radio" && t5.name === e8.name && (t5.selected = false);
  }
  render() {
    return b2``;
  }
};
we.styles = i`
    :host {
      display: contents;
    }
  `;
pt([
  n4({ type: Boolean, reflect: true })
], we.prototype, "open", 2);
pt([
  n4({ type: String, reflect: true })
], we.prototype, "placement", 2);
pt([
  n4({ type: Boolean, reflect: true, attribute: "close-on-click-outside" })
], we.prototype, "closeOnClickOutside", 2);
pt([
  n4({ type: Boolean, reflect: true, attribute: "close-on-escape" })
], we.prototype, "closeOnEscape", 2);
pt([
  n4()
], we.prototype, "anchor", 2);
pt([
  r5()
], we.prototype, "_activeIndex", 2);
we = pt([
  t3("ae-menu")
], we);
function Ra(e8, t5, a4) {
  if (!e8) return false;
  if (t5 === e8 || a4.includes(e8) || t5 && typeof e8.contains == "function" && e8.contains(t5)) return true;
  let r6 = t5;
  for (; r6; ) {
    if (r6 === e8) return true;
    r6 = r6.parentNode;
  }
  return false;
}
var Hi = Object.defineProperty;
var Ui = Object.getOwnPropertyDescriptor;
var Dt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ui(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Hi(t5, a4, i7), i7;
};
var Be = class extends i4 {
  constructor() {
    super(...arguments), this.target = "", this.closeOnClickOutside = true, this.closeOnEscape = true, this._open = false, this._activeIndex = -1, this._panelEl = null, this._movedChildren = [], this._placeholder = null, this._targetEl = null, this._typeahead = "", this._typeaheadTimer = null, this._previouslyFocused = null, this._cursorX = 0, this._cursorY = 0, this._onContextMenu = (e8) => {
      e8.preventDefault(), this._cursorX = e8.clientX, this._cursorY = e8.clientY, this._show();
    }, this._onKeyDown = (e8) => {
      if (this._open)
        switch (e8.key) {
          case "ArrowDown":
          case "ArrowRight":
            e8.preventDefault(), this._move(1);
            break;
          case "ArrowUp":
          case "ArrowLeft":
            e8.preventDefault(), this._move(-1);
            break;
          case "Home":
            e8.preventDefault(), this._moveTo(this._firstEnabledIndex());
            break;
          case "End": {
            e8.preventDefault();
            const t5 = this.items;
            for (let a4 = t5.length - 1; a4 >= 0; a4--)
              if (!t5[a4].disabled) {
                this._activeIndex = a4, this._focusActive();
                return;
              }
            break;
          }
          case "Enter":
          case " ": {
            e8.preventDefault();
            const t5 = this.items[this._activeIndex];
            t5 && !t5.disabled && t5.activate();
            break;
          }
          case "Escape":
            this.closeOnEscape && (e8.preventDefault(), e8.stopPropagation(), this._hide());
            break;
          case "Tab":
            this._hide();
            break;
          default:
            e8.key.length === 1 && /\S/.test(e8.key) && this._typeaheadMatch(e8.key);
        }
    }, this._onPointerDown = (e8) => {
      if (!this._open || !this.closeOnClickOutside) return;
      const t5 = this._panelEl, a4 = e8.target, r6 = typeof e8.composedPath == "function" ? e8.composedPath() : [];
      Ki(t5, a4, r6) || this._hide();
    };
  }
  connectedCallback() {
    super.connectedCallback(), queueMicrotask(() => this._wireTarget()), document.addEventListener("keydown", this._onKeyDown), document.addEventListener("pointerdown", this._onPointerDown, true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unwireTarget(), document.removeEventListener("keydown", this._onKeyDown), document.removeEventListener("pointerdown", this._onPointerDown, true), this._teardownPanel();
  }
  updated(e8) {
    e8.has("target") && (this._unwireTarget(), this._wireTarget()), e8.has("_activeIndex") && this._highlightActive();
  }
  /** Returns the body-attached panel for tests / consumers. */
  getPanel() {
    return this._panelEl;
  }
  get items() {
    return this._panelEl ? Array.from(this._panelEl.querySelectorAll("ae-menu-item")) : Array.from(this.querySelectorAll("ae-menu-item"));
  }
  /** Programmatically open at a viewport position. */
  openAt(e8, t5) {
    this._cursorX = e8, this._cursorY = t5, this._show();
  }
  _resolveTarget() {
    var e8;
    if (this.target instanceof HTMLElement) return this.target;
    if (typeof this.target == "string" && this.target) {
      const t5 = this.getRootNode(), a4 = ((e8 = t5.querySelector) == null ? void 0 : e8.call(t5, this.target)) ?? document.querySelector(this.target);
      return a4 instanceof HTMLElement ? a4 : null;
    }
    return this.previousElementSibling instanceof HTMLElement ? this.previousElementSibling : null;
  }
  _wireTarget() {
    const e8 = this._resolveTarget();
    e8 && (this._targetEl = e8, e8.addEventListener("contextmenu", this._onContextMenu), e8.hasAttribute("aria-haspopup") || (e8.setAttribute("aria-haspopup", "menu"), e8.dataset.aeCmHaspopup = ""));
  }
  _unwireTarget() {
    this._targetEl && (this._targetEl.removeEventListener("contextmenu", this._onContextMenu), this._targetEl.dataset.aeCmHaspopup !== void 0 && (this._targetEl.removeAttribute("aria-haspopup"), delete this._targetEl.dataset.aeCmHaspopup), this._targetEl = null);
  }
  _show() {
    if (this._open) {
      this._position();
      return;
    }
    this._open = true, this._mountPanel(), this._previouslyFocused = document.activeElement ?? null, this._activeIndex = this._firstEnabledIndex(), this._position(), this._focusActive(), this.dispatchEvent(new CustomEvent("ae-open", { bubbles: true, composed: true }));
  }
  _hide() {
    var e8, t5;
    this._open && (this._open = false, this._unmountPanel(), (t5 = (e8 = this._previouslyFocused) == null ? void 0 : e8.focus) == null || t5.call(e8), this._previouslyFocused = null, this.dispatchEvent(new CustomEvent("ae-close", { bubbles: true, composed: true })));
  }
  _firstEnabledIndex() {
    return this.items.findIndex((e8) => !e8.disabled);
  }
  /** Deselect the other radio items sharing the activated item's group. */
  _clearRadioGroup(e8) {
    for (const t5 of this.items)
      t5 !== e8 && t5.type === "radio" && t5.name === e8.name && (t5.selected = false);
  }
  _mountPanel() {
    if (this._panelEl) return;
    const e8 = document.createElement("div");
    e8.setAttribute("part", "panel"), e8.setAttribute("role", "menu"), e8.classList.add("ae-context-menu-panel"), e8.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: var(--ae-z-popover, 1400);
      min-width: 10rem;
      max-width: 18rem;
      background: var(--ae-menu-bg, var(--ae-color-bg-elevated));
      color: var(--ae-menu-fg, var(--ae-color-fg));
      border: var(--ae-menu-border-width, var(--ae-border-width-1, 1px)) solid var(--ae-menu-border, var(--ae-color-border));
      border-radius: var(--ae-menu-radius, var(--ae-radius-md));
      box-shadow: var(--ae-menu-shadow, var(--ae-shadow-md));
      backdrop-filter: var(--ae-menu-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-menu-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      padding: var(--ae-menu-padding, var(--ae-space-1));
      box-sizing: border-box;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-sm);
      line-height: var(--ae-line-height-snug);
    `, this._placeholder = document.createComment("ae-context-menu-children"), this.appendChild(this._placeholder), this._movedChildren = [];
    const t5 = Array.from(this.childNodes);
    for (const a4 of t5)
      a4 !== this._placeholder && (this._movedChildren.push(a4), e8.appendChild(a4));
    e8.addEventListener("ae-select", (a4) => {
      const r6 = a4.detail, i7 = r6.item;
      if (!(i7 != null && i7.disabled)) {
        if (this.dispatchEvent(
          new CustomEvent("ae-select", {
            bubbles: true,
            composed: true,
            detail: r6
          })
        ), i7 && (i7.type === "checkbox" || i7.type === "radio")) {
          i7.type === "radio" && this._clearRadioGroup(i7);
          return;
        }
        this._hide();
      }
    }), document.body.appendChild(e8), this._panelEl = e8;
  }
  _unmountPanel() {
    if (this._panelEl) {
      if (this._placeholder && this._placeholder.parentNode === this) {
        for (const e8 of this._movedChildren)
          this.insertBefore(e8, this._placeholder);
        this._placeholder.remove();
      }
      this._movedChildren = [], this._placeholder = null, this._panelEl.remove(), this._panelEl = null;
    }
  }
  _teardownPanel() {
    this._panelEl && (this._panelEl.remove(), this._panelEl = null), this._movedChildren = [], this._placeholder = null;
  }
  _position() {
    const e8 = this._panelEl;
    if (!e8) return;
    const t5 = e8.getBoundingClientRect(), a4 = window.innerWidth || document.documentElement.clientWidth || 0, r6 = window.innerHeight || document.documentElement.clientHeight || 0;
    let i7 = this._cursorX, s4 = this._cursorY;
    i7 + t5.width > a4 - 4 && (i7 = Math.max(4, a4 - t5.width - 4)), s4 + t5.height > r6 - 4 && (s4 = Math.max(4, r6 - t5.height - 4)), e8.style.transform = `translate(${i7}px, ${s4}px)`;
  }
  _highlightActive() {
    this.items.forEach((t5, a4) => {
      a4 === this._activeIndex ? t5.setAttribute("data-active", "") : t5.removeAttribute("data-active");
    });
  }
  _focusActive() {
    const e8 = this.items[this._activeIndex];
    e8 == null || e8.focus();
  }
  _move(e8) {
    const t5 = this.items;
    if (t5.length === 0) return;
    let a4 = this._activeIndex;
    for (let r6 = 0; r6 < t5.length && (a4 = (a4 + e8 + t5.length) % t5.length, !!t5[a4].disabled); r6++)
      ;
    this._activeIndex = a4, this._focusActive();
  }
  _moveTo(e8) {
    const t5 = this.items;
    e8 < 0 || e8 >= t5.length || t5[e8].disabled || (this._activeIndex = e8, this._focusActive());
  }
  _typeaheadMatch(e8) {
    this._typeaheadTimer && clearTimeout(this._typeaheadTimer), this._typeahead += e8.toLowerCase(), this._typeaheadTimer = setTimeout(() => {
      this._typeahead = "", this._typeaheadTimer = null;
    }, 500);
    const t5 = this.items, a4 = (this._activeIndex + 1) % Math.max(1, t5.length);
    for (let r6 = 0; r6 < t5.length; r6++) {
      const i7 = (a4 + r6) % t5.length, s4 = t5[i7];
      if (!s4.disabled && s4.matchText.startsWith(this._typeahead)) {
        this._activeIndex = i7, this._focusActive();
        return;
      }
    }
  }
  render() {
    return b2``;
  }
};
Be.styles = i`
    :host {
      display: contents;
    }
  `;
Dt([
  n4()
], Be.prototype, "target", 2);
Dt([
  n4({ type: Boolean, reflect: true, attribute: "close-on-click-outside" })
], Be.prototype, "closeOnClickOutside", 2);
Dt([
  n4({ type: Boolean, reflect: true, attribute: "close-on-escape" })
], Be.prototype, "closeOnEscape", 2);
Dt([
  r5()
], Be.prototype, "_open", 2);
Dt([
  r5()
], Be.prototype, "_activeIndex", 2);
Be = Dt([
  t3("ae-context-menu")
], Be);
function Ki(e8, t5, a4) {
  if (!e8) return false;
  if (t5 === e8 || a4.includes(e8) || t5 && typeof e8.contains == "function" && e8.contains(t5)) return true;
  let r6 = t5;
  for (; r6; ) {
    if (r6 === e8) return true;
    r6 = r6.parentNode;
  }
  return false;
}
var Yi = Object.defineProperty;
var Wi = Object.getOwnPropertyDescriptor;
var Xt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Wi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Yi(t5, a4, i7), i7;
};
var rt = class extends i4 {
  constructor() {
    super(...arguments), this.value = "", this.label = "", this.disabled = false, this.active = false;
  }
  render() {
    return b2`
      <div
        class="panel"
        role="tabpanel"
        id="panel-${this.value}"
        ?hidden=${!this.active}
        tabindex=${this.active ? "0" : "-1"}
      >
        <slot name="panel"></slot>
      </div>
    `;
  }
  /** The rendered `role="tabpanel"` element, for cross-shadow ARIA wiring. */
  get panelElement() {
    var e8;
    return ((e8 = this.renderRoot) == null ? void 0 : e8.querySelector(".panel")) ?? null;
  }
  /** Plain-text label, used when slotted content can't be extracted. */
  get triggerLabel() {
    var e8;
    return this.label || ((e8 = this.textContent) == null ? void 0 : e8.trim()) || this.value;
  }
};
rt.styles = i`
    :host {
      display: contents;
    }
    .panel {
      display: block;
    }
    :host(:not([active])) .panel {
      display: none;
    }
  `;
Xt([
  n4({ type: String, reflect: true })
], rt.prototype, "value", 2);
Xt([
  n4({ type: String, reflect: true })
], rt.prototype, "label", 2);
Xt([
  n4({ type: Boolean, reflect: true })
], rt.prototype, "disabled", 2);
Xt([
  n4({ type: Boolean, reflect: true })
], rt.prototype, "active", 2);
rt = Xt([
  t3("ae-tab")
], rt);
var Gi = Object.defineProperty;
var Xi = Object.getOwnPropertyDescriptor;
var ut = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Xi(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Gi(t5, a4, i7), i7;
};
var xe = class extends i4 {
  constructor() {
    super(...arguments), this.selected = "", this.orientation = "horizontal", this.variant = "line", this.keyboardActivation = "auto", this._focusIndex = 0, this._onSlotChange = () => {
      var e8;
      if (!this.selected && ((e8 = this._tabs) != null && e8.length)) {
        const t5 = this._tabs.find((a4) => !a4.disabled);
        t5 && (this.selected = t5.value);
      }
      this._syncTabs(), this.requestUpdate(), this._syncPanelRefs();
    };
  }
  render() {
    const e8 = this._tabs ?? [], t5 = this.orientation;
    return b2`
      <div
        part="tablist"
        class="tablist"
        role="tablist"
        aria-orientation=${t5}
      >
        ${e8.map((a4, r6) => {
      const i7 = a4.value === this.selected, s4 = r6 === this._focusIndex ? 0 : -1;
      return b2`
            <button
              part="tab"
              class="tab"
              role="tab"
              type="button"
              id="tab-${a4.value}"
              aria-selected=${i7 ? "true" : "false"}
              tabindex=${s4}
              ?disabled=${a4.disabled}
              data-index=${r6}
              @click=${() => this._onTabClick(r6)}
              @keydown=${(o9) => this._onKeyDown(o9, r6)}
            >
              ${a4.triggerLabel}
            </button>
          `;
    })}
      </div>
      <div part="panels" class="panels">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }
  firstUpdated() {
    var e8;
    if (!this.selected && ((e8 = this._tabs) != null && e8.length)) {
      const t5 = this._tabs.find((a4) => !a4.disabled);
      t5 && (this.selected = t5.value);
    }
    this._syncTabs(), this._syncPanelRefs();
  }
  updated(e8) {
    e8.has("selected") && this._syncTabs(), this._syncPanelRefs();
  }
  /**
   * Bidirectionally associate each tab trigger (rendered in this shadow
   * root) with its panel (rendered inside the corresponding `<ae-tab>`'s
   * own shadow root). Each relationship — the trigger's `aria-controls`
   * and the panel's `aria-labelledby` — crosses a shadow boundary, so it
   * is expressed with AOM element references rather than string IDREFs.
   * The string-id fallback (`tab-*` / `panel-*`) stays on the elements for
   * runtimes without element reflection.
   */
  async _syncPanelRefs() {
    var t5;
    await this.updateComplete;
    const e8 = this._tabs ?? [];
    await Promise.all(e8.map((a4) => a4.updateComplete));
    for (let a4 = 0; a4 < e8.length; a4++) {
      const r6 = e8[a4], i7 = (t5 = this.shadowRoot) == null ? void 0 : t5.querySelector(
        `button.tab[data-index="${a4}"]`
      ), s4 = r6.panelElement;
      !i7 || !s4 || (Ie(i7, [s4]), ai(s4, [i7]));
    }
  }
  _syncTabs() {
    const e8 = this._tabs ?? [];
    let t5 = false;
    for (let a4 = 0; a4 < e8.length; a4++) {
      const r6 = e8[a4], i7 = r6.value === this.selected && !r6.disabled;
      r6.active = i7, i7 && (t5 = true, this._focusIndex = a4);
    }
    if (!t5 && e8.length) {
      const a4 = e8.findIndex((r6) => !r6.disabled);
      a4 >= 0 && (this._focusIndex = a4);
    }
  }
  _onTabClick(e8) {
    const t5 = this._tabs[e8];
    !t5 || t5.disabled || (this._focusIndex = e8, this._select(t5.value));
  }
  _onKeyDown(e8, t5) {
    const a4 = this._tabs ?? [], r6 = this.orientation === "horizontal", i7 = r6 ? "ArrowRight" : "ArrowDown", s4 = r6 ? "ArrowLeft" : "ArrowUp";
    let o9 = this._focusIndex, h3 = false;
    if (e8.key === i7)
      o9 = this._nextEnabled(this._focusIndex, 1), h3 = true;
    else if (e8.key === s4)
      o9 = this._nextEnabled(this._focusIndex, -1), h3 = true;
    else if (e8.key === "Home")
      o9 = this._nextEnabled(-1, 1), h3 = true;
    else if (e8.key === "End")
      o9 = this._nextEnabled(a4.length, -1), h3 = true;
    else if (e8.key === "Enter" || e8.key === " ") {
      const d3 = a4[this._focusIndex];
      d3 && !d3.disabled && this._select(d3.value), h3 = true;
    }
    if (h3) {
      e8.preventDefault(), e8.stopPropagation(), this._focusIndex = o9;
      const d3 = a4[o9];
      this.updateComplete.then(() => {
        var b3;
        const p3 = (b3 = this.shadowRoot) == null ? void 0 : b3.querySelector(
          `button.tab[data-index="${o9}"]`
        );
        p3 == null || p3.focus(), this.keyboardActivation === "auto" && d3 && !d3.disabled && this._select(d3.value);
      });
    }
  }
  _nextEnabled(e8, t5) {
    var s4;
    const a4 = this._tabs ?? [], r6 = a4.length;
    if (r6 === 0) return 0;
    let i7 = e8;
    for (let o9 = 0; o9 < r6; o9++)
      if (i7 = (i7 + t5 + r6) % r6, !((s4 = a4[i7]) != null && s4.disabled)) return i7;
    return Math.max(0, e8);
  }
  _select(e8) {
    if (e8 === this.selected) return;
    const t5 = this.selected;
    this.selected = e8, this.dispatchEvent(
      new CustomEvent("ae-tab-change", {
        bubbles: true,
        composed: true,
        detail: { value: e8, previousValue: t5 }
      })
    );
  }
};
xe.styles = i`
    :host {
      display: block;
      font-family: var(--ae-font-family-sans);
    }

    :host([orientation='vertical']) {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: var(--ae-space-4);
    }

    .tablist {
      display: inline-flex;
      gap: var(--ae-tabs-tablist-gap, var(--ae-space-1));
      background: var(--ae-tabs-tablist-bg, transparent);
      border-bottom: var(--ae-tabs-tablist-border-width, var(--ae-border-width-1))
        solid var(--ae-tabs-tablist-border-color, var(--ae-color-border));
    }
    :host([orientation='vertical']) .tablist {
      flex-direction: column;
      border-bottom: 0;
      border-right: var(--ae-tabs-tablist-border-width, var(--ae-border-width-1))
        solid var(--ae-tabs-tablist-border-color, var(--ae-color-border));
      padding-right: var(--ae-space-2);
      align-items: stretch;
    }

    .panels {
      padding-top: var(--ae-space-4);
    }
    :host([orientation='vertical']) .panels {
      padding-top: 0;
    }

    button.tab {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ae-tabs-tab-gap, var(--ae-space-2));
      padding: var(--ae-space-2) var(--ae-space-4);
      font-family: var(--ae-tabs-tab-font-family, inherit);
      font-size: var(--ae-tabs-tab-font-size, var(--ae-font-size-sm));
      font-weight: var(--ae-tabs-tab-font-weight, var(--ae-font-weight-medium));
      letter-spacing: var(--ae-tabs-tab-letter-spacing, normal);
      text-transform: var(--ae-tabs-tab-text-transform, none);
      color: var(--ae-tabs-tab-fg-inactive, var(--ae-color-fg-muted));
      border-radius: var(--ae-radius-default);
      transition:
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out);
      position: relative;
      white-space: nowrap;
    }
    button.tab:hover:not(:disabled) {
      color: var(--ae-color-fg);
    }
    button.tab:focus-visible {
      ${y3}
    }
    button.tab:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Variant: line (default) */
    :host([variant='line']) button.tab {
      border-radius: 0;
      padding: var(--ae-tabs-tab-padding, var(--ae-space-2) var(--ae-space-3));
      margin-bottom: -1px;
      border-bottom:
        var(--ae-tabs-indicator-height, 2px) solid transparent;
      /* Optional separator between adjacent tabs — used by Metro to
       * draw a 2px ink rule between file-tab cells. Default none. */
      border-right: var(--ae-tabs-tab-separator, 0 solid transparent);
    }
    :host([variant='line']) button.tab[aria-selected='true'] {
      background: var(--ae-tabs-tab-bg-active, transparent);
      color: var(--ae-tabs-tab-fg-active, var(--ae-color-accent-emphasis));
      border-bottom-color:
        var(--ae-tabs-indicator-color, var(--ae-color-accent));
    }
    /* Optional pre-label status dot on the active line tab — the source
     * design's vermilion signal dot. Defaults to display:none so only the
     * opted-in themes (Metro) render it, and a hidden pseudo consumes no flex
     * gap. Metro flips display to inline-block, 8px, accent. */
    :host([variant='line']) button.tab[aria-selected='true']::before {
      content: '';
      display: var(--ae-tabs-active-marker-display, none);
      flex: 0 0 auto;
      width: var(--ae-tabs-active-marker-size, 0.5rem);
      height: var(--ae-tabs-active-marker-size, 0.5rem);
      border-radius: var(--ae-radius-full);
      background: var(--ae-tabs-active-marker-color, var(--ae-color-accent));
    }
    :host([orientation='vertical'][variant='line']) button.tab {
      margin-bottom: 0;
      margin-right: -1px;
      border-bottom: 0;
      border-right:
        var(--ae-tabs-indicator-height, 2px) solid transparent;
      justify-content: flex-start;
    }
    :host([orientation='vertical'][variant='line']) button.tab[aria-selected='true'] {
      border-right-color:
        var(--ae-tabs-indicator-color, var(--ae-color-accent));
    }

    /* Variant: pill */
    :host([variant='pill']) .tablist {
      /* Default invisible; a theme can opt into a hairline frame around the
       * pill track by setting the width token. Kept independent of the line
       * variant's bottom border. */
      border: var(--ae-tabs-pill-tablist-border-width, 0) solid
        var(--ae-color-border-subtle);
      /* Themeable so a pack can flip the pill canvas independently of the line
       * variant's --ae-tabs-tablist-bg. Metro points this at ink (its file-tab
       * canvas) so its light paper@70% inactive-tab text stays legible — on the
       * default --ae-color-bg-muted, a light inactive fg would wash out. */
      background: var(--ae-tabs-pill-tablist-bg, var(--ae-color-bg-muted));
      /* Frosted-glass hook on the pill track — inert unless a theme opts in
       * (Crucible) via --ae-surface-backdrop-filter over a translucent track. */
      backdrop-filter: var(--ae-tabs-pill-tablist-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-tabs-pill-tablist-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      padding: var(--ae-space-1);
      border-radius: var(--ae-radius-default);
      /* Independent of the line tablist gap (--ae-tabs-tablist-gap) so the line
       * variant can open to a wide gap without pulling the pill track apart. */
      gap: var(--ae-tabs-pill-tablist-gap, 2px);
    }
    :host([variant='pill']) button.tab {
      /* Pill tabs inherit the base padding by default; tokenized so a theme
       * can size pill tabs independently of the line variant. Fallback equals
       * the inherited base padding to keep default rendering byte-identical. */
      padding: var(--ae-tabs-pill-tab-padding, var(--ae-space-2) var(--ae-space-4));
    }
    :host([variant='pill']) button.tab[aria-selected='true'] {
      background: var(--ae-tabs-pill-tab-bg-active, var(--ae-color-bg));
      color: var(--ae-tabs-pill-tab-fg-active, var(--ae-color-fg));
      box-shadow: var(--ae-tabs-pill-tab-shadow-active, var(--ae-shadow-xs));
      /* The raised active pill can frost over the track (Crucible). */
      backdrop-filter: var(--ae-tabs-pill-tab-backdrop-filter, none);
      -webkit-backdrop-filter: var(--ae-tabs-pill-tab-backdrop-filter, none);
    }

    /* Variant: enclosed */
    :host([variant='enclosed']) button.tab {
      border: var(--ae-border-width-1) solid transparent;
      border-radius: var(--ae-radius-default) var(--ae-radius-default) 0 0;
      margin-bottom: -1px;
    }
    :host([variant='enclosed']) button.tab[aria-selected='true'] {
      background: var(--ae-color-bg);
      border-color: var(--ae-color-border);
      border-bottom-color: var(--ae-color-bg);
      color: var(--ae-color-fg);
    }

    .panels ::slotted(ae-tab) {
      display: block;
    }
  `;
ut([
  n4({ type: String, reflect: true })
], xe.prototype, "selected", 2);
ut([
  n4({ type: String, reflect: true })
], xe.prototype, "orientation", 2);
ut([
  n4({ type: String, reflect: true })
], xe.prototype, "variant", 2);
ut([
  n4({ type: String, reflect: true, attribute: "keyboard-activation" })
], xe.prototype, "keyboardActivation", 2);
ut([
  r5()
], xe.prototype, "_focusIndex", 2);
ut([
  o6({ selector: "ae-tab" })
], xe.prototype, "_tabs", 2);
xe = ut([
  t3("ae-tabs")
], xe);
var Zi = Object.defineProperty;
var Ji = Object.getOwnPropertyDescriptor;
var Oa = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ji(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Zi(t5, a4, i7), i7;
};
var Ht = class extends i4 {
  constructor() {
    super(...arguments), this.href = "", this.current = false;
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "listitem");
  }
  render() {
    return this.current || !this.href ? b2`<span class="current" aria-current=${this.current ? "page" : A}>
        <slot name="start"></slot><slot></slot>
      </span>` : b2`<a href=${this.href}>
      <slot name="start"></slot><slot></slot>
    </a>`;
  }
};
Ht.styles = i`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-1);
      font-family: var(--ae-breadcrumb-item-font-family, inherit);
      font-size: var(--ae-breadcrumb-item-font-size, var(--ae-font-size-sm));
      font-weight: var(--ae-breadcrumb-item-font-weight, inherit);
      letter-spacing: var(--ae-breadcrumb-item-tracking, normal);
      text-transform: var(--ae-breadcrumb-item-transform, none);
      color: var(--ae-breadcrumb-item-fg, var(--ae-color-fg-muted));
      line-height: 1;
    }

    /* Current page. Metro fills the cell with signage gold + full-ink text —
       the same active-cell treatment pagination uses — while default themes
       just ink the text and bump the weight. The fill sits on the host so it
       spans the whole stretched cell; the inner padding insets the label. */
    :host([current]) {
      color: var(--ae-breadcrumb-item-fg-current, var(--ae-color-fg));
      font-weight: var(--ae-breadcrumb-item-font-weight-current, var(--ae-font-weight-medium));
      background: var(--ae-breadcrumb-item-bg-current, transparent);
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-1);
      color: inherit;
      text-decoration: none;
      border-radius: var(--ae-radius-xs);
      /* The cell box. Default keeps a padded hit-area with a negative margin so
         it adds no visible inset (a compact trail); Metro overrides to a real
         8x14 ticket cell with 0 margin so cells sit flush inside the ink rule. */
      padding: var(--ae-breadcrumb-item-padding, 2px 4px);
      margin: var(--ae-breadcrumb-item-margin, -2px -4px);
      transition: color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    a:hover {
      color: var(--ae-color-accent-emphasis);
      text-decoration: underline;
      text-underline-offset: 0.18em;
    }
    a:focus-visible {
      ${y3}
    }

    .current {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-1);
      /* Match the link cell's box so the gold fill + flush layout apply to the
         current page too. Default themes leave it inset-free (0/0). */
      padding: var(--ae-breadcrumb-item-padding, 0);
      margin: var(--ae-breadcrumb-item-margin, 0);
    }
  `;
Oa([
  n4({ type: String, reflect: true })
], Ht.prototype, "href", 2);
Oa([
  n4({ type: Boolean, reflect: true })
], Ht.prototype, "current", 2);
Ht = Oa([
  t3("ae-breadcrumb-item")
], Ht);
var Qi = Object.defineProperty;
var es = Object.getOwnPropertyDescriptor;
var Ta = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? es(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Qi(t5, a4, i7), i7;
};
var Ut = class extends i4 {
  constructor() {
    super(...arguments), this.separator = "/", this._onSlotChange = () => this._syncSeparators();
  }
  render() {
    return b2`
      <nav aria-label="Breadcrumb">
        <ol part="list" role="list">
          <slot @slotchange=${this._onSlotChange}></slot>
        </ol>
      </nav>
    `;
  }
  /**
   * Insert one separator after every item except the last.
   *
   * This MUST be idempotent. Separators live in the LIGHT DOM (so they project
   * through the slot and sit between items), which means inserting/removing one
   * re-fires `slotchange` — and `slotchange` is async, so a re-entrancy flag
   * reset synchronously can't gate it. The old version removed-and-re-added
   * every separator on each call, so every `slotchange` mutated again and
   * re-fired `slotchange`: an infinite microtask loop that starves the task
   * queue, so `DOMContentLoaded` never fires and the page hangs.
   *
   * Idempotency breaks the cascade: once the separators are already correct
   * this makes NO structural mutation (text-only edits don't fire slotchange),
   * so the second pass is a no-op and the loop terminates. happy-dom doesn't
   * replicate the async slotchange microtask queue, so only a real browser
   * exhibited the hang — caught by the visual-QA sweep.
   */
  _syncSeparators() {
    const e8 = Array.from(
      this.querySelectorAll(":scope > ae-breadcrumb-item")
    ), t5 = /* @__PURE__ */ new Set();
    for (let a4 = 0; a4 < e8.length - 1; a4++) {
      const r6 = e8[a4].nextElementSibling;
      if (r6 instanceof HTMLElement && r6.dataset.aeSep === "")
        r6.textContent !== this.separator && (r6.textContent = this.separator), t5.add(r6);
      else {
        const i7 = this._makeSeparator();
        e8[a4].after(i7), t5.add(i7);
      }
    }
    for (const a4 of this.querySelectorAll(":scope > [data-ae-sep]"))
      t5.has(a4) || a4.remove();
  }
  _makeSeparator() {
    const e8 = document.createElement("span");
    return e8.dataset.aeSep = "", e8.setAttribute("aria-hidden", "true"), e8.setAttribute("part", "separator"), e8.className = "separator", e8.textContent = this.separator, e8.style.cssText = "display:inline-flex;align-items:center;user-select:none;padding:var(--ae-breadcrumb-separator-padding, 0 var(--ae-space-2));color:var(--ae-breadcrumb-separator-color, var(--ae-color-fg-subtle));font-size:var(--ae-breadcrumb-separator-font-size, var(--ae-font-size-sm));font-weight:var(--ae-breadcrumb-separator-font-weight, inherit);border-inline-end:var(--ae-breadcrumb-separator-divider, none);", e8;
  }
  updated(e8) {
    e8.has("separator") && this._syncSeparators();
  }
  /** Returns currently slotted item elements. */
  get items() {
    return this._items ?? [];
  }
};
Ut.styles = i`
    :host {
      display: inline-flex;
      vertical-align: middle;
      font-family: var(--ae-font-family-sans);
    }

    nav {
      display: inline-block;
    }

    ol {
      list-style: none;
      margin: 0;
      padding: 0;
      display: inline-flex;
      flex-wrap: wrap;
      /* stretch (Metro) lets the current cell's fill + the ink-rule dividers
         span the full strip height; default themes keep center for a plain
         trail where every part is the same single-line height anyway. */
      align-items: var(--ae-breadcrumb-align, center);
      gap: 0;
      /* Themeable container chrome. Metro wraps the whole trail in a 2px ink
         rule on a paper ground (a route-ticket strip); default themes paint
         nothing, so the trail stays borderless inline text. */
      background: var(--ae-breadcrumb-bg, transparent);
      border: var(--ae-breadcrumb-border, none);
    }

    li {
      display: inline-flex;
      align-items: center;
    }

    .separator {
      display: inline-flex;
      align-items: center;
      padding: 0 var(--ae-space-2);
      color: var(--ae-color-fg-subtle);
      user-select: none;
      font-size: var(--ae-font-size-sm);
    }
  `;
Ta([
  n4({ type: String, reflect: true })
], Ut.prototype, "separator", 2);
Ta([
  o6({ selector: "ae-breadcrumb-item" })
], Ut.prototype, "_items", 2);
Ut = Ta([
  t3("ae-breadcrumb")
], Ut);
var ts = Object.defineProperty;
var as = Object.getOwnPropertyDescriptor;
var Pt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? as(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ts(t5, a4, i7), i7;
};
var he = class extends i4 {
  constructor() {
    super(...arguments), this.open = false, this.placeholder = "Search\u2026", this.items = [], this._query = "", this._activeIndex = 0, this._previouslyFocused = null, this._bgInert = new Pa(), this._onBackdropClick = (e8) => {
      e8.target === e8.currentTarget && (this.open = false);
    }, this._onInput = (e8) => {
      this._query = e8.target.value, this._activeIndex = 0;
    }, this._onKeyDown = (e8) => {
      const t5 = this._filtered();
      if (e8.key === "Escape") {
        e8.preventDefault(), this.open = false;
        return;
      }
      if (e8.key === "Tab") {
        this._trapTab(e8);
        return;
      }
      if (e8.key === "ArrowDown") {
        if (e8.preventDefault(), t5.length === 0) return;
        this._activeIndex = (this._activeIndex + 1) % t5.length;
        return;
      }
      if (e8.key === "ArrowUp") {
        if (e8.preventDefault(), t5.length === 0) return;
        this._activeIndex = (this._activeIndex - 1 + t5.length) % t5.length;
        return;
      }
      if (e8.key === "Home") {
        e8.preventDefault(), this._activeIndex = 0;
        return;
      }
      if (e8.key === "End") {
        e8.preventDefault(), this._activeIndex = Math.max(0, t5.length - 1);
        return;
      }
      if (e8.key === "Enter") {
        e8.preventDefault();
        const a4 = t5[this._activeIndex];
        a4 && this._activate(a4);
      }
    };
  }
  /** Finds the search input wherever it lives (portaled to body). */
  _findInput() {
    var r6, i7;
    const e8 = this.renderRoot.querySelector("ae-portal");
    if (!e8) return null;
    const t5 = (r6 = e8.shadowRoot) == null ? void 0 : r6.querySelector("slot"), a4 = (t5 == null ? void 0 : t5.assignedNodes({ flatten: true })) ?? [];
    for (const s4 of a4)
      if (s4 instanceof Element) {
        const o9 = (i7 = s4.querySelector) == null ? void 0 : i7.call(s4, "input.ae-cp-search");
        if (o9 instanceof HTMLInputElement) return o9;
      }
    return document.querySelector("input.ae-cp-search");
  }
  connectedCallback() {
    super.connectedCallback(), this.open && requestAnimationFrame(() => this._bgInert.activate(this._findInput()));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._bgInert.release();
  }
  updated(e8) {
    var t5;
    if (e8.has("open"))
      if (this.open)
        this._query = "", this._activeIndex = 0, this._previouslyFocused = document.activeElement ?? null, this.updateComplete.then(() => {
          requestAnimationFrame(() => {
            const a4 = this._findInput();
            a4 == null || a4.focus(), this._bgInert.activate(a4);
          });
        }), this.dispatchEvent(
          new CustomEvent("ae-open-change", {
            bubbles: true,
            composed: true,
            detail: { open: true }
          })
        );
      else {
        this._bgInert.release();
        const a4 = this._previouslyFocused;
        this._previouslyFocused = null, (t5 = a4 == null ? void 0 : a4.focus) == null || t5.call(a4), this.dispatchEvent(
          new CustomEvent("ae-open-change", {
            bubbles: true,
            composed: true,
            detail: { open: false }
          })
        );
      }
  }
  /** Filtered items based on the current query. */
  _filtered() {
    const e8 = this._query.trim().toLowerCase();
    return e8 ? this.items.filter((t5) => [
      t5.label,
      t5.hint ?? "",
      (t5.keywords ?? []).join(" ")
    ].join(" ").toLowerCase().includes(e8)) : this.items;
  }
  /** Items grouped by `group` field (in original order). */
  _grouped() {
    const e8 = this._filtered(), t5 = [], a4 = /* @__PURE__ */ new Map();
    for (const r6 of e8) {
      const i7 = r6.group ?? null;
      let s4 = a4.get(i7);
      s4 === void 0 && (s4 = t5.length, a4.set(i7, s4), t5.push({ label: i7, items: [] })), t5[s4].items.push(r6);
    }
    return t5;
  }
  render() {
    if (!this.open) return A;
    const e8 = this._grouped(), t5 = this._filtered(), a4 = t5[this._activeIndex], r6 = a4 ? `ae-cp-item-${a4.id}` : "";
    return b2`
      <ae-portal>
        <style>${he.PORTAL_CSS}</style>
        <div
          class="ae-cp-backdrop"
          @click=${this._onBackdropClick}
          @keydown=${this._onKeyDown}
        >
          <div
            class="ae-cp-card"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            @click=${(i7) => i7.stopPropagation()}
          >
            <div class="ae-cp-search-wrap">
              <svg
                class="ae-cp-search-icon"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M11 11 L14 14"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <input
                class="ae-cp-search"
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="ae-cp-list"
                aria-activedescendant=${r6 || A}
                aria-autocomplete="list"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                .value=${this._query}
                placeholder=${this.placeholder}
                @input=${this._onInput}
              />
            </div>
            ${t5.length === 0 ? b2`<div class="ae-cp-empty">No results</div>` : b2`<ul
                  id="ae-cp-list"
                  class="ae-cp-list"
                  role="listbox"
                  aria-label="Commands"
                >
                  ${this._renderGroups(e8, t5)}
                </ul>`}
            <!-- Polite result-count announcement so filtering is conveyed (4.1.3). -->
            <div class="ae-cp-status" role="status" aria-live="polite">
              ${t5.length} result${t5.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </ae-portal>
    `;
  }
  _renderGroups(e8, t5) {
    return e8.map(
      (a4) => b2`
        ${a4.label ? b2`<li class="ae-cp-group-label" role="presentation">${a4.label}</li>` : A}
        ${a4.items.map((r6) => {
        const i7 = t5.indexOf(r6), s4 = i7 === this._activeIndex;
        return b2`<li
            class="ae-cp-item"
            role="option"
            id="ae-cp-item-${r6.id}"
            aria-selected=${s4 ? "true" : "false"}
            data-index=${i7}
            @mousemove=${() => this._activeIndex = i7}
            @click=${() => this._activate(r6)}
          >
            <span class="ae-cp-item-label">${r6.label}</span>
            ${r6.hint ? b2`<span class="ae-cp-item-hint">${r6.hint}</span>` : A}
          </li>`;
      })}
      `
    );
  }
  /** Keep Tab focus cycling within the palette card (aria-modal trap). */
  _trapTab(e8) {
    var o9, h3;
    const t5 = (h3 = (o9 = e8.currentTarget) == null ? void 0 : o9.querySelector) == null ? void 0 : h3.call(o9, ".ae-cp-card");
    if (!t5) return;
    const a4 = Array.from(
      t5.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((d3) => d3.offsetParent !== null || d3 === document.activeElement);
    if (a4.length === 0) {
      e8.preventDefault();
      return;
    }
    const r6 = a4[0], i7 = a4[a4.length - 1], s4 = document.activeElement;
    e8.shiftKey && (s4 === r6 || !t5.contains(s4)) ? (e8.preventDefault(), i7.focus()) : !e8.shiftKey && (s4 === i7 || !t5.contains(s4)) && (e8.preventDefault(), r6.focus());
  }
  _activate(e8) {
    var t5;
    this.dispatchEvent(
      new CustomEvent("ae-select", {
        bubbles: true,
        composed: true,
        detail: { item: e8 }
      })
    );
    try {
      (t5 = e8.action) == null || t5.call(e8);
    } catch {
    }
    this.open = false;
  }
};
he.styles = i`
    :host {
      display: contents;
    }
  `;
he.PORTAL_CSS = `
    .ae-cp-backdrop {
      position: fixed;
      inset: 0;
      background: var(--ae-color-bg-overlay);
      z-index: var(--ae-z-modal);
      display: grid;
      place-items: start center;
      padding-top: 12vh;
      animation: ae-cp-fade-in var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .ae-cp-card {
      width: min(640px, calc(100vw - 2rem));
      max-height: 70vh;
      background: var(--ae-command-palette-bg, var(--ae-color-bg-elevated));
      border: var(--ae-command-palette-border-width, var(--ae-border-width-1))
        solid var(--ae-command-palette-border, var(--ae-color-border));
      border-radius: var(--ae-command-palette-radius, var(--ae-radius-xl));
      box-shadow: var(--ae-command-palette-shadow, var(--ae-shadow-2xl));
      backdrop-filter: var(--ae-command-palette-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-command-palette-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: var(--ae-command-palette-font-family, var(--ae-font-family-sans));
      color: var(--ae-color-fg);
    }
    .ae-cp-search-wrap {
      display: flex;
      align-items: center;
      gap: var(--ae-space-2);
      padding: var(--ae-space-3) var(--ae-space-4);
      border-bottom: var(--ae-command-palette-header-border-width, var(--ae-border-width-1))
        solid var(--ae-command-palette-header-border, var(--ae-color-border));
    }
    .ae-cp-search-icon { color: var(--ae-color-fg-subtle); flex: 0 0 auto; }
    .ae-cp-search {
      all: unset;
      flex: 1 1 auto;
      font-family: inherit;
      font-size: var(--ae-font-size-md);
      color: var(--ae-color-fg);
    }
    .ae-cp-search::placeholder { color: var(--ae-color-fg-subtle); }
    .ae-cp-list {
      list-style: none; margin: 0; padding: var(--ae-space-2) 0;
      overflow-y: auto; flex: 1 1 auto;
    }
    .ae-cp-group-label {
      padding: var(--ae-space-2) var(--ae-space-4) var(--ae-space-1);
      font-size: var(--ae-font-size-xs);
      text-transform: uppercase;
      letter-spacing: var(--ae-command-palette-section-tracking, var(--ae-letter-spacing-wide));
      font-weight: var(--ae-font-weight-semibold);
      background: var(--ae-command-palette-section-bg, transparent);
      color: var(--ae-command-palette-section-fg, var(--ae-color-fg-subtle));
    }
    .ae-cp-item {
      display: flex; align-items: center; gap: var(--ae-space-3);
      padding: var(--ae-space-2) var(--ae-space-4);
      cursor: pointer; color: var(--ae-color-fg);
      font-size: var(--ae-font-size-sm);
      border-bottom: var(--ae-command-palette-item-divider, none);
    }
    .ae-cp-item[aria-selected='true'] {
      background: var(--ae-command-palette-selected-bg, var(--ae-color-accent-subtle));
      color: var(--ae-command-palette-selected-fg, var(--ae-color-accent-emphasis));
    }
    .ae-cp-item-label {
      flex: 1 1 auto; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .ae-cp-item-hint {
      flex: 0 0 auto;
      color: var(--ae-color-fg-subtle);
      font-size: var(--ae-font-size-xs);
    }
    .ae-cp-empty {
      padding: var(--ae-space-6) var(--ae-space-4);
      text-align: center;
      color: var(--ae-color-fg-subtle);
      font-size: var(--ae-font-size-sm);
    }
    .ae-cp-status {
      position: absolute;
      width: 1px; height: 1px;
      padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0);
      white-space: nowrap; border: 0;
    }
    @keyframes ae-cp-fade-in {
      from { opacity: 0; } to { opacity: 1; }
    }
  `;
Pt([
  n4({ type: Boolean, reflect: true })
], he.prototype, "open", 2);
Pt([
  n4({ type: String })
], he.prototype, "placeholder", 2);
Pt([
  n4({ attribute: false })
], he.prototype, "items", 2);
Pt([
  r5()
], he.prototype, "_query", 2);
Pt([
  r5()
], he.prototype, "_activeIndex", 2);
he = Pt([
  t3("ae-command-palette")
], he);
var rs = Object.defineProperty;
var is = Object.getOwnPropertyDescriptor;
var Ot = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? is(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && rs(t5, a4, i7), i7;
};
var Fe = class extends i4 {
  constructor() {
    super(...arguments), this.count = 1, this.page = 1, this.siblings = 1, this.boundaries = 1, this.disabled = false;
  }
  /**
   * Computes the page list as numbers + 'ellipsis' markers.
   * Always includes boundary pages, the current page, and siblings.
   */
  _pages() {
    const e8 = Math.max(1, Math.floor(this.count)), t5 = Math.min(e8, Math.max(1, Math.floor(this.page))), a4 = Math.max(0, Math.floor(this.boundaries)), r6 = Math.max(0, Math.floor(this.siblings)), i7 = a4 * 2 + r6 * 2 + 3;
    if (e8 <= i7)
      return Array.from({ length: e8 }, (g2, m2) => m2 + 1);
    const s4 = Array.from({ length: a4 }, (g2, m2) => m2 + 1), o9 = Array.from(
      { length: a4 },
      (g2, m2) => e8 - a4 + 1 + m2
    ), h3 = Math.max(
      Math.min(t5 - r6, e8 - a4 - r6 * 2 - 1),
      a4 + 2
    ), d3 = Math.min(
      Math.max(t5 + r6, a4 + r6 * 2 + 2),
      e8 - a4 - 1
    ), p3 = [];
    p3.push(...s4), h3 > a4 + 2 ? p3.push("ellipsis-start") : a4 + 1 < h3 && p3.push(a4 + 1);
    for (let g2 = h3; g2 <= d3; g2++) p3.push(g2);
    d3 < e8 - a4 - 1 ? p3.push("ellipsis-end") : d3 < e8 - a4 && p3.push(e8 - a4), p3.push(...o9);
    const b3 = /* @__PURE__ */ new Set();
    return p3.filter((g2) => b3.has(g2) ? false : (b3.add(g2), true));
  }
  render() {
    const e8 = Math.max(1, Math.floor(this.count)), t5 = Math.min(e8, Math.max(1, Math.floor(this.page))), a4 = !this.disabled && t5 > 1, r6 = !this.disabled && t5 < e8;
    return b2`
      <nav part="nav" aria-label="Pagination">
        <ul part="list">
          <li>
            <button
              part="prev"
              class="item"
              type="button"
              aria-label="Previous page"
              ?disabled=${!a4}
              @click=${() => this._go(t5 - 1)}
            >
              ‹
            </button>
          </li>
          ${this._pages().map((i7) => i7 === "ellipsis-start" || i7 === "ellipsis-end" ? b2`<li>
                <span class="ellipsis" aria-hidden="true">…</span>
              </li>` : b2`<li>
              <button
                part="item"
                class="item"
                type="button"
                aria-label="Page ${i7}"
                aria-current=${i7 === t5 ? "page" : A}
                ?disabled=${this.disabled}
                data-page=${i7}
                @click=${() => this._go(i7)}
              >
                ${i7}
              </button>
            </li>`)}
          <li>
            <button
              part="next"
              class="item"
              type="button"
              aria-label="Next page"
              ?disabled=${!r6}
              @click=${() => this._go(t5 + 1)}
            >
              ›
            </button>
          </li>
        </ul>
      </nav>
    `;
  }
  _go(e8) {
    const t5 = Math.max(1, Math.floor(this.count)), a4 = Math.min(t5, Math.max(1, Math.floor(e8)));
    if (a4 === this.page || this.disabled) return;
    const r6 = this.page;
    this.page = a4, this.dispatchEvent(
      new CustomEvent("ae-page-change", {
        bubbles: true,
        composed: true,
        detail: { page: a4, previousPage: r6 }
      })
    );
  }
};
Fe.styles = i`
    :host {
      display: inline-flex;
      vertical-align: middle;
      font-family: var(--ae-font-family-sans);
    }

    nav {
      display: inline-block;
    }

    ul {
      display: inline-flex;
      gap: var(--ae-pagination-gap, var(--ae-space-1));
      list-style: none;
      margin: 0;
      padding: 0;
      align-items: center;
      border: var(--ae-pagination-list-border, none);
    }

    li {
      display: inline-flex;
    }

    button.item {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      padding: 0 var(--ae-space-2);
      border-radius:
        var(--ae-pagination-item-radius, var(--ae-radius-default));
      cursor: pointer;
      font-size: var(--ae-font-size-sm);
      font-weight: var(--ae-font-weight-medium);
      color: var(--ae-color-fg-muted);
      background: transparent;
      border: var(--ae-border-width-1) solid transparent;
      /* Optional separator between adjacent items — used by Metro to
       * draw a 2px ink right-rule between cells in a connected row. */
      border-right:
        var(--ae-pagination-item-separator, 0 solid transparent);
      transition:
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        background-color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    button.item:hover:not(:disabled) {
      background: var(--ae-color-bg-muted);
      color: var(--ae-color-fg);
    }
    button.item:focus-visible {
      ${y3}
    }
    button.item:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    button.item[aria-current='page'] {
      background:
        var(--ae-pagination-item-bg-active, var(--ae-color-accent));
      color:
        var(--ae-pagination-item-fg-active, var(--ae-color-fg-on-accent));
    }
    button.item[aria-current='page']:hover {
      background:
        var(--ae-pagination-item-bg-active, var(--ae-color-accent-hover));
      color:
        var(--ae-pagination-item-fg-active, var(--ae-color-fg-on-accent));
    }

    .ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      color: var(--ae-color-fg-subtle);
      font-size: var(--ae-font-size-sm);
      user-select: none;
    }

    /* Last item in the row drops the separator border so the right
     * edge sits flush against the container border. */
    li:last-child button.item,
    li:last-child .ellipsis {
      border-right: 0 solid transparent;
    }
  `;
Ot([
  n4({ type: Number, reflect: true })
], Fe.prototype, "count", 2);
Ot([
  n4({ type: Number, reflect: true })
], Fe.prototype, "page", 2);
Ot([
  n4({ type: Number, reflect: true })
], Fe.prototype, "siblings", 2);
Ot([
  n4({ type: Number, reflect: true })
], Fe.prototype, "boundaries", 2);
Ot([
  n4({ type: Boolean, reflect: true })
], Fe.prototype, "disabled", 2);
Fe = Ot([
  t3("ae-pagination")
], Fe);
var ss = Object.defineProperty;
var os = Object.getOwnPropertyDescriptor;
var Ze = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? os(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ss(t5, a4, i7), i7;
};
var pe = class extends i4 {
  constructor() {
    super(...arguments), this.href = "", this.target = "", this.rel = "", this.download = "", this.variant = "default", this.tone = "default", this.disabled = false, this._onDisabledClick = (e8) => {
      this.disabled && (e8.preventDefault(), e8.stopImmediatePropagation());
    };
  }
  _computedRel() {
    return this.rel ? this.rel : this.target === "_blank" ? "noopener noreferrer" : A;
  }
  render() {
    const e8 = b2`<slot name="start"></slot>`, t5 = b2`<slot></slot>`, a4 = b2`<slot name="end"></slot>`;
    return this.disabled || !this.href ? b2`
        <span
          part="link"
          class="link"
          role="link"
          aria-disabled=${this.disabled ? "true" : A}
          tabindex=${this.disabled ? A : "0"}
          @click=${this._onDisabledClick}
        >
          ${e8}${t5}${a4}
        </span>
      ` : b2`
      <a
        part="link"
        class="link"
        href=${this.href}
        target=${this.target || A}
        rel=${this._computedRel()}
        download=${this.download || A}
      >
        ${e8}${t5}${a4}
      </a>
    `;
  }
};
pe.styles = i`
    :host {
      --ae-link-fg: var(--ae-color-accent-emphasis);
      --ae-link-fg-hover: var(--ae-color-accent);
      --ae-link-underline: currentColor;

      display: inline;
      vertical-align: baseline;
    }

    :host([tone='danger']) {
      --ae-link-fg: var(--ae-color-danger-emphasis);
      --ae-link-fg-hover: var(--ae-color-danger);
    }

    :host([variant='subtle']) {
      --ae-link-fg: var(--ae-color-fg-muted);
      --ae-link-fg-hover: var(--ae-color-fg);
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-1);
      color: var(--ae-link-fg);
      font-family: inherit;
      font-size: inherit;
      font-weight: var(--ae-font-weight-medium);
      text-decoration: none;
      cursor: pointer;
      transition:
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        text-decoration-color var(--ae-duration-fast)
          var(--ae-easing-ease-out);
      text-underline-offset: 0.18em;
      text-decoration-thickness: 1px;
    }

    .link:hover {
      color: var(--ae-link-fg-hover);
      text-decoration: underline;
      text-decoration-color: var(--ae-link-underline);
    }

    .link:focus-visible {
      ${y3}
      border-radius: var(--ae-radius-xs);
    }

    /* Standalone — always-underlined, sits on its own line. */
    :host([variant='standalone']) .link {
      text-decoration: underline;
      text-decoration-color: var(--ae-link-underline);
    }

    /* Subtle — inherits foreground, underlines on hover only. */
    :host([variant='subtle']) .link {
      font-weight: inherit;
    }

    :host([disabled]) .link {
      color: var(--ae-color-fg-disabled);
      cursor: not-allowed;
      text-decoration: none;
      pointer-events: none;
    }

    ::slotted([slot='start']),
    ::slotted([slot='end']) {
      display: inline-flex;
      align-items: center;
    }
  `;
Ze([
  n4({ type: String, reflect: true })
], pe.prototype, "href", 2);
Ze([
  n4({ type: String, reflect: true })
], pe.prototype, "target", 2);
Ze([
  n4({ type: String, reflect: true })
], pe.prototype, "rel", 2);
Ze([
  n4({ type: String, reflect: true })
], pe.prototype, "download", 2);
Ze([
  n4({ type: String, reflect: true })
], pe.prototype, "variant", 2);
Ze([
  n4({ type: String, reflect: true })
], pe.prototype, "tone", 2);
Ze([
  n4({ type: Boolean, reflect: true })
], pe.prototype, "disabled", 2);
pe = Ze([
  t3("ae-link")
], pe);
var ns = Object.defineProperty;
var ls = Object.getOwnPropertyDescriptor;
var ft = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? ls(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ns(t5, a4, i7), i7;
};
var ke = class extends i4 {
  constructor() {
    super(...arguments), this.label = "", this.description = "", this.status = "upcoming", this.optional = false, this.clickable = false, this.index = 1, this._onClick = () => {
      this.dispatchEvent(
        new CustomEvent("ae-step-activate", {
          bubbles: true,
          composed: true,
          detail: { index: this.index - 1 }
        })
      );
    };
  }
  render() {
    const e8 = this.status === "complete" ? b2`<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
            <path
              d="M2.5 6.5 L5 9 L9.5 3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>` : this.status === "error" ? b2`!` : b2`${this.index}`, t5 = b2`
      <span class="marker" aria-hidden="true">${e8}</span>
      <span class="body">
        <span class="label">
          ${this.label}
          ${this.optional ? b2`<span class="optional"> (Optional)</span>` : A}
        </span>
        ${this.description ? b2`<span class="description">${this.description}</span>` : A}
      </span>
    `;
    return b2`
      <div
        class="row"
        aria-current=${this.status === "current" ? "step" : A}
      >
        ${this.clickable ? b2`<button
              class="trigger"
              type="button"
              data-clickable
              @click=${this._onClick}
            >
              ${t5}
            </button>` : b2`<span class="trigger">${t5}</span>`}
      </div>
    `;
  }
};
ke.styles = i`
    :host {
      display: block;
      font-family: var(--ae-font-family-sans);
    }

    .row {
      display: flex;
      align-items: flex-start;
      gap: var(--ae-space-3);
      padding: var(--ae-space-2) 0;
    }

    /* The trigger must dissolve (display: contents) so the marker + body become
     * direct flex children of .row and sit side-by-side. Both the clickable
     * <button> and the static <span> need it — without it the <span> blockifies
     * as a flex item and the block-level .body drops BELOW the inline marker
     * (the label-under-badge bug). all:unset on the button reverts display to
     * inline, so the button re-asserts contents after it. */
    .trigger {
      display: contents;
    }
    button.trigger {
      all: unset;
      display: contents;
      cursor: pointer;
    }
    button.trigger:not([data-clickable]) {
      cursor: default;
    }
    button.trigger:focus-visible .marker {
      ${y3}
    }

    /* Marker palette routes through per-status tokens (fallback = the default
     * accent/success/danger). Metro recolors them to the ticket badge: paper
     * upcoming, gold current (ink text), ink complete (paper check), stop error
     * — an 800 marker — without out-specifying these :host([status]) rules. */
    .marker {
      flex: 0 0 auto;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: var(--ae-step-marker-radius, 50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: var(--ae-font-size-sm);
      font-weight: var(--ae-step-marker-weight, var(--ae-font-weight-semibold));
      background: var(--ae-step-marker-bg, var(--ae-color-bg-muted));
      color: var(--ae-step-marker-fg, var(--ae-color-fg-muted));
      border: var(--ae-border-width-1) solid var(--ae-step-marker-border, var(--ae-color-border-strong));
      transition:
        background var(--ae-duration-fast) var(--ae-easing-ease-out),
        color var(--ae-duration-fast) var(--ae-easing-ease-out),
        border-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }

    :host([status='current']) .marker {
      background: var(--ae-step-current-bg, var(--ae-color-accent));
      color: var(--ae-step-current-fg, var(--ae-color-fg-on-accent));
      border-color: var(--ae-step-current-border, var(--ae-color-accent));
    }
    :host([status='complete']) .marker {
      background: var(--ae-step-complete-bg, var(--ae-color-success));
      color: var(--ae-step-complete-fg, var(--ae-color-fg-on-accent));
      border-color: var(--ae-step-complete-border, var(--ae-color-success));
    }
    :host([status='error']) .marker {
      background: var(--ae-step-error-bg, var(--ae-color-danger));
      color: var(--ae-step-error-fg, var(--ae-color-fg-on-danger));
      border-color: var(--ae-step-error-border, var(--ae-color-danger));
    }

    .body {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .label {
      font-size: var(--ae-font-size-sm);
      font-weight: var(--ae-step-label-weight, var(--ae-font-weight-semibold));
      letter-spacing: var(--ae-step-label-tracking, normal);
      text-transform: var(--ae-step-label-transform, none);
      /* Label color routes through a plumbing token so the horizontal ribbon
       * can recolor labels to match each filled segment (paper on ink, ink on
       * gold). Default = full fg. */
      color: var(--ae-step-label-color, var(--ae-color-fg));
      line-height: 1.2;
    }
    :host([status='upcoming']) .label {
      color: var(--ae-step-label-color, var(--ae-color-fg-muted));
      font-weight: var(--ae-step-label-weight, var(--ae-font-weight-medium));
    }
    .description {
      font-size: var(--ae-font-size-xs);
      color: var(--ae-step-description-color, var(--ae-color-fg-muted));
    }
    .optional {
      font-size: var(--ae-font-size-xs);
      color: var(--ae-color-fg-subtle);
      font-weight: var(--ae-font-weight-normal);
    }

    /* ---- Horizontal ribbon (source WizardSteps / step-form) ----
     * When the parent stepper is horizontal it reflects data-orientation onto
     * each step. In that mode a theme can turn the marker+label row into a
     * filled, butted segment with an inverted marker badge — the canonical
     * connected ticket strip. Every paint routes through a per-status token
     * whose fallback is transparent / inherit, so non-opted-in themes (and the
     * vertical layout, which never gets data-orientation='horizontal') keep the
     * plain marker+label+rail look untouched. The parent draws the seam reset
     * on the last segment and the outer frame; each segment carries its own
     * right-edge seam here. */
    :host([data-orientation='horizontal']) {
      border-right:
        var(--ae-step-seam-width, 0) solid var(--ae-step-seam-color, transparent);
    }
    :host([data-orientation='horizontal']) .row {
      height: 100%;
      box-sizing: border-box;
      align-items: center;
      padding: var(--ae-step-segment-padding, var(--ae-space-2) var(--ae-space-3));
      background: var(--ae-step-segment-bg, transparent);
    }
    :host([data-orientation='horizontal'][status='upcoming']) .row {
      background: var(--ae-step-upcoming-segment-bg, transparent);
    }
    :host([data-orientation='horizontal'][status='current']) .row {
      background: var(--ae-step-current-segment-bg, transparent);
    }
    :host([data-orientation='horizontal'][status='complete']) .row {
      background: var(--ae-step-complete-segment-bg, transparent);
    }
    :host([data-orientation='horizontal'][status='error']) .row {
      background: var(--ae-step-error-segment-bg, transparent);
    }

    /* Segment text follows the fill (plumbing tokens cascade into label +
     * description). Specificity (host + 2 attrs) beats the upcoming-muted rule. */
    :host([data-orientation='horizontal'][status='upcoming']) {
      --ae-step-label-color: var(--ae-step-upcoming-segment-fg, var(--ae-color-fg));
      --ae-step-description-color: var(--ae-step-upcoming-segment-fg, var(--ae-color-fg-muted));
    }
    :host([data-orientation='horizontal'][status='current']) {
      --ae-step-label-color: var(--ae-step-current-segment-fg, var(--ae-color-fg));
      --ae-step-description-color: var(--ae-step-current-segment-fg, var(--ae-color-fg-muted));
    }
    :host([data-orientation='horizontal'][status='complete']) {
      --ae-step-label-color: var(--ae-step-complete-segment-fg, var(--ae-color-fg));
      --ae-step-description-color: var(--ae-step-complete-segment-fg, var(--ae-color-fg-muted));
    }
    :host([data-orientation='horizontal'][status='error']) {
      --ae-step-label-color: var(--ae-step-error-segment-fg, var(--ae-color-fg));
      --ae-step-description-color: var(--ae-step-error-segment-fg, var(--ae-color-fg-muted));
    }

    /* Marker badge inverts to contrast the filled segment (paper badge on the
     * ink complete cell; ink badge on the gold current / paper upcoming cells).
     * Each falls back to the base (vertical) marker palette so a theme that
     * fills segments but doesn't set the inverted badge still renders sanely. */
    :host([data-orientation='horizontal'][status='upcoming']) .marker {
      background: var(--ae-step-upcoming-marker-bg, var(--ae-step-marker-bg, var(--ae-color-bg-muted)));
      color: var(--ae-step-upcoming-marker-fg, var(--ae-step-marker-fg, var(--ae-color-fg-muted)));
      border-color: var(--ae-step-upcoming-marker-border, var(--ae-step-marker-border, var(--ae-color-border-strong)));
    }
    :host([data-orientation='horizontal'][status='current']) .marker {
      background: var(--ae-step-current-marker-bg, var(--ae-step-current-bg, var(--ae-color-accent)));
      color: var(--ae-step-current-marker-fg, var(--ae-step-current-fg, var(--ae-color-fg-on-accent)));
      border-color: var(--ae-step-current-marker-border, var(--ae-step-current-border, var(--ae-color-accent)));
    }
    :host([data-orientation='horizontal'][status='complete']) .marker {
      background: var(--ae-step-complete-marker-bg, var(--ae-step-complete-bg, var(--ae-color-success)));
      color: var(--ae-step-complete-marker-fg, var(--ae-step-complete-fg, var(--ae-color-fg-on-accent)));
      border-color: var(--ae-step-complete-marker-border, var(--ae-step-complete-border, var(--ae-color-success)));
    }
    :host([data-orientation='horizontal'][status='error']) .marker {
      background: var(--ae-step-error-marker-bg, var(--ae-step-error-bg, var(--ae-color-danger)));
      color: var(--ae-step-error-marker-fg, var(--ae-step-error-fg, var(--ae-color-fg-on-danger)));
      border-color: var(--ae-step-error-marker-border, var(--ae-step-error-border, var(--ae-color-danger)));
    }
  `;
ft([
  n4({ type: String, reflect: true })
], ke.prototype, "label", 2);
ft([
  n4({ type: String, reflect: true })
], ke.prototype, "description", 2);
ft([
  n4({ type: String, reflect: true })
], ke.prototype, "status", 2);
ft([
  n4({ type: Boolean, reflect: true })
], ke.prototype, "optional", 2);
ft([
  n4({ type: Boolean, reflect: true })
], ke.prototype, "clickable", 2);
ft([
  n4({ type: Number, reflect: true })
], ke.prototype, "index", 2);
ke = ft([
  t3("ae-step")
], ke);
var cs = Object.defineProperty;
var ds = Object.getOwnPropertyDescriptor;
var Zt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? ds(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && cs(t5, a4, i7), i7;
};
var it = class extends i4 {
  constructor() {
    super(...arguments), this.active = 0, this.orientation = "horizontal", this.clickable = false, this._onSlotChange = () => {
      this._sync();
    }, this._onStepActivate = (e8) => {
      const t5 = e8.detail;
      e8.stopPropagation(), t5 && this._goTo(t5.index);
    };
  }
  render() {
    return b2`
      <div role="list">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("ae-step-activate", this._onStepActivate);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("ae-step-activate", this._onStepActivate);
  }
  updated(e8) {
    (e8.has("active") || e8.has("clickable") || e8.has("orientation")) && this._sync();
  }
  firstUpdated() {
    this._sync();
  }
  _sync() {
    const e8 = this._steps ?? [], t5 = Math.max(0, Math.min(this.active, e8.length - 1));
    for (let a4 = 0; a4 < e8.length; a4++) {
      const r6 = e8[a4];
      r6.index = a4 + 1, r6.setAttribute("role", "listitem"), r6.setAttribute("data-orientation", this.orientation);
      const i7 = r6.status === "error";
      let s4;
      i7 ? s4 = "error" : a4 < t5 ? s4 = "complete" : a4 === t5 ? s4 = "current" : s4 = "upcoming", r6.status = s4, r6.clickable = this.clickable && (a4 <= t5 || s4 === "complete");
    }
  }
  /** Public: programmatically jump to a step. */
  goTo(e8) {
    this._goTo(e8);
  }
  _goTo(e8) {
    const t5 = this._steps ?? [], a4 = Math.max(0, Math.min(e8, t5.length - 1));
    if (a4 === this.active) return;
    const r6 = this.active;
    this.active = a4, this.dispatchEvent(
      new CustomEvent("ae-step-change", {
        bubbles: true,
        composed: true,
        detail: { index: a4, previousIndex: r6 }
      })
    );
  }
};
it.styles = i`
    :host {
      display: block;
      font-family: var(--ae-font-family-sans);
    }

    [role='list'] {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: var(--ae-stepper-gap, var(--ae-space-4));
    }

    /* Horizontal frame — drawn around the whole strip so a filled-segment
     * ribbon reads as one connected ticket (the source's WizardSteps card).
     * Defaults to none; an opted-in theme (Metro) sets a 3px ink frame and the
     * segments supply their own seams. Vertical never references the token. */
    :host([orientation='horizontal']) [role='list'] {
      border: var(--ae-stepper-list-border, none);
    }

    :host([orientation='vertical']) [role='list'] {
      flex-direction: column;
      gap: var(--ae-space-2);
    }

    ::slotted(ae-step) {
      flex: 1 1 auto;
      position: relative;
    }

    /* The last segment carries no trailing seam (it meets the frame's right
     * edge). Zeroing the seam token directly on the host beats the :root value
     * a theme inherits into the other segments. Harmless when no seam is set. */
    ::slotted(ae-step:last-of-type) {
      --ae-step-seam-width: 0;
    }

    /* Horizontal connector — the thin inter-step rule. Gated behind a display
     * token so a theme that fills + butts the segments into a connected ribbon
     * (Metro) suppresses the floating line; the default of block keeps it for
     * the marker+label layouts that want a visible connector. */
    :host([orientation='horizontal']) ::slotted(ae-step:not(:last-of-type))::after {
      content: '';
      display: var(--ae-stepper-connector-display, block);
      position: absolute;
      top: calc(var(--ae-space-2) + 0.875rem);
      right: calc(-1 * var(--ae-stepper-gap, var(--ae-space-4)));
      width: var(--ae-stepper-gap, var(--ae-space-4));
      height: 1px;
      background: var(--ae-color-border);
    }

    /* Vertical rail — a continuous line centered under each marker, running
     * from the marker's lower edge down to the next marker. The marker is
     * 1.75rem wide, so its center sits 0.875rem from the row's left edge; the
     * old calc added an erroneous --ae-space-2, pushing the rail off-marker and
     * making it read as a disconnected stub. Width/color tokenized so Metro can
     * thicken it into a proper ink rail. */
    :host([orientation='vertical']) ::slotted(ae-step:not(:last-of-type))::after {
      content: '';
      position: absolute;
      left: calc(0.875rem - (var(--ae-stepper-rail-width, 1px) / 2));
      top: calc(var(--ae-space-2) + 1.75rem);
      bottom: calc(-2 * var(--ae-space-2));
      width: var(--ae-stepper-rail-width, 1px);
      background: var(--ae-stepper-rail-color, var(--ae-color-border));
    }
  `;
Zt([
  n4({ type: Number, reflect: true })
], it.prototype, "active", 2);
Zt([
  n4({ type: String, reflect: true })
], it.prototype, "orientation", 2);
Zt([
  n4({ type: Boolean, reflect: true })
], it.prototype, "clickable", 2);
Zt([
  o6({ selector: "ae-step" })
], it.prototype, "_steps", 2);
it = Zt([
  t3("ae-stepper")
], it);
var hs = Object.defineProperty;
var ps = Object.getOwnPropertyDescriptor;
var Tt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? ps(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && hs(t5, a4, i7), i7;
};
var je = class extends i4 {
  constructor() {
    super(...arguments), this.label = "", this.description = "", this.optional = false, this.disabled = false, this.active = false;
  }
  render() {
    return b2`<div
      class="panel"
      role="group"
      aria-label=${this.label || A}
      ?hidden=${!this.active}
    >
      <slot></slot>
    </div>`;
  }
};
je.styles = i`
    :host {
      display: block;
    }
    :host(:not([active])) {
      display: none;
    }
    .panel {
      padding: var(--ae-space-2) 0;
    }
  `;
Tt([
  n4({ type: String, reflect: true })
], je.prototype, "label", 2);
Tt([
  n4({ type: String, reflect: true })
], je.prototype, "description", 2);
Tt([
  n4({ type: Boolean, reflect: true })
], je.prototype, "optional", 2);
Tt([
  n4({ type: Boolean, reflect: true })
], je.prototype, "disabled", 2);
Tt([
  n4({ type: Boolean, reflect: true })
], je.prototype, "active", 2);
je = Tt([
  t3("ae-wizard-step")
], je);
var us = Object.defineProperty;
var fs = Object.getOwnPropertyDescriptor;
var ya = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? fs(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && us(t5, a4, i7), i7;
};
var $t = class extends i4 {
  constructor() {
    super(...arguments), this.active = 0, this.linear = false, this._onSlotChange = () => {
      this._syncSteps(), this.requestUpdate();
    }, this._onStepperChange = (e8) => {
      e8.stopPropagation();
      const t5 = e8.detail;
      this.goTo(t5.index);
    }, this._onCancel = () => {
      this.dispatchEvent(
        new CustomEvent("ae-cancel", {
          bubbles: true,
          composed: true,
          detail: { index: this.active }
        })
      );
    };
  }
  render() {
    const e8 = this._steps ?? [], t5 = e8.map(
      (s4) => b2`<ae-step
        label=${s4.label}
        description=${s4.description}
        ?optional=${s4.optional}
      ></ae-step>`
    ), a4 = this.active >= e8.length - 1, r6 = this.active <= 0, i7 = !this.linear;
    return b2`
      <div part="header" class="header">
        <ae-stepper
          .active=${this.active}
          ?clickable=${i7}
          @ae-step-change=${this._onStepperChange}
        >
          ${t5}
        </ae-stepper>
      </div>
      <div part="panel" class="panel">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
      <div part="footer" class="footer">
        <ae-button
          variant="tertiary"
          @click=${this._onCancel}
        >Cancel</ae-button>
        <span class="spacer"></span>
        <ae-button
          variant="secondary"
          ?disabled=${r6}
          @click=${this.back}
        >Back</ae-button>
        ${a4 ? b2`<ae-button variant="primary" @click=${this.complete}
              >Finish</ae-button
            >` : b2`<ae-button variant="primary" @click=${this.next}
              >Next</ae-button
            >`}
      </div>
    `;
  }
  updated(e8) {
    e8.has("active") && this._syncSteps();
  }
  firstUpdated() {
    this._syncSteps();
  }
  _syncSteps() {
    const e8 = this._steps ?? [], t5 = Math.max(0, Math.min(this.active, e8.length - 1));
    for (let a4 = 0; a4 < e8.length; a4++)
      e8[a4].active = a4 === t5;
  }
  /** Advance one step (clamped to the last step). */
  next() {
    const e8 = this._steps ?? [], t5 = this.active, a4 = Math.min(e8.length - 1, this.active + 1);
    a4 !== t5 && (this.active = a4, this.dispatchEvent(
      new CustomEvent("ae-next", {
        bubbles: true,
        composed: true,
        detail: { from: t5, to: a4 }
      })
    ));
  }
  /** Go back one step (clamped to 0). */
  back() {
    const e8 = this.active, t5 = Math.max(0, this.active - 1);
    t5 !== e8 && (this.active = t5, this.dispatchEvent(
      new CustomEvent("ae-back", {
        bubbles: true,
        composed: true,
        detail: { from: e8, to: t5 }
      })
    ));
  }
  /** Jump to an arbitrary step (linear mode caps forward jumps to `active + 1`). */
  goTo(e8) {
    const t5 = this._steps ?? [], a4 = Math.max(0, Math.min(e8, t5.length - 1));
    if (this.linear && a4 > this.active + 1 || a4 === this.active) return;
    const r6 = t5[a4];
    if (r6 != null && r6.disabled) return;
    const i7 = this.active;
    this.active = a4;
    const s4 = a4 > i7 ? "ae-next" : "ae-back";
    this.dispatchEvent(
      new CustomEvent(s4, {
        bubbles: true,
        composed: true,
        detail: { from: i7, to: a4 }
      })
    );
  }
  /** Fire ae-complete. */
  complete() {
    this.dispatchEvent(
      new CustomEvent("ae-complete", {
        bubbles: true,
        composed: true,
        detail: { index: this.active }
      })
    );
  }
};
$t.styles = i`
    :host {
      display: block;
      font-family: var(--ae-font-family-sans);
    }

    .header {
      margin-bottom: var(--ae-space-6);
    }

    .panel {
      min-height: 4rem;
    }

    .footer {
      display: flex;
      align-items: center;
      gap: var(--ae-space-3);
      margin-top: var(--ae-space-6);
      padding-top: var(--ae-space-4);
      border-top: var(--ae-border-width-1) solid var(--ae-color-border);
    }
    .footer .spacer {
      flex: 1 1 auto;
    }
  `;
ya([
  n4({ type: Number, reflect: true })
], $t.prototype, "active", 2);
ya([
  n4({ type: Boolean, reflect: true })
], $t.prototype, "linear", 2);
ya([
  o6({ selector: "ae-wizard-step" })
], $t.prototype, "_steps", 2);
$t = ya([
  t3("ae-wizard")
], $t);
var qa = class {
  constructor() {
    this._map = /* @__PURE__ */ new Map(), this.totalSize = 0;
  }
  /** Number of entries currently in the cache. */
  get size() {
    return this._map.size;
  }
  /**
   * Returns the running average size, or 0 if the cache is empty. Callers
   * that need a stable estimate should fall back to a configured default.
   */
  get averageSize() {
    return this._map.size > 0 ? this.totalSize / this._map.size : 0;
  }
  /** Get a previously-cached size, or undefined if never set. */
  get(t5) {
    return this._map.get(t5);
  }
  /**
   * Store a measured size under `key`, updating the running total. Overwrites
   * any prior value at the same key (e.g. when an item's height changes due
   * to content reflow).
   */
  set(t5, a4) {
    const r6 = this._map.get(t5) ?? 0;
    this._map.set(t5, a4), this.totalSize += a4 - r6;
  }
  /** Remove a single entry. */
  delete(t5) {
    const a4 = this._map.get(t5);
    a4 !== void 0 && (this._map.delete(t5), this.totalSize -= a4);
  }
  /** Drop everything. */
  clear() {
    this._map.clear(), this.totalSize = 0;
  }
};
var vs = 82e5;
var bs = class {
  constructor(t5) {
    this._sizeCache = new qa(), this._itemCount = 0, this._scrollPosition = 0, this._viewportHeight = 0, this._scrollError = 0, this._stable = true, this._first = -1, this._last = -1, this._firstVisible = -1, this._lastVisible = -1, this._physicalMin = 0, this._physicalMax = 0, this._anchorIdx = null, this._anchorPos = null, this._physicalItems = /* @__PURE__ */ new Map(), this._newPhysicalItems = /* @__PURE__ */ new Map(), this._pin = null, this._config = {
      overhang: (t5 == null ? void 0 : t5.overhang) ?? 1e3,
      estimatedItemSize: (t5 == null ? void 0 : t5.estimatedItemSize) ?? 50,
      gap: (t5 == null ? void 0 : t5.gap) ?? 0,
      keyForIndex: t5 == null ? void 0 : t5.keyForIndex
    };
  }
  // -------- Public configuration / state setters --------
  setOverhang(t5) {
    this._config.overhang = t5;
  }
  setEstimatedItemSize(t5) {
    this._config.estimatedItemSize = t5;
  }
  setGap(t5) {
    this._config.gap = t5;
  }
  setKeyForIndex(t5) {
    this._config.keyForIndex = t5;
  }
  setItemCount(t5) {
    this._itemCount = t5;
  }
  setViewport(t5, a4) {
    this._viewportHeight = t5, this._scrollPosition = a4;
  }
  /**
   * Drop the entire size cache. Called by the host when the items array
   * reference changes (#10): we can't trust positional sizes when the
   * content at each index may have changed.
   *
   * When `keyForIndex` is configured, the host calls `pruneCacheToKeys`
   * instead, which preserves cached sizes for items that survived the
   * reorder under a stable key.
   */
  clearCache() {
    this._sizeCache.clear(), this._physicalItems.clear(), this._newPhysicalItems.clear(), this._resetReflowState();
  }
  /** Cache an individual item's measured size. */
  updateItemSize(t5, a4) {
    const r6 = this._key(t5);
    this._sizeCache.set(r6, a4);
  }
  /**
   * Survive an items-array swap. The new mapping is `newIndex → key`. Any
   * cache entry whose key is NOT in `survivors` is dropped; positions are
   * invalidated either way and the next reflow will lay everything out
   * fresh.
   */
  pruneCacheToKeys(t5) {
    if (this._config.keyForIndex === void 0) {
      this.clearCache();
      return;
    }
    const a4 = new qa();
    for (const r6 of t5) {
      const i7 = this._sizeCache.get(r6);
      i7 !== void 0 && a4.set(r6, i7);
    }
    this._sizeCache.clear();
    for (const r6 of t5) {
      const i7 = a4.get(r6);
      i7 !== void 0 && this._sizeCache.set(r6, i7);
    }
    this._physicalItems.clear(), this._newPhysicalItems.clear(), this._resetReflowState();
  }
  // -------- Pin (scroll-into-view) --------
  setPin(t5) {
    this._pin = t5;
  }
  getPin() {
    return this._pin;
  }
  /**
   * Compute the destination scrollTop to align the item at `pin.index`
   * under the configured `block` alignment. Used both by the host's
   * `scrollToIndex` and by the smooth-scroll retargeting loop (#2, #11).
   */
  getScrollIntoViewPosition(t5) {
    const a4 = Math.max(0, Math.min(this._itemCount - 1, t5.index)), r6 = this._getPosition(a4), i7 = this._getSize(a4) ?? this._getAverageSize();
    switch (t5.block) {
      case "start":
        return jt(r6, this._maxScrollTop());
      case "center":
        return jt(
          r6 - 0.5 * this._viewportHeight + 0.5 * i7,
          this._maxScrollTop()
        );
      case "end":
        return jt(
          r6 + i7 - this._viewportHeight,
          this._maxScrollTop()
        );
      case "nearest": {
        const s4 = r6, o9 = r6 + i7 - this._viewportHeight;
        return Math.abs(this._scrollPosition - s4) < Math.abs(this._scrollPosition - o9) ? jt(s4, this._maxScrollTop()) : jt(o9, this._maxScrollTop());
      }
    }
  }
  // -------- Reflow --------
  /**
   * Run a full reflow pass. Returns a `StateMessage` the host can act on.
   * The returned `stable` flag indicates whether the layout converged on
   * measured sizes only (true) or used at least one estimate (false).
   */
  reflow() {
    return this._stable = true, this._setPositionFromPin(), this._getActiveItems(), this._updateVisibleIndices(), this._buildStateMessage();
  }
  _setPositionFromPin() {
    if (this._pin !== null) {
      const t5 = this._scrollPosition;
      this._scrollPosition = this.getScrollIntoViewPosition(this._pin), this._scrollError += t5 - this._scrollPosition;
    }
  }
  /**
   * Compute the index range to render plus per-item physical positions.
   * Implements the anchor-based expansion that bounds the cost at
   * O(viewportItems) instead of O(itemCount). See research doc for the
   * full derivation.
   */
  _getActiveItems() {
    if (this._viewportHeight === 0 || this._itemCount === 0) {
      this._clearItems();
      return;
    }
    const t5 = this._newPhysicalItems;
    t5.clear();
    let a4 = this._scrollPosition - this._config.overhang, r6 = this._scrollPosition + this._viewportHeight + this._config.overhang;
    const i7 = this._estimateTotalScrollSize();
    if (r6 < 0 || a4 > i7) {
      this._clearItems();
      return;
    }
    this._pin !== null && (this._anchorIdx = this._pin.index, this._anchorPos = this._getPosition(this._pin.index)), (this._anchorIdx === null || this._anchorPos === null) && (this._anchorIdx = this._chooseAnchor(a4, r6), this._anchorPos = this._getPosition(this._anchorIdx));
    let s4 = this._getSize(this._anchorIdx);
    s4 === void 0 && (this._stable = false, s4 = this._getAverageSize()), this._anchorIdx === 0 && (this._anchorPos = 0), this._anchorIdx === this._itemCount - 1 && (this._anchorPos = i7 - s4);
    let o9 = 0;
    for (this._anchorPos + s4 < a4 && (o9 = a4 - (this._anchorPos + s4)), this._anchorPos > r6 && (o9 = r6 - this._anchorPos), o9 && (this._scrollPosition -= o9, a4 -= o9, r6 -= o9, this._scrollError += o9), t5.set(this._anchorIdx, { pos: this._anchorPos, size: s4 }), this._first = this._last = this._anchorIdx, this._physicalMin = this._anchorPos, this._physicalMax = this._anchorPos + s4; this._physicalMin > a4 && this._first > 0; ) {
      let d3 = this._getSize(--this._first);
      d3 === void 0 && (this._stable = false, d3 = this._getAverageSize()), this._physicalMin -= d3 + this._config.gap;
      const p3 = this._physicalMin + this._config.gap;
      t5.set(this._first, { pos: p3, size: d3 });
    }
    for (; this._physicalMax < r6 && this._last < this._itemCount - 1; ) {
      let d3 = this._getSize(++this._last);
      d3 === void 0 && (this._stable = false, d3 = this._getAverageSize());
      const p3 = this._physicalMax + this._config.gap;
      t5.set(this._last, { pos: p3, size: d3 }), this._physicalMax = p3 + d3;
    }
    const h3 = this._calculateBoundaryError(i7);
    h3 && (this._physicalMin -= h3, this._physicalMax -= h3, this._anchorPos -= h3, this._scrollPosition -= h3, t5.forEach((d3) => d3.pos -= h3), this._scrollError += h3), this._stable && (this._physicalItems = new Map(t5));
  }
  _calculateBoundaryError(t5) {
    return this._first === 0 ? this._physicalMin : this._last === this._itemCount - 1 ? this._physicalMax - t5 : 0;
  }
  /** Empty/zero-viewport guard (#12). */
  _clearItems() {
    this._first = -1, this._last = -1, this._firstVisible = -1, this._lastVisible = -1, this._physicalMin = 0, this._physicalMax = 0, this._newPhysicalItems.clear(), this._physicalItems.clear(), this._stable = true;
  }
  _resetReflowState() {
    this._anchorIdx = null, this._anchorPos = null, this._stable = true;
  }
  /**
   * Anchor selection — exposed for tests. Picks an index whose position
   * straddles the viewport (lower, upper). If the current physical range
   * already covers the viewport, walks from `_firstVisible - 1` forward
   * to find the first item whose end lies past `lower`. Otherwise falls
   * back to the average-step estimate.
   */
  chooseAnchor(t5, a4) {
    return this._chooseAnchor(t5, a4);
  }
  _chooseAnchor(t5, a4) {
    if (this._physicalItems.size === 0 || this._first < 0 || this._last < 0)
      return this._calculateAnchorFromScroll(t5, a4);
    const r6 = this._physicalItems.get(this._first), i7 = this._physicalItems.get(this._last), s4 = r6.pos;
    if (i7.pos + i7.size < t5 || s4 > a4)
      return this._calculateAnchorFromScroll(t5, a4);
    let h3 = Math.max(this._first, this._firstVisible - 1), d3 = -1 / 0;
    for (; d3 < t5 && h3 <= this._last; ) {
      const p3 = this._physicalItems.get(h3);
      if (p3 === void 0) break;
      d3 = p3.pos + p3.size, d3 < t5 && h3++;
    }
    return Math.max(0, Math.min(this._itemCount - 1, h3));
  }
  _calculateAnchorFromScroll(t5, a4) {
    if (t5 <= 0) return 0;
    const r6 = this._estimateTotalScrollSize() - this._viewportHeight;
    if (a4 > r6) return this._itemCount - 1;
    const i7 = this._getAverageSize() + this._config.gap;
    return i7 <= 0 ? 0 : Math.max(
      0,
      Math.min(this._itemCount - 1, Math.floor((t5 + a4) / 2 / i7))
    );
  }
  /**
   * Estimated position of the item at `idx`. If the item is in the current
   * physical range, its real position is used; otherwise we extrapolate
   * from the nearest physical edge using `averageSize`.
   */
  _getPosition(t5) {
    const a4 = this._physicalItems.get(t5) ?? this._newPhysicalItems.get(t5);
    return a4 ? a4.pos : this._estimatePosition(t5);
  }
  /**
   * Pure-math estimate for a not-yet-rendered item. Exposed for tests.
   * - If we have no rendered items, position is `idx * (avg + gap)`.
   * - If `idx` is below the rendered range, walk up from `_first`.
   * - If `idx` is above the rendered range, walk down from `_last`.
   */
  estimatePosition(t5) {
    return this._estimatePosition(t5);
  }
  _estimatePosition(t5) {
    const a4 = this._getAverageSize(), r6 = a4 + this._config.gap;
    if (this._first === -1 || this._last === -1)
      return t5 * r6;
    if (t5 < this._first) {
      const s4 = this._first - t5, o9 = this._physicalItems.get(this._first);
      return ((o9 == null ? void 0 : o9.pos) ?? this._first * r6) - s4 * r6;
    }
    if (t5 > this._last) {
      const s4 = t5 - this._last, o9 = this._physicalItems.get(this._last), h3 = (o9 == null ? void 0 : o9.size) ?? a4;
      return ((o9 == null ? void 0 : o9.pos) ?? this._last * r6) + h3 + this._config.gap + (s4 - 1) * r6;
    }
    const i7 = this._physicalItems.get(t5);
    return (i7 == null ? void 0 : i7.pos) ?? t5 * r6;
  }
  _getSize(t5) {
    return this._sizeCache.get(this._key(t5));
  }
  _getAverageSize() {
    return this._sizeCache.averageSize || this._config.estimatedItemSize;
  }
  _key(t5) {
    var a4, r6;
    return ((r6 = (a4 = this._config).keyForIndex) == null ? void 0 : r6.call(a4, t5)) ?? t5;
  }
  /**
   * Round both sides of the visibility comparison to avoid sub-pixel flicker (#7).
   */
  _updateVisibleIndices() {
    var r6, i7, s4;
    if (this._first === -1 || this._last === -1) return;
    let t5 = this._first;
    for (; t5 < this._last && Math.round(((r6 = this._physicalItems.get(t5)) == null ? void 0 : r6.pos) ?? 0) + Math.round(((i7 = this._physicalItems.get(t5)) == null ? void 0 : i7.size) ?? 0) <= Math.round(this._scrollPosition); )
      t5++;
    let a4 = this._last;
    for (; a4 > this._first && Math.round(((s4 = this._physicalItems.get(a4)) == null ? void 0 : s4.pos) ?? 0) >= Math.round(this._scrollPosition + this._viewportHeight); )
      a4--;
    this._firstVisible = t5, this._lastVisible = a4;
  }
  _estimateTotalScrollSize() {
    if (this._itemCount === 0) return 0;
    const t5 = this._getAverageSize(), a4 = this._itemCount * t5 + (this._itemCount - 1) * this._config.gap;
    return Math.min(vs, Math.max(1, a4));
  }
  _maxScrollTop() {
    return Math.max(0, this._estimateTotalScrollSize() - this._viewportHeight);
  }
  _buildStateMessage() {
    const t5 = this._stable ? this._physicalItems : this._newPhysicalItems, a4 = /* @__PURE__ */ new Map();
    if (this._first !== -1 && this._last !== -1)
      for (let i7 = this._first; i7 <= this._last; i7++) {
        const s4 = t5.get(i7);
        s4 && a4.set(i7, s4.pos);
      }
    const r6 = this._scrollError;
    return this._scrollError = 0, {
      scrollSize: this._estimateTotalScrollSize(),
      range: {
        first: this._first,
        last: this._last,
        firstVisible: this._firstVisible,
        lastVisible: this._lastVisible
      },
      childPositions: a4,
      scrollError: r6,
      stable: this._stable
    };
  }
  // -------- Test introspection (intentionally narrow API) --------
  getStable() {
    return this._stable;
  }
  getCachedSize(t5) {
    return this._getSize(t5);
  }
  getAverageSize() {
    return this._getAverageSize();
  }
  getEstimatedScrollSize() {
    return this._estimateTotalScrollSize();
  }
};
function jt(e8, t5) {
  return t5 <= 0 ? 0 : Math.max(0, Math.min(e8, t5));
}
var gs = 82e5;
function ms(e8) {
  if (e8.itemCount <= 0) return 0;
  const t5 = e8.gap ?? 0, a4 = e8.itemCount * e8.itemHeight + (e8.itemCount - 1) * t5;
  return Math.min(gs, Math.max(1, a4));
}
function sr(e8, t5) {
  const a4 = t5.gap ?? 0;
  return e8 * (t5.itemHeight + a4);
}
function Va(e8, t5, a4) {
  if (a4.itemCount <= 0 || a4.itemHeight <= 0 || t5 <= 0)
    return { first: -1, last: -1, firstVisible: -1, lastVisible: -1 };
  const r6 = a4.gap ?? 0, i7 = a4.overhang ?? 1e3, s4 = a4.itemHeight + r6, o9 = Math.round(e8), h3 = Math.round(e8 + t5), d3 = Math.max(
    0,
    Math.min(a4.itemCount - 1, Math.floor(o9 / s4))
  ), p3 = Math.max(
    0,
    Math.min(a4.itemCount - 1, Math.ceil(h3 / s4) - 1)
  ), b3 = Math.max(0, Math.floor((o9 - i7) / s4)), g2 = Math.min(
    a4.itemCount - 1,
    Math.ceil((h3 + i7) / s4) - 1
  );
  return { first: b3, last: g2, firstVisible: d3, lastVisible: p3 };
}
function _s(e8, t5, a4, r6, i7) {
  const s4 = Math.max(0, Math.min(i7.itemCount - 1, e8)), o9 = sr(s4, i7), h3 = o9 - r6 + i7.itemHeight;
  switch (t5) {
    case "start":
      return Math.max(0, o9);
    case "center":
      return Math.max(0, o9 - 0.5 * r6 + 0.5 * i7.itemHeight);
    case "end":
      return Math.max(0, h3);
    case "nearest":
      return Math.abs(a4 - o9) < Math.abs(a4 - h3) ? Math.max(0, o9) : Math.max(0, h3);
  }
}
var ys = class {
  constructor(t5, a4) {
    this.correctingScrollError = false, this._destination = null, this._retarget = null, this._end = null, this._target = t5, this._host = a4, this._scrollHandler = this._onScroll.bind(this), this._target.addEventListener("scroll", this._scrollHandler, { passive: true });
  }
  /** Tear down listeners. Idempotent. */
  destroy() {
    this._target.removeEventListener("scroll", this._scrollHandler), this._destination = null, this._retarget = null, this._end = null;
  }
  /** Replace the controlled scroll target. Used when nesting context changes. */
  retargetElement(t5) {
    t5 !== this._target && (this._target.removeEventListener("scroll", this._scrollHandler), this._target = t5, this._target.addEventListener("scroll", this._scrollHandler, { passive: true }));
  }
  get target() {
    return this._target;
  }
  get scrollTop() {
    return this._target.scrollTop;
  }
  get scrollHeight() {
    return this._target.scrollHeight;
  }
  get clientHeight() {
    return this._target.clientHeight;
  }
  get maxScrollTop() {
    return Math.max(0, this._target.scrollHeight - this._target.clientHeight);
  }
  /** True when a managed smooth scroll is in flight. */
  get scrolling() {
    return this._destination !== null;
  }
  /**
   * Apply a scroll-error correction (#1, #5). The controller marks itself
   * correcting, fires the synthetic scroll, then resumes any in-flight
   * smooth scroll with the (possibly-retargeted) destination.
   */
  correctScrollError(t5) {
    if (this.correctingScrollError = true, requestAnimationFrame(
      () => requestAnimationFrame(() => this.correctingScrollError = false)
    ), this._target.scrollTo({ top: t5 }), this._retarget) {
      const a4 = this._retarget();
      this._setDestination(a4);
    }
    this._destination !== null && this._target.scrollTo({ top: this._destination, behavior: "smooth" });
  }
  /**
   * Begin a managed smooth scroll. The host should call `updateManagedTarget`
   * any time the layout re-renders items that may affect the destination.
   */
  managedScrollTo(t5, a4, r6) {
    this._end && this._end(), this._setDestination(t5), this._retarget = a4, this._end = r6, this._target.scrollTo({ top: this._destination ?? t5, behavior: "smooth" });
  }
  /**
   * Update the destination of an in-flight smooth scroll (#11). Called by
   * the host whenever the target item's true position is re-derived.
   */
  updateManagedTarget(t5) {
    this._destination !== null && this._setDestination(t5) && this._target.scrollTo({ top: this._destination, behavior: "smooth" });
  }
  /**
   * Cancel a managed smooth scroll. The `end` callback DOES fire — callers
   * who want a silent abort should clear state themselves first.
   */
  cancelManagedScroll() {
    this._end && this._end(), this._resetScrollState();
  }
  /**
   * Instant scroll — no managed retargeting, no smooth behavior. Used when
   * `scrollToIndex` is called with `behavior: 'auto'` and the target is
   * NOT in the rendered range (the layout pins, the next reflow applies).
   */
  instantScrollTo(t5) {
    this._resetScrollState(), this._target.scrollTo({ top: t5 });
  }
  // -------- internals --------
  /**
   * Set destination only if it differs from the current. Returns true when
   * the destination actually changed (so callers can decide whether to
   * issue another native `scrollTo`).
   */
  _setDestination(t5) {
    const a4 = Math.max(0, Math.min(t5, this.maxScrollTop));
    return this._destination === a4 ? false : (this._destination = a4, true);
  }
  _resetScrollState() {
    this._destination = null, this._retarget = null, this._end = null;
  }
  /**
   * Scroll handler. Detects arrival at the managed destination, and
   * forwards user scrolls to the host (suppressing programmatic ones).
   */
  _onScroll() {
    if (!this.correctingScrollError) {
      if (this._destination !== null && Math.abs(this._target.scrollTop - this._destination) < 1) {
        const a4 = this._end;
        this._resetScrollState(), a4 == null || a4();
      }
      this._host.onUserScroll();
    }
  }
};
function Ha(e8) {
  const t5 = e8.assignedSlot;
  if (t5) return t5;
  const a4 = e8.parentElement;
  if (a4) return a4;
  const r6 = e8.parentNode;
  return r6 && r6.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? r6.host ?? null : null;
}
function ws(e8, t5 = false) {
  const a4 = [];
  let r6 = t5 ? e8 : Ha(e8);
  for (; r6 !== null; )
    a4.push(r6), r6 = Ha(r6);
  return a4;
}
function xs(e8, t5 = false) {
  let a4 = false;
  const r6 = [];
  for (const i7 of ws(e8, t5)) {
    if (a4) break;
    const s4 = getComputedStyle(i7);
    s4.position === "fixed" && (a4 = true), s4.overflow !== "visible" && r6.push(i7);
  }
  return r6;
}
var ks = Object.defineProperty;
var $s = Object.getOwnPropertyDescriptor;
var X = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? $s(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ks(t5, a4, i7), i7;
};
var B2 = class extends i4 {
  constructor() {
    super(...arguments), this.estimatedItemSize = 50, this.mode = "flow", this.overhang = 1e3, this.gap = 0, this.endOfListThreshold = 200, this._items = [], this._flowLayout = new bs({
      overhang: this.overhang,
      estimatedItemSize: this.estimatedItemSize,
      gap: this.gap
    }), this._scroller = null, this._resizeObserver = null, this._itemRO = null, this._clippingAncestors = [], this._scheduled = /* @__PURE__ */ new WeakSet(), this._scrollPin = null, this._range = {
      first: -1,
      last: -1,
      firstVisible: -1,
      lastVisible: -1
    }, this._childPositions = /* @__PURE__ */ new Map(), this._scrollSize = 0, this._slottedTemplate = null, this._schedule = (e8) => {
      this._scheduled.has(e8) || (this._scheduled.add(e8), queueMicrotask(() => {
        this._scheduled.delete(e8), e8.call(this);
      }));
    }, this._runReflow = () => {
      var i7, s4, o9;
      if (!this.isConnected) return;
      if (this.mode === "fixed" && this.itemHeight) {
        this.requestUpdate();
        return;
      }
      const e8 = ((i7 = this._scroller) == null ? void 0 : i7.clientHeight) ?? this.clientHeight, t5 = ((s4 = this._scroller) == null ? void 0 : s4.scrollTop) ?? 0;
      this._flowLayout.setViewport(e8, t5), this._flowLayout.setItemCount(this._items.length), this._scrollPin && this._flowLayout.setPin(this._scrollPin);
      const a4 = this._range, r6 = this._flowLayout.reflow();
      if (this._range = r6.range, this._childPositions = r6.childPositions, this._scrollSize = r6.scrollSize, r6.scrollError && this._scroller) {
        const h3 = this._scroller.scrollTop - r6.scrollError;
        this._scroller.correctScrollError(h3);
      }
      if ((a4.first !== r6.range.first || a4.last !== r6.range.last || a4.firstVisible !== r6.range.firstVisible || a4.lastVisible !== r6.range.lastVisible) && this.dispatchEvent(
        new CustomEvent("ae-visible-range-change", {
          detail: { ...r6.range },
          bubbles: true,
          composed: true
        })
      ), this._scrollPin && ((o9 = this._scroller) != null && o9.scrolling)) {
        const h3 = this._flowLayout.getScrollIntoViewPosition(this._scrollPin);
        this._scroller.updateManagedTarget(h3);
      }
      this.requestUpdate();
    }, this._onAncestorScroll = () => {
      this._schedule(this._runReflow);
    };
  }
  get items() {
    return this._items;
  }
  set items(e8) {
    const t5 = this._items;
    t5 !== e8 && (this._handleItemsChange(t5, e8), this._items = e8, this.requestUpdate("items", t5));
  }
  // ---- Imperative API ----
  /**
   * Scroll to the item at `index`. For `behavior: 'smooth'` the scroll
   * retargets as item measurements arrive (#11, #2). For `'auto'` (instant),
   * the layout pins the index and the next reflow applies the final position.
   */
  scrollToIndex(e8, t5 = {}) {
    var s4, o9, h3;
    const a4 = t5.block ?? "start", r6 = t5.behavior ?? "auto";
    if (this._items.length === 0) return;
    const i7 = Math.max(0, Math.min(this._items.length - 1, e8));
    if (this.mode === "fixed" && this.itemHeight) {
      const d3 = _s(
        i7,
        a4,
        ((s4 = this._scroller) == null ? void 0 : s4.scrollTop) ?? 0,
        ((o9 = this._scroller) == null ? void 0 : o9.clientHeight) ?? this.clientHeight,
        {
          itemCount: this._items.length,
          itemHeight: this.itemHeight,
          gap: this.gap
        }
      );
      r6 === "smooth" && this._scroller ? this._scroller.managedScrollTo(
        d3,
        () => d3,
        () => {
        }
      ) : (h3 = this._scroller) == null || h3.instantScrollTo(d3);
      return;
    }
    if (r6 === "smooth" && this._scroller) {
      const d3 = this._flowLayout.getScrollIntoViewPosition({
        index: i7,
        block: a4
      });
      this._scrollPin = { index: i7, block: a4 }, this._flowLayout.setPin({ index: i7, block: a4 }), this._scroller.managedScrollTo(
        d3,
        () => this._flowLayout.getScrollIntoViewPosition({
          index: i7,
          block: a4
        }),
        () => {
          this._scrollPin = null, this._flowLayout.setPin(null);
        }
      ), this._schedule(this._runReflow);
    } else
      this._flowLayout.setPin({ index: i7, block: a4 }), this._scrollPin = { index: i7, block: a4 }, this._schedule(this._runReflow);
  }
  /** Current rendered range and visible window. */
  getVisibleRange() {
    var e8, t5;
    return this.mode === "fixed" && this.itemHeight ? Va(
      ((e8 = this._scroller) == null ? void 0 : e8.scrollTop) ?? 0,
      ((t5 = this._scroller) == null ? void 0 : t5.clientHeight) ?? this.clientHeight,
      {
        itemCount: this._items.length,
        itemHeight: this.itemHeight,
        gap: this.gap,
        overhang: this.overhang
      }
    ) : {
      first: this._range.first,
      last: this._range.last,
      firstVisible: this._range.firstVisible,
      lastVisible: this._range.lastVisible
    };
  }
  connectedCallback() {
    super.connectedCallback();
    const e8 = this.querySelector("template[data-render-item]");
    e8 && (this._slottedTemplate = e8), this.hasAttribute("role") || this.setAttribute("role", "list");
  }
  /** Whether the host uses the default list semantics (vs a consumer override). */
  get _usesListSemantics() {
    const e8 = this.getAttribute("role");
    return e8 === null || e8 === "list";
  }
  firstUpdated() {
    this._scroller = new ys(this, {
      onUserScroll: () => this._schedule(this._runReflow)
    }), this._setupResizeObservers(), this._observeClippingAncestors(), this._syncLayoutConfig(), this._schedule(this._runReflow);
  }
  disconnectedCallback() {
    var e8, t5, a4;
    super.disconnectedCallback(), (e8 = this._scroller) == null || e8.destroy(), this._scroller = null, (t5 = this._resizeObserver) == null || t5.disconnect(), this._resizeObserver = null, (a4 = this._itemRO) == null || a4.disconnect(), this._itemRO = null;
    for (const r6 of this._clippingAncestors)
      r6.removeEventListener("scroll", this._onAncestorScroll);
    this._clippingAncestors = [];
  }
  willUpdate(e8) {
    (e8.has("overhang") || e8.has("estimatedItemSize") || e8.has("gap")) && (this._syncLayoutConfig(), this._schedule(this._runReflow)), (e8.has("mode") || e8.has("itemHeight")) && this._schedule(this._runReflow);
  }
  render() {
    return this.mode === "fixed" && this.itemHeight ? this._renderFixed() : this._renderFlow();
  }
  updated(e8) {
    this._reattachItemObserver(), this._positionChildren(), this._applyHostScrollSize(), this._maybeFireScrollEndNear();
  }
  // ---- Rendering ----
  _renderFlow() {
    const e8 = b2`<div ae-vs-sizer aria-hidden="true">&nbsp;</div>`, t5 = [];
    if (this._range.first !== -1 && this._range.last !== -1)
      for (let a4 = this._range.first; a4 <= this._range.last; a4++) {
        const r6 = this._items[a4];
        r6 !== void 0 && t5.push(
          b2`<div
            part="item-host"
            ae-vs-item
            data-index=${a4}
            role=${this._usesListSemantics ? "listitem" : A}
            aria-setsize=${this._usesListSemantics ? this._items.length : A}
            aria-posinset=${this._usesListSemantics ? a4 + 1 : A}
            style=${this._itemStyle(a4)}
          >${this._renderOne(r6, a4)}</div>`
        );
      }
    return b2`
      <div part="scroll-container">
        ${e8}
        ${t5}
      </div>
    `;
  }
  _renderFixed() {
    var i7, s4;
    if (!this.itemHeight || this._items.length === 0)
      return b2`<div part="scroll-container"></div>`;
    const e8 = Va(
      ((i7 = this._scroller) == null ? void 0 : i7.scrollTop) ?? 0,
      ((s4 = this._scroller) == null ? void 0 : s4.clientHeight) ?? this.clientHeight,
      {
        itemCount: this._items.length,
        itemHeight: this.itemHeight,
        gap: this.gap,
        overhang: this.overhang
      }
    ), t5 = {
      itemCount: this._items.length,
      itemHeight: this.itemHeight,
      gap: this.gap
    }, a4 = ms(t5), r6 = [];
    if (e8.first !== -1)
      for (let o9 = e8.first; o9 <= e8.last; o9++) {
        const h3 = this._items[o9];
        if (h3 === void 0) continue;
        const d3 = sr(o9, t5);
        r6.push(
          b2`<div
            part="item-host"
            ae-vs-item
            data-index=${o9}
            role=${this._usesListSemantics ? "listitem" : A}
            aria-setsize=${this._usesListSemantics ? this._items.length : A}
            aria-posinset=${this._usesListSemantics ? o9 + 1 : A}
            style=${`transform: translateY(${d3}px); height: ${this.itemHeight}px;`}
          >${this._renderOne(h3, o9)}</div>`
        );
      }
    return b2`
      <div part="scroll-container" style=${`height: ${a4}px;`}>
        ${r6}
      </div>
    `;
  }
  _renderOne(e8, t5) {
    return this.renderItem ? this.renderItem(e8, t5) : this._slottedTemplate ? this._slottedTemplate.content.cloneNode(true) : b2`${String(e8)}`;
  }
  _itemStyle(e8) {
    return `transform: translateY(${this._childPositions.get(e8) ?? 0}px);`;
  }
  // ---- Layout orchestration ----
  _syncLayoutConfig() {
    this._flowLayout.setOverhang(this.overhang), this._flowLayout.setEstimatedItemSize(this.estimatedItemSize), this._flowLayout.setGap(this.gap), this._flowLayout.setKeyForIndex(
      this.keyFn ? (e8) => {
        const t5 = this._items[e8];
        return t5 === void 0 ? void 0 : this.keyFn(t5, e8);
      } : void 0
    ), this._flowLayout.setItemCount(this._items.length);
  }
  /**
   * Re-attach the per-item ResizeObserver to the newly-rendered children
   * after each `updated()` cycle. Items that fall out of range have their
   * RO disconnected via `_itemRO.disconnect()` on each cycle and we
   * re-observe only the live set.
   */
  _reattachItemObserver() {
    if (this.mode === "fixed" || !this._itemRO) return;
    this._itemRO.disconnect(), this.renderRoot.querySelectorAll("[ae-vs-item]").forEach((a4) => this._itemRO.observe(a4));
  }
  /**
   * Apply absolute positions to the children. The renderer already inlines
   * `transform: translateY` so this is mostly a no-op now — kept for the
   * code path where positions arrive AFTER the render (during measurement
   * convergence).
   */
  _positionChildren() {
    this.renderRoot.querySelectorAll("[ae-vs-item]").forEach((a4) => {
      const r6 = Number(a4.dataset.index);
      if (Number.isNaN(r6)) return;
      const i7 = this._childPositions.get(r6);
      i7 !== void 0 && (a4.style.transform = `translateY(${i7}px)`);
    });
  }
  _applyHostScrollSize() {
    if (this.mode === "fixed" && this.itemHeight) return;
    const t5 = this.renderRoot.querySelector("[ae-vs-sizer]");
    t5 && (t5.style.transform = `translate(0, ${this._scrollSize}px)`);
  }
  _maybeFireScrollEndNear() {
    const e8 = this._scroller;
    if (!e8) return;
    const t5 = e8.maxScrollTop - e8.scrollTop;
    t5 <= this.endOfListThreshold && e8.scrollTop > 0 && this.dispatchEvent(
      new CustomEvent("ae-scroll-end-near", {
        detail: { distanceToEnd: t5 },
        bubbles: true,
        composed: true
      })
    );
  }
  // ---- Items change (#10) ----
  _handleItemsChange(e8, t5) {
    if (!this.keyFn) {
      this._flowLayout.clearCache();
      return;
    }
    const a4 = /* @__PURE__ */ new Set();
    for (let r6 = 0; r6 < t5.length; r6++) {
      const i7 = t5[r6];
      i7 !== void 0 && a4.add(this.keyFn(i7, r6));
    }
    this._flowLayout.pruneCacheToKeys(a4);
  }
  // ---- Observers ----
  _setupResizeObservers() {
    this._resizeObserver = new ResizeObserver(() => {
      this._schedule(this._runReflow);
    }), this._resizeObserver.observe(this), this._itemRO = new ResizeObserver((e8) => {
      let t5 = false;
      for (const a4 of e8) {
        const r6 = a4.target, i7 = Number(r6.dataset.index);
        if (Number.isNaN(i7)) continue;
        const s4 = a4.contentRect.height;
        s4 > 0 && (this._flowLayout.updateItemSize(i7, s4), t5 = true);
      }
      t5 && this._schedule(this._runReflow);
    });
  }
  _observeClippingAncestors() {
    this._clippingAncestors = xs(this);
    for (const e8 of this._clippingAncestors)
      e8.addEventListener("scroll", this._onAncestorScroll, {
        passive: true
      });
  }
};
B2.styles = i`
    :host {
      display: block;
      position: relative;
      overflow: auto;
      contain: size layout;
      /* The scrollbar styling defers to native; tokens stay available
         for downstream theming. */
    }

    [part='scroll-container'] {
      position: relative;
      width: 100%;
    }

    [ae-vs-sizer] {
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      visibility: hidden;
      pointer-events: none;
      font-size: 2px;
      margin: -2px 0 0 0;
      padding: 0;
    }

    [part='item-host'] {
      position: absolute;
      left: 0;
      right: 0;
      box-sizing: border-box;
    }
  `;
X([
  n4({ attribute: false })
], B2.prototype, "items", 1);
X([
  n4({ attribute: false })
], B2.prototype, "renderItem", 2);
X([
  n4({ attribute: false })
], B2.prototype, "keyFn", 2);
X([
  n4({ type: Number, attribute: "estimated-item-size", reflect: false })
], B2.prototype, "estimatedItemSize", 2);
X([
  n4({ type: String, reflect: true })
], B2.prototype, "mode", 2);
X([
  n4({ type: Number, attribute: "item-height" })
], B2.prototype, "itemHeight", 2);
X([
  n4({ type: Number, reflect: false })
], B2.prototype, "overhang", 2);
X([
  n4({ type: Number, reflect: false })
], B2.prototype, "gap", 2);
X([
  n4({ type: Number, attribute: "end-of-list-threshold" })
], B2.prototype, "endOfListThreshold", 2);
X([
  r5()
], B2.prototype, "_range", 2);
X([
  r5()
], B2.prototype, "_scrollSize", 2);
B2 = X([
  t3("ae-virtual-scroller")
], B2);
var Ss = Object.defineProperty;
var Es = Object.getOwnPropertyDescriptor;
var Jt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Es(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ss(t5, a4, i7), i7;
};
var Ne = class extends i4 {
  constructor() {
    super(...arguments), this.value = "", this.disabled = false, this.selected = false, this.active = false;
  }
  updated(e8) {
    e8.has("disabled") && (this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled"));
  }
  render() {
    return b2`
      <span part="row" class="row">
        <slot name="start"></slot>
        <span class="label"><slot></slot></span>
        <slot name="end"></slot>
      </span>
    `;
  }
};
Ne.styles = i`
    /*
     * Theme-overridable tokens (--ae-list-item-bg-active, -bg-selected,
     * -fg-selected, -shadow-selected) are NOT declared at :host —
     * resolved at consumption point. Locked down by
     * src/theme-integration.test.ts.
     */
    :host {
      --ae-list-item-padding-y: var(--ae-space-2);
      --ae-list-item-padding-x: var(--ae-space-3);

      display: block;
      cursor: pointer;
      user-select: none;
      color: var(--ae-color-fg);
      font-size: var(--ae-font-size-sm);
      line-height: var(--ae-line-height-snug);
      border-radius: var(--ae-radius-sm);
    }

    :host([disabled]) {
      color: var(--ae-color-fg-disabled);
      cursor: not-allowed;
    }

    :host([active]:not([disabled])) {
      background: var(--ae-list-item-bg-active, var(--ae-color-bg-muted));
    }

    :host([selected]) {
      background:
        var(--ae-list-item-bg-selected, var(--ae-color-accent-subtle));
      color:
        var(--ae-list-item-fg-selected, var(--ae-color-accent-emphasis));
      box-shadow: var(--ae-list-item-shadow-selected, none);
    }

    :host(:focus-visible) {
      ${y3}
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--ae-space-2);
      padding: var(--ae-list-item-padding-y) var(--ae-list-item-padding-x);
    }

    .label {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::slotted([slot='end']) {
      margin-left: auto;
    }
  `;
Jt([
  n4({ type: String, reflect: true })
], Ne.prototype, "value", 2);
Jt([
  n4({ type: Boolean, reflect: true })
], Ne.prototype, "disabled", 2);
Jt([
  n4({ type: Boolean, reflect: true })
], Ne.prototype, "selected", 2);
Jt([
  n4({ type: Boolean, reflect: true })
], Ne.prototype, "active", 2);
Ne = Jt([
  t3("ae-list-item")
], Ne);
var Cs = Object.defineProperty;
var As = Object.getOwnPropertyDescriptor;
var Lt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? As(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Cs(t5, a4, i7), i7;
};
var Re = class extends i4 {
  constructor() {
    super(...arguments), this.selectionMode = "none", this.variant = "default", this._selected = /* @__PURE__ */ new Set(), this._activeIndex = -1, this._onSlotChange = () => {
      for (const e8 of this._items())
        e8.id || (e8.id = `ae-list-item-${Ka()}`), e8.hasAttribute("role") || e8.setAttribute("role", "option"), e8.setAttribute("aria-selected", this._selected.has(e8.value) ? "true" : "false");
      this._syncItemSelection();
    }, this._onFocus = () => {
      if (this._activeIndex < 0) {
        const e8 = this._enabledItems();
        if (e8.length > 0) {
          const t5 = this._items().indexOf(e8[0]);
          this._setActive(t5);
        }
      }
    }, this._onClick = (e8) => {
      const a4 = e8.composedPath().find(
        (s4) => s4 instanceof Element && s4.tagName.toLowerCase() === "ae-list-item"
      );
      if (!a4 || a4.disabled) return;
      const i7 = this._items().indexOf(a4);
      this._setActive(i7), this._toggleSelection(a4);
    }, this._onKeyDown = (e8) => {
      const t5 = this._items();
      if (t5.length === 0) return;
      const a4 = (r6) => {
        var h3;
        let i7 = r6;
        const s4 = i7;
        let o9 = t5.length + 1;
        for (; o9-- > 0 && ((h3 = t5[i7]) != null && h3.disabled); )
          if (i7 = (i7 + 1) % t5.length, i7 === s4) return;
        this._setActive(i7), e8.preventDefault();
      };
      switch (e8.key) {
        case "ArrowDown": {
          const r6 = this._activeIndex < 0 ? 0 : (this._activeIndex + 1) % t5.length;
          a4(r6);
          break;
        }
        case "ArrowUp": {
          const r6 = this._activeIndex < 0 ? t5.length - 1 : (this._activeIndex - 1 + t5.length) % t5.length;
          a4(r6);
          break;
        }
        case "Home":
          a4(0);
          break;
        case "End":
          a4(t5.length - 1);
          break;
        case " ":
        case "Spacebar": {
          if (this.selectionMode === "none") break;
          const r6 = t5[this._activeIndex];
          r6 && !r6.disabled && (e8.preventDefault(), this._toggleSelection(r6));
          break;
        }
      }
    };
  }
  get selected() {
    return Array.from(this._selected);
  }
  set selected(e8) {
    const t5 = /* @__PURE__ */ new Set();
    if (e8)
      for (const r6 of e8) t5.add(String(r6));
    const a4 = this._selected;
    this._selected = t5, Ua(a4, t5) || (this._syncItemSelection(), this.requestUpdate("selected"));
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "listbox"), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0"), this._syncAriaMultiselect(), this.addEventListener("keydown", this._onKeyDown), this.addEventListener("click", this._onClick), this.addEventListener("focus", this._onFocus);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this._onKeyDown), this.removeEventListener("click", this._onClick), this.removeEventListener("focus", this._onFocus);
  }
  updated(e8) {
    e8.has("selectionMode") && this._syncAriaMultiselect();
  }
  firstUpdated() {
    this._onSlotChange();
  }
  _syncAriaMultiselect() {
    this.selectionMode === "multiple" ? this.setAttribute("aria-multiselectable", "true") : this.removeAttribute("aria-multiselectable");
  }
  _items() {
    var a4;
    const e8 = (a4 = this.shadowRoot) == null ? void 0 : a4.querySelector("slot");
    return e8 ? e8.assignedElements({ flatten: true }).filter(
      (r6) => r6 instanceof Ne || r6.tagName.toLowerCase() === "ae-list-item"
    ) : [];
  }
  _enabledItems() {
    return this._items().filter((e8) => !e8.disabled);
  }
  _syncItemSelection() {
    for (const e8 of this._items())
      e8.selected = this._selected.has(e8.value);
  }
  _setActive(e8) {
    const t5 = this._items();
    if (e8 < 0 || e8 >= t5.length) return;
    this._activeIndex = e8;
    for (let r6 = 0; r6 < t5.length; r6++)
      t5[r6].active = r6 === e8;
    const a4 = t5[e8];
    this.setAttribute("aria-activedescendant", a4.id || (a4.id = `ae-list-item-${Ka()}`));
  }
  _toggleSelection(e8) {
    if (this.selectionMode === "none" || !e8.value) return;
    const t5 = new Set(this._selected);
    if (this.selectionMode === "single" ? t5.has(e8.value) ? t5.delete(e8.value) : (t5.clear(), t5.add(e8.value)) : t5.has(e8.value) ? t5.delete(e8.value) : t5.add(e8.value), !Ua(this._selected, t5)) {
      this._selected = t5, this._syncItemSelection();
      for (const a4 of this._items())
        a4.setAttribute("aria-selected", this._selected.has(a4.value) ? "true" : "false");
      this.dispatchEvent(
        new CustomEvent("ae-selection-change", {
          bubbles: true,
          composed: true,
          detail: { selected: Array.from(this._selected) }
        })
      );
    }
  }
  render() {
    return b2`
      <div part="list" class="list">
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }
};
Re.styles = i`
    :host {
      --ae-list-bg: transparent;
      --ae-list-padding: var(--ae-space-1);
      --ae-list-gap: 0;
      display: block;
      background: var(--ae-list-bg);
      border-radius: var(--ae-radius-md);
      outline: none;
    }
    :host(:focus-visible) {
      ${y3}
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: var(--ae-list-gap);
      padding: var(--ae-list-padding);
      margin: 0;
      list-style: none;
    }

    :host([variant='inset']) {
      --ae-list-padding: var(--ae-space-2) var(--ae-space-3);
      background: var(--ae-color-bg-subtle);
      backdrop-filter: var(--ae-list-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-list-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-border-width-1) solid var(--ae-color-border-subtle);
    }

    :host([variant='striped']) ::slotted(ae-list-item:nth-of-type(odd)) {
      background: var(--ae-color-bg-subtle);
    }
  `;
Lt([
  n4({ type: String, reflect: true, attribute: "selection-mode" })
], Re.prototype, "selectionMode", 2);
Lt([
  n4({ type: String, reflect: true })
], Re.prototype, "variant", 2);
Lt([
  n4({ attribute: false })
], Re.prototype, "selected", 1);
Lt([
  r5()
], Re.prototype, "_selected", 2);
Lt([
  r5()
], Re.prototype, "_activeIndex", 2);
Re = Lt([
  t3("ae-list")
], Re);
function Ua(e8, t5) {
  if (e8.size !== t5.size) return false;
  for (const a4 of e8) if (!t5.has(a4)) return false;
  return true;
}
function Ka() {
  return Math.random().toString(36).slice(2, 10);
}
var zs = Object.defineProperty;
var Ds = Object.getOwnPropertyDescriptor;
var De = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ds(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && zs(t5, a4, i7), i7;
};
var z2 = class extends i4 {
  constructor() {
    super(...arguments), this.value = "", this.label = "", this.expandable = false, this.expanded = false, this.disabled = false, this.selected = false, this.active = false, this.level = 1, this._onToggleClick = (e8) => {
      e8.stopPropagation(), this.dispatchEvent(
        new CustomEvent("ae-tree-node-toggle", {
          bubbles: true,
          composed: true,
          detail: { value: this.value }
        })
      );
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "treeitem");
  }
  updated(e8) {
    e8.has("level") && (this.style.setProperty("--_level", String(this.level)), this.setAttribute("aria-level", String(this.level))), (e8.has("expanded") || e8.has("expandable")) && (this.expandable ? this.setAttribute("aria-expanded", this.expanded ? "true" : "false") : this.removeAttribute("aria-expanded")), e8.has("selected") && this.setAttribute("aria-selected", this.selected ? "true" : "false"), e8.has("disabled") && (this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled"));
  }
  /** Convenience: returns the immediate child `<ae-tree-node>` elements. */
  get childNodes_() {
    var t5;
    const e8 = (t5 = this.shadowRoot) == null ? void 0 : t5.querySelector("slot:not([name])");
    return e8 ? e8.assignedElements({ flatten: true }).filter(
      (a4) => a4 instanceof z2 || a4.tagName.toLowerCase() === "ae-tree-node"
    ) : [];
  }
  render() {
    return b2`
      <div part="row" class="row">
        ${this.expandable ? b2`<button
              part="toggle"
              class="toggle"
              aria-hidden="true"
              tabindex="-1"
              @click=${this._onToggleClick}
            >
              <svg viewBox="0 0 12 12" width="10" height="10">
                <path
                  d="M4 2 L8 6 L4 10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>` : b2`<span class="toggle-placeholder"></span>`}
        <slot name="start"></slot>
        <span part="label" class="label">${this.label || A}<slot name="label"></slot></span>
      </div>
      <div part="children" class="children" role="group">
        <slot></slot>
      </div>
    `;
  }
};
z2.styles = i`
    :host {
      --ae-tree-node-indent: 1.25rem;
      display: block;
      color: var(--ae-color-fg);
      font-size: var(--ae-font-size-sm);
      line-height: var(--ae-line-height-snug);
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--ae-space-1);
      padding: var(--ae-space-1) var(--ae-space-2);
      border-radius: var(--ae-radius-sm);
      cursor: pointer;
      user-select: none;
      padding-left: calc(var(--ae-tree-node-indent) * (var(--_level, 1) - 1) + var(--ae-space-2));
    }

    :host([disabled]) .row {
      color: var(--ae-color-fg-disabled);
      cursor: not-allowed;
    }

    :host([active]:not([disabled])) .row {
      background:
        var(--ae-tree-node-bg-active, var(--ae-color-bg-muted));
    }

    :host([selected]) .row {
      background:
        var(--ae-tree-node-bg-selected, var(--ae-color-accent-subtle));
      color:
        var(--ae-tree-node-fg-selected, var(--ae-color-accent-emphasis));
      box-shadow: var(--ae-tree-node-shadow-selected, none);
    }

    :host(:focus-visible) .row,
    .row:focus-visible {
      ${y3}
    }

    .toggle {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      flex: none;
      color: var(--ae-color-fg-muted);
      cursor: pointer;
      border-radius: var(--ae-radius-xs);
    }
    .toggle svg {
      transition: transform var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    :host([expanded]) .toggle svg {
      transform: rotate(90deg);
    }
    .toggle-placeholder {
      width: 1rem;
      height: 1rem;
      flex: none;
    }

    .label {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .children {
      display: none;
    }
    :host([expanded]) .children {
      display: block;
    }
  `;
De([
  n4({ type: String, reflect: true })
], z2.prototype, "value", 2);
De([
  n4({ type: String })
], z2.prototype, "label", 2);
De([
  n4({ type: Boolean, reflect: true })
], z2.prototype, "expandable", 2);
De([
  n4({ type: Boolean, reflect: true })
], z2.prototype, "expanded", 2);
De([
  n4({ type: Boolean, reflect: true })
], z2.prototype, "disabled", 2);
De([
  n4({ type: Boolean, reflect: true })
], z2.prototype, "selected", 2);
De([
  n4({ type: Boolean, reflect: true })
], z2.prototype, "active", 2);
De([
  n4({ type: Number, attribute: "data-level" })
], z2.prototype, "level", 2);
z2 = De([
  t3("ae-tree-node")
], z2);
var Ps = Object.defineProperty;
var Os = Object.getOwnPropertyDescriptor;
var vt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Os(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ps(t5, a4, i7), i7;
};
var ue = class extends i4 {
  constructor() {
    super(...arguments), this.selectionMode = "none", this._selected = /* @__PURE__ */ new Set(), this._expanded = /* @__PURE__ */ new Set(), this._activeValue = null, this._expandedExplicitlySet = false, this._selectedExplicitlySet = false, this._onSlotChange = () => {
      if (!this._expandedExplicitlySet) {
        const e8 = /* @__PURE__ */ new Set();
        for (const t5 of this._allNodes())
          t5.expandable && t5.expanded && t5.value && e8.add(t5.value);
        e8.size > 0 && (this._expanded = e8);
      }
      if (!this._selectedExplicitlySet) {
        const e8 = /* @__PURE__ */ new Set();
        for (const t5 of this._allNodes())
          t5.selected && t5.value && e8.add(t5.value);
        e8.size > 0 && (this._selected = e8);
      }
      for (const e8 of this._allNodes())
        e8.id || (e8.id = `ae-tree-node-${Wa()}`), e8.hasAttribute("role") || e8.setAttribute("role", "treeitem"), e8.expandable && (e8.expanded = this._expanded.has(e8.value)), e8.selected = this._selected.has(e8.value);
      if (!this._activeValue) {
        const e8 = this._visibleNodes().find((t5) => !t5.disabled);
        e8 && (this._activeValue = e8.value, this._syncActive());
      }
    }, this._onFocus = () => {
      if (!this._activeValue) {
        const e8 = this._visibleNodes().find((t5) => !t5.disabled);
        e8 && (this._activeValue = e8.value, this._syncActive());
      }
    }, this._onToggleEvent = (e8) => {
      const t5 = this._allNodes().find((a4) => a4.value === e8.detail.value);
      t5 && this._toggleExpand(t5);
    }, this._onClick = (e8) => {
      const a4 = e8.composedPath().find(
        (r6) => r6 instanceof Element && r6.tagName.toLowerCase() === "ae-tree-node"
      );
      !a4 || a4.disabled || (this._activeValue = a4.value, this._syncActive(), this._toggleSelection(a4));
    }, this._onKeyDown = (e8) => {
      const t5 = this._visibleNodes();
      if (t5.length === 0) return;
      const a4 = t5.findIndex((i7) => i7.value === this._activeValue), r6 = (i7) => {
        if (i7 < 0 || i7 >= t5.length) return;
        let s4 = i7;
        const o9 = s4;
        let h3 = t5.length + 1;
        for (; h3-- > 0 && t5[s4].disabled; )
          if (s4 = (s4 + 1) % t5.length, s4 === o9) return;
        this._activeValue = t5[s4].value, this._syncActive(), e8.preventDefault();
      };
      switch (e8.key) {
        case "ArrowDown":
          r6(a4 < 0 ? 0 : Math.min(t5.length - 1, a4 + 1));
          break;
        case "ArrowUp":
          r6(a4 < 0 ? t5.length - 1 : Math.max(0, a4 - 1));
          break;
        case "Home":
          r6(0);
          break;
        case "End":
          r6(t5.length - 1);
          break;
        case "ArrowRight": {
          const i7 = t5[a4];
          if (!i7) break;
          if (i7.expandable && !i7.expanded)
            e8.preventDefault(), this._setExpanded(i7, true);
          else if (i7.expandable && i7.expanded) {
            const s4 = i7.childNodes_[0];
            s4 && (e8.preventDefault(), this._activeValue = s4.value, this._syncActive());
          }
          break;
        }
        case "ArrowLeft": {
          const i7 = t5[a4];
          if (!i7) break;
          if (i7.expandable && i7.expanded)
            e8.preventDefault(), this._setExpanded(i7, false);
          else {
            const s4 = this._parentOf(i7);
            s4 && (e8.preventDefault(), this._activeValue = s4.value, this._syncActive());
          }
          break;
        }
        case "Enter":
        case " ":
        case "Spacebar": {
          const i7 = t5[a4];
          i7 && !i7.disabled && (e8.preventDefault(), this._toggleSelection(i7));
          break;
        }
        case "*": {
          const i7 = t5[a4];
          if (!i7) break;
          const s4 = this._parentOf(i7), o9 = s4 ? s4.childNodes_ : Array.from(this.children).filter(
            (h3) => h3 instanceof z2 || h3.tagName.toLowerCase() === "ae-tree-node"
          );
          e8.preventDefault();
          for (const h3 of o9)
            h3.expandable && !h3.expanded && this._setExpanded(h3, true);
          break;
        }
      }
    };
  }
  get selected() {
    return Array.from(this._selected);
  }
  set selected(e8) {
    this._selectedExplicitlySet = true;
    const t5 = Ya(e8);
    xa(this._selected, t5) || (this._selected = t5, this._syncNodeSelection(), this.requestUpdate("selected"));
  }
  get expanded() {
    return Array.from(this._expanded);
  }
  set expanded(e8) {
    this._expandedExplicitlySet = true;
    const t5 = Ya(e8);
    xa(this._expanded, t5) || (this._expanded = t5, this._syncNodeExpansion(), this.requestUpdate("expanded"));
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "tree"), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0"), this._syncAriaMultiselect(), this.addEventListener("keydown", this._onKeyDown), this.addEventListener("click", this._onClick), this.addEventListener("focus", this._onFocus), this.addEventListener("ae-tree-node-toggle", this._onToggleEvent);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this._onKeyDown), this.removeEventListener("click", this._onClick), this.removeEventListener("focus", this._onFocus), this.removeEventListener("ae-tree-node-toggle", this._onToggleEvent);
  }
  updated(e8) {
    e8.has("selectionMode") && this._syncAriaMultiselect();
  }
  firstUpdated() {
    this._onSlotChange();
  }
  _syncAriaMultiselect() {
    this.selectionMode === "multiple" ? this.setAttribute("aria-multiselectable", "true") : this.removeAttribute("aria-multiselectable");
  }
  /**
   * Returns every `<ae-tree-node>` in document order (deep), with the
   * level applied as we go so each node knows its depth.
   */
  _allNodes() {
    const e8 = [], t5 = (a4, r6) => {
      const i7 = Array.from(a4.children).filter(
        (o9) => o9 instanceof z2 || o9.tagName.toLowerCase() === "ae-tree-node"
      ), s4 = i7.length;
      i7.forEach((o9, h3) => {
        o9.level = r6, o9.setAttribute("aria-setsize", String(s4)), o9.setAttribute("aria-posinset", String(h3 + 1)), e8.push(o9), t5(o9, r6 + 1);
      });
    };
    return t5(this, 1), e8;
  }
  /** Returns nodes whose ancestors are all expanded (i.e. currently visible). */
  _visibleNodes() {
    const e8 = [], t5 = (a4, r6) => {
      const i7 = Array.from(a4.children).filter(
        (s4) => s4 instanceof z2 || s4.tagName.toLowerCase() === "ae-tree-node"
      );
      for (const s4 of i7) {
        r6 && e8.push(s4);
        const o9 = r6 && (!s4.expandable || s4.expanded);
        t5(s4, o9);
      }
    };
    return t5(this, true), e8;
  }
  _parentOf(e8) {
    let t5 = e8.parentElement;
    for (; t5; ) {
      if (t5 instanceof z2) return t5;
      if (t5 instanceof ue) return null;
      t5 = t5.parentElement;
    }
    return null;
  }
  _syncNodeSelection() {
    for (const e8 of this._allNodes()) e8.selected = this._selected.has(e8.value);
  }
  _syncNodeExpansion() {
    for (const e8 of this._allNodes()) e8.expanded = this._expanded.has(e8.value);
  }
  _syncActive() {
    const e8 = this._allNodes();
    for (const a4 of e8)
      a4.active = a4.value === this._activeValue;
    const t5 = e8.find((a4) => a4.value === this._activeValue);
    t5 && (t5.id || (t5.id = `ae-tree-node-${Wa()}`), this.setAttribute("aria-activedescendant", t5.id));
  }
  _setExpanded(e8, t5) {
    if (!e8.expandable || e8.expanded === t5) return;
    const a4 = new Set(this._expanded);
    t5 ? a4.add(e8.value) : a4.delete(e8.value), this._expanded = a4, e8.expanded = t5, this.dispatchEvent(
      new CustomEvent(t5 ? "ae-expand" : "ae-collapse", {
        bubbles: true,
        composed: true,
        detail: { value: e8.value }
      })
    );
  }
  _toggleExpand(e8) {
    this._setExpanded(e8, !e8.expanded);
  }
  _toggleSelection(e8) {
    if (this.selectionMode === "none" || !e8.value) return;
    const t5 = new Set(this._selected);
    this.selectionMode === "single" ? t5.has(e8.value) ? t5.delete(e8.value) : (t5.clear(), t5.add(e8.value)) : t5.has(e8.value) ? t5.delete(e8.value) : t5.add(e8.value), !xa(this._selected, t5) && (this._selected = t5, this._syncNodeSelection(), this.dispatchEvent(
      new CustomEvent("ae-selection-change", {
        bubbles: true,
        composed: true,
        detail: { selected: Array.from(this._selected) }
      })
    ));
  }
  render() {
    return b2`<div part="tree">
      <slot @slotchange=${this._onSlotChange}></slot>
    </div>`;
  }
};
ue.styles = i`
    :host {
      --ae-tree-padding: var(--ae-space-1);
      display: block;
      outline: none;
    }
    :host(:focus-visible) {
      ${y3}
    }
    /*
     * Padding lives on the [part=tree] container, NOT on :host. A consumer's
     * global reset (\`* { padding: 0 }\`) is a document-tree declaration, and in
     * the cascade a normal document declaration overrides a normal :host one —
     * so host padding silently collapses to 0 under that common reset. A
     * document \`*\` selector can't reach inside this shadow tree, so the
     * container's padding is immune. Driven by --ae-tree-padding either way.
     */
    [part='tree'] {
      padding: var(--ae-tree-padding);
    }
  `;
vt([
  n4({ type: String, reflect: true, attribute: "selection-mode" })
], ue.prototype, "selectionMode", 2);
vt([
  n4({ attribute: false })
], ue.prototype, "selected", 1);
vt([
  n4({ attribute: false })
], ue.prototype, "expanded", 1);
vt([
  r5()
], ue.prototype, "_selected", 2);
vt([
  r5()
], ue.prototype, "_expanded", 2);
vt([
  r5()
], ue.prototype, "_activeValue", 2);
ue = vt([
  t3("ae-tree")
], ue);
function Ya(e8) {
  const t5 = /* @__PURE__ */ new Set();
  if (e8) for (const a4 of e8) t5.add(String(a4));
  return t5;
}
function xa(e8, t5) {
  if (e8.size !== t5.size) return false;
  for (const a4 of e8) if (!t5.has(a4)) return false;
  return true;
}
function Wa() {
  return Math.random().toString(36).slice(2, 10);
}
var Ts = Object.defineProperty;
var Ls = Object.getOwnPropertyDescriptor;
var Qt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ls(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ts(t5, a4, i7), i7;
};
var st = class extends i4 {
  constructor() {
    super(...arguments), this.column = null, this.align = "start", this.sortable = false, this.sort = "none";
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "columnheader");
  }
  updated(e8) {
    e8.has("sort") && (this.sort === "none" ? this.removeAttribute("aria-sort") : this.setAttribute("aria-sort", this.sort === "asc" ? "ascending" : "descending")), e8.has("sortable") && (this.sortable ? this.setAttribute("tabindex", "0") : this.removeAttribute("tabindex"));
  }
  render() {
    return b2`
      <span class="cell">
        <slot></slot>
        ${this.sortable ? b2`<svg class="sort-icon" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M3 5 L6 2 L9 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 7 L6 10 L9 7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="${this.sort === "asc" ? "0" : "1"}"
              />
            </svg>` : A}
      </span>
    `;
  }
};
st.styles = i`
    :host {
      --ae-th-padding: var(--ae-space-2) var(--ae-space-3);
      display: table-cell;
      vertical-align: middle;
      text-align: left;
      border-bottom: var(--ae-border-width-1) solid var(--ae-color-border);
      font-weight: inherit;
    }
    :host([align='center']) { text-align: center; }
    :host([align='end']) { text-align: right; }

    :host([sortable]) {
      cursor: pointer;
      user-select: none;
    }
    :host([sortable]:hover) {
      color: var(--ae-color-fg);
    }

    /*
     * Cell padding lives on .cell, NOT on :host. A consumer's global
     * "* { padding: 0 }" reset is a document-tree declaration and overrides a
     * normal :host one in the cascade, so host padding would silently collapse
     * to 0 — cramming header text against the cell edge. A document-scope star
     * selector cannot reach inside this shadow tree, so .cell's padding is safe.
     */
    .cell {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-1);
      padding: var(--ae-th-padding);
    }
    :host([align='center']) .cell { justify-content: center; }
    :host([align='end']) .cell { justify-content: flex-end; }

    .sort-icon {
      width: 0.75em;
      height: 0.75em;
      opacity: 0.4;
      flex: none;
    }
    :host([sort='asc']) .sort-icon,
    :host([sort='desc']) .sort-icon {
      opacity: 1;
      color: var(--ae-color-accent-emphasis);
    }
    :host([sort='desc']) .sort-icon {
      transform: rotate(180deg);
    }
  `;
Qt([
  n4({ type: String, reflect: true })
], st.prototype, "column", 2);
Qt([
  n4({ type: String, reflect: true })
], st.prototype, "align", 2);
Qt([
  n4({ type: Boolean, reflect: true })
], st.prototype, "sortable", 2);
Qt([
  n4({ type: String, reflect: true })
], st.prototype, "sort", 2);
st = Qt([
  t3("ae-th")
], st);
var Is = Object.getOwnPropertyDescriptor;
var Ms = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Is(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = o9(i7) || i7);
  return i7;
};
var Sa = class extends i4 {
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "rowgroup");
  }
  render() {
    return b2`<slot></slot>`;
  }
};
Sa.styles = i`
    /*
     * Background, color, and tracking are read via the same
     * --ae-table-header-* tokens that the data-mode table consumes,
     * so theme packs like Metro that override the header chrome flow
     * through to both render paths.
     */
    :host {
      display: table-header-group;
      background: var(--ae-table-header-bg, var(--ae-color-bg-subtle));
      color: var(--ae-table-header-fg, var(--ae-color-fg-muted));
      font-weight: var(--ae-font-weight-semibold);
      font-size: var(--ae-font-size-xs);
      text-transform: uppercase;
      letter-spacing:
        var(--ae-table-header-letter-spacing,
          var(--ae-letter-spacing-wide));
    }
  `;
Sa = Ms([
  t3("ae-thead")
], Sa);
var Bs = Object.getOwnPropertyDescriptor;
var Fs = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Bs(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = o9(i7) || i7);
  return i7;
};
var Ea = class extends i4 {
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "rowgroup");
  }
  render() {
    return b2`<slot></slot>`;
  }
};
Ea.styles = i`
    :host {
      display: table-row-group;
    }
  `;
Ea = Fs([
  t3("ae-tbody")
], Ea);
var js = Object.defineProperty;
var Ns = Object.getOwnPropertyDescriptor;
var or = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ns(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && js(t5, a4, i7), i7;
};
var na = class extends i4 {
  constructor() {
    super(...arguments), this.selected = false;
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "row");
  }
  render() {
    return b2`<slot></slot>`;
  }
};
na.styles = i`
    :host {
      display: table-row;
      border-bottom: var(--ae-border-width-1) solid var(--ae-color-border-subtle);
    }
    :host([selected]) {
      background: var(--ae-color-accent-subtle);
    }
    :host(:hover) {
      background: var(--ae-color-bg-subtle);
    }
    :host([selected]:hover) {
      background: var(--ae-color-accent-subtle);
    }
  `;
or([
  n4({ type: Boolean, reflect: true })
], na.prototype, "selected", 2);
na = or([
  t3("ae-tr")
], na);
var Rs = Object.defineProperty;
var qs = Object.getOwnPropertyDescriptor;
var nr = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? qs(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Rs(t5, a4, i7), i7;
};
var la = class extends i4 {
  constructor() {
    super(...arguments), this.align = "start";
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "cell");
  }
  render() {
    return b2`<div class="cell"><slot></slot></div>`;
  }
};
la.styles = i`
    :host {
      --ae-td-padding: var(--ae-space-2) var(--ae-space-3);
      display: table-cell;
      vertical-align: middle;
      color: var(--ae-color-fg);
      font-size: var(--ae-font-size-sm);
      text-align: left;
    }
    :host([align='center']) { text-align: center; }
    :host([align='end']) { text-align: right; }

    /*
     * Cell padding lives on the .cell wrapper, NOT on :host. A consumer's
     * global "* { padding: 0 }" reset is a document-tree declaration and
     * overrides a normal :host one in the cascade, so host padding would
     * silently collapse to 0 — cramming cell content against the edge. A
     * document-scope star selector cannot reach inside this shadow tree, so
     * .cell is immune.
     */
    .cell {
      padding: var(--ae-td-padding);
    }
  `;
nr([
  n4({ type: String, reflect: true })
], la.prototype, "align", 2);
la = nr([
  t3("ae-td")
], la);
var Vs = Object.defineProperty;
var Hs = Object.getOwnPropertyDescriptor;
var Z2 = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Hs(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Vs(t5, a4, i7), i7;
};
var F = class extends i4 {
  constructor() {
    super(...arguments), this.sortable = false, this.sortBy = null, this.sortDirection = "asc", this.selectionMode = "none", this.density = "default", this.stickyHeader = false, this.caption = null, this.rows = null, this.columns = null, this._selected = /* @__PURE__ */ new Set(), this._ownsTableRole = false, this._ownsAriaLabel = false, this._onClick = (e8) => {
      const a4 = e8.composedPath().find(
        (r6) => r6 instanceof Element && r6.tagName.toLowerCase() === "ae-th"
      );
      if (a4 && a4.sortable && a4.column) {
        this._handleSort(a4.column);
        return;
      }
    }, this._onKeydown = (e8) => {
      if (e8.key !== "Enter" && e8.key !== " " && e8.key !== "Spacebar") return;
      const t5 = e8.composedPath().find(
        (a4) => a4 instanceof Element && a4.tagName.toLowerCase() === "ae-th"
      );
      t5 && t5.sortable && t5.column && (e8.preventDefault(), this._handleSort(t5.column));
    };
  }
  get selected() {
    return Array.from(this._selected);
  }
  set selected(e8) {
    const t5 = /* @__PURE__ */ new Set();
    if (e8) for (const a4 of e8) t5.add(String(a4));
    Ga(this._selected, t5) || (this._selected = t5, this.requestUpdate("selected"));
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("click", this._onClick), this.addEventListener("keydown", this._onKeydown), this._syncHostTableSemantics();
  }
  /**
   * Slot mode renders the table grid from the host + slotted display:table
   * sub-elements, so the HOST carries `role="table"` and (when a caption is
   * set) names itself via `aria-label` — a real `<caption>` can't attach to
   * the contents-display slot region.
   *
   * Data mode renders a real `<table>` with its own implicit table role and
   * `<caption>`, so a `role="table"` on the host would nest a SECOND,
   * redundant table in the accessibility tree. We strip the role/label we
   * set ourselves in that case (never a consumer-authored one).
   */
  _syncHostTableSemantics() {
    if (this._isDataMode()) {
      this._ownsTableRole && this.getAttribute("role") === "table" && (this.removeAttribute("role"), this._ownsTableRole = false), this._ownsAriaLabel && (this.removeAttribute("aria-label"), this._ownsAriaLabel = false);
      return;
    }
    this.hasAttribute("role") || (this.setAttribute("role", "table"), this._ownsTableRole = true), this.caption && !this.hasAttribute("aria-label") ? (this.setAttribute("aria-label", this.caption), this._ownsAriaLabel = true) : this._ownsAriaLabel && !this.caption ? (this.removeAttribute("aria-label"), this._ownsAriaLabel = false) : this._ownsAriaLabel && this.caption && this.setAttribute("aria-label", this.caption);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("click", this._onClick), this.removeEventListener("keydown", this._onKeydown);
  }
  updated(e8) {
    (e8.has("sortBy") || e8.has("sortDirection")) && this._syncSlotSortAttributes(), (e8.has("rows") || e8.has("columns") || e8.has("caption")) && this._syncHostTableSemantics();
  }
  _syncSlotSortAttributes() {
    this.querySelectorAll("ae-th").forEach((t5) => {
      const a4 = t5;
      if (!a4.column) {
        a4.sort = "none";
        return;
      }
      a4.column === this.sortBy ? a4.sort = this.sortDirection : a4.sort = "none";
    });
  }
  /** Sortable headers must be operable by keyboard (WCAG 2.1.1): Enter or
   *  Space toggles the sort, mirroring the click affordance. */
  _onHeaderKeydown(e8, t5) {
    (e8.key === "Enter" || e8.key === " " || e8.key === "Spacebar") && (e8.preventDefault(), this._handleSort(t5));
  }
  _handleSort(e8) {
    let t5 = "asc";
    this.sortBy === e8 && (t5 = this.sortDirection === "asc" ? "desc" : "asc"), this.sortBy = e8, this.sortDirection = t5, this.dispatchEvent(
      new CustomEvent("ae-sort-change", {
        bubbles: true,
        composed: true,
        detail: { column: e8, direction: t5 }
      })
    );
  }
  _toggleRow(e8) {
    if (this.selectionMode === "none") return;
    const t5 = new Set(this._selected);
    this.selectionMode === "single" ? t5.has(e8) ? t5.delete(e8) : (t5.clear(), t5.add(e8)) : t5.has(e8) ? t5.delete(e8) : t5.add(e8), !Ga(this._selected, t5) && (this._selected = t5, this.dispatchEvent(
      new CustomEvent("ae-selection-change", {
        bubbles: true,
        composed: true,
        detail: { selected: Array.from(this._selected) }
      })
    ));
  }
  _isDataMode() {
    return Array.isArray(this.rows) && Array.isArray(this.columns);
  }
  _renderDataMode() {
    const e8 = this.rows ?? [], t5 = this.columns ?? [], a4 = t5.map((r6) => {
      const i7 = !!(r6.sortable && this.sortable), o9 = this.sortBy === r6.id ? this.sortDirection === "asc" ? "ascending" : "descending" : null;
      return b2`<th
        scope="col"
        role="columnheader"
        data-column=${r6.id}
        data-align=${r6.align ?? A}
        ?data-sortable=${i7}
        aria-sort=${o9 ?? A}
        tabindex=${i7 ? "0" : A}
        @click=${i7 ? () => this._handleSort(r6.id) : A}
        @keydown=${i7 ? (h3) => this._onHeaderKeydown(h3, r6.id) : A}
      >
        ${r6.label}${i7 ? b2`<span class="sort-icon"></span>` : A}
      </th>`;
    });
    return b2`
      <table class="data" part="table">
        ${this.caption ? b2`<caption>${this.caption}</caption>` : A}
        <thead role="rowgroup">
          <tr role="row">${a4}</tr>
        </thead>
        <tbody role="rowgroup">
          ${e8.map((r6, i7) => this._renderDataRow(r6, t5, i7))}
        </tbody>
      </table>
    `;
  }
  _renderDataRow(e8, t5, a4) {
    const r6 = String(e8.id ?? a4), i7 = this._selected.has(r6), s4 = this.selectionMode === "none" ? A : () => this._toggleRow(r6);
    return b2`<tr
      role="row"
      data-id=${r6}
      data-selected=${i7 ? "true" : "false"}
      aria-selected=${this.selectionMode === "none" ? A : i7 ? "true" : "false"}
      @click=${s4}
    >
      ${t5.map((o9) => {
      const h3 = e8[o9.id], d3 = o9.render ? o9.render(h3, e8) : h3;
      return b2`<td role="cell" data-align=${o9.align ?? A}>${d3}</td>`;
    })}
    </tr>`;
  }
  render() {
    return this._isDataMode() ? this._renderDataMode() : b2`
      <div class="slot-region" part="table">
        ${this.caption ? b2`<div
              style="padding: var(--ae-space-2) var(--ae-space-3); color: var(--ae-color-fg-muted); font-size: var(--ae-font-size-sm);"
            >
              ${this.caption}
            </div>` : A}
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
};
F.styles = i`
    /*
     * Theme-overridable tokens (--ae-table-bg, -border, -header-bg,
     * -header-fg, -header-letter-spacing) are NOT declared at :host.
     * Locked down by src/theme-integration.test.ts.
     */
    :host {
      --ae-table-row-height: 2.5rem;
      --ae-table-cell-padding: var(--ae-space-2) var(--ae-space-3);
      display: block;
      background: var(--ae-table-bg, var(--ae-color-bg));
      /* Frosted-glass hook — the data grid a reviewer reads frosts over the
       * atmosphere. Inert unless a theme sets --ae-surface-backdrop-filter and
       * a translucent --ae-table-bg (Crucible). */
      backdrop-filter: var(--ae-table-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-table-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-border-width-1) solid
        var(--ae-table-border, var(--ae-color-border));
      border-radius: var(--ae-radius-md);
      overflow: auto;
      font-family: var(--ae-font-family-sans);
      color: var(--ae-color-fg);
    }
    :host(:focus-visible) {
      ${y3}
    }

    :host([density='compact']) {
      --ae-table-row-height: 2rem;
      --ae-table-cell-padding: var(--ae-space-1) var(--ae-space-3);
    }
    :host([density='relaxed']) {
      --ae-table-row-height: 3rem;
      --ae-table-cell-padding: var(--ae-space-3) var(--ae-space-4);
    }

    table.data {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--ae-font-size-sm);
    }
    table.data caption {
      caption-side: top;
      text-align: left;
      padding: var(--ae-space-2) var(--ae-space-3);
      color: var(--ae-color-fg-muted);
      font-size: var(--ae-font-size-sm);
    }
    table.data thead {
      background: var(--ae-table-header-bg, var(--ae-color-bg-subtle));
      color: var(--ae-table-header-fg, var(--ae-color-fg-muted));
      font-weight: var(--ae-font-weight-semibold);
      font-size: var(--ae-font-size-xs);
      text-transform: uppercase;
      letter-spacing:
        var(--ae-table-header-letter-spacing,
          var(--ae-letter-spacing-wide));
    }
    :host([sticky-header]) table.data thead th {
      position: sticky;
      top: 0;
      background: var(--ae-table-header-bg, var(--ae-color-bg-subtle));
      z-index: 1;
    }
    table.data th,
    table.data td {
      padding: var(--ae-table-cell-padding);
      text-align: left;
      border-bottom: var(--ae-border-width-1) solid var(--ae-color-border-subtle);
      vertical-align: middle;
    }
    table.data th[data-align='center'],
    table.data td[data-align='center'] { text-align: center; }
    table.data th[data-align='end'],
    table.data td[data-align='end'] { text-align: right; }
    table.data th[data-sortable] {
      cursor: pointer;
      user-select: none;
    }
    table.data th[aria-sort='ascending'],
    table.data th[aria-sort='descending'] {
      color: var(--ae-color-accent-emphasis);
    }
    table.data tr[data-selected='true'] {
      background: var(--ae-color-accent-subtle);
    }
    table.data tbody tr:hover {
      background: var(--ae-color-bg-subtle);
    }

    .wrapper {
      display: table;
      width: 100%;
    }

    .slot-region {
      display: contents;
    }

    .sort-icon {
      display: inline-block;
      margin-left: var(--ae-space-1);
      opacity: 0.45;
      font-size: 0.7em;
    }
    th[aria-sort='ascending'] .sort-icon::after { content: '▲'; opacity: 1; }
    th[aria-sort='descending'] .sort-icon::after { content: '▼'; opacity: 1; }
    th[data-sortable] .sort-icon::after { content: '⇅'; }
  `;
Z2([
  n4({ type: Boolean, reflect: true })
], F.prototype, "sortable", 2);
Z2([
  n4({ type: String, reflect: true, attribute: "sort-by" })
], F.prototype, "sortBy", 2);
Z2([
  n4({ type: String, reflect: true, attribute: "sort-direction" })
], F.prototype, "sortDirection", 2);
Z2([
  n4({ type: String, reflect: true, attribute: "selection-mode" })
], F.prototype, "selectionMode", 2);
Z2([
  n4({ type: String, reflect: true })
], F.prototype, "density", 2);
Z2([
  n4({ type: Boolean, reflect: true, attribute: "sticky-header" })
], F.prototype, "stickyHeader", 2);
Z2([
  n4({ type: String })
], F.prototype, "caption", 2);
Z2([
  n4({ attribute: false })
], F.prototype, "rows", 2);
Z2([
  n4({ attribute: false })
], F.prototype, "columns", 2);
Z2([
  n4({ attribute: false })
], F.prototype, "selected", 1);
Z2([
  r5()
], F.prototype, "_selected", 2);
F = Z2([
  t3("ae-table")
], F);
function Ga(e8, t5) {
  if (e8.size !== t5.size) return false;
  for (const a4 of e8) if (!t5.has(a4)) return false;
  return true;
}
var Us = Object.defineProperty;
var Ks = Object.getOwnPropertyDescriptor;
var Pe = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ks(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Us(t5, a4, i7), i7;
};
var te = class extends i4 {
  constructor() {
    super(...arguments), this.src = null, this.name = "", this.initials = null, this.size = "md", this.shape = "circle", this.tone = "neutral", this.status = null, this._imageFailed = false, this._onImgError = () => {
      this._imageFailed = true;
    };
  }
  _deriveInitials() {
    if (this.initials && this.initials.trim().length > 0)
      return this.initials.trim().slice(0, 2).toUpperCase();
    const e8 = (this.name ?? "").trim();
    if (!e8) return "";
    const t5 = e8.split(/\s+/).filter(Boolean);
    return t5.length === 0 ? "" : t5.length === 1 ? (t5[0][0] ?? "").toUpperCase() : ((t5[0][0] ?? "") + (t5[t5.length - 1][0] ?? "")).toUpperCase();
  }
  willUpdate(e8) {
    e8.has("src") && (this._imageFailed = false);
  }
  render() {
    const e8 = this.name || this.initials || "Avatar", t5 = !!this.src && !this._imageFailed, a4 = this._deriveInitials();
    return b2`
      <span
        part="avatar"
        class="avatar"
        role="img"
        aria-label=${e8}
      >
        ${t5 ? b2`<img
              part="image"
              src=${this.src}
              alt=""
              @error=${this._onImgError}
            />` : b2`<slot>${a4}</slot>`}
      </span>
      ${this.status ? b2`<span
            part="status"
            class="status"
            role="img"
            aria-label=${this.status}
          ></span>` : A}
    `;
  }
};
te.styles = i`
    :host {
      --ae-avatar-size: 2.5rem;
      --ae-avatar-bg: var(--ae-color-bg-muted);
      --ae-avatar-fg: var(--ae-color-fg);
      --ae-avatar-radius: var(--ae-radius-full);
      --_status-bg: var(--ae-color-gray-400);

      display: inline-flex;
      vertical-align: middle;
      position: relative;
      width: var(--ae-avatar-size);
      height: var(--ae-avatar-size);
    }

    :host([size='xs']) { --ae-avatar-size: 1.25rem; }
    :host([size='sm']) { --ae-avatar-size: 1.75rem; }
    :host([size='md']) { --ae-avatar-size: 2.5rem; }
    :host([size='lg']) { --ae-avatar-size: 3.25rem; }
    :host([size='xl']) { --ae-avatar-size: 4.5rem; }

    :host([shape='square']) {
      --ae-avatar-radius: var(--ae-avatar-square-radius, var(--ae-radius-md));
    }

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: var(--ae-avatar-radius);
      background: var(--ae-avatar-bg);
      color: var(--ae-avatar-fg);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: var(--ae-avatar-font-family, var(--ae-font-family-sans));
      font-weight: var(--ae-avatar-font-weight, var(--ae-font-weight-semibold));
      font-size: calc(var(--ae-avatar-size) * 0.4);
      line-height: 1;
      letter-spacing: var(--ae-avatar-tracking, var(--ae-letter-spacing-tight));
      user-select: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Tones drive fallback bg/fg. Each routes through a per-tone indirection
     * token (fallback preserves the default) so a brand recolors a tone by
     * SETTING it at :root — Metro flips the soft tints into solid signal
     * grounds with paper/ink initials, matching the source ticket avatar. */
    :host([tone='neutral']) {
      --ae-avatar-bg: var(--ae-avatar-neutral-bg, var(--ae-color-bg-muted));
      --ae-avatar-fg: var(--ae-avatar-neutral-fg, var(--ae-color-fg));
    }
    :host([tone='accent']) {
      --ae-avatar-bg: var(--ae-avatar-accent-bg, var(--ae-color-accent-subtle));
      --ae-avatar-fg: var(--ae-avatar-accent-fg, var(--ae-color-accent-emphasis));
    }
    :host([tone='success']) {
      --ae-avatar-bg: var(--ae-avatar-success-bg, var(--ae-color-success-subtle));
      --ae-avatar-fg: var(--ae-avatar-success-fg, var(--ae-color-success-emphasis));
    }
    :host([tone='warning']) {
      --ae-avatar-bg: var(--ae-avatar-warning-bg, var(--ae-color-warning-subtle));
      --ae-avatar-fg: var(--ae-avatar-warning-fg, var(--ae-color-warning-emphasis));
    }
    :host([tone='danger']) {
      --ae-avatar-bg: var(--ae-avatar-danger-bg, var(--ae-color-danger-subtle));
      --ae-avatar-fg: var(--ae-avatar-danger-fg, var(--ae-color-danger-emphasis));
    }
    :host([tone='info']) {
      --ae-avatar-bg: var(--ae-avatar-info-bg, var(--ae-color-info-subtle));
      --ae-avatar-fg: var(--ae-avatar-info-fg, var(--ae-color-info-emphasis));
    }

    /* Status dot */
    .status {
      position: absolute;
      right: 0;
      bottom: 0;
      width: calc(var(--ae-avatar-size) * 0.28);
      height: calc(var(--ae-avatar-size) * 0.28);
      min-width: 8px;
      min-height: 8px;
      border-radius: var(--ae-radius-full);
      background: var(--_status-bg);
      box-shadow: 0 0 0 2px var(--ae-color-bg);
    }
    :host([status='online'])  { --_status-bg: var(--ae-color-success); }
    :host([status='offline']) { --_status-bg: var(--ae-color-gray-400); }
    :host([status='busy'])    { --_status-bg: var(--ae-color-danger); }
    :host([status='away'])    { --_status-bg: var(--ae-color-warning); }
  `;
Pe([
  n4({ type: String })
], te.prototype, "src", 2);
Pe([
  n4({ type: String })
], te.prototype, "name", 2);
Pe([
  n4({ type: String })
], te.prototype, "initials", 2);
Pe([
  n4({ type: String, reflect: true })
], te.prototype, "size", 2);
Pe([
  n4({ type: String, reflect: true })
], te.prototype, "shape", 2);
Pe([
  n4({ type: String, reflect: true })
], te.prototype, "tone", 2);
Pe([
  n4({ type: String, reflect: true })
], te.prototype, "status", 2);
Pe([
  r5()
], te.prototype, "_imageFailed", 2);
te = Pe([
  t3("ae-avatar")
], te);
var Ys = Object.defineProperty;
var Ws = Object.getOwnPropertyDescriptor;
var Je = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ws(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Ys(t5, a4, i7), i7;
};
var fe = class extends i4 {
  constructor() {
    super(...arguments), this.value = null, this.max = 100, this.tone = "accent", this.size = "md", this.striped = false, this.label = "Loading", this.showLabel = false;
  }
  get _isIndeterminate() {
    return this.value === null || this.value === void 0 || Number.isNaN(this.value);
  }
  get _clampedValue() {
    const e8 = Math.max(0, Math.min(this.max, Number(this.value)));
    return Number.isFinite(e8) ? e8 : 0;
  }
  render() {
    const e8 = this._isIndeterminate, t5 = e8 ? void 0 : this._clampedValue, a4 = e8 ? 0 : this._clampedValue / this.max * 100;
    return b2`
      ${this.showLabel ? b2`<span class="label">${this.label}</span>` : b2`<span class="label-hidden">${this.label}</span>`}
      <div
        class="track"
        part="track"
        role="progressbar"
        aria-label=${this.label}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${t5 ?? A}
        aria-busy=${e8 ? "true" : "false"}
      >
        ${e8 ? b2`<div class="indeterminate" part="fill"></div>` : b2`<div
              class="fill"
              part="fill"
              style="width:${a4}%"
            ></div>`}
      </div>
    `;
  }
};
fe.styles = i`
    /*
     * Theme-overridable tokens (--ae-progress-track, -fill, -radius,
     * -border) are NOT declared at :host — :host declarations would
     * shadow root-level theme overrides. Resolved at the consumption
     * point via var(--token, fallback). The per-tone selectors below
     * set a PRIVATE --_progress-tone-color the consumption rule chains
     * to, so theme-level fill overrides (e.g. Metro's stripe gradient)
     * win regardless of which tone attribute is set.
     */
    :host {
      --ae-progress-height: 0.5rem;
      display: block;
      width: 100%;
    }
    :host([size='sm']) { --ae-progress-height: 0.25rem; }
    :host([size='md']) { --ae-progress-height: 0.5rem; }
    :host([size='lg']) { --ae-progress-height: 0.875rem; }

    :host([tone='neutral']) { --_progress-tone-color: var(--ae-color-gray-600); }
    :host([tone='accent'])  { --_progress-tone-color: var(--ae-color-accent); }
    :host([tone='success']) { --_progress-tone-color: var(--ae-color-success); }
    :host([tone='warning']) { --_progress-tone-color: var(--ae-color-warning); }
    :host([tone='danger'])  { --_progress-tone-color: var(--ae-color-danger); }

    .label {
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg-muted);
      margin-bottom: var(--ae-space-1);
      display: block;
    }
    .label-hidden {
      ${tr}
    }

    .track {
      position: relative;
      width: 100%;
      height: var(--ae-progress-height);
      background: var(--ae-progress-track, var(--ae-color-bg-muted));
      border: var(--ae-progress-border, none);
      border-radius: var(--ae-progress-radius, var(--ae-radius-full));
      overflow: hidden;
      box-sizing: border-box;
    }

    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: var(--ae-progress-fill,
        var(--_progress-tone-color, var(--ae-color-accent)));
      border-radius: inherit;
      /* Bioluminescent accent — a brand (Crucible) can make the bar glow. */
      box-shadow: var(--ae-progress-glow, none);
      transition: width var(--ae-duration-normal) var(--ae-easing-ease-out);
    }

    :host([striped]) .fill {
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.18) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.18) 50%,
        rgba(255, 255, 255, 0.18) 75%,
        transparent 75%
      );
      background-size: 1rem 1rem;
      animation: ae-progress-stripe 1.2s linear infinite;
    }

    .indeterminate {
      position: absolute;
      inset: 0 auto 0 0;
      width: 35%;
      background: var(--ae-progress-fill,
        var(--_progress-tone-color, var(--ae-color-accent)));
      border-radius: inherit;
      box-shadow: var(--ae-progress-glow, none);
      animation: ae-progress-indeterminate 1.6s var(--ae-easing-ease-in-out) infinite;
    }

    @keyframes ae-progress-stripe {
      from { background-position: 0 0; }
      to   { background-position: 1rem 0; }
    }
    @keyframes ae-progress-indeterminate {
      0%   { left: -35%; }
      100% { left: 100%; }
    }

    /*
     * Reduced-motion: stop the sliding indeterminate bar and the animated
     * stripe. The indeterminate fill rests at its static 35% start position
     * (still a visible "busy" affordance); aria-busy conveys it to AT.
     * Hardcoded-duration keyframes bypass the global token reset, so guard here.
     */
    @media (prefers-reduced-motion: reduce) {
      :host([striped]) .fill,
      .indeterminate {
        animation: none;
      }
    }
  `;
Je([
  n4({ type: Number })
], fe.prototype, "value", 2);
Je([
  n4({ type: Number })
], fe.prototype, "max", 2);
Je([
  n4({ type: String, reflect: true })
], fe.prototype, "tone", 2);
Je([
  n4({ type: String, reflect: true })
], fe.prototype, "size", 2);
Je([
  n4({ type: Boolean, reflect: true })
], fe.prototype, "striped", 2);
Je([
  n4({ type: String })
], fe.prototype, "label", 2);
Je([
  n4({ type: Boolean, reflect: true, attribute: "show-label" })
], fe.prototype, "showLabel", 2);
fe = Je([
  t3("ae-progress")
], fe);
var Gs = Object.defineProperty;
var Xs = Object.getOwnPropertyDescriptor;
var bt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Xs(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Gs(t5, a4, i7), i7;
};
var $e = class extends i4 {
  constructor() {
    super(...arguments), this.value = null, this.max = 100, this.tone = "accent", this.size = "md", this.thickness = null, this.label = "Loading";
  }
  get _isIndeterminate() {
    return this.value === null || this.value === void 0 || Number.isNaN(this.value);
  }
  get _clampedValue() {
    const e8 = Math.max(0, Math.min(this.max, Number(this.value)));
    return Number.isFinite(e8) ? e8 : 0;
  }
  get _thickness() {
    if (this.thickness != null && this.thickness > 0) return this.thickness;
    switch (this.size) {
      case "xs":
        return 2;
      case "sm":
        return 2.5;
      case "lg":
        return 4;
      case "xl":
        return 5;
      default:
        return 3;
    }
  }
  updated() {
    this._isIndeterminate ? this.setAttribute("data-indeterminate", "") : this.removeAttribute("data-indeterminate");
  }
  render() {
    const e8 = this._isIndeterminate, t5 = e8 ? void 0 : this._clampedValue, a4 = 16 - this._thickness, r6 = 2 * Math.PI * a4, i7 = e8 ? 0 : this._clampedValue / this.max, s4 = r6 - i7 * r6;
    return b2`
      <svg
        viewBox="0 0 32 32"
        role="progressbar"
        aria-label=${this.label}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${t5 ?? A}
        aria-busy=${e8 ? "true" : "false"}
      >
        <circle
          part="track"
          class="track"
          cx="16"
          cy="16"
          r=${a4}
          stroke-width=${this._thickness}
        ></circle>
        <circle
          part="indicator"
          class="indicator"
          cx="16"
          cy="16"
          r=${a4}
          stroke-width=${this._thickness}
          stroke-dasharray=${e8 ? "80 200" : `${r6} ${r6}`}
          stroke-dashoffset=${e8 ? 0 : s4}
        ></circle>
      </svg>
    `;
  }
};
$e.styles = i`
    :host {
      --ae-progress-circle-size: 2.5rem;
      --ae-progress-circle-track: color-mix(in oklch, currentColor 15%, transparent);
      --ae-progress-circle-fill: var(--ae-color-accent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--ae-progress-circle-size);
      height: var(--ae-progress-circle-size);
      color: var(--ae-color-fg-muted);
    }
    :host([size='xs']) { --ae-progress-circle-size: 1rem; }
    :host([size='sm']) { --ae-progress-circle-size: 1.5rem; }
    :host([size='md']) { --ae-progress-circle-size: 2.5rem; }
    :host([size='lg']) { --ae-progress-circle-size: 3.5rem; }
    :host([size='xl']) { --ae-progress-circle-size: 5rem; }

    :host([tone='neutral']) { --ae-progress-circle-fill: var(--ae-color-gray-600); }
    :host([tone='accent'])  { --ae-progress-circle-fill: var(--ae-color-accent); }
    :host([tone='success']) { --ae-progress-circle-fill: var(--ae-color-success); }
    :host([tone='warning']) { --ae-progress-circle-fill: var(--ae-color-warning); }
    :host([tone='danger'])  { --ae-progress-circle-fill: var(--ae-color-danger); }

    svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      display: block;
    }
    :host([data-indeterminate]) svg {
      animation: ae-pc-rotate 1.4s linear infinite;
    }

    circle {
      fill: none;
      stroke-linecap: round;
      transform-origin: center;
    }
    .track {
      stroke: var(--ae-progress-circle-track);
    }
    .indicator {
      stroke: var(--ae-progress-circle-fill);
      transition: stroke-dashoffset var(--ae-duration-normal) var(--ae-easing-ease-out);
    }
    :host([data-indeterminate]) .indicator {
      animation: ae-pc-dash 1.4s ease-in-out infinite;
    }

    @keyframes ae-pc-rotate {
      to { transform: rotate(360deg); }
    }
    @keyframes ae-pc-dash {
      0%   { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
      50%  { stroke-dasharray: 90, 200; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124; }
    }

    /*
     * Reduced-motion: replace the indeterminate spin with a static partial
     * arc (still reads as "in progress"); aria-busy conveys the state to AT.
     * Hardcoded-duration keyframes bypass the global token reset, so guard here.
     */
    @media (prefers-reduced-motion: reduce) {
      :host([data-indeterminate]) svg { animation: none; }
      :host([data-indeterminate]) .indicator {
        animation: none;
        stroke-dasharray: 25 200;
      }
    }
  `;
bt([
  n4({ type: Number })
], $e.prototype, "value", 2);
bt([
  n4({ type: Number })
], $e.prototype, "max", 2);
bt([
  n4({ type: String, reflect: true })
], $e.prototype, "tone", 2);
bt([
  n4({ type: String, reflect: true })
], $e.prototype, "size", 2);
bt([
  n4({ type: Number })
], $e.prototype, "thickness", 2);
bt([
  n4({ type: String })
], $e.prototype, "label", 2);
$e = bt([
  t3("ae-progress-circle")
], $e);
var Zs = Object.defineProperty;
var Js = Object.getOwnPropertyDescriptor;
var It = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Js(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Zs(t5, a4, i7), i7;
};
var qe = class extends i4 {
  constructor() {
    super(...arguments), this.variant = "rect", this.width = null, this.height = null, this.lines = 1, this.animation = "pulse";
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("aria-hidden") || this.setAttribute("aria-hidden", "true");
  }
  render() {
    const e8 = (t5, a4) => {
      const r6 = [];
      return this.width && (this.variant !== "text" || t5 === a4 - 1 || a4 === 1) && r6.push(`width:${this.width}`), this.height && r6.push(`height:${this.height}`), r6.join(";");
    };
    if (this.variant === "text" && this.lines > 1) {
      const t5 = Math.max(1, Math.floor(this.lines));
      return b2`${Array.from({ length: t5 }).map(
        (a4, r6) => b2`<span part="skeleton" class="shape" style=${e8(r6, t5)}></span>`
      )}`;
    }
    return b2`<span
      part="skeleton"
      class="shape"
      style=${e8(0, 1)}
    ></span>`;
  }
};
qe.styles = i`
    :host {
      display: block;
    }

    /* Defaults live in the var() fallbacks (not declared at :host) so a brand
     * theme can override --ae-skeleton-bg / -border / -radius at :root without
     * being shadowed by a directly-matched :host declaration. Metro flips the
     * soft pulse block into a 2px-ink-framed ticket-tape stub. */
    .shape {
      background: var(--ae-skeleton-bg, var(--ae-color-bg-muted));
      border: var(--ae-skeleton-border, none);
      border-radius: var(--ae-skeleton-radius, var(--ae-radius-sm));
      display: block;
    }

    :host([variant='rect']) .shape {
      width: 100%;
      min-height: 1rem;
    }

    :host([variant='text']) .shape {
      height: 0.75em;
      border-radius: var(--ae-skeleton-radius, var(--ae-radius-xs));
    }
    :host([variant='text']) .shape + .shape {
      margin-top: var(--ae-space-2);
    }
    /* Last text line is shorter for realism */
    :host([variant='text']) .shape:last-child:not(:only-child) {
      width: 60%;
    }

    :host([variant='circle']) .shape {
      border-radius: var(--ae-radius-full);
      aspect-ratio: 1;
      width: 2.5rem;
    }

    :host([animation='pulse']) .shape {
      animation: ae-skeleton-pulse 1.6s var(--ae-easing-ease-in-out) infinite;
    }

    :host([animation='wave']) .shape {
      position: relative;
      overflow: hidden;
    }
    :host([animation='wave']) .shape::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        var(--ae-skeleton-highlight, var(--ae-color-bg-subtle)),
        transparent
      );
      transform: translateX(-100%);
      animation: ae-skeleton-wave 1.6s var(--ae-easing-ease-in-out) infinite;
    }

    @keyframes ae-skeleton-pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.55; }
    }
    @keyframes ae-skeleton-wave {
      to { transform: translateX(100%); }
    }

    /*
     * Reduced-motion: the shimmer/pulse is purely decorative — the static
     * placeholder shape still communicates loading. Hardcoded-duration
     * keyframes bypass the global token reset, so guard here.
     */
    @media (prefers-reduced-motion: reduce) {
      :host([animation='pulse']) .shape,
      :host([animation='wave']) .shape::after {
        animation: none;
      }
    }
  `;
It([
  n4({ type: String, reflect: true })
], qe.prototype, "variant", 2);
It([
  n4({ type: String })
], qe.prototype, "width", 2);
It([
  n4({ type: String })
], qe.prototype, "height", 2);
It([
  n4({ type: Number })
], qe.prototype, "lines", 2);
It([
  n4({ type: String, reflect: true })
], qe.prototype, "animation", 2);
qe = It([
  t3("ae-skeleton")
], qe);
var Qs = Object.defineProperty;
var eo = Object.getOwnPropertyDescriptor;
var Mt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? eo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Qs(t5, a4, i7), i7;
};
var Ve = class extends i4 {
  constructor() {
    super(...arguments), this.compact = false, this.live = false, this._hasIcon = false, this._hasTitle = false, this._hasActions = false, this._onSlotChange = (e8) => {
      const t5 = e8.target, a4 = t5.assignedNodes({ flatten: true }).some((r6) => r6.nodeType === Node.TEXT_NODE ? (r6.textContent ?? "").trim().length > 0 : true);
      switch (t5.name) {
        case "icon":
          this._hasIcon = a4;
          break;
        case "title":
          this._hasTitle = a4;
          break;
        case "actions":
          this._hasActions = a4;
          break;
      }
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._syncLiveRegion();
    const e8 = (t5) => {
      const a4 = this.querySelector(`:scope > [slot="${t5}"]`);
      return a4 ? (a4.textContent ?? "").trim().length > 0 || a4.childElementCount > 0 : false;
    };
    this._hasIcon = e8("icon"), this._hasTitle = e8("title"), this._hasActions = e8("actions");
  }
  updated(e8) {
    e8.has("live") && this._syncLiveRegion();
  }
  /**
   * An empty state is content, not a status message — so by default the host
   * carries no live-region role and is simply read in document order. When
   * `live` is set it becomes a polite live region so a dynamically-revealed
   * empty state ("No results for…") is announced. A consumer-supplied `role`
   * / `aria-live` is respected: we only manage the `status` / `polite` pair
   * we ourselves apply.
   */
  _syncLiveRegion() {
    this.live ? (this.hasAttribute("role") || this.setAttribute("role", "status"), this.hasAttribute("aria-live") || this.setAttribute("aria-live", "polite")) : (this.getAttribute("role") === "status" && this.removeAttribute("role"), this.getAttribute("aria-live") === "polite" && this.removeAttribute("aria-live"));
  }
  render() {
    return b2`
      <div part="container" class="container">
        <span part="icon" class="icon" ?hidden=${!this._hasIcon}>
          <slot name="icon" @slotchange=${this._onSlotChange}></slot>
        </span>
        <span part="title" class="title" ?hidden=${!this._hasTitle}>
          <slot name="title" @slotchange=${this._onSlotChange}></slot>
        </span>
        <div part="body" class="body">
          <slot></slot>
        </div>
        <div part="actions" class="actions" ?hidden=${!this._hasActions}>
          <slot name="actions" @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `;
  }
};
Ve.styles = i`
    :host {
      --ae-empty-state-padding: var(--ae-space-10) var(--ae-space-6);
      --ae-empty-state-gap: var(--ae-space-3);
      --ae-empty-state-color: var(--ae-color-fg-muted);
      display: block;
    }
    :host([compact]) {
      --ae-empty-state-padding: var(--ae-space-6) var(--ae-space-4);
      --ae-empty-state-gap: var(--ae-space-2);
    }

    /* The frame / icon-box / serif-body hooks default to "none" so the base
     * look is unchanged; Metro turns the container into the source EmptyState —
     * a 3px dashed ink frame on paper-2, a 56px ink-framed paper icon box, an
     * 800 title, and a serif-italic ink-3 body. All consumed via var() fallback
     * (never declared at :host) so the :root override lands. */
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: var(--ae-empty-state-gap);
      padding: var(--ae-empty-state-padding);
      color: var(--ae-empty-state-color);
      background: var(--ae-empty-state-bg, transparent);
      border: var(--ae-empty-state-border, none);
      border-radius: var(--ae-empty-state-radius, 0);
      font-family: var(--ae-empty-state-font-family, inherit);
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--ae-empty-state-icon-size, auto);
      height: var(--ae-empty-state-icon-size, auto);
      background: var(--ae-empty-state-icon-bg, transparent);
      border: var(--ae-empty-state-icon-border, none);
      color: var(--ae-empty-state-icon-color, var(--ae-color-fg-subtle));
      font-size: var(--ae-empty-state-icon-font-size, var(--ae-font-size-3xl));
      font-weight: var(--ae-empty-state-icon-weight, inherit);
      line-height: 1;
    }
    :host([compact]) .icon {
      font-size: var(--ae-font-size-2xl);
    }

    .title {
      font-size: var(--ae-font-size-lg);
      font-weight: var(--ae-empty-state-title-weight, var(--ae-font-weight-semibold));
      letter-spacing: var(--ae-empty-state-title-tracking, normal);
      color: var(--ae-color-fg);
      line-height: var(--ae-line-height-snug);
    }
    :host([compact]) .title {
      font-size: var(--ae-font-size-md);
    }

    .body {
      font-size: var(--ae-font-size-sm);
      line-height: var(--ae-line-height-normal);
      max-width: 40ch;
      color: var(--ae-empty-state-body-color, inherit);
      font-family: var(--ae-empty-state-body-font-family, inherit);
      font-style: var(--ae-empty-state-body-style, normal);
    }

    .actions {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: var(--ae-space-2);
      margin-top: var(--ae-space-2);
    }

    [hidden] { display: none; }
  `;
Mt([
  n4({ type: Boolean, reflect: true })
], Ve.prototype, "compact", 2);
Mt([
  n4({ type: Boolean, reflect: true })
], Ve.prototype, "live", 2);
Mt([
  r5()
], Ve.prototype, "_hasIcon", 2);
Mt([
  r5()
], Ve.prototype, "_hasTitle", 2);
Mt([
  r5()
], Ve.prototype, "_hasActions", 2);
Ve = Mt([
  t3("ae-empty-state")
], Ve);
var to = Object.defineProperty;
var ao = Object.getOwnPropertyDescriptor;
var lr = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? ao(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && to(t5, a4, i7), i7;
};
var ca = class extends i4 {
  constructor() {
    super(...arguments), this.multiple = false, this._onToggle = (e8) => {
      const t5 = e8.target;
      if (!this.multiple && e8.detail.open)
        for (const a4 of this.items)
          a4 !== t5 && a4.open && a4.setOpen(false);
      this.dispatchEvent(
        new CustomEvent("ae-change", {
          bubbles: true,
          composed: true,
          detail: { open: this.items.filter((a4) => a4.open).map((a4) => a4.label) }
        })
      );
    }, this._onKeyDown = (e8) => {
      const t5 = e8.key;
      if (t5 !== "ArrowDown" && t5 !== "ArrowUp" && t5 !== "Home" && t5 !== "End")
        return;
      const a4 = this.items, r6 = e8.composedPath(), i7 = a4.find((d3) => r6.includes(d3));
      if (!i7) return;
      const s4 = a4.filter((d3) => !d3.disabled);
      if (s4.length === 0) return;
      const o9 = s4.indexOf(i7);
      if (o9 === -1) return;
      e8.preventDefault();
      let h3;
      switch (t5) {
        case "ArrowDown":
          h3 = s4[(o9 + 1) % s4.length];
          break;
        case "ArrowUp":
          h3 = s4[(o9 - 1 + s4.length) % s4.length];
          break;
        case "Home":
          h3 = s4[0];
          break;
        case "End":
          h3 = s4[s4.length - 1];
          break;
      }
      h3 == null || h3.focus();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("ae-accordion-toggle", this._onToggle), this.addEventListener("keydown", this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("ae-accordion-toggle", this._onToggle), this.removeEventListener("keydown", this._onKeyDown);
  }
  /** The `ae-accordion-item` children in document order. */
  get items() {
    return Array.from(
      this.querySelectorAll("ae-accordion-item")
    );
  }
  render() {
    return b2`<div part="container" class="container"><slot></slot></div>`;
  }
};
ca.styles = i`
    :host {
      display: block;
    }
    .container {
      background: var(--ae-accordion-bg, var(--ae-color-bg));
      backdrop-filter: var(--ae-accordion-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-accordion-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-accordion-border, var(--ae-border-width-1) solid var(--ae-color-border));
      border-radius: var(--ae-accordion-radius, var(--ae-radius-md));
      overflow: hidden;
    }
  `;
lr([
  n4({ type: Boolean, reflect: true })
], ca.prototype, "multiple", 2);
ca = lr([
  t3("ae-accordion")
], ca);
var ro = Object.defineProperty;
var io = Object.getOwnPropertyDescriptor;
var Bt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? io(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ro(t5, a4, i7), i7;
};
var so = 0;
var He = class extends i4 {
  constructor() {
    super(...arguments), this.label = "", this.meta = "", this.open = false, this.disabled = false, this.headingLevel = 3, this._uid = `ae-accordion-${++so}`, this._onClick = () => {
      this.disabled || (this.open = !this.open, this.dispatchEvent(
        new CustomEvent("ae-accordion-toggle", {
          bubbles: true,
          composed: true,
          detail: { open: this.open }
        })
      ));
    };
  }
  get _buttonId() {
    return `${this._uid}-btn`;
  }
  get _panelId() {
    return `${this._uid}-panel`;
  }
  /** Toggle from the parent without re-dispatching the user event. */
  setOpen(e8) {
    this.open = e8;
  }
  /** Focus the disclosure button (used by the parent for arrow-key nav). */
  focus(e8) {
    var t5, a4;
    (a4 = (t5 = this.shadowRoot) == null ? void 0 : t5.querySelector(".trigger")) == null || a4.focus(e8);
  }
  render() {
    return b2`
      <div part="header" class="heading" role="heading" aria-level=${this.headingLevel}>
        <button
          part="trigger"
          class="trigger"
          id=${this._buttonId}
          type="button"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls=${this._panelId}
          aria-disabled=${this.disabled ? "true" : A}
          @click=${this._onClick}
        >
          <span class="lead">
            <slot name="icon">
              <svg part="icon" class="icon" viewBox="0 0 12 12" aria-hidden="true">
                <line x1="1" y1="6" x2="11" y2="6" />
                <line class="v" x1="6" y1="1" x2="6" y2="11" />
              </svg>
            </slot>
            <slot name="header">${this.label}</slot>
          </span>
          ${this.meta ? b2`<span class="meta">${this.meta}</span>` : A}
        </button>
      </div>
      <div
        part="panel"
        class="panel"
        id=${this._panelId}
        role="region"
        aria-labelledby=${this._buttonId}
        ?hidden=${!this.open}
      >
        <div part="body" class="body"><slot></slot></div>
      </div>
    `;
  }
};
He.styles = i`
    :host {
      display: block;
      border-bottom: var(--ae-accordion-divider, var(--ae-border-width-1) solid var(--ae-color-border-subtle));
    }
    :host(:last-of-type) {
      border-bottom: var(--ae-accordion-divider-last, none);
    }

    .heading {
      margin: 0;
      font: inherit;
    }

    .trigger {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ae-space-3);
      padding: var(--ae-accordion-header-padding, var(--ae-space-3) var(--ae-space-4));
      background: var(--ae-accordion-header-bg, transparent);
      color: var(--ae-accordion-header-fg, var(--ae-color-fg));
      font-family: var(--ae-accordion-header-font-family, inherit);
      font-size: var(--ae-accordion-header-font-size, var(--ae-font-size-sm));
      font-weight: var(--ae-accordion-header-font-weight, var(--ae-font-weight-medium));
      letter-spacing: var(--ae-accordion-header-tracking, normal);
      text-transform: var(--ae-accordion-header-transform, none);
      line-height: var(--ae-line-height-snug);
      text-align: start;
      cursor: pointer;
      transition: background var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    :host([open]) .trigger {
      background: var(--ae-accordion-header-bg-open, var(--ae-color-bg-subtle));
    }
    .trigger:hover:not([aria-disabled='true']) {
      background: var(--ae-accordion-header-bg-hover, var(--ae-color-bg-subtle));
    }
    :host([open]) .trigger:hover:not([aria-disabled='true']) {
      background: var(--ae-accordion-header-bg-open, var(--ae-color-bg-subtle));
    }
    .trigger[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }
    .trigger:focus-visible {
      ${y3}
    }

    .lead {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-3);
      min-width: 0;
    }

    .icon {
      flex: 0 0 auto;
      width: 0.75rem;
      height: 0.75rem;
      color: var(--ae-accordion-icon-color, var(--ae-color-fg-muted));
    }
    .icon line {
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: square;
      transition: opacity var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    /* The vertical bar disappears when open: a plus that becomes a minus. */
    :host([open]) .icon .v {
      opacity: 0;
    }

    .meta {
      flex: 0 0 auto;
      font-size: var(--ae-font-size-xs);
      color: var(--ae-accordion-meta-color, var(--ae-color-fg-subtle));
    }

    .panel {
      overflow: hidden;
    }
    .panel[hidden] {
      display: none;
    }
    .body {
      padding: var(--ae-accordion-body-padding, var(--ae-space-3) var(--ae-space-4));
      font-family: var(--ae-accordion-body-font-family, inherit);
      font-style: var(--ae-accordion-body-font-style, normal);
      font-size: var(--ae-accordion-body-font-size, var(--ae-font-size-sm));
      line-height: var(--ae-line-height-normal);
      color: var(--ae-accordion-body-color, var(--ae-color-fg-muted));
    }
  `;
Bt([
  n4({ type: String, reflect: true })
], He.prototype, "label", 2);
Bt([
  n4({ type: String, reflect: true })
], He.prototype, "meta", 2);
Bt([
  n4({ type: Boolean, reflect: true })
], He.prototype, "open", 2);
Bt([
  n4({ type: Boolean, reflect: true })
], He.prototype, "disabled", 2);
Bt([
  n4({ type: Number, attribute: "heading-level" })
], He.prototype, "headingLevel", 2);
He = Bt([
  t3("ae-accordion-item")
], He);
var oo = Object.defineProperty;
var no = Object.getOwnPropertyDescriptor;
var cr = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? no(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && oo(t5, a4, i7), i7;
};
var da = class extends i4 {
  constructor() {
    super(...arguments), this.label = "";
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "list");
  }
  updated(e8) {
    e8.has("label") && (this.label ? this.setAttribute("aria-label", this.label) : this.removeAttribute("aria-label"));
  }
  render() {
    return b2`<div part="track" class="track"><slot></slot></div>`;
  }
};
da.styles = i`
    :host {
      display: block;
    }
    .track {
      position: relative;
      padding-left: var(--ae-timeline-gutter, 1.75rem);
      font-family: var(--ae-timeline-font-family, inherit);
    }
    /* The continuous rail. Markers (in each item's shadow) overlay it; both
     * resolve --ae-timeline-rail-left / -rail-width / -gutter from the same
     * setter so they line up. */
    .track::before {
      content: '';
      position: absolute;
      left: var(--ae-timeline-rail-left, 0.5rem);
      top: var(--ae-timeline-rail-top, 0.4rem);
      bottom: var(--ae-timeline-rail-bottom, 0.4rem);
      width: var(--ae-timeline-rail-width, 2px);
      background: var(--ae-timeline-rail-color, var(--ae-color-border-strong));
    }
  `;
cr([
  n4({ type: String, reflect: true })
], da.prototype, "label", 2);
da = cr([
  t3("ae-timeline")
], da);
var lo = Object.defineProperty;
var co = Object.getOwnPropertyDescriptor;
var ea = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? co(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && lo(t5, a4, i7), i7;
};
var ot = class extends i4 {
  constructor() {
    super(...arguments), this.when = "", this.label = "", this.tone = "neutral", this.shape = "dot";
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "listitem");
  }
  render() {
    return b2`
      <span part="marker" class="marker" aria-hidden="true"></span>
      ${this.when ? b2`<div part="when" class="when">${this.when}</div>` : A}
      <div part="title" class="title"><slot name="title">${this.label}</slot></div>
      <div part="body" class="body"><slot></slot></div>
    `;
  }
};
ot.styles = i`
    :host {
      display: block;
      position: relative;
      padding-bottom: var(--ae-timeline-item-gap, var(--ae-space-4));
    }

    /* The marker is centered on the timeline rail. It references the SAME
     * gutter / rail-left / rail-width / marker-size tokens the container uses;
     * because the item is a light-DOM descendant of <ae-timeline> and the
     * container's rail is in <ae-timeline>'s shadow, both resolve the tokens
     * from the same setter (:root under Metro, or the element), staying in
     * sync without hard-coding offsets. */
    .marker {
      position: absolute;
      top: var(--ae-timeline-marker-top, 0.3rem);
      left: calc(
        var(--ae-timeline-rail-left, 0.5rem) + (var(--ae-timeline-rail-width, 2px) / 2) -
          var(--ae-timeline-gutter, 1.75rem) - (var(--ae-timeline-marker-size, 0.875rem) / 2)
      );
      width: var(--ae-timeline-marker-size, 0.875rem);
      height: var(--ae-timeline-marker-size, 0.875rem);
      box-sizing: border-box;
      background: var(--ae-timeline-marker-bg, var(--ae-color-border-strong));
      border: var(--ae-timeline-marker-border, var(--ae-border-width-2, 2px) solid var(--ae-color-bg));
      border-radius: var(--ae-timeline-marker-radius, 50%);
    }
    :host([shape='diamond']) .marker {
      border-radius: 0;
      transform: rotate(45deg);
    }

    /* Per-tone marker fill, routed through indirection so a brand can recolor
     * each tone at :root without out-specifying these :host([tone]) rules. */
    :host([tone='neutral']) {
      --ae-timeline-marker-bg: var(--ae-timeline-neutral-bg, var(--ae-color-border-strong));
    }
    :host([tone='accent']) {
      --ae-timeline-marker-bg: var(--ae-timeline-accent-bg, var(--ae-color-accent));
    }
    :host([tone='success']) {
      --ae-timeline-marker-bg: var(--ae-timeline-success-bg, var(--ae-color-success));
    }
    :host([tone='warning']) {
      --ae-timeline-marker-bg: var(--ae-timeline-warning-bg, var(--ae-color-warning));
    }
    :host([tone='danger']) {
      --ae-timeline-marker-bg: var(--ae-timeline-danger-bg, var(--ae-color-danger));
    }

    .when {
      font-family: var(--ae-timeline-when-font-family, inherit);
      font-size: var(--ae-timeline-when-font-size, var(--ae-font-size-xs));
      font-weight: var(--ae-timeline-when-font-weight, var(--ae-font-weight-semibold));
      letter-spacing: var(--ae-timeline-when-tracking, var(--ae-letter-spacing-wide));
      text-transform: var(--ae-timeline-when-transform, uppercase);
      color: var(--ae-timeline-when-color, var(--ae-color-fg-subtle));
      line-height: 1.2;
    }
    .when:empty {
      display: none;
    }

    .title {
      font-size: var(--ae-timeline-title-font-size, var(--ae-font-size-sm));
      font-weight: var(--ae-timeline-title-font-weight, var(--ae-font-weight-semibold));
      color: var(--ae-timeline-title-color, var(--ae-color-fg));
      line-height: var(--ae-line-height-snug);
      margin-top: 2px;
    }

    .body {
      font-family: var(--ae-timeline-body-font-family, inherit);
      font-style: var(--ae-timeline-body-font-style, normal);
      font-size: var(--ae-timeline-body-font-size, var(--ae-font-size-sm));
      color: var(--ae-timeline-body-color, var(--ae-color-fg-muted));
      line-height: var(--ae-line-height-normal);
      margin-top: var(--ae-space-1);
    }
  `;
ea([
  n4({ type: String, reflect: true })
], ot.prototype, "when", 2);
ea([
  n4({ type: String, reflect: true })
], ot.prototype, "label", 2);
ea([
  n4({ type: String, reflect: true })
], ot.prototype, "tone", 2);
ea([
  n4({ type: String, reflect: true })
], ot.prototype, "shape", 2);
ot = ea([
  t3("ae-timeline-item")
], ot);
var ho = Object.defineProperty;
var po = Object.getOwnPropertyDescriptor;
var ta = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? po(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && ho(t5, a4, i7), i7;
};
var Ue = class extends i4 {
  constructor() {
    super(), this.value = "", this.name = "", this.label = "", this.disabled = false, this._onSlotChange = () => {
      this._syncItems();
    }, this._onSelect = (e8) => {
      this.disabled || this._commit(e8.detail.value, true);
    }, this._onKeyDown = (e8) => {
      const t5 = e8.key;
      if (t5 !== "ArrowRight" && t5 !== "ArrowDown" && t5 !== "ArrowLeft" && t5 !== "ArrowUp" && t5 !== "Home" && t5 !== "End" || this.disabled) return;
      const a4 = this.items.filter((s4) => !s4.disabled);
      if (a4.length === 0) return;
      const r6 = Math.max(
        0,
        a4.findIndex((s4) => s4.value === this.value)
      );
      e8.preventDefault();
      let i7;
      switch (t5) {
        case "ArrowRight":
        case "ArrowDown":
          i7 = a4[(r6 + 1) % a4.length];
          break;
        case "ArrowLeft":
        case "ArrowUp":
          i7 = a4[(r6 - 1 + a4.length) % a4.length];
          break;
        case "Home":
          i7 = a4[0];
          break;
        case "End":
          i7 = a4[a4.length - 1];
          break;
      }
      i7 && this._commit(i7.value, true);
    }, this._internals = this.attachInternals();
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "radiogroup"), this.addEventListener("ae-segmented-select", this._onSelect), this.addEventListener("keydown", this._onKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("ae-segmented-select", this._onSelect), this.removeEventListener("keydown", this._onKeyDown);
  }
  updated(e8) {
    e8.has("label") && (this.label ? this.setAttribute("aria-label", this.label) : this.removeAttribute("aria-label")), (e8.has("value") || e8.has("disabled")) && (this._syncItems(), this._syncFormValue());
  }
  /** The `ae-segmented-item` children in document order. */
  get items() {
    return Array.from(
      this.querySelectorAll("ae-segmented-item")
    );
  }
  /** Push the current selection + roving tabindex down to the items. */
  _syncItems() {
    const e8 = this.items;
    if (e8.length === 0) return;
    const t5 = e8.some((r6) => r6.value === this.value && !r6.disabled), a4 = e8.find((r6) => !r6.disabled);
    for (const r6 of e8) {
      const i7 = t5 && r6.value === this.value && !r6.disabled;
      r6.selected = i7;
      const s4 = t5 ? i7 : r6 === a4;
      r6.tabIndex = r6.disabled ? -1 : s4 ? 0 : -1;
    }
  }
  _syncFormValue() {
    var e8;
    typeof ((e8 = this._internals) == null ? void 0 : e8.setFormValue) == "function" && this._internals.setFormValue(this.value || null);
  }
  _commit(e8, t5) {
    var a4;
    e8 !== this.value && (this.value = e8, this._syncItems(), this._syncFormValue(), t5 && ((a4 = this.items.find((r6) => r6.value === e8)) == null || a4.focus()), this.dispatchEvent(
      new CustomEvent("ae-change", {
        bubbles: true,
        composed: true,
        detail: { value: e8 }
      })
    ));
  }
  /** Form-associated reset support. */
  formResetCallback() {
    this.value = "", this._syncItems(), this._syncFormValue();
  }
  render() {
    return b2`<div part="track" class="track">
      <slot @slotchange=${this._onSlotChange}></slot>
    </div>`;
  }
};
Ue.formAssociated = true;
Ue.styles = i`
    :host {
      display: inline-flex;
      font-family: var(--ae-segmented-font-family, var(--ae-font-family-sans));
    }
    .track {
      display: inline-flex;
      align-items: stretch;
      background: var(--ae-segmented-bg, var(--ae-color-bg));
      backdrop-filter: var(--ae-segmented-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-segmented-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-segmented-border, var(--ae-border-width-1) solid var(--ae-color-border));
      border-radius: var(--ae-segmented-radius, var(--ae-radius-md));
      padding: var(--ae-segmented-padding, 0);
      overflow: hidden;
    }
    :host([disabled]) .track {
      opacity: var(--ae-opacity-disabled, 0.55);
      pointer-events: none;
    }
  `;
ta([
  n4({ type: String, reflect: true })
], Ue.prototype, "value", 2);
ta([
  n4({ type: String, reflect: true })
], Ue.prototype, "name", 2);
ta([
  n4({ type: String, reflect: true })
], Ue.prototype, "label", 2);
ta([
  n4({ type: Boolean, reflect: true })
], Ue.prototype, "disabled", 2);
Ue = ta([
  t3("ae-segmented")
], Ue);
var uo = Object.defineProperty;
var fo = Object.getOwnPropertyDescriptor;
var aa = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? fo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && uo(t5, a4, i7), i7;
};
var nt = class extends i4 {
  constructor() {
    super(...arguments), this.value = "", this.label = "", this.selected = false, this.disabled = false, this._onActivate = () => {
      this._requestSelect();
    }, this._onKeyDown = (e8) => {
      (e8.key === " " || e8.key === "Enter") && (e8.preventDefault(), this._requestSelect());
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "radio"), this.addEventListener("click", this._onActivate), this.addEventListener("keydown", this._onKeyDown), this._syncAria();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("click", this._onActivate), this.removeEventListener("keydown", this._onKeyDown);
  }
  updated() {
    this._syncAria();
  }
  _syncAria() {
    this.setAttribute("aria-checked", this.selected ? "true" : "false"), this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled");
  }
  _requestSelect() {
    this.disabled || this.selected || this.dispatchEvent(
      new CustomEvent("ae-segmented-select", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, item: this }
      })
    );
  }
  render() {
    return b2`<span part="cell" class="cell"><slot>${this.label}</slot></span>`;
  }
};
nt.styles = i`
    :host {
      display: inline-flex;
      flex: var(--ae-segmented-item-flex, 0 0 auto);
      border-inline-end: var(--ae-segmented-item-divider, none);
      outline: none;
    }
    :host(:last-of-type) {
      border-inline-end: none;
    }
    :host([disabled]) {
      cursor: not-allowed;
    }

    .cell {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: var(--ae-segmented-item-padding, var(--ae-space-2) var(--ae-space-4));
      font-family: var(--ae-segmented-item-font-family, inherit);
      font-size: var(--ae-segmented-item-font-size, var(--ae-font-size-sm));
      font-weight: var(--ae-segmented-item-font-weight, var(--ae-font-weight-medium));
      letter-spacing: var(--ae-segmented-item-tracking, normal);
      text-transform: var(--ae-segmented-item-transform, none);
      line-height: 1;
      white-space: nowrap;
      user-select: none;
      cursor: pointer;
      color: var(--ae-segmented-item-fg, var(--ae-color-fg));
      background: var(--ae-segmented-item-bg, transparent);
      border-radius: var(--ae-segmented-item-radius, var(--ae-radius-sm));
      transition:
        background var(--ae-duration-fast) var(--ae-easing-ease-out),
        color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .cell:hover {
      background: var(--ae-segmented-item-bg-hover, var(--ae-color-bg-subtle));
    }
    :host([selected]) .cell,
    :host([selected]) .cell:hover {
      background: var(--ae-segmented-item-bg-selected, var(--ae-color-accent));
      color: var(--ae-segmented-item-fg-selected, var(--ae-color-fg-on-accent));
    }
    :host([disabled]) .cell {
      cursor: not-allowed;
      opacity: var(--ae-opacity-disabled, 0.55);
    }
    :host(:focus-visible) .cell {
      ${y3}
    }
  `;
aa([
  n4({ type: String, reflect: true })
], nt.prototype, "value", 2);
aa([
  n4({ type: String, reflect: true })
], nt.prototype, "label", 2);
aa([
  n4({ type: Boolean, reflect: true })
], nt.prototype, "selected", 2);
aa([
  n4({ type: Boolean, reflect: true })
], nt.prototype, "disabled", 2);
nt = aa([
  t3("ae-segmented-item")
], nt);
var vo = Object.defineProperty;
var bo = Object.getOwnPropertyDescriptor;
var ra = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? bo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && vo(t5, a4, i7), i7;
};
var lt = class extends i4 {
  constructor() {
    super(...arguments), this.tone = "info", this.variant = "soft", this.dismissible = false, this.title = "", this._hasTitleSlot = false, this._hasActionsSlot = false, this._hasIconSlot = false, this._onTitleSlot = (e8) => {
      this._hasTitleSlot = e8.target.assignedNodes({ flatten: true }).length > 0, this.requestUpdate();
    }, this._onActionsSlot = (e8) => {
      this._hasActionsSlot = e8.target.assignedNodes({ flatten: true }).length > 0, this.requestUpdate();
    }, this._onIconSlot = (e8) => {
      this._hasIconSlot = e8.target.assignedNodes({ flatten: true }).length > 0, this.requestUpdate();
    }, this._onDismiss = () => {
      this.dispatchEvent(
        new CustomEvent("ae-dismiss", { bubbles: true, composed: true })
      ), this.remove();
    };
  }
  connectedCallback() {
    if (super.connectedCallback(), !this.hasAttribute("role")) {
      const e8 = this.tone === "danger" || this.tone === "warning" ? "alert" : "status";
      this.setAttribute("role", e8);
    }
    this._hasTitleSlot = this.querySelector(':scope > [slot="title"]') !== null, this._hasActionsSlot = this.querySelector(':scope > [slot="actions"]') !== null, this._hasIconSlot = this.querySelector(':scope > [slot="icon"]') !== null;
  }
  updated(e8) {
    if (e8.has("tone") && !this.hasAttribute("data-role-locked")) {
      const t5 = this.tone === "danger" || this.tone === "warning" ? "alert" : "status";
      this.setAttribute("role", t5);
    }
  }
  render() {
    const e8 = !this._hasTitleSlot && this.title;
    return b2`
      <div part="alert" class="alert">
        <span part="icon" class="icon-slot">
          <slot name="icon" @slotchange=${this._onIconSlot}>
            ${this._hasIconSlot ? A : this._defaultIcon()}
          </slot>
        </span>
        <div class="body-col">
          <div part="title" class="title" ?hidden=${!e8 && !this._hasTitleSlot}>
            <slot name="title" @slotchange=${this._onTitleSlot}>
              ${e8 ? this.title : A}
            </slot>
          </div>
          <div part="body" class="body">
            <slot></slot>
          </div>
          <div part="actions" class="actions" ?hidden=${!this._hasActionsSlot}>
            <slot name="actions" @slotchange=${this._onActionsSlot}></slot>
          </div>
        </div>
        ${this.dismissible ? b2`<button
              part="dismiss"
              class="dismiss"
              aria-label="Dismiss"
              @click=${this._onDismiss}
            >
              <svg viewBox="0 0 14 14" aria-hidden="true" width="12" height="12">
                <path
                  d="M3 3 L11 11 M11 3 L3 11"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>` : A}
      </div>
    `;
  }
  _defaultIcon() {
    switch (this.tone) {
      case "success":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M4 10.5 L8 14.5 L16 6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`;
      case "warning":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 2 L18 17 L2 17 Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linejoin="round"
          />
          <path d="M10 8 V12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
          <circle cx="10" cy="14.5" r="0.9" fill="currentColor" />
        </svg>`;
      case "danger":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.75" />
          <path d="M10 6 V11" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
          <circle cx="10" cy="14" r="0.9" fill="currentColor" />
        </svg>`;
      case "neutral":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.75" />
        </svg>`;
      case "info":
      default:
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.75" />
          <circle cx="10" cy="6.5" r="0.9" fill="currentColor" />
          <path d="M10 9.5 V14.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>`;
    }
  }
};
lt.styles = i`
    :host {
      --ae-alert-bg: var(--ae-color-info-subtle);
      --ae-alert-fg: var(--ae-color-fg);
      --ae-alert-border: transparent;
      --ae-alert-accent: var(--ae-color-info);
      --ae-alert-radius: var(--ae-radius-md);
      --ae-alert-padding: var(--ae-space-3) var(--ae-space-4);

      display: block;
    }

    .alert {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;
      row-gap: var(--ae-alert-row-gap, var(--ae-space-1));
      column-gap: var(--ae-alert-col-gap, var(--ae-space-3));
      background: var(--ae-alert-bg);
      backdrop-filter: var(--ae-alert-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-alert-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-alert-fg);
      border: var(--ae-alert-border-width, var(--ae-border-width-1)) solid var(--ae-alert-border);
      border-radius: var(--ae-alert-radius);
      padding: var(--ae-alert-padding);
      font-family: var(--ae-alert-font-family, inherit);
      font-size: var(--ae-alert-font-size, var(--ae-font-size-sm));
      line-height: var(--ae-line-height-snug);
    }

    .icon-slot {
      grid-row: 1 / span 2;
      display: inline-flex;
      align-items: var(--ae-alert-icon-align, flex-start);
      justify-content: center;
      align-self: stretch;
      width: var(--ae-alert-icon-width, auto);
      min-width: var(--ae-alert-icon-width, auto);
      background: var(--ae-alert-icon-bg, transparent);
      color: var(--ae-alert-icon-color, var(--ae-alert-accent));
      border-inline-end: var(--ae-alert-icon-divider, none);
      padding-top: var(--ae-alert-icon-pad-top, 2px);
    }

    .icon-slot svg {
      width: var(--ae-alert-icon-size, 1.125rem);
      height: var(--ae-alert-icon-size, 1.125rem);
      display: block;
    }

    .body-col {
      grid-column: 2;
      display: flex;
      flex-direction: column;
      justify-content: var(--ae-alert-body-justify, flex-start);
      gap: var(--ae-space-1);
      min-width: 0;
      padding: var(--ae-alert-body-padding, 0);
    }

    .title {
      font-weight: var(--ae-alert-title-weight, var(--ae-font-weight-semibold));
      font-size: var(--ae-alert-title-size, var(--ae-font-size-sm));
      line-height: var(--ae-line-height-tight);
      letter-spacing: var(--ae-alert-title-tracking, normal);
      text-transform: var(--ae-alert-title-transform, none);
      color: var(--ae-alert-title-color, var(--ae-alert-fg));
    }

    .body {
      font-weight: var(--ae-alert-body-weight, inherit);
    }

    .actions {
      margin-top: var(--ae-space-2);
      display: flex;
      gap: var(--ae-space-2);
    }

    .dismiss {
      all: unset;
      grid-column: 3;
      grid-row: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      margin: var(--ae-alert-dismiss-margin, 0);
      border-radius: var(--ae-radius-sm);
      color: var(--ae-alert-fg);
      opacity: 0.7;
      transition: background var(--ae-duration-fast), opacity var(--ae-duration-fast);
    }
    .dismiss:hover {
      opacity: 1;
      background: var(--ae-color-hover-overlay);
    }
    .dismiss:focus-visible {
      ${y3}
    }

    /* Signal-box fill (Metro ticket Banner). The icon wrapper's background
     * defaults to transparent — just a tinted glyph — but routes through the
     * SAME per-tone accent indirection token the matrix uses, with a
     * transparent fallback. A brand that sets --ae-alert-<tone>-accent at :root
     * (Metro → ink / go / gold / stop) thereby fills the 56px box with the tone
     * color; absent that token the box stays transparent. This must live inside
     * the shadow tree (where the tone attr is visible) — a :root rule can't read
     * the shadow-internal --ae-alert-accent, it would compute to empty. */
    :host([tone='info'])    { --ae-alert-icon-bg: var(--ae-alert-info-accent, transparent); }
    :host([tone='success']) { --ae-alert-icon-bg: var(--ae-alert-success-accent, transparent); }
    :host([tone='warning']) { --ae-alert-icon-bg: var(--ae-alert-warning-accent, transparent); }
    :host([tone='danger'])  { --ae-alert-icon-bg: var(--ae-alert-danger-accent, transparent); }
    :host([tone='neutral']) { --ae-alert-icon-bg: var(--ae-alert-neutral-accent, transparent); }

    /* Tone × variant matrix.
     * Each visual property routes through a per-tone indirection token
     * (--ae-alert-<tone>-<bg|fg|border|accent>) whose fallback preserves the
     * original theme-default value. A brand theme that sets the indirection
     * token at :root overrides the matrix without having to out-specify these
     * :host([tone][variant]) declarations — the cascade-shadowing trap that
     * a plain :root override would hit. (See Metro's ticket-Banner block.) */
    :host([tone='info'][variant='soft']) {
      --ae-alert-bg: var(--ae-alert-info-bg, var(--ae-color-info-subtle));
      --ae-alert-fg: var(--ae-alert-info-fg, var(--ae-color-info-emphasis));
      --ae-alert-accent: var(--ae-alert-info-accent, var(--ae-color-info));
      --ae-alert-border: var(--ae-alert-info-border, transparent);
    }
    :host([tone='success'][variant='soft']) {
      --ae-alert-bg: var(--ae-alert-success-bg, var(--ae-color-success-subtle));
      --ae-alert-fg: var(--ae-alert-success-fg, var(--ae-color-success-emphasis));
      --ae-alert-accent: var(--ae-alert-success-accent, var(--ae-color-success));
      --ae-alert-border: var(--ae-alert-success-border, transparent);
    }
    :host([tone='warning'][variant='soft']) {
      --ae-alert-bg: var(--ae-alert-warning-bg, var(--ae-color-warning-subtle));
      --ae-alert-fg: var(--ae-alert-warning-fg, var(--ae-color-warning-emphasis));
      --ae-alert-accent: var(--ae-alert-warning-accent, var(--ae-color-warning));
      --ae-alert-border: var(--ae-alert-warning-border, transparent);
    }
    :host([tone='danger'][variant='soft']) {
      --ae-alert-bg: var(--ae-alert-danger-bg, var(--ae-color-danger-subtle));
      --ae-alert-fg: var(--ae-alert-danger-fg, var(--ae-color-danger-emphasis));
      --ae-alert-accent: var(--ae-alert-danger-accent, var(--ae-color-danger));
      --ae-alert-border: var(--ae-alert-danger-border, transparent);
    }
    :host([tone='neutral'][variant='soft']) {
      --ae-alert-bg: var(--ae-alert-neutral-bg, var(--ae-color-bg-muted));
      --ae-alert-fg: var(--ae-alert-neutral-fg, var(--ae-color-fg));
      --ae-alert-accent: var(--ae-alert-neutral-accent, var(--ae-color-fg-muted));
      --ae-alert-border: var(--ae-alert-neutral-border, transparent);
    }

    :host([variant='solid']) {
      --ae-alert-fg: var(--ae-color-fg-on-accent);
    }
    :host([tone='info'][variant='solid'])    { --ae-alert-bg: var(--ae-alert-info-bg, var(--ae-color-info));       --ae-alert-fg: var(--ae-alert-info-fg, var(--ae-color-fg-on-info));       --ae-alert-accent: var(--ae-alert-info-accent, var(--ae-color-fg-on-info));       --ae-alert-border: var(--ae-alert-info-border, transparent); }
    :host([tone='success'][variant='solid']) { --ae-alert-bg: var(--ae-alert-success-bg, var(--ae-color-success)); --ae-alert-fg: var(--ae-alert-success-fg, var(--ae-color-fg-on-success)); --ae-alert-accent: var(--ae-alert-success-accent, var(--ae-color-fg-on-success)); --ae-alert-border: var(--ae-alert-success-border, transparent); }
    :host([tone='warning'][variant='solid']) { --ae-alert-bg: var(--ae-alert-warning-bg, var(--ae-color-warning)); --ae-alert-fg: var(--ae-alert-warning-fg, var(--ae-color-fg-on-warning)); --ae-alert-accent: var(--ae-alert-warning-accent, var(--ae-color-fg-on-warning)); --ae-alert-border: var(--ae-alert-warning-border, transparent); }
    :host([tone='danger'][variant='solid'])  { --ae-alert-bg: var(--ae-alert-danger-bg, var(--ae-color-danger));   --ae-alert-fg: var(--ae-alert-danger-fg, var(--ae-color-fg-on-danger));   --ae-alert-accent: var(--ae-alert-danger-accent, var(--ae-color-fg-on-danger));   --ae-alert-border: var(--ae-alert-danger-border, transparent); }
    :host([tone='neutral'][variant='solid']) { --ae-alert-bg: var(--ae-alert-neutral-bg, var(--ae-color-gray-800)); --ae-alert-fg: var(--ae-alert-neutral-fg, var(--ae-color-gray-0)); --ae-alert-accent: var(--ae-alert-neutral-accent, var(--ae-color-gray-0)); --ae-alert-border: var(--ae-alert-neutral-border, transparent); }

    :host([variant='outline']) {
      --ae-alert-bg: transparent;
    }
    :host([tone='info'][variant='outline'])    { --ae-alert-bg: var(--ae-alert-info-bg, transparent);    --ae-alert-border: var(--ae-alert-info-border, var(--ae-color-info));       --ae-alert-fg: var(--ae-alert-info-fg, var(--ae-color-info-emphasis));       --ae-alert-accent: var(--ae-alert-info-accent, var(--ae-color-info)); }
    :host([tone='success'][variant='outline']) { --ae-alert-bg: var(--ae-alert-success-bg, transparent); --ae-alert-border: var(--ae-alert-success-border, var(--ae-color-success)); --ae-alert-fg: var(--ae-alert-success-fg, var(--ae-color-success-emphasis)); --ae-alert-accent: var(--ae-alert-success-accent, var(--ae-color-success)); }
    :host([tone='warning'][variant='outline']) { --ae-alert-bg: var(--ae-alert-warning-bg, transparent); --ae-alert-border: var(--ae-alert-warning-border, var(--ae-color-warning)); --ae-alert-fg: var(--ae-alert-warning-fg, var(--ae-color-warning-emphasis)); --ae-alert-accent: var(--ae-alert-warning-accent, var(--ae-color-warning)); }
    :host([tone='danger'][variant='outline'])  { --ae-alert-bg: var(--ae-alert-danger-bg, transparent);  --ae-alert-border: var(--ae-alert-danger-border, var(--ae-color-danger));   --ae-alert-fg: var(--ae-alert-danger-fg, var(--ae-color-danger-emphasis));   --ae-alert-accent: var(--ae-alert-danger-accent, var(--ae-color-danger)); }
    :host([tone='neutral'][variant='outline']) { --ae-alert-bg: var(--ae-alert-neutral-bg, transparent); --ae-alert-border: var(--ae-alert-neutral-border, var(--ae-color-border-strong)); --ae-alert-fg: var(--ae-alert-neutral-fg, var(--ae-color-fg)); --ae-alert-accent: var(--ae-alert-neutral-accent, var(--ae-color-fg-muted)); }
  `;
ra([
  n4({ type: String, reflect: true })
], lt.prototype, "tone", 2);
ra([
  n4({ type: String, reflect: true })
], lt.prototype, "variant", 2);
ra([
  n4({ type: Boolean, reflect: true })
], lt.prototype, "dismissible", 2);
ra([
  n4({ type: String })
], lt.prototype, "title", 2);
lt = ra([
  t3("ae-alert")
], lt);
var go = Object.defineProperty;
var mo = Object.getOwnPropertyDescriptor;
var wa = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? mo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && go(t5, a4, i7), i7;
};
var St = class extends i4 {
  constructor() {
    super(...arguments), this.tone = "info", this.dismissible = false, this.sticky = false, this._hasIcon = false, this._hasActions = false, this._onIconSlot = (e8) => {
      this._hasIcon = e8.target.assignedNodes({ flatten: true }).length > 0, this.requestUpdate();
    }, this._onActionsSlot = (e8) => {
      this._hasActions = e8.target.assignedNodes({ flatten: true }).length > 0, this.requestUpdate();
    }, this._onDismiss = () => {
      this.dispatchEvent(
        new CustomEvent("ae-dismiss", { bubbles: true, composed: true })
      ), this.remove();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "region"), this.hasAttribute("aria-label") || this.setAttribute("aria-label", this._defaultLabelForTone()), this._hasIcon = this.querySelector(':scope > [slot="icon"]') !== null, this._hasActions = this.querySelector(':scope > [slot="actions"]') !== null;
  }
  updated(e8) {
    if (e8.has("tone")) {
      const t5 = this.getAttribute("aria-label");
      t5 && (/* @__PURE__ */ new Set([
        "Information",
        "Success",
        "Warning",
        "Danger",
        "Announcement",
        "Notice"
      ])).has(t5) && this.setAttribute("aria-label", this._defaultLabelForTone());
    }
  }
  _defaultLabelForTone() {
    switch (this.tone) {
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "danger":
        return "Danger";
      case "accent":
        return "Announcement";
      case "neutral":
        return "Notice";
      case "info":
      default:
        return "Information";
    }
  }
  render() {
    return b2`
      <div part="banner" class="banner">
        <span part="icon" class="icon" ?hidden=${!this._hasIcon}>
          <slot name="icon" @slotchange=${this._onIconSlot}></slot>
        </span>
        <span part="body" class="body">
          <slot></slot>
        </span>
        <span part="actions" class="actions" ?hidden=${!this._hasActions}>
          <slot name="actions" @slotchange=${this._onActionsSlot}></slot>
        </span>
        ${this.dismissible ? b2`<button
              part="dismiss"
              class="dismiss"
              aria-label="Dismiss"
              @click=${this._onDismiss}
            >
              <svg viewBox="0 0 14 14" aria-hidden="true" width="12" height="12">
                <path
                  d="M3 3 L11 11 M11 3 L3 11"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>` : A}
      </div>
    `;
  }
};
St.styles = i`
    :host {
      --ae-banner-bg: var(--ae-color-info);
      --ae-banner-fg: var(--ae-color-fg-on-accent);
      --ae-banner-border: transparent;
      --ae-banner-padding: var(--ae-space-2) var(--ae-space-4);
      display: block;
      width: 100%;
    }

    :host([sticky]) {
      position: sticky;
      top: 0;
      z-index: var(--ae-z-sticky);
    }

    .banner {
      display: flex;
      align-items: center;
      gap: var(--ae-space-3);
      background: var(--ae-banner-bg);
      backdrop-filter: var(--ae-banner-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-banner-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-banner-fg);
      border-bottom: var(--ae-banner-border-width, var(--ae-border-width-1)) solid
        var(--ae-banner-border);
      padding: var(--ae-banner-padding);
      font-family: var(--ae-banner-font-family, inherit);
      font-size: var(--ae-banner-font-size, var(--ae-font-size-sm));
      font-weight: var(--ae-banner-font-weight, inherit);
      letter-spacing: var(--ae-banner-tracking, normal);
      text-transform: var(--ae-banner-transform, none);
      line-height: var(--ae-line-height-snug);
      min-height: 2.5rem;
    }

    .icon {
      display: inline-flex;
      align-items: center;
    }
    .icon[hidden] { display: none; }

    .body {
      flex: 1 1 auto;
      min-width: 0;
    }

    .actions {
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-2);
    }
    .actions[hidden] { display: none; }

    .dismiss {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: var(--ae-radius-sm);
      color: inherit;
      opacity: 0.8;
      transition: background var(--ae-duration-fast), opacity var(--ae-duration-fast);
    }
    .dismiss:hover {
      opacity: 1;
      background: var(--ae-color-hover-overlay);
    }
    .dismiss:focus-visible {
      ${y3}
    }

    /* Tones. Each ground routes through a per-tone indirection token whose
     * fallback preserves the default; a brand recolors a tone by SETTING the
     * token at :root (Metro flips these to a transit service-advisory: signal
     * grounds + paper/ink text + a hard ink bottom rule) without having to
     * out-specify these :host([tone]) rules. */
    :host([tone='info'])    { --ae-banner-bg: var(--ae-banner-info-bg, var(--ae-color-info));    --ae-banner-fg: var(--ae-banner-info-fg, var(--ae-color-fg-on-info));    --ae-banner-border: var(--ae-banner-info-border, transparent); }
    :host([tone='success']) { --ae-banner-bg: var(--ae-banner-success-bg, var(--ae-color-success)); --ae-banner-fg: var(--ae-banner-success-fg, var(--ae-color-fg-on-success)); --ae-banner-border: var(--ae-banner-success-border, transparent); }
    :host([tone='warning']) { --ae-banner-bg: var(--ae-banner-warning-bg, var(--ae-color-warning)); --ae-banner-fg: var(--ae-banner-warning-fg, var(--ae-color-fg-on-warning)); --ae-banner-border: var(--ae-banner-warning-border, transparent); }
    :host([tone='danger'])  { --ae-banner-bg: var(--ae-banner-danger-bg, var(--ae-color-danger));  --ae-banner-fg: var(--ae-banner-danger-fg, var(--ae-color-fg-on-danger));  --ae-banner-border: var(--ae-banner-danger-border, transparent); }
    :host([tone='accent'])  { --ae-banner-bg: var(--ae-banner-accent-bg, var(--ae-color-accent));  --ae-banner-fg: var(--ae-banner-accent-fg, var(--ae-color-fg-on-accent));  --ae-banner-border: var(--ae-banner-accent-border, transparent); }
    :host([tone='neutral']) {
      --ae-banner-bg: var(--ae-banner-neutral-bg, var(--ae-color-bg-subtle));
      --ae-banner-fg: var(--ae-banner-neutral-fg, var(--ae-color-fg));
      --ae-banner-border: var(--ae-banner-neutral-border, var(--ae-color-border));
    }
  `;
wa([
  n4({ type: String, reflect: true })
], St.prototype, "tone", 2);
wa([
  n4({ type: Boolean, reflect: true })
], St.prototype, "dismissible", 2);
wa([
  n4({ type: Boolean, reflect: true })
], St.prototype, "sticky", 2);
St = wa([
  t3("ae-banner")
], St);
var _o = Object.defineProperty;
var yo = Object.getOwnPropertyDescriptor;
var La = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? yo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && _o(t5, a4, i7), i7;
};
var Kt = class extends i4 {
  constructor() {
    super(...arguments), this.tone = "info", this.title = "", this._hasTitleSlot = false, this._hasIconSlot = false, this._onTitleSlot = (e8) => {
      this._hasTitleSlot = e8.target.assignedNodes({ flatten: true }).length > 0, this.requestUpdate();
    }, this._onIconSlot = (e8) => {
      this._hasIconSlot = e8.target.assignedNodes({ flatten: true }).length > 0, this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "note");
  }
  render() {
    const e8 = this._hasTitleSlot || !!this.title;
    return b2`
      <div part="callout" class="callout">
        <span part="icon" class="icon">
          <slot name="icon" @slotchange=${this._onIconSlot}>
            ${this._hasIconSlot ? A : this._defaultIcon()}
          </slot>
        </span>
        <div part="title" class="title" ?hidden=${!e8}>
          <slot name="title" @slotchange=${this._onTitleSlot}>
            ${this._hasTitleSlot ? A : this.title}
          </slot>
        </div>
        <div part="body" class="body" style=${e8 ? "" : "grid-row: 1;"}>
          <slot></slot>
        </div>
      </div>
    `;
  }
  _defaultIcon() {
    switch (this.tone) {
      case "success":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 10.5 L8 14.5 L16 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`;
      case "warning":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2 L18 17 L2 17 Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
          <path d="M10 8 V12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
          <circle cx="10" cy="14.5" r="0.9" fill="currentColor" />
        </svg>`;
      case "danger":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.75" />
          <path d="M7 7 L13 13 M13 7 L7 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>`;
      case "neutral":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="4" width="14" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.75" />
          <path d="M6 8 H14 M6 11 H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>`;
      case "accent":
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2 L12.5 7.5 L18 8.2 L14 12 L15 17.5 L10 14.8 L5 17.5 L6 12 L2 8.2 L7.5 7.5 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>`;
      case "info":
      default:
        return b2`<svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.75" />
          <circle cx="10" cy="6.5" r="0.9" fill="currentColor" />
          <path d="M10 9.5 V14.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>`;
    }
  }
};
Kt.styles = i`
    :host {
      --ae-callout-bg: var(--ae-color-info-subtle);
      --ae-callout-fg: var(--ae-color-fg);
      --ae-callout-accent: var(--ae-color-info-emphasis);
      --ae-callout-radius: var(--ae-radius-md);
      --ae-callout-padding: var(--ae-space-3) var(--ae-space-4);

      display: block;
    }

    .callout {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--ae-space-1) var(--ae-space-3);
      background: var(--ae-callout-bg);
      backdrop-filter: var(--ae-callout-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-callout-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-callout-fg);
      border-left: 3px solid var(--ae-callout-accent);
      border-radius: var(--ae-callout-radius);
      padding: var(--ae-callout-padding);
      font-size: var(--ae-font-size-sm);
      line-height: var(--ae-line-height-normal);
    }

    .icon {
      grid-row: 1 / span 2;
      display: inline-flex;
      align-items: flex-start;
      color: var(--ae-callout-accent);
      padding-top: 2px;
    }
    .icon svg {
      width: 1.125rem;
      height: 1.125rem;
      display: block;
    }

    .title {
      font-weight: var(--ae-font-weight-semibold);
      color: var(--ae-callout-accent);
      line-height: var(--ae-line-height-tight);
    }
    .title[hidden] { display: none; }

    .body ::slotted(:first-child) { margin-top: 0; }
    .body ::slotted(:last-child) { margin-bottom: 0; }

    /* Tones */
    :host([tone='info']) {
      --ae-callout-bg: var(--ae-color-info-subtle);
      --ae-callout-accent: var(--ae-color-info-emphasis);
    }
    :host([tone='success']) {
      --ae-callout-bg: var(--ae-color-success-subtle);
      --ae-callout-accent: var(--ae-color-success-emphasis);
    }
    :host([tone='warning']) {
      --ae-callout-bg: var(--ae-color-warning-subtle);
      --ae-callout-accent: var(--ae-color-warning-emphasis);
    }
    :host([tone='danger']) {
      --ae-callout-bg: var(--ae-color-danger-subtle);
      --ae-callout-accent: var(--ae-color-danger-emphasis);
    }
    :host([tone='neutral']) {
      --ae-callout-bg: var(--ae-color-bg-subtle);
      --ae-callout-accent: var(--ae-color-fg-muted);
    }
    :host([tone='accent']) {
      --ae-callout-bg: var(--ae-color-accent-subtle);
      --ae-callout-accent: var(--ae-color-accent-emphasis);
    }
  `;
La([
  n4({ type: String, reflect: true })
], Kt.prototype, "tone", 2);
La([
  n4({ type: String })
], Kt.prototype, "title", 2);
Kt = La([
  t3("ae-callout")
], Kt);
var ha = null;
function sn(e8) {
  ha = e8;
}
function dr() {
  return ha;
}
function hr(e8, t5) {
  if (!ha || !t5) return Nt(e8);
  try {
    const a4 = ha(e8, t5);
    return typeof a4 == "string" ? a4 : Nt(e8);
  } catch {
    return Nt(e8);
  }
}
function Nt(e8) {
  return e8.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var wo = Object.defineProperty;
var xo = Object.getOwnPropertyDescriptor;
var Oe = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? xo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && wo(t5, a4, i7), i7;
};
var ae = class extends i4 {
  constructor() {
    super(...arguments), this.language = "", this.code = "", this.copyable = false, this.lineNumbers = false, this.wrap = false, this.filename = "", this._copied = false, this._onCopy = async () => {
      const e8 = Xa(this._resolveCode());
      await this._writeClipboard(e8) && (this._copied = true, this.dispatchEvent(
        new CustomEvent("ae-copy", {
          bubbles: true,
          composed: true,
          detail: { text: e8 }
        })
      ), setTimeout(() => {
        this._copied = false;
      }, 1500));
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.code || queueMicrotask(() => this.requestUpdate());
  }
  _resolveCode() {
    if (this.code) return this.code;
    const e8 = this._defaultSlot;
    if (e8) {
      const t5 = e8.assignedNodes({ flatten: true });
      if (t5.length > 0)
        return t5.map((a4) => (a4.nodeType === Node.TEXT_NODE, a4.textContent ?? "")).join("");
    }
    return this.textContent ?? "";
  }
  render() {
    const e8 = Xa(this._resolveCode()), t5 = e8.length === 0 ? [""] : e8.split(/\r?\n/), a4 = !!dr() && !!this.language, r6 = t5.map(
      (o9) => a4 ? hr(o9, this.language) : Nt(o9)
    ), i7 = this.filename || this.copyable ? b2`
          <div part="header" class="header">
            <span part="filename" class="filename">${this.filename || A}</span>
            ${this.copyable ? b2`<button
                  part="copy"
                  class="copy"
                  type="button"
                  aria-label="Copy code"
                  @click=${this._onCopy}
                >
                  ${this._copied ? b2`<svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg> Copied` : b2`<svg viewBox="0 0 16 16" aria-hidden="true">
                        <rect x="5" y="3" width="8" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5" />
                        <path d="M3 11 V4 a1 1 0 0 1 1 -1 H10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      </svg> Copy`}
                </button>` : A}
          </div>
        ` : A, s4 = this.lineNumbers ? b2`
          <div class="with-gutter">
            <div part="gutter" class="gutter" aria-hidden="true">
              ${t5.map((o9, h3) => b2`<span class="ln">${h3 + 1}</span>`)}
            </div>
            <pre part="pre"><code part="code" class=${this.language ? `language-${this.language}` : ""}>${o7(r6.join(`
`))}</code></pre>
          </div>
        ` : b2`
          <pre part="pre"><code part="code" class=${this.language ? `language-${this.language}` : ""}>${o7(r6.join(`
`))}</code></pre>
        `;
    return b2`
      <div part="container" class="container">
        ${i7} ${s4}
      </div>
      <!-- Polite live region: announces the copy result to screen readers,
           since the button's label swap alone isn't reliably announced (4.1.3). -->
      <span class="sr-status" role="status" aria-live="polite"
        >${this._copied ? "Copied to clipboard" : ""}</span
      >
      <span class="source-slot" hidden>
        <slot class="code-source" @slotchange=${() => this.requestUpdate()}></slot>
      </span>
    `;
  }
  async _writeClipboard(e8) {
    var a4;
    const t5 = navigator;
    if ((a4 = t5.clipboard) != null && a4.writeText)
      try {
        return await t5.clipboard.writeText(e8), true;
      } catch {
      }
    try {
      const r6 = document.createElement("textarea");
      r6.value = e8, r6.style.position = "fixed", r6.style.opacity = "0", document.body.appendChild(r6), r6.select();
      const i7 = document.execCommand("copy");
      return r6.remove(), i7;
    } catch {
      return false;
    }
  }
};
ae.styles = i`
    /*
     * Theme-overridable tokens NOT declared at :host — resolved at
     * consumption point. Locked down by
     * src/theme-integration.test.ts.
     */
    :host {
      --ae-code-block-font-size: var(--ae-font-size-sm);
      --ae-code-block-line-height: var(--ae-line-height-snug);

      display: block;
    }

    .container {
      background: var(--ae-code-block-bg, var(--ae-color-gray-900));
      /* Frosted-glass hook — inert unless a theme sets
       * --ae-surface-backdrop-filter and a translucent --ae-code-block-bg
       * (Crucible). The blur softens the atmosphere behind the code surface. */
      backdrop-filter: var(--ae-code-block-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-code-block-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-code-block-fg, var(--ae-color-gray-100));
      border:
        var(--ae-code-block-border,
          var(--ae-border-width-1) solid var(--ae-color-border));
      border-radius: var(--ae-code-block-radius, var(--ae-radius-lg));
      overflow: hidden;
      font-family: var(--ae-font-family-mono);
      font-size: var(--ae-code-block-font-size);
      line-height: var(--ae-code-block-line-height);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ae-space-3);
      padding: var(--ae-space-2) var(--ae-space-3);
      background: var(--ae-code-block-header-bg, var(--ae-color-gray-800));
      /* gray-100 (not gray-300): the small letter-spaced filename + copy label
         need 4.5:1 on the dark header — gray-300 lands ~4.1 in some packs. */
      color: var(--ae-code-block-header-fg, var(--ae-color-gray-100));
      border-bottom:
        var(--ae-code-block-header-border,
          var(--ae-border-width-1) solid var(--ae-color-gray-700));
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-xs);
      letter-spacing:
        var(--ae-code-block-header-tracking, normal);
      text-transform: var(--ae-code-block-header-transform, none);
    }

    .filename {
      font-weight: var(--ae-font-weight-medium);
      letter-spacing: var(--ae-letter-spacing-wide);
    }

    .copy {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--ae-space-1);
      padding: var(--ae-space-1) var(--ae-space-2);
      border-radius: var(--ae-radius-sm);
      color: inherit;
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-xs);
      transition: background var(--ae-duration-fast);
    }
    .copy:hover { background: var(--ae-color-gray-700); }
    .copy:focus-visible { ${y3} }
    .copy svg { width: 12px; height: 12px; }

    pre {
      margin: 0;
      padding: var(--ae-space-3) var(--ae-space-4);
      overflow-x: auto;
      tab-size: 2;
      white-space: pre;
    }
    :host([wrap]) pre {
      white-space: pre-wrap;
      overflow-x: hidden;
      word-break: break-word;
    }

    code {
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      display: block;
    }

    .with-gutter {
      display: grid;
      grid-template-columns: auto 1fr;
    }
    .gutter {
      user-select: none;
      text-align: right;
      padding: var(--ae-space-3) var(--ae-space-3) var(--ae-space-3) var(--ae-space-4);
      color: var(--ae-code-block-gutter-fg);
      border-right: var(--ae-border-width-1) solid var(--ae-color-gray-700);
      background: oklch(0% 0 0 / 0.15);
      font-variant-numeric: tabular-nums;
    }
    .gutter .ln {
      display: block;
    }
    .with-gutter pre {
      padding-left: var(--ae-space-3);
    }

    /* Hide the original slot — its content is mirrored into the rendered pre/code. */
    .source-slot { display: none; }

    .sr-status {
      ${tr}
    }
  `;
Oe([
  n4({ type: String, reflect: true })
], ae.prototype, "language", 2);
Oe([
  n4({ type: String })
], ae.prototype, "code", 2);
Oe([
  n4({ type: Boolean, reflect: true })
], ae.prototype, "copyable", 2);
Oe([
  n4({ type: Boolean, reflect: true, attribute: "line-numbers" })
], ae.prototype, "lineNumbers", 2);
Oe([
  n4({ type: Boolean, reflect: true })
], ae.prototype, "wrap", 2);
Oe([
  n4({ type: String, reflect: true })
], ae.prototype, "filename", 2);
Oe([
  r5()
], ae.prototype, "_copied", 2);
Oe([
  e5("slot.code-source")
], ae.prototype, "_defaultSlot", 2);
ae = Oe([
  t3("ae-code-block")
], ae);
function Xa(e8) {
  return e8.replace(/^\r?\n/, "").replace(/\r?\n[ \t]*$/, "");
}
function ko(e8, t5) {
  const a4 = Za(e8), r6 = Za(t5), i7 = a4.length, s4 = r6.length, o9 = Array.from(
    { length: i7 + 1 },
    () => new Array(s4 + 1).fill(0)
  );
  for (let b3 = 1; b3 <= i7; b3++)
    for (let g2 = 1; g2 <= s4; g2++) {
      const m2 = a4[b3 - 1], w2 = r6[g2 - 1];
      if (m2 === w2)
        o9[b3][g2] = o9[b3 - 1][g2 - 1] + 1;
      else {
        const se = o9[b3 - 1][g2], A2 = o9[b3][g2 - 1];
        o9[b3][g2] = se >= A2 ? se : A2;
      }
    }
  const h3 = [];
  let d3 = i7, p3 = s4;
  for (; d3 > 0 || p3 > 0; )
    d3 > 0 && p3 > 0 && a4[d3 - 1] === r6[p3 - 1] ? (h3.push({ kind: "equal", text: a4[d3 - 1], oldLine: d3, newLine: p3 }), d3--, p3--) : p3 > 0 && (d3 === 0 || o9[d3][p3 - 1] >= o9[d3 - 1][p3]) ? (h3.push({ kind: "add", text: r6[p3 - 1], newLine: p3 }), p3--) : (h3.push({ kind: "remove", text: a4[d3 - 1], oldLine: d3 }), d3--);
  return h3.reverse(), h3;
}
function pr(e8, t5) {
  const a4 = Ja(e8), r6 = Ja(t5), i7 = a4.length, s4 = r6.length, o9 = Array.from(
    { length: i7 + 1 },
    () => new Array(s4 + 1).fill(0)
  );
  for (let b3 = 1; b3 <= i7; b3++)
    for (let g2 = 1; g2 <= s4; g2++)
      if (a4[b3 - 1] === r6[g2 - 1])
        o9[b3][g2] = o9[b3 - 1][g2 - 1] + 1;
      else {
        const m2 = o9[b3 - 1][g2], w2 = o9[b3][g2 - 1];
        o9[b3][g2] = m2 >= w2 ? m2 : w2;
      }
  const h3 = [];
  let d3 = i7, p3 = s4;
  for (; d3 > 0 || p3 > 0; )
    d3 > 0 && p3 > 0 && a4[d3 - 1] === r6[p3 - 1] ? (h3.push({ kind: "equal", text: a4[d3 - 1] }), d3--, p3--) : p3 > 0 && (d3 === 0 || o9[d3][p3 - 1] >= o9[d3 - 1][p3]) ? (h3.push({ kind: "add", text: r6[p3 - 1] }), p3--) : (h3.push({ kind: "remove", text: a4[d3 - 1] }), d3--);
  return h3.reverse(), h3;
}
function Za(e8) {
  return e8 === "" ? [] : (e8.endsWith(`
`) ? e8.slice(0, -1) : e8).split(/\r?\n/);
}
function Ja(e8) {
  const t5 = [], a4 = /(\s+|\w+|[^\s\w]+)/g;
  let r6;
  for (; (r6 = a4.exec(e8)) !== null; ) t5.push(r6[0]);
  return t5;
}
var $o = Object.defineProperty;
var So = Object.getOwnPropertyDescriptor;
var Te = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? So(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && $o(t5, a4, i7), i7;
};
var re = class extends i4 {
  constructor() {
    super(...arguments), this.mode = "unified", this.language = "", this.oldText = "", this.newText = "", this.contextLines = 3, this.wordDiff = false, this.oldLabel = "", this.newLabel = "";
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "region"), this.hasAttribute("aria-label") || this.setAttribute("aria-label", "Diff");
  }
  render() {
    const e8 = ko(this.oldText, this.newText), t5 = Eo(e8, Math.max(0, this.contextLines));
    return this.mode === "split" ? this._renderSplit(t5) : this._renderUnified(t5);
  }
  _renderUnified(e8) {
    const t5 = [];
    for (const a4 of e8) {
      if (a4.kind === "gap") {
        t5.push(b2`<div part="gap" class="gap">…</div>`);
        continue;
      }
      const r6 = this.wordDiff ? Ao(a4.ops) : null;
      a4.ops.forEach((i7, s4) => {
        const o9 = i7.kind === "add" ? "+" : i7.kind === "remove" ? "-" : " ", h3 = i7.kind === "add" ? "row-add" : i7.kind === "remove" ? "row-remove" : "", d3 = (r6 == null ? void 0 : r6[s4]) ?? this._renderLineContent(i7.text);
        t5.push(b2`
          <div part="line-num" class="num">${i7.oldLine ?? ""}</div>
          <div part="line-num" class="num">${i7.newLine ?? ""}</div>
          <div part="content" class="content ${h3}" data-sign=${o9}>${d3}</div>
        `);
      });
    }
    return b2`<div part="container" class="container">
      <div class="unified">${t5}</div>
    </div>`;
  }
  _renderSplit(e8) {
    const t5 = [], a4 = this.oldLabel || this.newLabel ? b2`<div class="header"><span>${this.oldLabel}</span><span>${this.newLabel}</span></div>` : b2``;
    for (const r6 of e8) {
      if (r6.kind === "gap") {
        t5.push(b2`<div part="gap" class="gap">…</div>`);
        continue;
      }
      const i7 = Co(r6.ops), s4 = this.wordDiff ? zo(i7) : null;
      i7.forEach((o9, h3) => {
        var A2, Ia, Ma, Ba;
        const d3 = s4 == null ? void 0 : s4[h3], p3 = o9.left ? (d3 == null ? void 0 : d3.left) ?? this._renderLineContent(o9.left.text) : b2``, b3 = o9.right ? (d3 == null ? void 0 : d3.right) ?? this._renderLineContent(o9.right.text) : b2``, g2 = o9.left ? o9.left.kind === "remove" ? "row-remove" : "" : "row-empty", m2 = o9.right ? o9.right.kind === "add" ? "row-add" : "" : "row-empty", w2 = ((A2 = o9.left) == null ? void 0 : A2.kind) === "remove" ? "-" : " ", se = ((Ia = o9.right) == null ? void 0 : Ia.kind) === "add" ? "+" : " ";
        t5.push(b2`
          <div part="line-num" class="num ${g2}">${((Ma = o9.left) == null ? void 0 : Ma.oldLine) ?? ""}</div>
          <div part="content" class="content ${g2}" data-sign=${w2}>${p3}</div>
          <div part="line-num" class="num ${m2}">${((Ba = o9.right) == null ? void 0 : Ba.newLine) ?? ""}</div>
          <div part="content" class="content ${m2}" data-sign=${se}>${b3}</div>
        `);
      });
    }
    return b2`<div part="container" class="container">
      ${a4}
      <div class="split">${t5}</div>
    </div>`;
  }
  _renderLineContent(e8) {
    return dr() && this.language ? o7(hr(e8, this.language)) : e8;
  }
};
re.styles = i`
    :host {
      /* --ae-diff-bg is intentionally NOT declared at :host: a :host
       * declaration shadows root-level theme overrides via the cascade
       * (directly-applied rules beat inheritance), which would stop a theme
       * from making the diff surface translucent. Crucible sets a translucent
       * --ae-diff-bg at :root so the diff frosts; it flows in via inheritance.
       * Consumed below as var(--ae-diff-bg, var(--ae-color-bg)). */
      --ae-diff-fg: var(--ae-color-fg);
      /* Theme-aware LOW-ALPHA tints over the diff background: the band stays
         close to the surface color in every theme, so the inherited
         --ae-diff-fg (theme fg) keeps its normal text contrast (WCAG 1.4.3).
         A stronger-but-still-modest tint marks word-level changes. Deriving
         from success/danger keeps the green/red semantics across all packs. */
      --ae-diff-add-bg: color-mix(in oklch, var(--ae-color-success) 14%, var(--ae-diff-bg, var(--ae-color-bg)));
      --ae-diff-add-word-bg: color-mix(in oklch, var(--ae-color-success) 26%, var(--ae-diff-bg, var(--ae-color-bg)));
      --ae-diff-remove-bg: color-mix(in oklch, var(--ae-color-danger) 14%, var(--ae-diff-bg, var(--ae-color-bg)));
      --ae-diff-remove-word-bg: color-mix(in oklch, var(--ae-color-danger) 26%, var(--ae-diff-bg, var(--ae-color-bg)));
      --ae-diff-gutter-fg: var(--ae-color-fg-subtle);
      --ae-diff-radius: var(--ae-radius-lg);

      display: block;
    }

    .container {
      background: var(--ae-diff-bg, var(--ae-color-bg));
      backdrop-filter: var(--ae-diff-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-diff-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      color: var(--ae-diff-fg);
      border: var(--ae-border-width-1) solid var(--ae-color-border);
      border-radius: var(--ae-diff-radius);
      overflow: hidden;
      font-family: var(--ae-font-family-mono);
      font-size: var(--ae-font-size-sm);
      line-height: var(--ae-line-height-snug);
    }

    .header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--ae-color-bg-subtle);
      border-bottom: var(--ae-border-width-1) solid var(--ae-color-border);
      font-family: var(--ae-font-family-sans);
      font-size: var(--ae-font-size-xs);
      font-weight: var(--ae-font-weight-semibold);
      color: var(--ae-color-fg-muted);
    }
    .header span {
      padding: var(--ae-space-2) var(--ae-space-3);
    }
    .header span + span {
      border-left: var(--ae-border-width-1) solid var(--ae-color-border);
    }

    /* Unified mode: 3-column grid (old-line, new-line, content). */
    .unified {
      display: grid;
      grid-template-columns: auto auto 1fr;
    }
    .split {
      display: grid;
      grid-template-columns: auto 1fr auto 1fr;
    }

    .num {
      user-select: none;
      text-align: right;
      padding: 0 var(--ae-space-2);
      color: var(--ae-diff-gutter-fg);
      background: var(--ae-color-bg-subtle);
      border-right: var(--ae-border-width-1) solid var(--ae-color-border);
      font-variant-numeric: tabular-nums;
      min-width: 2.25rem;
    }
    .split .num + .content + .num {
      border-left: var(--ae-border-width-1) solid var(--ae-color-border);
    }

    .content {
      padding: 0 var(--ae-space-3);
      white-space: pre;
      overflow-x: hidden;
    }
    .content::before {
      content: attr(data-sign);
      display: inline-block;
      width: 1ch;
      color: var(--ae-color-fg-subtle);
      user-select: none;
    }

    .row-add .content { background: var(--ae-diff-add-bg); }
    .row-add .num    { background: var(--ae-diff-add-bg); color: var(--ae-color-success-emphasis); }
    .row-remove .content { background: var(--ae-diff-remove-bg); }
    .row-remove .num    { background: var(--ae-diff-remove-bg); color: var(--ae-color-danger-emphasis); }
    .row-empty .content { background: var(--ae-color-bg-subtle); }
    .row-empty .num    { background: var(--ae-color-bg-subtle); }

    .word-add { background: var(--ae-diff-add-word-bg); border-radius: 2px; }
    .word-remove { background: var(--ae-diff-remove-word-bg); border-radius: 2px; }

    .gap {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--ae-space-1) 0;
      color: var(--ae-color-fg-subtle);
      background: var(--ae-color-bg-subtle);
      font-size: var(--ae-font-size-xs);
      border-block: var(--ae-border-width-1) solid var(--ae-color-border-subtle);
    }
  `;
Te([
  n4({ type: String, reflect: true })
], re.prototype, "mode", 2);
Te([
  n4({ type: String, reflect: true })
], re.prototype, "language", 2);
Te([
  n4({ type: String, attribute: "old-text" })
], re.prototype, "oldText", 2);
Te([
  n4({ type: String, attribute: "new-text" })
], re.prototype, "newText", 2);
Te([
  n4({ type: Number, attribute: "context-lines", reflect: true })
], re.prototype, "contextLines", 2);
Te([
  n4({ type: Boolean, reflect: true, attribute: "word-diff" })
], re.prototype, "wordDiff", 2);
Te([
  n4({ type: String, attribute: "old-label" })
], re.prototype, "oldLabel", 2);
Te([
  n4({ type: String, attribute: "new-label" })
], re.prototype, "newLabel", 2);
re = Te([
  t3("ae-diff-viewer")
], re);
function Eo(e8, t5) {
  if (e8.length === 0) return [];
  const a4 = new Array(e8.length).fill(false);
  for (let d3 = 0; d3 < e8.length; d3++)
    if (e8[d3].kind !== "equal")
      for (let p3 = Math.max(0, d3 - t5); p3 <= Math.min(e8.length - 1, d3 + t5); p3++)
        a4[p3] = true;
  if (!a4.some(Boolean))
    return [{ kind: "ops", ops: e8 }];
  const r6 = [];
  let i7 = [], s4 = false, o9 = false, h3 = false;
  for (let d3 = 0; d3 < e8.length; d3++) {
    const p3 = e8[d3];
    p3.kind !== "equal" || a4[d3] ? (h3 = true, s4 && (r6.push({ kind: "gap", ops: [] }), s4 = false), i7.push(p3)) : (i7.length > 0 && (r6.push({ kind: "ops", ops: i7 }), i7 = []), !h3 && !o9 ? (r6.push({ kind: "gap", ops: [] }), o9 = true, s4 = false) : s4 = true);
  }
  return i7.length > 0 && r6.push({ kind: "ops", ops: i7 }), s4 && r6.push({ kind: "gap", ops: [] }), r6;
}
function Co(e8) {
  const t5 = [];
  let a4 = 0;
  for (; a4 < e8.length; ) {
    const r6 = e8[a4];
    if (r6.kind === "equal") {
      t5.push({ left: r6, right: r6 }), a4++;
      continue;
    }
    const i7 = [], s4 = [];
    for (; a4 < e8.length && (e8[a4].kind === "remove" || e8[a4].kind === "add"); )
      e8[a4].kind === "remove" ? i7.push(e8[a4]) : s4.push(e8[a4]), a4++;
    const o9 = Math.max(i7.length, s4.length);
    for (let h3 = 0; h3 < o9; h3++)
      t5.push({ left: i7[h3], right: s4[h3] });
  }
  return t5;
}
function Ao(e8) {
  var a4;
  const t5 = new Array(e8.length).fill(null);
  for (let r6 = 0; r6 < e8.length; r6++)
    if (e8[r6].kind === "remove" && ((a4 = e8[r6 + 1]) == null ? void 0 : a4.kind) === "add") {
      const i7 = pr(e8[r6].text, e8[r6 + 1].text);
      t5[r6] = pa(i7, "remove"), t5[r6 + 1] = pa(i7, "add"), r6++;
    }
  return t5;
}
function zo(e8) {
  return e8.map((t5) => {
    var a4, r6;
    if (((a4 = t5.left) == null ? void 0 : a4.kind) === "remove" && ((r6 = t5.right) == null ? void 0 : r6.kind) === "add") {
      const i7 = pr(t5.left.text, t5.right.text);
      return {
        left: pa(i7, "remove"),
        right: pa(i7, "add")
      };
    }
    return null;
  });
}
function pa(e8, t5) {
  const r6 = e8.filter((i7) => i7.kind === "equal" || i7.kind === t5).map((i7) => {
    const s4 = Nt(i7.text);
    return i7.kind === "equal" ? s4 : `<span class="word-${t5}">${s4}</span>`;
  });
  return b2`${o7(r6.join(""))}`;
}
var Do = Object.getOwnPropertyDescriptor;
var Po = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Do(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = o9(i7) || i7);
  return i7;
};
var Ca = class extends i4 {
  render() {
    return b2`<kbd part="kbd"><slot></slot></kbd>`;
  }
};
Ca.styles = i`
    /* Defaults live in the var() fallbacks (not declared at :host) so a brand
     * theme can override the cap surface/border/shadow at :root without being
     * shadowed by a directly-matched :host declaration. Metro flips the
     * pseudo-keycap into a flat 2px-ink-framed paper-2 chip (no shadow). */
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    kbd {
      display: inline-block;
      font-family: var(--ae-font-family-mono);
      font-size: var(--ae-kbd-font-size, 0.8125em);
      line-height: 1;
      font-weight: var(--ae-kbd-font-weight, var(--ae-font-weight-medium));
      letter-spacing: var(--ae-kbd-tracking, normal);
      color: var(--ae-kbd-fg, var(--ae-color-fg));
      background: var(--ae-kbd-bg, var(--ae-color-bg-elevated));
      backdrop-filter: var(--ae-kbd-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      -webkit-backdrop-filter: var(--ae-kbd-backdrop-filter, var(--ae-surface-backdrop-filter, none));
      border: var(--ae-border-width-1) solid var(--ae-kbd-border, var(--ae-color-border-strong));
      border-radius: var(--ae-kbd-radius, var(--ae-radius-sm));
      padding: var(--ae-kbd-padding, 0.15em 0.45em 0.2em);
      box-shadow: var(--ae-kbd-shadow,
        inset 0 -1px 0 0 var(--ae-color-border-strong),
        0 1px 0 0 var(--ae-color-border-strong));
      min-width: 1.5em;
      text-align: center;
      white-space: nowrap;
    }
  `;
Ca = Po([
  t3("ae-kbd")
], Ca);
var Oo = Object.defineProperty;
var To = Object.getOwnPropertyDescriptor;
var ur = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? To(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Oo(t5, a4, i7), i7;
};
var ua = class extends i4 {
  constructor() {
    super(...arguments), this.size = "md";
  }
  render() {
    return b2`<div part="prose" class="prose"><slot></slot></div>`;
  }
};
ua.styles = i`
    :host {
      --ae-prose-fg: var(--ae-color-fg);
      --ae-prose-muted: var(--ae-color-fg-muted);
      --ae-prose-link: var(--ae-color-accent-emphasis);
      --ae-prose-rule: var(--ae-color-border);
      --ae-prose-code-bg: var(--ae-color-bg-muted);
      --ae-prose-pre-bg: var(--ae-color-gray-900);
      --ae-prose-base-size: var(--ae-font-size-md);
      --ae-prose-line-height: var(--ae-line-height-relaxed);
      --ae-prose-spacing: var(--ae-space-4);

      display: block;
      color: var(--ae-prose-fg);
      font-size: var(--ae-prose-base-size);
      line-height: var(--ae-prose-line-height);
    }

    :host([size='sm']) { --ae-prose-base-size: var(--ae-font-size-sm); --ae-prose-spacing: var(--ae-space-3); }
    :host([size='md']) { --ae-prose-base-size: var(--ae-font-size-md); --ae-prose-spacing: var(--ae-space-4); }
    :host([size='lg']) { --ae-prose-base-size: var(--ae-font-size-lg); --ae-prose-spacing: var(--ae-space-5); }

    .prose {
      display: block;
      max-width: 65ch;
    }

    /* Top-level slotted element styling. Note that ::slotted() only
       matches direct children of the slot — nested elements are NOT
       styled here on purpose. */
    ::slotted(:first-child) { margin-top: 0; }
    ::slotted(:last-child) { margin-bottom: 0; }

    ::slotted(p) {
      margin: 0 0 var(--ae-prose-spacing) 0;
    }
    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      font-weight: var(--ae-font-weight-semibold);
      line-height: var(--ae-line-height-tight);
      letter-spacing: var(--ae-letter-spacing-tight);
      color: var(--ae-prose-fg);
      margin: calc(var(--ae-prose-spacing) * 1.5) 0 var(--ae-space-2) 0;
    }
    ::slotted(h1) { font-size: 2em; }
    ::slotted(h2) { font-size: 1.5em; padding-bottom: var(--ae-space-2); border-bottom: var(--ae-border-width-1) solid var(--ae-prose-rule); }
    ::slotted(h3) { font-size: 1.25em; }
    ::slotted(h4) { font-size: 1.1em; }
    ::slotted(h5) { font-size: 1em; }
    ::slotted(h6) { font-size: 0.875em; color: var(--ae-prose-muted); text-transform: uppercase; letter-spacing: var(--ae-letter-spacing-wide); }

    ::slotted(ul),
    ::slotted(ol) {
      margin: 0 0 var(--ae-prose-spacing) 0;
      padding-left: 1.5em;
    }
    ::slotted(li) {
      margin: var(--ae-space-1) 0;
    }

    ::slotted(blockquote) {
      margin: 0 0 var(--ae-prose-spacing) 0;
      padding: var(--ae-space-1) var(--ae-space-4);
      border-left: 3px solid var(--ae-prose-rule);
      color: var(--ae-prose-muted);
      font-style: italic;
    }

    ::slotted(hr) {
      border: 0;
      border-top: var(--ae-border-width-1) solid var(--ae-prose-rule);
      margin: calc(var(--ae-prose-spacing) * 1.5) 0;
    }

    ::slotted(code) {
      font-family: var(--ae-font-family-mono);
      font-size: 0.9em;
      background: var(--ae-prose-code-bg);
      padding: 1px 5px;
      border-radius: var(--ae-radius-xs);
    }

    ::slotted(pre) {
      margin: 0 0 var(--ae-prose-spacing) 0;
      padding: var(--ae-space-3) var(--ae-space-4);
      background: var(--ae-prose-pre-bg);
      color: var(--ae-color-gray-100);
      border-radius: var(--ae-radius-md);
      overflow-x: auto;
      font-family: var(--ae-font-family-mono);
      font-size: 0.875em;
      line-height: var(--ae-line-height-snug);
    }

    ::slotted(a) {
      color: var(--ae-prose-link);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    ::slotted(a:hover) {
      text-decoration-thickness: 2px;
    }

    ::slotted(img),
    ::slotted(figure),
    ::slotted(picture) {
      max-width: 100%;
      margin: 0 0 var(--ae-prose-spacing) 0;
    }

    ::slotted(figcaption) {
      font-size: 0.875em;
      color: var(--ae-prose-muted);
      margin-top: var(--ae-space-1);
    }

    ::slotted(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 var(--ae-prose-spacing) 0;
      font-size: 0.95em;
    }
  `;
ur([
  n4({ type: String, reflect: true })
], ua.prototype, "size", 2);
ua = ur([
  t3("ae-prose")
], ua);
var Lo = Object.defineProperty;
var Io = Object.getOwnPropertyDescriptor;
var Ft = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Io(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Lo(t5, a4, i7), i7;
};
var Qa = {
  1: i6`h1`,
  2: i6`h2`,
  3: i6`h3`,
  4: i6`h4`,
  5: i6`h5`,
  6: i6`h6`
};
var Ke = class extends i4 {
  constructor() {
    super(...arguments), this.eyebrow = "", this.heading = "", this.subtitle = "", this.badge = "", this.level = 2, this._onSlotChange = () => this.requestUpdate();
  }
  render() {
    const e8 = Qa[this.level] ?? Qa[2], t5 = (h3) => Array.from(this.children).some((d3) => d3.getAttribute("slot") === h3), a4 = t5("icon"), r6 = t5("back"), i7 = Array.from(this.childNodes).some(
      (h3) => {
        var d3;
        return h3.nodeType === Node.ELEMENT_NODE ? !h3.getAttribute("slot") : !!((d3 = h3.textContent) != null && d3.trim());
      }
    ), s4 = !!this.eyebrow || a4, o9 = !!this.badge || r6;
    return u3`
      <header part="header" class="header">
        <div class="left">
          <div part="eyebrow" class="eyebrow" ?hidden=${!s4}>
            <span class="eyebrow-icon" ?hidden=${!a4}>
              <slot name="icon" @slotchange=${this._onSlotChange}></slot>
            </span>
            ${this.eyebrow ? b2`<span>${this.eyebrow}</span>` : A}
          </div>
          <${e8} part="heading" class="heading">${this.heading}</${e8}>
          ${this.subtitle ? b2`<p part="subtitle" class="subtitle">${this.subtitle}</p>` : A}
        </div>
        <div class="right">
          <div class="status" ?hidden=${!o9}>
            ${this.badge ? b2`<span part="badge" class="badge">${this.badge}</span>` : A}
            <span class="back" ?hidden=${!r6}>
              <slot name="back" @slotchange=${this._onSlotChange}></slot>
            </span>
          </div>
          <div part="actions" class="actions" ?hidden=${!i7}>
            <slot @slotchange=${this._onSlotChange}></slot>
          </div>
        </div>
      </header>
    `;
  }
};
Ke.styles = i`
    :host {
      display: block;
    }

    .header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--ae-space-4);
      border-bottom: var(--ae-page-header-rule-width, var(--ae-border-width-1)) solid
        var(--ae-page-header-rule-color, var(--ae-color-border-subtle));
      padding-bottom: var(--ae-page-header-padding-bottom, var(--ae-space-5));
    }

    .left {
      display: flex;
      flex-direction: column;
      gap: var(--ae-space-1);
      min-width: 0;
    }

    .eyebrow {
      display: flex;
      align-items: center;
      gap: var(--ae-space-2);
      font-family: var(--ae-page-header-eyebrow-font-family, inherit);
      font-size: var(--ae-font-size-xs);
      font-weight: var(--ae-font-weight-bold);
      text-transform: var(--ae-page-header-eyebrow-transform, uppercase);
      letter-spacing: var(--ae-page-header-eyebrow-tracking, 0.1em);
      color: var(--ae-page-header-eyebrow-color, var(--ae-color-fg-muted));
    }
    .eyebrow[hidden] {
      display: none;
    }
    .eyebrow-icon {
      display: inline-flex;
      flex: 0 0 auto;
    }
    .eyebrow-icon[hidden] {
      display: none;
    }
    .eyebrow-icon ::slotted(*) {
      display: block;
      width: 0.75rem;
      height: 0.75rem;
    }

    .heading {
      margin: 0;
      font-family: var(--ae-page-header-heading-font-family, var(--ae-font-family-display));
      font-size: var(--ae-page-header-heading-font-size, var(--ae-font-size-2xl));
      font-weight: var(--ae-font-weight-bold);
      letter-spacing: var(--ae-page-header-heading-tracking, -0.025em);
      line-height: var(--ae-line-height-tight);
      color: var(--ae-color-fg);
    }

    .subtitle {
      margin: 0;
      font-size: var(--ae-font-size-sm);
      color: var(--ae-color-fg-muted);
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--ae-space-3);
      flex: 0 0 auto;
    }

    .status {
      display: flex;
      align-items: center;
      gap: var(--ae-space-3);
    }
    .status[hidden] {
      display: none;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--ae-space-3);
    }
    .actions[hidden] {
      display: none;
    }

    .badge {
      font-family: var(--ae-page-header-badge-font-family, var(--ae-font-family-mono));
      font-size: var(--ae-font-size-xs);
      font-weight: var(--ae-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: -0.02em;
      white-space: nowrap;
      color: var(--ae-page-header-badge-fg, var(--ae-color-fg-muted));
      background: var(--ae-page-header-badge-bg, var(--ae-color-bg-subtle));
      border: var(--ae-border-width-1) solid
        var(--ae-page-header-badge-border, var(--ae-color-border-subtle));
      border-radius: var(--ae-page-header-badge-radius, var(--ae-radius-sm));
      padding: var(--ae-space-1) var(--ae-space-2);
    }

    /* Stack on narrow viewports — the status/actions column drops below the
       title block and the rule is dropped (it reads as clutter when stacked). */
    @media (max-width: 767px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--ae-space-2);
        padding-bottom: 0;
        border-bottom: none;
      }
      .right {
        align-items: flex-start;
      }
    }
  `;
Ft([
  n4()
], Ke.prototype, "eyebrow", 2);
Ft([
  n4()
], Ke.prototype, "heading", 2);
Ft([
  n4()
], Ke.prototype, "subtitle", 2);
Ft([
  n4()
], Ke.prototype, "badge", 2);
Ft([
  n4({ type: Number })
], Ke.prototype, "level", 2);
Ke = Ft([
  t3("ae-page-header")
], Ke);
var Mo = Object.defineProperty;
var Bo = Object.getOwnPropertyDescriptor;
var gt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Bo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Mo(t5, a4, i7), i7;
};
var N2 = class extends i4 {
  constructor() {
    super(...arguments), this.columns = 1, this.rows = null, this.gap = "md", this.align = "", this.justify = "", this.inline = false;
  }
  willUpdate() {
    if (this.style.setProperty(
      "--ae-grid-columns",
      N2.tracks(this.columns)
    ), this.rows == null || this.rows === "")
      this.style.removeProperty("--ae-grid-rows"), this.style.removeProperty("grid-template-rows");
    else {
      const e8 = N2.tracks(this.rows);
      this.style.setProperty("--ae-grid-rows", e8), this.style.setProperty("grid-template-rows", e8);
    }
    typeof this.gap == "string" && !N2._gapTokens.has(this.gap) ? this.style.setProperty("--ae-grid-gap", this.gap) : this.style.removeProperty("--ae-grid-gap");
  }
  /**
   * Coerce a `columns`/`rows` value to a CSS track list. Numbers become
   * `repeat(N, 1fr)`; numeric strings are coerced the same way; everything
   * else passes through unchanged.
   */
  static tracks(e8) {
    if (e8 == null || e8 === "") return "none";
    if (typeof e8 == "number")
      return `repeat(${Math.max(1, Math.trunc(e8))}, minmax(0, 1fr))`;
    const t5 = e8.trim();
    return /^\d+$/.test(t5) ? `repeat(${Math.max(1, Number(t5))}, minmax(0, 1fr))` : t5;
  }
  render() {
    return b2`<slot></slot>`;
  }
};
N2.styles = i`
    :host {
      display: grid;
      box-sizing: border-box;
      min-width: 0;
      grid-template-columns: var(--ae-grid-columns, 1fr);
      gap: var(--ae-grid-gap, var(--ae-space-4));
    }
    :host([inline]) {
      display: inline-grid;
    }

    /* Token gap presets. Raw CSS lengths are applied via inline style. */
    :host([gap='none']) { --ae-grid-gap: 0; }
    :host([gap='xs'])   { --ae-grid-gap: var(--ae-space-1); }
    :host([gap='sm'])   { --ae-grid-gap: var(--ae-space-2); }
    :host([gap='md'])   { --ae-grid-gap: var(--ae-space-4); }
    :host([gap='lg'])   { --ae-grid-gap: var(--ae-space-6); }
    :host([gap='xl'])   { --ae-grid-gap: var(--ae-space-8); }
    :host([gap='2xl'])  { --ae-grid-gap: var(--ae-space-12); }

    /* align-items */
    :host([align='start'])   { align-items: start; }
    :host([align='center'])  { align-items: center; }
    :host([align='end'])     { align-items: end; }
    :host([align='stretch']) { align-items: stretch; }

    /* justify-content */
    :host([justify='start'])         { justify-content: start; }
    :host([justify='center'])        { justify-content: center; }
    :host([justify='end'])           { justify-content: end; }
    :host([justify='stretch'])       { justify-content: stretch; }
    :host([justify='space-between']) { justify-content: space-between; }
    :host([justify='space-around'])  { justify-content: space-around; }
    :host([justify='space-evenly'])  { justify-content: space-evenly; }
  `;
N2._gapTokens = /* @__PURE__ */ new Set([
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl"
]);
gt([
  n4({ reflect: true })
], N2.prototype, "columns", 2);
gt([
  n4({ reflect: true })
], N2.prototype, "rows", 2);
gt([
  n4({ reflect: true })
], N2.prototype, "gap", 2);
gt([
  n4({ type: String, reflect: true })
], N2.prototype, "align", 2);
gt([
  n4({ type: String, reflect: true })
], N2.prototype, "justify", 2);
gt([
  n4({ type: Boolean, reflect: true })
], N2.prototype, "inline", 2);
N2 = gt([
  t3("ae-grid")
], N2);
var Fo = Object.defineProperty;
var jo = Object.getOwnPropertyDescriptor;
var mt = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? jo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && Fo(t5, a4, i7), i7;
};
var Se = class extends i4 {
  constructor() {
    super(...arguments), this.orientation = "horizontal", this.target = null, this.min = 0, this.max = Number.POSITIVE_INFINITY, this.disabled = false, this.controlled = false, this._dragging = false, this._pointerId = null, this._startX = 0, this._startY = 0, this._startWidth = 0, this._startHeight = 0, this._rafId = 0, this._pendingWidth = 0, this._pendingHeight = 0, this._lastAxis = 0, this._pendingAxis = 0, this._onPointerDown = (e8) => {
      var r6, i7, s4, o9;
      if (this.disabled || e8.button !== 0 && e8.pointerType === "mouse") return;
      if (this.controlled) {
        this._dragging = true, this._pointerId = e8.pointerId, this._lastAxis = this.orientation === "vertical" ? e8.clientY : e8.clientX, this.setAttribute("data-dragging", ""), (i7 = (r6 = e8.currentTarget).setPointerCapture) == null || i7.call(r6, e8.pointerId), e8.preventDefault();
        return;
      }
      const t5 = this._resolveTarget();
      if (!t5) return;
      const a4 = t5.getBoundingClientRect();
      this._startX = e8.clientX, this._startY = e8.clientY, this._startWidth = a4.width, this._startHeight = a4.height, this._pointerId = e8.pointerId, this._dragging = true, this.setAttribute("data-dragging", ""), (o9 = (s4 = e8.currentTarget).setPointerCapture) == null || o9.call(s4, e8.pointerId), e8.preventDefault();
    }, this._onPointerMove = (e8) => {
      if (!this._dragging || e8.pointerId !== this._pointerId) return;
      if (this.controlled) {
        this._pendingAxis = this.orientation === "vertical" ? e8.clientY : e8.clientX, this._rafId || (this._rafId = requestAnimationFrame(() => {
          if (this._rafId = 0, !this._dragging) return;
          const o9 = this._pendingAxis - this._lastAxis;
          this._lastAxis = this._pendingAxis, o9 !== 0 && this.dispatchEvent(
            new CustomEvent("ae-resize-delta", {
              bubbles: true,
              composed: true,
              detail: { primary: o9 }
            })
          );
        }));
        return;
      }
      const t5 = this._resolveTarget();
      if (!t5) return;
      const a4 = e8.clientX - this._startX, r6 = e8.clientY - this._startY, i7 = this.orientation === "horizontal" || this.orientation === "both", s4 = this.orientation === "vertical" || this.orientation === "both";
      i7 && (this._pendingWidth = this._clamp(this._startWidth + a4)), s4 && (this._pendingHeight = this._clamp(this._startHeight + r6)), this._rafId || (this._rafId = requestAnimationFrame(() => {
        this._rafId = 0, this._dragging && (i7 && (t5.style.width = `${this._pendingWidth}px`), s4 && (t5.style.height = `${this._pendingHeight}px`), this._emitResize(t5, {
          width: i7 ? this._pendingWidth : this._startWidth,
          height: s4 ? this._pendingHeight : this._startHeight
        }));
      }));
    }, this._onPointerUp = (e8) => {
      var a4, r6;
      if (e8.pointerId !== this._pointerId || (this._dragging = false, this._pointerId = null, this.removeAttribute("data-dragging"), this._rafId && (cancelAnimationFrame(this._rafId), this._rafId = 0), (r6 = (a4 = e8.currentTarget).releasePointerCapture) == null || r6.call(a4, e8.pointerId), this.controlled)) return;
      const t5 = this._resolveTarget();
      t5 && this._emitResize(t5);
    }, this._onKeyDown = (e8) => {
      if (this.disabled) return;
      if (this.controlled) {
        const p3 = this.orientation === "vertical";
        let b3 = 0, g2 = null;
        if (e8.key === (p3 ? "ArrowUp" : "ArrowLeft")) b3 = -1;
        else if (e8.key === (p3 ? "ArrowDown" : "ArrowRight")) b3 = 1;
        else if (e8.key === "Home") g2 = "home";
        else if (e8.key === "End") g2 = "end";
        else return;
        e8.preventDefault(), this.dispatchEvent(
          new CustomEvent(
            "ae-resize-step",
            {
              bubbles: true,
              composed: true,
              detail: { direction: b3, big: e8.shiftKey, edge: g2 }
            }
          )
        );
        return;
      }
      const t5 = this._resolveTarget();
      if (!t5) return;
      const a4 = e8.shiftKey ? 16 : 4, r6 = t5.getBoundingClientRect();
      let i7 = r6.width, s4 = r6.height, o9 = false;
      const h3 = this.orientation === "horizontal" || this.orientation === "both", d3 = this.orientation === "vertical" || this.orientation === "both";
      e8.key === "ArrowLeft" && h3 ? (i7 = this._clamp(i7 - a4), t5.style.width = `${i7}px`, o9 = true) : e8.key === "ArrowRight" && h3 ? (i7 = this._clamp(i7 + a4), t5.style.width = `${i7}px`, o9 = true) : e8.key === "ArrowUp" && d3 ? (s4 = this._clamp(s4 - a4), t5.style.height = `${s4}px`, o9 = true) : e8.key === "ArrowDown" && d3 && (s4 = this._clamp(s4 + a4), t5.style.height = `${s4}px`, o9 = true), o9 && (e8.preventDefault(), this._emitResize(t5, { width: i7, height: s4 }));
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("keydown", this._onKeyDown), !this.hasAttribute("controlled") && (this.hasAttribute("role") || this.setAttribute("role", "separator"), !this.hasAttribute("tabindex") && !this.disabled && this.setAttribute("tabindex", "0"), this._syncAria());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this._onKeyDown);
  }
  updated(e8) {
    this.controlled || ((e8.has("orientation") || e8.has("disabled")) && this._syncAria(), e8.has("disabled") && (this.disabled ? this.removeAttribute("tabindex") : this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0")));
  }
  _syncAria() {
    const e8 = this.orientation === "vertical" ? "horizontal" : "vertical";
    this.setAttribute("aria-orientation", e8), this._syncValueNow();
  }
  /** Mirror the resize target's current primary dimension into the splitter's
   *  value state so AT can announce and track it. */
  _syncValueNow(e8) {
    Number.isFinite(this.min) && this.setAttribute("aria-valuemin", String(Math.round(this.min))), Number.isFinite(this.max) && this.setAttribute("aria-valuemax", String(Math.round(this.max)));
    let t5 = null;
    if (e8)
      t5 = this.orientation === "vertical" ? e8.height : e8.width;
    else {
      const a4 = this._resolveTarget();
      if (a4) {
        const r6 = a4.getBoundingClientRect();
        t5 = this.orientation === "vertical" ? r6.height : r6.width;
      }
    }
    t5 !== null && Number.isFinite(t5) ? this.setAttribute("aria-valuenow", String(Math.round(t5))) : this.hasAttribute("aria-valuenow") || this.setAttribute("aria-valuenow", "0");
  }
  render() {
    return b2`<span
      class="handle"
      part="handle"
      @pointerdown=${this._onPointerDown}
      @pointermove=${this._onPointerMove}
      @pointerup=${this._onPointerUp}
      @pointercancel=${this._onPointerUp}
    ><span class="grip" part="grip" aria-hidden="true"
      ><span class="dot"></span
      ><span class="dot"></span
      ><span class="dot"></span
      ><span class="dot"></span
    ></span></span>`;
  }
  _resolveTarget() {
    var t5;
    if (this.target instanceof HTMLElement) return this.target;
    if (typeof this.target == "string" && this.target.length > 0) {
      const a4 = this.getRootNode(), r6 = (t5 = a4.querySelector) == null ? void 0 : t5.call(a4, this.target);
      if (r6 instanceof HTMLElement) return r6;
    }
    const e8 = this.parentElement;
    return e8 instanceof HTMLElement ? e8 : null;
  }
  _clamp(e8) {
    const t5 = Number.isFinite(this.min) ? this.min : 0, a4 = Number.isFinite(this.max) ? this.max : Number.POSITIVE_INFINITY;
    return Math.max(t5, Math.min(a4, e8));
  }
  _emitResize(e8, t5) {
    const a4 = t5 ?? (() => {
      const r6 = e8.getBoundingClientRect();
      return { width: r6.width, height: r6.height };
    })();
    this._syncValueNow(a4), this.dispatchEvent(
      new CustomEvent("ae-resize", {
        bubbles: true,
        composed: true,
        detail: a4
      })
    );
  }
};
Se.styles = i`
    /*
     * Theme-overridable tokens (--ae-resizer-color, -color-hover,
     * -thickness, -radius, -border-perp, -dot-color) are NOT declared
     * at :host — :host declarations would shadow inherited root-level
     * theme overrides. Resolved at consumption point via
     * var(--token, default). Locked down by
     * src/theme-integration.test.ts.
     */
    :host {
      display: inline-flex;
      align-items: stretch;
      justify-content: stretch;
      user-select: none;
      touch-action: none;
    }
    :host([orientation='horizontal']) {
      cursor: ew-resize;
      width: var(--ae-resizer-thickness, 6px);
      align-self: stretch;
    }
    :host([orientation='vertical']) {
      cursor: ns-resize;
      height: var(--ae-resizer-thickness, 6px);
      align-self: stretch;
      width: 100%;
    }
    :host([orientation='both']) {
      cursor: nwse-resize;
      width: var(--ae-resizer-thickness, 6px);
      height: var(--ae-resizer-thickness, 6px);
    }
    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    .handle {
      position: relative;
      flex: 1 1 auto;
      background: var(--ae-resizer-color, var(--ae-color-border-strong));
      border-radius: var(--ae-resizer-radius, var(--ae-radius-full));
      transition: background-color var(--ae-duration-fast) var(--ae-easing-ease-out);
      box-sizing: border-box;
    }
    /* Borders perpendicular to the drag axis — horizontal splitter
     * (col-resize) gets left+right; vertical splitter (row-resize)
     * gets top+bottom. Default 0 solid transparent = invisible. */
    :host([orientation='horizontal']) .handle {
      border-left:  var(--ae-resizer-border-perp, 0 solid transparent);
      border-right: var(--ae-resizer-border-perp, 0 solid transparent);
    }
    :host([orientation='vertical']) .handle {
      border-top:    var(--ae-resizer-border-perp, 0 solid transparent);
      border-bottom: var(--ae-resizer-border-perp, 0 solid transparent);
    }

    :host(:hover) .handle,
    :host([data-dragging]) .handle {
      background: var(--ae-resizer-color-hover, var(--ae-color-accent));
    }
    :host(:focus-visible) {
      ${y3}
      border-radius: var(--ae-radius-sm);
    }

    /* Grip dots — 4 small dots stacked in the center of the handle.
     * Hidden by default (--ae-resizer-dot-color: transparent); themes
     * like Metro override to var(--ae-color-ink) to surface them as
     * the print-shop splitter grip. For a horizontal (col-resize)
     * splitter the dots stack vertically; for a vertical (row-resize)
     * splitter they stack horizontally. */
    .grip {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      pointer-events: none;
    }
    :host([orientation='horizontal']) .grip {
      flex-direction: column;
    }
    :host([orientation='vertical']) .grip {
      flex-direction: row;
    }
    :host([orientation='both']) .grip {
      /* Both: render as a 2x2 micro-grid */
      flex-wrap: wrap;
      width: 7px;
      margin: auto;
    }
    .dot {
      width: 2px;
      height: 2px;
      background: var(--ae-resizer-dot-color, transparent);
      border-radius: 50%;
      flex: 0 0 auto;
    }
  `;
mt([
  n4({ type: String, reflect: true })
], Se.prototype, "orientation", 2);
mt([
  n4({ attribute: "target" })
], Se.prototype, "target", 2);
mt([
  n4({ type: Number, reflect: true })
], Se.prototype, "min", 2);
mt([
  n4({ type: Number, reflect: true })
], Se.prototype, "max", 2);
mt([
  n4({ type: Boolean, reflect: true })
], Se.prototype, "disabled", 2);
mt([
  n4({ type: Boolean, reflect: true })
], Se.prototype, "controlled", 2);
Se = mt([
  t3("ae-resizer")
], Se);
var No = Object.defineProperty;
var Ro = Object.getOwnPropertyDescriptor;
var Qe = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Ro(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && No(t5, a4, i7), i7;
};
var ve = class extends i4 {
  constructor() {
    super(...arguments), this.orientation = "horizontal", this.size = 50, this.min = 10, this.max = 90, this.disabled = false, this.keyboardStep = 5, this._onResizerDelta = (e8) => {
      var o9;
      if (e8.stopPropagation(), this.disabled) return;
      const t5 = e8.detail, a4 = (o9 = this._hostBox) == null ? void 0 : o9.getBoundingClientRect();
      if (!a4) return;
      const r6 = this.orientation === "horizontal" ? a4.width : a4.height;
      if (r6 <= 0) return;
      const i7 = t5.primary / r6 * 100, s4 = this._clamp(this.size + i7);
      s4 !== this.size && (this.size = s4, this._emitResize());
    }, this._onResizerStep = (e8) => {
      if (e8.stopPropagation(), this.disabled) return;
      const { direction: t5, big: a4, edge: r6 } = e8.detail;
      let i7 = this.size;
      r6 === "home" ? i7 = this.min : r6 === "end" ? i7 = this.max : i7 = this.size + t5 * (a4 ? this.keyboardStep * 2 : this.keyboardStep), i7 = this._clamp(i7), i7 !== this.size && (this.size = i7, this._emitResize());
    };
  }
  render() {
    const e8 = this._clamp(this.size), a4 = `${this.orientation === "horizontal" ? "width" : "height"}: ${e8}%;`;
    return b2`
      <div class="host">
        <div class="pane start" part="pane-start" style=${a4}>
          <slot name="start"></slot>
        </div>
        <ae-resizer
          class="divider"
          part="divider"
          controlled
          orientation=${this.orientation}
          role="separator"
          aria-orientation=${this.orientation === "horizontal" ? "vertical" : "horizontal"}
          aria-valuenow=${Math.round(e8)}
          aria-valuemin=${Math.round(this.min)}
          aria-valuemax=${Math.round(this.max)}
          aria-disabled=${this.disabled ? "true" : "false"}
          ?disabled=${this.disabled}
          tabindex=${this.disabled ? -1 : 0}
          @ae-resize-delta=${this._onResizerDelta}
          @ae-resize-step=${this._onResizerStep}
        ></ae-resizer>
        <div class="pane end" part="pane-end">
          <slot name="end"></slot>
        </div>
      </div>
    `;
  }
  /** Clamp a percentage to the current min/max window. */
  _clamp(e8) {
    const t5 = Math.max(0, Math.min(this.min, 100)), a4 = Math.min(100, Math.max(this.max, 0));
    if (a4 < t5) return t5;
    const r6 = Math.min(a4, 100 - t5);
    return Math.max(t5, Math.min(r6, e8));
  }
  _emitResize() {
    this.dispatchEvent(
      new CustomEvent("ae-resize", {
        bubbles: true,
        composed: true,
        detail: { size: this._clamp(this.size) }
      })
    );
  }
};
ve.styles = i`
    :host {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }
    .host {
      display: flex;
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }

    :host([orientation='horizontal']) .host { flex-direction: row; }
    :host([orientation='vertical'])   .host { flex-direction: column; }

    .pane {
      overflow: auto;
      min-width: 0;
      min-height: 0;
    }
    .pane.start { flex: 0 0 auto; }
    .pane.end   { flex: 1 1 auto; }

    /* The divider is an ae-resizer; it must not grow or shrink. The resizer
       carries its own thickness / cursor / hover / focus / disabled visuals
       (and Metro's grip) via the --ae-resizer-* tokens. */
    .divider {
      flex: 0 0 auto;
    }
  `;
Qe([
  n4({ type: String, reflect: true })
], ve.prototype, "orientation", 2);
Qe([
  n4({ type: Number, reflect: true })
], ve.prototype, "size", 2);
Qe([
  n4({ type: Number, reflect: true })
], ve.prototype, "min", 2);
Qe([
  n4({ type: Number, reflect: true })
], ve.prototype, "max", 2);
Qe([
  n4({ type: Boolean, reflect: true })
], ve.prototype, "disabled", 2);
Qe([
  n4({ type: Number, reflect: true, attribute: "keyboard-step" })
], ve.prototype, "keyboardStep", 2);
Qe([
  e5(".host")
], ve.prototype, "_hostBox", 2);
ve = Qe([
  t3("ae-split-pane")
], ve);
var qo = Object.defineProperty;
var Vo = Object.getOwnPropertyDescriptor;
var et = (e8, t5, a4, r6) => {
  for (var i7 = r6 > 1 ? void 0 : r6 ? Vo(t5, a4) : t5, s4 = e8.length - 1, o9; s4 >= 0; s4--)
    (o9 = e8[s4]) && (i7 = (r6 ? o9(t5, a4, i7) : o9(i7)) || i7);
  return r6 && i7 && qo(t5, a4, i7), i7;
};
var be = class extends i4 {
  constructor() {
    super(...arguments), this.orientation = "vertical", this.maxHeight = null, this.maxWidth = null, this.shadow = false, this._atStart = true, this._atEnd = true, this._onScroll = () => {
      this.shadow && this._recompute();
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "region");
  }
  updated(e8) {
    e8.has("maxHeight") && (this.maxHeight ? this.style.maxHeight = this.maxHeight : this.style.removeProperty("max-height")), e8.has("maxWidth") && (this.maxWidth ? this.style.maxWidth = this.maxWidth : this.style.removeProperty("max-width")), e8.has("shadow") && this.shadow && queueMicrotask(() => this._recompute());
  }
  firstUpdated() {
    this._recompute();
  }
  render() {
    return b2`
      ${this.shadow ? b2`<div class="shadow start" ?data-visible=${!this._atStart}></div>` : A}
      <div
        class="viewport"
        part="viewport"
        tabindex="0"
        @scroll=${this._onScroll}
      >
        <slot></slot>
      </div>
      ${this.shadow ? b2`<div class="shadow end" ?data-visible=${!this._atEnd}></div>` : A}
    `;
  }
  /**
   * Recalculate the at-start / at-end flags based on current scroll
   * position. Allows for sub-pixel rounding by treating values < 1 as
   * "at edge".
   */
  _recompute() {
    const e8 = this._viewport;
    e8 && (this.orientation === "horizontal" ? (this._atStart = e8.scrollLeft <= 0.5, this._atEnd = e8.scrollLeft + e8.clientWidth >= e8.scrollWidth - 0.5) : (this._atStart = e8.scrollTop <= 0.5, this._atEnd = e8.scrollTop + e8.clientHeight >= e8.scrollHeight - 0.5));
  }
  scrollTo(...e8) {
    this._viewport && this._viewport.scrollTo.apply(
      this._viewport,
      e8
    );
  }
};
be.styles = i`
    :host {
      --ae-scroll-area-thumb: var(--ae-color-gray-300);
      --ae-scroll-area-thumb-hover: var(--ae-color-gray-400);
      --ae-scroll-area-track: transparent;
      --ae-scroll-area-size: 10px;
      --ae-scroll-area-shadow: oklch(0% 0 0 / 0.10);

      display: block;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 0;
      max-width: 100%;
    }
    :host(:focus-visible) {
      ${y3}
      border-radius: var(--ae-radius-sm);
    }

    .viewport {
      width: 100%;
      height: 100%;
      max-width: inherit;
      max-height: inherit;
      box-sizing: border-box;
      scrollbar-width: thin;
      scrollbar-color: var(--ae-scroll-area-thumb) var(--ae-scroll-area-track);
    }

    /* WebKit / Chromium scrollbar surface */
    .viewport::-webkit-scrollbar {
      width: var(--ae-scroll-area-size);
      height: var(--ae-scroll-area-size);
    }
    .viewport::-webkit-scrollbar-track {
      background: var(--ae-scroll-area-track);
      border-radius: var(--ae-radius-full);
    }
    .viewport::-webkit-scrollbar-thumb {
      background: var(--ae-scroll-area-thumb);
      border-radius: var(--ae-radius-full);
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: background-color var(--ae-duration-fast) var(--ae-easing-ease-out);
    }
    .viewport::-webkit-scrollbar-thumb:hover {
      background: var(--ae-scroll-area-thumb-hover);
      background-clip: padding-box;
    }
    .viewport::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* Orientation overflow control */
    :host([orientation='vertical']) .viewport {
      overflow-x: hidden;
      overflow-y: auto;
    }
    :host([orientation='horizontal']) .viewport {
      overflow-x: auto;
      overflow-y: hidden;
    }
    :host([orientation='both']) .viewport {
      overflow: auto;
    }

    /* Scroll shadows: pseudo-elements anchored on :host so we can fade
       them via opacity transitions without paint thrash. They sit above
       the content but are pointer-events: none. */
    .shadow {
      position: absolute;
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--ae-duration-fast) var(--ae-easing-ease-out);
      z-index: 1;
    }
    :host([shadow]) .shadow[data-visible] {
      opacity: 1;
    }
    /* Vertical edges */
    :host([orientation='vertical']) .shadow.start,
    :host([orientation='both'])     .shadow.start {
      top: 0;
      left: 0;
      right: 0;
      height: 12px;
      background: linear-gradient(to bottom, var(--ae-scroll-area-shadow), transparent);
    }
    :host([orientation='vertical']) .shadow.end,
    :host([orientation='both'])     .shadow.end {
      bottom: 0;
      left: 0;
      right: 0;
      height: 12px;
      background: linear-gradient(to top, var(--ae-scroll-area-shadow), transparent);
    }
    /* Horizontal edges */
    :host([orientation='horizontal']) .shadow.start {
      top: 0;
      bottom: 0;
      left: 0;
      width: 12px;
      background: linear-gradient(to right, var(--ae-scroll-area-shadow), transparent);
    }
    :host([orientation='horizontal']) .shadow.end {
      top: 0;
      bottom: 0;
      right: 0;
      width: 12px;
      background: linear-gradient(to left, var(--ae-scroll-area-shadow), transparent);
    }
  `;
et([
  n4({ type: String, reflect: true })
], be.prototype, "orientation", 2);
et([
  n4({ type: String, reflect: true, attribute: "max-height" })
], be.prototype, "maxHeight", 2);
et([
  n4({ type: String, reflect: true, attribute: "max-width" })
], be.prototype, "maxWidth", 2);
et([
  n4({ type: Boolean, reflect: true })
], be.prototype, "shadow", 2);
et([
  r5()
], be.prototype, "_atStart", 2);
et([
  r5()
], be.prototype, "_atEnd", 2);
et([
  e5(".viewport")
], be.prototype, "_viewport", 2);
be = et([
  t3("ae-scroll-area")
], be);
export {
  ca as AeAccordion,
  He as AeAccordionItem,
  lt as AeAlert,
  te as AeAvatar,
  Le as AeBadge,
  St as AeBanner,
  Ut as AeBreadcrumb,
  Ht as AeBreadcrumbItem,
  U as AeButton,
  Kt as AeCallout,
  xt as AeCard,
  K as AeCheckbox,
  ae as AeCodeBlock,
  T2 as AeCombobox,
  he as AeCommandPalette,
  Be as AeContextMenu,
  E2 as AeDatePicker,
  ce as AeDialog,
  re as AeDiffViewer,
  wt as AeDivider,
  de as AeDrawer,
  Ve as AeEmptyState,
  L2 as AeFileInput,
  ne as AeFormField,
  $a as AeGhostField,
  N2 as AeGrid,
  yt as AeIcon,
  x2 as AeInput,
  Ca as AeKbd,
  pe as AeLink,
  Re as AeList,
  Ne as AeListItem,
  we as AeMenu,
  Me as AeMenuItem,
  le as AeModal,
  _e as AeOption,
  Ke as AePageHeader,
  Fe as AePagination,
  q as AePopover,
  qt as AePortal,
  fe as AeProgress,
  $e as AeProgressCircle,
  ua as AeProse,
  ee as AeRadio,
  oe as AeRadioGroup,
  Se as AeResizer,
  be as AeScrollArea,
  Ue as AeSegmented,
  nt as AeSegmentedItem,
  O as AeSelect,
  qe as AeSkeleton,
  D2 as AeSlider,
  Vt as AeSpinner,
  ve as AeSplitPane,
  me as AeStack,
  ke as AeStep,
  it as AeStepper,
  R2 as AeSwitch,
  rt as AeTab,
  F as AeTable,
  xe as AeTabs,
  tt as AeTag,
  Ea as AeTbody,
  la as AeTd,
  S3 as AeTextarea,
  st as AeTh,
  Sa as AeThead,
  P2 as AeTimePicker,
  da as AeTimeline,
  ot as AeTimelineItem,
  at as AeToast,
  ye as AeTooltip,
  na as AeTr,
  ue as AeTree,
  z2 as AeTreeNode,
  B2 as AeVirtualScroller,
  ka as AeVisuallyHidden,
  $t as AeWizard,
  je as AeWizardStep,
  Go as DEFAULT_THEME_SELECTION,
  er as THEME_FAMILIES,
  Aa as THEME_REGISTRY,
  Qo as applyTheme,
  Zo as brandSupportsVariant,
  Wo as brandsByFamily,
  dr as getHighlighter,
  va as getThemeBrand,
  Xo as getThemeVariant,
  hr as highlight,
  an as listRegisteredIcons,
  en as registerIcons,
  Jo as resolveEffectiveVariant,
  vr as resolveSystemScheme,
  sn as setHighlighter,
  rn as toast,
  tn as unregisterIcon
};
//# sourceMappingURL=aegis.js.map
