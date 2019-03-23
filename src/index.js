const dom  = Symbol('dom');
const vdom = Symbol('vdom');

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

class Bar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };

        setInterval(() => {
            this.setState({count: this.state.count + 1})
        }, 1);

    }


    render() {
        return (this.state.count);
    }
}

const React = {
    createElement(type, props = {}, ...children) {
        return {type, props, children};
    },
    render,
};

const Foo = (props) => {
    return <div>{props.children}</div>
};

const Test = () => <div>
    <div>
        <div>
            <div>tada</div>
        </div>
        <Foo>foo</Foo>
        <Bar>bar</Bar>
    </div>
</div>;


React.render(<Bar> foo</Bar>, document.getElementById('root'));



