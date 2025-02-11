import { Temp_component } from "../components-data/component_custom";
import axios from "axios";
import { wdKit_Form_data, get_user_login } from '../../helper/helper-function';

const CreatFile = async (call, all_files, html, css, js, old_folder, image_file, d_image, jQuery = false) => {

    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    const ThreeDigitUnique = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 2);
        return uid + year;
    }

    const UniqueNumber = () => {
        return Math.floor(Math.random() * 1000000)
    }

    const stringToHTML = function (str) {
        let parser = new DOMParser(),
            doc = parser.parseFromString(str, 'text/html');
        return doc;
    };

    const URL_condition = (data) => {
        let html_data = stringToHTML(data),
            link_array = html_data.querySelectorAll('a');
        link_array = Object.values(link_array);

        if (link_array.length > 0) {
            link_array.map((a_tag) => {
                let old_html = a_tag.outerHTML,
                    rel_value = a_tag.rel.trim();

                if (!rel_value.includes('noopener')) {
                    if (rel_value) {
                        a_tag.rel = rel_value + ' noopener';
                    } else {
                        a_tag.rel = 'noopener';
                    }

                    let new_tag = a_tag.outerHTML;
                    data = data.replaceAll([old_html], [new_tag])
                }
            })
        }

        return data;
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

        return URL_condition(h_data);
    }

    var upload_path = wdkitData.WDKIT_SERVER_PATH,
        layout = "",
        style = "",
        php_layout = "",
        php_variable = "",
        data = Html_validation(html),
        js_link = [],
        css_link = [],
        Dynamic_components = [],
        repeater_variable = {},
        pmgc = [],
        Loopvar = [],
        attributes = [],
        uniqe_class = keyUniqueID(),
        extra_functions = "",
        extra_states = "",
        frontend_function = "",
        onload_call = "",
        responses = { 'ajax': '', 'api': '' },
        controller_html = "",
        responsive_code = true,
        switcherArray = [],
        cpt_check = [],
        dynamic_controller = [],
        external_cdn = all_files?.Editor_data?.links?.[0]?.external_cdn ? [...all_files?.Editor_data?.links?.[0]?.external_cdn] : [];


    if (all_files.Editor_data?.links[0]?.js?.length > 0) {
        all_files.Editor_data.links[0].js.map(function (links) {
            if (links) {
                js_link += `wp_enqueue_script( 'wd_ex_script_${keyUniqueID()}', '${links}', [], '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', true );\n`
            }
        });
    }

    if (all_files.Editor_data?.links[0]?.css?.length > 0) {
        all_files.Editor_data.links[0].css.map(function (links) {
            if (links) {
                css_link += `wp_enqueue_style( 'wd_css_ex_1_${keyUniqueID()}', '${links}', false, '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', 'all' );\n`
            }
        });
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

    const Get_loop_html = (name) => {
        let html = [];

        let repeater_html = stringToHTML(data);
        if (repeater_html.querySelectorAll(`[data-${name}]`).length > 0) {

            data = repeater_html.head.innerHTML + repeater_html.body.innerHTML
            let r_html_array = repeater_html.querySelectorAll(`[data-${name}]`);

            Object.values(r_html_array).map((r_html) => {
                html.push(r_html.outerHTML);
            })

            return html;
        }
    }

    const Image_link = () => {
        if (all_files?.WcardData?.widgetdata?.image_id) {
            delete all_files?.WcardData?.widgetdata?.image_id
        }
        if (image_file && image_file.type) {
            let ext = image_file.type;
            var img_ext = '';
            if (ext.search('jpeg') > -1) {
                img_ext = 'jpg';
            } else if (ext.search('jpg') > -1) {
                img_ext = 'jpg';
            } else if (ext.search('png') > -1) {
                img_ext = 'png';
            } else {
                const add_val = Object.assign({}, all_files.WcardData.widgetdata, { "w_image": "", "img_ext": img_ext });
                let widget_data = { 'widgetdata': add_val };
                return widget_data;
            }
            if (img_ext) {
                let folder = Name_validation('folder');
                let image = Name_validation('file');
                let img_path = `${upload_path}/gutenberg/${folder}/${image}.${img_ext}`
                const add_val = Object.assign({}, all_files.WcardData.widgetdata, { "w_image": img_path, "img_ext": img_ext });
                let widget_data = { 'widgetdata': add_val };
                return widget_data;
            }
        } else if (old_folder) {
            let old_image = all_files.WcardData.widgetdata.w_image;
            let image_array = old_image.split('.');
            let img_ext = image_array[image_array.length - 1]

            if (img_ext) {
                let folder = Name_validation('folder');
                let image = Name_validation('file');
                let img_path = `${upload_path}/gutenberg/${folder}/${image}.${img_ext}`
                const add_val = Object.assign({}, all_files.WcardData.widgetdata, { "w_image": img_path, "img_ext": img_ext });
                let widget_data = { 'widgetdata': add_val };
                return widget_data;
            } else {
                return all_files.WcardData;
            }
        } else if (d_image) {
            let old_image = d_image;
            let image_array = old_image.split('.');
            let img_ext = image_array[image_array.length - 1]

            if (img_ext) {
                let folder = Name_validation('folder');
                let image = Name_validation('file');
                let img_path = `${upload_path}/gutenberg/${folder}/${image}.${img_ext}`
                const add_val = Object.assign({}, all_files.WcardData.widgetdata, { "w_image": img_path, "img_ext": img_ext });
                let widget_data = { 'widgetdata': add_val };
                return widget_data;
            } else {
                return all_files.WcardData;
            }
        } else {
            return all_files.WcardData;
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
            });
            return key_words;
        } else {
            return "";
        }
    }

    const Css_validation = () => {
        let parent_class = all_files.WcardData.widgetdata.widget_id;
        let css_data = JSON.parse(css);
        if (all_files &&
            all_files.WcardData &&
            all_files.WcardData.widgetdata &&
            all_files.WcardData.widgetdata.css_parent_node &&
            all_files.WcardData.widgetdata.css_parent_node == true) {

            css_data = css_data.replaceAll("{{parent-class}}", `.wkit-wb-Widget_${parent_class}`);
            let css_array = css_data.split('}');
            let final_css = '';

            css_array.map((css) => {
                let data = css.trim();
                if (data.search('{') > -1) {
                    if (data.search("@import") > -1) {
                        final_css += data + '}';;
                    } else if (data.charAt(0) == '.') {
                        data = data.replace('.', `.wkit-wb-Widget_${parent_class} .`);
                        final_css += data + '}';
                        // } else if (data.charAt(0) != '*' && data.charAt(0) != '/' && data.charAt(0) != ':' && !data.startsWith('body') && data.search("@media") <= -1) {
                    } else if (data.charAt(0).match("[a-zA-Z]+") && !data.startsWith('body')) {
                        data = data.replace(data.charAt(0), `.wkit-wb-Widget_${parent_class} ` + data.charAt(0))
                        final_css += data + '}';
                    } else if (data.charAt(0) == '*') {
                        data = data.replace('*', `.wkit-wb-Widget_${parent_class} `);
                        final_css += data + '}';
                    } else if (data.startsWith('body')) {
                        data = data.replace('body', `.wkit-wb-Widget_${parent_class} `);
                        final_css += data + '}';
                    } else if (data.search("@media") > -1) {
                        data = data.replace("{", ` {  .wkit-wb-Widget_${parent_class}`)
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
            css_data = css_data.replaceAll("{{parent-class}}", `.wkit-wb-Widget_${parent_class}`);
            return css_data;
        }
    }

    const CheckLoop = async (loop_name, multiple) => {

        if (loop_name) {
            let loop_html = Get_loop_html(loop_name);
            loop_html?.length > 0 && loop_html?.map((sl_html, index) => {

                if (sl_html) {

                    var html = stringToHTML(sl_html);
                    Loopvar.map((loop) => {
                        if (loop.name != loop_name) {
                            let findHTML = html.querySelectorAll(`[data-${loop.name}]`);
                            if (findHTML.length > 0) {
                                CheckLoop(loop.name)
                            }
                        }
                    })

                    let new_html = Get_loop_html(loop_name);

                    if (new_html.length > 0) {

                        let loopDataIndex = Loopvar.findIndex((l_data) => l_data.name == loop_name)
                        let loopData = Loopvar[loopDataIndex];

                        if (loopData.type == 'repeater') {
                            let uniqueID = ThreeDigitUnique();

                            let fields = `${loopData.name + "_" + uniqueID} += \`${new_html[0]}\`;`;

                            php_variable += `\nlet ${loopData.name + "_" + uniqueID} = "";
                            \n${loopData.name} ${loopData?.condition ? loopData.condition : ''} && ${loopData.name}.map((r_item, index) => {
                                ${repeater_variable?.[loopData.name] ? repeater_variable?.[loopData.name] : ''}
                                ${fields}
                            })`;

                            data = data.replace(new_html[0], '${' + loopData.name + "_" + uniqueID + '}');

                        } else if (loopData.type == 'gallery') {

                            let uniqueID = ThreeDigitUnique();
                            if (loopData?.repeater != undefined) {

                                var r_html = `\nlet ${loopData.name + "_" + uniqueID} = '';
                                r_item?.${loopData.name} ${loopData?.condition ? loopData.condition : ''} && r_item.${loopData.name}.map((g_image, index) => {
                                    ${loopData.name + "_" + uniqueID} += \`${new_html[0]}\`;
                                })`

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }
                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })
                            } else if (loopData?.popover != undefined) {
                                controller_html += `\nlet ${loopData.name + "_" + uniqueID} = '';
                                ${loopData?.popover}?.${loopData.name} ${loopData?.condition ? loopData.condition : ''} && ${loopData.popover}.${loopData.name}.map((g_image, index) => {
                                    ${loopData.name + "_" + uniqueID} += \`${new_html[0]}\`;
                                })`
                            } else {
                                controller_html += `\nlet ${loopData.name + "_" + uniqueID} = '';
                                ${loopData.name} ${loopData?.condition ? loopData.condition : ''} && ${loopData.name}.map((g_image, index) => {
                                    ${loopData.name + "_" + uniqueID} += \`${new_html[0]}\`;
                                })`
                            }
                            data = data.replace([new_html[0]], '${' + loopData.name + "_" + uniqueID + '}');
                        } else if (loopData.type == 'select2') {
                            let uniqueID = ThreeDigitUnique();
                            if (loopData?.repeater != undefined) {
                                if (!loopData.multiple) {
                                    var r_html = `\nlet ${loopData.name + "_" + uniqueID} = '';
                                        ${loopData.name + "_" + uniqueID} ${loopData?.condition ? loopData.condition : ''} += \`${new_html[0]}\`;`
                                } else {
                                    var r_html = `\nlet ${loopData.name + "_" + uniqueID} = '';
                                    r_item?.${loopData.name}?.length > 0 && r_item.${loopData.name}.map((s2_item, index) => {
                                        ${loopData.name + "_" + uniqueID} ${loopData?.condition ? loopData.condition : ''} += \`${new_html[0]}\`;
                                    })`
                                }

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }
                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })
                            } else if (loopData?.popover != undefined) {
                                if (!loopData.multiple) {
                                    controller_html += `\nlet ${loopData.name + "_" + uniqueID} = '';
                                        ${loopData.name + "_" + uniqueID} ${loopData?.condition ? loopData.condition : ''} += \`${new_html[0]}\`;`
                                } else {
                                    controller_html += `\nlet ${loopData.name + "_" + uniqueID} = '';
                                    ${loopData?.popover}?.${loopData.name}?.length > 0 && ${loopData.popover}.${loopData.name}.map((s2_item, index) => {
                                        ${loopData.name + "_" + uniqueID} ${loopData?.condition ? loopData.condition : ''} += \`${new_html[0]}\`;
                                    })`
                                }
                            } else {
                                if (!loopData.multiple) {
                                    controller_html += `\nlet ${loopData.name + "_" + uniqueID} = '';
                                        ${loopData.name + "_" + uniqueID} ${loopData?.condition ? loopData.condition : ''} += \`${new_html[0]}\`;`
                                } else {
                                    controller_html += `\nlet ${loopData.name + "_" + uniqueID} = '';
                                    ${loopData.name}?.length > 0 && ${loopData.name}.map((s2_item, index) => {
                                        ${loopData.name + "_" + uniqueID} ${loopData?.condition ? loopData.condition : ''} += \`${new_html[0]}\`;
                                    })`
                                }
                            }
                            data = data.replace([new_html[0]], '${' + loopData.name + "_" + uniqueID + '}');
                        } else if (loopData.type == 'headingtags') {
                            let uniqueID = ThreeDigitUnique();
                            if (loopData?.repeater != undefined) {
                                let hTag = new_html[0];
                                let UniqueNumber = keyUniqueID();

                                hTag = hTag.replaceAll(`data-${loopData.name}`, UniqueNumber)
                                hTag = hTag.replaceAll([loopData.name], '${r_item?.' + loopData.name + '}')
                                hTag = hTag.replaceAll([UniqueNumber], `data-${loopData.name}`)

                                var r_html = `let ${loopData.name + "_" + uniqueID} = '';
                                if(r_item?.${loopData.name} ${loopData?.condition ? loopData.condition : ''}){
                                    ${loopData.name + "_" + uniqueID} = \`${hTag}\`;
                                }`

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }
                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })
                            } else if (loopData?.popover != undefined) {
                                let hTag = new_html[0];
                                let UniqueNumber = keyUniqueID();

                                hTag = hTag.replaceAll(`data-${loopData.name}`, UniqueNumber)
                                hTag = hTag.replaceAll([loopData.name], '${' + loopData?.popover + '?.' + loopData.name + '}')
                                hTag = hTag.replaceAll([UniqueNumber], `data-${loopData.name}`)

                                controller_html += `let ${loopData.name + "_" + uniqueID} = '';
                                if(${loopData?.popover}?.${loopData.name} ${loopData?.condition ? loopData.condition : ''}){
                                    ${loopData.name + "_" + uniqueID} = \`${hTag}\`;
                                }`
                            } else {
                                let hTag = new_html[0];
                                let UniqueNumber = keyUniqueID();

                                hTag = hTag.replaceAll(`data-${loopData.name}`, UniqueNumber)
                                hTag = hTag.replaceAll([loopData.name], '${' + loopData.name + '}')
                                hTag = hTag.replaceAll([UniqueNumber], `data-${loopData.name}`)

                                controller_html += `let ${loopData.name + "_" + uniqueID} = '';
                                if(${loopData.name} ${loopData?.condition ? loopData.condition : ''}){
                                    ${loopData.name + "_" + uniqueID} = \`${hTag}\`;
                                }`
                            }
                            data = data.replace([new_html[0]], '${' + loopData.name + '_' + uniqueID + '}');
                        } else if (loopData.type == 'cpt') {
                            let uniqueID = ThreeDigitUnique();
                            let cpt_html = new_html[0];

                            let parent_html = stringToHTML(cpt_html);
                            let cat_html = [];
                            let tag_html = [];

                            if (parent_html.querySelectorAll(`[data-${loopData.name + "_cat"}]`).length > 0) {
                                let r_html_array = parent_html.querySelectorAll(`[data-${loopData.name + "_cat"}]`);

                                Object.values(r_html_array).map((r_html) => {
                                    cat_html.push(r_html.outerHTML);
                                })
                            }

                            if (parent_html.querySelectorAll(`[data-${loopData.name + "_tag"}]`).length > 0) {
                                let r_html_array = parent_html.querySelectorAll(`[data-${loopData.name + "_tag"}]`);

                                Object.values(r_html_array).map((r_html) => {
                                    tag_html.push(r_html.outerHTML);
                                })
                            }

                            let cat_loop = '';
                            if (cat_html?.length > 0) {
                                let inside_html = '';
                                let inside_var = '';
                                cat_html.map((c_html) => {
                                    let unique_cpt = ThreeDigitUnique();
                                    inside_var += `let ${"catList_" + unique_cpt} = '';\n`
                                    cpt_html = cpt_html.replace([c_html], '${catList_' + unique_cpt + '}');

                                    inside_html += `catList_${unique_cpt} += \`${c_html}\`;\n`;

                                })

                                cat_loop += `
                                    ${inside_var}
                                    cpt_val?.catrgory_list?.length > 0 && cpt_val.catrgory_list.slice(0, max_cat_${loopData.unique_id}).map((cat_val) => {
                                        ${inside_html}
                                    })`;
                            }

                            let tag_loop = '';
                            if (tag_html?.length > 0) {
                                let inside_html = '';
                                let inside_var = '';
                                tag_html.map((t_html) => {
                                    let unique_cpt = ThreeDigitUnique();
                                    inside_var += `let ${"tagList_" + unique_cpt} = '';\n`
                                    cpt_html = cpt_html.replace([t_html], '${tagList_' + unique_cpt + '}');

                                    inside_html += `tagList_${unique_cpt} += \`${t_html}\`;\n`;

                                })

                                tag_loop += `
                                    ${inside_var}
                                    cpt_val?.tag_list?.length > 0 && cpt_val.tag_list.slice(0, max_tag_${loopData.unique_id}).map((tag_val) => {
                                        ${inside_html}
                                    })`;
                            }

                            php_variable += `let ${loopData.name + "_" + uniqueID} = '';
                                if(${loopData.name}){

                                    ${loopData.name}_st?.length > 0 && ${loopData.name}_st.map((cpt_item, index) => {
                                        let cpt_val = GetCPT(cpt_item);
                                        ${cat_loop}
                                        ${tag_loop}
                                        ${loopData.name + "_" + uniqueID} += \`${cpt_html}\`;
                                    });
                                }`
                            data = data.replace(new_html[0], '${' + loopData.name + "_" + uniqueID + '}');
                        } else if (loopData.type == 'product_listing') {
                            let uniqueID = ThreeDigitUnique();
                            let cpt_html = new_html[0];

                            let parent_html = stringToHTML(cpt_html);
                            let cat_html = [];
                            let tag_html = [];

                            if (parent_html.querySelectorAll(`[data-${loopData.name + "_cat"}]`).length > 0) {
                                let r_html_array = parent_html.querySelectorAll(`[data-${loopData.name + "_cat"}]`);

                                Object.values(r_html_array).map((r_html) => {
                                    cat_html.push(r_html.outerHTML);
                                })
                            }

                            if (parent_html.querySelectorAll(`[data-${loopData.name + "_tag"}]`).length > 0) {
                                let r_html_array = parent_html.querySelectorAll(`[data-${loopData.name + "_tag"}]`);

                                Object.values(r_html_array).map((r_html) => {
                                    tag_html.push(r_html.outerHTML);
                                })
                            }

                            let cat_loop = '';
                            if (cat_html?.length > 0) {
                                let inside_html = '';
                                let inside_var = '';
                                cat_html.map((c_html) => {
                                    let unique_cpt = ThreeDigitUnique();
                                    inside_var += `let ${"catList_" + unique_cpt} = '';\n`
                                    cpt_html = cpt_html.replace([c_html], '${catList_' + unique_cpt + '}');

                                    inside_html += `catList_${unique_cpt} += \`${c_html}\`;\n`;

                                })

                                cat_loop += `
                                    ${inside_var}
                                    cpt_val?.catrgory_list?.length > 0 && cpt_val.catrgory_list.slice(0, max_cat_${loopData.unique_id}).map((cat_val) => {
                                        ${inside_html}
                                    })`;
                            }

                            let tag_loop = '';
                            if (tag_html?.length > 0) {
                                let inside_html = '';
                                let inside_var = '';
                                tag_html.map((t_html) => {
                                    let unique_cpt = ThreeDigitUnique();
                                    inside_var += `let ${"tagList_" + unique_cpt} = '';\n`
                                    cpt_html = cpt_html.replace([t_html], '${tagList_' + unique_cpt + '}');

                                    inside_html += `tagList_${unique_cpt} += \`${t_html}\`;\n`;

                                })

                                tag_loop += `
                                    ${inside_var}
                                    cpt_val?.tag_list?.length > 0 && cpt_val.tag_list.slice(0, max_tag_${loopData.unique_id}).map((tag_val) => {
                                        ${inside_html}
                                    })`;
                            }

                            php_variable += `let ${loopData.name + "_" + uniqueID} = '';

                                    ${loopData.name}_st?.length > 0 && ${loopData.name}_st.map((cpt_item, index) => {
                                        let cpt_val = GetCPT(cpt_item);
                                        ${cat_loop}
                                        ${tag_loop}
                                        ${loopData.name + "_" + uniqueID} += \`${cpt_html}\`;
                                    });`
                            data = data.replace(new_html[0], '${' + loopData.name + "_" + uniqueID + '}');
                        } else if (loopData.type == 'taxonomy') {
                            let uniqueID = ThreeDigitUnique();
                            let cpt_html = new_html[0];

                            php_variable += `let ${loopData.name + "_" + uniqueID} = '';
                                if(taxonomy_${loopData.unique_id}){

                                    let post_type = post_type_${loopData.unique_id} ? post_type_${loopData.unique_id} : 'post';
                                    let per_page = max_post_${loopData.unique_id} ? max_post_${loopData.unique_id} : '10';

                                    if ( ${loopData.name}_st?.length > 0 ) {
                                        ${loopData.name}_st.map( (t_item, index) => {
                                            ${loopData.name + "_" + uniqueID} += \`${cpt_html}\`;
                                    })
                                    } else {
                                        ${loopData.name + "_" + uniqueID} += '<h6 style="color: red;text-align: center;display: block;">No Result Found</h6>';
                                    }
                                }`
                            data = data.replace([new_html[0]], '${' + loopData.name + "_" + uniqueID + '}');
                        }
                    }
                } else {
                    return false;
                }
            })
        }
    }

    /**
     * Render HTML Add COdition
     * 
     * @since 1.0.9
     * @param {Get Controller Details} controller 
     * @param {Chech Dependency} parent 
     * @returns 
     */
    const Condition_controller = (controller, parent) => {
        var controller_condition = '';

        if (controller?.conditions && controller?.condition_value?.values?.length > 0) {
            controller.condition_value.values.map((cnd, index) => {

                if (cnd.name && cnd.operator) {
                    if (switcherArray.includes(cnd.name)) {
                        if (parent) {
                            if (cnd.operator == '!=') {
                                controller_condition += `!${parent}?.${cnd.name}`;
                            } else {
                                controller_condition += `${parent}?.${cnd.name}`;
                            }
                        } else {
                            if (cnd.operator == '!=') {
                                controller_condition += `!${cnd.name}`;
                            } else {
                                controller_condition += `${cnd.name}`;
                            }
                        }
                    } else {
                        if (parent) {
                            controller_condition += `(${parent}?.${cnd.name} ${cnd.operator} "${cnd.value}")`;
                        } else {
                            controller_condition += `(${cnd.name} ${cnd.operator} "${cnd.value}")`;
                        }
                    }
                    if (index < (controller?.condition_value?.values?.length - 1)) {
                        controller_condition += `${controller?.condition_value.relation === 'or' ? '||' : '&&'}`;
                    }
                }
            })
        }

        if (controller_condition) {
            return `&& ( ${controller_condition} )`;
        } else {
            return '';
        }
    }

    const Controller_validation = (controller, loop_name, popover) => {

        let validation = "";

        if (controller.type == "iconscontrol") {
            if (loop_name) {
                if (controller.parent_class || controller.parent_class == undefined) {
                    var icon_inner = `<span class="tp-title-icon"><i class="'+r_item?.${controller.name}+'"></i></span>`;
                } else {
                    var icon_inner = `<i class="'+r_item?.${controller.name}+'"></i>`;
                }
                data = data.replaceAll(`{{${controller.name}}}`, "${grnp_" + controller.name + " }")
                let r_html = `\nlet grnp_${controller.name} = r_item?.${controller.name} != undefined ${Condition_controller(controller, 'r_item')} ? '${icon_inner}' : '';\n`

                if (repeater_variable?.[loop_name]) {
                    r_html = repeater_variable?.[loop_name] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })

            } else if (popover) {
                if (controller.parent_class || controller.parent_class == undefined) {
                    var icon_inner = `<span class="tp-title-icon"><i class="'+${popover}.${controller.name}+'"></i></span>`;
                } else {
                    var icon_inner = `<i class="'+${popover}.${controller.name}+'"></i>`;
                }
                data = data.replaceAll(`{{${controller.name}}}`, "${pop_" + controller.name + "}")
                validation += `\nlet pop_${controller.name} = ${popover}?.${controller.name} != undefined ${Condition_controller(controller, popover)} ? '${icon_inner}' : '';\n`

            } else {
                if (controller.parent_class || controller.parent_class == undefined) {
                    var icon_inner = `<span class="tp-title-icon"><i class="'+${controller.name}+'"></i></span>`;
                } else {
                    var icon_inner = `<i class="'+${controller.name}+'"></i>`;
                }

                data = data.replaceAll(`{{${controller.name}}}`, "${g_" + controller.name + "}")
                validation += `\nlet g_${controller.name} = ${controller.name} != undefined ${Condition_controller(controller)} ? '${icon_inner}' : '';\n`

            }
        } else if (controller.type == "url") {
            if (data.search(`{{${controller.name}-url}}`)) {
                if (loop_name) {
                    let r_html = `\nlet grnp_${controller.name}_url = r_item?.${controller.name}?.url && r_item?.${controller.name}?.url != undefined ?  r_item?.${controller.name}.url : "";`
                    data = data.replaceAll(`{{${controller.name}-url}}`, "${grnp_" + controller.name + "_url}")

                    if (repeater_variable?.[loop_name]) {
                        r_html = repeater_variable?.[loop_name] + r_html;
                    }

                    repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })

                } else if (popover) {
                    validation += `\nlet pop_${controller.name}_url =  ${popover}?.${controller.name}?.url && ${popover}?.${controller.name}?.url != undefined ? ${popover}?.${controller.name}.url : "";`
                    data = data.replaceAll(`{{${controller.name}-url}}`, "${pop_" + controller.name + "_url}")
                } else {
                    validation += `\nlet g_${controller.name}_url = ${controller.name}?.url && ${controller.name}?.url != undefined ? ${controller.name}.url : "";`
                    data = data.replaceAll(`{{${controller.name}-url}}`, "${g_" + controller.name + "_url}")
                }
            }

            if (data.search(`{{${controller.name}-is_external}}`)) {
                if (loop_name) {
                    data = data.replaceAll(`{{${controller.name}-is_external}}`, "${grnp_" + controller.name + "_target}")
                    let r_html = `\nlet grnp_${controller.name}_target = r_item?.${controller.name}?.target && r_item?.${controller.name}?.target != undefined ?  r_item?.${controller.name}.target : "";`

                    if (repeater_variable?.[loop_name]) {
                        r_html = repeater_variable?.[loop_name] + r_html;
                    }

                    repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })
                } else if (popover) {
                    data = data.replaceAll(`{{${controller.name}-is_external}}`, "${pop_" + controller.name + "_target}")
                    validation += `\nlet pop_${controller.name}_target = ${popover}?.${controller.name}?.target && ${popover}?.${controller.name}?.target != undefined ? ${popover}?.${controller.name}?.target : "";`
                } else {
                    data = data.replaceAll(`{{${controller.name}-is_external}}`, "${g_" + controller.name + "_target}")
                    validation += `\nlet g_${controller.name}_target = ${controller.name}?.target && ${controller.name}?.target != undefined ? ${controller.name}.target : "";`
                }
            }

            if (data.search(`{{${controller.name}-nofollow}}`)) {
                if (loop_name) {
                    data = data.replaceAll(`{{${controller.name}-nofollow}}`, "${grnp_" + controller.name + "_nofollow}")
                    let r_html = `\nlet grnp_${controller.name}_nofollow = r_item?.${controller.name}?.nofollow && r_item?.${controller.name}?.nofollow != undefined ?  r_item?.${controller.name}.nofollow : "";`

                    if (repeater_variable?.[loop_name]) {
                        r_html = repeater_variable?.[loop_name] + r_html;
                    }

                    repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })

                } else if (popover) {
                    data = data.replaceAll(`{{${controller.name}-nofollow}}`, "${pop_" + controller.name + "_nofollow}")
                    validation += `\nlet pop_${controller.name}_nofollow = ${popover}?.${controller.name}?.nofollow && ${popover}?.${controller.name}?.nofollow != undefined ? ${popover}?.${controller.name}?.nofollow : "";`
                } else {
                    data = data.replaceAll(`{{${controller.name}-nofollow}}`, "${g_" + controller.name + "_nofollow}")
                    validation += `\nlet g_${controller.name}_nofollow = ${controller.name}?.nofollow && ${controller.name}?.nofollow != undefined ? ${controller.name}.nofollow : "";`
                }
            }

            if (data.search(`{{${controller.name}-custom_atr}}=""`)) {
                if (loop_name) {
                    data = data.replaceAll(`{{${controller.name}-custom_atr}}=""`, "${grnp_" + controller.name + "_attr}")
                    let r_html = `\nlet grnp_${controller.name}_ctmArt = r_item?.${controller.name}?.attr && r_item?.${controller.name}?.attr != undefined ?  r_item?.${controller.name}.attr : "";
                    let grnp_${controller.name}_attr = ''

                    if (grnp_${controller.name}_ctmArt) {
                        let main_array = grnp_${controller.name}_ctmArt.split(',');
                        main_array?.length > 0 && main_array.map((atr) => {
                            if(atr){
                                let sub_array = atr.split("|");
                                grnp_${controller.name}_attr += (sub_array[0]?.trim() ? sub_array[0]?.trim() : '') + "='" + (sub_array[1]?.trim() ? sub_array[1]?.trim() : '') + "' ";
                            }
                        })
                    }`

                    if (repeater_variable?.[loop_name]) {
                        r_html = repeater_variable?.[loop_name] + r_html;
                    }

                    repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })

                } else if (popover) {
                    data = data.replaceAll(`{{${controller.name}-custom_atr}}=""`, "${pop_" + controller.name + "_attr}")
                    validation += `\nlet pop_${controller.name}_ctmArt = ${popover}?.${controller.name}?.attr && ${popover}?.${controller.name}?.attr != undefined ? ${popover}?.${controller.name}?.attr : "";
                    let pop_${controller.name}_attr = ''

                    if (pop_${controller.name}_ctmArt) {
                        let main_array = pop_${controller.name}_ctmArt.split(',');
                        main_array?.length > 0 && main_array.map((atr) => {
                            if(atr){
                                let sub_array = atr.split("|");
                                pop_${controller.name}_attr += (sub_array[0]?.trim() ? sub_array[0]?.trim() : '') + "='" + (sub_array[1]?.trim() ? sub_array[1]?.trim() : '') + "' ";
                            }
                        })
                    }`;
                } else {
                    data = data.replaceAll(`{{${controller.name}-custom_atr}}=""`, "${g_" + controller.name + "_attr}")
                    validation += `\nlet g_${controller.name}_ctmArt = ${controller.name}?.attr != undefined ? ${controller.name}.attr : "";
                    let g_${controller.name}_attr = ''

                    if (g_${controller.name}_ctmArt) {
                        let main_array = g_${controller.name}_ctmArt.split(',');
                        main_array?.length > 0 && main_array.map((atr) => {
                            if(atr){
                                let sub_array = atr.split("|");
                                g_${controller.name}_attr += (sub_array[0]?.trim() ? sub_array[0]?.trim() : '') + "='" + (sub_array[1]?.trim() ? sub_array[1]?.trim() : '') + "' ";
                            }
                        })
                    }`;
                }
            }
        } else if (controller.type == "media") {
            if (loop_name) {
                data = data.replaceAll(`{{${controller.name}}}`, "${grnp_" + controller.name + "}")
                let r_html = `\nlet grnp_${controller.name} = r_item?.${controller.name}?.url != undefined ${Condition_controller(controller, 'r_item')} ? r_item?.${controller.name}.url : "";`

                if (repeater_variable?.[loop_name]) {
                    r_html = repeater_variable?.[loop_name] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })

            } else if (popover) {
                data = data.replaceAll(`{{${controller.name}}}`, "${pop_" + controller.name + "}")
                validation += `\nlet pop_${controller.name} = ${popover}?.${controller.name}?.url != undefined ${Condition_controller(controller, popover)} ? ${popover}.${controller.name}.url : "";`
            } else {
                data = data.replaceAll(`{{${controller.name}}}`, "${g_" + controller.name + "}")
                validation += `\nlet g_${controller.name} = ${controller.name} && ${controller.name}.url && ${controller.name}.url != undefined ${Condition_controller(controller)} ? ${controller.name}.url : "";`
            }
        } else if (controller.type == "popover") {
            controller.fields && controller.fields.map((innre_controller) => {
                validation += Controller_validation(innre_controller, '', controller.name);
            })
        } else if (controller.type == "normalhover") {
            controller.fields && controller.fields.map((innre_controller) => {

                validation += Controller_validation(innre_controller);
            })
        } else if (controller.type == "repeater") {
            Loopvar.push({ 'type': controller.type, 'name': controller.name, 'repeater': loop_name, 'condition': Condition_controller(controller, loop_name) });
            let html = Get_loop_html(controller.name);

            if (html) {
                html.map((html_data, index) => {
                    repeater_variable[controller.name] = '';
                    let repeater_html = html_data;

                    controller.fields.map((field) => {
                        validation += Controller_validation(field, controller.name);

                        if (repeater_html) {
                            if (html_data.search(`data-${field.name}="{${field.name}}"`) > -1) {
                                const stringToHTML = function (str) {
                                    let parser = new DOMParser(),
                                        doc = parser.parseFromString(str, 'text/html');
                                    return doc.body;
                                };

                                let loop_html = stringToHTML(repeater_html);
                                if (loop_html.querySelector(`[data-${field.name}]`) && loop_html.querySelector(`[data-${field.name}]`).outerHTML) {
                                    let r_html = loop_html.querySelector(`[data-${field.name}]`).outerHTML;
                                    data = data.replaceAll(r_html, `'+${field.name + index}+'`)
                                }
                            } else {
                                if (field.type == 'media' || field.type == 'iconscontrol') {
                                    data = data.replaceAll(`{{${field.name}}}`, `'+${field.name}+'`)
                                } else {
                                    data = data.replaceAll(`{{${field.name}}}`, '${r_item.' + field.name + '}')
                                }
                            }

                            data = data.replaceAll('{loop-class-repeater}', 'tp-repeater-item-${r_item._key}')
                            data = data.replaceAll(`{{${controller.name}_index}}`, '${index}');
                            data = data.replaceAll(`{{${controller.name}_uid}}`, '${r_item._key}');
                        }
                    })
                })
            } else {
                controller.fields.map((field) => {
                    validation += Controller_validation(field, controller.name);
                })
            }

        } else if (controller.type == "gallery") {
            if (popover) {
                Loopvar.push({ 'type': controller.type, 'name': controller.name, 'popover': popover, 'condition': Condition_controller(controller, loop_name) });
            } else {
                Loopvar.push({ 'type': controller.type, 'name': controller.name, 'repeater': loop_name, 'condition': Condition_controller(controller, loop_name) });
            }

            let html = Get_loop_html(controller.name);

            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {
                        data = data.replaceAll("{{" + controller.name + "}}", "${g_image.url}")
                    }
                })
            }
        } else if (controller.type == "select2") {
            if (popover) {
                Loopvar.push({ 'type': controller.type, 'name': controller.name, 'popover': popover, 'multiple': controller.multiple, 'condition': Condition_controller(controller, loop_name) });
            } else {
                Loopvar.push({ 'type': controller.type, 'name': controller.name, 'repeater': loop_name, 'multiple': controller.multiple, 'condition': Condition_controller(controller, loop_name) });
            }

            let html = Get_loop_html(controller.name);

            if (html) {
                html.map((html_data, index) => {
                    let select2_html = html_data;
                    if (select2_html) {
                        if (!controller.multiple) {
                            data = data.replaceAll("{{" + controller.name + "}}", "${" + controller.name + ".value}")
                        } else {
                            data = data.replaceAll("{{" + controller.name + "}}", "${s2_item?.value}")
                        }
                    }
                })
            }
        } else if (controller.type == "slider") {
            var slider_data = '';
            controller.size_units && controller.size_units.map((data, index) => {
                slider_data += `g_${controller.name}_list['${data.type}'] = { "type": "${data.type}", "min": ${data.min}, "max": ${data.max}, "step": ${data.step} };\n`
            })
            extra_functions += `const ${controller.name}Function = (unit, type) => {
                var g_${controller.name}_list = [];
                ${slider_data}
                return g_${controller.name}_list[unit][type];
            };\n`
        } else if (controller.type == "headingtags") {
            if (popover) {
                Loopvar.push({ 'type': controller.type, 'name': controller.name, 'popover': popover, 'condition': Condition_controller(controller, loop_name) });
            } else {
                Loopvar.push({ 'type': controller.type, 'name': controller.name, 'repeater': loop_name, 'condition': Condition_controller(controller, loop_name) });
            }
        } else if (controller.type == "switcher") {
            if (loop_name) {
                data = data.replaceAll(`{{${controller.name}}}`, "${grnp_" + controller.name + "}")
                let r_html = `\nlet grnp_${controller.name} = r_item.${controller.name} ${Condition_controller(controller, 'r_item')} ? '${controller.return_value}' : "";`

                if (repeater_variable?.[loop_name]) {
                    r_html = repeater_variable?.[loop_name] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })

            } else if (popover) {
                data = data.replaceAll(`{{${controller.name}}}`, "${pop_" + controller.name + "}")
                validation += `\nlet pop_${controller.name} = ${popover}?.${controller.name} != undefined ${Condition_controller(controller, popover)} ? '${controller.return_value}' : "";`
            } else {
                data = data.replaceAll(`{{${controller.name}}}`, "${g_" + controller.name + "}")
                validation += `\nlet g_${controller.name} = ${controller.name} && ${controller.name} != undefined ${Condition_controller(controller)} ? '${controller.return_value}' : "";`
            }
        } else if (controller.type == 'cpt') {
            Loopvar.push({ 'type': controller.type, 'name': controller.name, 'popover': popover, 'unique_id': controller.unique_id });

            extra_states += `const [${controller.name}_st, set${controller.name}_st] = useState([]);`
            extra_functions += `const ${controller.name}_fun = async (value, type) => {

                    let filters = {
                        type: ${controller.name},
                        include: include_${controller.unique_id},
                        exclude: exclude_${controller.unique_id},
                        max_post: max_post_${controller.unique_id},
                        order: order_${controller.unique_id},
                        order_by: order_by_${controller.unique_id},
                        max_cat: max_cat_${controller.unique_id},
                        max_tag: max_tag_${controller.unique_id},
                    }

                    if (value != undefined && type != undefined) {
                        filters = Object.assign({}, filters, { [type]: value })
                    }

                    let data = await CPT_array(filters);

                    await set${controller.name}_st(data);
                }\n`;

            onload_call += `${controller.name}_fun(${controller.name});`
            frontend_function += `
                const cpt_${controller.unique_id}_flt = {
                    type: ${controller.name},
                    include: include_${controller.unique_id},
                    exclude: exclude_${controller.unique_id},
                    max_post: max_post_${controller.unique_id},
                    order: order_${controller.unique_id},
                    order_by: order_by_${controller.unique_id},
                    max_cat: max_cat_${controller.unique_id},
                    max_tag: max_tag_${controller.unique_id},
                };
            
            const ${controller.name}_st = CPT_array(cpt_${controller.unique_id}_flt);`
            let html = Get_loop_html(controller.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        data = data.replaceAll("{{title_" + controller.name + "}}", "${cpt_val?.title}")
                        data = data.replaceAll("{{description_" + controller.name + "}}", "${cpt_val?.description}")
                        data = data.replaceAll("{{cat_name_" + controller.name + "}}", "${cat_val?.name}")
                        data = data.replaceAll("{{cat_url_" + controller.name + "}}", "${cat_val.url}")
                        data = data.replaceAll("{{tag_name_" + controller.name + "}}", "${tag_val.name}")
                        data = data.replaceAll("{{tag_url_" + controller.name + "}}", "${tag_val.url}")
                        data = data.replaceAll("{{thumbnail_" + controller.name + "}}", "${cpt_val?.thumbnail}")
                        data = data.replaceAll("{{post_link_" + controller.name + "}}", "${cpt_val?.post_link}")
                        data = data.replaceAll("{{post_date_" + controller.name + "}}", "${cpt_val?.post_date}")
                        data = data.replaceAll("{{auth_name_" + controller.name + "}}", "${cpt_val?.auth_name}")
                        data = data.replaceAll("{{auth_id_" + controller.name + "}}", "${cpt_val?.auth_id}")
                        data = data.replaceAll("{{auth_email_" + controller.name + "}}", "")
                        data = data.replaceAll("{{auth_profile_" + controller.name + "}}", "${cpt_val?.auth_profile}")
                        data = data.replaceAll("{{auth_url_" + controller.name + "}}", "${cpt_val?.auth_url}")
                    }
                })
            }
        } else if (controller.type == 'product_listing') {
            Loopvar.push({ 'type': controller.type, 'name': controller.name, 'popover': popover, 'unique_id': controller.unique_id });

            extra_states += `const [${controller.name}_st, set${controller.name}_st] = useState([]);`
            extra_functions += `const ${controller.name}_fun = async (value, type) => {

                    let filters = {
                        type: 'product',
                        include: include_${controller.unique_id},
                        exclude: exclude_${controller.unique_id},
                        max_post: max_post_${controller.unique_id},
                        order: order_${controller.unique_id},
                        order_by: order_by_${controller.unique_id},
                        max_cat: max_cat_${controller.unique_id},
                        max_tag: max_tag_${controller.unique_id},
                    }

                    if (value != undefined && type != undefined) {
                        filters = Object.assign({}, filters, { [type]: value })
                    }

                    let data = await CPT_array(filters);

                    await set${controller.name}_st(data);
                }\n`;

            onload_call += `${controller.name}_fun(${controller.name});`
            frontend_function += `
                const cpt_${controller.unique_id}_flt = {
                    type: 'product',
                    include: include_${controller.unique_id},
                    exclude: exclude_${controller.unique_id},
                    max_post: max_post_${controller.unique_id},
                    order: order_${controller.unique_id},
                    order_by: order_by_${controller.unique_id},
                    max_cat: max_cat_${controller.unique_id},
                    max_tag: max_tag_${controller.unique_id},
                };
            
            const ${controller.name}_st = CPT_array(cpt_${controller.unique_id}_flt);`
            let html = Get_loop_html(controller.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        data = data.replaceAll("{{title_" + controller.name + "}}", "${cpt_val?.title}")
                        data = data.replaceAll("{{description_" + controller.name + "}}", "${cpt_val?.description}")
                        data = data.replaceAll("{{cat_name_" + controller.name + "}}", "${cat_val?.name}")
                        data = data.replaceAll("{{cat_url_" + controller.name + "}}", "${cat_val.url}")
                        data = data.replaceAll("{{tag_name_" + controller.name + "}}", "${tag_val.name}")
                        data = data.replaceAll("{{tag_url_" + controller.name + "}}", "${tag_val.url}")
                        data = data.replaceAll("{{thumbnail_" + controller.name + "}}", "${cpt_val?.thumbnail}")
                        data = data.replaceAll("{{post_link_" + controller.name + "}}", "${cpt_val?.post_link}")
                        data = data.replaceAll("{{post_date_" + controller.name + "}}", "${cpt_val?.post_date}")
                        data = data.replaceAll("{{auth_name_" + controller.name + "}}", "${cpt_val?.auth_name}")
                        data = data.replaceAll("{{auth_id_" + controller.name + "}}", "${cpt_val?.auth_id}")
                        data = data.replaceAll("{{auth_email_" + controller.name + "}}", "")
                        data = data.replaceAll("{{auth_profile_" + controller.name + "}}", "${cpt_val?.auth_profile}")
                        data = data.replaceAll("{{auth_url_" + controller.name + "}}", "${cpt_val?.auth_url}")
                    }
                })
            }
        } else if (controller.type == 'taxonomy') {
            Loopvar.push({ 'type': controller.type, 'name': controller.name, 'popover': popover, 'unique_id': controller.unique_id });

            extra_states += `const [${controller.name}_st, set${controller.name}_st] = useState([]);`

            extra_functions += `const ${controller.name}_fun = async (value, type) => {

                let filters = {
                    type: ${controller.name},
                    max_post: max_post_${controller.unique_id},
                    post_type: post_type_${controller.unique_id} ? post_type_${controller.unique_id} : '',
                }

                if (value != undefined && type != undefined) {
                    filters = Object.assign({}, filters, { [type]: value })
                }

                let data = await Get_taxo_list(filters);

                await set${controller.name}_st(data);
            }\n`;

            onload_call += `${controller.name}_fun(${controller.name});`


            frontend_function += `
                const taxo_${controller.unique_id}_flt = {
                    type: ${controller.name},
                    max_post: max_post_${controller.unique_id},
                    post_type: post_type_${controller.unique_id} ? post_type_${controller.unique_id} : '',
                };
            
            const ${controller.name}_st = Get_taxo_list(taxo_${controller.unique_id}_flt);`

            let html = Get_loop_html(controller.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        data = data.replaceAll("{{title_" + controller.name + "}}", "${t_item.name}")
                        data = data.replaceAll("{{description_" + controller.name + "}}", "${t_item.description}")
                        data = data.replaceAll("{{taxo_image_" + controller.name + "}}", "${t_item.thumbnail}")
                        data = data.replaceAll("{{taxo_link_" + controller.name + "}}", "${t_item.link}")
                        data = data.replaceAll("{{taxo_slug_" + controller.name + "}}", "${t_item.slug}")
                    }
                })
            }
        } else {
            if (loop_name) {
                data = data.replaceAll(`{{${controller.name}}}`, "${grnp_" + controller.name + "}")
                let r_html = `\nlet grnp_${controller.name} = r_item.${controller.name} ${Condition_controller(controller, 'r_item')} ? r_item.${controller.name} : "";`

                if (repeater_variable?.[loop_name]) {
                    r_html = repeater_variable?.[loop_name] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [loop_name]: r_html })

            } else if (popover) {
                data = data.replaceAll(`{{${controller.name}}}`, "${pop_" + controller.name + "}")
                validation += `\nlet pop_${controller.name} = ${popover}?.${controller.name} != undefined ${Condition_controller(controller, popover)} ? ${popover}.${controller.name} : "";`
            } else {
                data = data.replaceAll(`{{${controller.name}}}`, "${g_" + controller.name + "}")
                validation += `\nlet g_${controller.name} = ${controller.name} && ${controller.name} != undefined ${Condition_controller(controller)} ? ${controller.name} : "";`
            }
        }

        return validation;
    }

    /**
     * to get switcher controller and cpt name
     * 
     * @since 1.0.33
     */
    all_files.CardItems.cardData[0].layout.map((section) => {
        if (section?.inner_sec?.length > 0) {
            section.inner_sec.map((controller) => {

                if (controller.type == "cpt" || controller.type == "product_listing" || controller.type == "taxonomy") {
                    if (!cpt_check.includes(controller.name) && (controller.type == "cpt" || controller.type == "product_listing")) {
                        cpt_check.push(controller.name);
                    }

                    if (!dynamic_controller.includes(controller.type)) {
                        dynamic_controller.push(controller.type);
                    }

                }

                if (controller.type == 'switcher') {
                    switcherArray.push(controller.name);
                }

                if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                    controller.fields.map((fields) => {
                        if (fields.type == 'switcher') {
                            switcherArray.push(fields.name);
                        }
                    })
                }
            })
        }
    })

    all_files.CardItems.cardData[0].style.map((section) => {
        if (section?.inner_sec?.length > 0) {
            section.inner_sec.map((controller) => {
                if (controller.type == "cpt" || controller.type == "product_listing" || controller.type == "taxonomy") {
                    if (!cpt_check.includes(controller.name) && (controller.type == "cpt" || controller.type == "product_listing")) {
                        cpt_check.push(controller.name);
                    }

                    if (!dynamic_controller.includes(controller.type)) {
                        dynamic_controller.push(controller.type);
                    }
                }

                if (controller.type == 'switcher') {
                    switcherArray.push(controller.name);
                }

                if (controller.type == 'repeater' || controller.type == 'normalhover' || controller.type == 'popover') {
                    controller.fields.map((fields) => {
                        if (fields.type == 'switcher') {
                            switcherArray.push(fields.name);
                        }
                    })
                }
            })
        }
    })

    all_files.CardItems.cardData[0].layout.map((data) => {
        data.inner_sec.map((controller) => {
            controller_html += Controller_validation(controller)
        })
    })

    all_files.CardItems.cardData[0].style.map((data) => {
        data.inner_sec.map((controller) => {
            controller_html += Controller_validation(controller)
        })
    })

    Loopvar.length > 0 && Loopvar.map((data) => {
        CheckLoop(data.name)
    })

    let tags = {
        "pmgc": {
            "text": "Pmgc_Text",
            "number": "Pmgc_Text",
            "media": "Pmgc_Media",
            "gallery": "Pmgc_Media",
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
            "cpt": "Pmgc_Select",
            "taxonomy": "Pmgc_Select",
            "select2": "Pmgc_select2",
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

    all_files.CardItems.cardData[0].layout.map((data, l_index) => {
        layout += `React.createElement(PanelBody, { title: __("${data.section}"), initialOpen: ${l_index == 0 ? true : false} },\n`;
        data.inner_sec.map((component) => {
            if (component.type == "repeater" || component.type == "popover" || component.type == "normalhover" || component.type == "cpt" || component.type == "product_listing" || component.type == "taxonomy") {
                component.fields.map((inner_controller) => {
                    if (!pmgc.includes(tags.pmgc[inner_controller.type])) {
                        if (tags?.pmgc?.[inner_controller.type]) {
                            pmgc.push(tags.pmgc[inner_controller.type])
                        }
                    }

                    if (inner_controller.type == 'datetime') {
                        if (!(Dynamic_components.includes('DateTimePicker'))) {
                            Dynamic_components.push('DateTimePicker')
                        }
                    }

                    if (component.type == "normalhover" || component.type == "cpt" || component.type == "product_listing" || component.type == "taxonomy") {
                        attributes.push(inner_controller.name)
                    }
                })
            }

            if (!pmgc.includes(tags.pmgc[component.type])) {
                if (component.type == 'datetime') {
                    if (!(Dynamic_components.includes('DateTimePicker'))) {
                        Dynamic_components.push('DateTimePicker')
                    }
                }
                if (tags?.pmgc?.[component.type]) {
                    pmgc.push(tags.pmgc[component.type])
                }
            }

            if (!attributes.includes(component.name)) {
                attributes.push(component.name)
            }

            layout += Temp_component(component, "js", "", "", switcherArray)
            php_layout += Temp_component(component, "php")
        })
        layout += '),'
    })

    all_files.CardItems.cardData[0].style.map((data, s_index) => {
        style += `React.createElement(PanelBody, { title: __("${data.section}"), initialOpen: ${s_index == 0 ? true : false} },\n`;
        data.inner_sec.map((component) => {
            if (component.type == "repeater" || component.type == "popover" || component.type == "normalhover") {
                component.fields.map((inner_controller) => {
                    if (!pmgc.includes(tags.pmgc[inner_controller.type])) {
                        pmgc.push(tags.pmgc[inner_controller.type])
                    }

                    if (component.type == "normalhover") {
                        attributes.push(inner_controller.name)
                    }
                })
            }

            if (!pmgc.includes(tags.pmgc[component.type])) {
                pmgc.push(tags.pmgc[component.type])
            }

            if (!attributes.includes(component.name)) {
                attributes.push(component.name)
            }
            style += Temp_component(component, "js", "", "", switcherArray)
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

    let trim_name = Image_link().widgetdata.name.trim();
    var widget_info = Object.assign({}, Image_link().widgetdata, { 'wkit-version': wdkitData.WDKIT_VERSION, 'name': trim_name })
    let widget_data = { 'widgetdata': widget_info };

    var json_section = JSON.stringify(all_files.CardItems.cardData);
    var json_widget = JSON.stringify(widget_data);
    var editor_link = JSON.stringify(all_files.Editor_data);

    let js_function = keyUniqueID();
    var js_file = `
    class ${Name_validation("file").replaceAll("-", "_")} {
        constructor() {
            this.${Name_validation("file").replaceAll("-", "_")}_${js_function}();
        }
    
        ${Name_validation("file").replaceAll("-", "_")}_${js_function}() {
    const { useState, useEffect } = wp.element;
    const { __ } = wp.i18n;
    const { registerBlockType } = wp.blocks;
   
    const {
        PanelBody,
        ${Dynamic_components}
    } = wp.components;

    ${dynamic_controller.length > 0 ? `
        const {
            select,
            resolveSelect,
        } = wp.data;`
            :
            ''
        }
   
    const {
       Pmgc_PanelTabs,
       Pmgc_Tab,
       ${(pmgc?.length > 0) ? pmgc + "," : ""}
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
   
    registerBlockType('wdkit/wb-${all_files.WcardData.widgetdata.widget_id}', {
        title: __('${Name_validation()}'), // Block title.
        description: __('${all_files.WcardData.widgetdata.description}'),
        icon: React.createElement("i", {
                class: "${all_files.WcardData.widgetdata.w_icon}",
                style: { fontSize: "20px" }
        }),
        category: '${all_files?.WcardData?.widgetdata?.category ? all_files.WcardData.widgetdata.category : 'common'}',
        keywords: [${Key_words()}],
   
        edit: (props) => {
        const [device, setDevice] = useState('');
        
        ${extra_states}

        ${dynamic_controller.length > 0 ? `
            useEffect(() => {
                ${onload_call}
            }, [])` : ''}

        ${dynamic_controller.includes('taxonomy') ? `

            const Get_taxo_list = async (t_data) => {

                if (t_data?.post_type != 'select type') {

                    const taxonomies = await resolveSelect('core').getTaxonomies({ type: t_data.post_type }) || [];
                    const taxonomy = await taxonomies.find(tax => tax.slug === t_data.type);

                    if (!taxonomy) {
                        return [];
                    }
                }

                var query = {
                    per_page: t_data.max_post,
                    offset: 0,
                    _embed: true,
                };

                const newdata = await resolveSelect('core').getEntityRecords('taxonomy', t_data.type, query) || [];

                return await newdata;
            }`
            : ''}

        ${cpt_check.length > 0 ?
            `const CPT_array = async (f_data) => {

                var query = {
                    per_page: f_data.max_post,
                    order: f_data.order,
                    offset: 0,
                    status: 'publish',
                    _embed: true,
                };

                if (f_data?.order_by && f_data?.order_by != 'none') {
                    query = Object.assign({}, query, { 'orderby': f_data.order_by })
                }

                if (f_data.include) {
                    let in_array = f_data.include.split(',');
                    query = Object.assign({}, query, { 'include': in_array })
                }

                if (f_data.exclude) {
                    let in_array = f_data.exclude.split(',');
                    query = Object.assign({}, query, { 'exclude': in_array })
                }

                const newdata = await resolveSelect('core').getEntityRecords('postType', f_data.type, query) || [];

                return await newdata;
            }
                
            const GetCPT = (data) => {
                let cpt_obj = {
                    'title' : data?.title?.rendered ? data.title.rendered : '',
                    'description' : data?.excerpt?.rendered ? data.excerpt.rendered : '',
                    'thumbnail' : data._embedded?.['wp:featuredmedia']?.[0]?.source_url ? data._embedded['wp:featuredmedia'][0].source_url : '${wdkitData.WDKIT_URL + "assets/images/jpg/placeholder.png"}',
                    'post_link' : data?.link ? data.link : '',
                    'post_date' : data?.date ? data.date : '',
                    'auth_name' : data?._embedded.author?.[0]?.name ? data._embedded.author[0].name : '',
                    'auth_id' : data?._embedded?.author?.[0]?.id ? data._embedded.author[0].id : '',
                    'auth_profile' : data?._embedded.author?.[0]?.avatar_urls?.['48'] ? data._embedded.author[0].avatar_urls['48'] : '${wdkitData.WDKIT_URL + "assets/images/jpg/placeholder.png"}',
                    'auth_url' : data?._embedded?.author?.[0]?.link ? data?._embedded.author[0].link : '',
                    'catrgory_list' : data?._embedded?.['wp:term']?.[0] ? data._embedded['wp:term'][0] : [],
                    'tag_list' : data?._embedded?.['wp:term']?.[1] ? data._embedded['wp:term'][1] : [],
                };

                return cpt_obj;
            }`
            :
            ''
        }

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

                ${responsive_code ? `
            useEffect(() => {
                const {
                    __experimentalGetPreviewDeviceType: getPreviewDeviceType,
                } = wp.data.select('core/edit-site') || wp.data.select('core/edit-post') || wp.data.select("core/edit-widgets");
                var selectDevices = '';
                if (getPreviewDeviceType() == 'Desktop') {
                    selectDevices = 'md'
                } else if (getPreviewDeviceType() == 'Tablet') {
                    selectDevices = 'sm'
                } else if (getPreviewDeviceType() == 'Mobile') {
                    selectDevices = 'xs'
                }
                setDevice(selectDevices)
            }, [])` : ''}
            
            useEffect(() => {
                setTimeout(() => {
                    if(jQuery('.wdkit-block-' + block_id)?.length > 0){
                        main_function_${all_files.WcardData.widgetdata.widget_id}(jQuery('.wdkit-block-' + block_id))
                    }
                }, 1500);
            }, [attributes])

            const main_function_${all_files.WcardData.widgetdata.widget_id} = ($scope) => {
                let is_editable = wp?.blocks ? true : false;
                ${JSON.parse(js)}
            }
   
            const inspectorControls = (isSelected && (React.createElement(InspectorControls, null,
                React.createElement(Fragment, null,
                    React.createElement(Pmgc_PanelTabs, null,
                        React.createElement(Pmgc_Tab, { tabTitle: __("Layout") },
                           ${layout}
                        ),
                        React.createElement(Pmgc_Tab, { tabTitle: __("Style") },
                           ${style}
                        ),
                    )
                )
            )));

            if (props.attributes.block_id) {
                var element = document.getElementsByClassName("tpgb-block-" + block_id)
                if (null != element && "undefined" != typeof element) {
                    Pmgc_CssGenerator(props.attributes, 'wdkit', "wb-${all_files.WcardData.widgetdata.widget_id}", block_id, false, props.clientId);
                }
            }

            ${controller_html}
            ${php_variable}
   
            return (
                React.createElement(Fragment, null, inspectorControls,
                    wp.element.createElement("div", {
                    class: "wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id} wdkit-block-"+block_id+"",
                        dangerouslySetInnerHTML: {
                            __html: \`${data}\`
                        }
                    })
                )
            );
        },
   
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

        ${dynamic_controller.includes('taxonomy') ? `

            const Get_taxo_list = (t_data) => {

                if (t_data?.post_type != 'select type') {
                    const taxonomies = select('core').getTaxonomies({ type: t_data.post_type }) || [];
                    const taxonomy = taxonomies.find(tax => tax.slug === t_data.type);

                    if (!taxonomy) {
                        return [];
                    }
                }

                var query = {
                    per_page: t_data.max_post,
                    offset: 0,
                    _embed: true,
                };

                const newdata = select('core').getEntityRecords('taxonomy', t_data.type, query) || [];

                return newdata;
            }`
            : ''}

        ${cpt_check.length > 0 ?
            `const CPT_array = (f_data) => {

                let query = {
                    per_page: f_data.max_post,
                    order: f_data.order,
                    offset: 0,
                    status: 'publish',
                    _embed: true,
                };

                if (f_data?.order_by && f_data?.order_by != 'none') {
                    query = Object.assign({}, query, { 'orderby': f_data.order_by })
                }

                if (f_data.include) {
                    let in_array = f_data.include.split(',');
                    query = Object.assign({}, query, { 'include': in_array })
                }

                if (f_data.exclude) {
                    let in_array = f_data.exclude.split(',');
                    query = Object.assign({}, query, { 'exclude': in_array })
                }

                let data = select('core').getEntityRecords('postType', f_data.type, query) || [];

                return data;
            }
                
            const GetCPT = (data) => {
                let cpt_obj = {
                    'title': data?.title?.rendered ? data.title.rendered : '',
                    'description': data?.excerpt?.rendered ? data.excerpt.rendered : '',
                    'thumbnail': data._embedded?.['wp:featuredmedia']?.[0]?.source_url ? data._embedded['wp:featuredmedia'][0].source_url : '${wdkitData.WDKIT_URL + "assets/images/jpg/placeholder.png"}',
                    'post_link': data?.link ? data.link : '',
                    'post_date': data?.date ? data.date : '',
                    'auth_name': data?._embedded.author?.[0]?.name ? data._embedded.author[0].name : '',
                    'auth_id': data?._embedded?.author?.[0]?.id ? data._embedded.author[0].id : '',
                    'auth_profile': data?._embedded.author?.[0]?.avatar_urls?.['48'] ? data._embedded.author[0].avatar_urls['48'] : '${wdkitData.WDKIT_URL + "assets/images/jpg/placeholder.png"}',
                    'auth_url': data?._embedded?.author?.[0]?.link ? data?._embedded.author[0].link : '',
                    'catrgory_list': data?._embedded?.['wp:term']?.[0] ? data._embedded['wp:term'][0] : [],
                    'tag_list': data?._embedded?.['wp:term']?.[1] ? data._embedded['wp:term'][1] : [],
                };

                return cpt_obj;
            }`
            :
            ''
        }

        ${frontend_function}

        ${controller_html}
        ${php_variable}

        let styleCss = Pmgc_CssGenerator(attributes, 'wdkit', "wb-${all_files.WcardData.widgetdata.widget_id}", block_id, true);

        return (
            React.createElement(Fragment, null,
                wp.element.createElement("div", {
                    class: "wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id} wdkit-block-" + block_id + "",
                    dangerouslySetInnerHTML: {
                        __html: \`${data}\`
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

    var js_code = external_cdn.includes('jQuery') ?
        `var $this = this;
        setTimeout(() => {
            let main_html = jQuery('.wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id}');

            jQuery.each(main_html, function (idx, scope) {
                $this.main_function_${uniqe_class}(jQuery(scope));
            });
        }, 800);`
        :
        `setTimeout(() => {
            let main_html = document.querySelectorAll(".wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id}")    
                main_html.forEach(element => {
                    this.main_function_${uniqe_class}([element])
                });
        }, 800);`

    var external_js_file = js != `""` ? `class MyClass_${uniqe_class} {

        constructor() {
            window.addEventListener('DOMContentLoaded', (event) => {
                ${js_code}
            });
        }

        main_function_${uniqe_class}($scope) {
        let is_editable = wp?.blocks ? true : false;
            ${JSON.parse(js)} 
        }
    }

    new MyClass_${uniqe_class}();`
        : "";

    var css_file = `${Css_validation()}`;

    let unique_js_id = keyUniqueID();
    let unique_css_id = keyUniqueID();
    let unique_function = keyUniqueID();

    let jqueryLoad = external_cdn.includes('jQuery') ? `array('jquery')` : '[]';

    var php_file = `<?php
    function wb_${Name_validation('file').replaceAll("-", "_")}() { 

        ${(js_link || external_js_file || css_link) ? `if ( ( !empty( $_GET['action'] ) && 'edit' === $_GET['action'] ) || ! is_admin() ){
            ${js_link}
            ${external_js_file ? `wp_enqueue_script("wbuilder-cgb-block_external${unique_js_id}-js", WDKIT_SERVER_PATH .'/gutenberg/${Name_validation("folder")}/index.js', ${jqueryLoad}, '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', true);` : ''}

            ${css_link}
        }` : ''}

        wp_register_script('wbuilder-cgb-block_${unique_js_id}-js', WDKIT_SERVER_PATH .'/gutenberg/${Name_validation("folder")}/${Name_validation("file")}.js',
            array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wkit-editor-block-pmgc' ), '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', true
        );

        ${dynamic_controller.length > 0 ?
            `/**
            * Get post type list.
            *
            * @since 1.0.34
            */
            function set_options_${all_files.WcardData.widgetdata.widget_id}()
            {
                $ctp = array();
                $order_list = array();
                $cpt_array = array();
                $order_array = array();

                if(class_exists('Wdkit_Dynamic_Listing_Files')){
                    $wdkit_widget = new Wdkit_Dynamic_Listing_Files();
        
                    if(method_exists($wdkit_widget, 'Get_post_list')){
                        $ctp = $wdkit_widget->Get_post_list();
                    }
        
                    if(method_exists($wdkit_widget, 'Get_orderBy_List')){
                        $order_list = $wdkit_widget->Get_orderBy_List();
                    }
                }

                foreach ($ctp as $key => $value) {
                    array_push($cpt_array, array( $value['name'],  $value['label'] ));
                }
                
                foreach ($order_list as $key => $value) {
                    array_push($order_array, array( $value['name'],  $value['label'] ));
                }

                return array(
                    'post_list' => $cpt_array,
                    'order_by' => $order_array,
                );
            }
    
            wp_localize_script(
                'wbuilder-cgb-block_${unique_js_id}-js',
                'wdkit_post_type', // The object name that will be available in JavaScript
                set_options_${all_files.WcardData.widgetdata.widget_id}()
            );` : ''
        }

        ${dynamic_controller.includes('taxonomy') > 0 ?
            `/**
            * Get post type list.
            *
            * @since 1.0.38
            */   
            wp_localize_script(
                'wbuilder-cgb-block_${unique_js_id}-js',
                'wdkit_taxonomy', // The object name that will be available in JavaScript
                get_taxonomies(),
            );` : ''
        }
    
        ${css_file ? `wp_register_style('wbuilder-cgb-style_${unique_css_id}-css', WDKIT_SERVER_PATH .'/gutenberg/${Name_validation("folder")}/${Name_validation("file")}.css', is_admin() ? array( 'wp-editor' ) : null, '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', false );` : ''}
    
        register_block_type(
            'wdkit/wb-${all_files.WcardData.widgetdata.widget_id}', array(
                'attributes' => [
                    'block_id' => [
                        'type' => 'string',
                        'default' => '',
                    ],
                    ${php_layout}
    
                ],
                ${css_file ? `'style'         => 'wbuilder-cgb-style_${unique_css_id}-css',` : ''}
                'editor_script' => 'wbuilder-cgb-block_${unique_js_id}-js',
                'render_callback' => 'wkit_render_callback_${unique_function}'
            )
        );
    
    }
    add_action( 'init', 'wb_${Name_validation('file').replaceAll("-", "_")}' );
    
    function wkit_render_callback_${unique_function}($atr, $cnt) { 
        $output = $cnt;
    
        return $output;
    }`

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
        'gutenberg_js': js_file,
        'gutenberg_php_file': php_file,
        'gutenberg_css': css_file,
        'external_js_file': external_js_file,
        'json_file': json_data,
        "plugin": "gutenberg",
        "d_image": d_image ? d_image : '',
        "call": call,
    }

    var formData = new FormData();
    formData.append('action', 'get_wdesignkit');
    formData.append('kit_nonce', wdkitData.kit_nonce);
    formData.append('type', 'wkit_create_widget');
    formData.append('image', image_file);
    formData.append('value', JSON.stringify(values));

    await axios.post(ajaxurl, formData)
        .then((response) => {
            if (response.status == 200) {
                if (document.querySelector('.wb-function-call')) {
                    document.querySelector('.wb-function-call').click();
                }
                responses.api = response.data;
            }
        }).catch(error => console.log(error));

    var NewImage = all_files.WcardData.widgetdata.w_image,
        NewImageExt = all_files.WcardData.widgetdata.img_ext;

    const Get_image_info = async () => {

        let Json_URL = `${wdkitData.WDKIT_SERVER_PATH}/gutenberg/${Name_validation("folder")}/${Name_validation("file")}.json`;

        let New_json = await axios.get(Json_URL).then(async (response) => { return await response?.data })

        if (New_json?.widget_data?.widgetdata?.w_image) {
            NewImage = New_json?.widget_data?.widgetdata?.w_image;
            NewImageExt = New_json?.widget_data?.widgetdata?.img_ext;
        }
    }

    let token = get_user_login();
    if (token && (call == 'sync')) {
        await Get_image_info();
        let data = {
            'token': token.token,
            'type': 'add',
            'title': Name_validation(),
            'content': all_files.WcardData.widgetdata.description,
            'builder': all_files.WcardData.widgetdata.type,
            'w_data': json_data,
            'w_uniq': all_files.WcardData.widgetdata.widget_id,
            "w_image": NewImage,
            "w_imgext": NewImageExt,
            "w_version": all_files.WcardData.widgetdata.widget_version,
            "w_updates": all_files.WcardData.widgetdata.version_detail,
            "r_id": all_files?.WcardData?.widgetdata?.r_id ? all_files?.WcardData?.widgetdata?.r_id : 0,
        }

        let form_arr = { 'type': 'wkit_add_widget', 'widget_info': JSON.stringify(data) }
        await wdKit_Form_data(form_arr).then((result) => {
            if (result?.success) {
            } else {
                let error_msg = result?.message ? result?.message : 'Operation Fail';
            }
            responses.ajax = { 'data': result };
        })
    }

    return responses;
}

export default CreatFile;