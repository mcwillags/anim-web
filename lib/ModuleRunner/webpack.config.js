// webpack.config.js
const path = require("path");
const fs = require("fs");

function removeExtension(fileName, extension) {
  return fileName.replace(extension, "");
}

function formatFullPath(path) {
  return path.replace("/\\/g", "/");
}

function isIndexFile(name) {
  return name === "index.ts";
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
        if (isIndexFile(module)) return;

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

const moduleRunnerEntryPoint = {
  ModuleRunner: path.join(__dirname, "src", "ModuleRunner", "ModuleRunner.ts"),
};

module.exports = {
  entry: {
    ...entryPoints,
    ...moduleRunnerEntryPoint,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "compiledModules"),
    library: {
      name: "[name]",
      type: "umd",
    },
    clean: true,
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "production", // Use 'production' for optimized bundles
};
