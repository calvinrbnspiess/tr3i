import usb from 'usb';

export const NXT_VENDOR_ID = 1684;

export const NXT_PRODUCT_ID = 2;

/**
 * Checks whether a given node-usb Device is a NXT brick
 * @param  {Device} device
 * @return {boolean}
 */
export const isNXTBrick = (device) => {
  const { idVendor, idProduct } = device.deviceDescriptor;
  return idVendor === NXT_VENDOR_ID && idProduct === NXT_PRODUCT_ID;
};

export const detectAttachedDevices = () => usb.getDeviceList();

export const filterNXTBricksfromDevices = devices => devices.filter(isNXTBrick);

/**
 * Detect all attached NXT bricks
 * @return {Promise} that resolves found bricks as array
 */
export const detectAttachedBricks = Promise.resolve()
  .then(detectAttachedDevices)
  .then(filterNXTBricksfromDevices);

/**
 * Open connection to a NXT brick and provide I/O endpoints
 * @param  {Device} device valid NXT brick
 * @return {Promise} that resolves a object with the device itself,
 *  an inEndpoint and an outEndpoint
 */
export const openConnection = (device) => new Promise((resolve) => {
  console.info('promising');
  device.open();
  const nxtInterface = device.interfaces[0];
  nxtInterface.claim();
  const { endpoints } = nxtInterface;
  console.info('opening connection ...');
  resolve({
    device,
    type: 'usb',
    outEndpoint: endpoints[1],
    inEndpoint: endpoints[0],
  });
});
