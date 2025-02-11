import { useState, useEffect, useRef } from "react";
import '../style/wb-editor.scss';
import axios from "axios";
import { __ } from '@wordpress/i18n';
const { Fragment } = wp.element;

const Editor = (props) => {
    const [editor_type, seteditor_type] = useState("html");
    const [full_screen, setfull_screen] = useState(false);
    const [expand, setexpand] = useState(false);
    const [live_preview, setlive_preview] = useState(false);
    const [code_characters, setcode_characters] = useState(0);
    const [code_lines, setlines] = useState(0);
    const [OpenPopup, setOpenPopup] = useState(false);
    const [ActiveLink, setActiveLink] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [JSsearchValue, setJSsearchValue] = useState('');
    const [fResult, setFResult] = useState('');
    const [fResultJs, setFResultJs] = useState('');
    const [cdns, setCdns] = useState([]);
    const Drad_start = useRef();
    const removePopup = useRef(null);
    const expandEditor = useRef();
    const editorLivePreview = useRef();
    const editorFullScrren = useRef();

    var img_path = wdkitData.WDKIT_URL;

    let Ex_controllers = ['align', 'hidden', 'switcher', 'slider', 'dimension', 'heading', 'rawhtml', 'divider', 'choose', 'color', 'background', 'border', 'boxshadow', 'textshadow', 'cssfilter', 'typography', 'preview'];
    /** 
    * get unique string of 8 character
    * 
    * @since 1.0.0
    * */
    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    /** 
     * Ace editor for builder 
     * 
     * @since 1.0.0
     * @version 1.0.9
     * */
    useEffect(() => {
        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html",
            value: `${props.Editor_code[0].html == "" || props.Editor_code[0].html == undefined ? "" : props.Editor_code[0].html}`
        });

        var editor_css = ace.edit("editor-css", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/css",
            value: `${props.Editor_code[0].css == "" || props.Editor_code[0].css == undefined ? "" : props.Editor_code[0].css}`
        });

        var editor_js = ace.edit("editor-js", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/javascript",
            value: `${props.Editor_code[0].js == "" || props.Editor_code[0].js == undefined ? "" : props.Editor_code[0].js}`
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

            // if (document.getElementById('preview')?.contentWindow) {
            //     var preview = document.getElementById('preview').contentWindow.document;

            //         preview.open();
            //         preview.writeln(html + "<style>" + editor_css.getValue() + "</style>", "<script>" + editor_js.getValue() + "</script>");
            //         preview.close();
            // }
        }, 3000)

    }, [])

    useEffect(() => {
        const fetchCdns = async () => {
            let cdn_array = await axios('https://api.cdnjs.com/libraries')
                .then((res) => {
                    if (res?.data?.results?.length > 0) {
                        return res?.data?.results;
                    } else {
                        return [];
                    }
                })

            setCdns(cdn_array);

        };

        fetchCdns();
    }, []);

    useEffect(() => {
        if (searchValue) {
            let CssfilteredCdns = [];
            cdns.filter((link) => {
                if (searchValue.trim() && link.latest?.includes(searchValue.trim().replaceAll(' ', '-').toLowerCase()) || link.name?.includes(searchValue.trim().replaceAll(' ', '-').toLowerCase())) {
                    const CDNExtension = link?.latest?.split('.').pop();
                    if (ActiveLink == CDNExtension) {
                        CssfilteredCdns.push(link);
                    }
                }
            })

            setTimeout(() => {
                setFResult(CssfilteredCdns);
            }, 300);
        }

        if (JSsearchValue) {
            let CssfilteredCdns = [];
            cdns.filter((link) => {
                if (JSsearchValue.trim() && link.latest?.includes(JSsearchValue.trim().replaceAll(' ', '-').toLowerCase()) || link.name?.includes(JSsearchValue.trim().replaceAll(' ', '-').toLowerCase())) {
                    const CDNExtension = link?.latest?.split('.').pop();
                    if (ActiveLink == CDNExtension) {
                        CssfilteredCdns.push(link);
                    }
                }
            })

            setTimeout(() => {
                setFResultJs(CssfilteredCdns);
            }, 300);
        }
    }, [searchValue, JSsearchValue])

    /** remove empty fields from external css and js array */
    const Remove_empty = (type) => {
        let old_array = [...props.Editor_data];

        const arrayToUpdate = old_array[0].css;
        const new_Array = arrayToUpdate.filter(element => element !== "");
        if (new_Array.length > 0) {
            old_array[0].css = new_Array;
        } else {
            old_array[0].css = [''];
        }

        const arrayToFilter = old_array[0].js;
        const Updated_Array = arrayToFilter.filter(element => element !== "");
        if (Updated_Array.length > 0) {
            old_array[0].js = Updated_Array;
        } else {
            old_array[0].js = [''];
        }
        props.addTolinkhandler(old_array);
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

                    // if (document.getElementById('preview').contentWindow) {
                    //     var preview = document.getElementById('preview').contentWindow.document;
                    // }
                    // preview.open();
                    // preview.writeln(html + "<style>" + editor_css.getValue() + "</style>");
                    // preview.close();

                }, 3000)
            }

        }
        Change_code();

        /**For full screen validation for both editor and live preview */
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

    /** Add, Edit, Search and Remove functionality of external js and css link */
    const Add_Link_btn = (type, url) => {

        var old_array = [...props.Editor_data]
        if (type == "css") {
            old_array[0].css.push("")
            props.addTolinkhandler(old_array)

        } else if (type == "js") {
            old_array[0].js.push("")
            props.addTolinkhandler(old_array)
        } else if ('search_data' === type) {

            if (old_array[0][ActiveLink].length == 1 && old_array[0][ActiveLink][0] == '') {
                old_array[0][ActiveLink][0] = url;
            } else {
                old_array[0][ActiveLink].push(url);
            }

            if ('css' === ActiveLink) {
                setSearchValue('');
            } else {
                setJSsearchValue('')
            }
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

    /** Used to get version of cdn link in popup */
    const getVersion = (cdnUrl) => {

        if (cdnUrl) {
            let regex = /\/(\d+\.\d+(\.\d+)?)(\/|\/.*)$/;
            let match = cdnUrl.match(regex);
            return match ? match[1] : null;
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
        if (document.exitFullscreen && true === full_screen) {
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
            border.classList.remove("wkit-wb-selected-icon")
            second.style.width = '20%';
            editor.style.width = '60%';
        } else {
            icon.classList.add("wb-rotate-icon")
            elements.classList.add("wkit-wb-hide")
            editor.classList.add("wb-expand-editor")
            second.classList.add("wb-expand-second")
            border.classList.add("wkit-wb-selected-icon")
            second.style.width = '20%';
            editor.style.width = '80%';
        }
    }

    /** open popup of css and js external link */
    const Popup_show = (e, type) => {

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

    const Close_popup = (e, btn) => {
        if (e && e.target && Object.values(e.target.classList) && (Object.values(e.target.classList).includes('overlay') || Object.values(e.target.classList).includes('wkit-wb-close-popup-btn') || Object.values(e.target.classList).includes('wkit-wb-links-popup'))) {
            setOpenPopup("");
            setActiveLink('');
            Remove_empty();
            setSearchValue('');
            setJSsearchValue('');
        } else if (btn == "click") {
            setOpenPopup("");
            setActiveLink('');
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
            event.classList.remove("wb-show-drop-down");
        } else {
            event.nextSibling.classList.add("wb-show")
            event.classList.add("wb-show-drop-down");
        }
    }

    /** 
    * Widget Builder Click and Add controller name in editor right panel
    * 
    * @since 1.0.0
    * @version 1.0.9
    * */
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

        if ('html' === editor_type) {
            var cursorPosition = editor_html.getCursorPosition();
            if (type == 'repeater' || type == 'gallery' || type == 'select2' || type == 'cpt' || type == 'cpt_cat' || type == 'cpt_tag' || type == 'taxonomy') {
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
        <!-- Enter code here -->
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
        <!-- Enter code here -->
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
                            } else if (type && type == 'headingtags') {
                                editor_html.session.replace(range, `\n
    <${value} data-${value}>
        <!--Enter Heading text here-->
    </${value}>\n`);
                            } else if (type && (type == 'title' || type == 'description' || type == 'thumbnail' || type == 'cat_name' || type == 'tag_name' || type == 'cat_url' || type == 'tag_url' || type == 'post_link' || type == 'post_date' || type == 'auth_name' || type == 'auth_profile' || type == 'auth_url' || type == 'auth_id' || type == 'auth_email' || type == 'taxo_link' || type == 'taxo_slug' || type == 'taxo_image')) {
                                editor_html.session.replace(range, `{{${type}_${value}}}`);
                            } else {
                                editor_html.session.replace(range, `{{${value}}}`);
                            }
                        } else {
                            editor_html.session.replace(range, '');
                            Loop_error();
                        }
                    }
                }
            } else if (type == 'headingtags') {
                editor_html.session.insert(cursorPosition, `\n
    <${value} data-${value}>
        <!--Enter Heading text here-->
    </${value}>\n`);

            } else {
                editor_html.session.insert(cursorPosition, `{{${value}}}`);
            }
        } else if ('js' === editor_type && type == 'js') {
            var cursorPosition = editor_js.getCursorPosition();
            editor_js.session.insert(cursorPosition, value);
        } else if ('css' === editor_type) {
            var cursorPosition = editor_css.getCursorPosition();
            editor_css.session.insert(cursorPosition, `{{parent-class}}`);
        }
    }

    /** 
    * Widget Builder Editor Change tabs HTML Hidden  
    * 
    * @since 1.0.0
    */
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

    /** 
     * Widget Builder Editor Change tabs CSS Hidden
     * 
     * @since 1.0.0
     */
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

    /** 
     * Widget Builder Editor Change tabs Js Hidden
     * 
     * @since 1.0.0
     */
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

    /** 
     * activate controller onclicl on controller in layout panel 
     * 
     * @since 1.0.0
     */
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

    /** 
     * Change switcher event of css scop 
     * 
     * @since 1.0.0
     * */
    const Change_css_switcher = (e) => {

        if (props && props.widgetdata) {
            let new_val = Object.assign({}, props.widgetdata, { "css_parent_node": e.target.checked })
            props.addTowidgethandler(new_val);
        }
    }

    /** 
     * Count external links for css and js editor
     * 
     * @since 1.0.0
     * */
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

    /** 
     * prevent user to put repeater-controller name outsied repeater loop 
     * 
     * @since 1.0.0
     * */
    const Loop_error = () => {
        let error_box = document.querySelector(".wkit-wb-loopError-popup");
        if (error_box) {
            error_box.style.display = "flex";
            setTimeout(() => {
                error_box.style.display = "none";
            }, 2000);
        }
    }

    /** 
     * Drop down structure for loop controller like (url, repeater, gallery, popover, select2)
     * 
     * @since 1.0.0
     * */
    const Controller_variable = (components, loop_validation) => {
        if (!Ex_controllers.includes(components.type)) {
            if (components.type == "repeater") {
                return (
                    <>
                        <div className='wkit-wb-editor-value' onClick={(e) => { Value_dropDown(e) }}>
                            <span className="wkit-wb-hover-marquee">
                                <label>Select repeater</label>
                                <span>
                                    <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                    </svg>
                                </span>
                            </span>
                        </div>
                        <div className="wb-controller-values">
                            <div className="wkit-wb-editor-value wkit-wb-short-value" onClick={() => { AddName(components.name, 'repeater', loop_validation) }}>Loop</div>
                            <div className="wkit-wb-editor-value wkit-wb-short-value" onClick={() => { AddName(components.name, 'repeater_index', components.name) }}>Index</div>
                            <div className="wkit-wb-editor-value wkit-wb-short-value" onClick={() => { AddName(components.name, 'repeater_UID', components.name) }}>ID</div>
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
            } else if (components.type == "cpt" || components.type == "product_listing") {
                return (
                    <>
                        <div className="wkit-wb-editor-value" onClick={(e) => { Value_dropDown(e) }}>
                            <span className="wkit-wb-hover-marquee">
                                <label>Listing content</label>
                                <span>
                                    <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                    </svg>
                                </span>
                            </span>
                        </div>
                        <div className="wb-controller-values">
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'cpt', loop_validation) }}>Loop</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'title', components.name) }}>Title</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'description', components.name) }}>Description</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'thumbnail', components.name) }}>Thumbnail</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'post_date', components.name) }}>Post Date</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'post_link', components.name) }}>Post Link</div>
                            {components.type != "product_listing" &&
                                <Fragment>
                                    <hr className="wkit-wp-editor-hr" />
                                    <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'auth_id', components.name) }}>Author ID</div>
                                    <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'auth_name', components.name) }}>Author Name</div>
                                    {props?.widgetdata?.type != "gutenberg" &&
                                        <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'auth_email', components.name) }}>Author Email</div>
                                    }
                                    <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'auth_profile', components.name) }}>Author Profile</div>
                                    <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'auth_url', components.name) }}>Author URL</div>
                                </Fragment>

                            }
                            <div className="wkit-wb-editor-value wkit-inside-drp-head" onClick={(e) => { Value_dropDown(e) }}>
                                <span className="wkit-wb-hover-marquee">
                                    <label>Category</label>
                                    <span>
                                        <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                        </svg>
                                    </span>
                                </span>
                            </div>
                            <div className="wb-controller-values wkit-inside-drp-body">
                                <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name + '_cat', 'cpt_cat', components.name) }}>loop</div>
                                <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'cat_name', components.name) }}>name</div>
                                <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'cat_url', components.name) }}>URL</div>
                            </div>
                            <div className="wkit-wb-editor-value wkit-inside-drp-head" onClick={(e) => { Value_dropDown(e) }}>
                                <span className="wkit-wb-hover-marquee">
                                    <label>Tag</label>
                                    <span>
                                        <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                        </svg>
                                    </span>
                                </span>
                            </div>
                            <div className="wb-controller-values wkit-inside-drp-body">
                                <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name + '_tag', 'cpt_tag', components.name) }}>loop</div>
                                <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'tag_name', components.name) }}>name</div>
                                <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'tag_url', components.name) }}>URL</div>
                            </div>
                        </div>
                    </>
                );
            } else if (components.type == "taxonomy") {
                return (
                    <>
                        <div className="wkit-wb-editor-value" onClick={(e) => { Value_dropDown(e) }}>
                            <span className="wkit-wb-hover-marquee">
                                <label>Taxonomy</label>
                                <span>
                                    <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                    </svg>
                                </span>
                            </span>
                        </div>
                        <div className="wb-controller-values">
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'taxonomy', loop_validation) }}>Loop</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'title', components.name) }}>Name</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'description', components.name) }}>Description</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'taxo_image', components.name) }}>Image</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'taxo_slug', components.name) }}>Slug</div>
                            <div className="wkit-wb-editor-value" onClick={() => { AddName(components.name, 'taxo_link', components.name) }}>Link</div>
                        </div>
                    </>
                );
            } else if (components.type == "url") {
                return (<>
                    <div className={`wkit-wb-editor-value ${loop_validation ? "wkit-inside-drp-head" : ""}`} onClick={(e) => { Value_dropDown(e) }}>
                        <span className="wkit-wb-hover-marquee">
                            <label>{components.name}</label>
                            <span>
                                <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                </svg>
                            </span>
                        </span>
                    </div>
                    <div className={loop_validation ? 'wb-controller-values wkit-inside-drp-body' : 'wb-controller-values'}>
                        <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(`${components.name}-url`, "", loop_validation) }}>URL</div>
                        <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(`${components.name}-is_external`, "", loop_validation) }}>Is_external</div>
                        <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(`${components.name}-nofollow`, "", loop_validation) }}>Nofollow</div>
                        <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(`${components.name}-Custom_atr`, "", loop_validation) }}>Custom_atr</div>
                    </div>
                </>
                );
            } else if (components.type == "gallery") {
                return (<>
                    <div className={`wkit-wb-editor-value ${loop_validation ? "wkit-inside-drp-head" : ""}`} onClick={(e) => { Value_dropDown(e) }}>
                        <span className="wkit-wb-hover-marquee">
                            <label>{components.name}</label>
                            <span>
                                <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                </svg>
                            </span>
                        </span>
                    </div>
                    <div className={loop_validation ? 'wb-controller-values wkit-inside-drp-body' : 'wb-controller-values'}>
                        <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(components.name, 'gallery', loop_validation) }}>Loop</div>
                        <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(components.name, 'loop_value', components.name) }}>URL</div>
                    </div>
                </>
                );
            } else if (components.type == "popover") {
                return (<>
                    <div className="wkit-wb-editor-value" onClick={(e) => { Value_dropDown(e) }}>
                        <span className="wkit-wb-hover-marquee">
                            <label>Select popover</label>
                            <span>
                                <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                </svg>
                            </span>
                        </span>
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
            } else if (components.type == "normalhover") {
                return (<>
                    <div className="wkit-wb-editor-value" onClick={(e) => { Value_dropDown(e) }}>
                        <span className="wkit-wb-hover-marquee">
                            <label>Normal Hover</label>
                            <span>
                                <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                </svg>
                            </span>
                        </span>
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
            } else if (components.type == "headingtags") {
                return (
                    <>
                        <div className={Active_controller() == components.name ? "wkit-wb-editor-value wkit-wb-selected" : "wkit-wb-editor-value"} onClick={() => { AddName(components.name, "headingtags", loop_validation) }}>
                            <span className="wkit-wb-hover-marquee">
                                <label>{'< Htag >'}</label>
                            </span>
                        </div>
                    </>
                );
            } else if (components.type == "select2") {
                return (
                    <>
                        <div className={`wkit-wb-editor-value ${loop_validation ? "wkit-inside-drp-head" : ""}`} onClick={(e) => { Value_dropDown(e) }}>
                            <span className="wkit-wb-hover-marquee">
                                <label>{components.name}</label>
                                <span>
                                    <svg className="wb-editor-value-dropDown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.134 4.134 0.999999 8 0.999999C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM6.99382e-07 8C1.08564e-06 3.5817 3.5817 -1.08564e-06 8 -6.99382e-07C12.4183 -3.13124e-07 16 3.5817 16 8C16 12.4183 12.4183 16 8 16C3.5817 16 3.13124e-07 12.4183 6.99382e-07 8ZM5.3536 6.14645C5.1583 5.9512 4.8417 5.9512 4.6464 6.14645C4.4512 6.34171 4.4512 6.65829 4.6464 6.85355L7.69407 9.90117C7.88933 10.0964 8.20591 10.0964 8.40117 9.90117L11.4488 6.85355C11.6441 6.65829 11.6441 6.34171 11.4488 6.14645C11.2535 5.9512 10.937 5.9512 10.7417 6.14645L8.04762 8.84051L5.3536 6.14645Z" fill="white" />
                                    </svg>
                                </span>
                            </span>
                        </div>
                        <div className={loop_validation ? 'wb-controller-values wkit-inside-drp-body' : 'wb-controller-values'}>
                            <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(components.name, 'select2', loop_validation) }}>Loop</div>
                            <div className="wb-editor-dropDown-value wkit-wb-short-value" onClick={() => { AddName(components.name, 'loop_value', components.name) }}>Value</div>
                        </div>
                    </>
                );
            } else {
                return (
                    <div className={Active_controller() == components.name ? "wkit-wb-editor-value wkit-wb-selected" : "wkit-wb-editor-value"} onClick={() => { AddName(components.name, "", loop_validation) }}>
                        <span className="wkit-wb-hover-marquee">{"{{" + components.name + "}}"}</span>
                    </div>
                );
            }
        }
    }

    /** 
     * Editor Controller Names Panal Design and validation Manage
     * 
     * @since 1.0.0
     * */
    const Editors_value = () => {
        return (
            <>
                <div className='wkit-wb-editor-value-tab' style={editor_type == 'html' ? { overflow: 'auto' } : {}}>

                    {editor_type == 'js' &&
                        <>
                            <div className="wkit-wb-editor-value wkit-editor-js-val" onClick={() => { AddName('$scope[0]', 'js') }}>$Scope</div>
                            {/* <div className="wkit-wb-editor-value wkit-editor-js-val" onClick={() => { AddName('is_editable', 'js') }}>isEditable</div> */}
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
                    {editor_type == 'css' && props.widgetdata.css_parent_node == false &&
                        <div className="wkit-wb-editor-value wkit-editor-css-val" onClick={() => { AddName() }}>css</div>
                    }
                </div>
                {
                    editor_type == 'css' &&
                    <div className="wkit-wb-parentClass-swicher-content">
                        <div className="wkit-wb-parentClass-swicher">
                            <div className="wkit-css-editor-toolTip">
                                <svg className="wkit-wb-toolTip-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 12 12" fill="white">
                                    <path d="M6 0C2.68594 0 0 2.68594 0 6C0 9.31406 2.68594 12 6 12C9.31406 12 12 9.31406 12 6C12 2.68594 9.31406 0 6 0ZM6 11.25C3.10547 11.25 0.75 8.89453 0.75 6C0.75 3.10547 3.10547 0.75 6 0.75C8.89453 0.75 11.25 3.10547 11.25 6C11.25 8.89453 8.89453 11.25 6 11.25ZM6 4.3125C6.31055 4.3125 6.5625 4.06078 6.5625 3.75C6.5625 3.43945 6.31055 3.1875 6 3.1875C5.68945 3.1875 5.4375 3.43828 5.4375 3.75C5.4375 4.06172 5.68828 4.3125 6 4.3125ZM7.125 8.25H6.375V5.625C6.375 5.41875 6.20625 5.25 6 5.25H5.25C5.04375 5.25 4.875 5.41875 4.875 5.625C4.875 5.83125 5.04375 6 5.25 6H5.625V8.25H4.875C4.66875 8.25 4.5 8.41875 4.5 8.625C4.5 8.83125 4.66875 9 4.875 9H7.125C7.33209 9 7.5 8.83209 7.5 8.625C7.5 8.41875 7.33125 8.25 7.125 8.25Z" />
                                </svg>
                                <span className="wkit-css-toolTip-text">{__('Enable this if you want us to append unique class at all possible places in your CSS file. If Disabled, You will need to manage it manually from your end.', 'wdesignkit')}</span>
                            </div>
                            <label className="wb-switch">
                                <input type="checkbox" checked={props.widgetdata.css_parent_node} onChange={(e) => { Change_css_switcher(e) }} />
                                <span className="wb-slider"></span>
                            </label>
                        </div>
                    </div>
                }
            </>
        )
    }

    return (
        <>
            <div className="wkit-wb-editor" ref={editorFullScrren} id="wkit-editor-id">
                <div className="wkit-editor-button">
                    <div className="wkit-wb-editor-btns">
                        <button className={editor_type == "html" ? "wkit-wb-editor-html-btn active-editor" : "wkit-wb-editor-html-btn"} onClick={(e) => { htmlOff(e, "html") }}>
                            <span className="wkit-wb-editor-btns-label">{__('HTML', 'wdesignkit')}</span>
                        </button>
                        <div className={editor_type == "css" ? "wkit-wb-editor-css-btn active-editor" : "wkit-wb-editor-css-btn"}
                            onClick={(e) => { { cssPopupOff(e, "css") } { setActiveLink('css') } }} >
                            <span className="wkit-wb-editor-btns-label">{__('CSS', 'wdesignkit')}</span>
                            <svg
                                onClick={() => { setOpenPopup('css') }}
                                className={`wb-editor-img-css-icon ${editor_type == "css" ? 'wkit-wb-show' : ''}`} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="#fff">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9 16.7C13.2526 16.7 16.7 13.2526 16.7 9C16.7 4.74741 13.2526 1.3 9 1.3C4.74741 1.3 1.3 4.74741 1.3 9C1.3 13.2526 4.74741 16.7 9 16.7ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM9 4.5C9.27614 4.5 9.5 4.72386 9.5 5V8.5H13C13.2761 8.5 13.5 8.72386 13.5 9C13.5 9.27614 13.2761 9.5 13 9.5H9.5V13C9.5 13.2761 9.27614 13.5 9 13.5C8.72386 13.5 8.5 13.2761 8.5 13V9.5H5C4.72386 9.5 4.5 9.27614 4.5 9C4.5 8.72386 4.72386 8.5 5 8.5H8.5V5C8.5 4.72386 8.72386 4.5 9 4.5Z" />
                            </svg>
                            {
                                props.Editor_data[0].css.length > 0 && props.Editor_data[0].css[0] == ""
                                    ? ''
                                    : <label className={`wkit-wb-cssInputCount ${editor_type == "css" ? 'wkit-wb-focus' : ''}`}>
                                        <span>{External_link_count("css") == 0 ? "" : External_link_count("css")}</span>
                                    </label>
                            }
                        </div>
                        <div className={editor_type == "js" ? "wkit-wb-editor-js-btn active-editor" : "wkit-wb-editor-js-btn"}
                            onClick={(e) => { { JsPopupOff(e, "js") } { setActiveLink('js') } }}>
                            <span className="wkit-wb-editor-btns-label">{__('JAVASCRIPT', 'wdesignkit')}</span>
                            <svg
                                onClick={() => { setOpenPopup('js') }}
                                className={`wb-editor-img-js-icon ${editor_type == "js" ? 'wkit-wb-show' : ''}`} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="#fff">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9 16.7C13.2526 16.7 16.7 13.2526 16.7 9C16.7 4.74741 13.2526 1.3 9 1.3C4.74741 1.3 1.3 4.74741 1.3 9C1.3 13.2526 4.74741 16.7 9 16.7ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM9 4.5C9.27614 4.5 9.5 4.72386 9.5 5V8.5H13C13.2761 8.5 13.5 8.72386 13.5 9C13.5 9.27614 13.2761 9.5 13 9.5H9.5V13C9.5 13.2761 9.27614 13.5 9 13.5C8.72386 13.5 8.5 13.2761 8.5 13V9.5H5C4.72386 9.5 4.5 9.27614 4.5 9C4.5 8.72386 4.72386 8.5 5 8.5H8.5V5C8.5 4.72386 8.72386 4.5 9 4.5Z" />
                            </svg>
                            {
                                props.Editor_data[0].js.length > 0 && props.Editor_data[0].js[0] == ""
                                    ? ''
                                    : <label className={`wkit-wb-JsInputCount ${editor_type == "js" ? 'wkit-wb-focus' : ''}`}>
                                        <span>{External_link_count("js") == 0 ? "" : External_link_count("js")}</span>
                                    </label>
                            }
                        </div>
                    </div>
                    <div className="wkit-wb-icons">
                        <div className="wkit-wb-editor-top-ions">
                            {full_screen == false &&
                                <div className="wkit-wb-external-link-popup">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => { setActiveLink('css'); setOpenPopup('css'); }}>
                                        <path d="M7.69543 2.83398L6.54293 3.30273L7.2648 5.10023C6.35626 5.61003 5.60585 6.36044 5.09605 7.26898L3.2998 6.54586L2.83105 7.69711L4.60918 8.42023C4.45623 8.93391 4.37731 9.46678 4.3748 10.0027C4.37726 10.5383 4.45618 11.0707 4.60918 11.584L2.83105 12.3077L3.2998 13.4602L5.0973 12.7384C5.60888 13.6456 6.35886 14.3955 7.26605 14.9071L6.54293 16.7034L7.69418 17.1721L8.4173 15.394C8.9173 15.5415 9.45043 15.6284 9.99856 15.6284C10.5341 15.6259 11.0666 15.547 11.5798 15.394L12.3029 17.1715L13.4554 16.7027L12.7336 14.9052C13.6421 14.3954 14.3925 13.645 14.9023 12.7365L16.6986 13.4596L17.1673 12.3077L15.3892 11.5852C15.5422 11.072 15.6211 10.5395 15.6236 10.004C15.6211 9.46843 15.5422 8.93597 15.3892 8.42273L17.1667 7.69898L16.6979 6.54711L14.9004 7.26898C14.3906 6.36044 13.6402 5.61003 12.7317 5.10023L13.4548 3.30398L12.3029 2.83523L11.5804 4.61336C11.0676 4.45925 10.5353 4.37989 9.9998 4.37773C9.46425 4.38019 8.93179 4.45911 8.41856 4.61211L7.69355 2.83398H7.69543ZM9.9998 5.62773C12.4236 5.62773 14.3748 7.57898 14.3748 10.0027C14.3748 12.4265 12.4236 14.3777 9.9998 14.3777C7.57605 14.3777 5.6248 12.4265 5.6248 10.0027C5.6248 7.57898 7.57605 5.62773 9.9998 5.62773ZM9.9998 7.50273C8.62668 7.50273 7.4998 8.62961 7.4998 10.0027C7.4998 11.3759 8.62668 12.5027 9.9998 12.5027C11.3729 12.5027 12.4998 11.3759 12.4998 10.0027C12.4998 8.62961 11.3729 7.50273 9.9998 7.50273ZM9.9998 8.75273C10.6973 8.75273 11.2498 9.30523 11.2498 10.0027C11.2498 10.7002 10.6973 11.2527 9.9998 11.2527C9.3023 11.2527 8.7498 10.7002 8.7498 10.0027C8.7498 9.30523 9.3023 8.75273 9.9998 8.75273Z" />
                                    </svg>
                                </div>
                            }
                            <div className={full_screen == true ? "wkit-zoom-icon-box-border wkit-wb-selected-icon" : "wkit-zoom-icon-box-border"} onClick={() => { Full_screen() }}>
                                {/* <img className='wkit-wb-editor-zoom-icon' src={full_screen == true ? img_path + 'assets/images/wb-svg/Zoom-Out.svg' : img_path + 'assets/images/wb-svg/zoom-icon.svg'} /> */}
                                {full_screen == true ?
                                    <svg className="wkit-wb-editor-zoom-icon" width="36" height="36" viewBox="0 0 36 36" fill="#B2C8DF" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L13 11.5858L13 4C13 3.44772 13.4477 3 14 3C14.5523 3 15 3.44772 15 4L15 14C15 14.1367 14.9726 14.2669 14.923 14.3856C14.8753 14.4998 14.8055 14.607 14.7136 14.7005L14.7005 14.7136C14.6062 14.8063 14.498 14.8764 14.3828 14.9241C14.2649 14.973 14.1356 15 14 15H4C3.44772 15 3 14.5523 3 14C3 13.4477 3.44772 13 4 13L11.5858 13L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289ZM4 23C3.44772 23 3 22.5523 3 22C3 21.4477 3.44772 21 4 21L14 21C14.0345 21 14.0686 21.0017 14.1022 21.0052C14.2016 21.0153 14.2967 21.0399 14.3852 21.0769C14.4992 21.1244 14.6061 21.1939 14.6996 21.2854L14.7147 21.3006C14.8062 21.394 14.8757 21.501 14.9232 21.6149C14.9668 21.7194 14.9932 21.8328 14.9989 21.9517C14.9996 21.9677 15 21.9838 15 22V32C15 32.5523 14.5523 33 14 33C13.4477 33 13 32.5523 13 32L13 24.4142L4.70711 32.7071C4.31658 33.0976 3.68342 33.0976 3.29289 32.7071C2.90237 32.3166 2.90237 31.6834 3.29289 31.2929L11.5858 23L4 23ZM32 13L24.4142 13L32.7071 4.70711C33.0976 4.31658 33.0976 3.68342 32.7071 3.29289C32.3166 2.90237 31.6834 2.90237 31.2929 3.29289L23 11.5858V4C23 3.44772 22.5523 3 22 3C21.4477 3 21 3.44772 21 4V14C21 14.1367 21.0274 14.2669 21.077 14.3856C21.1255 14.5016 21.1967 14.6104 21.2908 14.705L21.2972 14.7114C21.4778 14.8898 21.7261 15 22 15L32 15C32.5523 15 33 14.5523 33 14C33 13.4477 32.5523 13 32 13ZM32 21L22 21C21.7239 21 21.4739 21.1119 21.2929 21.2929C21.1978 21.388 21.1258 21.4975 21.077 21.6144C21.0274 21.7331 21 21.8633 21 22V32C21 32.5523 21.4477 33 22 33C22.5523 33 23 32.5523 23 32V24.4142L31.2929 32.7071C31.6834 33.0976 32.3166 33.0976 32.7071 32.7071C33.0976 32.3166 33.0976 31.6834 32.7071 31.2929L24.4142 23L32 23C32.5523 23 33 22.5523 33 22C33 21.4477 32.5523 21 32 21Z" />
                                    </svg>
                                    :
                                    <svg className="wkit-wb-editor-zoom-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.3335 10.667V14.667H5.3335" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1.3335 5.3335L1.3335 1.3335L5.3335 1.3335" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14.667 10.667V14.667H10.667" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10.667 1.3335L14.667 1.3335L14.667 5.3335" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1.3335 1.3335L5.3335 5.3335" strokeWidth="1.06667" strokeLinecap="round" />
                                        <path d="M14.667 14.667L10.667 10.667" strokeWidth="1.06667" strokeLinecap="round" />
                                        <path d="M14.667 1.3335L10.667 5.3335" strokeWidth="1.06667" strokeLinecap="round" />
                                        <path d="M1.3335 14.667L5.3335 10.667" strokeWidth="1.06667" strokeLinecap="round" />
                                    </svg>
                                }
                            </div>
                            <div className="wkit-expand-icon-box-border"
                                ref={expandEditor}
                                style={{ display: full_screen == false ? "flex" : "none" }}
                                onClick={(e) => { Expand(e) }}>
                                {/* <img className='wkit-wb-editor-expand-icon' src={expand == true ? img_path + 'assets/images/wb-svg/arrow-selected.svg' : img_path + 'assets/images/wb-svg/arrow.svg'} /> */}
                                <svg className="wkit-wb-editor-expand-icon" width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.28951 12.7848C5.08123 12.9931 5.08123 13.3308 5.28951 13.539C5.49779 13.7473 5.83547 13.7473 6.04375 13.539L12.2052 7.37758C12.4135 7.1693 12.4135 6.83161 12.2052 6.62333L6.04375 0.461874C5.83547 0.253594 5.49779 0.253594 5.28951 0.461874C5.08123 0.670153 5.08123 1.00784 5.28951 1.21612L11.0738 7.00046L5.28951 12.7848ZM0.622528 12.7848C0.414228 12.9931 0.414228 13.3308 0.622528 13.539C0.830828 13.7473 1.16853 13.7473 1.37673 13.539L7.53822 7.37758C7.7465 7.1693 7.7465 6.83161 7.53822 6.62333L1.37673 0.461874C1.16853 0.253594 0.830828 0.253594 0.622528 0.461874C0.414228 0.670153 0.414228 1.00784 0.622528 1.21612L6.40685 7.00046L0.622528 12.7848Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="wkit-editor">
                    <div className="wkit-wb-editor-content">
                        <div id="editor-html" className="wkit-wb-editor-class">
                        </div>
                        <div className="wkit-wb-loopError-popup" style={{ display: 'none' }}>
                            <div className="wkit-wb-loopError-close">
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                            </div>
                            <div className="wkit-wb-loopError-content">
                                <div className="wkit-wb-loopError-header">
                                    <div className="wkit-wb-loopError-icon">
                                        <img src={img_path + 'assets/images/wb-svg/error_info.svg'} />
                                    </div>
                                    <div className="wkit-wb-loopError-headerText">{__('Perform activity inside the loop', 'wdesignkit')}</div>
                                </div>
                                <div className="wkit-wb-loopError-description">{__('You need to write or perform any of your activity inside the loop', 'wdesignkit')}</div>
                            </div>
                        </div>
                        <div id="editor-css" className="wkit-wb-editor-class">
                        </div>
                        <div id="editor-js" className="wkit-wb-editor-class">
                        </div>
                    </div>
                    <div className="wkit-right-portion">
                        {Editors_value()}
                    </div>
                </div>
                <div className="wkit-wb-editor-bottom-content">
                    <div className="wkit-wb-bottom-characters">
                        <div className="wkit-wb-characters-title">{code_characters} {__('Characters', 'wdesignkit')}</div>
                        <div className="wkit-wb-characters-title">{code_lines} {__('Line', 'wdesignkit')}</div>
                    </div>
                </div>
            </div>

            {OpenPopup == "css" || OpenPopup == "js" ?
                <div id="wkit-wb-popup-open" className="overlay" onClick={(e) => { { Close_popup(e) } }}>
                    <div className='wkit-wb-popup-links'>
                        <div className='wkit-wb-links-popup'>
                            <div className="wkit-links-main-popup">
                                <div className="wb-external-links">
                                    <div className="wkit-wb-links-content">
                                        <span
                                            onClick={() => { setActiveLink('css') }}
                                            className={ActiveLink == 'css' ? 'wkit-popup-link wkit-active-link' : 'wkit-popup-link'}
                                        >{__('CSS', 'wdesignkit')}</span>
                                        <span
                                            onClick={() => { setActiveLink('js') }}
                                            className={ActiveLink == 'js' ? 'wkit-popup-link wkit-active-link' : 'wkit-popup-link'}
                                        >{__('JS', 'wdesignkit')}</span>
                                    </div>
                                    {
                                        ActiveLink == 'css' &&
                                        <div className="wkit-wb-editor-links">
                                            <span className="wkit-Add-link">{__('Insert CSS Library', 'wdesignkit')}</span>
                                            <span className="wkit-link-desc">{__('Enter the URL of Your External CSS Library, Which You Want to Load in this Widget.', 'wdesignkit')}</span>
                                            <div className='wkit-links-search-bar'>
                                                <input className='wkit-links-search-input'
                                                    type='text'
                                                    placeholder='Search CDNs'
                                                    style={{ backgroundImage: `url(${img_path}assets/images/wb-svg/editor-search.svg)` }}
                                                    value={searchValue}
                                                    onChange={(e) => { setSearchValue(e.target.value); }}
                                                />
                                                {searchValue.trim() !== '' &&
                                                    <div className="wkit-cdn-suggestion">
                                                        {fResult.length > 0 ?
                                                            <ul className="wkit-custom-cdn-list">
                                                                {
                                                                    fResult?.map((data, index) => {
                                                                        return (
                                                                            <li onClick={(e) => { Add_Link_btn('search_data', data.latest) }} key={index}>{data.name} <span>{getVersion(data.latest)}</span></li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                            :
                                                            <div className="wkit-search-cdn-not-found">
                                                                <svg width="101" height="80" viewBox="0 0 101 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M78.7067 77.5144C77.7608 78.4913 74.6616 79.502 72.6921 79.502C70.7227 79.502 69.7432 78.4939 68.7973 77.517C67.8852 76.5763 67.0248 75.6875 65.2938 75.6875C63.5628 75.6875 62.6998 76.5763 61.7903 77.5144C60.8418 78.4913 59.8623 79.502 57.8955 79.502C55.9286 79.502 54.9465 78.4939 54.0006 77.517C53.0885 76.5763 52.2282 75.6875 50.4971 75.6875C48.7661 75.6875 47.9032 76.5763 46.9936 77.5144C46.0478 78.4913 45.0656 79.502 43.0988 79.502C41.1319 79.502 40.1524 78.4913 39.204 77.5144C38.2918 76.5763 37.4315 75.6875 35.7005 75.6875C33.9694 75.6875 33.1065 76.5763 32.1969 77.5144C31.2511 78.4913 30.269 79.502 28.3021 79.502C26.3353 79.502 23.236 78.4913 22.2902 77.5144C21.4143 76.6152 24.6224 39.3773 24.6224 39.3773C24.6224 25.0834 36.2084 13.5 50.4997 13.5C57.6467 13.5 64.1173 16.3971 68.7973 21.0797C73.4799 25.7623 76.377 32.2304 76.377 39.3799C76.377 39.3799 79.5851 76.6178 78.7093 77.517L78.7067 77.5144Z" fill="#878787" />
                                                                    <path d="M47.2806 39.4892C47.1201 39.4645 46.9781 39.6034 47.0028 39.7639C47.4782 42.684 49.3395 44.3199 51.5681 44.3199C53.7967 44.3199 55.658 42.684 56.1333 39.7639C56.158 39.6034 56.0161 39.4645 55.8555 39.4892C55.1024 39.6065 53.1794 39.875 51.5681 39.875C49.9568 39.875 48.0338 39.6065 47.2806 39.4892Z" fill="#FAFAFA" />
                                                                    <path d="M43.1145 35.229C44.8346 35.229 46.229 33.8346 46.229 32.1145C46.229 30.3944 44.8346 29 43.1145 29C41.3944 29 40 30.3944 40 32.1145C40 33.8346 41.3944 35.229 43.1145 35.229Z" fill="#FAFAFA" />
                                                                    <path d="M59.344 35.229C61.0641 35.229 62.4585 33.8346 62.4585 32.1145C62.4585 30.3944 61.0641 29 59.344 29C57.6239 29 56.2295 30.3944 56.2295 32.1145C56.2295 33.8346 57.6239 35.229 59.344 35.229Z" fill="#FAFAFA" />
                                                                    <path d="M74.2759 14.644H73.0558C72.9728 14.644 72.9027 14.5765 72.9027 14.4909C72.9027 14.4052 72.9702 14.3377 73.0558 14.3377H74.1227V14.2676C74.1227 14.1845 74.1902 14.1145 74.2759 14.1145C74.3616 14.1145 74.4291 14.182 74.4291 14.2676V14.4883C74.4291 14.5713 74.3616 14.6414 74.2759 14.6414V14.644ZM71.8383 14.644C71.7553 14.644 71.6852 14.5765 71.6852 14.4909V14.2261C71.6852 13.8782 71.7007 13.5537 71.7319 13.2578C71.7397 13.1747 71.8176 13.115 71.9006 13.1228C71.9837 13.1306 72.046 13.2059 72.0356 13.2915C72.0045 13.5771 71.9889 13.8912 71.9889 14.2287V14.4935C71.9889 14.5765 71.9214 14.6466 71.8357 14.6466L71.8383 14.644ZM74.3901 13.2137C74.3901 13.2137 74.3642 13.2137 74.3512 13.2085C74.2707 13.1877 74.2214 13.1046 74.2422 13.0216C74.2785 12.8814 74.3148 12.7931 74.3408 12.7438L74.3564 12.7152C74.4083 12.6036 74.5692 12.3622 75.0677 12.0273C75.1378 11.9806 75.2312 11.9988 75.2779 12.0689C75.3247 12.139 75.3065 12.2324 75.2364 12.2791C74.7717 12.5906 74.6549 12.7905 74.6316 12.845L74.616 12.8788C74.5978 12.9177 74.5692 12.9852 74.5381 13.0994C74.5199 13.1669 74.4576 13.2137 74.3901 13.2137ZM72.1421 12.2402C72.1239 12.2402 72.1083 12.2376 72.0901 12.2298C72.0123 12.2013 71.9707 12.113 71.9993 12.0351C72.046 11.9079 72.0979 11.7833 72.155 11.6691C72.2744 11.4173 72.4354 11.1707 72.6301 10.9396C72.6846 10.8747 72.7806 10.8669 72.8455 10.9215C72.9104 10.976 72.9182 11.072 72.8637 11.1369C72.6846 11.3498 72.5392 11.573 72.4302 11.8041C72.3757 11.9131 72.329 12.0247 72.2874 12.1415C72.2641 12.2038 72.2069 12.2428 72.1446 12.2428L72.1421 12.2402ZM76.1787 11.6483C76.1294 11.6483 76.0801 11.6224 76.0489 11.5782C76.0048 11.5081 76.023 11.4121 76.0957 11.368L76.1372 11.342C76.4747 11.1291 76.7862 10.9007 77.0639 10.6645C77.1262 10.6099 77.2249 10.6177 77.2794 10.68C77.3339 10.7449 77.3261 10.841 77.2638 10.8955C76.9757 11.1447 76.6512 11.3809 76.3033 11.599L76.2644 11.625C76.2384 11.6405 76.2099 11.6483 76.1813 11.6483H76.1787ZM73.6529 10.3789C73.6062 10.3789 73.5568 10.3555 73.5283 10.314C73.479 10.2465 73.4971 10.1505 73.5646 10.1011C73.6996 10.0051 73.845 9.90905 73.9981 9.81819L74.5926 9.43659C74.6627 9.39246 74.7587 9.41063 74.8029 9.48331C74.847 9.5534 74.8288 9.64945 74.7562 9.69358L74.1591 10.0778C74.0085 10.1686 73.8709 10.2595 73.7411 10.353C73.7152 10.3711 73.684 10.3815 73.6529 10.3815V10.3789ZM78.0089 10.057C77.9751 10.057 77.9414 10.0466 77.9128 10.0233C77.8479 9.97135 77.8349 9.8753 77.8894 9.8104C78.1387 9.49629 78.3515 9.15882 78.5203 8.81097C78.5566 8.73568 78.6475 8.70453 78.7227 8.74087C78.798 8.77722 78.8292 8.86807 78.7928 8.94336C78.6163 9.31198 78.3905 9.66762 78.1257 9.9999C78.0945 10.0388 78.0504 10.057 78.0063 10.057H78.0089ZM75.6621 9.00566C75.6206 9.00566 75.5791 8.98749 75.5479 8.95374C75.4908 8.89144 75.496 8.79539 75.5609 8.73828C75.8776 8.45532 76.1216 8.1516 76.2878 7.83749C76.3267 7.76221 76.4201 7.73365 76.4928 7.77259C76.5681 7.81153 76.5967 7.90498 76.5577 7.97767C76.3734 8.32552 76.1086 8.65521 75.7634 8.96412C75.7348 8.99008 75.6985 9.00306 75.6621 9.00306V9.00566ZM79.0498 7.87903C79.0498 7.87903 79.0291 7.87902 79.0187 7.87643C78.9356 7.85826 78.8837 7.77778 78.9019 7.69471C78.9771 7.34167 79.0161 6.97304 79.0161 6.60183V6.51616C79.0161 6.43309 79.0836 6.363 79.1666 6.363C79.2497 6.363 79.3172 6.43049 79.3198 6.51356V6.60183C79.3198 6.99381 79.2783 7.3832 79.1978 7.75702C79.1822 7.82711 79.1199 7.87643 79.0498 7.87643V7.87903ZM68.5856 7.49483C68.5856 7.49483 68.5804 7.49483 68.5778 7.49483L67.3603 7.43772C67.2773 7.43252 67.2124 7.36243 67.215 7.27936C67.2176 7.19889 67.2851 7.13399 67.3681 7.13399C67.3681 7.13399 67.3733 7.13399 67.3759 7.13399L68.5934 7.1911C68.6765 7.19629 68.7414 7.26638 68.7388 7.34945C68.7362 7.42993 68.6687 7.49483 68.5856 7.49483ZM66.1532 7.37801C66.1532 7.37801 66.148 7.37801 66.1454 7.37801C66.0624 7.37282 65.9975 7.30273 66.0001 7.21966C66.0208 6.79133 66.0676 6.37858 66.1429 5.98919C66.1584 5.90612 66.2389 5.8516 66.322 5.86718C66.405 5.88276 66.4596 5.96323 66.444 6.0463C66.3713 6.42011 66.3272 6.81988 66.3064 7.23523C66.3038 7.31571 66.2363 7.3806 66.1532 7.3806V7.37801ZM76.7265 6.89257C76.7265 6.89257 76.7239 6.89257 76.7213 6.89257C76.6382 6.88998 76.5707 6.81989 76.5733 6.73422C76.5733 6.68749 76.5733 6.64336 76.5759 6.59923C76.5759 6.21244 76.5266 5.88016 76.4279 5.58422C76.402 5.50375 76.4435 5.41808 76.524 5.39212C76.6019 5.36616 76.6901 5.4077 76.7161 5.48817C76.8277 5.81526 76.8796 6.17869 76.8796 6.59923C76.8796 6.64596 76.8796 6.69528 76.877 6.7446C76.8744 6.82767 76.8069 6.88997 76.7239 6.88997L76.7265 6.89257ZM68.7621 6.29291C68.7621 6.29291 68.7362 6.29291 68.7232 6.28772C68.6427 6.26695 68.5934 6.18388 68.6142 6.10081C68.731 5.6647 68.9023 5.27531 69.1282 4.94562C69.1749 4.87553 69.2709 4.85736 69.341 4.90668C69.4111 4.95341 69.4267 5.04946 69.38 5.11955C69.1749 5.42068 69.014 5.77632 68.9075 6.17869C68.8893 6.24619 68.827 6.29291 68.7596 6.29291H68.7621ZM79.0317 5.45702C78.9616 5.45702 78.8993 5.4077 78.8837 5.33761C78.798 4.94562 78.6656 4.57181 78.4943 4.22395C78.4579 4.14867 78.4891 4.05781 78.5644 4.01887C78.6397 3.98253 78.7305 4.01368 78.7695 4.08896C78.9512 4.45759 79.0914 4.85477 79.1822 5.27011C79.2004 5.35318 79.1485 5.43366 79.0654 5.45183C79.055 5.45183 79.042 5.45442 79.0317 5.45442V5.45702ZM66.6257 4.99754C66.6075 4.99754 66.5894 4.99495 66.5712 4.98716C66.4933 4.95601 66.4544 4.86774 66.4829 4.78987C66.6361 4.39269 66.8256 4.01888 67.0488 3.67621C67.0956 3.60612 67.189 3.58536 67.2591 3.63208C67.3292 3.67881 67.35 3.77226 67.3032 3.84235C67.093 4.16684 66.9112 4.51989 66.7685 4.89889C66.7451 4.9586 66.688 4.99754 66.6257 4.99754ZM75.9087 4.68862C75.8724 4.68862 75.8361 4.67565 75.8075 4.64969C75.7712 4.61854 75.7348 4.58738 75.6985 4.55623C75.4467 4.35635 75.1481 4.1902 74.8107 4.063C74.7328 4.03445 74.6913 3.94619 74.7224 3.86571C74.751 3.78784 74.8392 3.7463 74.9197 3.77745C75.2857 3.91504 75.6128 4.09675 75.8906 4.31741C75.9321 4.35116 75.9736 4.3849 76.0126 4.42124C76.0749 4.47576 76.0801 4.5744 76.0256 4.63671C75.9944 4.67045 75.9529 4.68862 75.9113 4.68862H75.9087ZM70.1302 4.34856C70.0783 4.34856 70.029 4.3226 70.0004 4.27587C69.9563 4.20319 69.9796 4.10973 70.0497 4.0656C70.3846 3.85793 70.7766 3.70217 71.2205 3.59574C71.301 3.57757 71.384 3.62689 71.4048 3.70996C71.4256 3.79303 71.3737 3.8735 71.2906 3.89427C70.8778 3.99032 70.5144 4.13569 70.2081 4.3252C70.1821 4.34077 70.1562 4.34856 70.1276 4.34856H70.1302ZM73.6814 3.79562C73.6814 3.79562 73.6685 3.79562 73.6633 3.79562C73.2946 3.75149 72.8741 3.73592 72.4717 3.7489C72.3887 3.75149 72.316 3.68659 72.3134 3.60093C72.3108 3.51786 72.3757 3.44517 72.4613 3.44258C72.8767 3.427 73.3154 3.44517 73.7022 3.4919C73.7853 3.50228 73.845 3.57757 73.8346 3.66064C73.8242 3.73852 73.7593 3.79562 73.684 3.79562H73.6814ZM77.9595 3.2998C77.918 3.2998 77.8739 3.28163 77.8453 3.24788C77.6584 3.03242 77.4481 2.83253 77.2171 2.64822C77.1366 2.58332 77.051 2.52102 76.9653 2.46131C76.8978 2.41199 76.8796 2.31854 76.9289 2.24845C76.9783 2.18096 77.0717 2.16278 77.1418 2.21211C77.2327 2.27441 77.3209 2.3419 77.4066 2.4094C77.6506 2.60409 77.8765 2.81696 78.0738 3.0454C78.1283 3.1077 78.1231 3.20375 78.0582 3.26086C78.0296 3.28682 77.9933 3.2972 77.9569 3.2972L77.9595 3.2998ZM67.9522 2.97531C67.9133 2.97531 67.8717 2.95973 67.8432 2.92858C67.7861 2.86888 67.7861 2.77283 67.8484 2.71312L67.9159 2.64822C68.1962 2.38603 68.5077 2.1524 68.84 1.95251C68.9127 1.90838 69.0062 1.93175 69.0477 2.00443C69.0918 2.07712 69.0685 2.17057 68.9958 2.2147C68.6817 2.4042 68.3883 2.62486 68.1235 2.87147L68.0587 2.93378C68.0301 2.96233 67.9912 2.97531 67.9522 2.97531ZM75.9918 1.898C75.9711 1.898 75.9503 1.8928 75.9321 1.88502C75.5817 1.73445 75.2001 1.61245 74.8003 1.51899C74.7172 1.50082 74.6679 1.41775 74.6861 1.33728C74.7042 1.25421 74.7873 1.20489 74.8678 1.22306C75.2857 1.31911 75.6829 1.4489 76.0515 1.60466C76.1294 1.6384 76.1657 1.72667 76.132 1.80454C76.1086 1.86165 76.0515 1.898 75.9918 1.898ZM70.0212 1.72148C69.9589 1.72148 69.8992 1.68254 69.8784 1.62023C69.8498 1.53976 69.894 1.45409 69.9719 1.42554C70.3483 1.29574 70.7532 1.19191 71.1764 1.12182C71.262 1.10884 71.3373 1.16335 71.3529 1.24642C71.3685 1.32949 71.3114 1.40737 71.2283 1.42294C70.8207 1.49044 70.4339 1.58908 70.0731 1.71369C70.0575 1.71888 70.0393 1.72148 70.0238 1.72148H70.0212ZM73.6321 1.33987C73.6321 1.33987 73.6243 1.33987 73.6191 1.33987C73.2349 1.30872 72.8196 1.29834 72.4198 1.30872C72.3264 1.30872 72.2667 1.24642 72.2615 1.16075C72.2615 1.07768 72.3238 1.00759 72.4094 1.005C72.8222 0.992016 73.2505 1.005 73.6451 1.03615C73.7282 1.04394 73.7905 1.11662 73.7853 1.19969C73.7775 1.28016 73.7126 1.33987 73.6347 1.33987H73.6321ZM74.3226 19H73.4089C73.3258 19 73.2557 18.9325 73.2557 18.8468C73.2557 18.7612 73.3232 18.6937 73.4089 18.6937H74.2837C74.3745 18.6677 74.4758 18.7352 74.4758 18.8339V18.8442C74.4758 18.9273 74.4083 18.9974 74.3226 18.9974V19ZM72.4951 19H71.8072C71.7241 19 71.654 18.9325 71.654 18.8468V18.6184C71.654 18.5353 71.7215 18.4652 71.8072 18.4652C71.8928 18.4652 71.9603 18.5327 71.9603 18.6184V18.6937H72.4951C72.5782 18.6937 72.6483 18.7612 72.6483 18.8468C72.6483 18.9325 72.5808 19 72.4951 19ZM74.3226 18.0733C74.2396 18.0733 74.1695 18.0058 74.1695 17.9201V17.0063C74.1695 16.9233 74.237 16.8532 74.3226 16.8532C74.4083 16.8532 74.4758 16.9207 74.4758 17.0063V17.9201C74.4758 18.0032 74.4083 18.0733 74.3226 18.0733ZM71.8072 17.8578C71.7241 17.8578 71.654 17.7903 71.654 17.7046V16.7909C71.654 16.7078 71.7215 16.6377 71.8072 16.6377C71.8928 16.6377 71.9603 16.7052 71.9603 16.7909V17.7046C71.9603 17.7877 71.8928 17.8578 71.8072 17.8578ZM73.6295 16.9388H72.7157C72.6327 16.9388 72.5626 16.8713 72.5626 16.7857C72.5626 16.7 72.6301 16.6325 72.7157 16.6325H73.6295C73.7126 16.6325 73.7827 16.7 73.7827 16.7857C73.7827 16.8713 73.7152 16.9388 73.6295 16.9388Z" fill="#7D8395" />
                                                                </svg>
                                                                <p className="wkit-cdn-not-found">{__('Not Result Found', 'wdesignkit')}</p>
                                                                <p className="wkit-cdn-not-found-desc">{__('Sorry, the cdn you are looking for doesn\'t exist.', 'wdesignkit')}</p>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                            <div className="wkit-wb-links-loop">
                                                {props && props.Editor_data[0] && props.Editor_data[0].css &&
                                                    props.Editor_data[0].css.map((data, id) => {
                                                        return (
                                                            <Fragment key={id}>
                                                                <div draggable
                                                                    onDragStart={(e) => { Drad_start.current = id }}
                                                                    onDragOver={(event) => { event.preventDefault() }}
                                                                    onDrop={() => { Inline_drop(id, "css") }}
                                                                    className="wb-editor-popup-inp-content">

                                                                    <svg className="popup-drag-icon" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M2.66667 1.66732C2.66667 2.4037 2.06971 3.00065 1.33333 3.00065C0.596954 3.00065 0 2.4037 0 1.66732C0 0.930938 0.596954 0.333984 1.33333 0.333984C2.06971 0.333984 2.66667 0.930938 2.66667 1.66732Z" fill="#878787" />
                                                                        <path d="M2.66667 7.00065C2.66667 7.73703 2.06971 8.33398 1.33333 8.33398C0.596954 8.33398 0 7.73703 0 7.00065C0 6.26427 0.596954 5.66732 1.33333 5.66732C2.06971 5.66732 2.66667 6.26427 2.66667 7.00065Z" fill="#878787" />
                                                                        <path d="M2.66667 12.334C2.66667 13.0704 2.06971 13.6673 1.33333 13.6673C0.596954 13.6673 0 13.0704 0 12.334C0 11.5976 0.596954 11.0007 1.33333 11.0007C2.06971 11.0007 2.66667 11.5976 2.66667 12.334Z" fill="#878787" />
                                                                        <path d="M8 1.66732C8 2.4037 7.40305 3.00065 6.66667 3.00065C5.93029 3.00065 5.33333 2.4037 5.33333 1.66732C5.33333 0.930938 5.93029 0.333984 6.66667 0.333984C7.40305 0.333984 8 0.930938 8 1.66732Z" fill="#878787" />
                                                                        <path d="M8 7.00065C8 7.73703 7.40305 8.33398 6.66667 8.33398C5.93029 8.33398 5.33333 7.73703 5.33333 7.00065C5.33333 6.26427 5.93029 5.66732 6.66667 5.66732C7.40305 5.66732 8 6.26427 8 7.00065Z" fill="#878787" />
                                                                        <path d="M8 12.334C8 13.0704 7.40305 13.6673 6.66667 13.6673C5.93029 13.6673 5.33333 13.0704 5.33333 12.334C5.33333 11.5976 5.93029 11.0007 6.66667 11.0007C7.40305 11.0007 8 11.5976 8 12.334Z" fill="#878787" />
                                                                    </svg>

                                                                    <input type='url' ref={removePopup} value={data} className="wb-editor-popup-input" placeholder="Paste link here" onChange={(e) => { Edit_link(e, "css", id) }} />
                                                                    {data == '' ?
                                                                        <svg className='eye-link-disabled' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M1.5 7C1.5 7 3.5 3 7 3C10.5 3 12.5 7 12.5 7C12.5 7 10.5 11 7 11C3.5 11 1.5 7 1.5 7Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M7 8.5C7.82843 8.5 8.5 7.82843 8.5 7C8.5 6.17157 7.82843 5.5 7 5.5C6.17157 5.5 5.5 6.17157 5.5 7C5.5 7.82843 6.17157 8.5 7 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        :
                                                                        <a className="popup-eye-link-content" target='_blank' href={data}>
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M1.5 7C1.5 7 3.5 3 7 3C10.5 3 12.5 7 12.5 7C12.5 7 10.5 11 7 11C3.5 11 1.5 7 1.5 7Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M7 8.5C7.82843 8.5 8.5 7.82843 8.5 7C8.5 6.17157 7.82843 5.5 7 5.5C6.17157 5.5 5.5 6.17157 5.5 7C5.5 7.82843 6.17157 8.5 7 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        (props.Editor_data[0].css.length == 1 && data == '' && id == 0) ?
                                                                            <svg className='popup-inp-remove-icon-disable' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10.5359 3.46484L7.00038 7.00038M7.00038 7.00038L3.46484 10.5359M7.00038 7.00038L10.5359 10.5359M7.00038 7.00038L3.46484 3.46484" stroke="black" strokeLinecap="round" />
                                                                            </svg>
                                                                            :
                                                                            <svg className='popup-inp-remove-icon' onClick={(e) => { Remove_link(id, "css") }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10.5359 3.46484L7.00038 7.00038M7.00038 7.00038L3.46484 10.5359M7.00038 7.00038L10.5359 10.5359M7.00038 7.00038L3.46484 3.46484" stroke="black" strokeLinecap="round" />
                                                                            </svg>
                                                                    }
                                                                </div>
                                                            </Fragment>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className="wb-popuo-btn-class">
                                                <button className="wb-editor-popup-add-btn" onClick={() => { Add_Link_btn("css") }}>
                                                    <span>{__('Add more', 'wdesignkit')}</span>
                                                </button>
                                            </div>

                                        </div>
                                    }
                                    {
                                        ActiveLink == 'js' &&
                                        <div className="wkit-wb-editor-js-links">
                                            <span className="wkit-Add-link">{__('Insert JS Library', 'wdesignkit')}</span>
                                            <span className="wkit-link-desc">{__('Enter the URL of Your External JS Library, Which You Want to Load in this Widget.', 'wdesignkit')}</span>
                                            <div className='wkit-links-search-bar'>
                                                <input className='wkit-links-search-input'
                                                    type='text'
                                                    placeholder='Search CDNs'
                                                    style={{ backgroundImage: `url(${img_path}assets/images/wb-svg/editor-search.svg)` }}
                                                    value={JSsearchValue}
                                                    onChange={(e) => { setJSsearchValue(e.target.value) }}
                                                />
                                                {JSsearchValue.trim() !== '' &&
                                                    <div className="wkit-cdn-suggestion">
                                                        {fResultJs.length > 0 ?
                                                            <ul className="wkit-custom-cdn-list">
                                                                {
                                                                    fResultJs?.map((data, index) => {
                                                                        return (
                                                                            <li onClick={(e) => { Add_Link_btn('search_data', data.latest) }} key={index}>{data.name} <span>{getVersion(data.latest)}</span></li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                            :
                                                            <div className="wkit-search-cdn-not-found">
                                                                <svg width="101" height="80" viewBox="0 0 101 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M78.7067 77.5144C77.7608 78.4913 74.6616 79.502 72.6921 79.502C70.7227 79.502 69.7432 78.4939 68.7973 77.517C67.8852 76.5763 67.0248 75.6875 65.2938 75.6875C63.5628 75.6875 62.6998 76.5763 61.7903 77.5144C60.8418 78.4913 59.8623 79.502 57.8955 79.502C55.9286 79.502 54.9465 78.4939 54.0006 77.517C53.0885 76.5763 52.2282 75.6875 50.4971 75.6875C48.7661 75.6875 47.9032 76.5763 46.9936 77.5144C46.0478 78.4913 45.0656 79.502 43.0988 79.502C41.1319 79.502 40.1524 78.4913 39.204 77.5144C38.2918 76.5763 37.4315 75.6875 35.7005 75.6875C33.9694 75.6875 33.1065 76.5763 32.1969 77.5144C31.2511 78.4913 30.269 79.502 28.3021 79.502C26.3353 79.502 23.236 78.4913 22.2902 77.5144C21.4143 76.6152 24.6224 39.3773 24.6224 39.3773C24.6224 25.0834 36.2084 13.5 50.4997 13.5C57.6467 13.5 64.1173 16.3971 68.7973 21.0797C73.4799 25.7623 76.377 32.2304 76.377 39.3799C76.377 39.3799 79.5851 76.6178 78.7093 77.517L78.7067 77.5144Z" fill="#878787" />
                                                                    <path d="M47.2806 39.4892C47.1201 39.4645 46.9781 39.6034 47.0028 39.7639C47.4782 42.684 49.3395 44.3199 51.5681 44.3199C53.7967 44.3199 55.658 42.684 56.1333 39.7639C56.158 39.6034 56.0161 39.4645 55.8555 39.4892C55.1024 39.6065 53.1794 39.875 51.5681 39.875C49.9568 39.875 48.0338 39.6065 47.2806 39.4892Z" fill="#FAFAFA" />
                                                                    <path d="M43.1145 35.229C44.8346 35.229 46.229 33.8346 46.229 32.1145C46.229 30.3944 44.8346 29 43.1145 29C41.3944 29 40 30.3944 40 32.1145C40 33.8346 41.3944 35.229 43.1145 35.229Z" fill="#FAFAFA" />
                                                                    <path d="M59.344 35.229C61.0641 35.229 62.4585 33.8346 62.4585 32.1145C62.4585 30.3944 61.0641 29 59.344 29C57.6239 29 56.2295 30.3944 56.2295 32.1145C56.2295 33.8346 57.6239 35.229 59.344 35.229Z" fill="#FAFAFA" />
                                                                    <path d="M74.2759 14.644H73.0558C72.9728 14.644 72.9027 14.5765 72.9027 14.4909C72.9027 14.4052 72.9702 14.3377 73.0558 14.3377H74.1227V14.2676C74.1227 14.1845 74.1902 14.1145 74.2759 14.1145C74.3616 14.1145 74.4291 14.182 74.4291 14.2676V14.4883C74.4291 14.5713 74.3616 14.6414 74.2759 14.6414V14.644ZM71.8383 14.644C71.7553 14.644 71.6852 14.5765 71.6852 14.4909V14.2261C71.6852 13.8782 71.7007 13.5537 71.7319 13.2578C71.7397 13.1747 71.8176 13.115 71.9006 13.1228C71.9837 13.1306 72.046 13.2059 72.0356 13.2915C72.0045 13.5771 71.9889 13.8912 71.9889 14.2287V14.4935C71.9889 14.5765 71.9214 14.6466 71.8357 14.6466L71.8383 14.644ZM74.3901 13.2137C74.3901 13.2137 74.3642 13.2137 74.3512 13.2085C74.2707 13.1877 74.2214 13.1046 74.2422 13.0216C74.2785 12.8814 74.3148 12.7931 74.3408 12.7438L74.3564 12.7152C74.4083 12.6036 74.5692 12.3622 75.0677 12.0273C75.1378 11.9806 75.2312 11.9988 75.2779 12.0689C75.3247 12.139 75.3065 12.2324 75.2364 12.2791C74.7717 12.5906 74.6549 12.7905 74.6316 12.845L74.616 12.8788C74.5978 12.9177 74.5692 12.9852 74.5381 13.0994C74.5199 13.1669 74.4576 13.2137 74.3901 13.2137ZM72.1421 12.2402C72.1239 12.2402 72.1083 12.2376 72.0901 12.2298C72.0123 12.2013 71.9707 12.113 71.9993 12.0351C72.046 11.9079 72.0979 11.7833 72.155 11.6691C72.2744 11.4173 72.4354 11.1707 72.6301 10.9396C72.6846 10.8747 72.7806 10.8669 72.8455 10.9215C72.9104 10.976 72.9182 11.072 72.8637 11.1369C72.6846 11.3498 72.5392 11.573 72.4302 11.8041C72.3757 11.9131 72.329 12.0247 72.2874 12.1415C72.2641 12.2038 72.2069 12.2428 72.1446 12.2428L72.1421 12.2402ZM76.1787 11.6483C76.1294 11.6483 76.0801 11.6224 76.0489 11.5782C76.0048 11.5081 76.023 11.4121 76.0957 11.368L76.1372 11.342C76.4747 11.1291 76.7862 10.9007 77.0639 10.6645C77.1262 10.6099 77.2249 10.6177 77.2794 10.68C77.3339 10.7449 77.3261 10.841 77.2638 10.8955C76.9757 11.1447 76.6512 11.3809 76.3033 11.599L76.2644 11.625C76.2384 11.6405 76.2099 11.6483 76.1813 11.6483H76.1787ZM73.6529 10.3789C73.6062 10.3789 73.5568 10.3555 73.5283 10.314C73.479 10.2465 73.4971 10.1505 73.5646 10.1011C73.6996 10.0051 73.845 9.90905 73.9981 9.81819L74.5926 9.43659C74.6627 9.39246 74.7587 9.41063 74.8029 9.48331C74.847 9.5534 74.8288 9.64945 74.7562 9.69358L74.1591 10.0778C74.0085 10.1686 73.8709 10.2595 73.7411 10.353C73.7152 10.3711 73.684 10.3815 73.6529 10.3815V10.3789ZM78.0089 10.057C77.9751 10.057 77.9414 10.0466 77.9128 10.0233C77.8479 9.97135 77.8349 9.8753 77.8894 9.8104C78.1387 9.49629 78.3515 9.15882 78.5203 8.81097C78.5566 8.73568 78.6475 8.70453 78.7227 8.74087C78.798 8.77722 78.8292 8.86807 78.7928 8.94336C78.6163 9.31198 78.3905 9.66762 78.1257 9.9999C78.0945 10.0388 78.0504 10.057 78.0063 10.057H78.0089ZM75.6621 9.00566C75.6206 9.00566 75.5791 8.98749 75.5479 8.95374C75.4908 8.89144 75.496 8.79539 75.5609 8.73828C75.8776 8.45532 76.1216 8.1516 76.2878 7.83749C76.3267 7.76221 76.4201 7.73365 76.4928 7.77259C76.5681 7.81153 76.5967 7.90498 76.5577 7.97767C76.3734 8.32552 76.1086 8.65521 75.7634 8.96412C75.7348 8.99008 75.6985 9.00306 75.6621 9.00306V9.00566ZM79.0498 7.87903C79.0498 7.87903 79.0291 7.87902 79.0187 7.87643C78.9356 7.85826 78.8837 7.77778 78.9019 7.69471C78.9771 7.34167 79.0161 6.97304 79.0161 6.60183V6.51616C79.0161 6.43309 79.0836 6.363 79.1666 6.363C79.2497 6.363 79.3172 6.43049 79.3198 6.51356V6.60183C79.3198 6.99381 79.2783 7.3832 79.1978 7.75702C79.1822 7.82711 79.1199 7.87643 79.0498 7.87643V7.87903ZM68.5856 7.49483C68.5856 7.49483 68.5804 7.49483 68.5778 7.49483L67.3603 7.43772C67.2773 7.43252 67.2124 7.36243 67.215 7.27936C67.2176 7.19889 67.2851 7.13399 67.3681 7.13399C67.3681 7.13399 67.3733 7.13399 67.3759 7.13399L68.5934 7.1911C68.6765 7.19629 68.7414 7.26638 68.7388 7.34945C68.7362 7.42993 68.6687 7.49483 68.5856 7.49483ZM66.1532 7.37801C66.1532 7.37801 66.148 7.37801 66.1454 7.37801C66.0624 7.37282 65.9975 7.30273 66.0001 7.21966C66.0208 6.79133 66.0676 6.37858 66.1429 5.98919C66.1584 5.90612 66.2389 5.8516 66.322 5.86718C66.405 5.88276 66.4596 5.96323 66.444 6.0463C66.3713 6.42011 66.3272 6.81988 66.3064 7.23523C66.3038 7.31571 66.2363 7.3806 66.1532 7.3806V7.37801ZM76.7265 6.89257C76.7265 6.89257 76.7239 6.89257 76.7213 6.89257C76.6382 6.88998 76.5707 6.81989 76.5733 6.73422C76.5733 6.68749 76.5733 6.64336 76.5759 6.59923C76.5759 6.21244 76.5266 5.88016 76.4279 5.58422C76.402 5.50375 76.4435 5.41808 76.524 5.39212C76.6019 5.36616 76.6901 5.4077 76.7161 5.48817C76.8277 5.81526 76.8796 6.17869 76.8796 6.59923C76.8796 6.64596 76.8796 6.69528 76.877 6.7446C76.8744 6.82767 76.8069 6.88997 76.7239 6.88997L76.7265 6.89257ZM68.7621 6.29291C68.7621 6.29291 68.7362 6.29291 68.7232 6.28772C68.6427 6.26695 68.5934 6.18388 68.6142 6.10081C68.731 5.6647 68.9023 5.27531 69.1282 4.94562C69.1749 4.87553 69.2709 4.85736 69.341 4.90668C69.4111 4.95341 69.4267 5.04946 69.38 5.11955C69.1749 5.42068 69.014 5.77632 68.9075 6.17869C68.8893 6.24619 68.827 6.29291 68.7596 6.29291H68.7621ZM79.0317 5.45702C78.9616 5.45702 78.8993 5.4077 78.8837 5.33761C78.798 4.94562 78.6656 4.57181 78.4943 4.22395C78.4579 4.14867 78.4891 4.05781 78.5644 4.01887C78.6397 3.98253 78.7305 4.01368 78.7695 4.08896C78.9512 4.45759 79.0914 4.85477 79.1822 5.27011C79.2004 5.35318 79.1485 5.43366 79.0654 5.45183C79.055 5.45183 79.042 5.45442 79.0317 5.45442V5.45702ZM66.6257 4.99754C66.6075 4.99754 66.5894 4.99495 66.5712 4.98716C66.4933 4.95601 66.4544 4.86774 66.4829 4.78987C66.6361 4.39269 66.8256 4.01888 67.0488 3.67621C67.0956 3.60612 67.189 3.58536 67.2591 3.63208C67.3292 3.67881 67.35 3.77226 67.3032 3.84235C67.093 4.16684 66.9112 4.51989 66.7685 4.89889C66.7451 4.9586 66.688 4.99754 66.6257 4.99754ZM75.9087 4.68862C75.8724 4.68862 75.8361 4.67565 75.8075 4.64969C75.7712 4.61854 75.7348 4.58738 75.6985 4.55623C75.4467 4.35635 75.1481 4.1902 74.8107 4.063C74.7328 4.03445 74.6913 3.94619 74.7224 3.86571C74.751 3.78784 74.8392 3.7463 74.9197 3.77745C75.2857 3.91504 75.6128 4.09675 75.8906 4.31741C75.9321 4.35116 75.9736 4.3849 76.0126 4.42124C76.0749 4.47576 76.0801 4.5744 76.0256 4.63671C75.9944 4.67045 75.9529 4.68862 75.9113 4.68862H75.9087ZM70.1302 4.34856C70.0783 4.34856 70.029 4.3226 70.0004 4.27587C69.9563 4.20319 69.9796 4.10973 70.0497 4.0656C70.3846 3.85793 70.7766 3.70217 71.2205 3.59574C71.301 3.57757 71.384 3.62689 71.4048 3.70996C71.4256 3.79303 71.3737 3.8735 71.2906 3.89427C70.8778 3.99032 70.5144 4.13569 70.2081 4.3252C70.1821 4.34077 70.1562 4.34856 70.1276 4.34856H70.1302ZM73.6814 3.79562C73.6814 3.79562 73.6685 3.79562 73.6633 3.79562C73.2946 3.75149 72.8741 3.73592 72.4717 3.7489C72.3887 3.75149 72.316 3.68659 72.3134 3.60093C72.3108 3.51786 72.3757 3.44517 72.4613 3.44258C72.8767 3.427 73.3154 3.44517 73.7022 3.4919C73.7853 3.50228 73.845 3.57757 73.8346 3.66064C73.8242 3.73852 73.7593 3.79562 73.684 3.79562H73.6814ZM77.9595 3.2998C77.918 3.2998 77.8739 3.28163 77.8453 3.24788C77.6584 3.03242 77.4481 2.83253 77.2171 2.64822C77.1366 2.58332 77.051 2.52102 76.9653 2.46131C76.8978 2.41199 76.8796 2.31854 76.9289 2.24845C76.9783 2.18096 77.0717 2.16278 77.1418 2.21211C77.2327 2.27441 77.3209 2.3419 77.4066 2.4094C77.6506 2.60409 77.8765 2.81696 78.0738 3.0454C78.1283 3.1077 78.1231 3.20375 78.0582 3.26086C78.0296 3.28682 77.9933 3.2972 77.9569 3.2972L77.9595 3.2998ZM67.9522 2.97531C67.9133 2.97531 67.8717 2.95973 67.8432 2.92858C67.7861 2.86888 67.7861 2.77283 67.8484 2.71312L67.9159 2.64822C68.1962 2.38603 68.5077 2.1524 68.84 1.95251C68.9127 1.90838 69.0062 1.93175 69.0477 2.00443C69.0918 2.07712 69.0685 2.17057 68.9958 2.2147C68.6817 2.4042 68.3883 2.62486 68.1235 2.87147L68.0587 2.93378C68.0301 2.96233 67.9912 2.97531 67.9522 2.97531ZM75.9918 1.898C75.9711 1.898 75.9503 1.8928 75.9321 1.88502C75.5817 1.73445 75.2001 1.61245 74.8003 1.51899C74.7172 1.50082 74.6679 1.41775 74.6861 1.33728C74.7042 1.25421 74.7873 1.20489 74.8678 1.22306C75.2857 1.31911 75.6829 1.4489 76.0515 1.60466C76.1294 1.6384 76.1657 1.72667 76.132 1.80454C76.1086 1.86165 76.0515 1.898 75.9918 1.898ZM70.0212 1.72148C69.9589 1.72148 69.8992 1.68254 69.8784 1.62023C69.8498 1.53976 69.894 1.45409 69.9719 1.42554C70.3483 1.29574 70.7532 1.19191 71.1764 1.12182C71.262 1.10884 71.3373 1.16335 71.3529 1.24642C71.3685 1.32949 71.3114 1.40737 71.2283 1.42294C70.8207 1.49044 70.4339 1.58908 70.0731 1.71369C70.0575 1.71888 70.0393 1.72148 70.0238 1.72148H70.0212ZM73.6321 1.33987C73.6321 1.33987 73.6243 1.33987 73.6191 1.33987C73.2349 1.30872 72.8196 1.29834 72.4198 1.30872C72.3264 1.30872 72.2667 1.24642 72.2615 1.16075C72.2615 1.07768 72.3238 1.00759 72.4094 1.005C72.8222 0.992016 73.2505 1.005 73.6451 1.03615C73.7282 1.04394 73.7905 1.11662 73.7853 1.19969C73.7775 1.28016 73.7126 1.33987 73.6347 1.33987H73.6321ZM74.3226 19H73.4089C73.3258 19 73.2557 18.9325 73.2557 18.8468C73.2557 18.7612 73.3232 18.6937 73.4089 18.6937H74.2837C74.3745 18.6677 74.4758 18.7352 74.4758 18.8339V18.8442C74.4758 18.9273 74.4083 18.9974 74.3226 18.9974V19ZM72.4951 19H71.8072C71.7241 19 71.654 18.9325 71.654 18.8468V18.6184C71.654 18.5353 71.7215 18.4652 71.8072 18.4652C71.8928 18.4652 71.9603 18.5327 71.9603 18.6184V18.6937H72.4951C72.5782 18.6937 72.6483 18.7612 72.6483 18.8468C72.6483 18.9325 72.5808 19 72.4951 19ZM74.3226 18.0733C74.2396 18.0733 74.1695 18.0058 74.1695 17.9201V17.0063C74.1695 16.9233 74.237 16.8532 74.3226 16.8532C74.4083 16.8532 74.4758 16.9207 74.4758 17.0063V17.9201C74.4758 18.0032 74.4083 18.0733 74.3226 18.0733ZM71.8072 17.8578C71.7241 17.8578 71.654 17.7903 71.654 17.7046V16.7909C71.654 16.7078 71.7215 16.6377 71.8072 16.6377C71.8928 16.6377 71.9603 16.7052 71.9603 16.7909V17.7046C71.9603 17.7877 71.8928 17.8578 71.8072 17.8578ZM73.6295 16.9388H72.7157C72.6327 16.9388 72.5626 16.8713 72.5626 16.7857C72.5626 16.7 72.6301 16.6325 72.7157 16.6325H73.6295C73.7126 16.6325 73.7827 16.7 73.7827 16.7857C73.7827 16.8713 73.7152 16.9388 73.6295 16.9388Z" fill="#7D8395" />
                                                                </svg>
                                                                <p className="wkit-cdn-not-found">{__('Not Result Found', 'wdesignkit')}</p>
                                                                <p className="wkit-cdn-not-found-desc">{__('Sorry, the cdn you are looking for doesn\'t exist.', 'wdesignkit')}</p>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                            <div className="wkit-wb-links-loop">
                                                {props && props.Editor_data[0] && props.Editor_data[0].js &&
                                                    props.Editor_data[0].js.map((data, id) => {
                                                        return (
                                                            <Fragment key={id}>
                                                                <div draggable
                                                                    onDragStart={(e) => { Drad_start.current = id }}
                                                                    onDragOver={(event) => { event.preventDefault() }}
                                                                    onDrop={() => { Inline_drop(id, "js") }}
                                                                    className="wb-editor-popup-inp-content">
                                                                    {/* <img draggable={false} className="popup-drag-icon"
                                                                        src={img_path + 'assets/images/wb-svg/popup-drag-con.svg'} /> */}

                                                                    <svg className="popup-drag-icon" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M2.66667 1.66732C2.66667 2.4037 2.06971 3.00065 1.33333 3.00065C0.596954 3.00065 0 2.4037 0 1.66732C0 0.930938 0.596954 0.333984 1.33333 0.333984C2.06971 0.333984 2.66667 0.930938 2.66667 1.66732Z" fill="#878787" />
                                                                        <path d="M2.66667 7.00065C2.66667 7.73703 2.06971 8.33398 1.33333 8.33398C0.596954 8.33398 0 7.73703 0 7.00065C0 6.26427 0.596954 5.66732 1.33333 5.66732C2.06971 5.66732 2.66667 6.26427 2.66667 7.00065Z" fill="#878787" />
                                                                        <path d="M2.66667 12.334C2.66667 13.0704 2.06971 13.6673 1.33333 13.6673C0.596954 13.6673 0 13.0704 0 12.334C0 11.5976 0.596954 11.0007 1.33333 11.0007C2.06971 11.0007 2.66667 11.5976 2.66667 12.334Z" fill="#878787" />
                                                                        <path d="M8 1.66732C8 2.4037 7.40305 3.00065 6.66667 3.00065C5.93029 3.00065 5.33333 2.4037 5.33333 1.66732C5.33333 0.930938 5.93029 0.333984 6.66667 0.333984C7.40305 0.333984 8 0.930938 8 1.66732Z" fill="#878787" />
                                                                        <path d="M8 7.00065C8 7.73703 7.40305 8.33398 6.66667 8.33398C5.93029 8.33398 5.33333 7.73703 5.33333 7.00065C5.33333 6.26427 5.93029 5.66732 6.66667 5.66732C7.40305 5.66732 8 6.26427 8 7.00065Z" fill="#878787" />
                                                                        <path d="M8 12.334C8 13.0704 7.40305 13.6673 6.66667 13.6673C5.93029 13.6673 5.33333 13.0704 5.33333 12.334C5.33333 11.5976 5.93029 11.0007 6.66667 11.0007C7.40305 11.0007 8 11.5976 8 12.334Z" fill="#878787" />
                                                                    </svg>

                                                                    <input type='url' value={data} className="wb-editor-popup-input" placeholder="Paste link here" onChange={(e) => { Edit_link(e, "js", id) }} />

                                                                    {data == '' ?
                                                                        <svg className='eye-link-disabled' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M1.5 7C1.5 7 3.5 3 7 3C10.5 3 12.5 7 12.5 7C12.5 7 10.5 11 7 11C3.5 11 1.5 7 1.5 7Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M7 8.5C7.82843 8.5 8.5 7.82843 8.5 7C8.5 6.17157 7.82843 5.5 7 5.5C6.17157 5.5 5.5 6.17157 5.5 7C5.5 7.82843 6.17157 8.5 7 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        :
                                                                        <a className="popup-eye-link-content" target='_blank' href={data}>
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M1.5 7C1.5 7 3.5 3 7 3C10.5 3 12.5 7 12.5 7C12.5 7 10.5 11 7 11C3.5 11 1.5 7 1.5 7Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M7 8.5C7.82843 8.5 8.5 7.82843 8.5 7C8.5 6.17157 7.82843 5.5 7 5.5C6.17157 5.5 5.5 6.17157 5.5 7C5.5 7.82843 6.17157 8.5 7 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </a>
                                                                    }
                                                                    {
                                                                        (props.Editor_data[0].js.length == 1 && data == '' && id == 0) ?
                                                                            <svg className='popup-inp-remove-icon-disable' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10.5359 3.46484L7.00038 7.00038M7.00038 7.00038L3.46484 10.5359M7.00038 7.00038L10.5359 10.5359M7.00038 7.00038L3.46484 3.46484" stroke="black" strokeLinecap="round" />
                                                                            </svg>
                                                                            :
                                                                            <svg className='popup-inp-remove-icon' onClick={(e) => { Remove_link(id, "js") }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10.5359 3.46484L7.00038 7.00038M7.00038 7.00038L3.46484 10.5359M7.00038 7.00038L10.5359 10.5359M7.00038 7.00038L3.46484 3.46484" stroke="black" strokeLinecap="round" />
                                                                            </svg>
                                                                    }
                                                                </div>
                                                            </Fragment>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className="wb-popuo-btn-class">
                                                <button className="wb-editor-popup-add-btn" onClick={() => { Add_Link_btn("js") }}>
                                                    <span>{__('Add more', 'wdesignkit')}</span>
                                                </button>
                                            </div>

                                        </div>
                                    }
                                </div>
                                <div className="close-popup-btn">
                                    <button className="wkit-wb-close-popup-btn" onClick={(e) => { { Close_popup(e) } }}>{__('Close', 'wdesignkit')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : ""}

            {/* <div className="wkit-wb-live-preview" ref={editorLivePreview} id="wkit-livePreview-id">
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
            </div> */}
        </>
    );
}

export default Editor;