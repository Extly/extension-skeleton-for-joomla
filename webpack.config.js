/**
 * webpack.config.js
 *
 * @license   License GNU General Public License version 2 or later; see LICENSE.txt
 * @author    Andrea Gentil - Anibal Sanchez <team@extly.com>
 * @copyright (c)2012-2020 Extly, CB. All rights reserved.
 *
 */

// Array of Webpack plugins
let buildPlugins = [];

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

// Only template xml are processed,
//  other xml config files are ignored
const packageIgnoreFiles = ['config.xml'];

// WARNING - Clean these development folders before building
//  This is highly opinionated.
//  NEVER USE A FOLDER WITH THESE NAMES IN THE FINAL PACKAGE.
const globalCleanDevAssets = [
/*
  // Directories to be purged
  /\/\.git\//,
  /\/\.github\//,
  /\/\.phan\//,
  /\/\.vscode\//,
  /\/bin\//,
  /\/build\//,
  /\/demo\//,
  /\/doc\//,
  /\/docs\//,
  /\/Documentation\//,
  /\/examples\//,
  /\/ext\//,
  /\/nbproject\//,
  /\/node_modules\//,
  /\/style\//,

  // Files to be purged
  // Files ending with these extesion types
  /\.neon$/,
  /\.sh$/,
  /\.twig$/,
  /\.xlf$/,

  /\.coveralls\.yml$/,
  /\.editorconfig$/,
  /\.gitattributes$/,
  /\.gitignore$/,
  /\.hhconfig$/,
  /\.Mime$/,
  /\.php_cs\.dist$/,
  /\.php_cs$/,
  /\.scrutinizer\.yml$/,
  /\.State$/,
  /\.styleci\.yml$/,
  /\.travis\.yml$/,
  /AUTHORS$/,
  /behat\.yml$/,
  /build\.php$/,
  /build\.properties$/,
  /build\.xml$/,
  /CHANGELOG\.md$/,
  /CHANGELOG\.mdown$/,
  /CHANGELOG$/,
  /CHANGES$/,
  /circle\.yml$/,
  /CODE_OF_CONDUCT\.md$/,
  /CONDUCT\.md$/,
  /CONTRIBUTING\.md$/,
  /COPYING$/,
  /db\.sql$/,
  /docker-compose\.yml$/,
  /example\.php$/,
  /FastRoute\.hhi$/,
  /gulp-config\.ci\.json$/,
  /Makefile$/,
  /mkdocs\.yml$/,
  /package\.xml$/,
  /phpcs\.xml\.dist$/,
  /phpcs\.xml$/,
  /phpmd\.xml$/,
  /phpunit\.xml\.dist$/,
  /phpunit*\.xml$/,
  /psalm\.xml$/,
  /puli\.json$/,
  /README\.markdown$/,
  /readme\.md$/,
  /Readme\.md$/,
  /README\.md$/,
  /README\.rst$/,
  /ReadMe\.txt$/,
  /sonar-project\.properties$/,
  /UPGRADE_TO_2_1$/,
  /UPGRADE_TO_2_2$/,
  /Upgrade\.md$/,
  /UPGRADE\.md$/,
  /UPGRADE$/,
  /UPGRADING\.md$/,
  /VERSION$/,
*/
];

// Required Webpack plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const readDirRecursive = require('fs-readdir-recursive');
const ZipFilesPlugin = require('webpack-zip-files-plugin');

let definitions;
const releaseDate = moment()
  .format('YYYY-MM-DD');
const year = moment()
  .format('YYYY');
const releaseDir = 'build/release';
const releaseDirAbs = path.resolve(__dirname, releaseDir);
const templatesDir = 'build/templates';
const translationsDir = 'build/translations';
const packageDirAbs = path.resolve(__dirname, packageTypeDir);
const renderDirectories = [templatesDir, translationsDir];
const allExtensionTypesDirs = extensionTypesDirs.concat([packageTypeDir]);

const tagTransformation = (content) => content
  .toString()
  .replace(/\[MANIFEST_COPYRIGHT\]/g, definitions.MANIFEST_COPYRIGHT)
  .replace(/; \[TRANSLATION_COPYRIGHT\]/g, definitions.TRANSLATION_COPYRIGHT)
  .replace('// [PHP_COPYRIGHT]', definitions.PHP_COPYRIGHT)
  .replace('/* [CSS_COPYRIGHT] */', definitions.CSS_COPYRIGHT)
  .replace('// [JS_COPYRIGHT]', definitions.JS_COPYRIGHT)
  .replace(/\[COPYRIGHT\]/g, definitions.COPYRIGHT)
  .replace(/\[AUTHOR_EMAIL\]/g, definitions.AUTHOR_EMAIL)
  .replace(/\[AUTHOR_URL\]/g, definitions.AUTHOR_URL)
  .replace(/\[AUTHOR\]/g, definitions.AUTHOR)
  .replace(/\[EXTENSION_CDN\]/g, definitions.EXTENSION_CDN)
  .replace(/\[EXTENSION_CLASS_NAME\]/g, definitions.EXTENSION_CLASS_NAME)
  .replace(/\[EXTENSION_ALIAS\]/g, definitions.EXTENSION_ALIAS)
  .replace(/\[EXTENSION_DESC\]/g, definitions.EXTENSION_DESC)
  .replace(/\[EXTENSION_NAME\]/g, definitions.EXTENSION_NAME)
  .replace(/\[LICENSE_CODE\]/g, definitions.LICENSE_CODE)
  .replace(/\[LICENSE\]/g, definitions.LICENSE)
  .replace(/\[RELEASE_VERSION\]/g, definitions.RELEASE_VERSION)
  .replace(/\[TRANSLATION_KEY\]/g, definitions.TRANSLATION_KEY)
  .replace(/\[DATE\]/g, releaseDate)
  .replace(/\[YEAR\]/g, year);

function loadEnvironmentDefinitions() {
  const defs = {};

  const env = new Dotenv();
  Object.keys(env.definitions)
    .forEach((definition) => {
      const key = definition.replace('process.env.', '');
      let value = env.definitions[definition];

      value = value.replace(/^"(.+(?="$))"$/, '$1');
      value = value.replace(/%CR%/g, '\n');
      value = value.replace(/%TAB%/g, '\t');

      defs[key] = value;
    });

  return defs;
}

function removeReleaseDirectoryAndCleanDevAssets() {
  const cleanDevAssetsDirs = allExtensionTypesDirs.map(
      // Read all files
      (extensionTypesDir) => readDirRecursive(
        path.resolve(__dirname, extensionTypesDir),
      )
      // Resolve to the absolute path
      .map((file) => path.resolve(__dirname, extensionTypesDir + '/' + file))
    )
    // One flat array
    .flat()
    // Filter to files that match the globalCleanDevAssets to clean
    .filter((item) => {
      return globalCleanDevAssets.find((globalCleanDevFolder) => {
        return globalCleanDevFolder.test(item);
      });
    });

  return new FileManagerPlugin({
    onStart: {
      delete: [
        releaseDirAbs,
        ...cleanDevAssetsDirs
      ],
      mkdir: [
        releaseDirAbs,
      ],
    }
  });
}

function discoverTemplates(tplDirectory, extensionType) {
  return readDirRecursive(
    path.resolve(__dirname, `${tplDirectory}/${extensionType}`),
  );
}

function resolveExtensionTemplate(tplDirectory, extensionType) {
  return path.resolve(
    __dirname,
    `${tplDirectory}/${extensionType}`,
  );
}

function renderTemplates() {
  const renderTpls = [];

  // For templates and translation directories
  renderDirectories.forEach((tplDirectory) => {
    // For all extension types, including the package
    allExtensionTypesDirs.forEach((extensionType) => {
      const extTplDir = resolveExtensionTemplate(tplDirectory, extensionType);
      const templates = discoverTemplates(tplDirectory, extensionType);

      // For each template
      templates.forEach((file) => {
        const dest = path.resolve(__dirname, `${extensionType}/${file}`);
        const item = {
          context: extTplDir,
          from: file,
          to: dest,
          transform: tagTransformation,
        };

        // Render each template
        renderTpls.push(item);
      });
    });
  });

  return new CopyWebpackPlugin(renderTpls);
}

function isPackageType() {
  let packageMode = false;

  try {
    packageMode = fs.lstatSync(packageDirAbs)
      .isDirectory();
  } catch (e) {
    console.log('Package definition not detected.');
  }

  return packageMode;
}

function declarePackageGeneration() {
  // Include all files from the package directory
  const pkgFiles = readDirRecursive(packageDirAbs);

  // Discover extensions to be included
  const pkgEntries = pkgFiles.map((file) => {
    const packageFile = path.resolve(packageDirAbs, file);

    return {
      src: packageFile,
    };
  });

  const folders = new Map();

  // Add all extension types directories into the package
  extensionTypesDirs.forEach((extensionTypeDir) => {
    const extTemplates = readDirRecursive(
      path.resolve(__dirname, `${templatesDir}/${extensionTypeDir}`),
    );

    extTemplates.forEach((extTemplate) => {
      // Exclude discovered files that are not xml
      if (!extTemplate.endsWith('.xml')) {
        return null;
      }

      const extTemplateFile = path.parse(extTemplate)
        .base;

      // It is already included, continue with the rest of the files
      if (packageIgnoreFiles.includes(extTemplateFile)) {
        return;
      }

      // Prepare the folder to be included
      const srcFile = path.resolve(
        __dirname,
        `${extensionTypeDir}/${extTemplate}`,
      );
      const srcDir = path.dirname(srcFile);
      const distKey = path.basename(srcDir);

      const item = {
        src: srcDir,
        dist: distKey,
      };

      // Ignore if it has already been included
      if (!folders.has(srcDir)) {
        folders.set(srcDir, item);
      }
    });
  });

  // All discovered folders to be included
  pkgEntries.push(...folders.values());

  // Complete the definition of the zip file
  const outputFile = path.resolve(
    __dirname,
    `${releaseDir}/pkg_${definitions.EXTENSION_ALIAS}_v${definitions.RELEASE_VERSION}`,
  );

  const zipFile = {
    entries: pkgEntries,
    output: outputFile,
    format: 'zip',
  };

  return new ZipFilesPlugin(zipFile);
}

function declareZipsGeneration() {
  const zipDirectories = [templatesDir];
  const zipPlugins = [];

  // For each templates directory to be zipped
  zipDirectories.forEach((tplDirectory) => {
    // For all extension types
    extensionTypesDirs.forEach((extensionType) => {
      const extZipDir = resolveExtensionTemplate(tplDirectory, extensionType);
      const templates = discoverTemplates(tplDirectory, extensionType);

      // For each template
      templates.forEach((tplFile) => {
        const srcFile = path.resolve(__dirname, `${extensionType}/${tplFile}`);
        const srcDir = path.dirname(srcFile);
        const extname = path.extname(srcFile);

        if (extname !== '.xml') return;

        const manifestTplFile = `${extZipDir}/${tplFile}`;
        const extensionTplDir = path.dirname(manifestTplFile);
        const parts = extensionTplDir.split('/');
        const extElement = parts.pop();

        let renamedExtElement = extElement;

        // The component must be renamed to the extension alias
        if (renamedExtElement === 'component') {
          renamedExtElement = definitions.EXTENSION_ALIAS;

          // The file extension goes to the cli
        } else if (renamedExtElement === 'file') {
          renamedExtElement = 'cli';
        }

        const outputFile = path.resolve(
          __dirname,
          `${releaseDir}/${renamedExtElement}_v${definitions.RELEASE_VERSION}`,
        );

        const zipFile = {
          entries: [{
            src: srcDir,
            dist: extElement,
          }],
          output: outputFile,
          format: 'zip',
        };

        // Define the zip
        const itemZip = new ZipFilesPlugin(zipFile);
        zipPlugins.push(itemZip);
      });
    });
  });

  return zipPlugins;
}

// Let's build something

// Global constant definitions (.env)
definitions = loadEnvironmentDefinitions();

// Start clean
buildPlugins.push(removeReleaseDirectoryAndCleanDevAssets());

// Render the manifests and translations
buildPlugins.push(renderTemplates());

if (isPackageType()) {
  // Define the package generation
  buildPlugins.push(declarePackageGeneration());
} else {
  // Just define the zips with everything
  buildPlugins = buildPlugins.concat(declareZipsGeneration());
}

// We are ready, Webpack generate!
module.exports = {
  entry: './.gitkeep',
  output: {
    filename: '.gitkeep',
    path: path.resolve(__dirname, releaseDir),
  },

  plugins: buildPlugins,
};
