export function h(): HastRoot
export function h(selector: null | undefined, ...children: HChild[]): HastRoot
export function h(
  selector: string,
  properties: HProperties,
  ...children: HChild[]
): HastElement
export function h(selector: string, ...children: HChild[]): HastElement
export function s(): HastRoot
export function s(selector: null | undefined, ...children: HChild[]): HastRoot
export function s(
  selector: string,
  properties: HProperties,
  ...children: HChild[]
): HastElement
export function s(selector: string, ...children: HChild[]): HastElement
export type HastRoot = import('hast').Root
export type HastElement = import('hast').Element
export type Properties = import('hast').Properties
export type HastChild = HastRoot['children'][number]
export type Info = import('property-information/lib/util/schema').Schema['property'][string]
export type Schema =
  | import('property-information/lib/util/schema').Schema
  | import('property-information/lib/util/schema').Schema
export type HStyleValue = string | number
export type HStyle = {
  [x: string]: HStyleValue
}
export type HPrimitiveValue = string | number | boolean | null | undefined
export type HArrayValue = Array<string | number>
export type HPropertyValue = HPrimitiveValue | (string | number)[]
export type HProperties = {
  [property: string]:
    | {
        [x: string]: HStyleValue
      }
    | HPropertyValue
}
export type HPrimitiveChild = string | number | null | undefined
export type HNodeChild = HastChild | HastRoot
export type HArrayChild = Array<HPrimitiveChild | HNodeChild>
export type HChild =
  | HPrimitiveChild
  | HNodeChild
  | (HPrimitiveChild | HNodeChild)[]
