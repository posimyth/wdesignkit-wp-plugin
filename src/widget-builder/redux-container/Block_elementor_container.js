import { connect } from 'react-redux';
import { Active_controller, AddToCart, Active_section } from '../redux-services/actions/action';
import Block_Element from '../components-controller/block_element';
import { ShowToast } from '../../pages/redux/redux_data/store_action';

const widgetStateToProps = state => ({
    widgetdata: state.WcardData.widgetdata,
    cardData: state.CardItems.cardData,
    controller: state.Active_controller,
    section_id: state.Active_section.section

})

const widgetDispatchToProps = dispatch => ({
    addToCarthandler: data => dispatch(AddToCart(data)),
    addToActiveController: data => dispatch(Active_controller(data)),
    addToActiveSection: data => dispatch(Active_section(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),

})

export default connect(widgetStateToProps, widgetDispatchToProps)(Block_Element)