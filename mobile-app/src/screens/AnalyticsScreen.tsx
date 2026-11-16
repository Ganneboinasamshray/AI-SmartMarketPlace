import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const MARKET_DATA = [
  { crop: 'Tomato', price: '₹28.50', trend: '▲ +2.8%', pred7d: '₹29.10', high: '₹34.00', low: '₹24.00' },
  { crop: 'Potato', price: '₹21.00', trend: '► Stable', pred7d: '₹21.20', high: '₹25.00', low: '₹18.00' },
  { crop: 'Onion', price: '₹26.00', trend: '▼ -1.5%', pred7d: '₹25.50', high: '₹35.00', low: '₹22.00' },
  { crop: 'Carrot', price: '₹31.50', trend: '▲ +1.2%', pred7d: '₹32.00', high: '₹38.00', low: '₹26.00' },
  { crop: 'Banana', price: '₹34.00', trend: '► Stable', pred7d: '₹34.50', high: '₹40.00', low: '₹28.00' },
  { crop: 'Wheat', price: '₹27.50', trend: '► Stable', pred7d: '₹27.80', high: '₹30.00', low: '₹25.00' }
];

export const AnalyticsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Intelligence & ML</Text>
        <Text style={styles.subtitle}>Wholesale Mandi Trends & Machine Learning Forecasts</Text>
      </View>

      <View style={styles.list}>
        {MARKET_DATA.map((item) => (
          <View key={item.crop} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.cropName}>{item.crop}</Text>
              <Text style={styles.price}>{item.price}<Text style={styles.perKg}>/kg</Text></Text>
            </View>

            <View style={styles.rowBottom}>
              <Text style={item.trend.includes('▲') ? styles.up : item.trend.includes('▼') ? styles.down : styles.stable}>
                {item.trend}
              </Text>
              <Text style={styles.mlForecast}>
                ML 7d: <Text style={styles.mlVal}>{item.pred7d}/kg</Text>
              </Text>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.stat}>30d Peak: {item.high}</Text>
              <Text style={styles.stat}>30d Low: {item.low}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  price: { fontSize: 18, fontWeight: '800', color: '#16a34a' },
  perKg: { fontSize: 11, fontWeight: '400', color: '#64748b' },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  up: { color: '#16a34a', fontSize: 12, fontWeight: '700' },
  down: { color: '#dc2626', fontSize: 12, fontWeight: '700' },
  stable: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  mlForecast: { fontSize: 12, color: '#475569' },
  mlVal: { fontWeight: '700', color: '#0f172a' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  stat: { fontSize: 11, color: '#94a3b8' }
});
