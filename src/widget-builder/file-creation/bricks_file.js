import axios from "axios";
import { wdKit_Form_data, get_user_login } from '../../helper/helper-function';
import { Bricks_data } from "../components-data/component_custom";


const Bricks_file_create = async (call, all_files, html, css, js, old_folder, image_file, d_image) => {

    /**
     * Generates a unique key based on the current year and a random string.
     *
     * @returns {string} A unique identifier.
     * @since 1.0.0
     * @version 1.0.0
     */
    const KeyUniqueID = () => {
        let year = new Date().getFullYear().toString().slice(-2),
            uid = Math.random().toString(36).substr(2, 6);
        return uid + year;
    }

    var layout_data = '',
        upload_path = wdkitData.WDKIT_SERVER_PATH,
        php_variable_validation = "",
        repeater_variable = {},
        layout_data_bricks = "",
        textdomain = "wdesignkit",
        js_link = [],
        css_link = [],
        php_variable = "",
        responses = { 'api': '', 'ajax': '' },
        Loopvar = [],
        php_editor_code = all_files.Editor_code?.Editor_codes?.[0]?.php,
        script_id = KeyUniqueID(),
        switcherArray = [],
        unique_class = KeyUniqueID(),
        dynamic_controller = [],
        external_cdn = all_files?.Editor_data?.links?.[0]?.external_cdn ? [...all_files?.Editor_data?.links?.[0]?.external_cdn] : [];

    /**
     * Generates a unique three-digit key based on the current year and a random string.
     *
     * @returns {string} A three-digit unique identifier.
     * @since 1.0.0
     * @version 1.0.0
     */
    const ThreeDigitUnique = () => {
        let year = new Date().getFullYear().toString().slice(-2),
            uid = Math.random().toString(36).substr(2, 2);
        return uid + year;
    }

    /**
     * Generates a unique random number between 0 and 999999.
     *
     * @returns {number} A unique random number.
     * @since 1.0.0
     * @version 1.0.0
     */
    const UniqueNumber = () => {
        return Math.floor(Math.random() * 1000000)
    }

    /**
    * Process CSS data based on specific conditions and generate modified CSS.
    * 
    * @returns {string} Modified CSS data.
    * @since 1.0.0
    * @version 1.0.0
    */
    const CssValidation = () => {
        let parent_class = all_files.WcardData.widgetdata.widget_id,
            css_data = JSON.parse(css);

        if (!css_data) {
            return '';
        }

        if (all_files?.WcardData?.widgetdata?.css_parent_node == true) {
            css_data = css_data.replaceAll("{{parent-class}}", `.wkit-wb-Widget_${parent_class}`);

            let css_array = css_data.split('}'),
                final_css = '';

            css_array.map((css) => {
                let data = css.trim();

                if (data.search('{') > -1) {
                    if (data.search("@import") > -1) {
                        final_css += data + '}';
                    } else if ('.' === data.charAt(0)) {
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
                    } else if ('*' == data.charAt(0)) {
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

    /**
     * Process image data and generate updated widgetdata object.
     * 
     * @param {string} img_ext - The file extension of the image.
     * @returns {Object} An object containing the updated widgetdata.
     * @since 1.0.0
     * @version 1.0.0
     */
    const ProcessIamge = (img_ext) => {
        let img_path = `${upload_path}/bricks/${NameValidation('folder')}/${NameValidation('file')}.${img_ext}`,
            add_val = Object.assign({}, all_files.WcardData.widgetdata, { "w_image": img_path, "img_ext": img_ext });
        return { 'widgetdata': add_val };
    }

    /**
     * Process image-related data and update the widgetdata object.
     *
     * @returns {Object} An object containing the updated widgetdata.
     * @since 1.0.0
     * @version 1.0.0
     */
    const ImageLink = () => {
        if (all_files?.WcardData?.widgetdata?.image_id) {
            delete all_files?.WcardData?.widgetdata?.image_id;
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
                let add_val = Object.assign({}, all_files.WcardData.widgetdata, { "w_image": "", "img_ext": img_ext });
                return { 'widgetdata': add_val };
            }
            if (img_ext) {
                return ProcessIamge(img_ext);
            }

        } else if (old_folder) {
            let old_image = all_files.WcardData.widgetdata.w_image,
                image_array = old_image.split('.'),
                img_ext = image_array[image_array.length - 1];

            if (img_ext) {
                return ProcessIamge(img_ext);

            } else {
                return all_files.WcardData;
            }

        } else if (d_image) {
            let old_image = d_image,
                image_array = old_image.split('.'),
                img_ext = image_array[image_array.length - 1];

            if (img_ext) {
                return ProcessIamge(img_ext);

            } else {
                return all_files.WcardData;
            }

        } else {
            return all_files.WcardData;
        }
    }

    /**
     * Convert a string containing HTML markup into an HTML document.
     *
     * @param {string} str - The string containing HTML markup.
     * @returns {Document} An HTML document parsed from the input string.
     * @since 1.0.0
     * @version 1.0.0
     */
    const StringToHTML = function (str) {
        return new DOMParser().parseFromString(str, 'text/html');
    };

    /**
     * Validate and process HTML content by converting it to a string.
     *
     * @param {string} html - The HTML content to be validated and processed.
     * @returns {string} A sanitized string representation of the HTML content.
     * @since 1.0.0
     * @version 1.0.0
     */
    const HtmlValidation = (html) => {
        let repeater_html = StringToHTML(JSON.parse(html)),
            widgetHtml = repeater_html.head.innerHTML + repeater_html.body.innerHTML;
        return widgetHtml.replaceAll("'", "\\'");
    }

    var widgetHtml = HtmlValidation(html)

    /**
     * Validate and process a name based on the specified type.
     *
     * @param {string} type - The type of validation to perform ('file', 'folder', or other).
     * @returns {string} The validated and processed name.
     * @since 1.0.0
     * @version 1.0.0
     */
    const NameValidation = (type) => {
        var name = all_files.WcardData.widgetdata.name.trim(),
            id = all_files.WcardData.widgetdata.widget_id;

        if ("file" == type) {
            return name.replaceAll(" ", "_") + "_" + id;
        } else if ("folder" == type) {
            return name.replaceAll(" ", "-") + "_" + id;
        } else {
            return name;
        }
    }

    /**
     * Extract HTML elements with a specific data attribute from a string,
     * based on the provided name.
     *
     * @param {string} name - The data attribute name to target.
     * @returns {string[]} An array containing the outerHTML of matching HTML elements.
     * @since 1.0.0
     * @version 1.0.0
     */
    const GetLoopHtml = (name) => {
        let html = [],
            repeater_html = StringToHTML(widgetHtml),
            r_html_array = repeater_html.querySelectorAll(`[data-${name}]`);

        if (r_html_array.length > 0) {

            widgetHtml = repeater_html.head.innerHTML + repeater_html.body.innerHTML

            Object.values(r_html_array).map((r_html) => {
                html.push(r_html.outerHTML);
            })

            return html;
        }
    }

    /**
     * Change the URL hash based on specific conditions.
     *
     * @param {string} call - The call parameter used to determine the conditions for changing the URL hash.
     * @returns {undefined} Returns undefined after changing the URL hash.
     * @since 1.0.0
     * @version 1.0.0
     */
    const ChangeUrl = () => {

        if ("update" === call || "sync" === call && old_folder != undefined) {
            let array = new URL(window.location).hash.split("/"),
                url_length = (array.length - 1),
                R_name = all_files.WcardData.widgetdata.name.trim() + "_" + all_files.WcardData.widgetdata.widget_id;

            array[url_length] = R_name;

            document.location.hash = array.join('/');
        }
    }
    ChangeUrl();

    /**
     * Check and process a loop with a specified name, updating HTML and generating PHP variables accordingly.
     *
     * @param {string} loop_name - The name of the loop to check.
     * @returns {boolean|undefined} Returns `false` if the loop conditions are not met, otherwise `undefined`.
     * @since 1.0.0
     * @version 1.0.0
     */
    const CheckLoop = async (loop_name) => {

        if (loop_name) {
            let loop_html = GetLoopHtml(loop_name);
            loop_html?.length > 0 && loop_html?.map((sl_html, index) => {

                if (sl_html) {

                    var html = StringToHTML(sl_html);
                    Loopvar.map((loop) => {
                        if (loop.name != loop_name) {
                            let findHTML = html.querySelectorAll(`[data-${loop.name}]`);
                            if (findHTML.length > 0) {
                                CheckLoop(loop.name)
                            }
                        }
                    })

                    let new_html = GetLoopHtml(loop_name);

                    if (new_html.length > 0) {

                        let loopDataIndex = Loopvar.findIndex((l_data) => l_data.name == loop_name),
                            loopData = Loopvar[loopDataIndex];

                        if ('repeater' == loopData.type) {
                            let uniqueID = ThreeDigitUnique(),
                                fields = `$${loopData.name + "_" + uniqueID} .= '${new_html[0]}';`;
                            php_variable += `$${loopData.name + "_" + uniqueID} = '';
                            if ( !empty($this->settings['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}) {
                                foreach ( $this->settings['${loopData.name}'] as $key => $r_item ) {
                                    ${repeater_variable?.[loopData.name] ? repeater_variable?.[loopData.name] : ''}
                                    ${fields}
                                }
                            }`;

                            widgetHtml = widgetHtml.replace(new_html[0], `'.$${loopData.name + "_" + uniqueID}.'`);

                        } else if ('cpt' == loopData.type) {
                            let uniqueID = ThreeDigitUnique();
                            let cpt_html = new_html[0];

                            let parent_html = StringToHTML(cpt_html);
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
                                if(!empty($this->settings['post_type_${loopData.unique_id}'])){

                                $type = $this->settings['post_type_${loopData.unique_id}'];
                                $per_page = isset($this->settings['max_post_${loopData.unique_id}']) ? $this->settings['max_post_${loopData.unique_id}'] : '10';
                                $order = !empty($this->settings['order_${loopData.unique_id}']) ? $this->settings['order_${loopData.unique_id}'] : 'DESC'; 
                                $order_by = !empty($this->settings['order_by_${loopData.unique_id}']) ? $this->settings['order_by_${loopData.unique_id}'] : 'date'; 
                                $include = !empty( $this->settings['include_${loopData.unique_id}'] ) ? explode( ',', $this->settings['include_${loopData.unique_id}'] ) : array();
                                $exclude = !empty( $this->settings['exclude_${loopData.unique_id}'] ) ? explode( ',', $this->settings['exclude_${loopData.unique_id}'] ) : array();
                                $cat_count = isset( $this->settings['max_cat_${loopData.unique_id}'] ) ? $this->settings['max_cat_${loopData.unique_id}'] : 3;
                                $tag_count = isset( $this->settings['max_tag_${loopData.unique_id}'] ) ? $this->settings['max_tag_${loopData.unique_id}'] : 3;


                                    $${loopData.name + "_" + uniqueID + "_array"} = !empty($this->get_post_query($type, $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count)) ? $this->get_post_query($type, $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count) : [];
                                    
                                    if ( !empty($${loopData.name + "_" + uniqueID + "_array"}) ) {        
                                        foreach ( $${loopData.name + "_" + uniqueID + "_array"} as $p_item ) {
                                            ${cat_loop}
                                            ${tag_loop}
                                            $${loopData.name + "_" + uniqueID} .= '${cpt_html}';
                                        }
                                    } else {
                                        $${loopData.name + "_" + uniqueID} .= '<h6 style="color: red;text-align: center;display: block;">No Result Found</h6>';
                                    }
                                }`
                            widgetHtml = widgetHtml.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if ('product_listing' == loopData.type) {
                            let uniqueID = ThreeDigitUnique();
                            let cpt_html = new_html[0];

                            let parent_html = StringToHTML(cpt_html);
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

                                $per_page = isset($this->settings['max_post_${loopData.unique_id}']) ? $this->settings['max_post_${loopData.unique_id}'] : '10';
                                $order = !empty($this->settings['order_${loopData.unique_id}']) ? $this->settings['order_${loopData.unique_id}'] : 'DESC'; 
                                $order_by = !empty($this->settings['order_by_${loopData.unique_id}']) ? $this->settings['order_by_${loopData.unique_id}'] : 'date'; 
                                $include = !empty( $this->settings['include_${loopData.unique_id}'] ) ? explode( ',', $this->settings['include_${loopData.unique_id}'] ) : array();
                                $exclude = !empty( $this->settings['exclude_${loopData.unique_id}'] ) ? explode( ',', $this->settings['exclude_${loopData.unique_id}'] ) : array();
                                $cat_count = isset( $this->settings['max_cat_${loopData.unique_id}'] ) ? $this->settings['max_cat_${loopData.unique_id}'] : 3;
                                $tag_count = isset( $this->settings['max_tag_${loopData.unique_id}'] ) ? $this->settings['max_tag_${loopData.unique_id}'] : 3;


                                    $${loopData.name + "_" + uniqueID + "_array"} = !empty($this->get_post_query('product', $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count)) ? $this->get_post_query('product', $per_page, $order, $order_by, $include, $exclude, $cat_count, $tag_count) : [];
                                    if ( !empty($${loopData.name + "_" + uniqueID + "_array"}) ) {
                                        foreach ( $${loopData.name + "_" + uniqueID + "_array"} as $p_item ) {
                                            ${cat_loop}
                                            ${tag_loop}
                                            $${loopData.name + "_" + uniqueID} .= '${cpt_html}';
                                        }
                                    } else {
                                        $${loopData.name + "_" + uniqueID} .= '<h6 style="color: red;text-align: center;display: block;">No Result Found</h6>';
                                    }`
                            widgetHtml = widgetHtml.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if ('gallery' === loopData.type) {
                            let uniqueID = ThreeDigitUnique();
                            if (loopData?.repeater != undefined) {
                                var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                if(!empty($r_item['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}){
                                    foreach ( ${loopData?.repeater ? '$r_item' : '$this->settings'}['${loopData.name}']['images'] as $image ) {
                                        $${loopData.name} = $image['url'];
                                        $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                    }
                                }`

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }
                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })
                            } else {
                                php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                if( !empty ($this->settings['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}){
                                    foreach ( ${loopData?.repeater ? '$r_item' : '$this->settings'}['${loopData.name}']['images'] as $image ) {
                                        $${loopData.name} = $image['url'];
                                        $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                    }
                                }`
                            }
                            widgetHtml = widgetHtml.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if ('select2' === loopData.type) {
                            let uniqueID = ThreeDigitUnique();

                            if (loopData?.repeater) {
                                if (loopData?.multiple) {
                                    var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                    if ( !empty($r_item['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}) {
                                        foreach ( $r_item['${loopData.name}'] as $s_item  ) {
                                            $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                        }
                                    }`
                                } else {
                                    var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                    if ( !empty($r_item['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}) {
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
                                    if (  !empty($this->settings['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}) {
                                        foreach (  $this->settings['${loopData.name}'] as $s_item  ) {
                                            $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                        }
                                    }`
                                } else {
                                    php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                    if (  !empty($this->settings['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}) {
                                            $${loopData.name + "_" + uniqueID} .= '${new_html[0]}';
                                    }`
                                }
                            }

                            widgetHtml = widgetHtml.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if ('headingtags' === loopData.type) {
                            let uniqueID = ThreeDigitUnique();
                            if (loopData?.repeater != undefined) {
                                let hTag = new_html[0];
                                hTag = hTag.replaceAll([loopData.name], `'.$r_item["${loopData.name}"].'`)
                                var r_html = `$${loopData.name + "_" + uniqueID} = '';
                                if(!empty($r_item['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}){
                                    $${loopData.name + "_" + uniqueID} = '${hTag}';
                                }`

                                if (repeater_variable?.[loopData?.repeater]) {
                                    r_html = repeater_variable?.[loopData?.repeater] + r_html;
                                }
                                repeater_variable = Object.assign({}, repeater_variable, { [loopData?.repeater]: r_html })
                            } else {
                                let hTag = new_html[0];
                                let UniqueNumber = KeyUniqueID();
                                hTag = hTag.replaceAll(`data-${loopData.name}`, UniqueNumber)
                                hTag = hTag.replaceAll([loopData.name], `'.$this->settings["${loopData.name}"].'`)
                                hTag = hTag.replaceAll([UniqueNumber], `data-${loopData.name}`)
                                php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                if(!empty($this->settings['${loopData.name}']) ${loopData?.condition ? loopData.condition : ''}){
                                    $${loopData.name + "_" + uniqueID} = '${hTag}';
                                }`
                            }
                            widgetHtml = widgetHtml.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        } else if ('taxonomy' == loopData.type) {
                            let uniqueID = ThreeDigitUnique();
                            let cpt_html = new_html[0];

                            php_variable_validation += `$${loopData.name + "_" + uniqueID} = '';
                                if(!empty($this->settings['taxonomy_${loopData.unique_id}'])){

                                    $taxo_type = $this->settings['taxonomy_${loopData.unique_id}'];
                                    $post_type = !empty($this->settings['post_type_${loopData.unique_id}']) ? $this->settings['post_type_${loopData.unique_id}'] : 'post';
                                    $per_page = !empty($this->settings['max_post_${loopData.unique_id}']) ? $this->settings['max_post_${loopData.unique_id}'] : '10'; 

                                    $${loopData.name + "_" + uniqueID + "_array"} = !empty($this->get_taxonomy_list($taxo_type, $post_type, $per_page)) ? $this->get_taxonomy_list($taxo_type, $post_type, $per_page) : [];

                                    if ( !empty($${loopData.name + "_" + uniqueID + "_array"}) ) {
                                        foreach ( $${loopData.name + "_" + uniqueID + "_array"} as $t_item ) {
                                            $${loopData.name + "_" + uniqueID} .= '${cpt_html}';
                                        }
                                    } else {
                                        $${loopData.name + "_" + uniqueID} .= '<h6 style="color: red;text-align: center;display: block;">No Result Found</h6>';
                                    }
                                }`
                            widgetHtml = widgetHtml.replace([new_html[0]], `'.$${loopData.name + "_" + uniqueID}.'`);
                        }

                    } else {
                        return false;
                    }
                }
            })
        }
    }

    /**
     * Controller function to handle HTML loop for a component with repeater.
     *
     * @param {object} compo - The component object.
     * @param {string} repeater - The repeater name.
     * @returns {string} The generated settings for the component.
     * @since 1.0.0
     * @version 1.0.6
     */

    const Condition_controller = (controller, parent) => {
        var controller_condition = '';

        if (controller?.conditions && controller?.condition_value?.values?.length > 0) {
            controller.condition_value.values.map((cnd, index) => {
                if (cnd.name && cnd.operator) {

                    if (switcherArray.includes(cnd.name)) {
                        if (parent) {
                            if (cnd.operator == '!=') {
                                controller_condition += `!isset($r_item['${cnd.name}'])`;
                            } else {
                                controller_condition += `isset($r_item['${cnd.name}'])`;
                            }
                        } else {
                            if (cnd.operator == '!=') {
                                controller_condition += `!isset($this->settings['${cnd.name}'])`;
                            } else {
                                controller_condition += `isset($this->settings['${cnd.name}'])`;
                            }
                        }
                    } else {
                        if (parent) {
                            controller_condition += `!empty($r_item['${cnd.name}']) && $r_item['${cnd.name}'] ${cnd.operator} ${(cnd.value === 'true' || cnd.value === 'false') ? cnd.value : `'${cnd.value}'`}`;
                        } else {
                            controller_condition += `!empty($this->settings['${cnd.name}']) && $this->settings['${cnd.name}'] ${cnd.operator} ${(cnd.value === 'true' || cnd.value === 'false') ? cnd.value : `'${cnd.value}'`}`;
                        }
                    }
                    if (index < (controller?.condition_value?.values?.length - 1)) {
                        controller_condition += `${controller?.condition_value.relation === 'or' ? '||' : '&&'}`;
                    }
                }
            })
        }

        if (controller_condition) {
            return `&& (${controller_condition}) `;
        } else {
            return '';
        }
    }

    const ControllerHtmlLoop = (compo, repeater) => {

        var settings = '';

        if (compo.type == 'url') {

            if (repeater) {
                let r_html = `$${compo.name}_is_external = isset($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['newTab']) ${Condition_controller(compo, repeater)} ? '_blank' : '';\n`
                r_html += `$${compo.name}_url = isset($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['url']) ${Condition_controller(compo, repeater)} ? $r_item['${compo.name}']['url'] : '';\n`
                r_html += `$${compo.name}_nofollow = isset($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['rel']) ${Condition_controller(compo, repeater)} ? $r_item['${compo.name}']['rel'] : '';\n`
                r_html += `$${compo.name}_arialabel = isset( $r_item['${compo.name}']) && !empty( $r_item['${compo.name}']['ariaLabel']) ${Condition_controller(compo, repeater)} ?  'ariaLabel="'.$r_item['${compo.name}']['ariaLabel'].'"' : '';\n`
                r_html += `$${compo.name}_title = isset( $r_item['${compo.name}']) && !empty( $r_item['${compo.name}']['title']) ${Condition_controller(compo, repeater)} ?  'title="'.$r_item['${compo.name}']['title'].'"' : '';\n`

                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
            }
            else {
                php_variable_validation += `$${compo.name}_is_external = isset( $this->settings['${compo.name}']) && !empty( $this->settings['${compo.name}']['newTab']) ${Condition_controller(compo)} ?  '_blank' : '';\n`

                php_variable_validation += `$${compo.name}_url = isset( $this->settings['${compo.name}']) && !empty( $this->settings['${compo.name}']['url']) ${Condition_controller(compo)} ?  $this->settings['${compo.name}']['url'] : '';\n`

                php_variable_validation += `$${compo.name}_nofollow = isset( $this->settings['${compo.name}']) && !empty( $this->settings['${compo.name}']['rel']) ${Condition_controller(compo)}?  $this->settings['${compo.name}']['rel'] : '';\n`

                php_variable_validation += `$${compo.name}_arialabel = isset( $this->settings['${compo.name}']) && !empty( $this->settings['${compo.name}']['ariaLabel']) ${Condition_controller(compo)} ?  'ariaLabel="'.$this->settings['${compo.name}']['ariaLabel'].'"' : '';\n`

                php_variable_validation += `$${compo.name}_title = isset( $this->settings['${compo.name}']) && !empty( $this->settings['${compo.name}']['title']) ${Condition_controller(compo)} ?  'title="'.$this->settings['${compo.name}']['title'].'"' : '';\n`
            }

            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}-is_external}}`, `'.$${compo.name}_is_external.'`)

            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}-url}}`, `'.$${compo.name}_url.'`)

            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}-nofollow}}`, `'.$${compo.name}_nofollow.'`)

            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}-custom_atr}}=""`, `'.$${compo.name}_arialabel.' '.$${compo.name}_title.'`)
        } else if (compo.type == 'media') {
            if (widgetHtml.search(compo.name) >= 1) {
                if (repeater) {
                    let r_html = `$${compo.name} = isset($r_item['${compo.name}']) && !empty($r_item['${compo.name}']['url']) ${Condition_controller(compo, repeater)} ?  $r_item['${compo.name}']['url'] : '';\n`

                    if (repeater_variable?.[repeater]) {
                        r_html = repeater_variable?.[repeater] + r_html;
                    }
                    repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })

                } else {
                    php_variable_validation += `$${compo.name} = isset($this->settings['${compo.name}']) && !empty($this->settings['${compo.name}']['url']) ${Condition_controller(compo)} ? $this->settings['${compo.name}']['url'] : '';\n`
                }
                widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }
        } else if (compo.type == 'repeater') {

            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'condition': Condition_controller(compo, repeater) });

            let html = GetLoopHtml(compo.name);

            if (html) {
                html.map((html_data, index) => {
                    let repeater_html = html_data;

                    repeater_variable[compo.name] = '';

                    compo.fields.map((field) => {
                        settings += ControllerHtmlLoop(field, compo.name);

                        if (repeater_html) {
                            if (html_data.search(`data-${field.name}="{${field.name}}"`) > -1) {
                                const StringToHTML = function (str) {
                                    let parser = new DOMParser(),
                                        doc = parser.parseFromString(str, 'text/html');
                                    return doc.body;
                                };

                                let loop_html = StringToHTML(repeater_html);
                                if (loop_html.querySelector(`[data-${field.name}]`) && loop_html.querySelector(`[data-${field.name}]`).outerHTML) {
                                    let r_html = loop_html.querySelector(`[data-${field.name}]`).outerHTML;
                                    widgetHtml = widgetHtml.replaceAll(r_html, `'.$${field.name + index}.'`)
                                }
                            } else {
                                if (field.type == 'media' || field.type == 'iconscontrol') {
                                    widgetHtml = widgetHtml.replaceAll(`{{${field.name}}}`, `' . $${field.name} . '`)
                                } else if (field.type == 'url') {
                                    widgetHtml = widgetHtml.replaceAll(`{{${field.name}-url}}`, `' . $${field.name}_url . '`)
                                    widgetHtml = widgetHtml.replaceAll(`{{${field.name}-is_external}}`, `' . $${field.name}_is_external . '`)
                                    widgetHtml = widgetHtml.replaceAll(`{{${field.name}-nofollow}}`, `' . $${field.name}_nofollow . '`)
                                } else if (field.type == 'svg') {
                                    widgetHtml = widgetHtml.replaceAll(`{{${field.name}}}`, `' . $${field.name} . '`)
                                } else {
                                    widgetHtml = widgetHtml.replaceAll(`{{${field.name}}}`, `' . $r_item['${field.name}'] . '`)
                                }
                            }
                            widgetHtml = widgetHtml.replaceAll(`{loop-class-repeater}`, `bricks-repeater-item-' .esc_attr($r_item['id']) . ' repeater-item`)
                            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}_index}}`, `'.$key.'`);
                            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}_UID}}`, `'.esc_attr($r_item['id']).'`);
                            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}-custom_atr}}=""`, `'.$${compo.name}_arialabel.' '.$${compo.name}_title.'`)
                        }
                    })
                })
            }
        } else if (compo.type == 'cpt') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'unique_id': compo.unique_id });

            let html = GetLoopHtml(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        widgetHtml = widgetHtml.replaceAll("{{title_" + compo.name + "}}", "'.$p_item['title'].'")
                        widgetHtml = widgetHtml.replaceAll("{{description_" + compo.name + "}}", "'.$p_item['description'].'")
                        widgetHtml = widgetHtml.replaceAll("{{cat_name_" + compo.name + "}}", "'.$cat['name'].'")
                        widgetHtml = widgetHtml.replaceAll("{{cat_url_" + compo.name + "}}", "'.$cat['url'].'")
                        widgetHtml = widgetHtml.replaceAll("{{tag_name_" + compo.name + "}}", "'.$tag['name'].'")
                        widgetHtml = widgetHtml.replaceAll("{{tag_url_" + compo.name + "}}", "'.$tag['url'].'")
                        widgetHtml = widgetHtml.replaceAll("{{thumbnail_" + compo.name + "}}", "'.$p_item['image'].'")
                        widgetHtml = widgetHtml.replaceAll("{{post_link_" + compo.name + "}}", "'.$p_item['post_link'].'")
                        widgetHtml = widgetHtml.replaceAll("{{post_date_" + compo.name + "}}", "'.$p_item['post_date'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_name_" + compo.name + "}}", "'.$p_item['author_name'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_id_" + compo.name + "}}", "'.$p_item['author_id'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_email_" + compo.name + "}}", "'.$p_item['author_email'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_profile_" + compo.name + "}}", "'.$p_item['author_avatar'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_url_" + compo.name + "}}", "'.$p_item['author_url'].'")
                    }
                })
            }
        } else if (compo.type == 'taxonomy') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'unique_id': compo.unique_id });

            let html = GetLoopHtml(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let taxo_html = html_data;
                    if (taxo_html) {

                        widgetHtml = widgetHtml.replaceAll("{{title_" + compo.name + "}}", "'.$t_item['name'].'")
                        widgetHtml = widgetHtml.replaceAll("{{description_" + compo.name + "}}", "'.$t_item['description'].'")
                        widgetHtml = widgetHtml.replaceAll("{{taxo_image_" + compo.name + "}}", "'.$t_item['thumbnail'].'")
                        widgetHtml = widgetHtml.replaceAll("{{taxo_link_" + compo.name + "}}", "'.$t_item['front_link'].'")
                        widgetHtml = widgetHtml.replaceAll("{{taxo_slug_" + compo.name + "}}", "'.$t_item['slug'].'")
                    }
                })
            }
        } else if (compo.type == 'product_listing') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'unique_id': compo.unique_id });

            let html = GetLoopHtml(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;
                    if (gallery_html) {

                        widgetHtml = widgetHtml.replaceAll("{{title_" + compo.name + "}}", "'.$p_item['title'].'")
                        widgetHtml = widgetHtml.replaceAll("{{description_" + compo.name + "}}", "'.$p_item['description'].'")
                        widgetHtml = widgetHtml.replaceAll("{{cat_name_" + compo.name + "}}", "'.$cat['name'].'")
                        widgetHtml = widgetHtml.replaceAll("{{cat_url_" + compo.name + "}}", "'.$cat['url'].'")
                        widgetHtml = widgetHtml.replaceAll("{{tag_name_" + compo.name + "}}", "'.$tag['name'].'")
                        widgetHtml = widgetHtml.replaceAll("{{tag_url_" + compo.name + "}}", "'.$tag['url'].'")
                        widgetHtml = widgetHtml.replaceAll("{{thumbnail_" + compo.name + "}}", "'.$p_item['image'].'")
                        widgetHtml = widgetHtml.replaceAll("{{post_link_" + compo.name + "}}", "'.$p_item['post_link'].'")
                        widgetHtml = widgetHtml.replaceAll("{{post_date_" + compo.name + "}}", "'.$p_item['post_date'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_name_" + compo.name + "}}", "'.$p_item['author_name'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_id_" + compo.name + "}}", "'.$p_item['author_id'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_email_" + compo.name + "}}", "'.$p_item['author_email'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_profile_" + compo.name + "}}", "'.$p_item['author_avatar'].'")
                        widgetHtml = widgetHtml.replaceAll("{{auth_url_" + compo.name + "}}", "'.$p_item['author_url'].'")
                    }
                })
            }
        } else if (compo.type == 'gallery') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'condition': Condition_controller(compo, repeater) });

            let html = GetLoopHtml(compo.name);

            if (html) {
                html.map((html_data, index) => {
                    let gallery_html = html_data;

                    if (gallery_html) {
                        widgetHtml = widgetHtml.replaceAll("{{" + compo.name + "}}", `' . $${compo.name} . '`)
                    }
                });

            }
        } else if (compo.type == 'select2') {

            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'multiple': compo.multiple, 'condition': Condition_controller(compo, repeater) });
            let html = GetLoopHtml(compo.name);
            if (html) {
                html.map((html_data, index) => {
                    let select2_html = html_data;
                    if (select2_html) {
                        if (compo.multiple) {
                            widgetHtml = widgetHtml.replaceAll("{{" + compo.name + "}}", "' .$s_item. '")
                        } else {
                            widgetHtml = widgetHtml.replaceAll("{{" + compo.name + "}}", `' .$settings['${compo.name}']. '`)
                        }
                    }
                })
            }

        } else if (compo.type == 'iconscontrol') {

            if (widgetHtml.search(compo.name) >= 1) {

                if (repeater) {
                    if (compo.parent_class || compo.parent_class == undefined) {
                        var icon_inner = `<span class="tp-title-icon"><i class="'.$r_item['${compo.name}']['icon'].'"></i></span>`;
                    } else {
                        var icon_inner = `<i class="'.$r_item['${compo.name}']['icon'].'"></i>`;
                    }
                    let r_html = `$${compo.name} = isset( $r_item['${compo.name}'] ) && !empty($r_item['${compo.name}']['icon']) ${Condition_controller(compo, repeater)} ?  '${icon_inner}' : '';\n`

                    if (repeater_variable?.[repeater]) {
                        r_html = repeater_variable?.[repeater] + r_html;
                    }

                    repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
                } else {
                    if (compo.parent_class || compo.parent_class == undefined) {
                        var icon_inner = `<span class="tp-title-icon"><i class="'.$this->settings['${compo.name}']['icon'].'"></i></span>`;
                    } else {
                        var icon_inner = `<i class="'.$this->settings['${compo.name}']['icon'].'"></i>`;
                    }
                    php_variable_validation += `$${compo.name} = isset( $this->settings['${compo.name}'] ) ${Condition_controller(compo)} ? '${icon_inner}' : '';\n`
                }

                widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }
        } else if (compo.type == 'svg') {
            if (repeater) {
                let r_html = `$${compo.name} = isset( $r_item['${compo.name}']['url'] ) ${Condition_controller(compo, repeater)} ? file_get_contents( esc_url( $r_item['${compo.name}']['url'] ) ) : '';\n`
                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }
                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
            } else {
                php_variable_validation += `$${compo.name} =
                isset( $this->settings['${compo.name}']['url'] ) ${Condition_controller(compo)} ? file_get_contents( esc_url( $this->settings['${compo.name}']['url'] ) ) : '';\n`
                widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }

        } else if (compo.type == 'headingtags') {
            Loopvar.push({ 'type': compo.type, 'name': compo.name, 'repeater': repeater, 'condition': Condition_controller(compo, repeater) });
        } else if (compo.type == 'query') {
            if (repeater) {
                let r_html = `$query_args = $this->settings['${compo.name}'];
                    $posts_query = new WP_Query( $query_args );

                    if ( $posts_query->have_posts() ) :
                        while ( $posts_query->have_posts() ) : $posts_query->the_post();
                        the_title( '<h5>', '</h5>' );
                        the_post_thumbnail( 'thumbnail' );
                        endwhile;
                        wp_reset_postdata();
                    else : 
                        esc_html_e( 'No posts matched your criteria.', 'bricks' );
                        endif;;\n`

                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }
                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })

            } else {
                php_variable_validation += `$query_args = $this->settings['${compo.name}'];
                    $posts_query = new WP_Query( $query_args );

                    if ( $posts_query->have_posts() ) :
                        while ( $posts_query->have_posts() ) : $posts_query->the_post();
                        the_title( '<h5>', '</h5>' );
                        the_post_thumbnail( 'thumbnail' );
                        endwhile;
                        wp_reset_postdata();
                    else : 
                        esc_html_e( 'No posts matched your criteria.', 'bricks' );
                        endif;\n`
            }
            widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
        } else if (compo.type == 'color') {
            if (repeater) {
                widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `' . $${compo.name} . '`)
                let r_html = `$${compo.name} = !empty($r_item['${compo.name}']['hex']) ${Condition_controller(compo, repeater)} ? $r_item['${compo.name}']['hex'] : '';\n`

                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
            } else {
                php_variable_validation += `$${compo.name} =
                isset( $this->settings['${compo.name}']['hex'] ) ${Condition_controller(compo)} ? $this->settings['${compo.name}']['hex'] : '';\n`
                widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }
        } else {
            if (repeater) {
                widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `' . $${compo.name} . '`)
                let r_html = `$${compo.name} = !empty($r_item['${compo.name}']) ${Condition_controller(compo, repeater)} ? $r_item['${compo.name}'] : '';\n`

                if (repeater_variable?.[repeater]) {
                    r_html = repeater_variable?.[repeater] + r_html;
                }

                repeater_variable = Object.assign({}, repeater_variable, { [repeater]: r_html })
            } else {
                php_variable_validation += `$${compo.name} =
                isset( $this->settings['${compo.name}'] ) ${Condition_controller(compo)} ? $this->settings['${compo.name}'] : '';\n`
                widgetHtml = widgetHtml.replaceAll(`{{${compo.name}}}`, `'.$${compo.name}.'`)
            }
        }

        return settings;
    };

    if (all_files.Editor_data?.links[0]?.js?.length > 0) {
        all_files.Editor_data.links[0].js.map(function (links) {
            if (links) {
                js_link += `wp_enqueue_script( 'my_child_script_${KeyUniqueID()}', '${links}', [], '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', true );\n`
            }
        });
    }

    if (all_files.Editor_data?.links[0]?.css?.length > 0) {
        all_files.Editor_data.links[0].css.map(function (links) {
            if (links) {
                css_link += `wp_enqueue_style( 'wd_css_ex_1_${KeyUniqueID()}', '${links}', false, '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', 'all' );\n`
            }
        });
    }

    /**
     * to get switcher controller name
     * 
     * @since 1.0.33
     */
    all_files.CardItems.cardData[0].layout.map((section) => {
        if (section?.inner_sec?.length > 0) {
            section.inner_sec.map((controller) => {

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


    all_files.CardItems?.cardData?.[0].layout.map((section) => {

        section.inner_sec.map((compo) => {
            if (compo.type == "cpt" || compo.type == "product_listing" || compo.type == "taxonomy") {
                if (!dynamic_controller.includes(compo.type)) {
                    dynamic_controller.push(compo.type);
                }
            }
            if (php_editor_code) {
                php_editor_code = php_editor_code.replaceAll(`{{${compo.name}}}`, compo.name)
            }
            php_variable += ControllerHtmlLoop(compo);
        })
    })

    all_files.CardItems?.cardData?.[0].style.map((section) => {

        section.inner_sec.map((compo) => {
            if (compo.type == "cpt" || compo.type == "product_listing" || compo.type == "taxonomy") {
                if (!dynamic_controller.includes(compo.type)) {
                    dynamic_controller(compo.type);
                }
            }
            if (php_editor_code) {
                php_editor_code = php_editor_code.replaceAll(`{{${compo.name}}}`, compo.name)
            }
            php_variable += ControllerHtmlLoop(compo);
        })
    })

    Loopvar.length > 0 && Loopvar.map((widgetHtml) => {
        CheckLoop(widgetHtml.name)
    })

    all_files.CardItems?.cardData?.[0].layout.map((section_data) => {

        layout_data_bricks += `$this->control_groups['${section_data.section}'] =
            [
                'title' => esc_html__( '${section_data.section}', '${textdomain}' ),
                'tab' => 'content',
            ];
        \n`

        section_data.inner_sec.map((compo) => {

            layout_data += Bricks_data(compo, 'content', undefined, section_data);

        })
    })

    all_files.CardItems?.cardData?.[0].style.map((section_data) => {

        layout_data_bricks += `$this->control_groups['${section_data.section}'] =
            [
                'title' => esc_html__( '${section_data.section}', '${textdomain}' ),
                'tab' => 'style',
            ];
        \n`

        section_data.inner_sec.map((compo) => {

            layout_data += Bricks_data(compo, 'style', undefined, section_data);

        })
    })

    let jqueryLoad = external_cdn.includes('jQuery') ? `array('jquery')` : '[]';

    var javascript = external_cdn.includes('jQuery') ?
        `var $this = this;
    setTimeout(() => {
        let main_html = jQuery('.wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id}');

        jQuery.each(main_html, function (idx, scope) {
            $this.main_function_${unique_class}(jQuery(scope));
        });
    }, 800);`
        :
        `setTimeout(() => {
        let main_html = document.querySelectorAll(".wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id}")    
            main_html.forEach(element => {
                this.main_function_${unique_class}([element])
            });
    }, 800);`

    var bricks_js = js != `""` ? `class MyClass_${unique_class} {
        constructor() {
            this.initialize();
            this.observeMutations();
        }

        initialize() {
            ${javascript}
        }

    main_function_${unique_class}($scope) {
        let is_editable = window.location.search.includes('bricks=run');
        ${JSON.parse(js)}
    }

    observeMutations() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches('.wkit-wb-Widget_${all_files.WcardData.widgetdata.widget_id}')) {
                    this.initialize();
                }
            });
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
}

new MyClass_${unique_class}();` : '';

    var bricks_css = `${CssValidation()}`;

    var bricks_php = `<?php 

    /** 
     * Exit if accessed directly.
     */
    if ( ! defined( 'ABSPATH' ) ) {
        exit; 
    } 
    
    if ( ! class_exists( '${NameValidation("file").replaceAll("-", "_")}' ) ) {

    class ${NameValidation("file").replaceAll("-", "_")} extends \\Bricks\\Element {
        
      // Element properties
      public $category     = '${all_files?.WcardData?.widgetdata?.category}'; // Use predefined element category 'general'
      public $name         = 'wb-${all_files?.WcardData?.widgetdata?.widget_id}'; // Make sure to prefix your elements
      public $icon         = '${all_files?.WcardData?.widgetdata?.w_icon}'; // Themify icon font class
      public $css_selector = '.wkit-wb-Widget_${all_files?.WcardData?.widgetdata?.widget_id}'; // Default CSS selector
      public $scripts      = ${bricks_js ? 'array(\'' + NameValidation("file") + '.js\');' : "'';"} // Script(s) run when element is rendered on frontend or updated in builder
    
      // Return localised bricks label.
      public function get_label() {
        return esc_html__( '${NameValidation()}', 'Bricks' );
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
        }` : ''}

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
    
      // Set builder control groups.
      public function set_control_groups() {
        ${layout_data_bricks}
      }
     
      // Set builder controls.
      public function set_controls() {
        ${layout_data}
      }
      public function enqueue_scripts() {

        ${js_link}
        ${bricks_js ?
            `wp_enqueue_script( 'wkit_child_script_${script_id}', wp_upload_dir()['baseurl'].'/wdesignkit/bricks/${NameValidation("folder")}/${NameValidation("file")}.js', ${jqueryLoad}, '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', true  );`
            :
            ''
        }
        
        ${css_link}
        ${bricks_css ?
            `wp_enqueue_style( 'wkit_child_script_${script_id}', wp_upload_dir()['baseurl'].'/wdesignkit/bricks/${NameValidation("folder")}/${NameValidation("file")}.css', [], '${wdkitData.WDKIT_VERSION}.${UniqueNumber()}', false  );`
            :
            ''
        }
      }

      // Render element HTML
      public function render() {
        // Set element attributes
        $root_classes[] = 'wkit-wb-Widget_${all_files?.WcardData?.widgetdata?.widget_id}';
        
        if ( ! empty( $this->settings['type'] ) ) {
          $root_classes[] = "color-{$this->settings['type']}";
        }
    
        // Add 'class' attribute to element root tag
        $this->set_attribute( '_root', 'class', $root_classes );
        
        // Render element HTML
        ${php_editor_code ?
            php_editor_code
            :
            `        
        ${php_variable_validation}
        ${php_variable}
       
        // '_root' attribute is required since Bricks 1.4 (contains element ID, class, etc.)
        $output = '';
        $output .= '<div ' . $this->render_attributes('_root') . ' class="wkit-wb-Widget_${all_files.WcardData?.widgetdata?.widget_id}" data-wdkitunique="${all_files.WcardData?.widgetdata?.widget_id}">';
        $output .= '${widgetHtml}';
        $output .= '</div>';
        echo $output;    `
        }
      }
    }
    }`;

    let trim_name = ImageLink().widgetdata.name.trim();
    var widget_info = Object.assign({}, ImageLink().widgetdata, { 'wkit-version': wdkitData.WDKIT_VERSION, 'name': trim_name })
    let widget_data = { 'widgetdata': widget_info };

    var json_section = JSON.stringify(all_files.CardItems.cardData),
        json_widget = JSON.stringify(widget_data),
        editor_link = JSON.stringify(all_files.Editor_data),

        json_data = `{
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
        'file_name': NameValidation("file"),
        'folder_name': NameValidation("folder"),
        'description': all_files.WcardData.widgetdata.description,
        'bricks_php_file': bricks_php,
        'bricks_js': bricks_js,
        'bricks_css': bricks_css,
        'json_file': json_data,
        "plugin": "bricks",
        "d_image": d_image ? d_image : '',
        "call": call,
    };

    var formData = new FormData();
    formData.append('action', 'wdkit_widget_ajax');
    formData.append('kit_nonce', wdkitData.kit_nonce);
    formData.append('image', image_file);
    formData.append('type', 'wkit_create_widget');
    formData.append('value', JSON.stringify(values));

    await axios.post(ajaxurl, formData, {
        headers: { 'content-type': 'application/json' }
    }).then((response) => {
        if (200 == response.status) {
            if (document.querySelector('.wb-function-call')) {
                document.querySelector('.wb-function-call').click();
            }
            responses.api = response.data;
        } else {
        }
    }).catch(error => console.error(error));

    var NewImage = all_files.WcardData.widgetdata.w_image;
    var NewImageExt = all_files.WcardData.widgetdata.img_ext;

    const Get_image_info = async () => {

        let Json_URL = `${wdkitData.WDKIT_SERVER_PATH}/bricks/${NameValidation("folder")}/${NameValidation("file")}.json`;

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
            'title': NameValidation(),
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

export default Bricks_file_create;