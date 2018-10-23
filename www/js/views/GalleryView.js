var GalleryView = function(galery) {

  this.initialize = function() {
    this.$el = $('<div/><script src="../js/firestore_2.js" type="text/javascript"></script>');
  };

  this.render = function() {
    this.$el.html(this.template(galery));
    return this;
  };

  this.initialize();

}

