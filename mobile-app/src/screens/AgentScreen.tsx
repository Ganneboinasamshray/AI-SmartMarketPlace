import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';

export const AgentScreen = () => {
  const [requests, setRequests] = useState([
    { id: '1', name: 'Suresh Yadav', farm: 'Yadav Family Farms', location: 'Sonipat, Haryana', acres: 12, crops: 'Cauliflower, Cabbage', status: 'PENDING' },
    { id: '2', name: 'Manoj Kumar', farm: 'Manoj Brokerage', location: 'Azadpur Yard, Delhi', acres: 0, crops: 'Trader Reseller', status: 'PENDING' }
  ]);

  const verifyApplicant = (id: string, name: string, isApproval: boolean) => {
    if (isApproval) {
      Alert.alert(
        'Confirm Approval',
        `Approve ${name} as genuine cultivating farmer based on field visit and land deed checks?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Approve Farmer', 
            onPress: () => {
              setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
              Alert.alert('Approved', `${name} can now sell directly on the marketplace.`);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Middleman Exclusion',
        `Reject ${name} and flag as commercial middleman? This permanently blocks marketplace selling.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reject Middleman', 
            style: 'destructive',
            onPress: () => {
              setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
              Alert.alert('Flagged', `${name} flagged as trader middleman. Seller access denied.`);
            }
          }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Field Agent Verification</Text>
        <Text style={styles.subtitle}>Agent: Vikram Rathore (AGT-NCR-101)</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🛡️ Middleman Prevention Protocol</Text>
        <Text style={styles.infoText}>
          Perform physical field checks to confirm actual cultivation before granting seller marketplace access.
        </Text>
      </View>

      <View style={styles.list}>
        {requests.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.farmerName}>{r.name}</Text>
              <Text style={r.status === 'APPROVED' ? styles.tagApp : r.status === 'REJECTED' ? styles.tagRej : styles.tagPend}>
                {r.status}
              </Text>
            </View>

            <Text style={styles.farmName}>{r.farm}</Text>
            <Text style={styles.meta}>📍 {r.location} • {r.acres} Acres</Text>
            <Text style={styles.meta}>🌾 Crops: {r.crops}</Text>

            {r.status === 'PENDING' && (
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.rejBtn}
                  onPress={() => verifyApplicant(r.id, r.name, false)}
                >
                  <Text style={styles.rejBtnText}>Flag Middleman</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.appBtn}
                  onPress={() => verifyApplicant(r.id, r.name, true)}
                >
                  <Text style={styles.appBtnText}>Approve Farmer</Text>
                </TouchableOpacity>
              </View>
            )}
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
  infoBox: { margin: 16, padding: 14, backgroundColor: '#eff6ff', borderRadius: 14, borderWidth: 1, borderColor: '#bfdbfe' },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#1e40af' },
  infoText: { fontSize: 12, color: '#1e3a8a', marginTop: 4, lineHeight: 17 },
  list: { paddingHorizontal: 16, gap: 14 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  farmerName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  tagPend: { backgroundColor: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagApp: { backgroundColor: '#dcfce7', color: '#166534', fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagRej: { backgroundColor: '#fee2e2', color: '#991b1b', fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  farmName: { fontSize: 13, fontWeight: '600', color: '#475569', marginTop: 4 },
  meta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  rejBtn: { flex: 1, padding: 10, backgroundColor: '#fee2e2', borderRadius: 10, alignItems: 'center' },
  rejBtnText: { color: '#991b1b', fontSize: 12, fontWeight: '700' },
  appBtn: { flex: 1, padding: 10, backgroundColor: '#16a34a', borderRadius: 10, alignItems: 'center' },
  appBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' }
});
