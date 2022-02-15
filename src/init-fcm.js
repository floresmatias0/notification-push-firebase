import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

let app;
let messaging;

if (isSupported()) {
    const firebaseConfig = {
        apiKey: "AIzaSyBl-ji7XX2hDsdWbq9rvgKTf4SKKrqtGq0",
        authDomain: "alkemyong-d419d.firebaseapp.com",
        projectId: "alkemyong-d419d",
        storageBucket: "alkemyong-d419d.appspot.com",
        messagingSenderId: "947735171672",
        appId: "1:947735171672:web:002175bb9533915985b02d",
        measurementId: "G-JG759QC3Z7"
    };
    
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
}

export default messaging