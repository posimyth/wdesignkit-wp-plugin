import { connect } from 'react-redux';
import Block_Element from '../components-controller/block_element';

const widgetStateToProps = state => ({
    widgetdata: state.WcardData.widgetdata
})

const widgetDispatchToProps = dispatch => ({
})

export default connect( widgetStateToProps , widgetDispatchToProps)(Block_Element)