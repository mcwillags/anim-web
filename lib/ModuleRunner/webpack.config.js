// webpack.config.js
const path = require("path");
const fs = require("fs");

function removeExtension(fileName, extension) {
  return fileName.replace(extension, "");
}

function formatFullPath(path) {
  return path.replace("/\\/g", "/");
}

// Utility function to find the entry file for each module directory
function getEntriesFromDirectory(dir, extension = ".ts") {
  const entries = {};

  fs.readdirSync(dir).forEach((moduleDir) => {
    const fullModuleDirPath = path.join(dir, moduleDir);

    fs.readdirSync(fullModuleDirPath).forEach((module) => {
      const fullModulePath = path.join(fullModuleDirPath, module);
      const moduleStat = fs.statSync(fullModulePath);

      if (moduleStat.isFile()) {
        entries[removeExtension(module, extension)] =
          formatFullPath(fullModulePath);

        return;
      }

      if (moduleStat.isDirectory()) {
        const filesInDirectory = fs.readdirSync(fullModulePath);

        const mainFile = filesInDirectory.find(
          (file) =>
            path.extname(file) === extension &&
            !fs.statSync(path.join(fullModulePath, file)).isDirectory(),
        );

        if (mainFile) {
          const entryPath = formatFullPath(
            path.join(fullModuleDirPath, module, mainFile),
          );

          entries[removeExtension(mainFile, extension)] = entryPath;
        }
      }
    });
  });

  return entries;
}

// Set up entry points by scanning the `modules` directory
const entryPoints = getEntriesFromDirectory(
  path.resolve(path.join(__dirname, "src", "modules")),
);

module.exports = {
  entry: entryPoints, // Use the dynamically generated entries
  output: {
    filename: "[name].js", // Keep the same structure and use .js extension for output files
    path: path.resolve(__dirname, "compiledModules"), // Output directory
    library: {
      name: "[name]",
      type: "umd", // Export each module in UMD format
    },
    clean: true, // Clean the output directory before building
  },
  resolve: {
    extensions: [".ts"], // Extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Match .ts files
        use: "ts-loader",
        exclude: /node_modules/, // Exclude dependencies
      },
    ],
  },
  mode: "production", // Use 'production' for optimized bundles
};
