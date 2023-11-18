<?php
/**
 * Exit if accessed directly.
 *
 * @link       https://posimyth.com/
 * @since      1.0.0
 *
 * @package    Wdesignkit
 * @subpackage Wdesignkit/includes/gutenberg
 * */

/**
 * Exit if accessed directly.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Wdkit_Gutenberg_Files_Load' ) ) {

	/**
	 * This class used for only gutenberg widget load
	 *
	 * @since 1.0.0
	 */
	class Wdkit_Gutenberg_Files_Load {

		/**
		 * Instance
		 *
		 * @since 1.0.0
		 * @var \Elementor_Test_Addon\Plugin The single instance of the class.
		 */
		private static $instance = null;

		/**
		 * Instance
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @since 1.0.0
		 * @access public
		 * @static
		 * @return \Elementor_Test_Addon\Plugin An instance of the class.
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Perform some compatibility checks to make sure basic requirements are meet.
		 *
		 * @since 1.0.0
		 * @access public
		 */
		public function __construct() {
			$this->wdkit_register_gutenberg_widgets();
		}

		/**
		 * Here is Register Gutenberg Widgets
		 *
		 * @since 1.0.0
		 * @access public
		 */
		public function wdkit_register_gutenberg_widgets() {
			$dir = trailingslashit( WDKIT_BUILDER_PATH ) . '/gutenberg/';

			if ( ! is_dir( $dir ) ) {
				return false;
			}

			$list = ! empty( $dir ) ? scandir( $dir ) : array();
			if ( empty( $list ) || count( $list ) <= 2 ) {
				return false;
			}

			foreach ( $list as $key => $value ) {
				if ( in_array( $value, array( '..', '.' ), true ) ) {
					continue;
				}

				if ( ! strpos( $value, '.' ) ) {
					$sub_dir = scandir( trailingslashit( $dir ) . '/' . $value );

					foreach ( $sub_dir as $sub_dir_value ) {
						if ( in_array( $sub_dir_value, array( '..', '.' ), true ) ) {
							continue;
						}

						$file      = new SplFileInfo( $sub_dir_value );
						$check_ext = $file->getExtension();
						$ext       = pathinfo( $sub_dir_value, PATHINFO_EXTENSION );

						if ( 'php' === $ext ) {
							$json_file   = str_replace( '.php', '.json', $sub_dir_value );
							$str_replace = str_replace( '.php', '', $sub_dir_value );

							$json_path = trailingslashit( WDKIT_BUILDER_PATH ) . "/gutenberg/{$value}/{$json_file}";
							$json_data = wp_json_file_decode( $json_path );

							$w_type = ! empty( $json_data->widget_data->widgetdata->publish_type ) ? $json_data->widget_data->widgetdata->publish_type : '';

							if ( ! empty( $w_type ) && 'Publish' === $w_type ) {
								include trailingslashit( WDKIT_BUILDER_PATH ) . "/gutenberg/{$value}/{$sub_dir_value}";
							}
						}
					}
				}
			}
		}
	}

	Wdkit_Gutenberg_Files_Load::instance();
}
