import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';

export const FarmerScreen = () => {
  const [status, setStatus] = useState<'APPROVED' | 'PENDING'>('APPROVED');

  const openMLAdvisor = () => {
    Alert.alert(
      '🤖 Machine Learning Price Advisor',
      'Tomato (Azadpur Mandi)\n\n• Current Mandi Benchmark: ₹28.50/kg\n• 7-Day Predicted Fair Price: ₹29.10/kg\n• Trend: Increasing 📈 (+2.8%)\n• Recommended Pricing Bracket: ₹27.30 - ₹31.40/kg\n\nOptimal pricing ensures high farmer earnings while attracting bulk buyers with zero middleman commission.',
      [{ text: 'Close' }, { text: 'Apply Recommended ₹29/kg', onPress: () => Alert.alert('Saved', 'Applied ₹29.00/kg to your active listing!') }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Farmer Control Hub</Text>
        <Text style={styles.subtitle}>Green Valley Agro • Kolar, Karnataka</Text>
      </View>

      {/* Verification Card */}
      <View style={styles.verifCard}>
        <Text style={styles.verifTitle}>Verification Status</Text>
        <View style={styles.verifRow}>
          <Text style={status === 'APPROVED' ? styles.statusApproved : styles.statusPending}>
            {status === 'APPROVED' ? '✓ Physical Farm Verified' : '⏳ Field Agent Visit Pending'}
          </Text>
        </View>
        <Text style={styles.verifDesc}>
          {status === 'APPROVED'
            ? 'Field Agent Vikram Rathore verified your 8.5 acres cultivated farm. You have full selling privileges.'
            : 'Agent assigned for physical inspection of land patta deed and crop cultivation.'}
        </Text>
      </View>

      {/* ML Smart Price Advisor Banner */}
      <View style={styles.mlCard}>
        <Text style={styles.mlTag}>ML PRICE FORECASTING</Text>
        <Text style={styles.mlTitle}>Smart Market Price Advisor</Text>
        <Text style={styles.mlDesc}>
          Query real-time Random Forest & XGBoost price predictions across mandis before publishing your rates.
        </Text>
        <TouchableOpacity style={styles.mlBtn} onPress={openMLAdvisor}>
          <Text style={styles.mlBtnText}>Check Tomato ML Guidance →</Text>
        </TouchableOpacity>
      </View>

      {/* My Listings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Active Listings</Text>
        
        <View style={styles.itemRow}>
          <View>
            <Text style={styles.itemName}>Tomato (Hybrid Roma)</Text>
            <Text style={styles.itemMeta}>Stock: 2,400 kg • Grade A</Text>
          </View>
          <Text style={styles.itemPrice}>₹28.00/kg</Text>
        </View>

        <View style={styles.itemRow}>
          <View>
            <Text style={styles.itemName}>Potato (Jyoti Golden)</Text>
            <Text style={styles.itemMeta}>Stock: 5,000 kg • Grade A</Text>
          </View>
          <Text style={styles.itemPrice}>₹21.00/kg</Text>
        </View>

        <View style={styles.itemRow}>
          <View>
            <Text style={styles.itemName}>Carrot (Ooty Sweet)</Text>
            <Text style={styles.itemMeta}>Stock: 1,200 kg • Organic</Text>
          </View>
          <Text style={styles.itemPrice}>₹32.00/kg</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  verifCard: { margin: 16, padding: 18, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#cbd5e1' },
  verifTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  verifRow: { marginTop: 6 },
  statusApproved: { backgroundColor: '#dcfce7', color: '#166534', fontWeight: '700', fontSize: 13, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  statusPending: { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '700', fontSize: 13, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  verifDesc: { fontSize: 12, color: '#475569', marginTop: 8, lineHeight: 18 },
  mlCard: { marginHorizontal: 16, padding: 20, backgroundColor: '#064e3b', borderRadius: 18 },
  mlTag: { color: '#6ee7b7', fontSize: 11, fontWeight: '800' },
  mlTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  mlDesc: { color: '#d1fae5', fontSize: 12, marginTop: 4, lineHeight: 18 },
  mlBtn: { marginTop: 14, backgroundColor: '#10b981', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, alignSelf: 'flex-start' },
  mlBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  section: { margin: 16, backgroundColor: '#fff', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  itemMeta: { fontSize: 11, color: '#64748b', marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: '#16a34a' }
});
