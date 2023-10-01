import ModuleAlias from 'module-alias'

ModuleAlias.addAliases({
  '@vscommerce': `${__dirname}/@vscommerce`,
  '@config': `${__dirname}/config`,
  '@controllers': `${__dirname}/controllers`,
  '@database': `${__dirname}/database`,
  '@jobs': `${__dirname}/jobs`,
  '@middlewares': `${__dirname}/middlewares`,
  '@routes': `${__dirname}/routes`,
  '@utils': `${__dirname}/utils`,
  '@views': `${__dirname}/views`,
})
