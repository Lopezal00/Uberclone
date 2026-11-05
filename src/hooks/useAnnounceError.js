// Lee en voz alta (VoiceOver / TalkBack) un mensaje de error cuando aparece o cambia.
import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

export default function useAnnounceError(message) {
  useEffect(() => {
    if (message) AccessibilityInfo.announceForAccessibility(message);
  }, [message]);
};
