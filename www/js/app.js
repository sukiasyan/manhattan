// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

  /* ---------------------------------- Local Variables ---------------------------------- */
  HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
  // EmployeeListView.prototype.template = Handlebars.compile($("#employee-list-tpl").html());
  // EmployeeView.prototype.template = Handlebars.compile($("#employee-tpl").html());
  GalleryView.prototype.template = Handlebars.compile($("#gallery-tpl").html());
  WishlistView.prototype.template = Handlebars.compile($("#wishlist-tpl").html());
  FooterView.prototype.template = Handlebars.compile($("#footer-tpl").html());

  var service = new EmployeeService();
  var slider = new PageSlider($('body'));
  var footerTpl = Handlebars.compile($("#footer-tpl").html());

  service.initialize().done(function () {
    router.addRoute('', function() {
      console.log('empty');
      slider.slidePage(new HomeView(service).render().$el);
      $('.footer-bar').html(footerTpl());
    });

    // router.addRoute('employees/:id', function(id) {
    //   console.log('details');
    //   service.findById(parseInt(id)).done(function(employee) {
    //     slider.slidePage(new EmployeeView(employee).render().$el);
    //   });
    // });

    router.addRoute('gallery', function() {
      console.log('gallery');
      service.initialize().done(function (){
        slider.slidePage(new GalleryView().render().$el);
      });
    });
    router.addRoute('wishlist', function() {
      console.log('wishlist');
      service.initialize().done(function (){
        slider.slidePage(new WishlistView().render().$el);
      });
    });

    router.start();
  });

  /* --------------------------------- Event Registration -------------------------------- */
  document.addEventListener('deviceready', function () {
    if (app.device.ios) {
      window.FirebasePlugin.grantPermission();
    }
    FastClick.attach(document.body);
    if (navigator.notification) { // Override default HTML alert with native dialog
      window.alert = function (message) {
        navigator.notification.alert(
          message,    // message
          null,       // callback
          "Manhattan", // title
          'OK'        // buttonName
        );
      };
    }
  }, false);

  /* ---------------------------------- Local Functions ---------------------------------- */

}());