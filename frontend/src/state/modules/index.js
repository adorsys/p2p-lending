import camelCase from 'lodash/camelCase'

// get .js files in modules folder
const requireModule = require.context('.', false, /\.js$/)
const modules = {}

requireModule.keys().forEach((fileName) => {
  if (fileName === './index.js') return
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''))

  modules[moduleName] = requireModule(fileName).default
})

export default modules
