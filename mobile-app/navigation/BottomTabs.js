import React from 'react';

import { createBottomTabNavigator }
from '@react-navigation/bottom-tabs';

import DashboardScreen
from '../screens/DashboardScreen';

import ProfileScreen
from '../screens/ProfileScreen';

import SettingsScreen
from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

  return (

    <Tab.Navigator>

      <Tab.Screen
        name="Home"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />

    </Tab.Navigator>

  );

}