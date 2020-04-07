#!/bin/sh

# A handy bash script to be executed only once on the extension-specific directories

EXTENSION_NAME="The New Name for Joomla"
EXTENSION_ALIAS="thenewname"
EXTENSION_CLASS_NAME="TheNewName"
TRANSLATION_KEY="THE_NEW_NAME"

find $1 -name "*foo*" -type d -exec rename "s/foo/$EXTENSION_ALIAS/" {} \;
find $1 -name "*foo*" -type f -exec rename "s/foo/$EXTENSION_ALIAS/" {} \;
