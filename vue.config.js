module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/styles/settings/mixins.scss";`,
      },
    },
  },
};
