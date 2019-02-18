#!/bin/sh

## test -d app/ && npm run production --prefix app/
## test -d app/ && cp app/dist/* library/media/app/dist/

# npx babel library/media/app/js/app.js --presets=@babel/preset-env | uglifyjs --compress --mangle > library/media/app/js/app.min.js
# npx babel library/media/app/js/autocomplete.js --presets=@babel/preset-env | uglifyjs --compress --mangle > library/media/app/js/autocomplete.min.js

# cleancss -O2 -o modules/site/xtsearchforalgolia/views/theme/xtdir4alg_autocomplete.min.css modules/site/xtsearchforalgolia/views/theme/xtdir4alg_autocomplete.css

npm run build
