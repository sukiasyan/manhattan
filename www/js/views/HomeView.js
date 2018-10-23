var HomeView = function (service) {

  // var employeeListView;
  var footerTpl = Handlebars.compile($("#footer-tpl").html());

  this.initialize = function() {
    this.$el = $('<div/>');
    this.$el.on('keyup', '.search-key', this.findByName);
    // employeeListView = new EmployeeListView();
    this.render();
  };

  this.render = function() {
    this.$el.html(this.template());
    // $('.content', this.$el).html(employeeListView.$el);
    $('.footer-bar').html(footerTpl());
    return this;
  };

  // this.findByName = function() {
  //   service.findByName($('.search-key').val()).done(function(employees) {
  //     employeeListView.setEmployees(employees);
  //   });
  // };

  this.initialize();
}