import { connect } from 'react-redux';
import { Active_controller, AddToCart } from '../redux-services/actions/action';
import Wb_layout from '../component-setting/wb-layout';


const mapStateToProps = state => ({
    cardData: state.CardItems.cardData,
    widgetdata: state.WcardData.widgetdata,
    controller: state.Active_controller
})

const mapDispatchToProps = dispatch => ({
    addToCarthandler: data => dispatch(AddToCart(data)),
    addToActiveController: data => dispatch(Active_controller(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wb_layout)