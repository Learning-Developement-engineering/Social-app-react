import { ReactNode } from 'react';

declare function flattenChildren(children: ReactNode, depth?: number, keys?: (string | number)[]): ReactNode[];

export { flattenChildren as default };
