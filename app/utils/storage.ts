import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResolveValue } from './socket';

interface StorageKeyDataMap {
    'ipAddress': string;
}

// 存储数据
export const storeData = async (...[key, value]: ResolveValue<StorageKeyDataMap>) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// 获取数据
export const getData = async <T extends keyof StorageKeyDataMap>(key: T): Promise<StorageKeyDataMap[T] | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};