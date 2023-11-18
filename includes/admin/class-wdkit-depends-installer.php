<?php
/**
 * The Plugin Installer Require of the Template.
 *
 * @link       https://posimyth.com/
 * @since      1.0.0
 *
 * @package    Wdesignkit
 */

/**Exit if accessed directly.*/
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Wdkit_Depends_Installer' ) ) {

	/**
	 * It is check plugin install or not when template import
	 *
	 * @since 1.0.0
	 */
	class Wdkit_Depends_Installer {
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
		 * Initialize the class and set its properties.
		 *
		 * @since   1.0.0
		 */
		public function __construct() {
		}

		/**
		 * Install Plugin For Template
		 *
		 * @since   1.0.0
		 *
		 * @param string $plugin_data this vlaue is plugin slug.
		 */
		public function wdkit_install_plugin( $plugin_data ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
			include_once ABSPATH . 'wp-admin/includes/plugin-install.php';

			$all_plugins = get_plugins();
			$installed   = isset( $all_plugins[ $plugin_data['plugin_slug'] ] );

			if ( isset( $plugin_data['freepro'] ) && 1 === $plugin_data['freepro'] ) {
				if ( ! $installed ) {
					$status = array(
						'p_id'    => $plugin_data['p_id'],
						'success' => false,
						'status'  => 'pro_plugin',
						'message' => 'Pro Plugin',
					);
				}
			}

			if ( $installed ) {
				$activate_status = $this->wdkit_activate_plugin( $plugin_data['plugin_slug'] );

				$status = array(
					'p_id'    => $plugin_data['p_id'],
					'success' => true,
					'status'  => 'active',
				);
			} else {
				$status = array(
					'p_id'    => $plugin_data['p_id'],
					'success' => false,
				);

				$plugin_api = plugins_api(
					'plugin_information',
					array(
						'slug'   => sanitize_key( wp_unslash( $plugin_data['original_slug'] ) ),
						'fields' => array(
							'sections' => false,
						),
					)
				);

				if ( is_wp_error( $plugin_api ) ) {
					$status['message'] = $plugin_api->get_error_message();
					return $status;
				}

				$status['plugin_name'] = $plugin_api->name;

				$skin     = new WP_Ajax_Upgrader_Skin();
				$upgrader = new Plugin_Upgrader( $skin );
				$result   = $upgrader->install( $plugin_api->download_link );
				if ( is_wp_error( $result ) ) {
					$status['status']  = $result->get_error_code();
					$status['message'] = $result->get_error_message();

					return $status;
				} elseif ( is_wp_error( $skin->result ) ) {
					$status['status']  = $skin->result->get_error_code();
					$status['message'] = $skin->result->get_error_message();

					return $status;
				} elseif ( $skin->get_errors()->has_errors() ) {
					$status['message'] = $skin->get_error_messages();

					return $status;
				} elseif ( is_null( $result ) ) {
					global $wp_filesystem;

					$status['status']  = 'unable_to_connect_to_filesystem';
					$status['message'] = __( 'Unable to connect to the filesystem. Please confirm your credentials.', 'wdesignkit' );

					if ( $wp_filesystem instanceof \WP_Filesystem_Base && is_wp_error( $wp_filesystem->errors ) && $wp_filesystem->errors->has_errors() ) {
						$status['message'] = esc_html( $wp_filesystem->errors->get_error_message() );
					}

					return $status;
				}

				$install_status  = install_plugin_install_status( $plugin_api );
				$activate_status = $this->wdkit_activate_plugin( $install_status['file'] );
			}

			if ( $activate_status && ! is_wp_error( $activate_status ) ) {
				$status['success'] = true;
				$status['status']  = 'active';
			}

			$status['slug'] = $plugin_data['original_slug'];

			return $status;
		}

		/**
		 * Active Plugin For Template
		 *
		 * @since   1.0.0
		 *
		 * @param string $plugin_file this vlaue is plugin slug.
		 */
		private function wdkit_activate_plugin( $plugin_file ) {

			if ( current_user_can( 'activate_plugin', $plugin_file ) && is_plugin_inactive( $plugin_file ) ) {
				$result = activate_plugin( $plugin_file, false, false );

				if ( is_wp_error( $result ) ) {
					return $result;
				} else {
					return true;
				}
			}

			return false;
		}
	}

	Wdkit_Depends_Installer::get_instance();
}
