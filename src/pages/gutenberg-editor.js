import App from "./app";
import ReactDOM from 'react-dom'

import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';

// import rootReducer from '../src/widget-builder/redux-services/reducer/redux_index';
import rootReducer from '../widget-builder/redux-services/reducer/redux_index';
const store = createStore(rootReducer);

/* const {
    get_userinfo
} = wp.wkit_Helper */

const {
    __,
} = wp.i18n;

window.userData = []

window.wdkit_editor = wdkitData.use_editor;
var img_path = wdkitData.WDKIT_URL;


if (window.wdkit_editor === 'gutenberg') {
    wp.data.subscribe((function () {
        setTimeout((function () {
            ! function () {
                if (null === document.querySelector(".wkit-gutenber-btn")) {
                    let getCurrentPostType = wp.data.select("core/editor").getCurrentPostType();
                    if (null !== getCurrentPostType) {
                        getCurrentPostType = getCurrentPostType.toLowerCase().replace("/(?<= )[^s]|^./g", (function (e) {
                            return e.toUpperCase()
                        }));
                        var editorID = document.querySelector("#editor"),
                            edit_post_toolbar = document.querySelector(".edit-post-header-toolbar"),
                            createDiv = document.createElement("div");
                        createDiv.id = "wdkit-block-editor-icon", createDiv.innerHTML = '<button class="components-button is-primary wkit-gutenber-btn"><img class="wkit-main-logo" src="' + img_path + 'assets/images/jpg/Wdesignkit-logo.png" alt="wdesignkiy" draggable="false" /></button>';
                        if (!document.querySelector("#wkit-builder-modal")) {
                            document.body.insertAdjacentHTML('beforeend', '<div id="wkit-builder-modal" class="wkit-builder-modal"><div id="wkit-background-modal" class="wkit-background-modal"></div><div id="wkit-contentbox-modal" class="wkit-contentbox-modal wkit-gutenberg"></div></div>')

                            document.querySelector('#wkit-background-modal').addEventListener("click", function () {
                                document.querySelector('#wkit-builder-modal').classList.toggle("wkit-open");
                                if (!document.querySelector('.wkit-builder-modal wkit-open') && window.wdkit_editor != 'wdkit') {
                                    window.location.hash = '';
                                }
                            })
                        }

                        null === editorID.querySelector(".wkit-gutenber-btn") && (edit_post_toolbar.appendChild(createDiv),

                            document.querySelector('.wkit-gutenber-btn').addEventListener("click", function () {
                                //get_userinfo()

                                const rootElement = document.getElementById('wkit-contentbox-modal');
                                if (rootElement) {
                                    setTimeout(() => {
                                        ReactDOM.render(<Provider store={store}><App /></Provider>, rootElement);
                                    }, 500);
                                }

                                document.querySelector('.wkit-builder-modal').classList.toggle("wkit-open");
                            }))
                    }
                }
            }()
        }), 1)
    }))
}