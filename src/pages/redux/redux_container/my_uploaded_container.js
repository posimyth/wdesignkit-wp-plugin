import { connect } from 'react-redux';
import my_uploaded from '../../myuploaded/myuploaded';
import { Change_wdkit_meta, ShowToast, ChangeLoginRoute } from '../redux_data/store_action';

const my_uploaded_page = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
})

const maptomy_uploaded_page = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_Login_Route: data => dispatch(ChangeLoginRoute(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(my_uploaded_page, maptomy_uploaded_page)(my_uploaded)