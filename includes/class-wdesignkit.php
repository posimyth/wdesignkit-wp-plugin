<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://posimyth.com/
 * @since      1.0.0
 *
 * @package    Wdesignkit
 * @subpackage Wdesignkit/includes
 */

namespace wdkit;

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Wdkit_Wdesignkit' ) ) {

	/**
	 * It is wdesignkit Main Class
	 *
	 * @since 1.0.0
	 */
	class Wdkit_Wdesignkit {

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance;

		/**
		 *  Initiator
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Define the core functionality of the plugin.
		 */
		public function __construct() {
			/**Dont Move File Used For Create OWN WDkit Hooks*/
			require_once WDKIT_INCLUDES . 'admin/class-wdkit-data-hooks.php';

			register_activation_hook( WDKIT_FILE, array( __CLASS__, 'wdkit_activation' ) );
			register_deactivation_hook( WDKIT_FILE, array( __CLASS__, 'wdkit_deactivation' ) );

			add_action( 'plugins_loaded', array( $this, 'wdkit_plugin_loaded' ) );
		}

		/**
		 * Check Setting Panal switch On off
		 *
		 * @since 1.0.0
		 *
		 * @param string $type check builder type.
		 */
		public static function wdkit_is_compatible( $type ) {
			$wkit_settings_panel = get_option( 'wkit_settings_panel', false );

			if ( empty( $wkit_settings_panel ) ) {
				do_action( 'wdkit_admin_create_default' );

				return false;
			}

			$builder  = ! empty( $wkit_settings_panel['builder'] ) ? $wkit_settings_panel['builder'] : false;
			$b_d_type = false;
			if ( 'elementor' === $type ) {
				$b_d_type = ! empty( $wkit_settings_panel['elementor_builder'] ) ? $wkit_settings_panel['elementor_builder'] : false;
			} elseif ( 'gutenberg' === $type ) {
				$b_d_type = ! empty( $wkit_settings_panel['gutenberg_builder'] ) ? $wkit_settings_panel['gutenberg_builder'] : false;
			} elseif ( 'builder' === $type ) {
				$b_d_type = $builder;
			} else {
				$b_d_type = false;
			}

			if ( empty( $builder ) || empty( $b_d_type ) ) {
				return false;
			}

			return true;
		}

		/**
		 * Plugin Activation.
		 *
		 * @return void
		 */
		public static function wdkit_activation() {
			do_action( 'wdkit_admin_create_default' );
		}

		/**
		 * Plugin deactivation.
		 *
		 * @return void
		 */
		public static function wdkit_deactivation() {
		}

		/**
		 * Files load plugin loaded.
		 *
		 * @return void
		 */
		public function wdkit_plugin_loaded() {
			$this->load_textdomain();
			$this->wdkit_load_dependencies();

			if ( is_admin() && current_user_can( 'manage_options' ) ) {
				/**Plugin active option*/
				add_filter( 'plugin_action_links_' . WDKIT_PBNAME, array( $this, 'wdkit_settings_pro_link' ) );

				/**Plugin by links*/
				add_filter( 'plugin_row_meta', array( $this, 'wdkit_extra_links_plugin_row_meta' ), 10, 2 );
			}
		}

		/**
		 * Load Text Domain.
		 * Text Domain : wdkit
		 */
		public function load_textdomain() {
			load_plugin_textdomain( 'wdesignkit', false, WDKIT_BDNAME . '/languages/' );
		}

		/**
		 * Load the required dependencies for this plugin.
		 *
		 * - Wdesignkit_Admin. Defines all hooks for the admin area.
		 * - Wdesignkit_Public. Defines all hooks for the public side of the site.
		 *
		 * @since    1.0.0
		 * @access   private
		 */
		private function wdkit_load_dependencies() {

			/**
			 * The class responsible for defining all actions that occur in the admin area.
			 */
			require_once WDKIT_INCLUDES . 'admin/class-wdkit-enqueue.php';
			require_once WDKIT_INCLUDES . 'admin/class-wdesignkit-data-query.php';
			require_once WDKIT_INCLUDES . 'admin/class-wdkit-depends-installer.php';
			require_once WDKIT_INCLUDES . 'admin/class-api.php';

			require_once WDKIT_INCLUDES . 'widget-load/widget-load-files.php';
		}

		/**
		 * It is use for set plugin page link
		 *
		 * @since 1.0.0
		 *
		 * @param string $links get all old link and add new link.
		 */
		public function wdkit_settings_pro_link( $links ) {

			$settings  = sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=wdesign-kit#/login' ), __( 'Settings', 'wdesignkit' ) );
			$need_help = sprintf( '<a href="%s" target="_blank" rel="noopener noreferrer">%s</a>', esc_url( 'https://wdesignkit.com/' ), __( 'Need Help?', 'wdesignkit' ) );

			$links   = (array) $links;
			$links[] = $settings;
			$links[] = $need_help;

			return $links;
		}

		/**
		 * It is use for set plugin page link
		 *
		 * @since 1.0.0
		 *
		 * @param string $plugin_meta return full array.
		 * @param string $plugin_file check path.
		 */
		public function wdkit_extra_links_plugin_row_meta( $plugin_meta = array(), $plugin_file = '' ) {

			if ( strpos( $plugin_file, WDKIT_PBNAME ) !== false ) {
				$new_links = array(
					'video-tutorials' => '<a href="' . esc_url( '#' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Video Tutorials', 'wdesignkit' ) . '</a>',
					'join-community'  => '<a href="' . esc_url( 'https://www.facebook.com/groups/wdesignkit' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Join Community', 'wdesignkit' ) . '</a>',
					'whats-new'       => '<a href="' . esc_url( '#' ) . '" target="_blank" rel="noopener noreferrer" style="color: orange;">' . esc_html__( 'What\'s New?', 'wdesignkit' ) . '</a>',
					'req-feature'     => '<a href="' . esc_url( '#' ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'Request Feature', 'wdesignkit' ) . '</a>',
				);

				$plugin_meta = array_merge( $plugin_meta, $new_links );
			}

			return $plugin_meta;
		}
	}

	Wdkit_Wdesignkit::get_instance();
}
