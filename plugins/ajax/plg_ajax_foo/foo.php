<?php
/**
 * @package    Foo Name
 *
 * @author     Andrea Gentil - Anibal Sanchez <team@extly.com>
 * @copyright  Copyright (c)2012-2020 Andrea Gentil - Anibal Sanchez All rights reserved.
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
class PlgAjaxFoo extends CMSPlugin
{
    /**
     * onAjaxQuery.
     */
    public function onAjaxQuery()
    {
        $button = $this->params->get('onesignal_custom_notify_button');
        $manifest = [];

        $sitename = JFactory::getConfig()->get('sitename');
        $metaDesc = JFactory::getConfig()->get('MetaDesc');

        if (empty($metaDesc)) {
            $metaDesc = $sitename;
        }

        $manifest['name'] = $this->params->get('name', $metaDesc);
        $manifest['short_name'] = $this->params->get('short_name', $sitename);

        $manifest['display'] = 'standalone';

        return json_encode($manifest);
    }
}
