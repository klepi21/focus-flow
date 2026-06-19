import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';

export function initRevenueCat() {
  if (!REVENUECAT_IOS_KEY || REVENUECAT_IOS_KEY === 'placeholder') return;
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });
    }
  } catch {
    // silently skip — real key needed for purchases to work
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch {
    return false;
  }
}

export async function purchasePremium(plan: 'monthly' | 'annual' = 'annual'): Promise<boolean> {
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = plan === 'annual'
      ? offerings.current?.annual
      : offerings.current?.monthly;
    if (!pkg) return false;
    await Purchases.purchasePackage(pkg);
    return true;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch {
    return false;
  }
}
