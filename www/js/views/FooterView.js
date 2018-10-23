var FooterView = function(footer) {

  this.initialize = function() {
    this.$el = $('<div/>');
  };

  this.render = function() {
    this.$el.html(this.template(footer));
    return this;
  };

  this.initialize();

}