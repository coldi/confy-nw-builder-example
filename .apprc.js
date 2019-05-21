const fs = require('fs');
const NwBuilderPlugin = require('nw-builder-webpack-plugin');

console.log(process.argv);

const isApp = process.argv.includes('--build-app');

class ConfyCopyPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('ConfyCopyPlugin', (compilation, callback) => {
            const { srcDir, assetsDir, buildDir } = this.options;
            fs.copyFile(
                `${srcDir}/${assetsDir}/package.json`,
                `${buildDir}/package.json`,
                () => callback()
            );
        });
    }
}

module.exports = {
    presets: ['react', 'sass'],
    runners: config => ({
        webpack: {
            plugins: plugins => {
                if (!config.options.devMode && isApp) {
                    plugins.push(
                        new ConfyCopyPlugin(config.options),
                        new NwBuilderPlugin({
                            platforms: ['win32'],
                            version: '0.38.2',
                            files: './build/**/**',
                            buildDir: './app',
                            zip: false,
                        })
                    );
                }
                return plugins;
            },
        },
    }),
};
