let proxy = new Proxy(
  {},
  {
    get: (obj, property) => {
      if (property === '__esModule') {
        return {}
      }

      throw new Error(
        `You\'re trying to import \`@heroicons/vanjs/solid/${property}\`, but this was never implemented in Heroicons V1. Please use V2 syntax, and import from either \`@heroicons/vanjs/16/solid\`, \`@heroicons/vanjs/20/solid\`, or \`@heroicons/vanjs/24/solid\` instead`
      )
    },
  }
)

module.exports = proxy
