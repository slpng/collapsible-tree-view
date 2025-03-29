import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default () => {
    return {
        entry: "./src/index.tsx",
        output: {
            filename: "bundle.[contenthash].js",
            path: path.resolve(__dirname, "dist"),
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            compilerOptions: {
                                noEmit: false,
                            },
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    auto: true,
                                },
                            },
                        },
                        "sass-loader",
                    ],
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"],
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
            }),
        ],
        devServer: {
            static: path.join(__dirname, "dist"),
            compress: true,
            port: 3000,
            hot: true,
        },
    };
};
