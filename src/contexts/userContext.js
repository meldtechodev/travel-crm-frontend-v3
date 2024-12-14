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

  const { childModule, parentModule } = []
  const [modulePermission, setModulePermission] = useState([])
  const [module, setModule] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const token = await getDecryptedToken();
        const { data } = await axios.get(`${api.baseUrl}/username`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          }
        });
        setUser(data);
        axios.get(`${api.baseUrl}/modules/getall`)
          .then(response => {
            setModule(response.data);
            axios.get(`${api.baseUrl}/designationPermission/getall`)
              .then(res => {
                // console.log(response.data)
                const perm = res.data.filter(item => item.designations.id === user.designation.id);
                const p = perm.map(item => item.permissions)
                let arr = new Set(p.map(item => item.modules.parentId))
                let moduleList = [...arr]

                let subModuleSet = new Set(p.map(items => items.modules.id))

                let subModuleArr = [...subModuleSet]
                // console.log(subModuleArr)

                module.forEach(items => {
                  // console.log(items)
                  if (items.parentId !== 0) {
                    for (let i = 0; i < subModuleArr.length; i++) {
                      if (subModuleArr[i] === items.id) {
                        // console.log(items)
                        let check = childModule.filter(it => it.id === items.id)
                        if (check.length === 0) {
                          // console.log(items)
                          childModule.push(items)
                        }
                      }
                    }
                  }
                })
                module.forEach(items => {
                  if (items.parentId === 0 && (items.moduleName !== 'Quickstart' || items.moduleName !== 'Dashboard')) {
                    for (let i = 0; i < moduleList.length; i++) {
                      if (moduleList[i] === items.id) {
                        let check = parentModule.filter(it => it.id === items.id)
                        if (check.length === 0) {
                          parentModule.push(items)
                        }
                      }
                    }
                  }
                })
                setModulePermission(p)
              })
              .catch(error => console.error(error));

          })
          .catch(error => console.error(error));

        setIsAuthenticated(true);
      }
      catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.clear();
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchUser();
    const modulFetch = () => {

    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return <UserContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, setUser, handleLogout, isLoading, module, modulePermission }}>{children}</UserContext.Provider>;
};

export { UserContext };