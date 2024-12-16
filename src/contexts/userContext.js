import axios from 'axios';
import { useEffect, useState, createContext } from 'react';
import api from '../apiConfig/config';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState();
  const [countryDetails, setCountryDetails] = useState([])
  const [stateDetails, setStateDetails] = useState([])
  const [destinationDetails, setDestinationDetails] = useState([])

  const navigate = useNavigate();

  async function decryptToken(encryptedToken, key, iv) {
    const dec = new TextDecoder();

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedToken
    );

    return dec.decode(new Uint8Array(decrypted));
  }

  // Function to retrieve and decrypt the token
  async function getDecryptedToken() {
    const keyData = JSON.parse(localStorage.getItem("encryptionKey"));
    const ivBase64 = localStorage.getItem("iv");
    const encryptedTokenBase64 = localStorage.getItem("encryptedToken");

    if (!keyData || !ivBase64 || !encryptedTokenBase64) {
      throw new Error("No token found");
    }

    // Convert back from base64
    const key = await crypto.subtle.importKey(
      "jwk",
      keyData,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
    const iv = new Uint8Array(
      atob(ivBase64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const encryptedToken = new Uint8Array(
      atob(encryptedTokenBase64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    return await decryptToken(encryptedToken, key, iv);
  }

  useEffect(() => {

    getDecryptedToken()
      .then(async (token) => {
        return await axios.get(`${api.baseUrl}/username`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then((response) => {
            setUser(response.data);
            setIsAuthenticated(true)

          })
          .catch(error => {
            console.error("token expired ", error);
            navigate('/login');
            setIsAuthenticated(false)
          });
      })
      .catch(error => console.error('Error fetching user:', error));


    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setIpAddress(response.data)
      })
      .catch((error) => {
        console.error('Error fetching IP address:', error);
      });

    axios.get(`${api.baseUrl}/country/getallcountry`)
      .then(response => {
        const formattedOptions = response.data.map(item => ({
          ...item,
          value: item.id, // or any unique identifier
          label: item.countryName // or any display label you want
        }));
        setCountryDetails(formattedOptions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios.get(`${api.baseUrl}/state/getAllState`)
      .then(response => {
        const formattedOptions = response.data.map(item => ({
          ...item,
          value: item.id, // or any unique identifier
          label: item.stateName // or any display label you want
        }));
        setStateDetails(formattedOptions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    axios.get(`${api.baseUrl}/destination/getall`)
      .then(response => {
        const formattedOptions = response.data.content.map(item => ({
          ...item,
          value: item.id,
          label: item.destinationName
        }));
        setDestinationDetails(formattedOptions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

  }, []);


  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return <UserContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, setUser, handleLogout, isLoading, ipAddress, countryDetails, stateDetails, destinationDetails }}>{children}</UserContext.Provider>;
};

export { UserContext };