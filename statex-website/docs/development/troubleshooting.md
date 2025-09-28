Linter error: "Object is possibly 'undefined'", it is likely a false positive due to the explicit fallback and type checks.
You can safely add a // @ts-expect-error or // @ts-ignore comment above the line if you are certain the object is always defined due to your checks.
