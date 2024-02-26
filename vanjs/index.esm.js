// The only reason this file exists is to appease Vite's optimizeDeps feature which requires a root-level import.

export default new Proxy(
  {},
  {
    get: (_, property) => {
      if (property === '__esModule') {
        return {}
      }

      throw new Error(
        `Importing from \`@theshadow27/heroicons-vanjs\` directly is not supported. Please import from either \`@theshadow27/heroicons-vanjs/16/solid\`, \`@theshadow27/heroicons-vanjs/20/solid\`, \`@theshadow27/heroicons-vanjs/24/solid\`, or \`@theshadow27/heroicons-vanjs/24/outline\` instead.`
      )
    },
  }
)
