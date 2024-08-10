"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = void 0;
/**
 * The only differences between Next 10/11/12/13 is the import paths,
 * so this "factory" function allows us to abstract these dependencies.
 */
function factory(dependencies) {
    checkDependencies(dependencies);
    const { 
    //
    getSortedRoutes, getRouteMatcher, getRouteRegex, isDynamicRoute, normalizePagePath, } = dependencies;
    return function createDynamicRouteParser(paths) {
        const matchers = getSortedRoutes(paths.map((path) => normalizePagePath(path))).map((path) => ({
            pathname: path,
            match: getRouteMatcher(getRouteRegex(path)),
        }));
        return function parser(url) {
            const pathname = url.pathname;
            const isDynamic = isDynamicRoute(pathname);
            const matcher = matchers.find((matcher) => matcher.match(pathname));
            if (matcher) {
                // Update the route name:
                url.pathname = matcher.pathname;
                if (!isDynamic) {
                    // Extract the route variables from the path:
                    url.routeParams = matcher.match(pathname) || {};
                }
            }
        };
    };
}
exports.factory = factory;
/**
 * Check that all these dependencies are properly defined
 */
function checkDependencies(dependencies) {
    const missingDependencies = Object.keys(dependencies).filter((name) => {
        return !dependencies[name];
    });
    if (missingDependencies.length) {
        throw new Error(`next-router-mock/dynamic-routes: the following dependencies are missing: ${JSON.stringify(missingDependencies)}`);
    }
}
//# sourceMappingURL=createDynamicRouteParser.js.map