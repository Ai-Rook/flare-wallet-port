import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Switch } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices } from '../../services/LivePriceService';
import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon from '../../components/FlareTokenIcon';

// FCC — Flare Confidential Compute demo panel
// Shows how the wallet would use FCC for private/verifiable operations

const FCC_FEATURES = [
  {
    icon: '🔐',
    title: 'Protocol Managed Wallets',
    desc: 'Cross-chain transactions secured by TEE nodes instead of bridges. Funds controlled by verifiable computation, not multisig.',
    status: 'Live on Songbird',
  },
  {
    icon: '🤖',
    title: 'Verifiable AI Agents',
    desc: 'Run trading strategies inside Intel TDX enclaves via GCP Confidential Space. Execution proven on-chain, inputs stay private.',
    status: 'Alpha SDK',
  },
  {
    icon: '🛡️',
    title: 'Private Transaction Screening',
    desc: 'Screen transactions for compliance without exposing wallet history. TEE attestations prove the check ran honestly.',
    status: 'Concept',
  },
  {
    icon: '⚖️',
    title: 'Multi-Agent Consensus',
    desc: 'Multiple AI agents in separate enclaves vote on trade execution. Majority consensus required before any action.',
    status: 'Roadmap',
  },
];

export default function ConfidentialScreen({ navigation }) {
  const { prices, source } = useLivePrices();
  const [teeEnabled, setTeeEnabled] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState('');
  const [attestation, setAttestation] = useState(null);

  const simulateAttestation = () => {
    if (!teeEnabled) return;
    // Simulate a TEE attestation response
    const hash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setAttestation({
      hash,
      timestamp: new Date().toISOString(),
      enclave: 'intel-tdx-gcp',
      status: 'verified',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Confidential" subtitle="Flare Confidential Compute" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* FCC Status Banner */}
        <View style={styles.statusBanner}>
          <Text style={styles.statusIcon}>🔒</Text>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Flare Confidential Compute</Text>
            <Text style={styles.statusDesc}>Verifiable computation via Intel TDX TEEs on GCP Confidential Space</Text>
          </View>
        </View>

        {/* TEE Toggle */}
        <View style={styles.teeCard}>
          <View style={styles.teeHeader}>
            <View>
              <Text style={styles.teeTitle}>Secure Enclave</Text>
              <Text style={styles.teeDesc}>Run wallet logic inside a Trusted Execution Environment</Text>
            </View>
            <Switch
              value={teeEnabled}
              onValueChange={(v) => { setTeeEnabled(v); if (!v) setAttestation(null); }}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={teeEnabled ? '#FFF' : '#FFF'}
            />
          </View>

          {teeEnabled && (
            <View style={styles.teeActive}>
              <View style={styles.teeStatusRow}>
                <Text style={styles.teeStatusDot}>🟢</Text>
                <Text style={styles.teeStatusText}>TEE Session Active</Text>
              </View>
              <Text style={styles.teeDetail}>Enclave: Intel TDX (GCP Confidential Space)</Text>
              <Text style={styles.teeDetail}>Attestation: {attestation ? '✅ Verified' : '⏳ Pending'}</Text>
              <TouchableOpacity style={styles.attestBtn} onPress={simulateAttestation}>
                <Text style={styles.attestBtnText}>Generate Attestation</Text>
              </TouchableOpacity>
              {attestation && (
                <View style={styles.attestResult}>
                  <Text style={styles.attestLabel}>RA-TLS Hash</Text>
                  <Text style={styles.attestHash} selectable>{attestation.hash.slice(0, 20)}...{attestation.hash.slice(-12)}</Text>
                  <Text style={styles.attestTime}>Verified: {new Date(attestation.timestamp).toLocaleString()}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* AI Agent Prompt — runs inside TEE */}
        {teeEnabled && (
          <View style={styles.agentCard}>
            <Text style={styles.agentTitle}>🤖 Private AI Agent</Text>
            <Text style={styles.agentDesc}>Execute trading strategies inside the enclave. Inputs and logic remain confidential. Only the output and attestation are published on-chain.</Text>
            <TextInput
              style={styles.agentInput}
              placeholder="e.g. Swap 0.5 BTC to ETH if BTC > $65,000"
              value={agentPrompt}
              onChangeText={setAgentPrompt}
              multiline
              numberOfLines={2}
              placeholderTextColor={Colors.textMuted}
            />
            <View style={styles.agentActions}>
              <TouchableOpacity style={styles.agentBtn}>
                <Text style={styles.agentBtnText}>Execute in Enclave</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.agentBtnOutline} onPress={() => setAgentPrompt('')}>
                <Text style={styles.agentBtnOutlineText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* FCC Features */}
        <Text style={styles.sectionTitle}>FCC Capabilities</Text>
        {FCC_FEATURES.map((feat, i) => (
          <View key={i} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feat.icon}</Text>
            <View style={styles.featureInfo}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={[styles.featureStatus, feat.status === 'Live on Songbird' && styles.statusLive]}>{feat.status}</Text>
              </View>
              <Text style={styles.featureDesc}>{feat.desc}</Text>
            </View>
          </View>
        ))}

        {/* How FCC Works */}
        <View style={styles.howCard}>
          <Text style={styles.howTitle}>How FCC Works</Text>
          <Text style={styles.howStep}>1. Wallet logic runs inside an Intel TDX TEE on GCP Confidential Space</Text>
          <Text style={styles.howStep}>2. TEE generates a remote attestation proving the code ran unmodified</Text>
          <Text style={styles.howStep}>3. Only the output and attestation hash are published on-chain</Text>
          <Text style={styles.howStep}>4. Inputs, strategy, and wallet state remain confidential</Text>
          <Text style={styles.howStep}>5. Flare data providers validate execution via weighted consensus</Text>
        </View>

        {/* Live Price Context */}
        <Text style={styles.sectionTitle}>Live Market Context</Text>
        <View style={styles.priceRow}>
          {['BTC', 'ETH', 'XRP', 'FLR'].map(sym => {
            const p = prices[sym];
            return (
              <View key={sym} style={styles.priceChip}>
                <FlareTokenIcon symbol={sym} size={20} color={Colors.primary} />
                <Text style={styles.priceChipSym}>{sym}</Text>
                <Text style={styles.priceChipVal}>${p ? p.price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}</Text>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🔥 Flare Confidential Compute · Intel TDX · GCP</Text>
          <Text style={styles.footerVersion}>FCC Alpha · Songbird Canary Network</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },

  // Status banner
  statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  statusIcon: { fontSize: 32, marginRight: 12 },
  statusInfo: { flex: 1 },
  statusTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  statusDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },

  // TEE card
  teeCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  teeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teeTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  teeDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  teeActive: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  teeStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  teeStatusDot: { fontSize: 14, marginRight: 6 },
  teeStatusText: { fontSize: 14, fontWeight: '700', color: Colors.success },
  teeDetail: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  attestBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  attestBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  attestResult: { backgroundColor: Colors.background, borderRadius: 12, padding: 12, marginTop: 8 },
  attestLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  attestHash: { fontSize: 12, color: Colors.text, fontFamily: 'monospace', marginBottom: 4 },
  attestTime: { fontSize: 11, color: Colors.success },

  // Agent card
  agentCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  agentTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  agentDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 12 },
  agentInput: { backgroundColor: Colors.background, borderRadius: 12, padding: 12, fontSize: 14, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: 12, minHeight: 60 },
  agentActions: { flexDirection: 'row', gap: 8 },
  agentBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  agentBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  agentBtnOutline: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  agentBtnOutlineText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },

  // Features
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  featureCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  featureIcon: { fontSize: 24, marginRight: 12 },
  featureInfo: { flex: 1 },
  featureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  featureStatus: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusLive: { color: Colors.success },
  featureDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  // How it works
  howCard: { backgroundColor: Colors.primary + '08', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  howTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  howStep: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8, lineHeight: 18 },

  // Price chips
  priceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  priceChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  priceChipSym: { fontSize: 12, fontWeight: '700', color: Colors.text, marginLeft: 6 },
  priceChipVal: { fontSize: 12, fontWeight: '600', color: Colors.primary, marginLeft: 6 },

  // Footer
  footer: { alignItems: 'center', paddingVertical: 24, marginTop: 16 },
  footerText: { fontSize: 13, fontWeight: '600', color: Colors.primary, marginBottom: 4 },
  footerVersion: { fontSize: 11, color: Colors.textMuted },
});
