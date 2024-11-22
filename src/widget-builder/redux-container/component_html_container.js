import { connect } from 'react-redux';
import { Active_controller, AddToCart, Widget_data } from '../redux-services/actions/action';
import Component_html from '../components-data/component_layout';
import { ShowToast } from '../../pages/redux/redux_data/store_action';



const mapStateToProps = state => ({
    cardData: state,
    controller: state.Active_controller,
    widgetdata: state.WcardData.widgetdata
})

const mapDispatchToProps = dispatch => ({
    addToCarthandler: data => dispatch(AddToCart(data)),
    addToActiveController: data => dispatch(Active_controller(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Component_html)