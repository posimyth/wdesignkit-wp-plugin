import { connect } from 'react-redux';
import { Toast_message } from '../../../helper/helper-function';
import { ShowToast } from '../redux_data/store_action';

const ToastData = state => ({
    ToastData: state.wkit_Toast_message.message_content
})

const maptoToastData = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(ToastData, maptoToastData)(Toast_message)