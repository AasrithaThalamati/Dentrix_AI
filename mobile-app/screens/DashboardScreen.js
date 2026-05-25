import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
<Button
  title="Logout"
  onPress={() => navigation.navigate('Login')}
/>

export default function DashboardScreen() {

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.heading}>
        Dentrix AI Dashboard
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Total Patients
        </Text>

        <Text style={styles.cardValue}>
          120
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          AI Analyses
        </Text>

        <Text style={styles.cardValue}>
          342
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Reports Generated
        </Text>

        <Text style={styles.cardValue}>
          89
        </Text>
      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 18,
    color: '#666',
  },

  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },

});
