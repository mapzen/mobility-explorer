import Ember from 'ember';
import mapBboxRoute from 'mobility-playground/mixins/map-bbox-route';
import setLoading from 'mobility-playground/mixins/set-loading';

export default Ember.Route.extend(mapBboxRoute, setLoading, {
  queryParams: {
    onestop_id: {
      refreshModel: true
    },
    serves: {
      refreshModel: true
    },
    operated_by: {
      refreshModel: true
    },
    vehicle_type: {
      refreshModel: true
    },
    style_routes_by: {
      refreshModel: true
    }
  },
  setupController: function (controller, model) {
    if (controller.get('bbox') !== null){
      var coordinateArray = [];
      var bboxString = controller.get('bbox');
      var tempArray = [];
      var boundsArray = [];
      coordinateArray = bboxString.split(',');
      for (var i = 0; i < coordinateArray.length; i++){
        tempArray.push(parseFloat(coordinateArray[i]));
      }
      var arrayOne = [];
      var arrayTwo = [];
      arrayOne.push(tempArray[1]);
      arrayOne.push(tempArray[0]);
      arrayTwo.push(tempArray[3]);
      arrayTwo.push(tempArray[2]);
      boundsArray.push(arrayOne);
      boundsArray.push(arrayTwo);
      controller.set('leafletBbox', boundsArray);
    }
    this._super(controller, model);
  },
  model: function(params){
    this.store.unloadAll('data/transitland/operator');
    this.store.unloadAll('data/transitland/stop');
    this.store.unloadAll('data/transitland/route');
    this.store.unloadAll('data/transitland/route_stop_pattern'); 

    var routes = this.store.query('data/transitland/route', params);

    if (params.onestop_id){
      var url = 'https://transit.land/api/v1/stops.geojson?served_by=' + params.onestop_id;
      var stops = Ember.$.ajax({ url });
      return Ember.RSVP.hash({
        routes: routes,
        stops: stops
      });
    } else {
      return Ember.RSVP.hash({
        routes: routes,
      });
    }
  },
  actions: {
    
  }
});