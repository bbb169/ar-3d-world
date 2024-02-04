export const getDeviceInfo = async () => {
  try {
    const deviceName = await Device.getDeviceName();
    console.log('Device Name:', deviceName);
  } catch (error) {
    console.error('Error getting device info:', error);
  }
};