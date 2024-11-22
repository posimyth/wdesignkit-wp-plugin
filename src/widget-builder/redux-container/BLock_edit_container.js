import { connect } from 'react-redux';
import { AddToCart, Editor_code, Widget_data } from '../redux-services/actions/action';
import Block_Edit from '../components-controller/block_edit'


const mapStateToProps = state => ({
    cardData: state.CardItems.cardData,
    controller: state.Active_controller,
    Editor_code: state.Editor_code.Editor_codes,
    widgetdata: state.WcardData,
})

const mapDispatchToProps = dispatch => ({
    addToCarthandler: data => dispatch(AddToCart(data)),
    addToEditor_code: data => dispatch(Editor_code(data)),
    // addToActiveController:data=>dispatch(Active_controller(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Block_Edit)