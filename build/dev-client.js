/**
 * Created by Administrator on 2017/12/17.
 */
'use strict'
require('eventsource-polyfill');
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');

hotClient.subscribe(function (event) {
  if(event.action === 'reload'){
    window.location.reload();
  }
});
