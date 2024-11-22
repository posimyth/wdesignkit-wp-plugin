import { connect } from 'react-redux';
import Loader from '../loader';
import { Editor_code , AddToCart, Widget_data, Editor_links} from '../redux-services/actions/action';
import { Change_wdkit_meta, ShowToast } from '../../pages/redux/redux_data/store_action';

const mapEditor_codeStateToProps = state => ({
    Editor_data: state.Editor_data.links,
    Editor_code: state.Editor_code.Editor_codes,
    widgetdata: state.WcardData.widgetdata,
    cardData: state.CardItems.cardData,
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const mapEditor_code = dispatch => ({
    addToEditor_code:data=>dispatch(Editor_code(data)),
    addToCarthandler:data=>dispatch(AddToCart(data)),
    addTowidgethandler:data=>dispatch(Widget_data(data)),
    addTolinkhandler:data=>dispatch(Editor_links(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect( mapEditor_codeStateToProps , mapEditor_code)(Loader)