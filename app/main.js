import Vue from 'nativescript-vue';

import Home from './components/Home';

import store from './store';

import './styles.scss';

import firebase from 'nativescript-plugin-firebase';

firebase
  .init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
  })
  .then(
    instance => {
      console.log('firebase.init done');
    },
    error => {
      console.log(`firebase.init error: ${error}`);
    }
  );

//alerts

import { TNSFontIcon, fonticon } from 'nativescript-fonticon';

//TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  fa: './assets/font-awesome.css',
};
TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);

Vue.registerElement('SwipeLayout', () => require('nativescript-swipe-layout').SwipeLayout);
Vue.registerElement('CardView', () => require('nativescript-cardview').CardView);
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);

Vue.prototype.$firebase = firebase;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === 'production';

new Vue({
  render: h => h('frame', [h(Home)]),

  store,
}).$start();
