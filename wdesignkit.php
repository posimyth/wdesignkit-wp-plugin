<?php
/**
 * Plugin Name: WDesignkit
 * Plugin URI: https://wdesignkit.com/
 * Description: Build WordPress websites in no time using wdesignkit's collection of website templates & Widgets, Widget Builder for Elementor, Block Builder for Gutenberg and many more feature to improve your web design process.
 * Version: 0.0.36
 * Author: POSIMYTH
 * Author URI: https://posimyth.com/
 * Text Domain: wdesignkit
 * Domain Path: /languages
 *
 * @package wdesignkit
 */

/** If this file is called directly, abort. */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WDKIT_VERSION', '0.0.36' );
define( 'WDKIT_FILE', __FILE__ );
define( 'WDKIT_PATH', plugin_dir_path( __FILE__ ) );
define( 'WDKIT_PBNAME', plugin_basename( __FILE__ ) );
define( 'WDKIT_BDNAME', basename( dirname( __FILE__ )) );
define( 'WDKIT_URL', plugins_url( '/', __FILE__ ) );
define( 'WDKIT_HOSTURL', site_url() );
define( 'WDKIT_INCLUDES', WDKIT_PATH . '/includes/' );
define( 'WDKIT_ASSETS', WDKIT_URL . 'assets/' );
define( 'WDKIT_TEXT_DOMAIN', 'wdesignkit' );
define( 'WDKIT_SERVER_SITE_URL', 'https://staging.wdesignkit.com/' );

/** Widget Builder path*/
define( 'WDKIT_SERVER_PATH', wp_upload_dir()['baseurl'] . DIRECTORY_SEPARATOR . '/wdesignkit' );
define( 'WDKIT_BUILDER_PATH', wp_upload_dir()['basedir'] . DIRECTORY_SEPARATOR . '/wdesignkit' );
define( 'WDKIT_GET_SITE_URL', get_site_url() );

require WDKIT_PATH . 'includes/class-wdesignkit.php';
