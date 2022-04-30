<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'blog' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'sW26]%[o@z@+wfX83l7!d*9-kmSXFJ<,(JrI44@LbII=]w5`!iGFeYpB!3;>J$HY' );
define( 'SECURE_AUTH_KEY',  'L)*n(2(_92}iC$fKjgiTC7P0q{@rvgHUbGukQNa<]MNFW]JppLnlEQ&U`vhOzq`d' );
define( 'LOGGED_IN_KEY',    '2|J4<]R7,wZ@^59%/@%qY B:.>DYy36vIbNe ;*bTHpHX0oub%v5R00XUGh2~<Y(' );
define( 'NONCE_KEY',        'K=?thj.}FU)F|To]CZ1^CbA&:=CmS9$H@9l]sc6VA+e$CcUstm#X%lZdS,&5v[0d' );
define( 'AUTH_SALT',        'Uu3v<Qqoo?A:k(}lx9nD]=X17>*lt8>3Zh=C?O$ x)$Btm^b=p5*A6SLLEPqI1^I' );
define( 'SECURE_AUTH_SALT', 'z6u@`p/Vc+j>a@cPfr2D8gZ&cm0f9ZO3KXIn^67CLcVh5 )--&(*7DdSA^_mp !{' );
define( 'LOGGED_IN_SALT',   'ci|ThxZR|yt~`3tu65m5pu8#)]i!9N6y~?|OZ^z)2-0KXZmL+af*wxHO>&MmIEV=' );
define( 'NONCE_SALT',       'YUhhxN)>FsWVjy{EWrmzKNTGd+gLkJm=K[YZJ@TPS:_nW+hrVeokeC7~-:Gp@<@-' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
