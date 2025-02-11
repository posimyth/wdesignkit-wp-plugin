import { Elementer_data } from "../components-data/component_custom";
import axios from "axios";
import { wdKit_Form_data, get_user_login } from '../../helper/helper-function';

const Elementor_file_create = async (call, all_files, html, css, js, old_folder, image_file, d_image) => {

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

    const Html_validation = (html) => {
        let html_data = JSON.parse(html)

        let repeater_html = stringToHTML(html_data)
        let data = repeater_html.head.innerHTML + repeater_html.body.innerHTML;
        var h_data = data.replaceAll("'", "\\'");

        return h_data;
    }

    var site_url = wdkitData.WDKIT_SITE_URL,
        upload_path = wdkitData.WDKIT_SERVER_PATH,
        textdomain = "wdesignkit",
        data = Html_validation(html),
        js_link = [],
        css_link = [],
        php_variable = "",
        repeater_variable = {},
        php_variable_validation = "",
        layout_data_elementor = "",
        style_data_elementor = "",
        script_id = keyUniqueID(),
        style_id = keyUniqueID(),
        Loopvar = [],
        responses = { 'ajax': '', 'api': '' },
        ControlsArray = [],
        dynamic_controller = [];

    var NameSpaceArray = {
        'selecttemplate': 'use wdkit\\wdkit_wbcontroller\\Wdkit_Wb_Elementor_Controller;',
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

    const Change_url = () => {
        if (call == "update" || call == "sync" && old_folder != undefined) {

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
                        final_css += data + '}';
                    } else if (data.charAt(0) == '.') {
                        data = data.replace('.', `.wkit-wb-Widget_${parent_class} .`);
                        let pattern = /,.*{/;

                        if ((data.search(/,\s*\./) > -1) && data.match(pattern)) {
                            data = data.replace(/,\s*\./g, `, .wkit-wb-Widget_${parent_class} .`);
                        }
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
                let img_path = `${upload_path}/elementor/${folder}/${image}.${img_ext}`
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
                let img_path = `${upload_path}/elementor/${folder}/${image}.${img_ext}`
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
                let img_path = `${upload_path}/elementor/${folder}/${image}.${img_ext}`
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

    const Key_words = () => {
        if (all_files && all_files.WcardData && all_files.WcardData.widgetdata && all_files.WcardData.widgetdata.key_words) {
            let wrods = all_files.WcardData.widgetdata.key_words,
                key_words = '';

            wrods.forEach((element, index) => {
                key_words += `'${element}'`

                if (index != wrods.length - 1) {
                    key_words += `,`
                }
            });

            return key_words;
        } else {
            return `'WDesignKit'`;
        }
    }

    const CheckLoop = async (loop_name) => {

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

                            let fields = `$${loopData.name + "_" + uniqueID} .= '${new_html[0]}';`;
                            php_variable += `$${loopData.name + "_" + uniqueID} = '';
                            if ( $settings['${loopData.name}'] ) {
                                foreach ( $settings['${loopData.name}'] as $key => $r_item ) {
                                    ${repeater_variable?.[loopData.name] ? repeater_variable?.[loopData.name] : ''}
                                    ${fields}
                                }
                            }`;

                            data = data.replace(new_html[0], `'.$${loopData.name + "_" + uniqueID}.'`);

                        } else if (loopData.type == 'gallery') {
                            let uniqueID = ThreeDigitUnique();
                            if (loopData?.repeater != undefined) {
                                var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                if($r_item['${loopData.name}']){
                                    foreach ( ${loopData?.repeater ? '$r_item' : '$settings'}['${loopData.name}'] as $image ) {
                                        $${loopData.name + "_" + uniqueID} .= '${new_html[index]}';
                                    }
                                }`

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }
                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })
                            } else {
                                php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                if($settings['${loopData.name}']){
                                    foreach ( ${loopData?.repeater ? '$r_item' : '$settings'}['${loopData.name}'] as $image ) {
                                        $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                    }
                                }`
                            }
                            data = data.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
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
                                    inside_var += `$${"catList_" + unique_cpt} = '';\n`
                                    cpt_html = cpt_html.replace([c_html], `'.$${"catList_" + unique_cpt}.'`);

                                    inside_html += `$${"catList_" + unique_cpt} .= '${c_html}';\n`;

                                })

                                cat_loop += `
                                    ${inside_var}
                                    if( !empty ($p_item['categories']) ){
                                        foreach( $p_item['categories'] as $cat){
                                            ${inside_html}
                                        }
                                    }`;
                            }

                            let tag_loop = '';
                            if (tag_html?.length > 0) {
                                let inside_html = '';
                                let inside_var = '';
                                tag_html.map((t_html) => {
                                    let unique_cpt = ThreeDigitUnique();
                                    inside_var += `$${"tagList_" + unique_cpt} = '';\n`

                                    cpt_html = cpt_html.replace([t_html], `'.$${"tagList_" + unique_cpt}.'`);

                                    inside_html += `$${"tagList_" + unique_cpt} .= '${t_html}';\n`;

                                })

                                tag_loop += `
                                    ${inside_var}
                                    if( !empty ($p_item['tags']) ){
                                        foreach( $p_item['tags'] as $tag){
                                            ${inside_html}
                                        }
                                    }`;
                            }

                            php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                if(!empty($settings['post_type_${loopData.unique_id}'])){

                                $type = $settings['post_type_${loopData.unique_id}'];
                                $per_page = isset($settings['max_post_${loopData.unique_id}']) ? $settings['max_post_${loopData.unique_id}'] : '10';
                                $order = !empty($settings['order_${loopData.unique_id}']) ? $settings['order_${loopData.unique_id}'] : 'DESC'; 
                                $order_by = !empty($settings['order_by_${loopData.unique_id}']) ? $settings['order_by_${loopData.unique_id}'] : 'date'; 
                                $include = !empty( $settings['include_${loopData.unique_id}'] ) ? explode( ',', $settings['include_${loopData.unique_id}'] ) : array();
                                $exclude = !empty( $settings['exclude_${loopData.unique_id}'] ) ? explode( ',', $settings['exclude_${loopData.unique_id}'] ) : array();
                                $cat_count = isset( $settings['max_cat_${loopData.unique_id}'] ) ? $settings['max_cat_${loopData.unique_id}'] : 3;
                                $tag_count = isset( $settings['max_tag_${loopData.unique_id}'] ) ? $settings['max_tag_${loopData.unique_id}'] : 3;

                                    $${loopData.name + "_" + uniqueID + "_array"} = !empty($this->get_post_query($type, $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count)) ? $this->get_post_query($type, $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count) : [];
                                    foreach ( $${loopData.name + "_" + uniqueID + "_array"} as $p_item ) {
                                        ${cat_loop}
                                        ${tag_loop}
                                        $${loopData.name + "_" + uniqueID} .= '${cpt_html}';
                                    }
                                }`
                            data = data.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
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
                                    inside_var += `$${"catList_" + unique_cpt} = '';\n`
                                    cpt_html = cpt_html.replace([c_html], `'.$${"catList_" + unique_cpt}.'`);

                                    inside_html += `$${"catList_" + unique_cpt} .= '${c_html}';\n`;

                                })

                                cat_loop += `
                                    ${inside_var}
                                    if( !empty ($p_item['categories']) ){
                                        foreach( $p_item['categories'] as $cat){
                                            ${inside_html}
                                        }
                                    }`;
                            }

                            let tag_loop = '';
                            if (tag_html?.length > 0) {
                                let inside_html = '';
                                let inside_var = '';
                                tag_html.map((t_html) => {
                                    let unique_cpt = ThreeDigitUnique();
                                    inside_var += `$${"tagList_" + unique_cpt} = '';\n`

                                    cpt_html = cpt_html.replace([t_html], `'.$${"tagList_" + unique_cpt}.'`);

                                    inside_html += `$${"tagList_" + unique_cpt} .= '${t_html}';\n`;

                                })

                                tag_loop += `
                                    ${inside_var}
                                    if( !empty ($p_item['tags']) ){
                                        foreach( $p_item['tags'] as $tag){
                                            ${inside_html}
                                        }
                                    }`;
                            }

                            php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';

                                $per_page = isset($settings['max_post_${loopData.unique_id}']) ? $settings['max_post_${loopData.unique_id}'] : '10';
                                $order = !empty($settings['order_${loopData.unique_id}']) ? $settings['order_${loopData.unique_id}'] : 'DESC'; 
                                $order_by = !empty($settings['order_by_${loopData.unique_id}']) ? $settings['order_by_${loopData.unique_id}'] : 'date'; 
                                $include = !empty( $settings['include_${loopData.unique_id}'] ) ? explode( ',', $settings['include_${loopData.unique_id}'] ) : array();
                                $exclude = !empty( $settings['exclude_${loopData.unique_id}'] ) ? explode( ',', $settings['exclude_${loopData.unique_id}'] ) : array();
                                $cat_count = isset( $settings['max_cat_${loopData.unique_id}'] ) ? $settings['max_cat_${loopData.unique_id}'] : 3;
                                $tag_count = isset( $settings['max_tag_${loopData.unique_id}'] ) ? $settings['max_tag_${loopData.unique_id}'] : 3;


                                    $${loopData.name + "_" + uniqueID + "_array"} = !empty($this->get_post_query('product', $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count)) ? $this->get_post_query('product', $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count) : [];
                                    foreach ( $${loopData.name + "_" + uniqueID + "_array"} as $p_item ) {
                                        ${cat_loop}
                                        ${tag_loop}
                                        $${loopData.name + "_" + uniqueID} .= '${cpt_html}';
                                    }`
                            data = data.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if (loopData.type == 'taxonomy') {
                            let uniqueID = ThreeDigitUnique();
                            let cpt_html = new_html[0];

                            php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                if(!empty($settings['taxonomy_${loopData.unique_id}'])){

                                    $taxo_type = $settings['taxonomy_${loopData.unique_id}'];
                                    $post_type = !empty($settings['post_type_${loopData.unique_id}']) ? $settings['post_type_${loopData.unique_id}'] : 'post';
                                    $per_page = !empty($settings['max_post_${loopData.unique_id}']) ? $settings['max_post_${loopData.unique_id}'] : '10';
                                    $${loopData.name + "_" + uniqueID + "_array"} = !empty($this->get_taxonomy_list($taxo_type, $post_type, $per_page)) ? $this->get_taxonomy_list($taxo_type, $post_type, $per_page) : [];

                                    if ( !empty($${loopData.name + "_" + uniqueID + "_array"}) ) {
                                        foreach ( $${loopData.name + "_" + uniqueID + "_array"} as $t_item ) {
                                            $${loopData.name + "_" + uniqueID} .= '${cpt_html}';
                                        }
                                    } else {
                                        $${loopData.name + "_" + uniqueID} .= '<h6 style="color: red;text-align: center;display: block;">No Result Found</h6>';
                                    }
                                }`
                            data = data.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if (loopData.type == 'select2') {
                            let uniqueID = ThreeDigitUnique();

                            if (loopData?.repeater) {
                                if (loopData?.multiple) {
                                    var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                    if ( $r_item['${loopData.name}'] && $r_item['${loopData.name}'] != "undefined" ) {
                                        foreach ( $r_item['${loopData.name}'] as $s_item  ) {
                                            $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                        }
                                    }`
                                } else {
                                    var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                    if ( $r_item['${loopData.name}'] && $r_item['${loopData.name}'] != "undefined" ) {
                                            $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                    }`
                                }

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }

                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })

                            } else {
                                if (loopData?.multiple) {
                                    php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                    if ( ${loopData?.repeater ? '$r_item' : '$settings'}['${loopData.name}'] && ${loopData?.repeater ? '$r_item' : '$settings'}['${loopData.name}'] != "undefined" ) {
                                        foreach ( ${loopData?.repeater ? '$r_item' : '$settings'}['${loopData.name}'] as $s_item  ) {
                                            $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                        }
                                    }`
                                } else {
                                    php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                    if ( ${loopData?.repeater ? '$r_item' : '$settings'}['${loopData.name}'] && ${loopData?.repeater ? '$r_item' : '$settings'}['${loopData.name}'] != "undefined" ) {
                                            $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                    }`
                                }
                            }

                            data = data.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if (loopData.type == 'headingtags') {
                            let uniqueID = ThreeDigitUnique();
                            if (loopData?.repeater != undefined) {
                                let hTag = new_html[0];
                                let UniqueNumber = keyUniqueID();

                                hTag = hTag.replaceAll(`data-${loopData.name}`, UniqueNumber)
                                hTag = hTag.replaceAll([loopData.name], `'.$r_item["${loopData.name}"].'`)
                                hTag = hTag.replaceAll([UniqueNumber], `data-${loopData.name}`)

                                var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                if($r_item['${loopData.name}']){
                                    $${loopData.name + "_" + uniqueID} = '${hTag}';
                                }`

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }
                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })
                            } else {
                                let hTag = new_html[0];
                                let UniqueNumber = keyUniqueID();
                                hTag = hTag.replaceAll(`data-${loopData.name}`, UniqueNumber)
                                hTag = hTag.replaceAll([loopData.name], `'.$settings["${loopData.name}"].'`)
                                hTag = hTag.replaceAll([UniqueNumber], `data-${loopData.name}`)
                                php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                if($settings['${loopData.name}']){
                                    $${loopData.name + "_" + uniqueID} = '${hTag}';
                                }`
                            }
                            data = data.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        }
                    }
                } else {
                    return false;
                }
            })
        }
    }

    const Controller_html_loop = (compo, repeater) => {

        if (!ControlsArray.includes(compo.type)) {
            ControlsArray.push(compo.type)
        }

        var settings = "";
        if (compo.type == 'icon' || compo.type == "iconscontrol") {

            if (data.search(compo.name) >= 1) {
                if (repeater != undefined) {
                    let r_html = `$${compo.name} = "";
                        if(!empty($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['value'])){
                            ob_start();
                                \\Elementor\\Icons_Manager::render_icon($r_item['${compo.name}'],['aria-hidden'=>'true']);
                                $Icon = ob_get_contents();
                            ob_end_clean();
                            $${compo.name} .= ${compo.parent_class || compo.parent_class == undefined ? `'<span class="tp-title-icon">'.$Icon.'</span>';` : '$Icon;'}
                        };\n`

                    if (repeater_variable?.[repeater]) {
                        r_html = repeater_variable?.[repeater] + r_html;
                    }

                    repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
                } else {
                    php_variable_validation += `$${compo.name} = "";
                        if(!empty($settings['${compo.name}']) && !empty($settings['${compo.name}']['value'])){
                            ob_start();
                                \\Elementor\\Icons_Manager::render_icon($settings['${compo.name}'],['aria-hidden'=>'true']);
                                $Icon = ob_get_contents();
                            ob_end_clean();
                            $${compo.name} .= ${compo.parent_class || compo.parent_class == undefined ? `'<span class="tp-title-icon">'.$Icon.'</span>';` : '$Icon;'}
                        };\n`
                }

                data = data.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }
        } else if (compo.type == 'media') {
            if (data.search(compo.name) >= 1) {
                if (repeater != undefined) {
                    let r_html = `$${compo.name} = !empty($r_item['${compo.name}']['url']) ? esc_url( $r_item['${compo.name}']['url'] ) : '';\n`

                    if (repeater_variable?.[repeater]) {
                        r_html = repeater_variable?.[repeater] + r_html;
                    }
                    repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })

                } else {
                    php_variable_validation += `$${compo.name} = !empty($settings['${compo.name}']['url']) ? esc_url( $settings['${compo.name}']['url'] ) : '';\n`
                }

                data = data.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }
        } else if (compo.type == 'repeater') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater });
            let html = Get_loop_html(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let repeater_html = html_data;

                    repeater_variable[compo.name] = '';

                    compo.fields.map((field) => {
                        settings += Controller_html_loop(field, compo.name);

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
                                    data = data.replaceAll(r_html, `'.$${field.name + index}.'`)
                                }
                            } else {
                                if (field.type == 'media' || field.type == 'iconscontrol') {
                                    data = data.replaceAll(`{{${field.name}}}`, `' . $${field.name} . '`)
                                } else if (field.type == 'url') {
                                    data = data.replaceAll(`{{${field.name}-url}}`, `' . $${field.name}_url . '`)
                                    data = data.replaceAll(`{{${field.name}-is_external}}`, `' . $${field.name}_is_external . '`)
                                    data = data.replaceAll(`{{${field.name}-nofollow}}`, `' . $${field.name}_nofollow . '`)
                                } else {
                                    data = data.replaceAll(`{{${field.name}}}`, `' . $r_item['${field.name}'] . '`)
                                }
                            }
                            data = data.replaceAll(`{loop-class-repeater}`, `elementor-repeater-item-' .esc_attr($r_item['_id']) . '`)
                            data = data.replaceAll(`{{${compo.name}_index}}`, `'.$key.'`);
                            data = data.replaceAll(`{{${compo.name}_uid}}`, `'.esc_attr($r_item['_id']).'`);
                        }
                    })
                })
            } else {
                compo.fields.map((field) => {
                    settings += Controller_html_loop(field, compo.name);
                })
            }
        } else if (compo.type == 'gallery') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater });

            let html = Get_loop_html(compo.name);

            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {
                        data = data.replaceAll("{{" + compo.name + "}}", "'.esc_url( $image['url'] ).'")
                    }
                })
            }
        } else if (compo.type == 'select2') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'multiple': compo.multiple });

            let html = Get_loop_html(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let select2_html = html_data;
                    if (select2_html) {
                        if (compo.multiple) {
                            data = data.replaceAll("{{" + compo.name + "}}", "' .$s_item. '")
                        } else {
                            data = data.replaceAll("{{" + compo.name + "}}", `' .$settings['${compo.name}']. '`)
                        }
                    }
                })
            }
        } else if (compo.type == 'url') {

            if (repeater != undefined) {
                let r_html = `$${compo.name}_is_external = !empty($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['is_external']) ? '_blank' : '';\n`
                r_html += `$${compo.name}_url = !empty($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['url'])? esc_url( $r_item['${compo.name}']['url'] ) : '';\n`
                r_html += `$${compo.name}_nofollow = !empty($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['nofollow'])? 'nofollow' : '';\n`

                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
            } else {
                php_variable_validation += `$${compo.name}_url = !empty($settings['${compo.name}']) && !empty($settings['${compo.name}']['url']) ? esc_url( $settings['${compo.name}']['url'] ) : '';\n`
                php_variable_validation += `$${compo.name}_is_external = !empty($settings['${compo.name}']) && !empty($settings['${compo.name}']['is_external']) ? '_blank' : '';\n`
                php_variable_validation += `$${compo.name}_nofollow = !empty($settings['${compo.name}']) && !empty($settings['${compo.name}']['nofollow']) ? 'nofollow' : '';\n`
                php_variable_validation += `$${compo.name}_custmAtr = !empty($settings['${compo.name}']) && !empty($settings['${compo.name}']['custom_attributes']) ? $settings['${compo.name}']['custom_attributes'] : '';
                $${compo.name}_atr = '';
        
                if( !empty( $${compo.name}_custmAtr ) ){
                    $${compo.name}_custmAtr = trim( $${compo.name}_custmAtr, " " );
                    $main_array = explode( ",", $${compo.name}_custmAtr );

                    foreach ( $main_array as $key => $value ) {
                        if( !empty( $value ) ){
                            $ct_array = explode( "|", $value );
                            $${compo.name}_atr .= $ct_array[0] .' = "'. $ct_array[1].'"';
                        }
                    }
                }`
            }

            data = data.replaceAll(`{{${compo.name}-is_external}}`, `'.$${compo.name}_is_external.'`)
            data = data.replaceAll(`{{${compo.name}-url}}`, `'.$${compo.name}_url.'`)
            data = data.replaceAll(`{{${compo.name}-nofollow}}`, `'.$${compo.name}_nofollow.'`)
            data = data.replaceAll(`{{${compo.name}-custom_atr}}=""`, `'.$${compo.name}_atr.'`)

        } else if (compo.type == 'selecttemplate') {

            if (repeater != undefined) {
                let r_html = `$${compo.name} = !empty($r_item['${compo.name}']) ? Wdkit_Wb_Elementor_Controller::wdkit_elementor()->frontend->get_builder_content_for_display( $r_item['${compo.name}'] ) : '';\n`

                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
            } else {
                php_variable_validation += `$${compo.name} = !empty($settings['${compo.name}']) ? Wdkit_Wb_Elementor_Controller::wdkit_elementor()->frontend->get_builder_content_for_display( $settings['${compo.name}'] ) : '';\n`
            }
            data = data.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
        } else if (compo.type == 'popover') {
            if (compo.fields) {
                compo.fields.map((controller) => {
                    settings += Controller_html_loop(controller);
                })
            }
        } else if (compo.type == 'normalhover') {
            if (compo.fields) {
                compo.fields.map((controller) => {
                    settings += Controller_html_loop(controller);
                })
            }
        } else if (compo.type == 'number') {

            if (repeater != undefined) {
                let r_html = `$${compo.name} = isset($r_item['${compo.name}']) ? $r_item['${compo.name}'] : '';\n`

                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
            } else {
                php_variable_validation += `$${compo.name} = isset($settings['${compo.name}']) ? $settings['${compo.name}'] : '';\n`
            }

            data = data.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
        } else if (compo.type == 'headingtags') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater });
        } else if (compo.type == 'cpt') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'unique_id': compo.unique_id });

            let html = Get_loop_html(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        data = data.replaceAll("{{title_" + compo.name + "}}", "'.$p_item['title'].'")
                        data = data.replaceAll("{{description_" + compo.name + "}}", "'.$p_item['description'].'")
                        data = data.replaceAll("{{cat_name_" + compo.name + "}}", "'.$cat['name'].'")
                        data = data.replaceAll("{{cat_url_" + compo.name + "}}", "'.$cat['url'].'")
                        data = data.replaceAll("{{tag_name_" + compo.name + "}}", "'.$tag['name'].'")
                        data = data.replaceAll("{{tag_url_" + compo.name + "}}", "'.$tag['url'].'")
                        data = data.replaceAll("{{thumbnail_" + compo.name + "}}", "'.$p_item['image'].'")
                        data = data.replaceAll("{{post_link_" + compo.name + "}}", "'.$p_item['post_link'].'")
                        data = data.replaceAll("{{post_date_" + compo.name + "}}", "'.$p_item['post_date'].'")
                        data = data.replaceAll("{{auth_name_" + compo.name + "}}", "'.$p_item['author_name'].'")
                        data = data.replaceAll("{{auth_id_" + compo.name + "}}", "'.$p_item['author_id'].'")
                        data = data.replaceAll("{{auth_email_" + compo.name + "}}", "'.$p_item['author_email'].'")
                        data = data.replaceAll("{{auth_profile_" + compo.name + "}}", "'.$p_item['author_avatar'].'")
                        data = data.replaceAll("{{auth_url_" + compo.name + "}}", "'.$p_item['author_url'].'")
                    }
                })
            }
        } else if (compo.type == 'product_listing') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'unique_id': compo.unique_id });

            let html = Get_loop_html(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        data = data.replaceAll("{{title_" + compo.name + "}}", "'.$p_item['title'].'")
                        data = data.replaceAll("{{description_" + compo.name + "}}", "'.$p_item['description'].'")
                        data = data.replaceAll("{{cat_name_" + compo.name + "}}", "'.$cat['name'].'")
                        data = data.replaceAll("{{cat_url_" + compo.name + "}}", "'.$cat['url'].'")
                        data = data.replaceAll("{{tag_name_" + compo.name + "}}", "'.$tag['name'].'")
                        data = data.replaceAll("{{tag_url_" + compo.name + "}}", "'.$tag['url'].'")
                        data = data.replaceAll("{{thumbnail_" + compo.name + "}}", "'.$p_item['image'].'")
                        data = data.replaceAll("{{post_link_" + compo.name + "}}", "'.$p_item['post_link'].'")
                        data = data.replaceAll("{{post_date_" + compo.name + "}}", "'.$p_item['post_date'].'")
                        data = data.replaceAll("{{auth_name_" + compo.name + "}}", "'.$p_item['author_name'].'")
                        data = data.replaceAll("{{auth_id_" + compo.name + "}}", "'.$p_item['author_id'].'")
                        data = data.replaceAll("{{auth_email_" + compo.name + "}}", "'.$p_item['author_email'].'")
                        data = data.replaceAll("{{auth_profile_" + compo.name + "}}", "'.$p_item['author_avatar'].'")
                        data = data.replaceAll("{{auth_url_" + compo.name + "}}", "'.$p_item['author_url'].'")
                    }
                })
            }
        } else if (compo.type == 'taxonomy') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'unique_id': compo.unique_id });

            let html = Get_loop_html(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        data = data.replaceAll("{{title_" + compo.name + "}}", "'.$t_item['name'].'")
                        data = data.replaceAll("{{description_" + compo.name + "}}", "'.$t_item['description'].'")
                        data = data.replaceAll("{{taxo_image_" + compo.name + "}}", "'.$t_item['thumbnail'].'")
                        data = data.replaceAll("{{taxo_link_" + compo.name + "}}", "'.$t_item['front_link'].'")
                        data = data.replaceAll("{{taxo_slug_" + compo.name + "}}", "'.$t_item['slug'].'")
                    }
                })
            }
        } else {
            if (repeater != undefined) {
                data = data.replaceAll(`{{${compo.name}}}`, `' . $r_item['${compo.name}'] . '`)
            } else {
                php_variable_validation += `$${compo.name} = !empty($settings['${compo.name}']) ? $settings['${compo.name}'] : '';\n`
                data = data.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }
        }

        return settings;
    }

    const NameSpace = () => {
        var NameSpace = ''
        if (ControlsArray?.length > 0) {
            ControlsArray.map((type) => {
                if (NameSpaceArray?.[type]) {
                    NameSpace += NameSpaceArray?.[type];
                }
            })
        }

        return NameSpace;
    }

    if (all_files.Editor_data?.links[0]?.js?.length > 0) {
        all_files.Editor_data.links[0].js.map(function (links) {
            if (links) {
                js_link += `wp_enqueue_script( 'wd_ex_script_${keyUniqueID()}', '${links}', array(), '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', true );\n`
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

    all_files.CardItems.cardData[0].layout.map((section) => {
        section.inner_sec.map((compo) => {
            php_variable += Controller_html_loop(compo);
        })
    })

    Loopvar.length > 0 && Loopvar.map((data) => {
        CheckLoop(data.name)
    })

    all_files.CardItems.cardData[0].layout.map((section_data) => {

        layout_data_elementor += `$this->start_controls_section('${section_data.section}_tab_content',
            [
                'label' => esc_html__( '${section_data.section}', '${textdomain}' ),
                'tab' => Controls_Manager::TAB_CONTENT,
            ]
        );\n`

        section_data.inner_sec.map((compo) => {
            if (compo.type == "cpt" || compo.type == "product_listing" || compo.type == "taxonomy") {
                if (!dynamic_controller.includes(compo.type)) {
                    dynamic_controller.push(compo.type)
                }
            }
            layout_data_elementor += Elementer_data(compo)
        })

        layout_data_elementor += `$this->end_controls_section();`

    })

    all_files.CardItems.cardData[0].style.map((section_data) => {
        style_data_elementor += `$this->start_controls_section(
            '${section_data.section}_style_secdddtion',
            [
                'label' => esc_html__( '${section_data.section}', '${textdomain}' ),
                'tab' => \\Elementor\\Controls_Manager::TAB_STYLE,
            ]
        );\n`
        section_data.inner_sec.map((compo) => {
            if (compo.type == "cpt" || compo.type == "product_listing" || compo.type == "taxonomy") {
                if (!dynamic_controller.includes(compo.type)) {
                    dynamic_controller.push(compo.type)
                }
            }
            style_data_elementor += Elementer_data(compo)
        })
        style_data_elementor += `$this->end_controls_section();`
    })

    var elementor_js = js != `""` ? `(function ($) {
        "use strict";
            var WidgetScrollSequenceHandler = function($scope, $) { 
                let is_editable = elementorFrontend?.isEditMode();
                ${JSON.parse(js)}  
            };	
        $(window).on('elementor/frontend/init', function () {
          elementorFrontend.hooks.addAction('frontend/element_ready/wb-${all_files.WcardData.widgetdata.widget_id}.default', WidgetScrollSequenceHandler);
        });
    })(jQuery);` : '';

    var elementor_css = `${Css_validation()}`;

    var elementer_php = `<?php
/*
 * Widget Name: ${Name_validation()}
 * Author: POSIMYTH
 * Author URI: https://posimyth.com
 * 
 * @package wdesignkit
 */

${NameSpace()}
use Elementor\\Widget_Base;
use Elementor\\Controls_Manager;
use Elementor\\Utils;
use Elementor\\Group_Control_Typography;
use Elementor\\Group_Control_Border;
use Elementor\\Group_Control_Background;
use Elementor\\Group_Control_Box_Shadow;
use Elementor\\Group_Control_Text_Shadow;
use Elementor\\Group_Control_Image_Size;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Class Wdkit_${Name_validation("file").replaceAll("-", "_")}
 */
class Wdkit_${Name_validation("file").replaceAll("-", "_")} extends Widget_Base {

    /**
     * Get Widget Name.
     *
     * @since ${wdkitData.WDKIT_VERSION}
     */
    public function get_name() {
        return 'wb-${all_files.WcardData.widgetdata.widget_id}';
    }

    /**
     * Get Widget Title.
     *
     * @since ${wdkitData.WDKIT_VERSION}
     */
    public function get_title() {
        return esc_html__('${Name_validation()}', '${textdomain}');
    }

    ${all_files.WcardData.widgetdata.w_icon ? `
    /**
     * Get Widget Icon.
     *
     * @since ${wdkitData.WDKIT_VERSION}
     */
    public function get_icon() {
        return '${all_files.WcardData.widgetdata.w_icon}';
    }` : ``}

    /**
     * Get Widget categories.
     *
     * @since ${wdkitData.WDKIT_VERSION}
     */
    public function get_categories() {
        $GG_Databash = get_option( "wkit_builder" );
        if ( (empty($GG_Databash) || $GG_Databash == false) ) {
            return array('WDesignKit');
        }else{
            if( in_array( '${all_files.WcardData.widgetdata.category}', $GG_Databash ) ){

                return array('${all_files.WcardData.widgetdata.category}');
            }else{
                return array('WDesignKit');
            }
        }
    }

    /**
     * Get Widget keywords.
     *
     * @since ${wdkitData.WDKIT_VERSION}
     */
    public function get_keywords() {
        return array(${Key_words()});
    }

    ${dynamic_controller.length > 0 ? `
        /**
        * Get dynamic listing data as per query.
        *
        * @since 1.0.38
        */
        private function set_options($type){
            $ctp = [];

            if(class_exists('Wdkit_Dynamic_Listing_Files')){
                $wdkit_widget = new Wdkit_Dynamic_Listing_Files();
                
                if('post_list' == $type){
                    if ( method_exists($wdkit_widget, 'Get_post_list')) {
                        $ctp = $wdkit_widget->Get_post_list();
                    }
                } else if ('order_by' == $type){    
                    if (method_exists($wdkit_widget, 'Get_orderBy_List')) {
                        $ctp = $wdkit_widget->Get_orderBy_List();
                    }
                }
            }

            $cpt_array = array();

            foreach ($ctp as $key => $value) {
                $cpt_array[$value['name']] = $value['label'];
            }

            return $cpt_array;
        }
    ` : ''}

    ${(dynamic_controller.includes('cpt') || dynamic_controller.includes('product_listing')) ? `
            
        /**
         * Get all posts from wordpress.
         *
         * @since ${wdkitData.WDKIT_VERSION}
         */
        private function get_post_query( $type, $per_post, $order, $order_by, $include, $exclude, $cat_count, $tag_count ) {
            
        // Query arguments
            $args = array(
                'post_type' => $type,
                'posts_per_page'      => $per_post,
                'order'               => $order,
                'orderby'             => $order_by,
                'post__in'            => $include,
                'post__not_in'        => $exclude,
            );

            $post_value = array();
        
            $query = new WP_Query($args);

            while ($query->have_posts()) {

                $index = count($post_value);
                $query->the_post();

                $thumbnail_image = has_post_thumbnail() ? get_the_post_thumbnail_url() : '';
                $title = get_the_title() ? get_the_title() : '';
                $excerpt = get_the_excerpt() ? get_the_excerpt() : '';
                $categories = $type === 'product' ? wp_get_post_terms(get_the_ID(), 'product_cat') : get_the_category();
                $tags_array = $type === 'product' ? wp_get_post_terms(get_the_ID(), 'product_tag') : get_the_tags();
                $custom_fields = get_post_custom() ? get_post_custom() : '';
                $post_date = get_the_date() ? get_the_date() : '';
                $permalink = get_permalink() ? get_permalink() : '';

                $tags_list = array();
                if (!empty($tags_array)) {
                    if(isset($tag_count)){
                        $tags_array = array_slice($tags_array, 0, $tag_count); // Limit the number of tags
                    }
                    foreach ($tags_array as $key =>  $tag) {
                        $tag_name = $tag->name;
                        $tag_url = get_tag_link($tag->term_id);

                        $tags_list[$key] = array(
                            'name' => $tag_name,
                            'url' => $tag_url,
                        );
                    }
                }

                $categories_list = array();
                if (!empty($categories)) {
                    if(isset($cat_count)){
                        $categories = array_slice($categories, 0, $cat_count); // Limit the number of tags
                    }
                    foreach ($categories as $category) {
                        $category_name = $category->name;
                        $category_url = get_category_link($category->term_id);

                        $categories_list[] = array(
                            'name' => $category_name,
                            'url' => $category_url,
                        );
                    }
                }

                // Get author details
                $author_id = get_the_author_meta('ID') ? get_the_author_meta('ID') : '';
                $author_name = get_the_author_meta('display_name', $author_id) ? get_the_author_meta('display_name', $author_id) : '';
                $author_email = get_the_author_meta('user_email', $author_id) ? get_the_author_meta('user_email', $author_id) : '';
                $author_url = get_the_author_meta('user_url', $author_id) ? get_the_author_meta('user_url', $author_id) : '';
                $author_avatar = get_avatar_url($author_id, 200) ? get_avatar_url($author_id, array('size' => 200)) : '';

                $post_value[$index]['title'] = $title; 
                $post_value[$index]['post_link'] = $permalink; 
                $post_value[$index]['description'] = $excerpt; 
                $post_value[$index]['categories'] = $categories_list; 
                $post_value[$index]['tags'] = $tags_list; 
                $post_value[$index]['custom_fields'] = $custom_fields; 
                $post_value[$index]['image'] = $thumbnail_image ? $thumbnail_image : '${wdkitData.WDKIT_URL + "assets/images/jpg/placeholder.png"}';
                $post_value[$index]['author_id'] = $author_id; 
                $post_value[$index]['author_name'] = $author_name; 
                $post_value[$index]['author_email'] = $author_email; 
                $post_value[$index]['author_url'] = $author_url; 
                $post_value[$index]['author_avatar'] = $author_avatar; 
                $post_value[$index]['post_date'] = $post_date; 
            }

            return $post_value;
        }` : ''
        }

    ${(dynamic_controller.includes('taxonomy')) ? `
        
        /**
         * Get all posts from wordpress.
         *
         * @since 1.0.36
         */
        private function get_taxonomy_list( $taxo_type, $post_type, $per_page ) {
            
            $terms = [];

            $taxoomy_list = !empty( get_object_taxonomies( $post_type ) ) ? get_object_taxonomies( $post_type ) : [];
            if ( !in_array($taxo_type, $taxoomy_list) ) {
                return [];
            }
            
            // Query arguments
            $terms = get_terms( array(
                'taxonomy' => $taxo_type,
                'hide_empty' => false,
                'number' => $per_page,
            ) );

            foreach ($terms as $key => $value) {
                $term_link = get_term_link( $value );
                $term_image_id = get_term_meta( $value->term_id );
                
                if ( !empty($term_link) ) {
                    $terms[$key]->front_link = $term_link;
                } else {
                    $terms[$key]->front_link = '';
                }
                
                if ( !empty($term_image_id['thumbnail_id'][0]) ) {
                    $img_id = $term_image_id['thumbnail_id'][0];
                    $thumbnail_img = wp_get_attachment_url($img_id);
                    $terms[$key]->thumbnail = $thumbnail_img;
                } else {
                    $terms[$key]->thumbnail = '';
                }
            }

            $terms = json_decode(json_encode($terms), true);

            return $terms;
        }` : ''
        }

    ${(js_link?.length != 0 || elementor_js) ?
            `/**
    * Get Widget Scripts
    *
    * @since ${wdkitData.WDKIT_VERSION}
    */
    public function get_script_depends() {
        
        /**External js enqueue*/
        ${js_link}

        ${elementor_js ? `wp_enqueue_script( 'wkit_child_script_${script_id}', wp_upload_dir()['baseurl'].'/wdesignkit/elementor/${Name_validation("folder")}/${Name_validation("file")}.js', array(), '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', true );` : ''}

        return [ 'wkit_child_script_${script_id}' ];
    }` : ``}

    ${(css_link?.length != 0 || elementor_css) ?
            `/**
    * Get Widget Styles
    *
    * @since ${wdkitData.WDKIT_VERSION}
    */
    public function get_style_depends() {
        
        /**External Css enqueue*/
        ${css_link}

        ${elementor_css ? `wp_enqueue_style( 'wkit_css_1_${style_id}', wp_upload_dir()['baseurl'].'/wdesignkit/elementor/${Name_validation("folder")}/${Name_validation("file")}.css', false, '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', 'all' );` : ''}

        return [ 'wkit_css_1_${style_id}' ];
    }` : ``}

    ${all_files.WcardData.widgetdata.helper_link.trim().length >= 1 ?
            `/**
    * Widget Support URL.
    *
    * @since ${wdkitData.WDKIT_VERSION}
    */
    public function get_custom_help_url() {
        return '${all_files.WcardData.widgetdata.helper_link.trim()}';
    }` : ''}

    /**
     * Register controls.
     *
     * @since ${wdkitData.WDKIT_VERSION}
     */
    ${(layout_data_elementor || style_data_elementor) ?
            `protected function register_controls() {

            ${layout_data_elementor}

            ${style_data_elementor}

    }` : ''}

    /**
     * Written in PHP and HTML.
     *
     * @since ${wdkitData.WDKIT_VERSION}
     */
    protected function render() { 	
        $settings = $this->get_settings_for_display();
        ${php_variable_validation}
        ${php_variable}

        $output = '';
        $output .= '<div class="wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id}" data-wdkitunique="${all_files.WcardData.widgetdata.widget_id}">';
            $output .= '${data}';
        $output .= '</div>';
        
        echo $output;
    }
}`

    let trim_name = Image_link().widgetdata.name.trim();
    var widget_info = Object.assign({}, Image_link().widgetdata, { 'wkit-version': wdkitData.WDKIT_VERSION, 'name': trim_name })
    let widget_data = { 'widgetdata': widget_info };

    var json_section = JSON.stringify(all_files.CardItems.cardData);
    var json_widget = JSON.stringify(widget_data);
    var editor_link = JSON.stringify(all_files.Editor_data);

    var json_data = `{
        "section_data":${json_section},
        "widget_data":${json_widget},
        "Editor_Link":${editor_link},
        "Editor_data":{
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
        'elementor_php_file': elementer_php,
        'elementor_js': elementor_js,
        'elementor_css': elementor_css,
        'json_file': json_data,
        "plugin": "elementor",
        "d_image": d_image ? d_image : '',
        "call": call,
    };

    var formData = new FormData();
    formData.append('action', 'get_wdesignkit');
    formData.append('kit_nonce', wdkitData.kit_nonce);
    formData.append('image', image_file);
    formData.append('type', 'wkit_create_widget');
    formData.append('value', JSON.stringify(values));

    await axios.post(ajaxurl, formData, {
        headers: { 'content-type': 'application/json' }
    }).then((response) => {
        if (response.status == 200) {
            if (document.querySelector('.wb-function-call')) {
                document.querySelector('.wb-function-call').click()
            }
            responses.api = response.data;
        } else {
        }
    }).catch(error => console.error(error));

    var NewImage = all_files.WcardData.widgetdata.w_image;
    var NewImageExt = all_files.WcardData.widgetdata.img_ext;

    const Get_image_info = async () => {

        let Json_URL = `${wdkitData.WDKIT_SERVER_PATH}/elementor/${Name_validation("folder")}/${Name_validation("file")}.json`;

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

export default Elementor_file_create;