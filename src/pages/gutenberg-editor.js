import App from "./app";
import { createRoot } from 'react-dom';
import Section_Save_template from './save_template/save_template_section';

import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from '../widget-builder/redux-services/reducer/redux_index';
import domReady from '@wordpress/dom-ready';

const store = createStore(rootReducer);

window.userData = []

window.wdkit_editor = wdkitData.use_editor;

if (wdkitData.use_editor === 'gutenberg' && wdkitData.gutenberg_template === '1') {
    var img_path = wdkitData.WDKIT_URL;

    const { registerPlugin } = wp.plugins;

    const wpBlock = wp.blocks,
        blockData = (wpBlock.serialize, wpBlock.parse, wpBlock.getBlockAttributes, wp.compose.compose);

    const {
        withSelect
    } = wp.data;

    let pluginLogo = wdkitData?.wdkit_white_label?.plugin_logo || wdkitData.WDKIT_URL + 'assets/images/jpg/Wdesignkit-logo.png'

    registerPlugin('wdkit-save-template-section', {
        render: blockData([
            withSelect(function (e) {
                const {
                    getSelectedBlockCount,
                    getSelectedBlock,
                    getMultiSelectedBlocks,
                } = e("core/block-editor");
                return { count: getSelectedBlockCount(), block: getSelectedBlock(), blocks: getMultiSelectedBlocks() };
            }),
        ])(Section_Save_template),
    });

    let debounceTimeout;

    wp.data.subscribe(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            setTimeout((function () {
                ! function () {
                    var gutenberbtn = document.querySelectorAll(".wkit-gutenber-btn");

                    if (gutenberbtn.length > 0 || null === document.querySelector(".wkit-gutenber-btn")) {
                        let getCurrentPostType = wp.data.select("core/editor").getCurrentPostType();
                        if (null !== getCurrentPostType) {
                            getCurrentPostType = getCurrentPostType.toLowerCase().replace("/(?<= )[^s]|^./g", (function (e) {
                                return e.toUpperCase()
                            }));
                            var editorID = document.querySelector("#editor"),
                                edit_post_toolbar = document.querySelector(".edit-post-header-toolbar"),
                                createDiv = document.createElement("div");
                            if (edit_post_toolbar) {

                                createDiv.id = "wdkit-block-editor-icon", createDiv.innerHTML = '<button class="components-button is-primary wkit-gutenber-btn"><img class="wkit-main-logo" src="' + pluginLogo + '" draggable="false" /></button>';

                                if (!document.querySelector("#wkit-builder-modal")) {
                                    document.body.insertAdjacentHTML('beforeend', '<div id="wkit-builder-modal" class="wkit-builder-modal"><div id="wkit-background-modal" class="wkit-background-modal"></div><div id="wkit-contentbox-modal" class="wkit-contentbox-modal wkit-gutenberg"></div></div>')

                                    document.querySelector('#wkit-background-modal').addEventListener("click", function () {
                                        document.querySelector('#wkit-builder-modal').classList.toggle("wkit-open");
                                        if (!document.querySelector('.wkit-builder-modal wkit-open') && window.wdkit_editor != 'wdkit') {
                                            window.location.hash = '';
                                        }
                                    })
                                }

                                null === editorID.querySelector(".wkit-gutenber-btn") && (edit_post_toolbar?.appendChild(createDiv),

                                    document.querySelector('.wkit-gutenber-btn')?.addEventListener("click", function () {

                                        const rootElement = document.getElementById('wkit-contentbox-modal');
                                        const root = createRoot(rootElement);
                                        if (rootElement) {
                                            setTimeout(() => {
                                                root.render(<Provider store={store}><App /></Provider>);
                                            }, 500);
                                        }

                                        document.querySelector('.wkit-builder-modal').classList.toggle("wkit-open");
                                    }))
                            }
                        }
                    }
                }()
            }), 1)
        }, 300);
    });

    domReady(() => {
        const checkEditorReady = setInterval(() => {
            if (window.location.hash.includes('?wdesignkit=open')) {

                const editorID = document.querySelector('#editor');
                if (editorID && editorID.querySelector('.wkit-gutenber-btn')) {
                    editorID.querySelector('.wkit-gutenber-btn').click();

                    setTimeout(() => {
                        window.location.hash = window.location.hash.replaceAll('?wdesignkit=open', '');
                    }, 3000);

                    clearInterval(checkEditorReady);
                }
            }
        }, 100);
    });
}