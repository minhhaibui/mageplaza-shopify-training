import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {useHistory, useLocation} from 'react-router-dom';
import {NavigationMenu, Provider} from '@shopify/app-bridge-react';
import getUrl from '../../helpers/getUrl';

const AppBridgeProvider = ({children}) => {
  const host = new URL(window.location).searchParams.get('host');
  const {push} = useHistory();
  const location = useLocation();
  const history = useMemo(() => ({replace: path => push(path, {replace: true})}), [push]);
  const router = useMemo(
    () => ({
      location,
      history
    }),
    [location, history]
  );

  return (
    <Provider
      config={{
        apiKey: process.env.SHOPIFY_API_KEY,
        host,
        forceRedirect: true
      }}
      router={router}
    >
      <NavigationMenu
        matcher={(link, location) => {
          return (
            getUrl(link.destination) === location.pathname ||
            location.pathname.startsWith(getUrl(link.destination))
          );
        }}
        navigationLinks={[
          {
            label: 'DashBoard',
            destination: '/embed/dashBoard'
          },
          {
            label: 'Samples',
            destination: '/embed/samples'
          }
        ]}
      />
      {children}
    </Provider>
  );
};

AppBridgeProvider.propTypes = {
  children: PropTypes.any
};

export default AppBridgeProvider;
