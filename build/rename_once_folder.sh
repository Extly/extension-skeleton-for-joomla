#!/bin/bash

set -euo pipefail

# A handy bash script to be executed only once on the extension-specific directories

source .env

find $1 -name "*foo*" -type d -exec rename "s/foo/$EXTENSION_ALIAS/" {} \;
find $1 -name "*foo*" -type f -exec rename "s/foo/$EXTENSION_ALIAS/" {} \;
