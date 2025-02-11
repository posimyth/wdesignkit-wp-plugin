var textdomain = 'wdesignkit';

/** get unique string of 8 charatcter */
const keyUniqueID = () => {
    let date = new Date();
    let year = date.getFullYear().toString().slice(-2);
    let number = Math.random();
    number.toString(36);
    let uid = number.toString(36).substr(2, 6);
    return uid + year;
}

/**
 * 
 * @param {String} value Input field single quotes ( ' , ` ) bug find in 1.0.8
 * @since 1.0.9
 * 
 * @returns Html
 */
const Replaceinpvalue = (value) => {

    if ('string' === typeof value) {
        let new_val = value.replaceAll("'", "\\'")
        return new_val;
    } else {
        return value;
    }

}

const RepeaterDefault = (controller, builder) => {
    if (controller.type == 'select') {
        return `'${controller.name}' => '${Replaceinpvalue(controller.select_defaultValue[0])}',\n`;
    } else if (controller.type == 'choose') {
        return `'${controller.name}' => '${Replaceinpvalue(controller.align_defaultValue)}',\n`;
    } else if (controller.type == 'select2') {
        var value = ''
        if (builder == 'gutenberg') {
            if (controller && controller.select2_defaultValue) {
                if (!controller.multiple) {
                    value = `'${controller.name}' => ['value' => '${Replaceinpvalue(controller.select2_defaultValue[0].value)}', 'label' => '${Replaceinpvalue(controller.select2_defaultValue[0].lable)}']`
                } else {
                    value += `'${controller.name}' => array(`;
                    controller.select2_defaultValue.map((data) => {
                        value += `['value' => '${Replaceinpvalue(data.value)}', 'label' => '${Replaceinpvalue(data.lable)}'],`
                    })
                    value += `),`;
                }
            }
        }

        return `${value}`;
    } else if (controller.type == 'dimension') {
        return `'${controller.name}' => '',\n`;
    } else if (controller.type == 'slider') {
        return `'${controller.name}' => '',\n`;
    } else if (controller.type == 'selecttemplate') {
        return `'${controller.name}' => '${controller.s_template_defaultValue}',\n`;
    } else if (controller.type == 'switcher') {
        return `'${controller.name}' => ${Replaceinpvalue(controller.defaultValue) ? Replaceinpvalue(controller.defaultValue) : false},\n`;
    } else if (controller.type == 'media') {
        if (builder == 'gutenberg') {
            return `'${controller.name}' => array(
                'url' => '${Replaceinpvalue(controller.defaultValue)}',
                'Id' => '',
            ),`
        } else if (builder == 'bricks') {
            return `'${controller.name}' =>  array(
                    'id' => '0',
                    'url' => '${Replaceinpvalue(controller.defaultValue)}',
                ),`
        } else {
            return `'${controller.name}' => '${Replaceinpvalue(controller.defaultValue)}', \n`;
        }
    } else if (controller.type == 'gallery') {
        if (builder == 'gutenberg') {
            return `'${controller.name}' => array(
                            (object) array('url' => '${controller.defaultValue ? Replaceinpvalue(controller.defaultValue) : ''}', 'Id' => ''),
                          ),`
        } else if (builder == 'bricks') {
            return `'${controller.name}' => array(
                'images' => [
                    array( 'url' => '${Replaceinpvalue(controller.defaultValue)}' )
                ]),`
        } else {
            return `'${controller.name}' => array(
                [
                    'id'    => '',
                    'url' => '${Replaceinpvalue(controller.defaultValue)}'
                ]
            ), \n`;
        }
    } else {
        let d_val = Replaceinpvalue(controller.defaultValue) ? Replaceinpvalue(controller.defaultValue) : '';
        let esc_array = ['text', 'textarea', 'number', 'headingtags', 'heading'];
        if (esc_array.includes(controller.type)) {
            return `'${controller.name}' => esc_html__('${d_val}', '${textdomain}'), \n`;
        } else {
            return `'${controller.name}' => '${d_val}', \n`;
        }
    }
}

export const Temp_component = (item, type, loop, nha, switcher_array, cpt_loop, select_opt) => {

    var sec_layouttest = '',
        php_file = '';

    const Condition_value = (switcher, object) => {
        let condition = '';
        var values = '';

        if (loop) {
            values = 'value.'
        }

        if (object && object.relation && switcher && true === switcher) {
            let relation = object.relation === "or" ? "||" : object.relation === "and" ? "&&" : "";

            object.values.map((conditions) => {
                if (conditions.name && conditions.operator) {
                    condition ? condition += relation : condition += "(";

                    if (switcher_array?.includes(conditions.name)) {
                        if (conditions.operator == '!=') {
                            condition += ` !${values}${conditions.name} `;
                        } else {
                            condition += ` ${values}${conditions.name} `;
                        }
                    } else if (conditions.value == "true" || conditions.value == "false" || conditions.value == "null") {
                        condition += ` ${values}${conditions.name} ${conditions.operator} ${conditions.value} `;
                    } else {
                        condition += ` ${values}${conditions.name} ${conditions.operator} "${conditions.value}" `;
                    }
                }
            })
            condition ? condition += ") &&" : "";
        }

        return condition;
    }

    if (item.type == "text") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Text, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                type: "${item.type}",
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                ${item.placeHolder ? `placeholder:\`${item.placeHolder}\`,` : ''}
                ${item.dynamic ? `dynamic: true,` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => {setAttributes({ ${item.name}${nha ? nha : ""}: value }) ${cpt_loop ? cpt_loop : ''}},`
            }
            }),\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => \'${Replaceinpvalue(item.defaultValue)}\'
        ),\n`

    } else if (item.type == "url") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Url, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                type: "${item.type}",
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                ${item.dynamic ? `dynamic: [true, '${item.name}'],` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item.placeHolder ? `placeholder:\`${item.placeHolder}\`,` : ''}
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }),\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default' => array(
                'url' => \'${Replaceinpvalue(item.defaultValue)}\',
                ${item.is_external ? `'target' => true,` : ''}
                ${item.nofollow ? `'nofollow' => 'no-follow'` : ''}
            ),

        ),\n`

    } else if (item.type == "number") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Text, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                type: "${item.type}",
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                ${item.dynamic ? `dynamic: true,` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item.placeHolder ? `placeholder:\`${item.placeHolder}\`,` : ''}
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => {setAttributes({ ${item.name}${nha ? nha : ""}: value }) ${cpt_loop ? cpt_loop : ''}},`
            }
            }),\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
        'type' => 'string',
        'default' => \'${Replaceinpvalue(item.defaultValue)}\',
        ${(item.selectors || item.selector_value) ? `'style' => array(
            (object) array(
                'selector' => '{{PLUS_WRAP}} ${item.selectors}{${item.selector_value}:{{${item.name}${nha ? nha : ""}}};}',
            ),
        ),` : ''}
    ),\n`
    } else if (item.type == "select") {
        let options = "";
        if (item.options.length > 0) {
            options += "[";
            item.options.map((opt) => {
                options += `['${opt.value}',__('${opt.lable}')],`
            })
            options += "]";
        }
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Select, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                options:${select_opt ? select_opt : options},
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => {setAttributes({ ${item.name}${nha ? nha : ""}: value }) ${cpt_loop ? cpt_loop : ''}},`
            }
            }),\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => '${Replaceinpvalue(item.select_defaultValue[0])}'
        ),\n`
    } else if (item.type == "select2") {
        let options = "";
        var D_val = [];

        if (item.options.length > 0) {
            options += "[";
            item.options.map((opt) => {
                options += `{'value' : \`${opt.value}\`, 'label' : __(\`${opt.lable}\`)},`
            })
            options += "]";
        }

        if (item && item?.select2_defaultValue?.length > 0) {
            if (!item.multiple) {
                D_val = `'value' => '${Replaceinpvalue(item.select2_defaultValue[0].value)}', 'label' => '${Replaceinpvalue(item.select2_defaultValue[0].lable)}'`
            } else {
                item.select2_defaultValue.map((data) => {
                    D_val.push(`['value' => '${Replaceinpvalue(data.value)}', 'label' => '${Replaceinpvalue(data.lable)}']`)
                });
            }
        }

        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_select2, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                options:${options},
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item.multiple ? `isMulti: ${item.multiple},` : ''}
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }),\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => array(${D_val}),
        ),\n`
    } else if (item.type == "textarea") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_TextArea, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                rows:"${item.rows}",
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                ${item.dynamic ? `dynamic: true,` : ''}
                ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }),\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => \'${Replaceinpvalue(item.defaultValue)}\',
        ),\n`
    } else if (item.type == "dimension") {
        let condition = Condition_value(item.conditions, item.condition_value)
        let size_units = '';

        if (item.dimension_units) {
            item.dimension_units.map((unit) => {
                size_units += `'${unit}',`
            })
        }

        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Dimension, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            noLock: false,
            unit: [${size_units}],
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            ${item.responsive ?
                `responsive: true,
            device: device,
            onDeviceChange: (value) => setDevice( value ),` : ''
            }
        }),\n`
        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            ${item.responsive ?
                `'default' => (object) array(
                'md' => array(
                    "top" => ${item.dimension_defaultValue.top ? item.dimension_defaultValue.top : '""'},
                    "right" => ${item.dimension_defaultValue.right ? item.dimension_defaultValue.right : '""'},
                    "bottom" => ${item.dimension_defaultValue.bottom ? item.dimension_defaultValue.bottom : '""'},
                    "left" => ${item.dimension_defaultValue.left ? item.dimension_defaultValue.left : '""'},
                ),
                "unit" => "${item.dimension_defaultValue.unit}",
            ),`
                :

                `'default' => '',`}
            ${(item.selectors || item.selector_value) ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selectors}{ ${item.selector_value}: {{${item.name}${nha ? nha : ""}}}}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "color") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Color, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            disableAlpha: ${!item.alpha},
            disableGlobal: ${!item.global},
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`
        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => '${Replaceinpvalue(item.defaultValue)}',
            ${(item.selectors || item.selector_value) ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selectors}{${item.selector_value}:{{${item.name}${nha ? nha : ""}}};}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "gradientcolor") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Gradient, {
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`
        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => '${Replaceinpvalue(item.defaultValue)}',
            ${(item.selectors || item.selector_value) ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selectors}{${item.selector_value}:{{${item.name}${nha ? nha : ""}}};}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "switcher") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Toggle, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.responsive ?
                `responsive: true,
            device: device,
            onDeviceChange: (value) => setDevice( value ),` : ''
            }
            ${loop ?
                `onChange: v => { value.${item.name} = (v == true ? '${item.return_value}' : v); onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}: value }),`
            }
            }), \n`
        php_file += `'${item.name}${nha ? nha : ""}' => array(
            ${item.responsive ?
                `'type' => 'object',
                'default' => [ 'md' => true,'sm' => false,'xs' => false ],`
                :
                `'type' => 'boolean',
                'default' => ${item.defaultValue == true ? true : false},`
            }
        ), \n`
    } else if (item.type == "heading") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Label_Heading, {
            label: __(\`${item.lable}\`),
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.separator ? `separator:"${item.separator}",` : ''}
            inlineblock: ${true},
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
        ), \n`
    } else if (item.type == "border") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Border, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            responsive: true,
            device: device,
            onDeviceChange: (value) => setDevice( value ),
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default' =>(object) array(
                'openBorder' => 0,
                'type' => '',
                'color' => '',
                'width' =>(object) array(
                    'md' =>(object)array(
                        'top' => '',
                        'left' => '',
                        'bottom' => '',
                        'right' => '',
                    ),
                    'sm' =>(object)array(),
                    'xs' =>(object)array(),
                    "unit" => "",
                ),
            ),
            ${item.selector ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selector}',
                ),
            ),` : ''}

        ), \n`
    } else if (item.type == "boxshadow") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_BoxShadow, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default' =>(object) array(
                'openShadow' => 0,
                'inset' => 0,
                'horizontal' => 0,
                'vertical' => 4,
                'blur' => 8,
                'spread' => 0,
                'color' => "rgba(0,0,0,0.40)",
            ),
            ${item.selector ? `'style' => array(
                    (object) array(
                        'selector' => '{{PLUS_WRAP}} ${item.selector}',
                    ),
                ),` : ''}
            ), \n`
    } else if (item.type == "textshadow") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_BoxShadow, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            istextShadow: true,
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default' =>(object) array(
                'openShadow' => 0,
                'typeShadow' => 'text-shadow', //"text-shadow" Or "drop-shadow"
                'horizontal' => 2,
                'vertical' => 3,
                'blur' => 2,
                'color' => "rgba(0,0,0,0.5)",
            ),
            ${item.selector ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selector}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "background") {
        let condition = Condition_value(item.conditions, item.condition_value);
        var bg_source = [];


        if (item.types.length > 0) {
            item.types.map((src) => {
                if (src == `"classic"`) {
                    bg_source.push(`"color"`)
                    bg_source.push(`"image"`)
                } else {
                    bg_source.push(src)
                }
            })
        }

        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Background, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            sources: [${bg_source}],
            ${item.separator ? `separator:'${item.separator}',` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${loop ? `onChange: v => { value.${item.name} = v; onChange(value); },` :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default' =>(object) array(
            'openBg'=> 0,
            'bgType' => ${bg_source.length > 0 ? bg_source[0] : '""'},
            'videoSource' => 'local',
            'bgDefaultColor' => '',
            'bgGradient' =>(object) array('color1' => '#16d03e', 'color2' => '#1f91f3', 'type' => 'linear', 'direction' => '90', 'start' => 5, 'stop' => 80, 'radial' => 'center', 'clip' => false),
            ),
            ${item.selector ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selector}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "typography") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Typography, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            ${item.separator ? `separator:'${item.separator}',` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            device: device,
            onDeviceChange: (value) => setDevice( value ),
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default'=>(object) array(
                'openTypography' => 0,
                'size' => array('md' => 20, 'unit' => 'px'),
                'height' => array('md' => 22, 'unit' => 'px'),
                'spacing' => array('md' => 0.1, 'unit' => 'px'),
                'fontFamily' => array(
                    'family' => '',
                    'fontWeight' => 400,
                ),
                'fontStyle' => 'Default',
                'textTransform' => 'None',
                'textDecoration' => 'Default',
            ),
            ${item.selector ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selector}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "cssfilter") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_CssFilter, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            ${item.separator ? `separator:'${item.separator}',` : ''}
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default' => array(
                'openFilter' => false,
                'blur' => 0,
                'brightness' => 100,
                'contrast' => 100,
                'saturate' => 100,
                'hue' => 0,
            ),
            ${item.selector ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selector}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "media") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Media, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                multiple: false,
                ${item.separator ? `separator:'${item.separator}',` : ''}
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                ${item.dynamic ? `dynamic: [true, '${item.name}'],` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item?.media_types?.length > 0 ? `type: [${item.media_types}],` : 'type: [],'}
                panel: true,
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`
        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'default' => array(
                'url' => '${Replaceinpvalue(item.defaultValue)}',
                'Id' => '',
            ),
        ), \n`
    } else if (item.type == "gallery") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Media, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.dynamic ? `dynamic: [true, '${item.name}'],` : ''}
            multiple: true,
            type: ['image'],
            ${item.separator ? `separator:'${item.separator}',` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            panel: true,
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`
        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'array',
            'default' => array(
                (object) array('url' => '${item.defaultValue ? Replaceinpvalue(item.defaultValue) : ''}', 'Id' => ''),
            ),
        ), \n`
    } else if (item.type == "iconscontrol") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_IconList, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.separator ? `separator:'${item.separator}',` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default'=> '${Replaceinpvalue(item.defaultValue)}',
        ), \n`
    } else if (item.type == "slider") {
        let range_units = "";
        if (item.size_units.length > 0) {
            item.size_units.filter((units) => {
                if (units.checked == true) {
                    return units;
                }
            }).map((units) => {
                range_units += `'${units.type}', `
            })
        }
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Range, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            ${item.separator ? `separator:'${item.separator}',` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            min: ${loop ? "value." : ""}${item.name}${nha ? nha : ""} && ${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit ? ${item.name}Function(${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit, 'min') : 0,
            max: ${loop ? "value." : ""}${item.name}${nha ? nha : ""} && ${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit ? ${item.name}Function(${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit, 'max') : 100,
            step: ${loop ? "value." : ""}${item.name}${nha ? nha : ""} && ${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit ? ${item.name}Function(${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit, 'step') : 1,
            ${item.responsive && item.show_unit ? `
                unit: [${range_units}],
                responsive: true,
                device: device,
                onDeviceChange: (value) => this.setState({ device: value }),` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
           ${item.responsive && item.show_unit ?
                `'type' => 'object',
            'default' => [ 
                // 'md' => ${item.slider_defaultValue[1] ? item.slider_defaultValue[1] : ''},
                "unit" => '${item.slider_defaultValue[0]}',
            ],`
                :
                `'type' => 'string',
                'default' => '',`
            }
            ${(item.selectors || item.selector_value) ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selectors}{${item.selector_value}:{{${item.name}${nha ? nha : ""}}};}',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "choose") {
        let condition = Condition_value(item.conditions, item.condition_value)
        let array = ['eicon-text-align-left', 'eicon-text-align-right', 'eicon-text-align-center', 'eicon-text-align-justify', 'eicon-arrow-up', 'eicon-arrow-down', 'eicon-arrow-right', 'eicon-arrow-left', 'align_title', 'align_svg'];

        var options = "";
        if (item.align_option.length > 0) {
            var options = "";
            options += `[`
            item.align_option.map((data) => {
                var icon = '';
                if (data.align_icon == 'align_svg' || data.align_icon == 'align_title') {
                    icon = '';
                } else {
                    icon = data.align_icon;
                }

                options += `{ label: __('${data.align_lable}'), value: '${data.align_value}', title: __('${data.align_title ? data.align_title : ""}'), icon: '${icon}', svg: '${data.align_svg ? data.align_svg : ""}' }, \n`
            })
            options += `]`
        }
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_RadioAdvanced, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            ${item.separator ? `separator:'${item.separator}',` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            options : ${options},
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${item.responsive ?
                `responsive: true,
            device: device,
            onDeviceChange: (value) => setDevice( value ),` : ''
            }
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            ${item.responsive ?
                `'type' => 'object',
                'default' => [ 'md' => '', 'sm' =>  '', 'xs' =>  'column' ],`
                :
                `'type' => 'string',
                'default' => '',`}
            ${(item.selectors || item.selector_value) ? `'style' => array(
                (object) array(
                    'selector' => '{{PLUS_WRAP}} ${item.selectors}{ ${item.selector_value}: {{${item.name}${nha ? nha : ""}}}; }',
                ),
            ),` : ''}
        ), \n`
    } else if (item.type == "popover") {
        let condition = Condition_value(item.conditions, item.condition_value);
        let fields_data = "";
        let fields_php = "";
        let repeater_default_value = "";
        item.fields.map((controller) => {
            fields_data += Temp_component(controller, "js", item.name, '', switcher_array);
        })
        item.fields.map((controller) => {
            fields_php += Temp_component(controller, "php");
        })

        if (item.fields) {
            if (item.fields.length > 0) {
                repeater_default_value += `[`;
                item.fields.map((controller) => {
                    repeater_default_value += RepeaterDefault(controller, 'gutenberg');
                })
                repeater_default_value += `]\n`;
            }
        }

        sec_layouttest +=
            `${condition} React.createElement(Pmgc_GroupPopover, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${item.name + (nha ? nha : "")},
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            onChange: value => setAttributes({ ${item.name}${nha ? nha : ""}: value }),
            },
            (value, onChange) => {
                return [
                    React.createElement(Fragment, null,
                        ${fields_data}
                    )]
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'object',
            'groupField' => array(
                (object) array(
                    ${fields_php}
                )
            ),
            'default' => ${repeater_default_value ? repeater_default_value : '[]'},
        ), \n`
    } else if (item.type == "normalhover") {
        let condition = Condition_value(item.conditions, item.condition_value);
        let fields_php_normal = "";

        sec_layouttest += `${condition} React.createElement(Pmgc_Tabs, null, `;
        item?.nha_array?.length > 0 && item.nha_array.map((type, index) => {
            if (type != null) {
                if (item.nha_array_lable?.[index]) {
                    var type_label = item.nha_array_lable[index].charAt(0).toUpperCase() + item.nha_array_lable[index].slice(1);
                } else {
                    if (index == 0) {
                        var type_label = 'Normal';
                    } else if (index == 1) {
                        var type_label = 'Hover';
                    } else if (index == 2) {
                        var type_label = 'Active';
                    } else {
                        var type_label = `Tab - ${index}`;
                    }
                }

                sec_layouttest += `React.createElement(Pmgc_Tab, {
                                tabTitle: __('${type_label}')
                            }, `
                item.fields.map((controller) => {
                    if (controller.key == type) {
                        sec_layouttest += Temp_component(controller, "js", "", "", switcher_array);
                        fields_php_normal += Temp_component(controller, "php", "");
                    }
                })
                sec_layouttest += `), \n`
            }
        })

        sec_layouttest += `), \n`

        php_file += `${fields_php_normal}\n`
    } else if (item.type == "repeater") {
        let condition = Condition_value(item.conditions, item.condition_value);
        let fields_data = "";
        let fields_php = "";
        var repeater_default_value = "";

        item.fields.map((controller) => {
            fields_data += Temp_component(controller, "js", item.name, "", switcher_array);
        })
        item.fields.map((controller) => {
            fields_php += Temp_component(controller, "php");
        })

        if (item.fields.length > 0) {
            repeater_default_value += `array(\n '_key' => '0', \n`;
            item.fields.map((controller) => {
                repeater_default_value += RepeaterDefault(controller, 'gutenberg');
            })
            repeater_default_value += '),';
        }

        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Repeater, {
            // max: 10,
            ${item?.showLable && item.lable ? `labelText:__(\`${item.lable}\`),` : ''}
            value: ${item.name + (nha ? nha : "")},
            attributeName: '${item.name + (nha ? nha : "")}',
            addText: 'Add Item',
            ${item.title_field ? `titleField: \`{${item.title_field}}\`,` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            onChange: value => setAttributes({ ${item.name}${nha ? nha : ""}: value }),
            },
            (value, onChange) => {
                return [
                    React.createElement(Fragment, null,
                        ${fields_data}
                    )]
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'array',
            'repeaterField' => array(
                (object) array(
                    ${fields_php}
                )
            ),
            'default' => array(${repeater_default_value}),
        ), \n`
    } else if (item.type == "rawhtml") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Note, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.defaultValue ? `description: \`${item.defaultValue}\`,` : ''}
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`
    } else if (item.type == "headingtags") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Heading, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }), \n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => '${item.select_defaultValue[0]}'
        ), \n`
    } else if (item.type == "styleimage") {
        let options = "";
        if (item.options.length > 0) {
            options += `array(`;
            item.options.map((opt) => {
                options += `{ 'value': '${opt.value}', 'lable': __('${opt.lable}'), 'svg': __('${opt.svg}'), }, `;
            });
            options += `)`;
        }

        let condition = Condition_value(item.conditions, item.condition_value);
        sec_layouttest += `${condition} React.createElement(Pmgc_Styles, {
            ${item?.showLable && item.lable ? `label: __("${item.lable}"),` : ''}
            columns: '${item.columns}',
            ${item?.description ? `help: '${Replaceinpvalue(item.description)}',` : ''}
            ${item.separator ? `separator:'${item.separator}',` : ''}
            value: ${item.name},
            options: ${options},
            onChange: (value) => setAttributes({ ${item.name}: value }),
            }), \n`;
        php_file += `'${item.name}' => array(
            'type' => 'string',
            'default' => '${Replaceinpvalue(item.select_defaultValue[0])}',
        ),\n`;
    } else if (item.type == "datetime") {
        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(DateTimePicker, {
            ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
            ${item?.description ? `help: \`${item.description}\`,` : ''}
            currentDate: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
            ${item.separator ? `separator:"${item.separator}",` : ''}
            ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
            is12Hour: true,
            ${loop ?
                `onChange: v => { value.${item.name} = v; onChange(value); },`
                :
                `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
            }
            }),\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(),\n`

    } else if (item.type == "cpt") {
        let feilds_js = '';
        let feilds_php = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {

                if (cpt_con.name != 'post_type_' + item.unique_id) {
                    if (item.unique_id && cpt_con.name.search(item.unique_id) > -1) {
                        var type = cpt_con.name.replace('_' + [item.unique_id], '')
                    }

                    if (cpt_con.name == 'order_by_' + item.unique_id) {
                        feilds_js += Temp_component(cpt_con, 'js', '', '', switcher_array, `, ${item.name}_fun(value, '${type}')`, 'wdkit_post_type?.order_by ? wdkit_post_type.order_by : []');
                    } else {
                        feilds_js += Temp_component(cpt_con, 'js', '', '', switcher_array, `, ${item.name}_fun(value, '${type}')`);
                    }
                    feilds_php += Temp_component(cpt_con, 'php', '', '', switcher_array, `, ${item.name}_fun()`);
                }
            })
        }

        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Select, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                options: wdkit_post_type?.post_list ? wdkit_post_type.post_list : [],
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                onChange: (value) => {setAttributes({ ${item.name}${nha ? nha : ""}: value }), ${item.name}_fun(value, 'type')},
            }),\n
            
            ${feilds_js}\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => 'post'
        ),\n
        
        ${feilds_php}\n`
    } else if (item.type == "product_listing") {
        let feilds_js = '';
        let feilds_php = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {

                if (cpt_con.name != 'post_type_' + item.unique_id) {
                    if (item.unique_id && cpt_con.name.search(item.unique_id) > -1) {
                        var type = cpt_con.name.replace('_' + [item.unique_id], '')
                    }

                    if (cpt_con.name == 'order_by_' + item.unique_id) {
                        feilds_js += Temp_component(cpt_con, 'js', '', '', switcher_array, `, ${item.name}_fun(value, '${type}')`, 'wdkit_post_type?.order_by ? wdkit_post_type.order_by : []');
                    } else {
                        feilds_js += Temp_component(cpt_con, 'js', '', '', switcher_array, `, ${item.name}_fun(value, '${type}')`);
                    }
                    feilds_php += Temp_component(cpt_con, 'php', '', '', switcher_array, `, ${item.name}_fun()`);
                }
            })
        }

        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest += `${feilds_js}\n`

        php_file += `${feilds_php}\n`
    } else if (item.type == "taxonomy") {
        let feilds_js = '';
        let feilds_php = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {

                if (item.unique_id && cpt_con.name.search(item.unique_id) > -1) {
                    var type = cpt_con.name.replace('_' + [item.unique_id], '')
                }
                if (cpt_con.name == 'post_type_' + item.unique_id) {
                    feilds_js += Temp_component(cpt_con, 'js', '', '', switcher_array, `, ${item.name}_fun(value, '${type}')`, 'wdkit_post_type?.post_list ? wdkit_post_type.post_list : []');
                } else {
                    feilds_js += Temp_component(cpt_con, 'js', '', '', switcher_array, `, ${item.name}_fun(value, '${type}')`);
                }
                feilds_php += Temp_component(cpt_con, 'php', '', '', switcher_array, `, ${item.name}_fun()`);
            })
        }

        let condition = Condition_value(item.conditions, item.condition_value)
        sec_layouttest +=
            `${condition} React.createElement(Pmgc_Select, {
                ${item?.showLable && item.lable ? `label: __(\`${item.lable}\`),` : ''}
                options: Object.entries(wdkit_taxonomy),
                ${item.separator ? `separator:"${item.separator}",` : ''}
                ${item?.description ? `help: \`${item.description}\`,` : ''}
                ${item.lableBlock ? `inlineblock:${!item.lableBlock},` : ''}
                value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
                onChange: (value) => {setAttributes({ ${item.name}${nha ? nha : ""}: value }), ${item.name}_fun(value, 'type')},
            }),\n
            
            ${feilds_js}\n`

        php_file += `'${item.name}${nha ? nha : ""}' => array(
            'type' => 'string',
            'default' => 'category'
        ),\n
        
        ${feilds_php}\n`
    }

    if (type == "php") {
        php_file = php_file.replaceAll('{{CURRENT_ITEM}}', '{{TP_REPEAT_ID}}');
        php_file = php_file.replaceAll('{{WRAPPER}}', '{{PLUS_WRAP}}');
        return php_file;
    } else if (type == "js") {
        return sec_layouttest;
    }
}

export const Elementer_data = (item, repeater, select_opt) => {
    /** condition function for controller  */
    const Condition_function = (data) => {
        var condition = ""
        if (data.conditions == true) {
            data.condition_value.values.map((cd_data) => {
                if (cd_data.name == "" || cd_data.operator == "") {
                } else {
                    cd += `array('name' => '${Replaceinpvalue(cd_data.name)}', 'operator' => '${cd_data.operator}', 'value' => '${Replaceinpvalue(cd_data.value)}'),\n`
                }
            })
            if (cd == "") {
                condition = "";
            } else {
                condition += `'conditions' => array(
                    'relation' => '${data.condition_value.relation}',
                    'terms' => [${cd}],
                ),`
            }
        }
        return condition;
    }
    var textdomain = "wdesignkit"

    var layout = "";
    var cd = "";
    var group_controles = ["typography", "textshadow", "boxshadow", "textstrocke", "border", "background", "imagesize", "cssfilter"]

    if (item.type == "text") {
        let name = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::TEXT,
            ${item?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
            ${item.defaultValue ? `'default' => esc_html__( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.input_type ? `'input_type' => '${item.input_type}',` : ''} 
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }

    } else if (item.type == "preview") {
        let name = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `
               array(
                    'label' => '<div class="elementor-update-preview" style="margin: 0;">
                                        <div class="elementor-update-preview-title">Update changes to page</div>
                                            <div class="elementor-update-preview-button-wrapper">
                                                <button class="elementor-update-preview-button elementor-button"">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>',
                    'type'  => Controls_Manager::RAW_HTML,
                )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }

    } else if (item.type == "number") {
        let name = ``,
            min_count = item?.number_setting?.min,
            max_count = item?.number_setting?.max,
            step_count = item?.number_setting?.step;

        var selector_data = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.selectors != '') {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{VALUE}}',`
            selector_data += `),`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::NUMBER,
            'min' => ${(min_count != undefined && min_count != '') ? min_count : '""'},
            'max' => ${(max_count != undefined && max_count != '') ? max_count : '""'},
            'step' => ${(step_count != undefined && step_count != '') ? step_count : '""'},
            'default' => ${(item.defaultValue != undefined && item.defaultValue != '') ? item.defaultValue : '""'},
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${Condition_function(item)}
            ${selector_data}
        )`

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "repeater") {
        var fields = ``;
        var name = ``;
        var repeater_name = ``;
        var repeater_fields = ``;
        var repeater_default_value = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.repeater_type == "Old") {
            repeater_name += `repeater_${keyUniqueID()}`
        } else if (item.repeater_type == "New") {
            repeater_name = "";
        }

        if (item.fields) {
            repeater_default_value += `array(`;
            for (let i = 0; i < item.defaultCount; i++) {
                if (item.fields.length > 0) {
                    repeater_default_value += `array(`;
                    repeater_default_value += `'_id'=>uniqid('Wkit-${keyUniqueID()}'),\n`;
                    item.fields.map((controller) => {
                        repeater_default_value += RepeaterDefault(controller, 'elementor');
                    })
                    repeater_default_value += `),\n`;
                }
            }
            repeater_default_value += `)`;
        }

        if (item.fields.length > 0) {
            if (item.repeater_type == "Old") {
                fields += `$${repeater_name}->get_controls(),`
            } else if (item.repeater_type == "New") {
                fields += `array(`
                item.fields.map((data) => {
                    if (!group_controles.includes(data.type)) {
                        fields += `${Elementer_data(data, "")},`
                    }
                })
                fields += `),`
            }
        }

        let layout_array = `array(
                ${name}
				'type' => Controls_Manager::REPEATER,
				${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
                ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
                ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
                ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
                ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
                ${item.title_field ? `'title_field' => '${Replaceinpvalue(item.title_field)}',` : ''}
				'fields' => ${fields ? fields : "array(),"}
                ${repeater_default_value ? `'default' => ${repeater_default_value},` : ''}
                ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
                ${item.prevent_empty === true ? '' : `'prevent_empty' => ${item.prevent_empty},`}     
                ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            if (item.repeater_type == "Old") {
                item.fields.map((data) => {
                    repeater_fields += Elementer_data(data, repeater_name)
                })
                layout += `$${repeater_name} = new \\Elementor\\Repeater();

                ${repeater_fields}
                
                $this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                    ${layout_array}
                );\n`
            } else {
                layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                    ${layout_array}
                );\n`
            }
        }
    } else if (item.type == 'popover') {
        let name = ``;
        var controllers = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.fields) {
            if (repeater && repeater != undefined) {
                controllers += `$${repeater}->start_popover();\n`
                item.fields.map((controller) => {
                    controllers += Elementer_data(controller, repeater);
                })
                controllers += `$${repeater}->end_popover();\n`
            } else {
                controllers += `$this->start_popover();\n`
                item.fields.map((controller) => {
                    controllers += Elementer_data(controller);
                })
                controllers += `$this->end_popover();\n`
            }
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::POPOVER_TOGGLE,
            ${item.return_value ? `'return_value' => '${Replaceinpvalue(item.return_value)}',` : ''}
            'default' => 'yes',
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            'label_block' => false,
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );
            ${controllers}\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );
            ${controllers}\n`
        }
    } else if (item.type == 'normalhover') {
        let name = ``;
        var controllers = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.fields) {
            if (repeater && repeater != undefined) {
                item.nha_array.length > 0 && item.nha_array.map((type, index) => {
                    if (type != null) {
                        if (item.nha_array_lable?.[index]) {
                            var type_label = item.nha_array_lable[index].charAt(0).toUpperCase() + item.nha_array_lable[index].slice(1);
                        } else {
                            if (index == 0) {
                                var type_label = 'Normal';
                            } else if (index == 1) {
                                var type_label = 'Hover';
                            } else if (index == 2) {
                                var type_label = 'Active';
                            } else {
                                var type_label = `Tab-${index}`;
                            }
                        }
                        controllers += `$${repeater}->start_controls_tab(\n
                        '${item.name}_${type}_tab',
                            array(
                                'label' => esc_html__( '${type_label}', '${textdomain}' ),
                            )
                        );\n`
                        item.fields.filter((controller) => {
                            if (controller.key == type) {
                                return controller
                            }
                        }).map((controller) => {
                            controllers += Elementer_data(controller, repeater);
                        })
                        controllers += `$${repeater}->end_controls_tab();\n`
                    }
                })
            } else {
                item?.nha_array?.length > 0 && item.nha_array.map((type, index) => {
                    if (item.nha_array[index] != null) {
                        if (item.nha_array_lable?.[index]) {
                            var type_label = item.nha_array_lable[index].charAt(0).toUpperCase() + item.nha_array_lable[index].slice(1);
                        } else {
                            if (index == 0) {
                                var type_label = 'Normal';
                            } else if (index == 1) {
                                var type_label = 'Hover';
                            } else if (index == 2) {
                                var type_label = 'Active';
                            } else {
                                var type_label = `Tab-${index}`;
                            }
                        }
                        controllers += `$this->start_controls_tab(\n
                        '${item.name}_${type}_tab',
                            array(
                                'label' => esc_html__( '${type_label}', '${textdomain}' ),
                            )
                        );\n`
                        item.fields.filter((controller) => {
                            if (controller.key == type) {
                                return controller
                            }
                        }).map((controller) => {
                            controllers += Elementer_data(controller);
                        })
                        controllers += `$this->end_controls_tab();\n`
                    }
                })
            }
        }

        let layout_array = `array(
            ${name}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->start_controls_tabs('${item.name}',
                ${layout_array}
            );
            ${controllers}\n
            $this->end_controls_tabs();`
        } else {
            layout += `$this->start_controls_tabs('${item.name}',
                ${layout_array}
            );
            ${controllers}\n
            $this->end_controls_tabs();`
        }
    } else if (item.type == "wysiwyg") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
                ${name}
                ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
				'type' => Controls_Manager::WYSIWYG,
                ${item?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
                ${item.defaultValue ? `'default' => esc_html__( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''}
                ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
                ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
                ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
                ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
                ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
                ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
                ${item.dynamic === true ? `'dynamic' => array(
                    'active' => ${item.dynamic},
                ),` : ''}
                ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array;
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "code") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            'type' => Controls_Manager::CODE,
            ${item?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            'language' => '${item.language}',
            'rows'=> '${item.rows}' ,
            ${item.defaultValue ? `'default' => '${Replaceinpvalue(item.defaultValue)}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "choose") {
        let name = ``;
        var gg = ``;
        var selector_data = ``;


        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.selectors != "") {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{VALUE}}',`
            selector_data += `),`
        }

        if (item.align_option) {
            var align_option = ``;
            align_option += `'options' => array(`;
            item.align_option.map((align) => {
                align_option += `
                    '${align.align_value}' => array(
                        'title' => esc_html__( '${Replaceinpvalue(align.align_lable)}', '${textdomain}' ),
                        'icon' => '${Replaceinpvalue(align.align_icon)}',
                    ),
                `;
            })
            align_option += `),`;
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::CHOOSE,
            ${align_option}
            ${item.align_defaultValue ? `'default' => '${Replaceinpvalue(item.align_defaultValue)}',` : ''}
            'toggle' => true,
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
            ${selector_data}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "datetime") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::DATE_TIME,
            ${item.defaultValue ? `'default' => esc_html__( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
        )`

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "gallery") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }
        let layout_array = `array(
            ${name}
            'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),
            'type' => Controls_Manager::GALLERY,
            ${item.defaultValue ? `
                'default' => array(
                [
                'id'    => '',
                'url' => '${Replaceinpvalue(item.defaultValue)}'
                ]
                ),
                ` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }

    } else if (item.type == "background") {
        var selector_data = ``;

        if (item.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${item.selector}',`
        }

        let layout_array = `
        Group_Control_Background::get_type(),
        array(
            'name' => '${item.name}',
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'types' => [${item.types}],
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
            ${selector_data}
        )`;

        if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        }
    } else if (item.type == "border") {
        var selector_data = ``;
        if (item.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${item.selector}',`
        }
        let layout_array = `
        Group_Control_Border::get_type(),
        array(
            'name' => '${item.name}',
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
            ${selector_data}
        )`;
        if (repeater && repeater != undefined) {
            layout += `$${repeater}->add_group_control(
                ${layout_array}
            );\n`
        } else {
            layout += `$this->add_group_control(
                ${layout_array}
            );\n`
        }
    } else if (item.type == "dimension") {
        var selector_data = ``;
        let name = ``;
        let size_units = ``;
        let default_val = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.selectors != "") {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',`
            selector_data += `),`
        }

        if (item.dimension_units) {
            item.dimension_units.map((unit) => {
                size_units += `'${unit}',`
            })
        }

        if (item.dimension_defaultValue) {
            if (item.dimension_defaultValue.isLinked == true) {
                default_val = `array(
                    'top' => '${item.dimension_defaultValue.top}',
                    'right' => '${item.dimension_defaultValue.top}',
                    'bottom' => '${item.dimension_defaultValue.top}',
                    'left' => '${item.dimension_defaultValue.top}',
                    'unit' => '${item.dimension_defaultValue.unit}',
                    'isLinked' => '${item.dimension_defaultValue.isLinked}',
                )`
            } else if (item.dimension_defaultValue.isLinked == false) {
                default_val = `array(
                    'top' => '${item.dimension_defaultValue.top}',
                    'right' => '${item.dimension_defaultValue.right}',
                    'bottom' => '${item.dimension_defaultValue.bottom}',
                    'left' => '${item.dimension_defaultValue.left}',
                    'unit' => '${item.dimension_defaultValue.unit}',
                    'isLinked' => '${item.dimension_defaultValue.isLinked}',
                )`
            }
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::DIMENSIONS,
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            'size_units' => array(${size_units}),
            ${default_val ? `'default' => ${default_val},` : ''}
            ${item.responsive == true ?
                `'tablet_default' => ${default_val},
                'mobile_default' => ${default_val},
                'widescreen_default' => ${default_val},`
                : ''
            }
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
            ${selector_data}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "boxshadow") {
        var selector_data = "";

        if (item.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${item.selector}',`
        }

        let layout_array = `
        Group_Control_Box_Shadow::get_type(),
        array(
            'name' => '${item.name}',
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
            ${selector_data} 
        )`

        if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        }
    } else if (item.type == "textshadow") {
        var selector_data = "";
        if (item.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${item.selector}',`
        }
        let layout_array = `
        Group_Control_Text_Shadow::get_type(),
            array(
				'name' => '${item.name}',
                ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
                ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
                ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
                ${Condition_function(item)}
				${selector_data}
			)`

        if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                    ${layout_array}
                );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                    ${layout_array}
                );\n`
        }
    } else if (item.type == "color") {
        var selector_data = ``;
        let name = ``;
        if (repeater != undefined && repeater == "") {
            name = `'name' => '${item.name}',`
        }

        if (item.selectors != "") {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{VALUE}}',`
            selector_data += `),`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' =>  Controls_Manager::COLOR,
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}                
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.defaultValue ? `'default' => '${Replaceinpvalue(item.defaultValue)}',` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            'alpha' => ${item.alpha},
            ${item.global === true ? `'global' => array(
                'active' => ${item.global},
            ),` : ''}
            ${Condition_function(item)}
            ${selector_data}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "cssfilter") {
        var selector_data = ``;

        if (item.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${item.selector}',`
        }
        let layout_array = `
			\\Elementor\\Group_Control_Css_Filter::get_type(),
			array(
				'name' => '${item.name}',
                ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
                ${Condition_function(item)}
				${selector_data}
			)`
        if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        }
    } else if (item.type == "hidden") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::HIDDEN,
            ${item.defaultValue ? `'default' => '${Replaceinpvalue(item.defaultValue)}',` : ''}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }

    } else if (item.type == "media") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::MEDIA,
            ${item?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            'default' => array(
                'url' => ${item.defaultValue ? `'${item.defaultValue}'` : '\\Elementor\\Utils::get_placeholder_image_src()'},
            ),
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            'media_types' => array(${item.media_types}),
           ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "typography") {
        var selector_data = ``;

        if (item.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${item.selector}',`
        }

        let layout_array = `
            Group_Control_Typography::get_type(),
			array(
				'name' => '${item.name}',
                ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
                ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
                ${Condition_function(item)}
                ${selector_data}
			)`

        if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_group_control"}(
                ${layout_array}
            );\n`
        }
    } else if (item.type == "heading") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::HEADING,
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "divider") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            'type' => Controls_Manager::DIVIDER,
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "rawhtml") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::RAW_HTML,
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.defaultValue ? `'raw' => wp_kses_post( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "iconscontrol") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::ICONS,
            'fa4compatibility' => 'icon',
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.skin ? `'skin' => '${item.skin}',` : ''}
            ${item.exclude_inline_options ? `'exclude_inline_options' => array('${item.exclude_inline_options}'),` : ''}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item.defaultValue ? `'default' => array(
                'value' => '${Replaceinpvalue(item.defaultValue)}',
                'library' => 'fa-solid',
            ),` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "slider") {
        var selector_data = ``;
        var size_units = ``;
        var range = ``;
        var default_value = ``;
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }
        if (item.size_units != "" && item.size_units != undefined) {
            item.size_units.map((unit) => {
                if (unit.checked == true) {
                    size_units += `"${unit.type}",`;
                    range += `'${unit.type}' => array(
						'min' => ${unit?.min || unit?.min == 0 ? unit?.min : '0'},
						'max' => ${unit?.max || unit?.max == 0 ? unit?.max : '1000'},
						'step' => ${unit?.step || unit?.step == 0 ? unit?.step : '1'},
					),`
                }
            })
            if (size_units && range) {
                size_units = `'size_units' => array( ${size_units} ),`
                range = `'range' => array(${range}),`
            } else {
                size_units = ``;
                range = ``;
            }

        }
        if (item.slider_defaultValue != "" && item.slider_defaultValue != undefined) {
            if (size_units) {
                default_value += `array(
                                    'unit' => '${item.slider_defaultValue[0]}',
                                    'size' => ${item.slider_defaultValue[1] ? item.slider_defaultValue[1] : "''"},
                                )`
            } else {
                default_value += `array(
                                    'size' => ${item.slider_defaultValue[1] ? item.slider_defaultValue[1] : "''"},
                                )`

            }
        }
        if (item.selectors != "") {
            selector_data += `'selectors' => array(`
            if (item && item.show_unit == true && size_units) {
                selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{SIZE}}{{UNIT}};',)`
            } else {
                selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{SIZE}};',)`
            }

        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::SLIDER,
            ${size_units}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${range}
            ${default_value ? `'default' => ${default_value},` : ''}
            ${item.responsive == true ?
                `'tablet_default' => ${default_value},
                'mobile_default' => ${default_value},
                'widescreen_default' => ${default_value},`
                : ''
            }
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            'render_type' => 'ui',
           ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${Condition_function(item)}
            ${selector_data}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }

    } else if (item.type == "select") {
        let options = item.options;
        var opt = ""
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        options.map((data) => {
            opt += `'${data.value}'  => esc_html__( '${data.lable}', '${textdomain}' ),`
        })

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::SELECT,
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.select_defaultValue[0] ? `'default' => '${Replaceinpvalue(item.select_defaultValue[0])}',` : ''}
            ${Condition_function(item)}
            ${select_opt ? `'options' => ${select_opt},` : `'options' => array( ${opt} ),`}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }

    } else if (item.type == "selecttemplate") {
        var opt = ""
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::SELECT,
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            'default' => '0',
            ${Condition_function(item)}
            'options' => Wdkit_Wb_Elementor_Controller::wdkit_get_templates(),
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }

    } else if (item.type == "select2") {
        let options = item.options;
        var opt = "";
        let name = ``;
        var D_val = [];
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }
        options.map((data) => {
            opt += `'${Replaceinpvalue(data.value)}'  => esc_html__( '${Replaceinpvalue(data.lable)}', '${textdomain}' ),`
        })

        if (item && item.select2_defaultValue) {
            // var value = (item.select2_defaultValue.split(","));
            item.select2_defaultValue.map((data) => {
                D_val.push("'" + Replaceinpvalue(data.value) + "'")
            })
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::SELECT2,
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            'default' => array(${D_val}),
            ${item.multiple === true ? `'multiple' => ${item.multiple},` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}

            'options' => array( ${opt} ),
            ${Condition_function(item)}
        )`;


        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "textarea") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }
        let layout_array = `array(
            ${name}
            'type' => Controls_Manager::TEXTAREA,
            ${item?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            'rows' => '${item.rows}',
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            ${item.defaultValue ? `'default' => esc_html__( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "switcher") {
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }
        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::SWITCHER,
            'label_on' => esc_html__( '${Replaceinpvalue(item.label_on)}', '${textdomain}' ),
            'label_off' => esc_html__( '${Replaceinpvalue(item.label_off)}', '${textdomain}' ),
            ${item?.description ? `'description' => esc_html__( '${item.description}', '${textdomain}' ),` : ''}
            'return_value' => '${Replaceinpvalue(item.return_value)}',
            'default' => '${item.defaultValue == true ? item.return_value : ``}',
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            'label_block' => false,
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "headingtags") {
        let options = [{ "value": "h1", "lable": "H1" }, { "value": "h2", "lable": "H2" }, { "value": "h3", "lable": "H3" }, { "value": "h4", "lable": "H4" }, { "value": "h5", "lable": "H5" }, { "value": "h6", "lable": "H6" }];
        var opt = ""
        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }
        options.map((data) => {
            opt += `'${data.value}'  => esc_html__( '${data.lable}', '${textdomain}' ),`
        })
        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::SELECT,
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.select_defaultValue[0] ? `'default' => '${Replaceinpvalue(item.select_defaultValue[0])}',` : ''}
            ${Condition_function(item)}
            'options' => array( ${opt} ),
        )`;
        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "url") {
        let name = ``;
        let options_array = [];
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.url_options && item.url_options == true && item.url_options_array) {
            options_array += `array(`
            item.url_options_array.map((options) => {
                options_array += `'${options}',`
            })
            options_array += `)`
        } else {
            options_array = false;
        }
        let layout_array = `array(
            ${name}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::URL,
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            'options' => ${options_array},
            'default' => array(
                'url' => '${item.defaultValue}',
                'is_external' => ${item.is_external},
                'nofollow' => ${item.nofollow},
                'custom_attributes' => '${item.custom_attributes}',
            ),
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item.dynamic === true ? `'dynamic' => array(
                'active' => ${item.dynamic},
            ),` : ''}
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
                ${layout_array}
            );\n`
        }
    } else if (item.type == "alert") {

        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
            ${name}
            ${item.lable ? `'heading' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::ALERT,
            ${item?.description ? `'content' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            'alert_type' => '${item.alert_type}',
            ${Condition_function(item)}
        )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
            ${layout_array}
        );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
            ${layout_array}
        );\n`
        }
    } else if (item.type == "notice") {

        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
        ${name}
        ${item.lable ? `'heading' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => Controls_Manager::NOTICE,
        ${item?.description ? `'content' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        'notice_type' => '${item.notice_type}',
        'dismissible' => ${item.dismissible},  
        ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
        ${Condition_function(item)}
    )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
            ${layout_array}
        );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
            ${layout_array}
        );\n`
        }
    } else if (item.type == "deprecatednotice") {

        let name = ``;
        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `array(
        ${name}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        ${item?.description ? `'content' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ).' <a href="">' . esc_html__( 'Learn more', 'textdomain' ) . '</a>',` : ''}
        'type' => Controls_Manager::DEPRECATED_NOTICE,
        ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
        ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
        'widget' => '${Replaceinpvalue(item.deprecatedValue[0].Widget)}',
        'since' => '${Replaceinpvalue(item.deprecatedValue[1].Since)}',
        'last' => '${Replaceinpvalue(item.deprecatedValue[2].Last)}',
        'plugin' => '${Replaceinpvalue(item.deprecatedValue[3].Plugin)}',
        'replacement' => '${Replaceinpvalue(item.deprecatedValue[4].Replacement)}',
        ${Condition_function(item)}
    )`;

        if (repeater != undefined && repeater == "") {
            layout += layout_array
        } else if (repeater && repeater != undefined) {
            layout += `$${repeater}->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
            ${layout_array}
        );\n`
        } else {
            layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('${item.name}',
            ${layout_array}
        );\n`
        }
    } else if (item.type == "cpt") {

        let feilds = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {
                if (cpt_con.name != 'post_type_' + item.unique_id) {
                    if (cpt_con.name == 'order_by_' + item.unique_id) {
                        feilds += Elementer_data(cpt_con, repeater, '$this->set_options("order_by")');
                    } else {
                        feilds += Elementer_data(cpt_con);
                    }
                }
            })
        }

        let layout_array = `array(
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => Controls_Manager::SELECT,
            'options' => $this->set_options("post_list"),
            'default' => 'post',
            ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
            ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
            ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
            ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${Condition_function(item)}
        )`

        layout += `$this->${item.responsive == true ? "add_responsive_control" : "add_control"}('post_type_${item.unique_id}',
            ${layout_array}
        );\n
        
        ${feilds}`
    } else if (item.type == "product_listing") {

        let feilds = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {
                if (cpt_con.name != 'post_type_' + item.unique_id) {
                    if (cpt_con.name == 'order_by_' + item.unique_id) {
                        feilds += Elementer_data(cpt_con, repeater, '$this->set_options("order_by")');
                    } else {
                        feilds += Elementer_data(cpt_con);
                    }
                }
            })
        }

        layout += feilds;
    } else if (item.type == "taxonomy") {

        let feilds = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {
                if (cpt_con.name == 'post_type_' + item.unique_id) {
                    feilds += Elementer_data(cpt_con, repeater, '$this->set_options("post_list")');
                } else {
                    feilds += Elementer_data(cpt_con);
                }
            })
        }

        layout += `
        $this->add_control('taxonomy_${item.unique_id}',
            array(
                ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
                'type' => Controls_Manager::SELECT,
                'options' => get_taxonomies(),
                'default' => 'category',
                ${item.showLable === true ? '' : `'show_label' => ${item.showLable},`}
                ${item.lableBlock === false ? '' : `'label_block' => ${item.lableBlock},`}
                ${item.separator !== 'default' ? `'separator' => '${item.separator}',` : ''}
                ${item.controlClass ? `'classes' => '${Replaceinpvalue(item.controlClass)}',` : ''}
                ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
                ${Condition_function(item)}
            )
        );\n
        
        ${feilds}`
    }

    return layout;
}

export const Bricks_data = (item, tabs, repeater, section_data, select_opt) => {

    /** condition function for controller  */
    const Condition_function = (data) => {
        var required = ""
        if (data.conditions == true) {
            data.condition_value.values.map((cd_data) => {
                if (cd_data.name == "" || cd_data.operator == "") {
                } else {
                    cd += `['${Replaceinpvalue(cd_data.name)}','${cd_data.operator == '==' ? '=' : cd_data.operator}', ${(cd_data.value == true || cd_data.value == false || cd_data.value == 'true' || cd_data.value == 'false') ? cd_data.value : `'${Replaceinpvalue(cd_data.value)}'`}],\n`;
                }
            })
            if (cd == "") {
                required = "";
            } else {
                required += `'required' =>  [${cd}],`
            }
        }
        return required;
    }

    var textdomain = "wdesignkit",
        layout = "",
        cd = "",
        group_controles = ["typography", "textshadow", "boxshadow", "textstrocke", "border", "background", "imagesize", "cssfilter"];

    if (item.type == "text") {

        let layout_array = `
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'text',
            'spellcheck' => true,
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.defaultValue ? `'default' => esc_html__( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "number") {
        let layout_array = `
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'number',
            'min' => ${item?.number_setting?.min ? item?.number_setting?.min : '""'},
            'max' => ${item?.number_setting?.max ? item?.number_setting?.max : '""'},
            'step' => ${item?.number_setting?.step ? item?.number_setting?.step : '""'},
            'default' => ${item.defaultValue ? item.defaultValue : 0},
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${Condition_function(item)}
            ${item.lableBlock === false ? '' : `'inline' =>${item.lableBlock},`}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            ${item.selector_value || item.selectors ? `'css' => [
                [
                    'property' => '${Replaceinpvalue(item.selector_value)}',
                    'selector' => '${Replaceinpvalue(item.selectors)}',
                ],
            ],` : ''}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "repeater") {
        var fields = ``;
        var name = ``;
        var repeater_name = ``;
        var repeater_default_value = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        if (item.repeater_type == "Old") {
            repeater_name += `repeater_${keyUniqueID()}`
        } else if (item.repeater_type == "New") {
            repeater_name = "";
        }

        if (item.fields) {
            repeater_default_value += `[`;
            for (let i = 0; i < item.defaultCount; i++) {
                if (item.fields.length > 0) {
                    repeater_default_value += `[`;
                    item.fields.map((controller) => {
                        repeater_default_value += RepeaterDefault(controller, 'bricks');
                    })
                    repeater_default_value += `],\n`;
                }
            }
            repeater_default_value += `]`;
        }

        if (item.fields.length > 0) {
            fields += `[`
            item.fields.forEach((data) => {
                if (!group_controles.includes(data.type)) {
                    fields += `\n ${Bricks_data(data, '', "repeater")}`;
                }
            });
            fields += `],`;
        }

        let layout_array = `
            $this->controls['${item.name}'] = [
                'tab' =>  '${tabs}',
                ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
                ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
				'type' => 'repeater',
                ${item.title_field ? `'titleProperty' => '${Replaceinpvalue(item.title_field)}',` : ''}
                ${repeater_default_value ? `'default' => ${repeater_default_value},` : ''}
                ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
                'inline' => false,
                ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
                'fields' => ${fields ? fields : "[]"}
                ${Condition_function(item)}
            ];
        `;
        layout += layout_array;


    } else if (item.type == "textarea") {
        let layout_array = `
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'textarea',
            'rows' => '${item.rows}',
            'spellcheck' => true,
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            ${item.defaultValue ? `'default' => '${Replaceinpvalue(item.defaultValue)}',` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "color") {
        let layout_array = `
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'color',
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.selector_value || item.selectors ? `'css' => [
                [
                    'property' => '${Replaceinpvalue(item.selector_value)}',
                    'selector' => '${Replaceinpvalue(item.selectors)}',
                ],
            ],` : ''}            
            ${item.defaultValue ? `'default' => [
              'hex' => '${Replaceinpvalue(item.defaultValue)}',
            ],` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "select") {
        let options = item.options;
        var opt = ""
        options.map((data) => {
            opt += `'${data.value}'  => esc_html__( '${data.lable}', '${textdomain}' ),`
        })
        let layout_array = `
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'select',
            ${select_opt ? `'options' => ${select_opt},` : `'options' => array( ${opt} ),`}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            'multiple' => false, 
            'searchable' => true,
            'clearable' => true,
            ${item.select_defaultValue[0] ? `'default' => '${Replaceinpvalue(item.select_defaultValue[0])}',` : ''}
            ${Condition_function(item)}
            `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "select2") {
        let options = item.options;
        var opt = "";
        var D_val = [];
        options.map((data) => {
            opt += `'${Replaceinpvalue(data.value)}'  => esc_html__( '${Replaceinpvalue(data.lable)}', '${textdomain}' ),`
        })

        if (item && item.select2_defaultValue) {
            // var value = (item.select2_defaultValue.split(","));
            item.select2_defaultValue.map((data) => {
                D_val.push("'" + Replaceinpvalue(data.value) + "'")
            })
        }
        let layout_array = `
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'select',
            'options' => [ ${opt} ],
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            'multiple' => true, 
            'searchable' => true,
            'clearable' => true,
            ${D_val ? `'default' => array(${D_val}),` : ''}
            ${Condition_function(item)}

        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "url") {
        let layout_array = `
       
            'tab'         => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            'type'        => 'link',
            'pasteStyles' => false,
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "media") {
        let layout_array = `
        
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            'type' => 'image',
            ${item.defaultValue ? `
            'default' => [
                        'url'      => '${Replaceinpvalue(item.defaultValue)}',
                        ],
                ` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "iconscontrol") {
        let layout_array = `
        
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'icon',
            'default' => [
              'library' => 'Fontawesome - Regular',
              'icon' => '${Replaceinpvalue(item.defaultValue)}',
            ],
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${Condition_function(item)}
            ${item.selectors ? `'css' => [
              [
                'selector' => '${Replaceinpvalue(item.selectors)}',
              ],
            ],` : ''}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "slider") {
        var size_units = ``;
        var units = ``;

        if (item.size_units != "" && item.size_units != undefined) {
            item.size_units.map((unit) => {
                if (unit.checked == true) {
                    size_units += `"${unit.type}",`;
                    units += `'${unit.type}' => [
						'min' => ${unit?.min || unit?.min == 0 ? unit?.min : '0'},
						'max' => ${unit?.max || unit?.max == 0 ? unit?.max : '1000'},
						'step' => ${unit?.step || unit?.step == 0 ? unit?.step : '1'},
					],`
                }
            })
            if (size_units && units) {
                size_units = `'size_units' => [ ${size_units} ],`
                units = `'units' => [${units}],`
            } else {
                size_units = ``;
                units = ``;
            }

        }
        let layout_array = `
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'slider',
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.selector_value || item.selectors ? `'css' => [
                [
                    'property' => '${Replaceinpvalue(item.selector_value)}',
                    'selector' => '${Replaceinpvalue(item.selectors)}',
                ],
            ],` : ''}
            ${units}
            
            'default' => '${item.slider_defaultValue[1]}${Replaceinpvalue(item.slider_defaultValue[0])}',
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "dimension") {
        let default_val = ``;

        if (item.dimension_defaultValue) {
            if (item.dimension_defaultValue.isLinked == true) {
                default_val = `[
                    'top' => '${item.dimension_defaultValue.top}',
                    'right' => '${item.dimension_defaultValue.top}',
                    'bottom' => '${item.dimension_defaultValue.top}',
                    'left' => '${item.dimension_defaultValue.top}',
                ]`
            } else if (item.dimension_defaultValue.isLinked == false) {
                default_val = `[
                    'top' => '${item.dimension_defaultValue.top}',
                    'right' => '${item.dimension_defaultValue.right}',
                    'bottom' => '${item.dimension_defaultValue.bottom}',
                    'left' => '${item.dimension_defaultValue.left}',
                ]`
            }
        }

        let layout_array = `

            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'dimensions',
            ${item.selector_value || item.selectors ? `'css' => [
                [
                    'property' => '${Replaceinpvalue(item.selector_value)}',
                    'selector' => '${Replaceinpvalue(item.selectors)}',
                ],
            ],` : ''}
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${default_val ? `'default' => ${default_val},` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "background") {
        let layout_array = `
    
        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'background',
        ${item.selector ? `'css' => [
            [
                'property' => 'background',
                'selector' => '${Replaceinpvalue(item.selector)}',
            ],
        ],` : ''}
        'exclude' => [
            'videoUrl',
            'videoScale',
        ],
        'small' => true,
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${Condition_function(item)}`;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "border") {
        let layout_array = `
        
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'border',
            ${item.selector ? `'css' => [
                [
                    'property' => 'border',
                    'selector' => '${Replaceinpvalue(item.selector)}',
                ],
            ],` : ''}
            'small' => true,
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "typography") {
        let layout_array = `
        
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'typography',
            ${item.selector ? `'css' => [
                [
                    'property' => 'typography',
                    'selector' => '${Replaceinpvalue(item.selector)}',
                ],
            ],` : ''}
            'inline' => true,
            ${Condition_function(item)}
            'popup' => true, 
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "textshadow") {
        let layout_array = `
       
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'text-shadow',
            ${item.selector ? `'css' => [
                [
                    'property' => 'text-shadow',
                    'selector' => '${Replaceinpvalue(item.selector)}',
                ],
            ],` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "boxshadow") {
        let layout_array = `
        
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'box-shadow',
            ${item.selector ? `'css' => [
                [
                    'property' => 'box-shadow',
                    'selector' => '${Replaceinpvalue(item.selector)}',
                ],
            ],` : ''}
            'small' => true,
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "cssfilter") {
        let layout_array = `
       
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'filters',
            ${item.selector ? `'css' => [
                [
                    'property' => 'filter',
                    'selector' => '${Replaceinpvalue(item.selector)}',
                ],
            ],` : ''}
            'inline' => true,
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "svg") {
        let layout_array = `
       
        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        'type' => 'svg',
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "datetime") {
        let layout_array = `
       
        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'datepicker',
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${item.defaultValue ? `'default' =>  esc_html__( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''}
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "code") {

        let layout_array = `
       
        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'code',
        'mode' => '${item.language}',
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${item.defaultValue ? `'default' => '${Replaceinpvalue(item.defaultValue)}',` : ''}
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }

    } else if (item.type == "gallery") {

        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'image-gallery',
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        'inline' => false,
         ${item.defaultValue ? `
                'default' => array(
                'images' => [
                    array(
                        'url' => '${Replaceinpvalue(item.defaultValue)}'
                        )
                ]
                ),
                ` : ''}
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "align") {

        const Align = {
            'text-align': 'text-align',
            'justify-content': 'justify-content',
            'align-items': 'align-items',
            'flex-direction': 'direction',
        };

        // Assuming item.alignType is a valid key in Align
        const selectedAlignType = Align[item.alignType.trim()];


        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type'  => '${selectedAlignType}',
        'options' => [
          'textAlign' => esc_html__( 'Text Align', 'bricks' ),
          'justifyContent' => esc_html__( 'Justify Content', 'bricks' ),
          'alignItems' => esc_html__( 'Align Items', 'bricks' ),
        ],
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${Condition_function(item)}
        ${selectedAlignType || item.selectors ? `'css' => [
            [
                'property' => '${item.alignType.trim()}',
                'selector' => '${Replaceinpvalue(item.selectors)}',
            ],
        ],` : ''}
        
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "headingtags") {
        let options = [{ "value": "h1", "lable": "H1" }, { "value": "h2", "lable": "H2" }, { "value": "h3", "lable": "H3" }, { "value": "h4", "lable": "H4" }, { "value": "h5", "lable": "H5" }, { "value": "h6", "lable": "H6" }];
        var opt = ""
        options.map((data) => {
            opt += `'${data.value}'  => esc_html__( '${data.lable}', '${textdomain}' ),`
        })
        let layout_array = `
        
            'tab' => '${tabs}',
            ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'select',
            'options' => [ ${opt} ],
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            'multiple' => false, 
            'searchable' => false,
            'clearable' => false,
            ${item.select_defaultValue[0] ? `'default' => '${Replaceinpvalue(item.select_defaultValue[0])}',` : ''}
            ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "heading") {

        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'info',
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "switcher") {

        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'checkbox',
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${item.defaultValue ? `'default' => ${item.defaultValue},` : ''}
        ${Condition_function(item)}

        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "wysiwyg") {

        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'editor',
        'inlineEditing' => [
            'selector' => '.text-editor',
            'toolbar' => true,
        ],
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${item.defaultValue ? `'default' => esc_html__( '${Replaceinpvalue(item.defaultValue)}', '${textdomain}' ),` : ''} 
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "query") {

        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'query',
        'default' => [
            'post_type' => 'post',
        ],
        ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
        ${Condition_function(item)}

        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "divider") {
        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        'type' => 'separator',
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == 'gradientcolor') {
        let layout_array = `

        'tab' => '${tabs}',
        ${!repeater ? `'group' => '${Replaceinpvalue(section_data?.section)}',` : ''}
        ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
        'type' => 'gradient',
        'css' => [
            [
              'property' => 'background-image',
              'selector' => '${Replaceinpvalue(item.selectors)}',
            ],
          ],
          ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
        'inline' => false,
        ${Condition_function(item)}
        `;

        if (repeater) {
            layout += `'${item.name}' => [
                ${layout_array}
            ],`
        } else {
            layout += `$this->controls['${item.name}'] = [
                ${layout_array}
            ]
            ;\n`
        }
    } else if (item.type == "cpt") {

        let feilds = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {
                if (cpt_con.name != 'post_type_' + item.unique_id) {
                    if (cpt_con.name == 'order_by_' + item.unique_id) {
                        feilds += Bricks_data(cpt_con, tabs, undefined, section_data, '$this->set_options("order_by")');
                    } else {
                        feilds += Bricks_data(cpt_con, tabs, undefined, section_data);
                    }
                }
            })
        }

        let layout_array = `
            'tab' => '${tabs}',
            'group' => '${Replaceinpvalue(section_data?.section)}',
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'type' => 'select',
            'options' => $this->set_options("post_list"),
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            'multiple' => false, 
            'default' => 'post',
            ${Condition_function(item)}
            `;

        layout += `$this->controls['post_type_${item.unique_id}'] = [
                ${layout_array}
            ];
            ${feilds}
            \n`;
    } else if (item.type == "product_listing") {

        let feilds = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {
                if (cpt_con.name != 'post_type_' + item.unique_id) {
                    if (cpt_con.name == 'order_by_' + item.unique_id) {
                        feilds += Bricks_data(cpt_con, tabs, undefined, section_data, '$this->set_options("order_by")');
                    } else {
                        feilds += Bricks_data(cpt_con, tabs, undefined, section_data);
                    }
                }
            })
        }

        layout += feilds;
    } else if (item.type == "taxonomy") {

        let feilds = '';

        if (item?.fields?.length) {
            item?.fields.map((cpt_con) => {
                if (cpt_con.name == 'post_type_' + item.unique_id) {
                    feilds += Bricks_data(cpt_con, tabs, undefined, section_data, '$this->set_options("post_listing")');
                } else {
                    feilds += Bricks_data(cpt_con, tabs, undefined, section_data);
                }
            })
        }

        layout += `$this->controls['${item.name}'] = [
            'tab' => '${tabs}',
            ${item.lable ? `'label' => esc_html__( '${Replaceinpvalue(item.lable)}', '${textdomain}' ),` : ''}
            'group' => '${Replaceinpvalue(section_data?.section)}',
            'type' => 'select',
            'options' => get_taxonomies(),
            ${item?.description ? `'description' => esc_html__( '${Replaceinpvalue(item.description)}', '${textdomain}' ),` : ''}
            ${item.lableBlock != undefined && (!item.lableBlock) ? `'inline' => true,` : ``}
            ${item.placeHolder ? `'placeholder' => esc_html__( '${Replaceinpvalue(item.placeHolder)}', '${textdomain}' ),` : ''}
            'multiple' => false, 
            'searchable' => true,
            'clearable' => true,
            'default' => 'category',
            ${Condition_function(item)}
        ]
        ;\n
        
        ${feilds}`;
    }

    return layout;
}