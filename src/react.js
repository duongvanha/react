const dom    = Symbol('dom');
const events = Symbol('events');

function render(vdom, parent) {
    const newDom = buildNewDom(vdom);
    parent && parent.appendChild(newDom);

    return dom
}

const nativeAttributes = new Set(['checked', 'value', 'className']);

function update(vdom, dom, parent = dom.parentNode) {
    const newDom = buildNewDom(vdom);
    parent.replaceChild(newDom, dom);
    return newDom
}

function buildNewDom(vdom) {
    if (typeof vdom != 'object') {
        return document.createTextNode(vdom)
    }

    if (typeof vdom.type === 'string') {
        const newDom = document.createElement(vdom.type);
        [].concat(...vdom.children).map(child => newDom.appendChild(buildNewDom(child)));
        for (const prop in vdom.props) {
            if (vdom.props.hasOwnProperty(prop)) {
                setAttribute(newDom, prop, vdom.props[prop])
            }
        }

        return newDom
    }

    if (typeof vdom.type !== 'function') {
        throw new Error(`Invalid VDOM: ${vdom}.`);
    }

    const props = {children: [].concat(...vdom.children), ...vdom.props};

    if (vdom.type.prototype instanceof Component) {
        const component = new vdom.type(props);
        component[dom]  = buildNewDom(component.render());
        return component[dom]
    }

    return buildNewDom(new vdom.type(props))
}

function setAttribute(dom, key, val) {
    if (nativeAttributes.has(key)) {
        return dom[key] = val;
    }

    if (key === 'style' && typeof val == 'object') {
        return Object.assign(dom.style, val)
    }

    if (typeof val == 'function' && key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();
        dom[events]     = dom[events] || {};
        dom.removeEventListener(eventType, dom[events][eventType]);
        dom[events][eventType] = val;
        return dom.addEventListener(eventType, dom[events][eventType]);
    }

    dom.setAttribute(key, val)
}

class Component {
    constructor(props) {
        this.props = props
    }


    setState(newState) {
        this.state = {...newState};
        this[dom]  = update(this.render(), this[dom])
    }

    render() {
        return null
    }
}

function createElement(type, props = {}, ...children) {
    return {type, props, children};
}

const React = {
    createElement,
    Component,
    render,
}

export { render, createElement, Component }

export default React
