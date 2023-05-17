import esbuild from "esbuild"
import reset from "esbuild-plugin-output-reset"
import env from "esbuild-plugin-env"
import external from "esbuild-plugin-external-package"

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: "dist",
    logLevel: "info",
    minify: true,
    plugins: [reset, external, env()],
  })
  .catch(() => process.exit(1))
