module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/styles/settings/mixins.scss";
        @import "~@/assets/styles/settings/variables.scss";
        @import "~@/assets/styles/settings/z-index.scss";`,
      },
    },
  },
};
