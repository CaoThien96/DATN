import lodashCommons from 'containers/commons/lodash_commons';

/**
 *
 * @param inputs
 * @param options
 * @param faceapi
 * @param type
 * @returns {Promise<Array>}
 */
export const handleCropFace = async (
  inputs,
  options,
  faceapi,
  type = 'image',
) => {
  switch (type) {
    case 'image':
      const withFaceDescriptors = lodashCommons.lodashMap(
        inputs,
        input =>
          new Promise(async (resolve, reject) => {
            try {
              const tmp = await faceapi
                .detectSingleFace(input, options)
                .withFaceLandmarks()
                .withFaceDescriptor();
              if (tmp) {
                const face = await faceapi.extractFaces(input, [
                  tmp.alignedRect,
                ]);
                console.log(face[0]);
                resolve({
                  faceHtml: face[0],
                  faceDescriptor: tmp,
                });
              } else reject(new Error('fail'));
            } catch (e) {
              reject(e);
            }
          }),
      );

      return withFaceDescriptors;
    default:
      return [];
  }
};
export const handleExtractFuture = (inputs, faceapi) => {};
