import { connect } from 'react-redux';
import Main_page from '../Listing-panle/main';
import { ChangeLoginRoute, Change_wdkit_meta, ShowToast } from '../../pages/redux/redux_data/store_action';

const mapEditor_codeStateToProps = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const mapEditor_code = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
})

export default connect(mapEditor_codeStateToProps, mapEditor_code)(Main_page)