<?php
/**
 * @package    Foo Name
 *
 * @author     Andrea Gentil - Anibal Sanchez <team@extly.com>
 * @copyright  Copyright (c)2012-2022 Andrea Gentil - Anibal Sanchez All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 * @link       https://www.extly.com
 */

defined('_JEXEC') or die;

use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Database\DatabaseDriver;

/**
 * Foo plugin.
 *
 * @package  Foo Name
 * @since    1.0
 */
class PlgSearchFoo extends CMSPlugin
{
    /**
     * Application object
     *
     * @var    CMSApplication
     * @since  1.0
     */
    protected $app;

    /**
     * Database object
     *
     * @var    DatabaseDriver
     * @since  1.0
     */
    protected $db;

    /**
     * Affects constructor behavior. If true, language files will be loaded automatically.
     *
     * @var    boolean
     * @since  1.0
     */
    protected $autoloadLanguage = true;

    /**
     * Determine areas searchable by this plugin.
     *
     * @return  array  An array of search areas.
     *
     * @since   1.0
     */
    public function onContentSearchAreas()
    {
        static $areas = array(
            'tags' => 'PLG_SEARCH_FOO_FOO'
        );

        return $areas;
    }

    /**
     * Search content (tags).
     *
     * The SQL must return the following fields that are used in a common display
     * routine: href, title, section, created, text, browsernav.
     *
     * @param   string  $text      Target search string.
     * @param   string  $phrase    Matching option (possible values: exact|any|all).  Default is "any".
     * @param   string  $ordering  Ordering option (possible values: newest|oldest|popular|alpha|category).  Default is "newest".
     * @param   string  $areas     An array if the search is to be restricted to areas or null to search all areas.
     *
     * @return  array  Search results.
     *
     * @since   1.0
     */
    public function onContentSearch($text, $phrase = '', $ordering = '', $areas = null)
    {
    }
}
