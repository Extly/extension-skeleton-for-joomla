#!/bin/sh

# A handy bash script to be execute only once on the extension-specific directories

EXTENSION_NAME="XT Twilio for Joomla"
EXTENSION_ALIAS="xttwilio"
EXTENSION_CLASS_NAME="XTTwilio"
TRANSLATION_KEY="XTTWILIO"

find $1 -name "*foo*" -type d -exec rename "s/foo/$EXTENSION_ALIAS/" {} \;
find $1 -name "*foo*" -type f -exec rename "s/foo/$EXTENSION_ALIAS/" {} \;
