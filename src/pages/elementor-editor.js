import App from "./app";
import { createRoot } from 'react-dom';

import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';

import rootReducer from '../widget-builder/redux-services/reducer/redux_index';

const store = createStore(rootReducer);

const {
    __,
} = wp.i18n;

window.userData = []

window.wdkit_editor = wdkitData.use_editor;

let rootInstance = null;

window.WdkitPopupToggle = {
    open(e, rootElement) {
        if ( 'elementor' === window.wdkit_editor ) {

            if (rootElement) {

                setTimeout(() => {
                    if ( ! rootInstance ) {
                        rootInstance = createRoot(rootElement); // Create a root if it doesn't exist
                    }
                    
                    rootInstance.render(<Provider store={store}><App /></Provider>);
                }, 500);
            }
        }
    },
    close(e) {
        if (rootInstance) {
            rootInstance.unmount();
            rootInstance = null;
        }
    }
};