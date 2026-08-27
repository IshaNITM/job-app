import { useState } from 'react';
import { StyleSheet, Text, View, Button, StatusBar } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* App Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My First Published App</Text>
        <Text style={styles.subtitle}>Hello, Google Play Store!</Text>
      </View>

      {/* Counter Section */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterLabel}>Button Press Count</Text>
        <Text style={styles.counterValue}>{count}</Text>
        <View style={styles.buttonWrapper}>
          <Button
            title="Increment"
            onPress={() => setCount(count + 1)}
            color="#6c63ff"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Reset"
            onPress={() => setCount(0)}
            color="#e74c3c"
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Built with Expo • Ready for Google Play</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#a29bfe',
    textAlign: 'center',
    fontWeight: '500',
  },
  counterContainer: {
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 48,
    width: '100%',
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  counterLabel: {
    fontSize: 14,
    color: '#a29bfe',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    fontWeight: '600',
  },
  counterValue: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#6c63ff',
    marginBottom: 28,
    lineHeight: 88,
  },
  buttonWrapper: {
    width: 180,
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#636e72',
    letterSpacing: 0.3,
  },
});
