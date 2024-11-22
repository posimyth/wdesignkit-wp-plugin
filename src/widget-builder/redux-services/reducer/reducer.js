const InitialState = {
    cardData: [{ "layout": [], "style": [] }]
}

const Widget_initial = {
    widgetdata: {
        'name': "",
        'category': "",
        'w_icon': "",
        'w_image': "",
        'description': "",
        "helper_link": "",
        "type": "elementor",
        "publish_type": "Publish",
        "key_words": "",
        "css_parent_node": true,
        "widget_id": "",
        "widget_version": "1.0.0",
        "version_detail": [],
    }
}

const Editor_links = {
    links: [{ "js": [""], "css": [""], "external_cdn": [] }]
}

const Editor_codes_I = {
    Editor_codes: [{
        "html": ``,
        "css": ``,
        "js": ``,
    }]
}

const controller = {};
const section_id = { section: { sec_id: '0' } };

export default function CardItems(state = InitialState, action) {

    switch (action.type) {
        case 'ADD_LAYOUT_ARRAY':
            return {
                ...StaticRange,
                cardData: action.data
            }
            break;
        default:
            return state
    }
}
export function Editor_code(state = Editor_codes_I, action) {

    switch (action.type) {
        case 'Editor_code':
            return {
                ...StaticRange,
                Editor_codes: action.data
            }
            break;
        default:
            return state
    }
}

export function WcardData(state = Widget_initial, action) {
    switch (action.type) {
        case 'ADD_WIDGET_ARRAY':
            return {
                ...StaticRange,
                widgetdata: action.data
            }
            break;
        default:
            return state
    }
}

export function Editor_data(state = Editor_links, action) {
    switch (action.type) {
        case 'ADD_EDITOR_ARRAY':
            return {
                ...StaticRange,
                links: action.data
            }
            break;
        default:
            return state
    }
}

export function Active_controller(state = controller, action) {
    switch (action.type) {
        case 'ADD_CONTROLLER':
            return {
                ...StaticRange,
                controller: action.data
            }
            break;
        default:
            return state
    }
}

export function Active_section(state = section_id, action) {
    switch (action.type) {
        case 'ADD_SECTION':
            return {
                ...StaticRange,
                section: action.data
            }
            break;
        default:
            return state
    }
}