import IDVC from "@idscan/idvc2";
import "../node_modules/@idscan/idvc2/dist/css/idvc.css";

let idvc = new IDVC({
  el: "videoCapturingEl",
  licenseKey: "LICENSE_KEY",
  networkUrl: "networks",
  resizeUploadedImage: 1600,
  fixFrontOrientAfterUpload: true,
  autoContinue: true,
  isShowDocumentTypeSelect: true,
  realFaceMode: "auto",
  useCDN: true,
  language: "en",
  isShowGuidelinesButton: true,
  documentTypes: [
    {
      type: "ID",
      steps: [
        {
          type: "front",
          name: "Document Front",
          mode: { uploader: true, video: true },
        },
        {
          type: "pdf",
          name: "Document PDF417 Barcode",
          mode: { uploader: true, video: true },
        },
        {
          type: "face",
          name: "Face",
          mode: { uploader: true, video: true },
        },
      ],
    },
    {
      type: "Passport",
      steps: [
        {
          type: "mrz",
          name: "Passport Front",
          mode: { uploader: true, video: true },
        },
        {
          type: "face",
          name: "Face",
          mode: { uploader: true, video: true },
        },
      ],
    },
  ],
  onChange(data) {
    console.log("on change", data);
  },
  onCameraError(data) {
    console.log("camera error", data);
  },
  onReset(data) {
    console.log("on reset", data);
  },
  onRetakeHook(data) {
    console.log("retake hook", data);
  },
  clickGuidlines() {
    console.log("click Guidelines");
  },
  submit(data) {
    idvc.showSpinner(true);
    let frontStep, pdfStep, faceStep, mrzStep, photoStep, barcodeStep;
    let frontImage, backImage, faceImage, photoImage, barcodeImage;
    let trackString;
    let captureMethod;
    let verifyFace = true;

    switch (data.documentType) {
      // Drivers License and Identification Card
      case 1:
        frontStep = data.steps.find((item) => item.type === "front");
        pdfStep = data.steps.find((item) => item.type === "pdf");
        faceStep = data.steps.find((item) => item.type === "face");

        frontImage = frontStep.img.split(/:image\/(jpeg|png);base64,/)[2];
        backImage = pdfStep.img.split(/:image\/(jpeg|png);base64,/)[2];
        faceImage = faceStep.img.split(/:image\/(jpeg|png);base64,/)[2];

        trackString = pdfStep && pdfStep.trackString ? pdfStep.trackString : "";

        captureMethod =
          JSON.stringify(+frontStep.isAuto) +
          JSON.stringify(+pdfStep.isAuto) +
          JSON.stringify(+faceStep.isAuto);

        break;
      // US and International Passports
      case 2:
        mrzStep = data.steps.find((item) => item.type === "mrz");
        faceStep = data.steps.find((item) => item.type === "face");

        frontImage = mrzStep.img.split(/:image\/(jpeg|png);base64,/)[2];
        faceImage = faceStep.img.split(/:image\/(jpeg|png);base64,/)[2];

        trackString = mrzStep && mrzStep.mrzText ? mrzStep.mrzText : "";

        captureMethod =
          JSON.stringify(+mrzStep.isAuto) + JSON.stringify(+faceStep.isAuto);

        break;
      // US Passport Cards
      case 3:
      // US Green Cards
      case 6:
      // International IDs with 3 line MRZs
      case 7:
        frontStep = data.steps.find((item) => item.type === "front");
        mrzStep = data.steps.find((item) => item.type === "mrz");
        faceStep = data.steps.find((item) => item.type === "face");

        frontImage = frontStep.img.split(/:image\/(jpeg|png);base64,/)[2];
        backImage = mrzStep.img.split(/:image\/(jpeg|png);base64,/)[2];
        faceImage = faceStep.img.split(/:image\/(jpeg|png);base64,/)[2];

        trackString = mrzStep && mrzStep.mrzText ? mrzStep.mrzText : "";

        captureMethod =
          JSON.stringify(+frontStep.isAuto) +
          JSON.stringify(+mrzStep.isAuto) +
          JSON.stringify(+faceStep.isAuto);

        break;
      case 8:
        photoStep = data.steps.find((item) => item.type === "photo");
        photoImage = photoStep.img.split(/:image\/(jpeg|png);base64,/)[2];
        captureMethod = JSON.stringify(+photoStep.isAuto);
        verifyFace = false;
        break;
      case 9:
        barcodeStep = data.steps.find((item) => item.type === "barcode");
        barcodeImage = barcodeStep.img.split(/:image\/(jpeg|png);base64,/)[2];
        captureMethod = JSON.stringify(+barcodeStep.isAuto);
        verifyFace = false;
        break;
      default:
    }

    let request = {
      frontImageBase64: frontImage,
      backOrSecondImageBase64: backImage,
      faceImageBase64: faceImage,
      documentType: data.documentType,
      trackString: trackString,
      ssn: null,
      overriddenSettings: null,
      userAgent: window.navigator.userAgent,
      captureMethod: captureMethod,
      verifyFace: verifyFace,
    };

    fetch("https://dvs2.idware.net/api/v3/Verify", {
      method: "POST",
      headers: {
        Authorization: "Bearer SECRET_KEY",
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((data) => {
        idvc.showSpinner(false);
        console.log(data);
      })
      .catch((err) => {
        idvc.showSpinner(false);
        console.log(err);
      });
  },
});
