/* dc-lite: renderiza las plantillas del portafolio (holes {{ }}, sc-for, sc-if) con Preact. */
(function () {
  var h = preact.h, Fragment = preact.Fragment;
  var HOLE = /\{\{([^}]+)\}\}/g;
  var WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    var v = scope, parts = path.split('.');
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (m, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function attrVal(str, scope) {
    var m = str.match(WHOLE);
    if (m) return lookup(m[1], scope);
    return str.indexOf('{{') >= 0 ? interp(str, scope) : str;
  }
  function kids(node, scope) {
    var out = [];
    node.childNodes.forEach(function (c) {
      var r = conv(c, scope);
      if (Array.isArray(r)) { for (var i = 0; i < r.length; i++) out.push(r[i]); }
      else if (r != null) out.push(r);
    });
    return out;
  }
  function conv(node, scope) {
    if (node.nodeType === 3) { var t = node.nodeValue; return t.indexOf('{{') >= 0 ? interp(t, scope) : t; }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === 'sc-for') {
      var list = attrVal(node.getAttribute('list') || '', scope) || [];
      var as = node.getAttribute('as') || 'item', out = [];
      list.forEach(function (it, i) {
        var sc = Object.create(scope); sc[as] = it; sc.$index = i;
        var k = kids(node, sc); for (var j = 0; j < k.length; j++) out.push(k[j]);
      });
      return out;
    }
    if (tag === 'sc-if') return attrVal(node.getAttribute('value') || '', scope) ? kids(node, scope) : null;
    var props = {};
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a];
      if (at.name.indexOf('hint-') === 0) continue;
      var val = attrVal(at.value, scope);
      if (at.name === 'draggable') val = val === true || val === 'true';
      props[at.name] = val;
    }
    return h.apply(null, [tag, props].concat(kids(node, scope)));
  }

  var tpl = null;
  function template() {
    if (!tpl) tpl = document.getElementById('dc-tpl').content;
    return tpl;
  }

  window.DCLogic = class DCLogic extends preact.Component {
    render() { return h.apply(null, [Fragment, null].concat(kids(template(), this.renderVals()))); }
  };
  window.DC = {
    mount: function (Comp) { preact.render(h(Comp, {}), document.getElementById('app')); }
  };
})();
