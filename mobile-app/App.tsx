import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { MarketplaceScreen } from './src/screens/MarketplaceScreen';
import { FarmerScreen } from './src/screens/FarmerScreen';
import { AgentScreen } from './src/screens/AgentScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'farmer' | 'agent' | 'analytics'>('marketplace');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Screen Render */}
      <View style={styles.content}>
        {activeTab === 'marketplace' && <MarketplaceScreen />}
        {activeTab === 'farmer' && <FarmerScreen />}
        {activeTab === 'agent' && <AgentScreen />}
        {activeTab === 'analytics' && <AnalyticsScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('marketplace')}
        >
          <Text style={styles.icon}>🛒</Text>
          <Text style={[styles.navText, activeTab === 'marketplace' && styles.navActive]}>
            Market
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('farmer')}
        >
          <Text style={styles.icon}>🌾</Text>
          <Text style={[styles.navText, activeTab === 'farmer' && styles.navActive]}>
            Farmer Hub
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('agent')}
        >
          <Text style={styles.icon}>🛡️</Text>
          <Text style={[styles.navText, activeTab === 'agent' && styles.navActive]}>
            Agent Verify
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={styles.icon}>📊</Text>
          <Text style={[styles.navText, activeTab === 'analytics' && styles.navActive]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: { alignItems: 'center' },
  icon: { fontSize: 18 },
  navText: { fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 2 },
  navActive: { color: '#16a34a', fontWeight: '800' }
});
