<?php
/**
 * This file is used to load widget builder files and the builder.
 *
 * @link       https://posimyth.com/
 * @since      1.0.0
 *
 * @package    Wdesignkit
 */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use wdkit\Wdkit_Wdesignkit;

if ( ! class_exists( 'Wdkit_Widget_Load_Files' ) ) {

	/**
	 * This class used for widget load
	 *
	 * @since 1.0.0
	 */
	class Wdkit_Widget_Load_Files {

		/**
		 *
		 * Ensures only one instance of the class is loaded or can be loaded.
		 *
		 * @var instance
		 * @since 1.0.0
		 */
		private static $instance = null;

		/**
		 * This instance is used to load class
		 *
		 * @since 1.0.0
		 */
		public static function instance() {

			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * This constructor is used to load builder files.
		 *
		 * @since 1.0.0
		 */
		public function __construct() {

			$this->wdkit_default_category();

			$this->wdkit_elementor_load();
			$this->wdkit_gutenberg_load();
		}

		/**
		 * This function is called to load Elementor files, categories, and everything needed for WDesignKit to build with Elementor.
		 *
		 * @since 1.0.0
		 */
		public function wdkit_elementor_load() {
			if ( Wdkit_Wdesignkit::wdkit_is_compatible( 'elementor' ) ) {
				require_once WDKIT_INCLUDES . 'widget-load/elementor/class-wdkit-elementor-files-load.php';
			}
		}

		/**
		 * This function is called to load Elementor files, categories, and everything needed for WDesignKit to build with Gutenberg.
		 *
		 * @since 1.0.0
		 */
		public function wdkit_gutenberg_load() {
			if ( Wdkit_Wdesignkit::wdkit_is_compatible( 'gutenberg' ) ) {
				require_once WDKIT_INCLUDES . 'widget-load/gutenberg/class-wdkit-gutenberg-files-load.php';
			}
		}

		/**
		 * Set widget Default Category as WDesignKit
		 *
		 * @since 1.0.0
		 * @access public
		 */
		public function wdkit_default_category() {
			$category_list = get_option( 'wkit_builder' );

			$final_category = array( 'WDesignKit' );
			if ( ! empty( $category_list ) && ! in_array( 'WDesignKit', $category_list, true ) ) {
				$final_category = array_merge( $final_category, $category_list );

				update_option( 'wkit_builder', $final_category );
			} elseif ( ! is_array( $category_list ) && empty( $category_list ) ) {
				do_action( 'wdkit_admin_create_default' );
			}
		}
	}

	Wdkit_Widget_Load_Files::instance();
}
