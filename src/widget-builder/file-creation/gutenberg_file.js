import { Temp_component } from "../components-data/component_custom";
import axios from "axios";
import { wdKit_Form_data, get_user_login } from '../../helper/helper-function';


const CreatFile = async (call, all_files, html, css, js, old_folder, image_file, w_icon) => {

    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    const Html_validation = (html) => {
        let html_data = JSON.parse(html)
        const stringToHTML = function (str) {
            let parser = new DOMParser(),
                doc = parser.parseFromString(str, 'text/html');
            return doc.body;
        };

        let repeater_html = stringToHTML(html_data)
        let data = repeater_html.innerHTML;
        var h_data = data.replaceAll("'", "\\'");

        return h_data;
    }

    var upload_path = wdkitData.WDKIT_SERVER_PATH;
    var site_url = wdkitData.WDKIT_SITE_URL;
    var layout = "";
    var style = "";
    var php_layout = "";
    var data = Html_validation(html);
    var layout_components = "";
    var style_components = "";
    var pmgc = [];
    var attributes = [];
    var textdomain = "widget-builder";
    var uniqe_class = keyUniqueID();
    var extra_functions = "";
    var responses = { 'ajax': '', 'api': '' };

    const External_js_cdn = () => {
        var links = ''
        if (all_files && all_files.Editor_data && all_files.Editor_data.links && all_files.Editor_data.links[0].js && all_files.Editor_data.links[0].js.length > 1) {
            let js_link = all_files.Editor_data.links[0].js;
            js_link.map((link) => {
                links += `wp_enqueue_script("wbuilder-cgb-js-cdn_${keyUniqueID()}", '${link}', true);\n`
            })
        }
        return links;
    }

    const External_css_cdn = () => {
        var links = '';
        if (all_files && all_files.Editor_data && all_files.Editor_data.links && all_files.Editor_data.links[0].css && all_files.Editor_data.links[0].css.length > 1) {
            let css_link = all_files.Editor_data.links[0].css;
            css_link.map((link) => {
                links += `wp_enqueue_style("wbuilder-cgb-css-cdn_${keyUniqueID()}", '${link}', true);\n`
            })
        }
        return links;
    }

    const Name_validation = (type) => {
        var name = all_files.WcardData.widgetdata.name.trim();
        var id = all_files.WcardData.widgetdata.widget_id;
        if (type == "file") {
            let file_name = name.replaceAll(" ", "_") + "_" + id;
            return file_name;
        } else if (type == "folder") {
            let folder_name = name.replaceAll(" ", "-") + "_" + id;
            return folder_name;
        } else if (type == undefined) {
            return name;
        }
    }

    const Image_link = () => {
        let folder = Name_validation('folder');
        let file = Name_validation('file');
        let img_path = `${upload_path}/gutenberg/${folder}/${file}.jpg`
        let icon_path = `${upload_path}/gutenberg/${folder}/${file}.svg`
        const add_val = Object.assign({}, all_files.WcardData.widgetdata, { "w_icon": icon_path }, { "w_image": img_path });
        let widget_data = { 'widgetdata': add_val };
        return widget_data;
    }
    Image_link();

    const Icon_link = () => {
        let folder = Name_validation('folder');
        let icon = Name_validation('file');
        let icon_path = `${upload_path}/gutenberg/${folder}/${icon}.svg`;
        var http = new XMLHttpRequest();
        var block_icon = '';

        http.open('HEAD', icon_path, false);
        http.send();

        if (http.status == 200) {
            return `React.createElement("img", {
            src: "${icon_path}",
                alt: __('${Name_validation()}')
        })`;
        } else {
            return `React.createElement(
                "svg",
                { xmlns: "http://www.w3.org/2000/svg", width: "40", height: "26", viewBox: "0 0 40 26", fill: "none" },
                React.createElement("path", { d: "M39.28 10.9959L36.6927 8.71839L32.1738 4.73145L24.376 13.5766V23.1266L25.3841 24.0141L26.7447 25.2147L39.28 10.9959Z", fill: "#C22076" }),
                React.createElement("path", { d: "M24.3761 13.5762L19.6387 18.9499L24.3761 23.1261V13.5762Z", fill: "#D15497" }),
                React.createElement("path", { d: "M19.6388 18.9498L24.3763 13.5761V0H14.9014V13.5761L19.6388 18.9498Z", fill: "#E188B8" }),
                React.createElement("path", { d: "M14.9014 13.5762V23.1261L19.6388 18.9499L14.9014 13.5762Z", fill: "#F0BCD8" }),
                React.createElement("path", { d: "M14.9008 23.1266V13.5766L7.10619 4.73145L0 10.9959L12.5321 25.2147L14.9008 23.1266Z", fill: "#FFF0F9" })
              )`
        }
        // return icon_path;
    }

    const Get_html = (name) => {
        const stringToHTML = function (str) {
            let parser = new DOMParser(),
                doc = parser.parseFromString(str, 'text/html');
            return doc.body;
        };

        let repeater_html = stringToHTML(data)
        if (repeater_html.querySelector(`[data-${name}]`) && repeater_html.querySelector(`[data-${name}]`).outerHTML) {
            data = repeater_html.innerHTML

            return repeater_html.querySelector(`[data-${name}]`).outerHTML;
        }
    }

    const Change_url = () => {
        if (call == "update" && old_folder != undefined) {

            let new_url = new URL(window.location),
                array = new_url.hash.split("/"),
                url_length = (array.length - 1),
                R_name = all_files.WcardData.widgetdata.name.trim() + "_" + all_files.WcardData.widgetdata.widget_id;

            array[url_length] = R_name;
            let string = array.join('/')
            document.location.hash = string;
        }
    }
    Change_url();

    const Key_words = () => {
        if (all_files && all_files.WcardData && all_files.WcardData.widgetdata && all_files.WcardData.widgetdata.key_words) {
            let wrods = all_files.WcardData.widgetdata.key_words;
            var key_words = '';
            wrods.forEach((element) => {
                key_words += `__('${element}'),`
                // __('wdesignkit'),
            });
            return key_words;
        } else {
            return "";
        }
    }

    const Css_validation = () => {
        let css_data = JSON.parse(css);
        if (all_files &&
            all_files.WcardData &&
            all_files.WcardData.widgetdata &&
            all_files.WcardData.widgetdata.css_parent_node &&
            all_files.WcardData.widgetdata.css_parent_node == true) {

            css_data = css_data.replaceAll("{{parent-class}}", `.wkit-wb-Widget_${uniqe_class}`);
            let css_array = css_data.split('}');
            let final_css = '';

            css_array.map((css) => {
                let data = css.trim();
                if (data.search('{') > -1) {
                    if (data.search("@import") > -1) {
                        final_css += data + '}';;
                    } else if (data.charAt(0) == '.') {
                        data = data.replace('.', `.wkit-wb-Widget_${uniqe_class} .`);
                        final_css += data + '}';
                        // } else if (data.charAt(0) != '*' && data.charAt(0) != '/' && data.charAt(0) != ':' && !data.startsWith('body') && data.search("@media") <= -1) {
                    } else if (data.charAt(0).match("[a-zA-Z]+") && !data.startsWith('body')) {
                        data = data.replace(data.charAt(0), `.wkit-wb-Widget_${uniqe_class} ` + data.charAt(0))
                        final_css += data + '}';
                    } else if (data.charAt(0) == '*') {
                        data = data.replace('*', `.wkit-wb-Widget_${uniqe_class} `);
                        final_css += data + '}';
                    } else if (data.startsWith('body')) {
                        data = data.replace('body', `.wkit-wb-Widget_${uniqe_class} `);
                        final_css += data + '}';
                    } else if (data.search("@media") > -1) {
                        data = data.replace("{", ` {  .wkit-wb-Widget_${uniqe_class}`)
                        final_css += data + '}';
                    } else {
                        final_css += data + '}';
                    }
                } else if (data.search('{') <= -1) {
                    final_css += '}';
                }
            })
            final_css = final_css.slice(0, -1)
            return final_css;
        } else {
            css_data = css_data.replaceAll("{{parent-class}}", `.wkit-wb-Widget_${uniqe_class}`);
            return css_data;
        }
    }

    var js_data = data;
    var controller_html = "";

    const Controller_validation = (controller, loop_name) => {
        let validation = "";

        if (controller.type == "url") {
            if (js_data.search(`{{${controller.name}-url}}`)) {
                if (loop_name) {
                    validation += `\nlet grnp_${controller.name}_url = ${loop_name} && ${loop_name}.${controller.name} && ${loop_name}.${controller.name}.url ?  ${loop_name}.${controller.name}.url : "";`
                    js_data = js_data.replaceAll(`{{${controller.name}-url}}`, "${grnp_" + controller.name + "_url}")
                } else {
                    validation += `\nlet g_${controller.name}_url = ${controller.name} && ${controller.name}.url && ${controller.name}.url != undefined ? ${controller.name}.url : "";`
                    js_data = js_data.replaceAll(`{{${controller.name}-url}}`, "${g_" + controller.name + "_url}")
                }
            }
            if (js_data.search(`{{${controller.name}-is_external}}`)) {
                if (loop_name) {
                    js_data = js_data.replaceAll(`{{${controller.name}-is_external}}`, "${grnp_" + controller.name + "_target}")
                    validation += `\nlet grnp_${controller.name}_target = ${loop_name} && ${loop_name}.${controller.name} && ${loop_name}.${controller.name}.target ?  ${loop_name}.${controller.name}.target : "";`
                } else {
                    js_data = js_data.replaceAll(`{{${controller.name}-is_external}}`, "${g_" + controller.name + "_target}")
                    validation += `\nlet g_${controller.name}_target = ${controller.name} && ${controller.name}.target && ${controller.name}.target != undefined ? ${controller.name}.target : "";`
                }
            }
            if (js_data.search(`{{${controller.name}-nofollow}}`)) {
                if (loop_name) {
                    js_data = js_data.replaceAll(`{{${controller.name}-nofollow}}`, "${grnp_" + controller.name + "_nofollow}")
                    validation += `\nlet grnp_${controller.name}_nofollow = ${loop_name} && ${loop_name}.${controller.name} && ${loop_name}.${controller.name}.nofollow ?  ${loop_name}.${controller.name}.nofollow : "";`
                } else {
                    js_data = js_data.replaceAll(`{{${controller.name}-nofollow}}`, "${g_" + controller.name + "_nofollow}")
                    validation += `\nlet g_${controller.name}_nofollow = ${controller.name} && ${controller.name}.nofollow && ${controller.name}.nofollow != undefined ? ${controller.name}.nofollow : "";`
                }
            }
        } else if (controller.type == "media") {
            if (loop_name) {
                js_data = js_data.replaceAll(`{{${controller.name}}}`, "${grnp_" + controller.name + "}")
                validation += `\nlet grnp_${controller.name} = ${loop_name} && ${loop_name}.${controller.name} && ${loop_name}.${controller.name}.url ? ${loop_name}.${controller.name}.url : "";`
            } else {
                js_data = js_data.replaceAll(`{{${controller.name}}}`, "${g_" + controller.name + "}")
                validation += `\nlet g_${controller.name} = ${controller.name} && ${controller.name}.url && ${controller.name}.url != undefined ? ${controller.name}.url : "";`
            }
        } else if (controller.type == "popover") {
            controller.fields && controller.fields.map((innre_controller) => {
                validation += Controller_validation(innre_controller, controller.name);
            })
            // js_data = js_data.replaceAll(`{{${controller.name}}}`, "${g_" + controller.name + "}")
            // validation += `\nlet g_${controller.name} = ${controller.name} && ${controller.name} != undefined ? ${controller.name} : "";`
        } else if (controller.type == "normalhover") {
            controller.fields && controller.fields.map((innre_controller) => {
                Controller_validation(innre_controller);
            })
        } else if (controller.type == "repeater") {
            let repeater_html = Get_html(controller.name);
            js_data = js_data.replaceAll(repeater_html, '${repeater_loop}')
            controller.fields && controller.fields.map((innre_controller) => {
                validation += Controller_validation(innre_controller, controller.name);
                repeater_html = repeater_html.replaceAll(`{{${innre_controller.name}}}`, `\${item.${innre_controller.name}}`);
                repeater_html = repeater_html.replaceAll('{loop-class}', 'tp-repeater-item-${item._key}');
            })
            validation += `\nlet repeater_loop = "";
            \n${controller.name} && ${controller.name}.map((item, index) => {
               repeater_loop += \`${repeater_html}\`;
            })`;

        } else if (controller.type == "slider") {
            var slider_data = '';
            var nha_type = controller && controller.key ? controller.key : '';
            controller.size_units && controller.size_units.map((data, index) => {
                slider_data += `g_${controller.name}_list['${data.type}'] = { "type": "${data.type}", "min": ${data.min}, "max": ${data.max}, "step": ${data.step} };\n`
            })
            extra_functions += `const ${controller.name}${nha_type ? '_' + nha_type : ""}Function = (unit, type) => {
                var g_${controller.name}_list = [];
                ${slider_data}
                return g_${controller.name}_list[unit][type];
            };`
        } else {
            if (loop_name) {
                js_data = js_data.replaceAll(`{{${controller.name}}}`, "${grnp_" + controller.name + "}")
                validation += `\nlet grnp_${controller.name} = ${loop_name} && ${loop_name}.${controller.name} ? ${loop_name}.${controller.name} : "";`
            } else {
                js_data = js_data.replaceAll(`{{${controller.name}}}`, "${g_" + controller.name + "}")
                validation += `\nlet g_${controller.name} = ${controller.name} && ${controller.name} != undefined ? ${controller.name} : "";`
            }
        }

        return validation;
    }

    all_files.CardItems.cardData[0].layout.map((data) => {
        data.inner_sec.map((controller) => {
            controller_html += Controller_validation(controller)
        })
    })



    let tags = {
        "pmgc": {
            "text": "Pmgc_Text",
            "number": "Pmgc_Text",
            "media": "Pmgc_Media",
            "choose": "Pmgc_RadioAdvanced",
            "background": "Pmgc_Background",
            "border": "Pmgc_Border",
            "boxshadow": "Pmgc_BoxShadow",
            "color": "Pmgc_Color",
            "cssfilter": "Pmgc_CssFilter",
            "dimension": "Pmgc_Dimension",
            "typography": "Pmgc_Typography",
            "gradientcolor": "Pmgc_Gradient",
            "heading": "Pmgc_Label_Heading",
            "textshadow": "Pmgc_BoxShadow",
            "fontawesomeiconlist": "Pmgc_IconList",
            "linksearch": "Pmgc_LinkSearch",
            "multirange": "Pmgc_MultiRange",
            "rawhtml": "Pmgc_Note",
            "radioadvanced": "Pmgc_RadioAdvanced",
            "slider": "Pmgc_Range",
            "select": "Pmgc_Select",
            "styleimage": "Pmgc_Styles",
            "sortable": "Pmgc_Sortable",
            "imagestyles": "Pmgc_ImageStyles",
            "tab": "Pmgc_Tab",
            "textarea": "Pmgc_TextArea",
            "switcher": "Pmgc_Toggle",
            "url": "Pmgc_Url",
            "iconscontrol": "Pmgc_IconList",
            "popover": "Pmgc_GroupPopover",
            "normalhover": "Pmgc_Tabs",
            "repeater": "Pmgc_Repeater",
            "headingtags": "Pmgc_Heading",
        }
    }

    all_files.CardItems.cardData[0].layout.map((data) => {
        layout += `React.createElement(PanelBody, { title: __("${data.section}"), initialOpen: true },\n`;
        data.inner_sec.map((component) => {
            if (component.type == "repeater" || component.type == "popover" || component.type == "normalhover") {
                component.fields.map((inner_controller) => {
                    if (!pmgc.includes(tags.pmgc[inner_controller.type])) {
                        pmgc.push(tags.pmgc[inner_controller.type])
                    }
                    if (component.type == "normalhover") {
                        if (inner_controller.key == 'normal' && !attributes.includes(inner_controller.name + '_normal')) {
                            attributes.push(inner_controller.name + '_normal')
                        } else if (inner_controller.key == 'hover' && !attributes.includes(inner_controller.name + '_hover')) {
                            attributes.push(inner_controller.name + '_hover')
                        } else if (inner_controller.key == 'active' && !attributes.includes(inner_controller.name + '_active')) {
                            attributes.push(inner_controller.name + '_active')
                        }
                    }
                })
            }

            if (!pmgc.includes(tags.pmgc[component.type])) {
                pmgc.push(tags.pmgc[component.type])
            }

            if (!attributes.includes(component.name)) {
                attributes.push(component.name)
            }
            layout += Temp_component(component, "js")
            php_layout += Temp_component(component, "php")
        })
        layout += '),'
    })

    all_files.CardItems.cardData[0].style.map((data) => {
        style += `React.createElement(PanelBody, { title: __("${data.section}"), initialOpen: true },\n`;
        data.inner_sec.map((component) => {
            if (component.type == "repeater" || component.type == "popover" || component.type == "normalhover") {
                component.fields.map((inner_controller) => {
                    if (!pmgc.includes(tags.pmgc[inner_controller.type])) {
                        pmgc.push(tags.pmgc[inner_controller.type])
                    }

                    if (component.type == "normalhover") {
                        if (inner_controller.key == 'normal' && !attributes.includes(inner_controller.name + '_normal')) {
                            attributes.push(inner_controller.name + '_normal')
                        } else if (inner_controller.key == 'hover' && !attributes.includes(inner_controller.name + '_hover')) {
                            attributes.push(inner_controller.name + '_hover')
                        } else if (inner_controller.key == 'active' && !attributes.includes(inner_controller.name + '_active')) {
                            attributes.push(inner_controller.name + '_active')
                        }
                    }
                })
            }

            if (!pmgc.includes(tags.pmgc[component.type])) {
                pmgc.push(tags.pmgc[component.type])
            }

            if (!attributes.includes(component.name)) {
                attributes.push(component.name)
            }
            style += Temp_component(component, "js")
            php_layout += Temp_component(component, "php")
        })
        style += '),'
    })



    var layout_pmgc = "";
    pmgc.map((data) => {
        layout_pmgc += `\n${data},\n`
    })

    var layout_attributes = "";
    attributes.map((data) => {
        layout_attributes += `${data},\n`
    })


    var json_section = JSON.stringify(all_files.CardItems.cardData);
    var json_widget = JSON.stringify(Image_link());
    var editor_link = JSON.stringify(all_files.Editor_data);

    ////////////////////////////////////////////////////////////////////////////////===================================----------------------------------------------------------

    let js_function = keyUniqueID();
    var js_file = `
    class ${Name_validation("file").replaceAll("-", "_")} {
        constructor() {
            this.${Name_validation("file").replaceAll("-", "_")}_${js_function}();

            this.state = {
                device : 'md',
            };
        }
    
        ${Name_validation("file").replaceAll("-", "_")}_${js_function}() {

    /**
    * BLOCK: wbuilder
    *
    * Registering a basic block with Gutenberg.
    * Simple block, renders and saves the same content without any interactivity.
    */
   
   const { __ } = wp.i18n; // Import __() from wp.i18n
   const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
   
   const {
       PanelBody,
   } = wp.components;
   
   const {
       Pmgc_PanelTabs,
       Pmgc_Tab,
       ${pmgc.length > 0 ? pmgc + "," : ""}
       Pmgc_EditReusable,
       Pmgc_Global,
       Pmgc_HelperFunction,
       Pmgc_CssGenerator,
   } = wp.Pmgc_Components;
   
   const {
       Component,
       Fragment
   } = wp.element;
   
   const {
       InspectorControls,
       InnerBlocks,
       RichText,
   } = wp.blockEditor;
   /**
    * Register: aa Gutenberg Block.
    *
    * Registers a new block provided a unique name and an object defining its
    * behavior. Once registered, the block is made editor as an option to any
    * editor interface where blocks are implemented.
    *
    * @link https://wordpress.org/gutenberg/handbook/block-api/
    * @param  {string}   name     Block name.
    * @param  {Object}   settings Block settings.
    * @return {?WPBlock}          The block, if it has been successfully
    *                             registered; otherwise 'undefined'.
    */
   
    registerBlockType('cgb/${Name_validation("folder").replaceAll("_", "-").toLowerCase()}-block', {
       // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
       title: __('${Name_validation()}'), // Block title.
       description: __('${all_files.WcardData.widgetdata.description}'),
        icon: ${Icon_link()},
       category: 'common',
       keywords: [${Key_words()}],
   
       /**
        * The edit function describes the structure of your block in the context of the editor.
        * This represents what the editor will render when the block is used.
        *
        * The "edit" property must be a valid function.
        *
        * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
        *
        * @param {Object} props Props.
        * @returns {Mixed} JSX Component.
        */
   
       edit: (props) => {
        ${extra_functions}

   
           const {
               isSelected,
               attributes,
               setAttributes,
           } = props;
   
           const {
               ${layout_attributes}
               block_id,
           } = attributes;

                var clientId = props.clientId.substr(0, 6)
                props.setAttributes({ block_id: clientId })
   
   
           const inspectorControls = (isSelected && (React.createElement(InspectorControls, null,
               React.createElement(Fragment, null,
                   React.createElement(Pmgc_PanelTabs, null,
                       React.createElement(Pmgc_Tab, { tabTitle: __("Layout") },
                           ${layout}
                       ),
                       React.createElement(Pmgc_Tab, { tabTitle: __("Style") },
                           ${style}
                       ),
                       React.createElement(Pmgc_Tab, { tabTitle: __("Advanced") }
                           /**somthing*/
                       )
                   )
               )
           )));

            if (props.attributes.block_id) {
                var element = document.getElementsByClassName("tpgb-block-" + block_id)
                if (null != element && "undefined" != typeof element) {
                    Pmgc_CssGenerator(props.attributes, 'cgb', "${Name_validation("folder").replaceAll("_", "-").toLowerCase()}-block", block_id, false, props.clientId);
                }
            }

           ${controller_html}
   
           return (
               React.createElement(Fragment, null, inspectorControls,
                   wp.element.createElement("div", {
                    class: "wkit-wb-Widget_${uniqe_class} cgb-block-"+block_id+"",
                       dangerouslySetInnerHTML: {
                           __html: \`${js_data}\`
                       }
                   })
               )
   
           );
       },
   
       /**
        * The save function defines the way in which the different attributes should be combined
        * into the final markup, which is then serialized by Gutenberg into post_content.
        *
        * The "save" property must be specified and must be a valid function.
        *
        * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
        *
        * @param {Object} props Props.
        * @returns {Mixed} JSX Frontend HTML.
        */
       save: (props) => {

        const {
            isSelected,
            attributes,
            setAttributes,
        } = props;

        const {
            ${layout_attributes}
            block_id,
        } = attributes;

        ${controller_html}
        let styleCss = Pmgc_CssGenerator(attributes, 'cgb', "${Name_validation("folder").replaceAll("_", "-").toLowerCase()}-block", block_id, true);


        return (
            React.createElement(Fragment, null,
                wp.element.createElement("div", {
                    class: "wkit-wb-Widget_${uniqe_class} cgb-block-" + block_id + "",
                    dangerouslySetInnerHTML: {
                        __html: \`${js_data}\`
                    }

                }),
                /*#__PURE__*/React.createElement("style", null, styleCss)
            )
        );
       },
   });
}
}
    new ${Name_validation("file").replaceAll("-", "_")}();`

    var external_js_file = `class MyClass_${uniqe_class} {
        constructor() {
            setTimeout(() => {
                let main_html = document.querySelectorAll(".wkit-wb-Widget_${uniqe_class}")    
                    main_html.forEach(element => {
                        this.main_function_${uniqe_class}(element)
                    });
            }, 800);
        }

    main_function_${uniqe_class}($scope) {
        ${JSON.parse(js)} 
    }
}

    new MyClass_${uniqe_class}();`

    let unique_js_id = keyUniqueID();
    let unique_css_id = keyUniqueID();
    let unique_function = keyUniqueID();

    var php_file = `<?php
    /**Widget-1 Wdesignkit*/
    function wb_${Name_validation('file').replaceAll("-", "_")}() { 

        wp_enqueue_script("wbuilder-cgb-block_external${unique_js_id}-js", WDKIT_SERVER_PATH .'/gutenberg/${Name_validation("folder")}/index.js', true);

        ${External_js_cdn()}
        ${External_css_cdn()}
    
        wp_register_script('wbuilder-cgb-block_${unique_js_id}-js', WDKIT_SERVER_PATH .'/gutenberg/${Name_validation("folder")}/${Name_validation("file")}.js',
            array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wkit-editor-block-pmgc' ), null, true
        );
    
        wp_register_style('wbuilder-cgb-style_${unique_css_id}-css', WDKIT_SERVER_PATH .'/gutenberg/${Name_validation("folder")}/${Name_validation("file")}.css', is_admin() ? array( 'wp-editor' ) : null, null );
    
        register_block_type(
            'cgb/${Name_validation("folder").replaceAll("_", "-")}-block', array(
                'attributes' => [
                    'block_id' => [
                        'type' => 'string',
                        'default' => '',
                    ],
                    ${php_layout}
    
                ],
                'style'         => 'wbuilder-cgb-style_${unique_css_id}-css',
                'editor_script' => 'wbuilder-cgb-block_${unique_js_id}-js',
                'render_callback' => 'tpgb_tp_accordion_render_callback_${unique_function}'
            )
        );
    
    }
    add_action( 'init', 'wb_${Name_validation('file').replaceAll("-", "_")}' );
    
    function tpgb_tp_accordion_render_callback_${unique_function}($atr, $cnt) { 
        $output = $cnt;
    
        return $output;
    }`

    var css_file = `${Css_validation()}   `;

    var style_file = css;

    var json_data = `{
        "section_data": ${json_section},
    "widget_data":${json_widget},
    "Editor_Link":${editor_link},
    "Editor_data": {
        "html":${html},
        "css":${css},
        "js":${js}
    }
}`;

    ////////////////////////////////////////////////////////////////////////////////===================================----------------------------------------------------------

    if (old_folder == undefined) {
        var old_name = "";
    } else {
        var old_name = old_folder;
    }

    var values = {
        "old_folder": old_name,
        'file_name': Name_validation("file"),
        'folder_name': Name_validation("folder"),
        'description': all_files.WcardData.widgetdata.description,
        'js_file': js_file,
        'php_file': php_file,
        'css_file': css_file,
        'external_js_file': external_js_file,
        'style_file': style_file,
        'json_file': json_data,
        "plugin": "gutenberg"
    }

    let token = get_user_login();
    if (token && call == 'sync') {
        let data = {
            'token': token.token,
            'type': 'add',
            'title': Name_validation(),
            'content': all_files.WcardData.widgetdata.description,
            'builder': all_files.WcardData.widgetdata.type,
            'w_data': json_data,
            'w_uniq': all_files.WcardData.widgetdata.widget_id,
            "w_image": 'https://theplusaddons.com/wp-content/uploads/2022/11/elementor-toolkit.png',
            "w_imgext": 'png',
            "w_version": all_files.WcardData.widgetdata.widget_version,
            "w_updates": all_files.WcardData.widgetdata.version_detail
        }

        let form_arr = { 'type': 'wkit_add_widget', 'widget_info': JSON.stringify(data) }
        await wdKit_Form_data(form_arr).then(result => responses.ajax = result)
    }

    var formData = new FormData();
    formData.append('image', image_file);
    formData.append('icon', w_icon);
    formData.append('value', JSON.stringify(values));

    // await axios.post(url, formData)
    //     .then((response) => {
    //         if (response.status == 200) {
    //             if (document.querySelector('.wb-function-call')) {
    //                 document.querySelector('.wb-function-call').click();
    //             }
    //             responses.api = response.data;
    //         }
    //     })
    //     .catch(error => console.log(error));

    return responses;
}

export default CreatFile;