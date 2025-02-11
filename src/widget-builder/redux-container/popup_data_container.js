import { connect } from 'react-redux';
import { Widget_data } from '../redux-services/actions/action';
import Pop_up from '../wb-setting-panel/popup';
import { ShowToast } from '../../pages/redux/redux_data/store_action';

const widgetStateToProps = state => ({
    widgetdata: state
})

const widgetDispatchToProps = dispatch => ({
    addTowidgethandler: data => dispatch(Widget_data(data)),
    wdkit_set_toast: data => dispatch(ShowToast(data)),
})

export default connect(widgetStateToProps, widgetDispatchToProps)(Pop_up)