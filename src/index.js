import React, { Component } from './react';

class Bar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };

        setInterval(() => {
            this.setState({count: this.state.count + 1})
        }, 100);

    }


    render() {
        return <Demo>{Date.now()}</Demo>;
    }
}

class Demo extends Component {

    render() {
        return <Foo>{this.props.children}</Foo>;
    }
}

const Foo = (props) => {
    return <div style={{
        color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
    }}>
        {props.children}
    </div>
};


React.render(<Bar>{Date.now()}</Bar>, document.getElementById('root'));



