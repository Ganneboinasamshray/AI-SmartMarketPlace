import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Linking, 
  Alert 
} from 'react-native';

const CROPS = [
  {
    id: '1',
    name: 'Tomato (Hybrid Roma)',
    farmer: 'Ramesh Patel',
    phone: '+919733344455',
    verified: true,
    price: 28,
    stock: '2,400 kg',
    location: 'Kolar, Karnataka',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'
  },
  {
    id: '2',
    name: 'Potato (Jyoti Golden)',
    farmer: 'Ramesh Patel',
    phone: '+919733344455',
    verified: true,
    price: 21,
    stock: '5,000 kg',
    location: 'Kolar, Karnataka',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'
  },
  {
    id: '3',
    name: 'Nashik Red Onion',
    farmer: 'Balu Shinde',
    phone: '+919422233119',
    verified: true,
    price: 26,
    stock: '6,200 kg',
    location: 'Lasalgaon, Maharashtra',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400'
  }
];

export const MarketplaceScreen = () => {
  const [search, setSearch] = useState('');

  const callFarmer = (phone: string, farmer: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const buyDirect = (crop: string, price: number) => {
    Alert.alert(
      'Direct Farm Order',
      `Place bulk order for ${crop} at ₹${price}/kg directly with farmer with zero middleman fee?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Order', onPress: () => Alert.alert('Success', 'Order placed! Farmer will contact you for dispatch.') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTag}>100% Agent Verified Farmers</Text>
        <Text style={styles.bannerTitle}>Direct Farm Marketplace</Text>
        <Text style={styles.bannerSub}>Buy farm fresh produce directly. Zero middlemen markups.</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search vegetables, fruits, grains..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Produce Cards */}
      <View style={styles.list}>
        {CROPS.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.verifiedRow}>
                <Text style={styles.verifiedBadge}>✓ Verified Farmer</Text>
                <Text style={styles.price}>₹{item.price}<Text style={styles.perKg}>/kg</Text></Text>
              </View>

              <Text style={styles.cropTitle}>{item.name}</Text>
              <Text style={styles.farmerInfo}>Farmer: {item.farmer} • {item.location}</Text>
              <Text style={styles.stock}>Available Harvest: {item.stock}</Text>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => callFarmer(item.phone, item.farmer)}
                >
                  <Text style={styles.callBtnText}>📞 Call Farmer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => buyDirect(item.name, item.price)}
                >
                  <Text style={styles.buyBtnText}>Direct Buy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  banner: { backgroundColor: '#14532d', padding: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  bannerTag: { color: '#86efac', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4 },
  bannerSub: { color: '#dcfce7', fontSize: 13, marginTop: 4 },
  searchBox: { paddingHorizontal: 16, marginTop: -18 },
  searchInput: { backgroundColor: '#fff', padding: 14, borderRadius: 14, fontSize: 14, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  list: { padding: 16, gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, marginBottom: 14 },
  image: { height: 160, width: '100%' },
  cardContent: { padding: 16 },
  verifiedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verifiedBadge: { backgroundColor: '#dcfce7', color: '#166534', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 11, fontWeight: '700' },
  price: { fontSize: 20, fontWeight: '800', color: '#15803d' },
  perKg: { fontSize: 12, fontWeight: '400', color: '#64748b' },
  cropTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a', marginTop: 6 },
  farmerInfo: { fontSize: 12, color: '#475569', marginTop: 3 },
  stock: { fontSize: 11, color: '#64748b', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  callBtn: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', padding: 10, borderRadius: 10, alignItems: 'center' },
  callBtnText: { color: '#0f172a', fontSize: 12, fontWeight: '600' },
  buyBtn: { flex: 1, backgroundColor: '#16a34a', padding: 10, borderRadius: 10, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' }
});
