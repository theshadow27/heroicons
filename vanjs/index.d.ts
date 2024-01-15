import {ChildDom, Props, PropsWithKnownKeys} from "vanjs-core";
export interface HeroIconProps { title?: string; titleId?: string; size?: number | false;}
export type HeroIcon = (props?: HeroIconProps & Props & PropsWithKnownKeys<SVGElement>, ...children: ChildDom[]) => ChildDom;