// Models
window.Wine = Backbone.Model.extend();
 
//Indicates the nature of the collection. 
window.WineCollection = Backbone.Collection.extend({
    model:Wine,
    url:"/api/wines"
});
 
// Views
//Iterate through the collection, instantiate a WineListItemView for each wine an adds it to #wineList
window.WineListView = Backbone.View.extend({
 
    tagName:'ul',
 
    initialize:function () {
        this.model.bind("reset", this.render, this);
    },
 
    render:function (eventName) {
        _.each(this.model.models, function (wine) {
            $(this.el).append(new WineListItemView({model:wine}).render().el);
        }, this);
        return this;
    }
 
});

//merges the model data into #wine-list-item template. By defining a separate view for list items, you can easily update a specific item without rendering the entire list
window.WineListItemView = Backbone.View.extend({
 
    tagName:"li",
 
    template:_.template($('#tpl-wine-list-item').html()),
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
 
});
//The view responsible for displaying the wine details. Render() merges the model data into "wine-details" template
window.WineView = Backbone.View.extend({
 
    template:_.template($('#tpl-wine-details').html()),
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
 
});
 
//AppRouter provides entry points through deep-linkable URLS. Default route "" displays the list of win. "wines/:id" route displays the details of a wine
var AppRouter = Backbone.Router.extend({
 
    routes:{
        "":"list",
        "wines/:id":"wineDetails"
    },
 
    list:function () {
        this.wineList = new WineCollection();
        this.wineListView = new WineListView({model:this.wineList});
        this.wineList.fetch();
        $('#sidebar').html(this.wineListView.render().el);
    },
 
    wineDetails:function (id) {
        this.wine = this.wineList.get(id);
        this.wineView = new WineView({model:this.wine});
        $('#content').html(this.wineView.render().el);
    }
});
 
var app = new AppRouter();
Backbone.history.start();