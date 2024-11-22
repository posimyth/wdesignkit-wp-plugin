import App from "./pages/app";
import { createRoot } from 'react-dom';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import '../src/style/main.scss';
import '../src/widget-builder/style/main.scss';
import rootReducer from '../src/widget-builder/redux-services/reducer/redux_index';

const store = createStore(rootReducer);
const rootElement = document.getElementById('wdesignkit-app');

if ( rootElement ) {
    const root = createRoot(rootElement);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}