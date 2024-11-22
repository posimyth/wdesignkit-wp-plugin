import { connect } from 'react-redux';
import { Editor_code , AddToCart, Widget_data, Editor_links, Active_controller } from '../redux-services/actions/action';
import Widget_builder from '../widget_builder';

const mapEditor_codeStateToProps = state => ({
    Editor_code: state.Editor_code,
    widgetdata: state.WcardData.widgetdata,
    controller: state.Active_controller
})

const mapEditor_code = dispatch => ({
    addToEditor_code:data=>dispatch(Editor_code(data)),
    addToCarthandler:data=>dispatch(AddToCart(data)),
    addTowidgethandler:data=>dispatch(Widget_data(data)),
    addTolinkhandler:data=>dispatch(Editor_links(data)),
    addToActiveController:data=>dispatch(Active_controller(data))
})

export default connect( mapEditor_codeStateToProps , mapEditor_code)(Widget_builder)