/**
 * Command line helper
 *
 * To get the complete functional media folder please run:
 * npm ci
 *
 * For dedicated tasks, please run:
 *
 * node build.js --compile-all      will create the extension distribution file
 *
 */

const { Command } = require('commander');
const semver = require('semver');

// Extension directories to be visited
const packageTypeDir = 'package';
const extensionTypesDirs = [
  'component',
  'modules',
  'plugins',
  'file',
  'template',
  'library',
  'platform',
];

// The settings
const options = require('../package.json');

// const { createErrorPages } = require('./build-modules-js/error-pages.es6.js');
// const { stylesheets } = require('./build-modules-js/compilecss.es6.js');
// const { scripts } = require('./build-modules-js/compilejs.es6.js');
// const { bootstrapJs } = require('./build-modules-js/javascript/build-bootstrap-js.es6.js');
// const { localisePackages } = require('./build-modules-js/init/localise-packages.es6.js');
// const { minifyVendor } = require('./build-modules-js/init/minify-vendor.es6.js');
// const { patchPackages } = require('./build-modules-js/init/patches.es6.js');
// const { cleanVendors } = require('./build-modules-js/init/cleanup-media.es6.js');
// const { recreateMediaFolder } = require('./build-modules-js/init/recreate-media.es6');
// const { watching } = require('./build-modules-js/watch.es6.js');
// const { mediaManager, watchMediaManager } = require('./build-modules-js/javascript/build-com_media-js.es6');
// const { compressFiles } = require('./build-modules-js/compress.es6.js');
// const { versioning } = require('./build-modules-js/versioning.es6.js');
// const { Timer } = require('./build-modules-js/utils/timer.es6.js');
// const settings = require('./build-modules-js/settings.json');

// The command line
const Program = new Command();

const handleError = (err, terminateCode) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(terminateCode);
};

const allowedVersion = () => {
  if (!semver.satisfies(process.version.substring(1), options.engines.node)) {
    handleError(`Command line tools require Node Version ${options.engines.node} but found ${process.version}`, -1);
  }
};

// Initialize the CLI
Program
  .version(options.version)
  .option('--compile-all', 'Create the extension distribution file')
  .addHelpText('after', `
Version: ${options.version}
`);

Program.parse(process.argv);

const cliOptions = Program.opts();

if (cliOptions.compileAll) {
  allowedVersion();
  // eslint-disable-next-line no-console
  console.error('Build!');
}

/*
// Update the vendor folder
if (cliOptions.copyAssets) {
  allowedVersion();
  recreateMediaFolder(options)
    .then(() => cleanVendors())
    .then(() => localisePackages(options))
    .then(() => patchPackages(options))
    .then(() => minifyVendor())
    .then(() => {
      process.exit(0);
    })
    .catch((error) => handleError(error, 1));
}

// Creates the error pages for unsupported PHP version & incomplete environment
if (cliOptions.buildPages) {
  createErrorPages(options)
    .catch((err) => handleError(err, 1));
}

// Convert scss to css
if (cliOptions.compileCss) {
  stylesheets(options, Program.args[0])
    .catch((err) => handleError(err, 1));
}

// Compress/transpile the javascript files
if (cliOptions.compileJs) {
  scripts(options, Program.args[0])
    .catch((err) => handleError(err, 1));
}

// Compress/transpile the javascript files
if (cliOptions.watch) {
  watching(Program.args[0]);
}

// Gzip js/css files
if (cliOptions.compileBs) {
  bootstrapJs();
}

// Gzip js/css files
if (cliOptions.gzip) {
  compressFiles();
}

// Compile the media manager
if (cliOptions.comMedia) {
  // false indicates "no watch"
  mediaManager(false);
}

// Watch & Compile the media manager
if (cliOptions.watchComMedia) {
  watchMediaManager(true);
}

// Update the .js/.css versions
if (cliOptions.versioning) {
  versioning()
    .catch((err) => handleError(err, 1));
}

// Prepare the repo for dev work
if (cliOptions.prepare) {
  const bench = new Timer('Build');
  allowedVersion();
  recreateMediaFolder(options)
    .then(() => cleanVendors())
    .then(() => localisePackages(options))
    .then(() => patchPackages(options))
    .then(() => Promise.all(
      [
        minifyVendor(),
        createErrorPages(options),
        stylesheets(options, Program.args[0]),
        scripts(options, Program.args[0]),
        bootstrapJs(),
        mediaManager(true),
      ],
    ))
    .then(() => bench.stop('Build'))
    .then(() => { process.exit(0); })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(-1);
    });
}
*/
