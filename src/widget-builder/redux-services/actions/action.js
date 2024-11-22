const AddToCart = (data) => {
    return {
        type: 'ADD_LAYOUT_ARRAY',
        data: data
    }
}

const Widget_data = (data) => {
    return {
        type: 'ADD_WIDGET_ARRAY',
        data: data
    }
}

const Editor_links = (data) => {
    return {
        type: 'ADD_EDITOR_ARRAY',
        data: data
    }
}

const Editor_code = (data) => {
    return {
        type: 'Editor_code',
        data: data
    }
}

const Active_controller = (data) => {
    return {
        type: 'ADD_CONTROLLER',
        data: data
    }
}

const Active_section = (data) => {
    return {
        type: 'ADD_SECTION',
        data: data
    }
}

export { AddToCart, Widget_data, Editor_links, Editor_code, Active_controller, Active_section }