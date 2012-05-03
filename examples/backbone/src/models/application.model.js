var ApplicationModel = Backbone.Model.extend({
    
    defaults: {
        "number": ApplicationModel.DEFAULT_NUMBER
    }
     
});

ApplicationModel.DEFAULT_NUMBER = 1337;