import React, { useEffect, useState } from "react";
import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import messaging from "./init-fcm";
import axios from 'axios';

const provider = new GoogleAuthProvider();

const auth = getAuth();

const App = () => {
	const [user, setUser] = useState();

	const verifyToken = async () => {
		let token = await getToken(messaging, {
			vapidKey: process.env.REACT_APP_VAPIDKEY
		});

		localStorage.setItem('Token-fcm', token);
	}

	const requestPermission = () => {
		console.log('Requesting permission...');
		Notification.requestPermission().then((permission) => {
		  if (permission === 'granted') {
			console.log('Notification permission granted.');
			//  TODO(developer): Retrieve a registration token for use with FCM.
			//  In many cases once an app has been granted notification permission,
			//  it should update its UI reflecting this.
			verifyToken()
		  } else {
			console.log('Unable to get permission to notify.');
		  }
		});
	}

	let userLogged = localStorage.getItem('user')

	useEffect(() => {
		if(userLogged) setUser(userLogged)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userLogged])
	
	
	const revokeToken = () => {
    	//  Delete registration token.
		getToken(messaging, {
			vapidKey: process.env.REACT_APP_VAPIDKEY
		})
		.then((currentToken) => {
			deleteToken(currentToken)
			.then(() => {
				console.log("Token deleted.");
				//  Once token is deleted update UI.
				localStorage.clear()
			})
			.catch((err) => {
				console.log("Unable to delete token. ", err);
			});
		})
		.catch((err) => {
			console.log("Error retrieving registration token. ", err);
		});
	};
	const authGoogle = () => {
		signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			localStorage.setItem('Token-auth', token);
			const user = result.user;
			localStorage.setItem('user', JSON.stringify(user));
			// ...
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			console.log(errorCode)
			const errorMessage = error.message;
			console.log(errorMessage)
			// The email of the user's account used.
			const email = error.email;
			console.log(email)
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			console.log(credential)
			// ...
		});
	}

	const pruebaNotificacion = async () => {
		let options = {
			method: 'POST',
			url: 'https://fcm.googleapis.com//v1/projects/alkemyong-d419d/messages:send',
			headers: {
				ContentType: 'application/json',
				Authorization: `bearer ${localStorage.getItem('Token-auth')}` 
			},
			body: {
				"message": {
					"token": `${localStorage.getItem('Token-fcm')}` ,
					"notification": {
					"title": "Background Message Title",
					"body": "Background message body"
					},
					"webpush": {
					"fcm_options": {
						"link": "https://dummypage.com"
					}
					}
				}
			}
		}
		return await axios.request(options)
		.then(res => console.log(res.data))
	}
	
	return (
		<div>
			<div>
				<div>
					<h4>Login with google</h4>
					<button onClick={() => authGoogle()}>Sign in</button>
				</div>

				<div>
					<h4>Registration Token</h4>
					<button onClick={() => revokeToken()}>Delete Token</button>
				</div>

				<div>
					<h4>Needs Permission</h4>
					<button onClick={() => requestPermission()}>Request Permission</button>
				</div>
				{user && (
					<div>
						<h4>Test notification</h4>
						<button onClick={() => pruebaNotificacion()}>Test</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
