let proxy = new Proxy(
  {},
  {
    get: (obj, property) => {
      if (property === '__esModule') {
        return {}
      }

      throw new Error(
        `You\'re trying to import \`@heroicons/vanjs/outline/${property}\`, but this was never implemented in Heroicons V1. Please use V2 syntax, and import from \`@heroicons/vanjs/24/outline\` instead`
      )
    },
  }
)

module.exports = proxy
