import * as tsConfigPaths from "tsconfig-paths"
import { resolve as resolveTs } from "ts-node/esm"
import { pathToFileURL } from "url"

function resolverFactory(resolveTs) {
  return function (specifier, ctx, defaultResolve) {
    let matchPath
    try {
      const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
      matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)
    } catch (e) {
      // We get an error here if no paths are in the config file.
      if (e.toString() !== "TypeError: Cannot convert undefined or null to object")
        // Other error, so throw it.
        throw e
    }
    const match = matchPath && matchPath(specifier)

    return match
      ? resolveTs(pathToFileURL(`${match}`).href, ctx, defaultResolve)
      : resolveTs(specifier, ctx, defaultResolve)
  }
}

export const resolve = resolverFactory(resolveTs)
export { getFormat, load, transformSource } from "ts-node/esm"
