export const component_array = {

    "text": {
        "type": "text",
        "lable": "Text",
        "name": "text",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "title": "",
        "input_type": "text",
        "dynamic": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
        "class": "",
    },

    "number": {
        "type": "number",
        "lable": "Number",
        "name": "number",
        "description": "",
        "placeHolder": "",
        "defaultValue": 0,
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "title": "",
        "dynamic": false,
        "number_setting": { "min": 0, "max": 100, "step": 1 },
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "wysiwyg": {
        "type": "wysiwyg",
        "lable": "Wysiwyg",
        "name": "wysiwyg",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": true,
        "controlClass": "",
        "separator": "default",
        "responsive": false,
        "dynamic": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "code": {
        "type": "code",
        "lable": "Code",
        "name": "code",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "responsive": false,
        "controlClass": "",
        "conditions": false,
        "rows": "5",
        "dynamic": false,
        "language": "html",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "hidden": {
        "type": "hidden",
        "lable": "Hidden",
        "name": "hidden",
        "defaultValue": "",
    },

    "choose": {
        "type": "choose",
        "lable": "Choose",
        "name": "choose",
        "description": "",
        "align_defaultValue": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "align_option": [{ "align_lable": "label", "align_value": "value", "align_icon": "eicon-text-align-left", "align_title": "", "align_svg": "" },],
        "toggle": false,
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "selectors": "",
        "selector_value": "",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },

        //gutrnberg
        "alignmentType": "content",
    },

    "datetime": {
        "type": "datetime",
        "lable": "DateTime",
        "name": "datetime",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "gallery": {
        "type": "gallery",
        "lable": "Gallery",
        "name": "gallery",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "media": {
        "type": "media",
        "lable": "Media",
        "name": "media",
        "description": "",
        "defaultValue": "",
        "media_types": [],
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "dynamic": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "iconscontrol": {
        "type": "iconscontrol",
        "lable": "Iconscontrol",
        "name": "iconscontrol",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "skin": "media",
        "exclude_inline_options": ['none'],
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "background": {
        "type": "background",
        "lable": "Background",
        "name": "background",
        "selector": "",
        "separator": "default",
        "types": [`"classic"`, `"gradient"`],
        "fields_options": [],
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "border": {
        "type": "border",
        "lable": "Border",
        "name": "border",
        "selector": "",
        "controlClass": "",
        "separator": "default",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "boxshadow": {
        "type": "boxshadow",
        "lable": "Boxshadow",
        "name": "boxshadow",
        "selector": "",
        "separator": "default",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "textshadow": {
        "type": "textshadow",
        "lable": "Textshadow",
        "name": "textshadow",
        "separator": "default",
        "selector": "",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "color": {
        "type": "color",
        "lable": "Color",
        "name": "color",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "alpha": true,
        "global": true,
        "selectors": "",
        "selector_value": "",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "cssfilter": {
        "type": "cssfilter",
        "lable": "Cssfilter",
        "name": "cssfilter",
        "selector": "",
        "separator": "default",
        "conditions": false,
        "controlClass": "",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "dimension": {
        "type": "dimension",
        "lable": "Dimension",
        "name": "dimension",
        "description": "",
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "dimension_units": ['px'],
        "dimension_defaultValue": { 'top': 0, 'right': 0, 'bottom': 0, 'left': 0, 'unit': 'px', 'isLinked': true },
        "selectors": "",
        "responsive": false,
        "selector_value": "",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },

    },

    "typography": {
        "type": "typography",
        "lable": "Typography",
        "name": "typography",
        "separator": "default",
        "conditions": false,
        "selector": "",
        "controlClass": "",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
        //gutrnberg

    },

    "repeater": {
        "type": "repeater",
        "lable": "Repeater",
        "name": "repeater",
        "description": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "fields": [],
        "title_field": "Repeater_title",
        "prevent_empty": true,
        "defaultCount": 1,
        "repeater_type": "Old",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "heading": {
        "type": "heading",
        "lable": "Heading",
        "name": "heading",
        "separator": "default",
        "conditions": false,
        "controlClass": "",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "divider": {
        "type": "divider",
        "lable": "Divider",
        "name": "divider",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "rawhtml": {
        "type": "rawhtml",
        "lable": "Rawhtml",
        "name": "rawhtml",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "slider": {
        "type": "slider",
        "lable": "Slider",
        "name": "slider",
        "description": "",
        "placeHolder": "",
        "slider_defaultValue": ["px", 10],
        "separator": "default",
        "controlClass": "",
        "size_units": [
            { "type": "px", "checked": true, "min": 0, "max": 10, "step": 1 },
            { "type": "%", "checked": false, "min": 0, "max": 10, "step": 1 },
            { "type": "em", "checked": false, "min": 0, "max": 10, "step": 1 },
            { "type": "rem", "checked": false, "min": 0, "max": 10, "step": 1 },
            { "type": "deg", "checked": false, "min": 0, "max": 10, "step": 1 },
            { "type": "vh", "checked": false, "min": 0, "max": 10, "step": 1 },
        ],
        "show_unit": true,
        "showLable": true,
        "lableBlock": true,
        "conditions": false,
        "dynamic": false,
        "selectors": "",
        "selector_value": "",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
        "responsive": false,
    },

    "select": {
        "type": "select",
        "lable": "Select",
        "name": "select",
        "description": "",
        "select_defaultValue": ['value-0', 'label-0'],
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "options": [{ "value": "value-0", "lable": "label-0", "svg": "svg-0" }],
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "", "svg": "svg-0" },] },
    },

    "selecttemplate": {
        "type": "selecttemplate",
        "lable": "Select Template",
        "name": "selecttemplate",
        "description": "",
        "s_template_defaultValue": 'select template',
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "", "svg": "svg-0" },] },
    },

    "select2": {
        "type": "select2",
        "lable": "Select2",
        "name": "select2",
        "description": "",
        "select2_defaultValue": [],
        "showLable": true,
        "lableBlock": false,
        "controlClass": "",
        "separator": "default",
        "multiple": true,
        "options": [{ "value": "value-0", "lable": "label-0" }],
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "textarea": {
        "type": "textarea",
        "lable": "Textarea",
        "name": "textarea",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "dynamic": false,
        "separator": "default",
        "rows": "5",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "url": {
        "type": "url",
        "lable": "Url",
        "name": "url",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "controlClass": "",
        "url_options": true,
        "url_options_array": ['url', 'is_external', 'nofollow'],
        "is_external": true,
        "nofollow": true,
        "custom_attributes": "",
        "showLable": true,
        "lableBlock": true,
        "dynamic": false,
        "separator": "default",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "switcher": {
        "type": "switcher",
        "lable": "Switcher",
        "name": "switcher",
        "description": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "label_on": "yes",
        "label_off": "no",
        "return_value": "yes",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "popover": {
        "type": "popover",
        "lable": "popover",
        "name": "popover",
        "description": "",
        "fields": [],
        "showLable": true,
        "lableBlock": false,
        "return_value": "",
        "separator": "default",
        "controlClass": "",
        "dynamic": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
        "class": "",
    },

    "normalhover": {
        "type": "normalhover",
        "lable": "normalhover",
        "name": "normalhover",
        "defaultValue": "normal",
        "nha_type": "normal",
        "tabTitle": "normal",
        "description": "",
        "nha_array": ['normal', 'hover'],
        "fields": [],
        "showLable": true,
        "controlClass": "",
        "dynamic": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
        "class": "",
    },





    // Extra elements for elementor
    "styleimage": {
        "type": "styleimage",
        "lable": "StyleImage",
        "name": "styleimage",
        "columns": "2",
        "description": "",
        "select_defaultValue": ['value-0', 'label-0', 'svg-0'],
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "options": [{ "value": "value-0", "lable": "label-0", "svg": "svg-0" }],
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "font": {
        "type": "font",
        "lable": "Font",
        "name": "font",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "selectors": "",
        "selector_value": "",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "icon": {
        "type": "icon",
        "lable": "Icon",
        "name": "icon",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "entranceanimation": {
        "type": "entranceanimation",
        "lable": "Entranceanimation",
        "name": "entranceanimation",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "exitanimation": {
        "type": "exitanimation",
        "lable": "Exitanimation",
        "name": "exitanimation",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "hoveranimation": {
        "type": "hoveranimation",
        "lable": "Hoveranimation",
        "name": "hoveranimation",
        "description": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": true,
        "separator": "default",
        "controlClass": "",
        "responsive": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "fontawesomeiconlist": {
        "type": "fontawesomeiconlist",
        "lable": "Fontawesomeiconlist",
        "name": "fontawesomeiconlist",
        "description": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "linksearch": {
        "type": "linksearch",
        "lable": "Linksearch",
        "name": "linksearch",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "multirange": {
        "type": "multirange",
        "lable": "Multirange",
        "name": "multirange",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "deprecatednotice": {
        "type": "notice",
        "lable": "Notice",
        "name": "notice",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "showLable": true,
        "lableBlock": false,
        "controlClass": "",
        "conditions": false,
        "separator": "default",
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "headingtags": {
        "type": "headingtags",
        "lable": "HeadingTags",
        "name": "headingtags",
        "hTags_defaultValue": "h1",
        "separator": "default",
        "lableBlock": false,
    },

    "gradientcolor": {
        "type": "gradientcolor",
        "lable": "GradientColor",
        "name": "gradientcolor",
        "description": "",
        "defaultValue": "",
        "separator": "default",
        "lableBlock": false,
        "selectors": "",
        "selector_value": "",
        "controlClass": "",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "sortable": {
        "type": "sortable",
        "lable": "Sortable",
        "name": "sortable",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "tab": {
        "type": "tab",
        "lable": "Tab",
        "name": "tab",
        "description": "",
        "placeHolder": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    "toggle": {
        "type": "toggle",
        "lable": "Toggle",
        "name": "toggle",
        "description": "",
        "defaultValue": "",
        "controlClass": "",
        "showLable": true,
        "lableBlock": false,
        "separator": "default",
        "label_on": "yes",
        "label_off": "no",
        "return_value": "yes",
        "conditions": false,
        "condition_value": { "relation": "or", "values": [{ "name": "", "operator": "==", "value": "" },] },
    },

    // Extra elements for elementor
}
