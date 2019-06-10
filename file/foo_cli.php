<?php
/**
 * @package    [EXTENSION_NAME]
 *
 * @author     [AUTHOR] <[AUTHOR_EMAIL]>
 * @copyright  [COPYRIGHT]
 * @license    [LICENSE]
 * @link       [AUTHOR_URL]
 */

if (version_compare(PHP_VERSION, '5.3.10', '<'))
{
	die('Your host needs to use PHP 5.3.10 or higher to run this version of Joomla!');
}

/**
 * Constant that is checked in included files to prevent direct access.
 * define() is used in the installation folder rather than "const" to not error for PHP 5.2 and lower
 */
define('_JEXEC', 1);
set_time_limit(0);

if (file_exists(__DIR__ . '/defines.php'))
{
	include_once __DIR__ . '/defines.php';
}

if (!defined('_JDEFINES'))
{
	$path = explode(DIRECTORY_SEPARATOR, __DIR__);
	array_pop($path);
	$path = implode(DIRECTORY_SEPARATOR, $path);
	define('JPATH_BASE', $path);
	require_once JPATH_BASE . '/includes/defines.php';
}

require_once JPATH_BASE . '/includes/framework.php';

// Instantiate the application.
$app = JFactory::getApplication('site');
$app->scope = 'com_foo';
$component = 'Foo';

define('JPATH_COMPONENT', JPATH_SITE . '/components/com_foo/');
define('JPATH_COMPONENT_ADMINISTRATOR', JPATH_SITE . '/administrator/components/com_foo/');

require_once JPATH_SITE . '/components/com_foo/defines.php';

JLoader::registerPrefix($component, JPATH_SITE . '/components/com_foo/');
JTable::addIncludePath(JPATH_SITE . '/components/com_foo/tables');

$input = JFactory::getApplication()->input;
$input->set('option', 'com_foo');
$input->set('view', 'extension');

/**
 * Ready to process
 */