import axios from 'axios';
import { useEffect, useState, createContext } from 'react';
import api from '../apiConfig/config';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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


  const [module, setModule] = useState([])
  const [countryDetails, setCountryDetails] = useState([])
  const [stateDetails, setStateDetails] = useState([])
  const [destinationDetails, setDestinationDetails] = useState([])
  const [ipAddress, setIpAddress] = useState()

  useEffect(() => {
    getDecryptedToken()
      .then(async (token) => {
        setIsLoading(true)
        return await axios.get(`${api.baseUrl}/username`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then(response => {
            const u = response.data
            setUser(response.data);
            setIsAuthenticated(true)
            // console.log(u)

            axios.get(`${api.baseUrl}/designationModules/getall`)
              .then(res => {
                // setDesignationModules(res.data)
                let mod = res.data.filter(item => item.designations.id === u.designation.id)
                let filtmod = mod.map(item => item.modules)
                setModule(filtmod)
              })
              .catch(error => console.error(error));

          })
          .catch(error => console.error(error))
      })
      .catch(error => console.error('Error fetching protected resource:', error))
      .finally(() => {
        setIsLoading(false)
      })

    axios.get(`${api.baseUrl}/ipAddress`)
      .then(response => setIpAddress(response.data))
      .catch((error) => {
        console.error('Error fetching Room Type Name data :', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${api.baseUrl}/state/getAllState`)
      .then(response => {
        const format = response.data.map(item => ({
          ...item,
          label: item.stateName,
          value: item.id
        }))
        setStateDetails(format);
      })
      .catch((error) => {
        console.error('Error fetching Room Type Name data :', error);
      });
  }, [])

  useEffect(() => {
    axios.get(`${api.baseUrl}/country/getallcountry`)
      .then(response => {
        const format = response.data.map(item => ({
          ...item,
          label: item.countryName,
          value: item.id
        }))
        setCountryDetails(format);
      })
      .catch((error) => {
        console.error('Error fetching Room Type Name data :', error);
      });
  }, [])

  useEffect(() => {
    axios.get(`${api.baseUrl}/destination/getallDestination`)
      .then(response => {
        const format = response.data.map(item => ({
          ...item,
          label: item.destinationName,
          value: item.id
        }))
        setDestinationDetails(format);
      })
      .catch((error) => {
        console.error('Error fetching Room Type Name data :', error);
      });
  }, [])

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return <UserContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, setUser, handleLogout, isLoading, module, destinationDetails, countryDetails, stateDetails, ipAddress }}>{children}</UserContext.Provider>;
};

export { UserContext };