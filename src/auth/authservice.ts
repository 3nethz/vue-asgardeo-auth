// The SDK provides a client that can be used to carry out the authentication.
import { AsgardeoAuthClient, type AuthClientConfig, type DefaultAuthClientConfig } from "@asgardeo/auth-js";
import { jwtVerify as joseJwtVerify, importJWK } from "jose";
import { Buffer } from "buffer";

// Create a config object containing the necessary configurations.
const config: AuthClientConfig<DefaultAuthClientConfig>= {
  signInRedirectURL: "http://localhost:5173/",
  signOutRedirectURL: "http://localhost:5173/",
  clientID: "DlhbfqNZEP0CGRN2933Aa1cwoAMa",
  baseUrl: "https://api.asgardeo.io/t/thineth6424",
  enablePKCE: false,
  scope: ["openid" , "profile"]
};

// Create a Store class to store the authentication data. The following implementation uses the session storage.
class SessionStore {
  // Saves the data to the store.
  async setData(key, value) {
    sessionStorage.setItem(key, value);
  }

  // Gets the data from the store.
  async getData(key) {
    return sessionStorage.getItem(key);
  }

  // Removes the date from the store.
  async removeData(key) {
    sessionStorage.removeItem(key);
  }
}

//
// class CryptoUtils {
//   // Encodes a Uint8Array into a base64 URL-safe string
//   base64URLEncode(value) {
//     let binary = "";
//     const bytes = new Uint8Array(value);
//     for (const byte of bytes) {
//       binary += String.fromCharCode(byte);
//     }
//     return btoa(binary)
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");
//   }

//   // Decodes a base64 URL-safe string into a Uint8Array
//   base64URLDecode(value) {
//     const padded =
//       value.replace(/-/g, "+").replace(/_/g, "/") +
//       "===".slice(0, (3 - (value.length % 4)) % 4);

//     const binary = atob(padded);
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) {
//       bytes[i] = binary.charCodeAt(i);
//     }
//     return bytes;
//   }

//   // Hashes data using SHA-256 (returns Promise<Uint8Array>)
//   async hashSha256(data) {
//     const encoder = new TextEncoder();
//     const encodedData = encoder.encode(data);
//     const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
//     return new Uint8Array(hashBuffer);
//   }

//   // Generates cryptographically secure random bytes
//   generateRandomBytes(length) {
//     const array = new Uint8Array(length);
//     window.crypto.getRandomValues(array);
//     return array;
//   }

//   // Verifies the JWT signature.
//   public verifyJwt(
//     idToken,
//     jwk,
//     algorithms,
//     clientID,
//     issuer,
//     subject,
//     clockTolerance
//   ) {
//     // Parses the key object into a format that would be accepted by verifyJwt()
//     const key = parseJwk(jwk);

//     return jwtVerify(idToken, key, {
//       algorithms: algorithms,
//       audience: clientID,
//       clockTolerance: clockTolerance,
//       issuer: issuer,
//       subject: subject,
//     });
//   }
// }

class CryptoUtils {
  public base64URLEncode(value) {
    return Buffer.from(value)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  // Decodes the base64 URL encoded string into the original data.
  public base64URLDecode(value) {
    return Buffer.from(value, "base64").toString("utf-8");
  }

  // Hashes data using SHA-256 (returns Promise<Uint8Array>)
  async hashSha256(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
    return new Uint8Array(hashBuffer);
  }

  // Generates cryptographically secure random bytes
  generateRandomBytes(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return array;
  }

  // Verifies the JWT signature.
  async verifyJwt(
    idToken,
    jwk,
    algorithms,
    clientID,
    issuer,
    subject,
    clockTolerance
  ) {
    // Parses the key object into a format that would be accepted by verifyJwt()
    const key = await importJWK(jwk, algorithms[0]);

    const { payload } = await joseJwtVerify(idToken, key, {
      algorithms: algorithms,
      audience: clientID,
      clockTolerance: clockTolerance,
      issuer: issuer,
      subject: subject,
    });

    return payload;
  }
}

// Instantiate the SessionStore class
const store = new SessionStore();

// Instantiate the CryptoUtils class
const cryptoUtils = new CryptoUtils();

// Instantiate the AsgardeoAuthClient and pass the store object as an argument into the constructor.
const auth = new AsgardeoAuthClient();

// Initialize the instance with the config object.
auth.initialize(config, store, cryptoUtils);

// To get the authorization URL, simply call this method.
// auth
//   .getAuthorizationURL()
//   .then((url) => {
//     // Redirect the user to the authentication URL. If this is used in a browser,
//     // you may want to do something like this:
//     window.location.href = url;
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// Once you obtain the authentication code and the session state from the server, you can use this method
// to get the access token.
// auth
//   .requestAccessToken("code", "session-state", "state")
//   .then((response) => {
//     // Obtain the token and other related from the response;
//     console.log(response);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

async function jwtVerify(
  idToken: string,
  jwk: any,
  options: {
    algorithms: string[];
    audience: string;
    clockTolerance: number;
    issuer: string;
    subject: string;
  }
) {
  try {
    const key = await importJWK(jwk, options.algorithms[0]);
    const { payload } = await joseJwtVerify(idToken, key, {
      algorithms: options.algorithms,
      audience: options.audience,
      clockTolerance: options.clockTolerance,
      issuer: options.issuer,
      subject: options.subject,
    });
    return payload;
  } catch (error) {
    throw new Error(`JWT verification failed: ${error.message}`);
  }
}

export { auth, cryptoUtils, store, config };
