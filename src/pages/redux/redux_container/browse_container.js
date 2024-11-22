import { connect } from 'react-redux';
import Browse from '../../browse/browse'
import { ChangeLoginRoute, ShowToast } from '../redux_data/store_action';

const browse = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptobrowse = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
})

export default connect(browse, maptobrowse)(Browse)