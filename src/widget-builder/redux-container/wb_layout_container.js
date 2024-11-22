import { connect } from 'react-redux';
import { Active_controller, AddToCart, Active_section } from '../redux-services/actions/action';
import Wb_layout from '../component-setting/wb-layout';
import { ShowToast } from '../../pages/redux/redux_data/store_action';

const mapStateToProps = state => ({
    cardData: state.CardItems.cardData,
    widgetdata: state.WcardData.widgetdata,
    controller: state.Active_controller,
    section_id: state.Active_section.section
})

const mapDispatchToProps = dispatch => ({
    addToCarthandler: data => dispatch(AddToCart(data)),
    addToActiveController: data => dispatch(Active_controller(data)),
    addToActiveSection: data => dispatch(Active_section(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wb_layout)