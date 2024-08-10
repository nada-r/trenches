import type { NextComponentType, NextPageContext } from "next";
import type { BaseContext } from "next/dist/shared/lib/utils";
import type { NextRouter } from "next/router";
import type { MemoryRouterSnapshot } from "./MemoryRouter";
export type WithRouterProps = {
    router: NextRouter;
};
export type ExcludeRouterProps<P> = Pick<P, Exclude<keyof P, keyof WithRouterProps>>;
export declare function withMemoryRouter<P extends WithRouterProps, C extends BaseContext = NextPageContext>(useRouter: () => MemoryRouterSnapshot, ComposedComponent: NextComponentType<C, any, P>): NextComponentType<C, any, ExcludeRouterProps<P>>;
