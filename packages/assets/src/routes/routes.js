import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {routePrefix} from '@assets/config/app';
import DashBoard from '../pages/DashBoard';

// eslint-disable-next-line react/prop-types
const Routes = ({prefix = routePrefix}) => (
  <Switch>
    <Route path="/" component={DashBoard} />
    {/* <Route path="/embed/Samples" component={DashBoard} /> */}
  </Switch>
);

export default Routes;
