import IDVC from '@idscan/idvc';
import '../node_modules/@idscan/idvc/dist/css/idvc.css';




new IDVC({
    el: 'videoCapturingEl',
    networkUrl: '/assets/networks',
    licenseKey: 'LICENSE KEY REPLACE ME',
    types: ['ID'],
    showSubmitBtn: false,
    enableLimitation: false,
    autoContinue : true,
    isShowVersion : false,
    tapBackSide : true,
    tapFace : true,
    realFaceMode : 'all',
    steps: [
        {type: 'front', name: 'Front Scan'},
        {type: 'face', name: 'Selfie'}
    ],
    onChange (event) {
         console.log(event.step);
    },
    submit (data) {
        let backStep = data.steps.find(item => item.type === 'back')
        let trackString = (backStep && backStep.trackString) ? backStep.trackString : ''

        let request = {
            frontImageBase64: data.steps.find (item => item.type === 'front').img.split (/:image\/(jpeg|png);base64,/)[2],
            backOrSecondImageBase64: backStep.img.split (/:image\/(jpeg|png);base64,/)[2],
            faceImageBase64: data.steps.find (item => item.type === 'face').img.split (/:image\/(jpeg|png);base64,/)[2],
            documentType: data.documentType,
            trackString: trackString
        }
        
        fetch ('https://dvs2.idware.net/api/Request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': 'BEARER TOKEN  REPLACE ME' 
            },
            body: JSON.stringify (request)
        }).then (response => response.json ())
            .then (response => {
                fetch ( 'BACKEND SERVER URL REPLACE ME', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify ({
                        requestId: response.requestId,
                        documentType: response.documentType
                    })
                }).then (response => response.json ())
                    .then (data => {
                        
                        alert((data.payload.isDocumentSuccess) ? 'Document valid' : 'Document invalid')
                    })
            }).catch(() => {
            
        })
    }
    });
