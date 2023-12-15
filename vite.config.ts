import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import loadVersion from "vite-plugin-package-version";
import { VitePWA } from "vite-plugin-pwa";
import checker from "vite-plugin-checker";
import path from "path";
import { handlebars } from "./plugins/handlebars";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      handlebars({
        vars: {
          opensearchEnabled: env.VITE_OPENSEARCH_ENABLED === "true",
          routeDomain:
            env.VITE_APP_DOMAIN +
            (env.VITE_NORMAL_ROUTER !== "true" ? "/#" : ""),
          domain: env.VITE_APP_DOMAIN,
          env
        }
      }),
      react({
        babel: {
          presets: [
            "@babel/preset-typescript",
            [
              "@babel/preset-env",
              {
                modules: false,
                useBuiltIns: "entry",
                corejs: {
                  version: "3.29"
                }
              }
            ]
          ]
        }
      }),
      VitePWA({
        disable: env.VITE_PWA_ENABLED !== "true",
        registerType: "autoUpdate",
        workbox: {
          maximumFileSizeToCacheInBytes: 4000000, // 4mb
          globIgnores: ["**ping.txt**"]
        },
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "safari-pinned-tab.svg"
        ],
        manifest: {
          name: "movie-web",
          short_name: "movie-web",
          description: "The place for your favourite movies & shows",
          theme_color: "#120f1d",
          background_color: "#120f1d",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        }
      }),
      loadVersion(),
      checker({
        overlay: {
          position: "tr"
        },
        typescript: true, // check typescript build errors in dev server
        eslint: {
          // check lint errors in dev server
          lintCommand: "eslint --ext .tsx,.ts src",
          dev: {
            logLevel: ["error"]
          }
        }
      })
    ],

    build: {
      sourcemap: true,
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@sozialhelden/ietf-language-tags": path.resolve(
          __dirname,
          "./node_modules/@sozialhelden/ietf-language-tags/dist/cjs"
        )
      }
    },

    test: {
      environment: "jsdom"
    }
  };
});
