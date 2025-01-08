import admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "publicentrydevice",
    "private_key_id": "8c4d30d7c288a42d8de0e8123d4ddaf29b0ae524",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5Efb8GKChRryp\n8bCXdijdyas04R5rm2SlGEw5gsdIie0KHttPH7rojAplDyVf2Ydhis0TUlPpCXTh\nI/A+WKIVL1cSOA67povcX2JTNZMlhT4BXvkmieOFSEAWkS48018wZSP9ZsTcW6bk\nS9zmD/3wG5OV2Gts0WNdjA9aqz+lXamyAivIO8XPCCfPiRDFFo8ZUvSH0ceoOKK2\n6U4pAPp+Xrv+UMFhl0zYGaySuHcERkceJcxQfQiJU1R4Dgd6Y2w/TUsFm4qHWnFq\nLOeSTS1hbKP0oDTI6eFXGGj7kdaoQyD9ds2PtzZacbq+14T/5rqOMKFufRkalRso\nCt2p/aqbAgMBAAECggEAPbPJnr8vPtXwrNBRyg2xDlDgbd7oX4QNiCWTtFDv1DV3\n/DnRcI3pqQKXrJ3iHhTOWC0ItnpqU3W9rBppTMAMOffwlbhu4Q1j7/M1OvzPtGC6\nDYb2lmy+mH9ALsX0nn7ya5Ys651J4RYFjHPmkCWgyl7HU9w15K/i6xt5OweBTsZb\nF9q4Qt8hwLda3Iwn5lTgpmp6tuuXKhfbh/p+Agc2+zX3QERuw46uzFRE1nYmkKGL\ngIRkg9wuPhON/ReU/+My1TcX/DWSupw051NFxVUrAS8a2sYidRKJ48OYus9SGVQH\nKArfKBFahZIX2KhtW5f9MUyRMNvOcKqK/+PR+ZTT4QKBgQD4WDmLZ3ppdlcGhFmv\nALbov5thGqnYwmNwX5jZffaPwvjFO9l5wqckOODHx23iBCMbCsUzWjW1cMdIYzLB\n/rwJqvLaGaSiy3KxUwVgxs/hd/pe+yr/edN5jmG8ak9U5A0Ws+84hhusd0tuyeTH\nkQf69HoiuMOrsj6Z5tIeAsg00wKBgQC+xms/I0yK3JqXyv9XDX9RrHeph7+QWfPH\ny6IGP4ShBScW0AN83A555b3WBehpSi7LCn9mLkwsheKtJhudsGvnq9VgmPLFJT8u\nxIGElctqoLXrKLunwzUROIoZhhT3h9L2QGn/Dv22v+xg340W8emKpr6AzVUk/uFS\nqniIkgQ2GQKBgQCRE5ECQ//5zf0GvJhbqHIxw4U0k8v26ZAHnIEBRRmdYAvNxKnF\n/JWBjoyZiIJDj6EmcgNDfYZ0qR5xxilntLUKfMgD6wkHZQxqVJKGt33HPDyR8e5r\ncjK9BxVHaV9Quyx+P70W6xkNhl8VqHGyt6HO07Tpxb/g9G6nn3TNvVhRqwKBgAvV\nQNe0t82xK0GZDMd4hdoqCW4RhndMrQtKfS1ICVD3gdovYtf+ykMTVfgNe8H0IPzl\nFMvguUbVsx6sS3A3finrhZutQPmresTK2YHAzNI7T61bZHBeck80I5S7tVc5LIOr\nsSdp5aDNPLsxgo3WyXaZKx3QHqThzlYTTtChxfMZAoGAWJE1zNtAcPNukNzMVbkF\nJbK2B6qfZUSrlSbYk1Wz6KRGkVNDanD/K+kiz3EE2EtNRC0psJk/q6F5p59VkbB7\nuX6ZqiMuQ0GXYzUrS2avtIbQZ82k3BKoWtNSAjPGOuQPBergnh3cr0AkdbjtIK8v\n1YM1KOWjDEv2DtDrraUEFik=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-kiqev@publicentrydevice.iam.gserviceaccount.com",
    "client_id": "101230311884347522046",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kiqev%40publicentrydevice.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  })
});

export default app;