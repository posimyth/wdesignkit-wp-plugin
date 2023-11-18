import { useState, useEffect, useRef } from "react";
import '../style/wb-editor.scss';
const { Fragment } = wp.element;

const Editor = (props) => {
    const [editor_type, seteditor_type] = useState("html");
    const [full_screen, setfull_screen] = useState(false);
    const [expand, setexpand] = useState(false);
    const [live_preview, setlive_preview] = useState(false);
    const [code_characters, setcode_characters] = useState(0);
    const [code_lines, setlines] = useState(0);

    const Drad_start = useRef();
    const removePopup = useRef(null);
    const expandEditor = useRef();
    const editorLivePreview = useRef();
    const editorFullScrren = useRef();

    var img_path = wdkitData.WDKIT_URL;

    let Ex_controllers = ['hidden', 'switcher', 'slider', 'dimension', 'normalhover', 'heading', 'rawhtml', 'divider', 'choose', 'color', 'background', 'border', 'boxshadow', 'Textshadow', 'cssfilter', 'typography']

    /** get unique string of 8 character  */
    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    /** set ace editor for builder */
    useEffect(() => {
        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html",
            value: `${props.Editor_code[0].html == "" || props.Editor_code[0].html == "undefined" ? "" : props.Editor_code[0].html}`
        });
        var editor_css = ace.edit("editor-css", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/css",
            value: `${props.Editor_code[0].css == "" || props.Editor_code[0].css == "undefined" ? "" : props.Editor_code[0].css}`
        });
        var editor_js = ace.edit("editor-js", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/javascript",
            value: `${props.Editor_code[0].js == "" || props.Editor_code[0].js == "undefined" ? "" : props.Editor_code[0].js}`
        });

        setTimeout(() => {
            var html = editor_html.getValue();
            var data = [];
            props.cardData[0].layout.map((section) => {
                section.inner_sec.map((compo) => {
                    var object = {};
                    object[compo.name] = compo.defaultValue
                    data.push(object);
                })
            })
            data.map((new_data) => {
                let object = Object.keys(new_data)
                html = html.replaceAll("{{" + object + "}}", new_data[object])
            })

            if (document.getElementById('preview')?.contentWindow) {
                var preview = document.getElementById('preview').contentWindow.document;
            }
            preview.open();
            preview.writeln(html + "<style>" + editor_css.getValue() + "</style>", "<script>" + editor_js.getValue() + "</script>");
            preview.close();
        }, 3000)

    }, [])

    /** remove empty fields from external css and js array */
    const Remove_empty = (type) => {
        let old_array = [...props.Editor_data];

        if (type == 'js') {
            var myArray = [...old_array[0].js];
            let new_Array = myArray.filter(element => element !== "");
            if (new_Array.length > 0) {
                old_array[0].js = new_Array;
            } else {
                old_array[0].js = [''];
            }
        } else if (type == 'css') {
            var myArray = [...old_array[0].css];
            let new_Array = myArray.filter(element => element !== "");
            if (new_Array.length > 0) {
                old_array[0].css = new_Array;
            } else {
                old_array[0].css = [''];
            }
        }

        props.addTolinkhandler(old_array)
    }

    /**
     * 
     * update redux for html, css and js code
     * set line number and character count for html code
     * set list of controller unique name in editor right side
     * set live preview for html and css editor
     * 
    */
    useEffect(() => {
        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html",
        });
        var editor_css = ace.edit("editor-css", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/css",
        });
        var editor_js = ace.edit("editor-js", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/javascript",
        });

        editor_html.session.on('change', (e) => { Change_code(e); });
        editor_css.session.on('change', (e) => { Change_code(e); });
        editor_js.session.on('change', (e) => { Change_code(e); });

        if (code_characters != editor_html.getValue().length) {
            setcode_characters(editor_html.getValue().length)
        }

        if (code_lines != editor_html.session.getLength()) {
            setlines(editor_html.session.getLength())
        }

        const Change_code = (e) => {

            let old_data = [...props.Editor_code]

            if (old_data && old_data[0].html != editor_html.getValue() ||
                old_data[0].css != editor_css.getValue() ||
                old_data[0].js != editor_js.getValue()) {

                old_data[0].html = editor_html.getValue();
                old_data[0].css = editor_css.getValue();
                old_data[0].js = editor_js.getValue();

                props.addToEditor_code(old_data);
                setTimeout(() => {

                    var html = editor_html.getValue();
                    var data = [];
                    props.cardData[0].layout.map((section) => {
                        section.inner_sec.map((compo) => {
                            var object = {};
                            object[compo.name] = compo.defaultValue
                            data.push(object);
                        })
                    })
                    data.map((new_data) => {
                        let object = Object.keys(new_data)
                        html = html.replaceAll("{{" + object + "}}", new_data[object])
                    })

                    if (document.getElementById('preview').contentWindow) {
                        var preview = document.getElementById('preview').contentWindow.document;
                    }
                    preview.open();
                    preview.writeln(html + "<style>" + editor_css.getValue() + "</style>");
                    preview.close();

                }, 3000)
            }

        }
        Change_code();

        /**css and js popup close on outside click */
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.wb-editor-popup') &&
                !e.target.closest('.wb-editor-js-popup') &&
                !Object.values(e.target.classList).includes('wb-editor-img-js-icon') &&
                !Object.values(e.target.classList).includes('wb-editor-img-css-icon')) {
                if (document.querySelector('.wb-editor-popup.wkit-wb-show')) {
                    Popup_show(e, "css")
                    Remove_empty('css')
                } else if (document.querySelector('.wb-editor-js-popup.wkit-wb-show')) {
                    Popup_show(e, "js")
                    Remove_empty('js')
                }
            }
        })

        /**for full screen validation for both editor and live preview */
        addEventListener('fullscreenchange', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (document.fullscreenElement) {
                if (document.fullscreenElement.id == "wkit-editor-id") {
                    setfull_screen(true)
                } else if (document.fullscreenElement.id == "wkit-livePreview-id") {
                    setlive_preview(true);
                }
            } else {
                setfull_screen(false);
                setlive_preview(false);
            }
        });

        if (ace && ace.edit) {

            ace.edit("editor-html", {
                theme: "ace/theme/cobalt",
                mode: "ace/mode/html",
            });

            ace.edit("editor-css", {
                theme: "ace/theme/cobalt",
                mode: "ace/mode/css",
            });

            ace.edit("editor-js", {
                theme: "ace/theme/cobalt",
                mode: "ace/mode/javascript",
            });
        }

        let editors = document.querySelectorAll('.wkit-wb-editor-class');
        editors.forEach((editor) => {
            editor.style.display = "none";
            if (editor.id == "editor-" + editor_type) {
                editor.style.display = "block";
            }
        })
    })

    /** manage fullscreen event of live-preview */
    const Live_preview_Full_screen = () => {

        if (editorLivePreview.current.requestFullscreen) {
            editorLivePreview.current.requestFullscreen();
        } else if (editorLivePreview.current.webkitRequestFullscreen) { /* Safari */
            editorLivePreview.current.webkitRequestFullscreen();
        } else if (editorLivePreview.current.msRequestFullscreen) { /* IE11 */
            editorLivePreview.current.msRequestFullscreen();
        }

        /* Close fullscreen */
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }

    }

    /** Add, Edit and Remove functionality of exter js and css link */
    const Add_Link_btn = (type) => {
        let css_val = "";
        let js_val = "";

        var old_array = [...props.Editor_data]
        if (type == "css") {
            old_array[0].css.push(css_val)
            props.addTolinkhandler(old_array)

        } else if (type == "js") {
            old_array[0].js.push(js_val)
            props.addTolinkhandler(old_array)
        }
    }
    const Edit_link = (e, type, id) => {
        let old_array = [...props.Editor_data]
        if (type == "css") {
            old_array[0].css[id] = e.target.value;
            props.addTolinkhandler(old_array)
        } else if (type == "js") {
            old_array[0].js[id] = e.target.value;
            props.addTolinkhandler(old_array)
        }
    }
    const Remove_link = (index, type) => {
        let old_array = [...props.Editor_data]

        if (type == "css") {
            if (old_array[0].css.length > 1) {
                old_array[0].css.splice(index, 1);
                props.addTolinkhandler(old_array);
            } else if (old_array[0].css.length == 1) {
                old_array[0].css[0] = "";
                props.addTolinkhandler(old_array);
            }
        } else if (type == "js") {
            if (old_array[0].js.length > 1) {
                old_array[0].js.splice(index, 1)
                props.addTolinkhandler(old_array)
            } else if (old_array[0].js.length == 1) {
                old_array[0].js[0] = "";
                props.addTolinkhandler(old_array);
            }
        }

    }

    /** manage fullscreen event of editor */
    const Full_screen = () => {

        if (editorFullScrren.current.requestFullscreen) {
            editorFullScrren.current.requestFullscreen();
        } else if (editorFullScrren.current.webkitRequestFullscreen) { /* Safari */
            editorFullScrren.current.webkitRequestFullscreen();
        } else if (editorFullScrren.current.msRequestFullscreen) { /* IE11 */
            editorFullScrren.current.msRequestFullscreen();
        }

        /* Close fullscreen */
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }

    }

    /** expand and collabs event of editor */
    const Expand = (e) => {

        let border = expandEditor.current.closest('.wkit-expand-icon-box-border');

        setexpand(!expand)
        let editor = document.querySelector('.wkit-wb-first-part');
        let second = document.querySelector('.wkit-wb-second');
        let icon = document.querySelector('.wkit-wb-editor-expand-icon');
        let elements = document.querySelector('.wkit-wb-third');

        if (document.querySelector('.wkit-wb-first-part.wb-expand-editor')) {
            icon.classList.remove("wb-rotate-icon")
            elements.classList.remove("wkit-wb-hide")
            editor.classList.remove("wb-expand-editor")
            second.classList.remove("wb-expand-second")
            border.classList.remove("wkit-wb-selected")
            second.style.width = '20%';
            editor.style.width = '55%';
        } else {
            icon.classList.add("wb-rotate-icon")
            elements.classList.add("wkit-wb-hide")
            editor.classList.add("wb-expand-editor")
            second.classList.add("wb-expand-second")
            border.classList.add("wkit-wb-selected")
            second.style.width = '20%';
            editor.style.width = '77%';
        }
    }

    /** open popup of css and js external link */
    const Popup_show = (e, type) => {

        let old_array = [...props.Editor_data];

        let js_popup = document.querySelector('.wb-editor-js-popup');
        let css_popup = document.querySelector('.wb-editor-popup');

        let js_icon = document.querySelector('.wb-editor-img-js-icon');
        let css_icon = document.querySelector('.wb-editor-img-css-icon');

        if (type == "css") {
            if (document.querySelector('.wb-editor-popup.wkit-wb-show')) {
                css_popup.classList.remove("wkit-wb-show")
                css_icon.style.transform = "";

                Remove_empty('css');
            }
            else {
                if (document.querySelector('.wb-editor-js-popup.wkit-wb-show')) {
                    js_popup.classList.remove("wkit-wb-show")
                    js_icon.style.transform = "";
                }
                css_popup.classList.add("wkit-wb-show")
                css_icon.style.transform = "rotate(45deg)";
            }
        } else if (type == "js") {
            if (document.querySelector('.wb-editor-js-popup.wkit-wb-show')) {
                js_popup.classList.remove("wkit-wb-show")
                js_icon.style.transform = "";

                Remove_empty('js');
            } else {
                if (document.querySelector('.wb-editor-popup.wkit-wb-show')) {
                    css_popup.classList.remove("wkit-wb-show")
                    css_icon.style.transform = "";
                }
                js_popup.classList.add("wkit-wb-show")
                js_icon.style.transform = "rotate(45deg)";
            }
        }
    }

    /** inline drag and drop event for external link of js and css */
    const Inline_drop = (index, type) => {
        let old_array = [...props.Editor_data];

        if (type == "js") {
            if (Drad_start.current < index) {
                old_array[0].js.splice(index + 1, 0, old_array[0].js[Drad_start.current])
                old_array[0].js.splice(Drad_start.current, 1)
                props.addTolinkhandler(old_array)
            } else if (Drad_start.current > index) {
                old_array[0].js.splice(index, 0, old_array[0].js[Drad_start.current])
                old_array[0].js.splice(Drad_start.current + 1, 1)
                props.addTolinkhandler(old_array)
            }
        } else if (type == "css") {
            if (Drad_start.current < index) {
                old_array[0].css.splice(index + 1, 0, old_array[0].css[Drad_start.current])
                old_array[0].css.splice(Drad_start.current, 1)
                props.addTolinkhandler(old_array)
            } else if (Drad_start.current > index) {
                old_array[0].css.splice(index, 0, old_array[0].css[Drad_start.current])
                old_array[0].css.splice(Drad_start.current + 1, 1)
                props.addTolinkhandler(old_array)
            }
        }
    }

    /** manage drop down open and close event of looping controller in editor right side panel */
    const Value_dropDown = (e) => {
        let event = e.target.closest('.wkit-wb-editor-value')
        if (Object.values(event.nextSibling.classList).includes('wb-show')) {
            event.nextSibling.classList.remove("wb-show")
            if (event.querySelector('.wb-editor-value-dropDown-icon')) {
                event.querySelector('.wb-editor-value-dropDown-icon').classList.add("wb-rotate-icon")
            }
        } else {
            event.nextSibling.classList.add("wb-show")
            if (event.querySelector('.wb-editor-value-dropDown-icon.wb-rotate-icon')) {
                event.querySelector('.wb-editor-value-dropDown-icon.wb-rotate-icon').classList.remove("wb-rotate-icon")
            }
        }
    }

    /** Add controller name in editor right panel */
    const AddName = (value, type, loop) => {
        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html",
        });
        var editor_css = ace.edit("editor-css", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/css",
        });
        var editor_js = ace.edit("editor-js", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/javascript",
        });

        const Get_loop_html = (data, name, loop_name, unique_id) => {
            const stringToHTML = function (str) {
                let parser = new DOMParser(),
                    doc = parser.parseFromString(str, 'text/html');
                return doc.body;
            };

            let repeater_html = stringToHTML(data);
            if (loop_name != undefined) {
                var controller_name = loop_name;
            } else {
                var controller_name = name;
            }

            let tag = repeater_html.querySelectorAll([`[data-${controller_name}]`]);
            let tag_loop = Object.values(tag);
            var count = 0;
            if (tag_loop.length > 0) {
                tag_loop.map((tag_html) => {
                    if (tag_html?.innerHTML) {
                        let html_data = tag_html?.innerHTML;
                        if ((html_data.search([unique_id])) > -1) {
                            count = count + 1;
                        } else {
                            // return false;
                        }
                    }
                })
                if (count > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        }

        if (editor_type == 'html') {
            var cursorPosition = editor_html.getCursorPosition();
            if (type == 'repeater' || type == 'gallery' || type == 'select2') {
                if (loop != undefined) {
                    let unique_id = keyUniqueID();
                    editor_html.session.insert(cursorPosition, unique_id);
                    if (editor_html.getValue().search([unique_id]) > -1) {
                        var range = editor_html.find(unique_id, {
                            wrap: true,
                            caseSensitive: true,
                            wholeWord: true,
                            regExp: false,
                            preventScroll: true // do not change selection
                        })
                        if (range != null) {
                            if (Get_loop_html(editor_html.getValue(), value, loop, unique_id)) {
                                editor_html.session.replace(range, `\n
    <div class="{loop-class-${type}}" data-${value}={${value}} >
        <!-- Enter Repeater code here -->
    </div>\n`);
                            } else {
                                editor_html.session.replace(range, '');
                                Loop_error();
                            }
                        }
                    }
                } else {
                    editor_html.session.insert(cursorPosition, `\n
    <div class="{loop-class-${type}}" data-${value}={${value}} >
        <!-- Enter Repeater code here -->
    </div>\n`);
                }
            } else if (loop != undefined) {
                let unique = keyUniqueID() + keyUniqueID();
                editor_html.session.insert(cursorPosition, unique);
                if (editor_html.getValue().search([unique]) > -1) {
                    var range = editor_html.find(unique, {
                        wrap: true,
                        caseSensitive: true,
                        wholeWord: true,
                        regExp: false,
                        preventScroll: true // do not change selection
                    })
                    if (range != null) {
                        if (Get_loop_html(editor_html.getValue(), loop, undefined, unique)) {
                            if (type && type == 'repeater_index') {
                                editor_html.session.replace(range, `{{${value}_index}}`);
                            } else if (type && type == 'repeater_UID') {
                                editor_html.session.replace(range, `{{${value}_UID}}`);
                            } else {
                                editor_html.session.replace(range, `{{${value}}}`);
                            }
                        } else {
                            editor_html.session.replace(range, '');
                            Loop_error();
                        }
                    }
                }
            } else {
                editor_html.session.insert(cursorPosition, `{{${value}}}`);
            }
        } else if (editor_type == 'js') {
            var cursorPosition = editor_js.getCursorPosition();
            if (props.widgetdata && props.widgetdata.type == "gutenberg") {
                editor_js.session.insert(cursorPosition, `$scope`);
            } else if (props.widgetdata && props.widgetdata.type == "elementor") {
                editor_js.session.insert(cursorPosition, `$scope[0]`);
            }
        } else if (editor_type == 'css') {
            var cursorPosition = editor_css.getCursorPosition();
            editor_css.session.insert(cursorPosition, `{{parent-class}}`);
        }
    }

    const htmlOff = (e, type) => {
        seteditor_type(type);
        if (document.querySelector(".wb-editor-popup-content.wkit-wb-js")) {
            let removepopp = document.querySelector(".wb-editor-popup-content.wkit-wb-js");
            removepopp.style.display = "none";
            if (document.querySelector('.wb-editor-js-popup.wkit-wb-show')) {
                let old_array = [...props.Editor_data];
                let js_popup = document.querySelector('.wb-editor-js-popup');
                let js_icon = document.querySelector('.wb-editor-img-js-icon');

                js_popup.classList.remove("wkit-wb-show")
                js_icon.style.transform = "";

                Remove_empty('js');
            }
        }
        if (document.querySelector(".wb-editor-popup-content.wkit-wb-css")) {
            let removepopp = document.querySelector(".wb-editor-popup-content.wkit-wb-css");
            removepopp.style.display = "none";

            if (document.querySelector('.wb-editor-popup.wkit-wb-show')) {
                let old_array = [...props.Editor_data];
                let css_popup = document.querySelector('.wb-editor-popup');
                let css_icon = document.querySelector('.wb-editor-img-css-icon');

                css_popup.classList.remove("wkit-wb-show")
                css_icon.style.transform = "";

                Remove_empty('css');

            }
        }
    }

    const cssPopupOff = (e, type) => {

        seteditor_type(type)
        if (document.querySelector(".wb-editor-popup-content.wkit-wb-js")) {
            let removepopp = document.querySelector(".wb-editor-popup-content.wkit-wb-js");
            removepopp.style.display = "none";
            let removepo = document.querySelector(".wb-editor-popup-content.wkit-wb-css");
            removepo.style.display = "flex";
        }

        if (document.querySelector('.wb-editor-js-popup.wkit-wb-show')) {
            let old_array = [...props.Editor_data];
            let js_popup = document.querySelector('.wb-editor-js-popup');
            let js_icon = document.querySelector('.wb-editor-img-js-icon');
            js_popup.classList.remove("wkit-wb-show")
            js_icon.style.transform = "";
            var jsArray = [];
            old_array[0].js.map((component, index) => {
                if (component == "") {
                    if (old_array[0].js.length > 1) {
                        jsArray.push(index);
                    }
                }
            })

            Remove_empty('js');

        }
    }

    const JsPopupOff = (e, type) => {
        seteditor_type(type)
        if (document.querySelector(".wb-editor-popup-content.wkit-wb-css")) {
            let removepopp = document.querySelector(".wb-editor-popup-content.wkit-wb-css");
            removepopp.style.display = "none";
            let removep = document.querySelector(".wb-editor-popup-content.wkit-wb-js");
            removep.style.display = "flex";
        }
        if (document.querySelector('.wb-editor-popup.wkit-wb-show')) {
            let old_array = [...props.Editor_data];
            let css_popup = document.querySelector('.wb-editor-popup');
            let css_icon = document.querySelector('.wb-editor-img-css-icon');
            css_popup.classList.remove("wkit-wb-show")
            css_icon.style.transform = "";

            Remove_empty('css');

        }
    }

    /** activate controller onclicl on controller in layout panel */
    const Active_controller = () => {
        if (props && props.controller && props.controller.controller && props.controller.controller != {}) {
            let ids = props.controller.controller;
            if (props?.cardData?.[0]?.[ids?.array_type]?.[ids?.sec_id]?.inner_sec?.[ids?.compo_id]?.fields?.[ids?.repeater]?.name) {
                return props.cardData[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].fields[ids.repeater].name;
            } else if (props?.cardData?.[0]?.[ids?.array_type]?.[ids?.sec_id]?.inner_sec?.[ids?.compo_id]?.name) {
                return props.cardData[0][ids.array_type][ids.sec_id].inner_sec[ids.compo_id].name;
            }
        }
    }

    /** change switcher event of css scop */
    const Change_css_switcher = (e) => {

        if (props && props.widgetdata) {
            let new_val = Object.assign({}, props.widgetdata, { "css_parent_node": e.target.checked })
            props.addTowidgethandler(new_val);
        }
    }

    /** count external links for css and js editor */
    const External_link_count = (type) => {
        if (type == "css") {
            let count = 0;
            if (props.Editor_data && props.Editor_data[0] && props.Editor_data[0].css) {
                props.Editor_data[0].css.map((link) => {
                    if (link.trim() != "") {
                        count = count + 1;
                    }
                })
            }
            return count;
        } else if (type == "js") {
            let count = 0;
            if (props.Editor_data && props.Editor_data[0] && props.Editor_data[0].js) {
                props.Editor_data[0].js.map((link) => {
                    if (link.trim() != "") {
                        count = count + 1;
                    }
                })
            }
            return count;
        }
    }

    /** prevent user to put repeater-controller name outsied repeater loop  */
    const Loop_error = () => {
        let error_box = document.querySelector(".wkit-wb-loopError-popup");
        if (error_box) {
            error_box.style.display = "flex";
            setTimeout(() => {
                error_box.style.display = "none";
            }, 2000);
        }
    }

    /** drop down structure for loop controller like (url, repeater, gallery, popover, select2) */
    const Controller_variable = (components, loop_validation) => {
        if (!Ex_controllers.includes(components.type)) {
            if (components.type == "repeater") {
                return (
                    <>
                        <div className="wkit-wb-editor-value" onClick={(e) => { Value_dropDown(e) }}>
                            <label>Select repeater</label>
                            <img className="wb-editor-value-dropDown-icon wb-rotate-icon" src={img_path + 'assets/images/wb-svg/uparrow_white.svg'} />
                        </div>
                        <div className="wb-controller-values">
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'repeater', loop_validation) }}>{"Loop"}</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'repeater_index', components.name) }}>{"Index"}</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'repeater_UID', components.name) }}>{"ID"}</div>
                            {
                                components.fields.map((controller, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {Controller_variable(controller, components.name)}
                                        </Fragment>
                                    );
                                })
                            }
                        </div>
                    </>
                );
            } else if (components.type == "url") {
                return (<>
                    <div className={Active_controller() == components.name ? "wkit-wb-editor-value wkit-wb-selected" : "wkit-wb-editor-value"} onClick={(e) => { Value_dropDown(e) }}>
                        <label>{components.name}</label>
                        <img className="wb-editor-value-dropDown-icon wb-rotate-icon" src={img_path + 'assets/images/wb-svg/uparrow_white.svg'} />
                    </div>
                    <div className="wb-controller-values">
                        <div className="wb-editor-dropDown-value" onClick={() => { AddName(`${components.name}-url`, "", loop_validation) }}>{"URL"}</div>
                        <div className="wb-editor-dropDown-value" onClick={() => { AddName(`${components.name}-is_external`, "", loop_validation) }}>{"Is_external"}</div>
                        <div className="wb-editor-dropDown-value" onClick={() => { AddName(`${components.name}-nofollow`, "", loop_validation) }}>{"Nofollow"}</div>
                    </div>
                </>
                );
            } else if (components.type == "gallery") {
                return (<>
                    <div className={Active_controller() == components.name ? "wkit-wb-editor-value wkit-wb-selected" : "wkit-wb-editor-value"} onClick={(e) => { Value_dropDown(e) }}>
                        <label>{components.name}</label>
                        <img className="wb-editor-value-dropDown-icon wb-rotate-icon" src={img_path + 'assets/images/wb-svg/uparrow_white.svg'} />
                    </div>
                    <div className="wb-controller-values">
                        <div className="wb-editor-dropDown-value" onClick={() => { AddName(components.name, 'gallery', loop_validation) }}>{"Loop"}</div>
                        <div className="wb-editor-dropDown-value" onClick={() => { AddName(components.name, 'loop_value', components.name) }}>{"URL"}</div>
                    </div>
                </>
                );
            } else if (components.type == "popover") {
                return (<>
                    <div className="wkit-wb-editor-value" onClick={(e) => { Value_dropDown(e) }}>
                        <label>Select popover</label>
                        <img className="wb-editor-value-dropDown-icon wb-rotate-icon" src={img_path + 'assets/images/wb-svg/uparrow_white.svg'} />
                    </div>
                    <div className="wb-controller-values">
                        {
                            components.fields.map((controller, index) => {
                                return (
                                    <Fragment key={index}>
                                        {Controller_variable(controller)}
                                    </Fragment>
                                );
                            })
                        }
                    </div>
                </>
                );
            } else if (components.type == "select2") {
                return (
                    <>
                        <div className={Active_controller() == components.name ? "wkit-wb-editor-value wkit-wb-selected" : "wkit-wb-editor-value"} onClick={(e) => { Value_dropDown(e) }}>
                            <label>{components.name}</label>
                            <img className="wb-editor-value-dropDown-icon wb-rotate-icon" src={img_path + 'assets/images/wb-svg/uparrow_white.svg'} />
                        </div>
                        <div className="wb-controller-values">
                            <div className="wb-editor-dropDown-value" onClick={() => { AddName(components.name, 'select2', loop_validation) }}>{"Loop"}</div>
                            <div className="wb-editor-dropDown-value" onClick={() => { AddName(components.name, 'loop_value', components.name) }}>{"Value"}</div>
                        </div>
                    </>
                );
            } else {
                return (
                    <div className={Active_controller() == components.name ? "wkit-wb-editor-value wkit-wb-selected" : "wkit-wb-editor-value"} onClick={() => { AddName(components.name, "", loop_validation) }}>{"{{" + components.name + "}}"}</div>
                );
            }
        }
    }

    const Editors_value = () => {
        return (
            <div className='wkit-wb-editor-value-tab'>
                {editor_type == 'css' &&
                    <div className="wkit-wb-parentClass-swicher-content">
                        <div className="wkit-wb-parentClass-swicher">
                            <label className="wb-switch">
                                <input type="checkbox" checked={props.widgetdata.css_parent_node} onChange={(e) => { Change_css_switcher(e) }} />
                                <span className="wb-slider"></span>
                            </label>
                        </div>
                        {props.widgetdata.css_parent_node == false &&
                            <div className="wkit-wb-editor-value" onClick={() => { AddName() }}>css</div>
                        }
                    </div>
                }
                {editor_type == 'js' &&
                    <>
                        <div className="wkit-wb-editor-value" onClick={() => { AddName() }}>$Scope</div>
                    </>
                }
                {props && props.cardData[0] && props.cardData[0].layout && editor_type == 'html' &&
                    props.cardData[0].layout.map((layouts, index) => {
                        return (
                            <Fragment key={index}>
                                <div className="wkit-wb-editor-box">
                                    {
                                        layouts?.inner_sec &&
                                        layouts?.inner_sec?.length > 0 &&
                                        layouts.inner_sec.map((components, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    {Controller_variable(components)}
                                                </Fragment>
                                            );
                                        })
                                    }
                                </div>
                            </Fragment>
                        );
                    })
                }
                <div className="wkit-wb-editor-value-extra"></div>
            </div>
        )
    }

    return (
        <>
            <div className="wkit-wb-editor" ref={editorFullScrren} id="wkit-editor-id">
                <div className="wkit-wb-editor-content">
                    <div className="wkit-wb-editor-btns">
                        <button className={editor_type == "html" ? "wkit-wb-editor-html-btn active-editor" : "wkit-wb-editor-html-btn"} onClick={(e) => { htmlOff(e, "html") }}>
                            <label className="wkit-wb-editor-btns-label">HTML</label>
                        </button>
                        <div className={editor_type == "css" ? "wkit-wb-editor-css-btn active-editor" : "wkit-wb-editor-css-btn"}
                            onClick={(e) => { cssPopupOff(e, "css") }} >
                            <label className="wkit-wb-editor-btns-label">CSS</label>
                            <img className={`wb-editor-img-css-icon ${editor_type == "css" ? 'wkit-wb-show' : ''}`} src={img_path + 'assets/images/wb-svg/editor-add-icon.svg'} onClick={(e) => { Popup_show(e, 'css') }} />
                            {
                                props.Editor_data[0].css.length > 0 && props.Editor_data[0].css[0] == ""
                                    ? ''
                                    : <label className={`wkit-wb-cssInputCount ${editor_type == "css" ? 'wkit-wb-focus' : ''}`}>
                                        <span>{External_link_count("css") == 0 ? "" : External_link_count("css")}</span>
                                    </label>
                            }
                            <div className="wb-editor-popup">
                                <div className="wb-editor-popup-content wkit-wb-css">
                                    <img className="popup-top-icon" src={img_path + 'assets/images/wb-svg/top-popup.svg'} />
                                    <label className="wb-editor-popup-lable">External CSS</label>
                                    {props && props.Editor_data[0] && props.Editor_data[0].css &&
                                        props.Editor_data[0].css.map((data, id) => {
                                            return (
                                                <Fragment key={id}>
                                                    <div draggable
                                                        onDragStart={(e) => { Drad_start.current = id }}
                                                        onDragOver={(event) => { event.preventDefault() }}
                                                        onDrop={() => { Inline_drop(id, "css") }}
                                                        className="wb-editor-popup-inp-content">
                                                        <img draggable={false} className="popup-drag-icon"
                                                            src={img_path + 'assets/images/wb-svg/popup-drag-con.svg'} />
                                                        <input type='url' ref={removePopup} value={data} className="wb-editor-popup-input" placeholder="Paste link here" onChange={(e) => { Edit_link(e, "css", id) }} />
                                                        <img className='popup-inp-remove-icon' src={img_path + 'assets/images/wb-svg/popup-remove.svg'} onClick={(e) => { Remove_link(id, "css") }} />
                                                    </div>
                                                </Fragment>
                                            );
                                        })
                                    }
                                    <div className="wb-popuo-btn-class">
                                        <button className="wb-editor-popup-add-btn" onClick={() => { Add_Link_btn("css") }}>
                                            <svg className="btn-add-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M6.75 0H5.25V5.25H0V6.75H5.25V12H6.75V6.75H12V5.25H6.75V0Z" fill="#808B93" />
                                            </svg>
                                            <label>Add</label>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={editor_type == "js" ? "wkit-wb-editor-js-btn active-editor" : "wkit-wb-editor-js-btn"}
                            onClick={(e) => { JsPopupOff(e, "js") }}>
                            <label className="wkit-wb-editor-btns-label">JS</label>
                            <img className={`wb-editor-img-js-icon ${editor_type == "js" ? 'wkit-wb-show' : ''}`} src={img_path + 'assets/images/wb-svg/editor-add-icon.svg'} onClick={(e) => { Popup_show(e, 'js') }} />
                            {
                                props.Editor_data[0].js.length > 0 && props.Editor_data[0].js[0] == ""
                                    ? ''
                                    : <label className={`wkit-wb-JsInputCount ${editor_type == "js" ? 'wkit-wb-focus' : ''}`}>
                                        <span>{External_link_count("js") == 0 ? "" : External_link_count("js")}</span>
                                    </label>
                            }
                            <div className="wb-editor-js-popup">
                                <div className="wb-editor-popup-content wkit-wb-js">
                                    <img className="popup-top-icon" src={img_path + 'assets/images/wb-svg/top-popup.svg'} />
                                    <label className="wb-editor-popup-lable">External JS</label>
                                    {props && props.Editor_data[0] && props.Editor_data[0].js &&
                                        props.Editor_data[0].js.map((data, id) => {
                                            return (
                                                <Fragment key={id}>
                                                    <div className="wb-editor-popup-inp-content">
                                                        <img
                                                            draggable
                                                            onDragStart={(e) => { Drad_start.current = id }}
                                                            onDragOver={(event) => { event.preventDefault() }}
                                                            onDrop={() => { Inline_drop(id, "js") }}
                                                            className="popup-drag-icon"
                                                            src={img_path + 'assets/images/wb-svg/popup-drag-con.svg'} />
                                                        <input type='url' value={data} className="wb-editor-popup-input" placeholder="Paste link here" onChange={(e) => { Edit_link(e, "js", id) }} />
                                                        <img className='popup-inp-remove-icon' src={img_path + 'assets/images/wb-svg/popup-remove.svg'} onClick={(e) => { Remove_link(id, "js") }} />
                                                    </div>
                                                </Fragment>
                                            );
                                        })
                                    }
                                    <div className="wb-popuo-btn-class">
                                        <button className="wb-editor-popup-add-btn" onClick={() => { Add_Link_btn("js") }}>
                                            <svg className="btn-add-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M6.75 0H5.25V5.25H0V6.75H5.25V12H6.75V6.75H12V5.25H6.75V0Z" fill="#808B93" />
                                            </svg>
                                            <label>Add</label>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="editor-html" className="wkit-wb-editor-class">
                    </div>
                    <div className="wkit-wb-loopError-popup" style={{ display: 'none' }}>
                        <div className="wkit-wb-loopError-close">&times;</div>
                        <div className="wkit-wb-loopError-content">
                            <div className="wkit-wb-loopError-header">
                                <div className="wkit-wb-loopError-icon">
                                    <img src={img_path + 'assets/images/wb-svg/error_info.svg'} />
                                </div>
                                <div className="wkit-wb-loopError-headerText">Perform activity inside the loop</div>
                            </div>
                            <div className="wkit-wb-loopError-description">You need to write or perform any of your activity inside the loop</div>
                        </div>
                    </div>
                    <div id="editor-css" className="wkit-wb-editor-class">
                    </div>
                    <div id="editor-js" className="wkit-wb-editor-class">
                    </div>
                    <div className="wkit-wb-bottom-characters">
                        <div className="wkit-wb-characters-title">{code_characters} Characters</div>
                        <div className="wkit-wb-characters-title">{code_lines} Line</div>
                    </div>
                </div>
                <div className="wkit-wb-editor-right-content">
                    <div className="wkit-wb-editor-top-ions">
                        <div className={full_screen == true ? "wkit-zoom-icon-box-border wkit-wb-selected" : "wkit-zoom-icon-box-border"} onClick={() => { Full_screen() }}>
                            <img className='wkit-wb-editor-zoom-icon' src={full_screen == true ? img_path + 'assets/images/wb-svg/Zoom-Out.svg' : img_path + 'assets/images/wb-svg/zoom-icon.svg'} />
                        </div>
                        <div className="wkit-expand-icon-box-border"
                            ref={expandEditor}
                            style={{ display: full_screen == false ? "flex" : "none" }}
                            onClick={(e) => { Expand(e) }}>
                            <img className='wkit-wb-editor-expand-icon' src={expand == true ? img_path + 'assets/images/wb-svg/arrow-selected.svg' : img_path + 'assets/images/wb-svg/arrow.svg'} />
                        </div>
                    </div>
                    {Editors_value()}
                </div>
            </div>
            <div className="wkit-wb-live-preview" ref={editorLivePreview} id="wkit-livePreview-id">
                <div className="wkit-wb-live-preview-header">
                    <div className="wkit-wb-live-preview-header-content">
                        <img className='wkit-wb-plus-icon wkit-screen-icon' src={img_path + 'assets/images/wb-svg/screen.svg'} />
                        <span className="wkit-live-text">Live Preview</span>
                    </div>
                    <div className={live_preview == true ? "wkit-zoom-icon-box-border wkit-wb-selected" : "wkit-zoom-icon-box-border"} onClick={() => { Live_preview_Full_screen() }}>
                        <img className='wkit-wb-editor-zoom-icon' src={live_preview == true ? img_path + 'assets/images/wb-svg/Zoom-Out.svg' : img_path + 'assets/images/wb-svg/zoom-icon.svg'} />
                    </div>
                </div>
                <iframe className="wkit-wb-live-preview-ifram" style={{ height: live_preview == true ? '100vh' : '' }} id='preview'></iframe>
            </div>
        </>
    );
}

export default Editor;