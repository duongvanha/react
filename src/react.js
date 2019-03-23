const dom = Symbol('dom');

function render(vdom, parent) {
    const renderDom = parent ? (dom) => parent.appendChild(dom) : (dom) => dom;
    if (typeof vdom != 'object') {
        return renderDom(document.createTextNode(vdom))
    }

    if (typeof vdom.type === 'string') {
        const dom = renderDom(document.createElement(vdom.type));
        [].concat(...vdom.children).map(child => render(child, dom));
        return dom
    }

    const props = {children: vdom.children, ...vdom.props};

    if (typeof vdom.type === 'function' && vdom.type.prototype instanceof Component) {
        const component = new vdom.type(props);
        component[dom]  = render(component.render(), parent);
        return component[dom]
    }

    if (typeof vdom.type === 'function') {
        return render(new vdom.type(props), parent)
    }

    throw new Error(`Invalid VDOM: ${vdom}.`);
}

function update(vdom, dom, parent = dom.parentNode) {
    if (typeof vdom != 'object' && parent) {
        const newDom = document.createTextNode(vdom)
        parent.replaceChild(newDom, dom);
        return newDom
    }
}

class Component {
    constructor(props) {

    }


    setState(newState) {
        this.state = {...newState};
        this[dom]  = update(this.render(), this[dom])
    }
}


export default {
    createElement(type, props, ...children) {
        return {type, props, children};
    },
    render,
    Component,

}
