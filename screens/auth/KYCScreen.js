import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert, TextInput, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { AppContext } from '../../context/AppContext';
import KycStepImage from '../../components/KycStepImage';
import api from '../../services/api';

const STEPS = ['Personal Info', 'ID Document', 'Selfie', 'Address Proof', 'Review'];

export default function KYCScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', country: '', phone: '',
    idType: 'passport', idNumber: '', idExpiry: '',
    address: '', city: '', state: '', zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { setLoggedIn } = useContext(AppContext);

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.startVerification();
      await api.submitKycDocument(formData);
      setShowSuccess(true);
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.primaryGradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()}><Text style={styles.backIcon}>‹</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Identity</Text>
        <View style={{ width: 32 }} />
      </LinearGradient>
      {/* Progress indicator */}
      <View style={styles.progressRow}>
        {STEPS.map((s, i) => (
          <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]}>
            {i <= step && <Text style={styles.progressCheck}>✓</Text>}
          </View>
        ))}
      </View>
      <Text style={styles.stepTitle}>{STEPS[step]}</Text>

      {/* Step illustration from Flare reference images */}
      <KycStepImage step={step} />

      <ScrollView style={styles.content}>
        {step === 0 && (
          <>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={formData.firstName} onChangeText={v => updateField('firstName', v)} placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={formData.lastName} onChangeText={v => updateField('lastName', v)} placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput style={styles.input} value={formData.dob} onChangeText={v => updateField('dob', v)} placeholder="MM/DD/YYYY" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Country</Text>
            <TextInput style={styles.input} value={formData.country} onChangeText={v => updateField('country', v)} placeholderTextColor={Colors.textMuted} />
          </>
        )}
        {step === 1 && (
          <>
            <Text style={styles.label}>ID Type</Text>
            <View style={styles.idTypeRow}>
              {['Passport', 'Driver License', 'National ID'].map(t => (
                <TouchableOpacity key={t} style={[styles.idChip, formData.idType === t.toLowerCase().replace(' ', '') && styles.idChipActive]}
                  onPress={() => updateField('idType', t.toLowerCase().replace(' ', ''))}>
                  <Text style={[styles.idChipText, formData.idType === t.toLowerCase().replace(' ', '') && styles.idChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>ID Number</Text>
            <TextInput style={styles.input} value={formData.idNumber} onChangeText={v => updateField('idNumber', v)} placeholderTextColor={Colors.textMuted} />
          </>
        )}
        {step === 2 && (
          <View style={styles.selfieSection}>
            <Text style={styles.selfieText}>Take a clear selfie holding your ID document</Text>
            <TouchableOpacity style={styles.cameraBtn}><Text style={styles.cameraIcon}>📸</Text><Text style={styles.cameraText}>Take Selfie</Text></TouchableOpacity>
          </View>
        )}
        {step === 3 && (
          <>
            <Text style={styles.label}>Street Address</Text>
            <TextInput style={styles.input} value={formData.address} onChangeText={v => updateField('address', v)} placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={formData.city} onChangeText={v => updateField('city', v)} placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>State / Province</Text>
            <TextInput style={styles.input} value={formData.state} onChangeText={v => updateField('state', v)} placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>ZIP / Postal Code</Text>
            <TextInput style={styles.input} value={formData.zip} onChangeText={v => updateField('zip', v)} placeholderTextColor={Colors.textMuted} />
          </>
        )}
        {step === 4 && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewText}>Review your information before submitting.</Text>
            {Object.entries(formData).filter(([, v]) => v).map(([k, v]) => (
              <View key={k} style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</Text>
                <Text style={styles.reviewValue}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => step < 4 ? setStep(step + 1) : handleSubmit()}
          disabled={loading}
        >
          <Text style={styles.nextText}>{loading ? 'Submitting...' : step < 4 ? 'Continue' : 'Submit Verification'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success overlay — matching Account-verify-14.png reference: blue bg, document icon with green check, 'Ok' button */}
      <Modal visible={showSuccess} animationType="fade" transparent={false}>
        <View style={styles.successOverlay}>
          <Image source={require('../../assets/kyc/Account-verify-14.png')} style={styles.successImage} resizeMode="contain" />
          <Text style={styles.successTitle}>Success</Text>
          <Text style={styles.successText}>Your verification documents have been submitted and will be processed within 3 business days.</Text>
          <TouchableOpacity style={styles.successBtn} onPress={() => { setShowSuccess(false); setLoggedIn(true); }}>
            <Text style={styles.successBtnText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, gap: 8 },
  progressDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  progressDotActive: { backgroundColor: Colors.primary },
  progressCheck: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  stepTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  content: { flex: 1, paddingHorizontal: 24 },
  label: { fontSize: 13, color: Colors.textLight, fontWeight: '500', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: Colors.surface, borderRadius: 10, height: 44, paddingHorizontal: 14, fontSize: 15, color: Colors.text, marginBottom: 4 },
  idTypeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  idChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, marginRight: 8, marginBottom: 6 },
  idChipActive: { backgroundColor: Colors.primary },
  idChipText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  idChipTextActive: { color: '#FFF' },
  selfieSection: { alignItems: 'center', paddingTop: 16 },
  selfieText: { fontSize: 14, color: Colors.text, textAlign: 'center', marginBottom: 12 },
  cameraBtn: { backgroundColor: Colors.surface, borderRadius: 16, padding: 24, alignItems: 'center' },
  cameraIcon: { fontSize: 36, marginBottom: 8 },
  cameraText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  reviewSection: { marginBottom: 16 },
  reviewText: { fontSize: 14, color: Colors.text, marginBottom: 12 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  reviewLabel: { fontSize: 13, color: Colors.textLight },
  reviewValue: { fontSize: 13, fontWeight: '600', color: Colors.text },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 24 },
  nextText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  // Success overlay
  successOverlay: { flex: 1, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  successImage: { width: 200, height: 200, marginBottom: 24 },
  successTitle: { color: '#FFF', fontSize: 28, fontWeight: '700', marginBottom: 12 },
  successText: { color: 'rgba(255,255,255,0.85)', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  successBtn: { backgroundColor: '#FFF', borderRadius: 14, height: 52, width: '100%', alignItems: 'center', justifyContent: 'center' },
  successBtnText: { color: Colors.primary, fontSize: 17, fontWeight: '600' },
});
