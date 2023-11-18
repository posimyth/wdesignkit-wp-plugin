import { connect } from 'react-redux';
import { Widget_data } from '../redux-services/actions/action';
import Pop_up from '../wb-setting-panel/popup';

const widgetStateToProps = state => ({
    widgetdata: state
})

const widgetDispatchToProps = dispatch => ({
    addTowidgethandler:data=>dispatch(Widget_data(data))
})

export default connect( widgetStateToProps , widgetDispatchToProps)(Pop_up)