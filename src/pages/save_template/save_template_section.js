import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post';
const { Component, Fragment } = wp.element
const { __ } = wp.i18n;

class Section_Save_template extends Component {
	constructor(props) {
        super(props)
		this.state = {
			copiedCss : {},
			checkCopyOrNot : false
		};
	}
	
	render(){
		return (
			<Fragment>
                <PluginBlockSettingsMenuItem
                    icon= {"wdkit-save-section"}
                    label= { __( "Save in WDesignKit" ) }
                    onClick={ () => {
                        document.querySelector(".wkit-gutenber-btn").click();
                        let copyContent = wp.blocks.serialize(wp.data.select('core/block-editor').getSelectedBlock());
                        localStorage.setItem("wdkit_section", copyContent);
                        setTimeout((function() {
                            if (window.location && window.location.hash != '#/save_template') {
                                window.location.hash = '#/save_template/section';
                            }
                        }), 20)
                    } }
                />
			</Fragment>
		)
	}
}
export default Section_Save_template;