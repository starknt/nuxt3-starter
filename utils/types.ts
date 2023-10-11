export type Nullable<T> = T | null | undefined
export type RequireKeys<T extends object, K extends keyof T> =
  Required<Pick<T, K>> & Omit<T, K>
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T

// eslint-disable-next-line @typescript-eslint/ban-types
export function isInstanceof<T extends Function>(value: any, type: T): value is T {
  return value instanceof type
}

/* eslint-disable @typescript-eslint/ban-types */
export function assert(value: unknown, message?: string | Error) {
  if (!isUndefinedOrNull(value) && !value)
    console.error(message)
}

export function isString(obj: unknown): obj is string {
  return typeof obj === 'string'
}

export function isUndefined(obj: unknown): obj is undefined {
  return typeof obj === 'undefined'
}

export function isUndefinedOrNull(obj: unknown): obj is undefined | null {
  return isUndefined(obj) || obj === null
}

export function isFunction(obj: unknown): obj is Function {
  return typeof obj === 'function'
}

export function isDefined<T>(arg: T | undefined | null): arg is T {
  return !isUndefinedOrNull(arg)
}

export function assertType(condition: unknown, type?: string): asserts condition {
  if (!condition)
    throw new Error(type ? `Unexpected type, expected '${type}'` : 'Unexpected type')
}

/**
 * Asserts that the argument passed in is neither undefined nor null.
 * @param arg
 */
export function assertIsDefined<T>(arg: T | null | undefined) {
  if (isUndefinedOrNull(arg))
    throw new Error('Assertion Failed: argument is undefined or null')
  return arg
}

/**
 * Converts null to undefined, passes all other values through.
 * @param x
 */
export function withNullAsUndefined<T>(x: T | null): T | undefined {
  return x === null ? undefined : x
}

/**
 * Converts undefined to null, passes all other values through.
 * @param x
 */
export function withUndefinedAsNull<T>(x: T | undefined): T | null {
  return typeof x === 'undefined' ? null : x
}

export function isArray(obj: unknown): obj is unknown[] {
  return Array.isArray(obj)
}

/**
 * @param obj
 * @returns whether the provided parameter is of type `object` but **not**
 *  `null`, an `array`, a `regexp`, nor a `date`.
 */
export function isObject(obj: unknown): obj is Object {
  // The method can't do a type cast since there are type (like strings) which
  // are subclasses of any put not positvely matched by the function. Hence type
  // narrowing results in wrong results.
  return typeof obj === 'object'
    && obj !== null
    && !Array.isArray(obj)
    && !(obj instanceof RegExp)
    && !(obj instanceof Date)
}

const upperCaseRegex = /^[A-Z]$/
const lowerCaseRegex = /^[a-z]$/
const numberRegex = /^[0-9]$/
const symbolRegex = /^[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]$/

const defaultOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
}

function countChars(str: string) {
  const result: Record<string, number> = {}
  Array.from(str).forEach((char) => {
    const curVal = result[char]
    if (curVal)
      result[char] += 1

    else
      result[char] = 1
  })
  return result
}

/* Return information about a password */
function analyzePassword(password: string): Analysis {
  const charMap = countChars(password)
  const analysis: Analysis = {
    length: password.length,
    uniqueChars: Object.keys(charMap).length,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numberCount: 0,
    symbolCount: 0,
  }
  Object.keys(charMap).forEach((char) => {
    /* istanbul ignore else */
    if (upperCaseRegex.test(char))
      analysis.uppercaseCount += charMap[char]
    else if (lowerCaseRegex.test(char))
      analysis.lowercaseCount += charMap[char]
    else if (numberRegex.test(char))
      analysis.numberCount += charMap[char]
    else if (symbolRegex.test(char))
      analysis.symbolCount += charMap[char]
  })
  return analysis
}

interface Analysis {
  length: number
  uniqueChars: number
  uppercaseCount: number
  lowercaseCount: number
  numberCount: number
  symbolCount: number
}

function scorePassword(analysis: Analysis, scoringOptions = defaultOptions) {
  let points = 0
  points += analysis.uniqueChars * scoringOptions.pointsPerUnique
  points += (analysis.length - analysis.uniqueChars) * scoringOptions.pointsPerRepeat
  if (analysis.lowercaseCount > 0)
    points += scoringOptions.pointsForContainingLower
  if (analysis.uppercaseCount > 0)
    points += scoringOptions.pointsForContainingUpper
  if (analysis.numberCount > 0)
    points += scoringOptions.pointsForContainingNumber
  if (analysis.symbolCount > 0)
    points += scoringOptions.pointsForContainingSymbol
  return points
}

export function isStrongPassword(str: string, opts?: Partial<typeof defaultOptions>): boolean
export function isStrongPassword(str: string, returnScore: boolean, opts?: Partial<typeof defaultOptions>): number
export function isStrongPassword(str: string, returnScore?: boolean | Partial<typeof defaultOptions>, opts?: Partial<typeof defaultOptions>) {
  const analysis = analyzePassword(str)
  const options = typeof returnScore === 'object' ? Object.assign(defaultOptions, returnScore) : typeof opts === 'object' ? Object.assign(defaultOptions, opts) : defaultOptions
  if (typeof returnScore === 'boolean' && returnScore)
    return scorePassword(analysis, options)
  return analysis.length >= options.minLength
        && analysis.lowercaseCount >= options.minLowercase
        && analysis.uppercaseCount >= options.minUppercase
        && analysis.numberCount >= options.minNumbers
        && analysis.symbolCount >= options.minSymbols
}
