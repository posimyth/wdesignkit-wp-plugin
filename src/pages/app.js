import React from 'react';

import './all_helpers'
import './all_renders'

import Wdesignkit_container from './redux/redux_container/wdesignkit_container';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        if (window.wdkit_editor != 'wdkit') {
            window.location.hash = '';
        }
    }

    render() {
        return (
            <Wdesignkit_container />
        );
    }
}

export default App; 