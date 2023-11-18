import App from "./pages/app";
import ReactDOM from 'react-dom'
// import { render } from '@wordpress/element';
import {legacy_createStore as createStore } from 'redux';
import { Provider }  from 'react-redux';
/**
 * Import the stylesheet for the plugin.
 */
import '../src/style/main.scss';
import '../src/widget-builder/style/main.scss';

import rootReducer from '../src/widget-builder/redux-services/reducer/redux_index';
const store = createStore(rootReducer)

const rootElement = document.getElementById('wdesignkit-app');
if(rootElement){
    ReactDOM.render(<Provider store={store}><App /></Provider>, rootElement);
}