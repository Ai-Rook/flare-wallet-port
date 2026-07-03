import ScreenHeader from '../../components/ScreenHeader';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Alert, Switch, TextInput,
} from 'react-native';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';

const MOCK_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f2b3a5f';

const MOCK_TX = [
  { id: 1, action: 'Data Fetch', cost: '$0.002', time: '2m ago', status: '✅' },
  { id: 2, action: 'API Call', cost: '$0.005', time: '15m ago', status: '✅' },
  { id: 3, action: 'Model Inference', cost: '$0.012', time: '1h ago', status: '✅' },
  { id: 4, action: 'Storage Write', cost: '$0.001', time: '3h ago', status: '✅' },
  { id: 5, action: 'Image Gen', cost: '$0.008', time: '5h ago', status: '✅' },
  { id: 6, action: 'Webhook Post', cost: '$0.001', time: '8h ago', status: '⚠️' },
];

const MOCK_AGENTS = [
  { name: 'Rook Agent', status: 'Active', statusColor: '#34C759', spent: '$2.40', icon: '🤖' },
  { name: 'Market Scanner', status: 'Active', statusColor: '#34C759', spent: '$0.85', icon: '📊' },
  { name: 'Trade Executor', status: 'Idle', statusColor: '#8E8E93', spent: '$0.00', icon: '⚡' },
];

const MOCK_ENDPOINTS = [
  { id: 1, url: 'https://api.example.com/v1/data', price: '$0.005', requests: 1284, revenue: '$6.42', status: 'Active' },
  { id: 2, url: 'https://ml-service.io/predict', price: '$0.012', requests: 456, revenue: '$5.47', status: 'Active' },
  { id: 3, url: 'https://cdn.assets.net/fetch', price: '$0.001', requests: 8920, revenue: '$8.92', status: 'Paused' },
];

const MOCK_API_KEYS = [
  { id: 'key_8f3a...2d1c', created: 'Jun 28', lastUsed: '2m ago', status: 'Active' },
  { id: 'key_b7e1...9f4a', created: 'Jun 15', lastUsed: '5d ago', status: 'Inactive' },
];

const MOCK_STATS = { requestsToday: 342, revenueToday: '$4.12', avgResponse: '84ms', successRate: '99.2%' };

const PAYMENT_METHODS = [
  { id: 'x402', label: 'x402 Protocol', desc: 'HTTP 402 pay-per-request' },
  { id: 'ln', label: 'Lightning', desc: 'Bitcoin LN micropayments' },
  { id: 'usdc', label: 'USDC Base', desc: 'Stablecoin on Base L2' },
];

const COMING_SOON = [
  { icon: '🔘', title: 'Payment Buttons', desc: '"Pay with Crypto" buttons for your website' },
  { icon: '🔄', title: 'Auto-Pay Rules', desc: 'Scheduled DCA buys, recurring sends, subscriptions' },
  { icon: '📄', title: 'Invoice Generator', desc: 'Create and track crypto invoices' },
];

export default function AgenticScreen({ navigation }) {
  const [walletAddress] = useState(MOCK_WALLET);
  const [copied, setCopied] = useState(false);

  // x402 Paywall state
  const [endpointUrl, setEndpointUrl] = useState('');
  const [pricePerRequest, setPricePerRequest] = useState('0.005');
  const [selectedMethod, setSelectedMethod] = useState('x402');
  const [requireAuth, setRequireAuth] = useState(true);
  const [rateLimit, setRateLimit] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [proxyCopied, setProxyCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);

  const copyAddress = () => {
    Alert.alert('Address Copied', walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createPaywall = () => {
    if (!endpointUrl.trim()) {
      Alert.alert('Missing URL', 'Enter an endpoint URL to protect');
      return;
    }
    Alert.alert('Paywall Created', `x402 proxy generated for ${endpointUrl}`);
    setShowCreateForm(false);
    setEndpointUrl('');
  };

  const copyProxyUrl = (url) => {
    Alert.alert('Proxy URL Copied', url);
    setProxyCopied(true);
    setTimeout(() => setProxyCopied(false), 2000);
  };

  const copyApiKey = (key) => {
    Alert.alert('API Key Copied', key);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const generateNewKey = () => {
    Alert.alert('API Key Generated', 'New key created. Keep it secret.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader
        pageName="Agentic"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ──────────── x402 Protocol Section ──────────── */}
        <View style={styles.sectionHeader}>
          <View style={styles.x402Badge}>
            <Text style={styles.x402Icon}>⚡</Text>
          </View>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>x402 Protocol</Text>
            <Text style={styles.sectionSub}>HTTP 402 Pay-on-request</Text>
          </View>
        </View>

        {/* Wallet Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>x402 Wallet</Text>
          <Text style={styles.cardDesc}>Connect your wallet for agent-to-agent payments via the x402 protocol.</Text>
          <View style={styles.walletRow}>
            <View style={styles.walletAddress}>
              <Text style={styles.walletLabel}>Connected Address</Text>
              <Text style={styles.walletValue} numberOfLines={1}>0x742d...3a5f</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={copyAddress}>
              <Text style={styles.copyBtnText}>{copied ? '✓' : '📋'}</Text>
            </TouchableOpacity>
          </View>
          <SpringPress onPress={() => Alert.alert('Update Wallet', 'Wallet address update flow coming soon!')}>
            <View style={styles.actionBtn}><Text style={styles.actionBtnText}>Update Wallet Address</Text></View>
          </SpringPress>
        </View>

        {/* ──────────── x402 Paywall Configurator ──────────── */}
        <View style={styles.sectionHeader}>
          <View style={styles.paywallBadge}>
            <Text style={styles.paywallIcon}>🔒</Text>
          </View>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>Paywall Configurator</Text>
            <Text style={styles.sectionSub}>Protect any endpoint, set the price</Text>
          </View>
        </View>

        {/* Live Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{MOCK_STATS.requestsToday}</Text>
            <Text style={styles.statLabel}>Requests Today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{MOCK_STATS.revenueToday}</Text>
            <Text style={styles.statLabel}>Revenue Today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{MOCK_STATS.avgResponse}</Text>
            <Text style={styles.statLabel}>Avg Response</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{MOCK_STATS.successRate}</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        {/* Create New Paywall */}
        {!showCreateForm ? (
          <SpringPress onPress={() => setShowCreateForm(true)}>
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>+ Create New Paywall</Text>
            </View>
          </SpringPress>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>New Paywall</Text>

            {/* Endpoint URL Input */}
            <Text style={styles.fieldLabel}>Endpoint URL</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.textInput}
                value={endpointUrl}
                onChangeText={setEndpointUrl}
                placeholder="https://api.yourservice.com/v1/..."
                placeholderTextColor="#8E8E93"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            {/* Price Per Request */}
            <Text style={styles.fieldLabel}>Price Per Request</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceInputWrap}>
                <Text style={styles.priceDollar}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={pricePerRequest}
                  onChangeText={setPricePerRequest}
                  placeholder="0.005"
                  placeholderTextColor="#8E8E93"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Payment Method */}
            <Text style={styles.fieldLabel}>Payment Method</Text>
            <View style={styles.methodRow}>
              {PAYMENT_METHODS.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.methodCard, selectedMethod === m.id && styles.methodCardActive]}
                  onPress={() => setSelectedMethod(m.id)}
                >
                  <Text style={[styles.methodLabel, selectedMethod === m.id && styles.methodLabelActive]}>{m.label}</Text>
                  <Text style={styles.methodDesc}>{m.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Options */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Require API Key</Text>
              <Switch value={requireAuth} onValueChange={setRequireAuth} trackColor={{ false: '#E5E5EA', true: '#5856D6' }} thumbColor="#FFF" />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Rate Limiting</Text>
              <Switch value={rateLimit} onValueChange={setRateLimit} trackColor={{ false: '#E5E5EA', true: '#5856D6' }} thumbColor="#FFF" />
            </View>

            {/* Create Button */}
            <SpringPress onPress={createPaywall}>
              <View style={styles.createBtn}>
                <Text style={styles.createBtnText}>Create Paywall</Text>
              </View>
            </SpringPress>
            <TouchableOpacity onPress={() => setShowCreateForm(false)} style={styles.cancelLink}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Endpoints */}
        <Text style={styles.sectionTitle2}>Active Endpoints</Text>
        {MOCK_ENDPOINTS.map(ep => (
          <View key={ep.id} style={styles.endpointCard}>
            <View style={styles.endpointRow}>
              <View style={[styles.statusDot, { backgroundColor: ep.status === 'Active' ? '#34C759' : '#8E8E93' }]} />
              <Text style={styles.endpointUrl} numberOfLines={1}>{ep.url}</Text>
            </View>
            <View style={styles.endpointStats}>
              <View style={styles.endpointStat}>
                <Text style={styles.endpointStatLabel}>Price</Text>
                <Text style={styles.endpointStatValue}>{ep.price}</Text>
              </View>
              <View style={styles.endpointStat}>
                <Text style={styles.endpointStatLabel}>Requests</Text>
                <Text style={styles.endpointStatValue}>{ep.requests.toLocaleString()}</Text>
              </View>
              <View style={styles.endpointStat}>
                <Text style={styles.endpointStatLabel}>Revenue</Text>
                <Text style={styles.endpointStatValue}>{ep.revenue}</Text>
              </View>
            </View>
            <View style={styles.endpointActions}>
              <View style={styles.proxyUrlRow}>
                <Text style={styles.proxyUrlLabel}>Proxy:</Text>
                <Text style={styles.proxyUrlValue} numberOfLines={1}>https://x402.cp.io/proxy/{ep.id}</Text>
              </View>
              <TouchableOpacity style={styles.miniCopyBtn} onPress={() => copyProxyUrl(`https://x402.cp.io/proxy/${ep.id}`)}>
                <Text style={styles.miniCopyBtnText}>{proxyCopied ? '✓' : '📋'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* API Keys */}
        <Text style={styles.sectionTitle2}>API Keys</Text>
        {MOCK_API_KEYS.map(key => (
          <View key={key.id} style={styles.keyCard}>
            <View style={styles.keyRow}>
              <View style={[styles.statusDot, { backgroundColor: key.status === 'Active' ? '#34C759' : '#8E8E93' }]} />
              <Text style={styles.keyId}>{key.id}</Text>
              <TouchableOpacity style={styles.miniCopyBtn} onPress={() => copyApiKey(key.id)}>
                <Text style={styles.miniCopyBtnText}>{keyCopied ? '✓' : '📋'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keyMeta}>
              <Text style={styles.keyMetaText}>Created {key.created} · Last used {key.lastUsed}</Text>
              <View style={[styles.keyStatusBadge, { backgroundColor: key.status === 'Active' ? '#E8F8EE' : '#F2F2F7' }]}>
                <Text style={[styles.keyStatusText, { color: key.status === 'Active' ? '#34C759' : '#8E8E93' }]}>{key.status}</Text>
              </View>
            </View>
          </View>
        ))}
        <SpringPress onPress={generateNewKey}>
          <View style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>+ Generate New Key</Text>
          </View>
        </SpringPress>

        {/* ──────────── Coming Soon ──────────── */}
        <Text style={styles.sectionTitle2}>Coming Soon</Text>
        {COMING_SOON.map((item, i) => (
          <View key={i} style={styles.soonCard}>
            <View style={styles.soonLeft}>
              <Text style={styles.soonIcon}>{item.icon}</Text>
              <View style={styles.soonInfo}>
                <Text style={styles.soonTitle}>{item.title}</Text>
                <Text style={styles.soonDesc}>{item.desc}</Text>
              </View>
            </View>
            <View style={styles.soonBadge}>
              <Text style={styles.soonBadgeText}>Soon</Text>
            </View>
          </View>
        ))}

        {/* ──────────── Recent Agent Payments ──────────── */}
        <Text style={styles.sectionTitle2}>Recent Agent Payments</Text>
        {MOCK_TX.map(tx => (
          <View key={tx.id} style={styles.txRow}>
            <View style={styles.txMid}>
              <Text style={styles.txAction}>{tx.action}</Text>
              <Text style={styles.txTime}>{tx.time}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txCost}>{tx.cost}</Text>
              <Text style={styles.txStatus}>{tx.status}</Text>
            </View>
          </View>
        ))}

        {/* Connected Agents */}
        <Text style={styles.sectionTitle2}>Connected Agents</Text>
        {MOCK_AGENTS.map((agent, i) => (
          <View key={i} style={styles.agentCard}>
            <View style={styles.agentLeft}>
              <Text style={styles.agentIcon}>{agent.icon}</Text>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <View style={styles.agentStatusRow}>
                  <View style={[styles.agentDot, { backgroundColor: agent.statusColor }]} />
                  <Text style={[styles.agentStatus, { color: agent.statusColor }]}>{agent.status}</Text>
                </View>
              </View>
            </View>
            <View style={styles.agentRight}>
              <Text style={styles.agentSpent}>{agent.spent}</Text>
              <Text style={styles.agentSpentLabel}>today</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },

  // Section headers
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  x402Badge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#5856D6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  x402Icon: { fontSize: 20 },
  paywallBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1C3040', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  paywallIcon: { fontSize: 18 },
  sectionHeaderText: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  sectionSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  sectionTitle2: { fontSize: 16, fontWeight: '700', color: Colors.text, marginTop: 20, marginBottom: 8 },

  // Generic card
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: Colors.textLight, lineHeight: 18, marginBottom: 16 },

  // Wallet
  walletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#F2F2F7', borderRadius: 10, padding: 12 },
  walletAddress: { flex: 1 },
  walletLabel: { fontSize: 11, color: Colors.textLight, marginBottom: 2 },
  walletValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
  copyBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#5856D6', alignItems: 'center', justifyContent: 'center' },
  copyBtnText: { fontSize: 16, color: '#FFF' },

  // Buttons
  actionBtn: { backgroundColor: '#5856D6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  actionBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  createBtn: { backgroundColor: '#34C759', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  createBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  outlineBtn: { borderWidth: 1, borderColor: '#5856D6', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  outlineBtnText: { color: '#5856D6', fontSize: 14, fontWeight: '600' },
  cancelLink: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { color: '#8E8E93', fontSize: 14 },

  // Stats row
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statBox: { backgroundColor: Colors.surface, borderRadius: 12, padding: 12, flex: 1, marginHorizontal: 3, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textLight, marginTop: 2, textAlign: 'center' },

  // Form fields
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  inputWrap: { backgroundColor: '#F2F2F7', borderRadius: 10, padding: 12, marginBottom: 12 },
  textInput: { fontSize: 14, color: Colors.text },
  priceRow: { flexDirection: 'row', marginBottom: 12 },
  priceInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 10, padding: 12, flex: 1 },
  priceDollar: { fontSize: 16, fontWeight: '600', color: Colors.text, marginRight: 6 },
  priceInput: { fontSize: 16, fontWeight: '500', color: Colors.text, flex: 1 },

  // Payment method
  methodRow: { flexDirection: 'row', marginBottom: 12 },
  methodCard: { flex: 1, backgroundColor: '#F2F2F7', borderRadius: 10, padding: 10, marginHorizontal: 3, alignItems: 'center' },
  methodCardActive: { backgroundColor: '#5856D6' },
  methodLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
  methodLabelActive: { color: '#FFF' },
  methodDesc: { fontSize: 9, color: Colors.textLight, marginTop: 2, textAlign: 'center' },

  // Toggles
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  toggleLabel: { fontSize: 14, color: Colors.text },

  // Endpoints
  endpointCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  endpointRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  endpointUrl: { fontSize: 12, fontWeight: '500', color: Colors.text, flex: 1 },
  endpointStats: { flexDirection: 'row', marginBottom: 8 },
  endpointStat: { flex: 1 },
  endpointStatLabel: { fontSize: 10, color: Colors.textLight },
  endpointStatValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  endpointActions: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C2E', borderRadius: 8, padding: 10 },
  proxyUrlRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  proxyUrlLabel: { fontSize: 10, color: '#8E8E93', marginRight: 4 },
  proxyUrlValue: { fontSize: 11, color: '#B8E986', fontFamily: 'monospace', flex: 1 },
  miniCopyBtn: { width: 32, height: 32, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  miniCopyBtnText: { fontSize: 14, color: '#FFF' },

  // API Keys
  keyCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 8 },
  keyRow: { flexDirection: 'row', alignItems: 'center' },
  keyId: { fontSize: 13, fontWeight: '500', color: Colors.text, flex: 1, fontFamily: 'monospace' },
  keyMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  keyMetaText: { fontSize: 11, color: Colors.textLight, flex: 1 },
  keyStatusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  keyStatusText: { fontSize: 11, fontWeight: '600' },

  // Coming Soon
  soonCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 8 },
  soonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  soonIcon: { fontSize: 24, marginRight: 12 },
  soonInfo: { flex: 1 },
  soonTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  soonDesc: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  soonBadge: { backgroundColor: '#E5E5EA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  soonBadgeText: { fontSize: 11, fontWeight: '600', color: '#8E8E93' },

  // Transactions
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  txMid: { flex: 1 },
  txAction: { fontSize: 14, fontWeight: '500', color: Colors.text },
  txTime: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txCost: { fontSize: 14, fontWeight: '600', color: Colors.text },
  txStatus: { fontSize: 12, marginTop: 2 },

  // Agents
  agentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 8 },
  agentLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  agentIcon: { fontSize: 28, marginRight: 12 },
  agentInfo: { flex: 1 },
  agentName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  agentStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  agentDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  agentStatus: { fontSize: 12, fontWeight: '500' },
  agentRight: { alignItems: 'flex-end' },
  agentSpent: { fontSize: 16, fontWeight: '700', color: Colors.text },
  agentSpentLabel: { fontSize: 11, color: Colors.textLight, marginTop: 1 },
});
