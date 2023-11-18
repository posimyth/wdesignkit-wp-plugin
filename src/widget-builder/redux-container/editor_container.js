import { connect } from 'react-redux';
import { Editor_links, Active_controller, Widget_data, Editor_code } from '../redux-services/actions/action';
import Wb_editor from '../editor/wb-editor';

const mapEditorStateToProps = state => ({
    Editor_data: state.Editor_data.links,
    Editor_code: state.Editor_code.Editor_codes,
    cardData: state.CardItems.cardData,
    controller: state.Active_controller,
    widgetdata: state.WcardData.widgetdata,
})

const mapEditorDispatchToProps = dispatch => ({
    addTolinkhandler: data => dispatch(Editor_links(data)),
    addTowidgethandler: data => dispatch(Widget_data(data)),
    addToActiveController: data => dispatch(Active_controller(data)),
    addToEditor_code: data => dispatch(Editor_code(data)),
})

export default connect(mapEditorStateToProps, mapEditorDispatchToProps)(Wb_editor)