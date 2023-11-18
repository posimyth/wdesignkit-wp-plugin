import { connect } from 'react-redux';
import { Wkit_user_details } from '../../../helper/helper-function';
import { Change_wdkit_meta, ShowToast } from '../redux_data/store_action';

const User_data = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta
})

const maptoUser_data = dispatch => ({
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(User_data, maptoUser_data)(Wkit_user_details)