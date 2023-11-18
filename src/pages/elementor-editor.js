import App from "./app";
import ReactDOM from 'react-dom'

import {legacy_createStore as createStore } from 'redux';
import { Provider }  from 'react-redux';

import rootReducer from '../widget-builder/redux-services/reducer/redux_index';
const store = createStore(rootReducer);

const {
	__,
} = wp.i18n;

window.userData = []

window.wdkit_editor = wdkitData.use_editor;

window.WdkitPopupToggle =  {
    
    open(e, rootElement){
        if (window.wdkit_editor === 'elementor'){
            if(rootElement){
                setTimeout(() => {
                    ReactDOM.render(<Provider store={store}><App /></Provider>, rootElement);
                }, 500);
            }
        }
    },
    close(e){
        ReactDOM.unmountComponentAtNode(e)
    }
};