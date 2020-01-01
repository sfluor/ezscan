importScripts('./test.js');

onmessage = function({data: {img, dst, src_corners}}) {
  postMessage(distort(img, dst, src_corners));
};
