import IDVC from "@idscan/idvc2";

let idvc = new IDVC({
    el: "videoCapturingEl",
    licenseKey: "LICENSE_KEY",
    networkUrl: "networks",
    resizeUploadedImage: 1600,
    useCDN: false,
    fixFrontOrientAfterUpload: true,
    playPreviewAnimations: true,
    allowSubmitWithWarnings: true,
    showSubmitBtn: true,
    autoContinue: true,
    isShowDocumentTypeSelect: true,
    autoStart: true,
    language: "en",
    realFaceMode: "all",
    modalPosition: 'center',
    processingImageFormat: 'jpeg', 
    documentTypes: [
        {
            type: "DL",
            steps: [
                {
                    type: "front",
                    name: "Document's Frontside Image",
                    mode: { uploader: true, video: true },
                    enableDesktopNotification: true,
                },
                {
                    type: "pdf",
                    name: "Document Back",
                    mode: { uploader: true, video: true },
                    enableDesktopNotification: true,
                    enableFourCornerCapture: false,

                },
                {
                    type: "face",
                    name: "Face",
                    mode: { uploader: false, video: true },
                },
            ],
        },
        {
            type: "IC",
            steps: [
                {
                    type: "front",
                    name: "Document's Frontside Image",
                    mode: { uploader: true, video: true },
                    enableDesktopNotification: true,
                },
                {
                    type: "pdf",
                    name: "Document Back",
                    mode: { uploader: true, video: true },
                    enableDesktopNotification: true,
                    enableFourCornerCapture: false,

                },
                {
                    type: "face",
                    name: "Face",
                    mode: { uploader: false, video: true },
                },
            ],
        },
        {
            type: "Passport",
            steps: [
                {
                    type: "mrz",
                    name: "Passport Front",
                },
                {
                    type: "face",
                    name: "Face",
                },
            ],
        },
        {
            type: "PassportCard",
            steps: [
                {
                    type: "front",
                    name: "Passport Card Front",
                },
                {
                    type: "mrz",
                    name: "Passport Card Back",
                },
                {
                    type: "face",
                    name: "Face",
                },
            ],
        },
        {
            type: "EmploymentAuthorization",
            steps: [
                {
                    type: "front",
                    name: "Employment Authorization Front",
                },
                {
                    type: "mrz",
                    name: "Employment Authorization Back",
                },
                {
                    type: "face",
                    name: "Face",
                },
            ],
        },
        {
            type: "GreenCard",
            steps: [
                {
                    type: "front",
                    name: "Green Card Front",
                },
                {
                    type: "mrz",
                    name: "Green Card Back",
                },
                {
                    type: "face",
                    name: "Face",
                },
            ],
        },
        {
            type: "InternationalId",
            steps: [
                {
                    type: "front",
                    name: "International ID Front",
                },
                {
                    type: "back",
                    name: "International ID Back",
                },
                {
                    type: "face",
                    name: "Face",
                },
            ],
        },
        {
            type: "Barcode",
            steps: [
                {
                    type: "barcode",
                    name: "1D Barcode/QR Code",
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
    onMounted(){
        console.log("mounted");
    },
    submit(data) {
            idvc.showSpinner(true);
            let frontStep, pdfStep, backStep, faceStep, mrzStep;
            let frontImage, backImage, faceImage;
            let rawTrackString;
            let metadataObject, captureMethod;

            switch(data.documentType) {
                // Drivers License and Identification Card
                case 1:
                frontStep = data.steps.find((item) => item.type === "front");
                frontImage = frontStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

                pdfStep = data.steps.find((item) => item.type === "pdf");
                backImage = pdfStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

                faceStep = data.steps.find((item) => item.type === "face");
                faceImage = faceStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

                rawTrackString = pdfStep && pdfStep.trackString ? pdfStep.trackString : "";

                break;
          // US and International Passports
          case 2:
                mrzStep = data.steps.find((item) => item.type === "mrz");
                frontImage = mrzStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

                faceStep = data.steps.find((item) => item.type === "face");
                faceImage = faceStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

                rawTrackString = mrzStep && mrzStep.mrzText ? mrzStep.mrzText : "";

                break;
        // US Passport Cards
        case 3:
        // US Green Cards
        case 6:
        // Employment Authorizations
        case 9:
            frontStep = data.steps.find((item) => item.type === "front");
            frontImage = frontStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

            mrzStep = data.steps.find((item) => item.type === "mrz");
            backImage = mrzStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

            faceStep = data.steps.find((item) => item.type === "face");
            faceImage = faceStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

            rawTrackString = mrzStep && mrzStep.mrzText ? mrzStep.mrzText : "";
            break;
        // International IDs
        case 7:
            frontStep = data.steps.find((item) => item.type === "front");
            frontImage = frontStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

            backStep = data.steps.find((item) => item.type === "back");
            backImage = backStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

            faceStep = data.steps.find((item) => item.type === "face");
            faceImage = faceStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

            rawTrackString = backStep && backStep.trackString ? backStep.trackString : "";
            break;
         case 11:
            backStep = data.steps.find((item) => item.type === "barcode");
            backImage = backStep.img.split(/:image\/(jpeg|png|webp);base64,/)[2];

            barcodeText = backStep && backStep.text ? backStep.text : "";
            break;
        default:
        }

        metadataObject = JSON.parse(data.metaData);

        captureMethod = metadataObject.capturedMethod;

        const trackStringArray = rawTrackString.split(".");
        let trackString = trackStringArray[0];
        let barcodeParams = trackStringArray[1];

        let request = {
            frontImageBase64: frontImage,
            backOrSecondImageBase64: backImage,
            faceImageBase64: faceImage,
            documentType: data.documentType,
            trackString: {
                data: trackString,
                barcodeParams: barcodeParams
            },
            overriddenSettings: {
                isOCREnabled: true,
                isBackOrSecondImageProcessingEnabled: true,
                isFaceMatchEnabled: true,
                bothSidedScreeningStrategy: 0
            },
            metadata: {
                userAgent: window.navigator.userAgent,
                frontEndMetadata: data.metaData,
                captureMethod: captureMethod
            }
        };

    return new Promise((resolve, reject) => {
        fetch("https://dvs2.idware.net/api/v4/verify",
        {
            method: "POST",
            headers: {
            Authorization: "Bearer SECRET_KEY",
            "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(request)
        })
        .then((response) => response.json())
        .then((data) => {
            idvc.showSpinner(false);
            console.log(data);
            resolve();
        })
        .catch((err) => {
            idvc.showSpinner(false);
            console.log(err);
            reject();
        });
    });
    },
});
