// export const Temp_component = (item, type, loop, nha) => {
//     var sec_layouttest = "";
//     var php_file = "";
//     var textdomain = "wdesignkit"
//     let deafault_valus_obj = {
//         choose: "align_defaultValue",
//         slider: "slider_defaultValue",
//         select: "select_defaultValue",
//         select2: "select2_defaultValue",
//         hTags: "hTags_defaultValue",
//         dimension: "dimension_defaultValue",
//     };

//     const Condition_value = (switcher, object) => {
//         let condition = "";
//         if (object && object.relation && switcher && switcher == true) {
//             let relation = object.relation == "or" ? "||" : object.relation == "and" ? "&&" : "";

//             object.values.map((conditions) => {
//                 if (conditions.name && conditions.operator) {
//                     if (conditions.value == "true" || conditions.value == "false" || conditions.value == "null") {
//                         condition ? condition += relation : condition += "(";
//                         condition += ` ${conditions.name} ${conditions.operator} ${conditions.value} `;
//                     } else {
//                         condition ? condition += relation : condition += "(";
//                         condition += ` ${conditions.name} ${conditions.operator} "${conditions.value}" `;
//                     }
//                 }
//             })
//             condition ? condition += ") &&" : "";
//         }

//         return condition;
//     }

//     if (item.type == "text") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Text, {
//                 label: __("${item.lable}"),
//                 type: "${item.type}",
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 placeholder:"${item.placeHolder}",
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'string',
//             'default' => \'${item.defaultValue}\'
//         ],\n`

//     } else if (item.type == "url") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Url, {
//                 label: __("${item.lable}"),
//                 type: "${item.type}",
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 placeholder:"${item.placeHolder}",
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => [
//                 'url' => \'${item.defaultValue}\',	// "http://"
//                 'target' => ${item.is_external},	// true/false
//                 'nofollow' => 'nofollow',	// "no-follow"
//             ],

//         ],\n`

//     } else if (item.type == "number") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Text, {
//                 label: __("${item.lable}"),
//                 type: "${item.type}",
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 placeholder:"${item.placeHolder}",
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//         'type' => 'string',
//         'default' => \'${item.defaultValue}\'
//     ],\n`
//     } else if (item.type == "select") {
//         let options = "";
//         if (item.options.length > 0) {
//             options += "[";
//             item.options.map((opt) => {
//                 options += `['${opt.value}',__('${opt.lable}')],`
//             })
//             options += "]";
//         }
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Select, {
//                 label: __("${item.lable}"),
//                 options:${options},
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//         'type' => 'string',
//         'default' => '${item.select_defaultValue[0]}'
//     ],\n`
//     } else if (item.type == "textarea") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_TextArea, {
//                 label: __("${item.lable}"),
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 rows:"${item.rows}",
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//         'type' => 'string',
//         'default' => \'${item.defaultValue}\',
//     ],\n`
//     } else if (item.type == "dimension") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Dimension, {
//             label: __("${item.lable}"),
//             value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//             noLock: ${item.dimension_defaultValue.isLinked},
//             unit: ['${item.dimension_units}'],
//             separator:"${item.separator}",
//             inlineblock:${!item.lableBlock},
//             ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             responsive: true,
//             device: this.state.device,
//             onDeviceChange: (value) => this.setState({ device: value }),
//         }),\n`
//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => (object) [
//                 'md' => [
//                     "top" => ${item.dimension_defaultValue.top},
//                     "right" => ${item.dimension_defaultValue.right},
//                     "bottom" => ${item.dimension_defaultValue.bottom},
//                     "left" => ${item.dimension_defaultValue.left},
//                 ],
//                 "unit" => "${item.dimension_defaultValue.unit}",
//             ],
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selectors}{ ${item.selector_value}: {{${item.name}${nha ? nha : ""}}}}',
//                 ],
//             ],
//         ],\n`
//     } else if (item.type == "color") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Color, {
//                     label: __("${item.lable}"),
//                     value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                     separator:"${item.separator}",
//                     inlineblock:${!item.lableBlock},
//                     ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//                 }),\n`
//         php_file += `'${item.name}${nha ? nha : ""}' => [
//                 'type' => 'string',
//                 'default' => '${item.defaultValue}',
//                 'style' => [
//                     (object) [
//                  'selector' => '{{PLUS_WRAP}} ${item.selectors}{${item.selector_value}:{{${item.name}${nha ? nha : ""}}};}',
//              ],
//          ],
//             ],\n`
//     } else if (item.type == "gradientcolor") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Gradient, {
//                     label: __("${item.lable}"),
//                     value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                     separator:"${item.separator}",
//                     inlineblock:${!item.lableBlock},
//                     ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//                 }),\n`
//         php_file += `'${item.name}${nha ? nha : ""}' => [
//                 'type' => 'string',
//                 'default' => '${item.defaultValue}',
//                 'style' => [
//                            (object) [
//                         'selector' => '{{PLUS_WRAP}} ${item.selectors}{${item.selector_value}:{{${item.name}${nha ? nha : ""}}};} !important',
//                     ],
//                 ],
//             ],\n`
//     } else if (item.type == "switcher") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Toggle, {
//                 label: __('${item.lable}') , 
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")}, 
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }      
//                 }),\n`
//         php_file += `'${item.name}${nha ? nha : ""}' => [
//                 'type' => 'boolean',
//                 'default' => ${item.defaultValue == true ? true : false},
//             ],\n`
//     } else if (item.type == "heading") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Label_Heading, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 separator:"${item.separator}",
//                 inlineblock:${true},
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'string',
//         ],\n`
//     } else if (item.type == "border") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Border, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//                 responsive: true,
//                 device: this.state.device,
//                 onDeviceChange: (value) => this.setState({ device: value }),
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => (object) [
//                 'openBorder' => 0,	// 0 Or 1
//                 'type' => '',	// 'solid' OR 'dotted' OR 'dashed' OR 'double'
//                     'color' => '',	// "#000"
//                         'width' => (object) [
//                             'md' => (object)[
//                                 'top' => '',
//                                 'left' => '',
//                                 'bottom' => '',
//                                 'right' => '',
//                             ],
//                     'sm' => (object)[ ],
//                     'xs' => (object)[ ],
//                     "unit" => "",
//                 ],
//             ],
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selector}',
//                 ],
//             ],

//         ],\n`
//     } else if (item.type == "boxshadow") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_BoxShadow, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => (object) [
//                 'openShadow' => 0,
//                 'inset' => 0,
//                 'horizontal' => 0,
//                 'vertical' => 4,
//                 'blur' => 8,
//                 'spread' => 0,
//                 'color' => "rgba(0,0,0,0.40)",
//             ],
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selector}',
//                 ],
//             ],
//         ],\n`
//     } else if (item.type == "textshadow") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_BoxShadow, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 istextShadow: true,
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => (object) [
//                 'openShadow' => 0,
//                 'typeShadow' => 'text-shadow', //"text-shadow" Or "drop-shadow"
//                 'horizontal' => 2,
//                 'vertical' => 3,
//                 'blur' => 2,
//                 'color' => "rgba(0,0,0,0.5)",
//             ],
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selector}',
//                 ],
//             ],
//         ],\n`
//     } else if (item.type == "background") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Background, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                  sources: [${item.types}],
//                  parallax: true,
//                  position: true,
//                  size: true,
//                  repeat: true,
//                  attachment: true,
//                 separator:'${item.separator}',
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => (object) [
//                 'openBg'=> 0,
//                 'bgType' => 'color',
//                 'videoSource' => 'local',
//                 'bgDefaultColor' => '',
//                 'bgGradient' => (object) [ 'color1' => '#16d03e', 'color2' => '#1f91f3', 'type' => 'linear', 'direction' => '90', 'start' => 5, 'stop' => 80, 'radial' => 'center', 'clip' => false ],
//             ],
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selector}',
//                 ],
//             ],
//         ],\n`
//     } else if (item.type == "typography") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Typography, {
//             label: __("${item.lable}"),
//             value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//             ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             separator:'${item.separator}',
//             device: this.state.device,
// 	        onDeviceChange: ( value ) => this.setState( { device: value }),
//         }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//         'type' => 'object',
//         'default'=> (object) [
//             'openTypography' => 0,
//             'size' => [ 'md' => 20, 'unit' => 'px' ],
//             'height' => [ 'md' => 22,'unit' => 'px' ], 
//             'spacing' => [ 'md' => 0.1, 'unit' => 'px' ],
//             'fontFamily' => [
//                 'family' => '',
//                 'fontWeight' => 400,
//             ],
//             'fontStyle' => 'Default',
//             'textTransform' => 'None',
//             'textDecoration' => 'Default',
//         ],
//         'style' => [
//             (object) [
//                 'selector' => '{{PLUS_WRAP}} ${item.selector}',
//             ],
//         ],
//     ],\n`
//     } else if (item.type == "cssfilter") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_CssFilter, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//                 separator:'${item.separator}',
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => [
//                 'openFilter' => false,
//                 'blur' => 0,
//                 'brightness' => 100,
//                 'contrast' => 100,
//                 'saturate' => 100,
//                 'hue' => 0,
//             ],
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selector}',
//                 ],
//             ],
//         ],\n`
//     } else if (item.type == "media") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Media, {
//                 label: __("${item.lable}"),
//                 multiple: false,
//                 separator: '${item.separator}',
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 panel: true,
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`
//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default' => [
//                 'url' => '${item.defaultValue}',
//                 'Id' => '',
//             ],
//         ],\n`
//     } else if (item.type == "iconscontrol") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_IconList, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 separator: '${item.separator}',
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'object',
//             'default'=> '${item.defaultValue}',
//         ],\n`
//     } else if (item.type == "slider") {
//         let range_units = "";
//         if (item.size_units.length > 0) {
//             item.size_units.filter((units) => {
//                 if (units.checked = true) {
//                     return units;
//                 }
//             }).map((units) => {
//                 range_units += `'${units.type}',`
//             })
//         }
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Range, {
//                 label: __("${item.lable}"),
//                 separator: '${item.separator}',
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 min: ${loop ? "value." : ""}${item.name}${nha ? nha : ""} && ${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit ? ${item.name}${nha ? nha : ""}Function(${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit, 'min') : 0,
//                 max:  ${loop ? "value." : ""}${item.name}${nha ? nha : ""} && ${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit ? ${item.name}${nha ? nha : ""}Function(${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit, 'max') : 100,
//                 step: ${loop ? "value." : ""}${item.name}${nha ? nha : ""} && ${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit ? ${item.name}${nha ? nha : ""}Function(${loop ? "value." : ""}${item.name}${nha ? nha : ""}.unit, 'step') : 1,
//                 unit: [${range_units}],
//                 responsive: true,
//                 device: "device",
//                 responsive: true,
//                 device: this.state.device,
//                 onDeviceChange: (value) => this.setState({ device: value }),
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'string',
//             // 'default' => 15,
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selectors}{${item.selector_value}:{{${item.name}${nha ? nha : ""}}};}',
//                 ],
//             ],
//         ],\n`
//     } else if (item.type == "choose") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         let array = ['eicon-text-align-left', 'eicon-text-align-right', 'eicon-text-align-center', 'eicon-text-align-justify', 'eicon-arrow-up', 'eicon-arrow-down', 'eicon-arrow-right', 'eicon-arrow-left', 'align_title', 'align_svg'];

//         var options = "";
//         if (item.align_option.length > 0) {
//             var options = "";
//             options += `[`
//             item.align_option.map((data) => {
//                 var icon = '';
//                 if (data.align_icon == 'align_svg' || data.align_icon == 'align_title') {
//                     icon = '';
//                 } else {
//                     icon = data.align_icon;
//                 }

//                 options += `{ label: __('${data.align_lable}'), value: '${data.align_value}', title: __('${data.align_title ? data.align_title : ""}'), icon: '${icon}', svg: '${data.align_svg ? data.align_svg : ""}' },\n`
//             })
//             options += `]`
//         }
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_RadioAdvanced, {
//                 label: __("${item.lable}"),
//                 separator: '${item.separator}',
//                 options : ${options},
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 inlineblock:${!item.lableBlock},
//                 responsive: true,
//                 device: this.state.device,
//                 onDeviceChange: (value) => this.setState({ device: value }),
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'string',
//             'default' => 'center',
//             'style' => [
//                 (object) [
//                     'selector' => '{{PLUS_WRAP}} ${item.selectors}{ ${item.selector_value}: {{${item.name}${nha ? nha : ""}}}; }',
//                 ],
//             ],
//         ],\n`
//     } else if (item.type == "popover") {
//         let condition = Condition_value(item.conditions, item.condition_value);
//         let fields_data = "";
//         let fields_php = "";
//         item.fields.map((controller) => {
//             fields_data += Temp_component(controller, "js", item.name);
//         })
//         item.fields.map((controller) => {
//             fields_php += Temp_component(controller, "php");
//         })
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_GroupPopover, {
//             Label: __('${item.lable}'),
//             value: ${item.name + (nha ? nha : "")},
//             onChange: value => setAttributes({ ${item.name}${nha ? nha : ""}: value }),
//             },
//             (value, onChange) => {
//                 return[
//                     React.createElement(Fragment, null,
//                         ${fields_data}
//                     )]
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//                 'type' => 'object',
//                 'groupField' => [
//                     (object) [
//                         ${fields_php}
//                     ]
//                 ],
//                 'default' => [],
//             ],\n`
//     } else if (item.type == "normalhover") {
//         let condition = Condition_value(item.conditions, item.condition_value);
//         let fields_js_normal = "";
//         let fields_php_normal = "";
//         let fields_js_hover = "";
//         let fields_php_hover = "";
//         let fields_js_active = "";
//         let fields_php_active = "";

//         item.fields.map((controller) => {
//             if (controller.key == 'normal') {
//                 fields_js_normal += Temp_component(controller, "js", "", '_normal');
//                 fields_php_normal += Temp_component(controller, "php", "", '_normal');
//             } else if (controller.key == 'hover') {
//                 fields_js_hover += Temp_component(controller, "js", "", '_hover');
//                 fields_php_hover += Temp_component(controller, "php", "", '_hover');
//             } else if (controller.key == 'active') {
//                 fields_js_active += Temp_component(controller, "js", "", '_active');
//                 fields_php_active += Temp_component(controller, "php", "", '_active');
//             }
//         })

//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Tabs, null,
//                 React.createElement(Pmgc_Tab, {
//                     tabTitle: __('Normal')},
//                     ${fields_js_normal}
//                 ),
//                 React.createElement(Pmgc_Tab, {
//                     tabTitle: __('Hover')},
//                     ${fields_js_hover}
//                 ),
//                 React.createElement(Pmgc_Tab, {
//                     tabTitle: __('Active')},
//                     ${fields_js_active}
//                 ),
//             ),\n`

//         php_file += `${fields_php_normal}
//                     ${fields_php_hover}
//                     ${fields_php_active}\n`
//     } else if (item.type == "repeater") {
//         let condition = Condition_value(item.conditions, item.condition_value);
//         let fields_data = "";
//         let fields_php = "";
//         let default_val = "";

//         item.fields.map((controller) => {
//             fields_data += Temp_component(controller, "js", item.name);
//         })
//         item.fields.map((controller) => {
//             fields_php += Temp_component(controller, "php");
//         })

//         if (item.fields.length > 0) {
//             default_val += `[\n '_key' => '0',\n`;
//             item.fields.map((data) => {
//                 if (data.defaultValue != undefined && data.name != undefined) {
//                     default_val += `'${data.name}' => '${data.defaultValue}',\n`
//                 } else if (data[deafault_valus_obj[data.type]] != undefined && data.name != undefined) {
//                     default_val += `'${data.name}' => '${data[deafault_valus_obj[data.type]]}',\n`
//                 }
//             })
//             default_val += '],';
//         }

//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Repeater, {
//             max: 10,
//             labelText:__('${item.lable}'),
//             value: ${item.name + (nha ? nha : "")},
//             attributeName: '${item.name + (nha ? nha : "")}',
//             addText: 'Add Accordion',
//             titleField: '{title}',
//             onChange: value => setAttributes({ ${item.name}${nha ? nha : ""}: value }),
//             },
//             (value, onChange) => {
//                 return[
//                     React.createElement(Fragment, null,
//                         ${fields_data}
//                     )]
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//                 'type' => 'array',
//                 'repeaterField' => [
//                     (object) [
//                         ${fields_php}
//                     ]
//                 ],
//                 'default' => [${default_val}],
//             ],\n`
//     } else if (item.type == "rawhtml") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Note, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 description: '${item.defaultValue}',
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`
//     } else if (item.type == "headingtags") {
//         let condition = Condition_value(item.conditions, item.condition_value)
//         sec_layouttest +=
//             `${condition} React.createElement(Pmgc_Heading, {
//                 label: __("${item.lable}"),
//                 value: ${loop ? "value." + item.name : item.name + (nha ? nha : "")},
//                 separator:"${item.separator}",
//                 inlineblock:${!item.lableBlock},
//                 ${loop ?
//                 `onChange: v => { value.${item.name} = v; onChange(value); },`
//                 :
//                 `onChange: (value) => setAttributes({ ${item.name}${nha ? nha : ""}: value }),`
//             }
//             }),\n`

//         php_file += `'${item.name}${nha ? nha : ""}' => [
//             'type' => 'string',
//             'default' => '${item.defaultValue}'
//         ],\n`
//     } else if (item.type == "styleimage") {
//         let options = "";
//         if (item.options.length > 0) {
//             options += `[`;
//             item.options.map((opt) => {
//                 options += `{'value':'${opt.value}','lable':__('${opt.lable}'),'svg':__('${opt.svg}'),},`;
//             });
//             options += `]`;
//         }

//         let condition = Condition_value(item.conditions, item.condition_value);
//         sec_layouttest += `${condition} React.createElement(Pmgc_Styles, {
//                 label: __('${item.lable}'),
//                 columns: '${item.columns}',
//                 separator: '${item.separator}',
//                 value: ${item.name},
//                 options: ${options},
//                 onChange: ( value ) => setAttributes( { ${item.name}: value } ),
//             }),\n`;
//         php_file += `'${item.name}' => [
//                 'type' => 'string',
//                 'default' => \`${item.select_defaultValue[0]}\`,
//             ],\n`;
//     }

//     if (type == "php") {
//         return php_file;
//     } else if (type == "js") {
//         return sec_layouttest;
//     }
// }
export const Temp_component = (item, type, loop, nha) => { }

/** get unique string of 8 charatcter */
const keyUniqueID = () => {
    let date = new Date();
    let year = date.getFullYear().toString().slice(-2);
    let number = Math.random();
    number.toString(36);
    let uid = number.toString(36).substr(2, 6);
    return uid + year;
}

export const Elementer_data = (item, repeater) => {
    /** condition function for controller  */
    const Condition_function = (data) => {
        var condition = ""
        if (data.conditions == true) {
            data.condition_value.values.map((cd_data) => {
                if (cd_data.name == "" || cd_data.operator == "") {
                } else {
                    cd += `['name' => '${cd_data.name}', 'operator' => '${cd_data.operator}', 'value' => '${cd_data.value}'],\n`
                }
            })
            if (cd == "") {
                condition = "";
            } else {
                condition += `'conditions' => [
                    'relation' => '${data.condition_value.relation}',
                    'terms' => [${cd}],
                ],`
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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'title' => '${item.title}',
            'type' => \\Elementor\\Controls_Manager::TEXT,
            'default' => esc_html__( '${item.defaultValue}', '${textdomain}' ),
            'placeholder' => esc_html__( '${item.placeHolder}', '${textdomain}' ),
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'input_type' => '${item.input_type}',
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            ${Condition_function(item)}
        ]`;

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
        let name = ``;

        if (repeater == "" && repeater != undefined) {
            name = `'name' => '${item.name}',`
        }

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::NUMBER,
            'min' => ${item?.number_setting?.min ? item?.number_setting?.min : '""'},
            'max' => ${item?.number_setting?.max ? item?.number_setting?.max : '""'},
            'step' => ${item?.number_setting?.step ? item?.number_setting?.step : '""'},
            'default' => ${item.defaultValue ? item.defaultValue : 0},
            'title' => '${item.title}',
            'placeholder' => esc_html__( '${item.placeHolder}', '${textdomain}' ),
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            ${Condition_function(item)}
        ]`

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

        const RepeaterArray = [
            { 'type': 'choose', 'value': 'align_defaultValue' },
            { 'type': 'select', 'value': 'select_defaultValue[0]' },
            { 'type': 'select2', 'value': 'select2_defaultValue' },
            { 'type': 'dimension', 'value': 'dimension_defaultValue' },
            { 'type': 'slider', 'value': 'slider_defaultValue' },
            { 'type': 'selecttemplate', 'value': 's_template_defaultValue' }
        ]

        const RepeaterDefault = (controller) => {
            if (controller.type == 'select') {
                return controller.select_defaultValue[0];
            } else if (controller.type == 'choose') {
                return controller.align_defaultValue;
            } else if (controller.type == 'select2') {
                return controller.select2_defaultValue[0].value;
            } else if (controller.type == 'dimension') {
                return '';
            } else if (controller.type == 'slider') {
                return '';
            } else if (controller.type == 'selecttemplate') {
                return controller.s_template_defaultValue;
            } else {
                return controller.defaultValue;
            }
        }

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
                    repeater_default_value += `'_id'=>uniqid('Wkit-${keyUniqueID()}'),\n`;
                    item.fields.map((controller) => {

                        // var DefaultIndex = RepeaterArray.findIndex((data) => data.type == controller.type)
                        // if (DefaultIndex > -1) {
                        //     var RepeaterDefault = RepeaterArray[DefaultIndex].value
                        // } else {
                        //     var RepeaterDefault = 'defaultValue';
                        // }
                        repeater_default_value += `'${controller.name}' => esc_html__( '${RepeaterDefault(controller)}', '${textdomain}' ),\n`;
                    })
                    repeater_default_value += `],\n`;
                }
            }
            repeater_default_value += `]`;
        }

        if (item.fields.length > 0) {
            if (item.repeater_type == "Old") {
                fields += `$${repeater_name}->get_controls(),`
            } else if (item.repeater_type == "New") {
                fields += `[`
                item.fields.map((data) => {
                    if (!group_controles.includes(data.type)) {
                        fields += `${Elementer_data(data, "")},`
                    }
                })
                fields += `],`
            }
        }

        let layout_array = `[
                ${name}
				'type' => \\Elementor\\Controls_Manager::REPEATER,
				'label' => esc_html__( '${item.lable}', '${textdomain}' ),
                'description' => esc_html__( '${item.description}', '${textdomain}' ),
                'show_label' => ${item.showLable},
                'label_block' => ${item.lableBlock},
                'separator' => '${item.separator}',
                'title_field' => '${item.title_field}',
				'fields' => ${fields ? fields : "[],"}
                'default' => ${repeater_default_value},
                'classes' => '${item.controlClass}',
                'prevent_empty' => ${item.prevent_empty},
                ${Condition_function(item)}
        ]`;

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::POPOVER_TOGGLE,
            // 'label_off' => esc_html__( 'Default', '${textdomain}' ),
            // 'label_on' => esc_html__( 'Custom', '${textdomain}' ),
            'return_value' => '${item.return_value}',
            'default' => 'yes',
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            ${Condition_function(item)}
        ]`;

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
                item.nha_array.length > 0 && item.nha_array.map((type) => {
                    let type_label = type.charAt(0).toUpperCase() + type.slice(1);
                    controllers += `$${repeater}->start_controls_tab(\n
                        '${item.name}_${type}_tab',
                        [
                            'label' => esc_html__( '${type_label}', '${textdomain}' ),
                        ]
                    );\n`
                    item.fields.filter((controller) => {
                        if (controller.key == type) {
                            return controller
                        }
                    }).map((controller) => {
                        controllers += Elementer_data(controller, repeater);
                    })
                    controllers += `$${repeater}->end_controls_tab();\n`
                })
            } else {
                item?.nha_array?.length > 0 && item.nha_array.map((type) => {
                    let type_label = type.charAt(0).toUpperCase() + type.slice(1);
                    controllers += `$this->start_controls_tab(\n
                        '${item.name}_${type}_tab',
                        [
                            'label' => esc_html__( '${type_label}', '${textdomain}' ),
                        ]
                    );\n`
                    item.fields.filter((controller) => {
                        if (controller.key == type) {
                            return controller
                        }
                    }).map((controller) => {
                        controllers += Elementer_data(controller);
                    })
                    controllers += `$this->end_controls_tab();\n`
                })
            }
        }

        let layout_array = `[
            ${name}
            ${Condition_function(item)}
        ]`;

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

        let layout_array = `[
                ${name}
                'label' => esc_html__( '${item.lable}', '${textdomain}' ),
				'type' => \\Elementor\\Controls_Manager::WYSIWYG,
				'default' => esc_html__( '${item.defaultValue}', '${textdomain}' ),
				'placeholder' => esc_html__( '${item.placeHolder}', '${textdomain}' ),
                'description' => esc_html__( '${item.description}', '${textdomain}' ),
                'show_label' => ${item.showLable},
                'label_block' => ${item.lableBlock},
                'separator' => '${item.separator}',
                'classes' => '${item.controlClass}',
                'dynamic' => [
                    'active' => ${item.dynamic},
                ],
                ${Condition_function(item)}
        ]`;

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

        let layout_array = `[
            ${name}
            'type' => \\Elementor\\Controls_Manager::CODE,
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'language' => '${item.language}',
            'rows'=> '${item.rows}' ,
            'default' => '${item.defaultValue}',
            'classes' => '${item.controlClass}',
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            ${Condition_function(item)}
        ]`;

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
            selector_data += `'selectors' => [`
            selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{VALUE}}',`
            selector_data += `],`
        }

        if (item.align_option) {
            var align_option = ``;
            align_option += `'options' => [`;
            item.align_option.map((align) => {
                align_option += `
                    '${align.align_value}' => [
                        'title' => esc_html__( '${align.align_lable}', '${textdomain}' ),
                        'icon' => '${align.align_icon}',
                    ],
                    
                    
                `;
            })
            align_option += `],`;
        }

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::CHOOSE,
            ${align_option}
            'default' => '${item.align_defaultValue}',
            'toggle' => true,
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
            ${selector_data}
        ]`;

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::DATE_TIME,
            'default' => esc_html__( '${item.defaultValue}', '${textdomain}' ),
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
        ]`

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
        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::GALLERY,
            'default' => [],
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
        ]`;

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
        \\Elementor\\Group_Control_Background::get_type(),
        [
            'name' => '${item.name}',
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'types' => [${item.types}],
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
            ${selector_data}
        ]`;

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
        \\Elementor\\Group_Control_Border::get_type(),
        [
            'name' => '${item.name}',
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
            ${selector_data}
        ]`;
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
            selector_data += `'selectors' => [`
            selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',`
            selector_data += `],`
        }

        if (item.dimension_units) {
            item.dimension_units.map((unit) => {
                size_units += `'${unit}',`
            })
        }

        if (item.dimension_defaultValue) {
            if (item.dimension_defaultValue.isLinked == true) {
                default_val = `[
                    'top' => '${item.dimension_defaultValue.top}',
                    'right' => '${item.dimension_defaultValue.top}',
                    'bottom' => '${item.dimension_defaultValue.top}',
                    'left' => '${item.dimension_defaultValue.top}',
                    'unit' => '${item.dimension_defaultValue.unit}',
                    'isLinked' => '${item.dimension_defaultValue.isLinked}',
                ]`
            } else if (item.dimension_defaultValue.isLinked == false) {
                default_val = `[
                    'top' => '${item.dimension_defaultValue.top}',
                    'right' => '${item.dimension_defaultValue.right}',
                    'bottom' => '${item.dimension_defaultValue.bottom}',
                    'left' => '${item.dimension_defaultValue.left}',
                    'unit' => '${item.dimension_defaultValue.unit}',
                    'isLinked' => '${item.dimension_defaultValue.isLinked}',
                ]`
            }
        }

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => Controls_Manager::DIMENSIONS,
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'size_units' => [${size_units}],
            'default' => ${default_val},
            'classes' => '${item.controlClass}',
            'separator' => '${item.separator}',
            ${Condition_function(item)}
            ${selector_data}
        ]`;

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
        \\Elementor\\Group_Control_Box_Shadow::get_type(),
        [
            'name' => '${item.name}',
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
            ${selector_data} 
        ]`

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
        \\Elementor\\Group_Control_Text_Shadow::get_type(),
			[
				'name' => '${item.name}',
				'label' => esc_html__( '${item.lable}', '${textdomain}' ),
                'classes' => '${item.controlClass}',
                'separator' => '${item.separator}',
                ${Condition_function(item)}
				${selector_data}
			]`

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
            selector_data += `'selectors' => [`
            selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{VALUE}}',`
            selector_data += `],`
        }

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::COLOR,
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},                
            'separator' => '${item.separator}',
            'default' => '${item.defaultValue}',
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'classes' => '${item.controlClass}',
            'alpha' => ${item.alpha},
            'global' => [
                'active' => ${item.global},
            ],
            ${Condition_function(item)}
            ${selector_data}
        ]`;

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
			[
				'name' => '${item.name}',
                'classes' => '${item.controlClass}',
                ${Condition_function(item)}
				${selector_data}
			]`
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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::HIDDEN,
            'default' => '${item.defaultValue}',
        ]`;

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::MEDIA,
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'default' => [
                'url' => ${item.defaultValue ? `'${item.defaultValue}'` : '\\Elementor\\Utils::get_placeholder_image_src()'},
            ],
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'media_types' => [${item.media_types}],
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
        ]`;

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
            \\Elementor\\Group_Control_Typography::get_type(),
			[
				'name' => '${item.name}',
                'classes' => '${item.controlClass}',
                'separator' => '${item.separator}',
                ${Condition_function(item)}
                ${selector_data}
			]`

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::HEADING,
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
        ]`;

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

        let layout_array = `[
            ${name}
            'type' => \\Elementor\\Controls_Manager::DIVIDER,
        ]`;

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::RAW_HTML,
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'raw' => esc_html__( '${item.defaultValue}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            ${Condition_function(item)}
        ]`;

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', 'elementor' ),
            'type' => \\Elementor\\Controls_Manager::ICONS,
            'fa4compatibility' => 'icon',
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'skin' => '${item.skin}',
            'exclude_inline_options' => ['${item.exclude_inline_options}'],
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            'default' => [
                'value' => '${item.defaultValue}',
                'library' => 'fa-solid',
            ],
            ${Condition_function(item)}
        ]`;

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
                    range += `'${unit.type}' => [
						'min' => ${unit?.min || unit?.min == 0 ? unit?.min : '0'},
						'max' => ${unit?.max || unit?.max == 0 ? unit?.max : '1000'},
						'step' => ${unit?.step || unit?.step == 0? unit?.step : '1'},
					],`
                }
            })
            if (size_units && range) {
                size_units = `'size_units' => [ ${size_units} ],`
                range = `'range' => [${range}],`
            } else {
                size_units = ``;
                range = ``;
            }

        }
        if (item.slider_defaultValue != "" && item.slider_defaultValue != undefined) {
            if (size_units) {
                default_value += `[
                                    'unit' => '${item.slider_defaultValue[0]}',
                                    'size' => ${item.slider_defaultValue[1] ? item.slider_defaultValue[1] : "''"},
                                ]`
            } else {
                default_value += `[
                                    'size' => ${item.slider_defaultValue[1] ? item.slider_defaultValue[1] : "''"},
                                ]`

            }
        }
        if (item.selectors != "") {
            selector_data += `'selectors' => [`
            if (item && item.show_unit == true && size_units) {
                selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{SIZE}}{{UNIT}};',]`
            } else {
                selector_data += `'{{WRAPPER}} ${item.selectors}' => '${item.selector_value}: {{SIZE}};',]`
            }

        }

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::SLIDER,
            ${size_units}
            'classes' => '${item.controlClass}',
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            ${range}
            'default' => ${default_value},
            'show_label' => ${item.showLable},
            'separator' => '${item.separator}',
            'render_type' => 'ui',
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            ${Condition_function(item)}
            ${selector_data}
        ]`;

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::SELECT,
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'default' => '${item.select_defaultValue[0]}',
            ${Condition_function(item)}
            'options' => [ ${opt} ],
        ]`;

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

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::SELECT,
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'classes' => '${item.controlClass}',
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'default' => '0',
            ${Condition_function(item)}
            'options' => Wdkit_Wb_Elementor_Controller::wdkit_get_templates(),
        ]`;

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
            opt += `'${data.value}'  => esc_html__( '${data.lable}', '${textdomain}' ),`
        })

        if (item && item.select2_defaultValue) {
            // var value = (item.select2_defaultValue.split(","));
            item.select2_defaultValue.map((data) => {
                D_val.push("'" + data.value + "'")
            })
        }

        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::SELECT2,
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'default' => [${D_val}],
            'multiple' => ${item.multiple},
            'classes' => '${item.controlClass}',
            'options' => [ ${opt} ],
            ${Condition_function(item)}
        ]`;


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
        let layout_array = `[
            ${name}
            'type' => \\Elementor\\Controls_Manager::TEXTAREA,
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            'rows' => '${item.rows}',
            'placeholder' => esc_html__( '${item.placeHolder}', '${textdomain}' ),
            'default' => esc_html__( '${item.defaultValue}', '${textdomain}' ),
            'classes' => '${item.controlClass}',
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            ${Condition_function(item)}
        ]`;

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
        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::SWITCHER,
            'label_on' => esc_html__( '${item.label_on}', '${textdomain}' ),
            'label_off' => esc_html__( '${item.label_off}', '${textdomain}' ),
            'description' => esc_html__( '${item.description}', '${textdomain}' ), 
            'return_value' => '${item.return_value}',
            'default' => '${item.defaultValue == true ? item.return_value : ``}',
            'show_label' => ${item.showLable},
            'classes' => '${item.controlClass}',
            'label_block' => ${item.lableBlock},
            'separator' => '${item.separator}',
            ${Condition_function(item)}
        ]`;

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
            options_array += `[`
            item.url_options_array.map((options) => {
                options_array += `'${options}',`
            })
            options_array += `]`
        } else {
            options_array = false;
        }
        let layout_array = `[
            ${name}
            'label' => esc_html__( '${item.lable}', '${textdomain}' ),
            'type' => \\Elementor\\Controls_Manager::URL,
            'description' => esc_html__( '${item.description}', '${textdomain}' ),
            'placeholder' => esc_html__( '${item.placeHolder}', '${textdomain}' ),
            'options' => ${options_array},
            'default' => [
                'url' => '${item.defaultValue}',
                'is_external' => ${item.is_external},
                'nofollow' => ${item.nofollow},
                'custom_attributes' => '${item.custom_attributes}',
            ],
            'show_label' => ${item.showLable},
            'label_block' => ${item.lableBlock},
            'classes' => '${item.controlClass}',
            'separator' => '${item.separator}',
            'dynamic' => [
                'active' => ${item.dynamic},
            ],
            ${Condition_function(item)}
        ]`;

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
    }
    
    return layout;
}